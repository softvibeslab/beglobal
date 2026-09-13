"""Actual local ASGI app + synthetic membership boundary. No external accounts."""
import copy
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import unittest

from fastapi.testclient import TestClient
from jsonschema import Draft7Validator, Draft202012Validator, FormatChecker

import workspace as w

ROOT = Path(__file__).resolve().parents[2]
ORIGIN = "http://127.0.0.1"
INTENT = {"Origin": ORIGIN, "X-Workspace-Intent": "fixture-demo"}


def json_schema(value):
    if isinstance(value, list):
        return [json_schema(item) for item in value]
    if not isinstance(value, dict):
        return value
    result = {key: json_schema(item) for key, item in value.items() if key != "nullable"}
    if value.get("nullable") and "type" in result:
        result["type"] = [result["type"], "null"]
    return result


class Clock:
    def __init__(self):
        self.now = 1800000000

    def __call__(self):
        return self.now


class WorkspaceTests(unittest.TestCase):
    def setUp(self):
        self.clock = Clock()
        self.app = w.create_app(environment="test", fixtures_enabled=True, clock=self.clock)
        self.client = TestClient(self.app, base_url=ORIGIN)

    def tearDown(self):
        self.client.close()

    def start(self, persona="lucia", scenario="active_creador", client=None):
        client = client or self.client
        response = client.post("/demo/v1/session", json={"persona": persona, "scenario": scenario}, headers=INTENT)
        self.assertEqual(response.status_code, 200, response.text)
        return response

    def change(self, scenario):
        response = self.client.post("/demo/v1/scenario", json={"scenario": scenario}, headers=INTENT)
        self.assertEqual(response.status_code, 200)

    def get_access(self):
        response = self.client.get("/api/v1/businesses/demo_nube/access")
        self.assertEqual(response.status_code, 200, response.text)
        return response.json()["data"]

    def test_default_fixtures_are_disabled(self):
        with TestClient(w.create_app(environment="test"), base_url=ORIGIN) as client:
            self.assertFalse(client.get("/demo/v1/config").json()["data"]["fixturesEnabled"])
            response = client.post("/demo/v1/session", json={"persona": "lucia", "scenario": "active_creador"}, headers=INTENT)
            self.assertEqual(response.status_code, 404)
            self.assertEqual(client.get("/demo/v1/workspace").status_code, 401)

    def test_staging_production_and_unknown_environments_refused(self):
        for environment in ("staging", "production", "prod", "", "Development"):
            for enabled in (False, True):
                with self.subTest(environment=environment, fixtures=enabled), self.assertRaises(ValueError):
                    w.create_app(environment=environment, fixtures_enabled=enabled)

    def test_cli_refuses_production_before_listening(self):
        for environment in ("staging", "production"):
            with self.subTest(environment=environment):
                result = subprocess.run([sys.executable, str(w.HERE / "workspace.py"), "--fixtures", "--port", "19799"], env={**os.environ, "BEGLOBAL_ENV": environment}, capture_output=True, text=True, timeout=5)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("local-only", result.stderr)
                self.assertNotIn("Uvicorn running", result.stderr)

    def test_no_session_is_distinct_from_membership(self):
        response = self.client.get("/demo/v1/workspace")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["code"], "SESSION_REQUIRED")
        self.assertNotIn("membershipStatus", response.text)

    def test_profile_comes_from_bound_session(self):
        self.start()
        profile = self.client.get("/api/v1/businesses/demo_nube/profile").json()["data"]
        self.assertEqual((profile["personId"], profile["businessId"]), ("demo_lucia", "demo_nube"))
        self.assertEqual(profile["revision"], 1)

    def test_two_persons_are_isolated(self):
        self.start()
        with TestClient(self.app, base_url=ORIGIN) as other:
            self.start("diego", "active_negocio", other)
            self.assertEqual(other.get("/demo/v1/workspace").json()["data"]["profile"]["personId"], "demo_diego")
            response = self.client.get("/api/v1/businesses/demo_brisa/profile")
            self.assertEqual(response.status_code, 404)
            for forbidden in ("Diego", "Tienda Brisa", "pro_negocio", "demo_diego"):
                self.assertNotIn(forbidden, response.text)
            self.assertEqual(other.get("/api/v1/businesses/demo_nube/profile").status_code, 404)

    def test_foreign_and_missing_objects_have_same_error_shape(self):
        self.start()
        foreign = self.client.get("/api/v1/businesses/demo_brisa/profile").json()
        missing = self.client.get("/api/v1/businesses/missing/profile").json()
        foreign.pop("requestId"); missing.pop("requestId")
        self.assertEqual(foreign, missing)

    def test_client_cannot_supply_authority_fields(self):
        for field in ("personId", "businessId", "role", "tier", "allowed", "verified", "apiKey"):
            with self.subTest(field=field):
                response = self.client.post("/demo/v1/session", json={"persona": "lucia", "scenario": "active_creador", field: "SYNTHETIC_FORBIDDEN_VALUE"}, headers=INTENT)
                self.assertEqual(response.status_code, 422)
                self.assertNotIn("SYNTHETIC_FORBIDDEN_VALUE", response.text)

    def test_unknown_fixture_not_created(self):
        response = self.client.post("/demo/v1/session", json={"persona": "lucia", "scenario": "always_admin"}, headers=INTENT)
        self.assertEqual(response.status_code, 422)
        self.assertEqual(len(self.app.state.sessions), 0)

    def test_query_authority_does_not_escalate(self):
        self.start()
        for query in ("role=corporate", "personId=demo_diego", "agentPlan=pro_negocio"):
            self.assertEqual(self.client.get("/api/v1/businesses/demo_nube/profile?" + query).status_code, 422)

    def test_session_token_is_opaque_httponly_not_in_json(self):
        response = self.start()
        token = self.client.cookies.get(w.COOKIE)
        self.assertGreaterEqual(len(token), 40)
        self.assertIn("HttpOnly", response.headers["set-cookie"])
        self.assertIn("SameSite=strict", response.headers["set-cookie"])
        self.assertNotIn("domain=", response.headers["set-cookie"].lower())
        self.assertNotIn(token, response.text)
        self.assertIn(hashlib.sha256(token.encode()).hexdigest(), self.app.state.sessions)
        self.assertNotIn(token, self.app.state.sessions)

    def test_session_expiry_denies_next_request(self):
        self.start()
        self.clock.now += w.SESSION_TTL
        response = self.client.get("/demo/v1/workspace")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["code"], "SESSION_REQUIRED")

    def test_old_session_invalidated_when_switching_persona(self):
        self.start()
        old = self.client.cookies.get(w.COOKIE)
        self.start("diego")
        with TestClient(self.app, base_url=ORIGIN) as stale:
            stale.cookies.set(w.COOKIE, old)
            self.assertEqual(stale.get("/demo/v1/workspace").status_code, 401)

    def test_logout_revokes_session_server_side(self):
        self.start()
        token = self.client.cookies.get(w.COOKIE)
        self.assertEqual(self.client.post("/demo/v1/logout", json={}, headers=INTENT).status_code, 200)
        self.client.cookies.set(w.COOKIE, token)
        self.assertEqual(self.client.get("/demo/v1/workspace").status_code, 401)

    def test_academic_plan_and_role_are_independent(self):
        for scenario in ("active_agente", "active_creador", "active_negocio"):
            with self.subTest(scenario=scenario):
                self.start(scenario=scenario)
                value = self.client.get("/demo/v1/workspace").json()["data"]
                self.assertEqual(value["access"]["agentPlan"], w.SCENARIOS[scenario][2])
                self.assertEqual(value["access"]["membershipStatus"], "active")
                self.assertEqual(value["context"]["roles"], ["member"])
                self.assertTrue(value["context"]["syntheticOnly"])
                self.assertNotIn("team", value["access"]["capabilities"])
                self.assertNotIn("corporate", value["access"]["capabilities"])

    def test_expired_membership_does_not_end_profile_or_plan(self):
        self.start(scenario="expired_negocio")
        access = self.get_access()
        self.assertEqual(access["agentPlan"], "pro_negocio")
        self.assertEqual(access["membershipStatus"], "expired")
        self.assertFalse(access["canReadPro"])
        self.assertEqual(self.client.get("/demo/v1/workspace").status_code, 200)
        self.assertEqual(self.client.get("/api/v1/businesses/demo_nube/resources/demo-pro").status_code, 403)

    def test_unconfigured_timeout_mismatch_fail_closed(self):
        for scenario, reason in (("unavailable_creador", "PROVIDER_NOT_CONFIGURED"), ("timeout_creador", "PROVIDER_TIMEOUT"), ("mismatch_negocio", "MEMBER_MISMATCH")):
            with self.subTest(scenario=scenario):
                self.start(scenario=scenario)
                access = self.get_access()
                self.assertFalse(access["canReadPro"])
                self.assertEqual(access["reason"], reason)
                self.assertNotIn("demo.pro.read", access["capabilities"])
                self.assertEqual(self.client.get("/demo/v1/workspace").status_code, 200)
                self.assertEqual(self.client.get("/api/v1/businesses/demo_nube/resources/demo-pro").status_code, 503)

    def test_revocation_invalidates_previously_allowed_resource(self):
        self.start(scenario="active_negocio")
        url = "/api/v1/businesses/demo_nube/resources/demo-pro"
        self.assertEqual(self.client.get(url).status_code, 200)
        self.change("revoked_agente")
        self.assertEqual(self.client.get(url).status_code, 403)
        self.assertFalse(self.get_access()["canReadPro"])

    def test_expiration_rechecked_without_new_login(self):
        self.start()
        self.assertTrue(self.get_access()["canReadPro"])
        self.change("expired_negocio")
        self.assertFalse(self.get_access()["canReadPro"])

    def test_grant_revocation_is_not_membership_error(self):
        self.start()
        self.change("no_grant")
        response = self.client.get("/demo/v1/workspace")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["code"], "BUSINESS_ACCESS_DENIED")
        self.assertNotIn("Lucía", response.text)

    def test_no_fake_progress_or_history(self):
        self.start()
        value = self.client.get("/demo/v1/workspace").json()["data"]
        self.assertEqual(value["missions"], [])
        self.assertEqual(value["history"], [])
        self.assertIsNone(value["progress"]["percent"])
        self.assertIsNone(value["progress"]["routeVersion"])
        self.assertEqual(value["progress"]["required"], 0)

    def test_notice_conforms_to_existing_typed_card_contract(self):
        self.start()
        value = self.client.get("/demo/v1/workspace").json()["data"]["notice"]
        contract = json.loads((ROOT / "SPECS/contracts/ui-card.schema.json").read_text())
        Draft202012Validator(contract).validate(value)
        invalid = {**value, "html": "<script>test</script>"}
        self.assertFalse(Draft202012Validator(contract).is_valid(invalid))

    def test_live_profile_access_and_errors_match_spec_shapes(self):
        self.start()
        document = json_schema(json.loads((ROOT / "SPECS/contracts/openapi.json").read_text()))
        for path, method, response_code, request_path in (
            ("/api/v1/businesses/{businessId}/profile", "get", "200", "/api/v1/businesses/demo_nube/profile"),
            ("/api/v1/businesses/{businessId}/access", "get", "200", "/api/v1/businesses/demo_nube/access"),
            ("/api/v1/businesses/{businessId}/profile", "get", "404", "/api/v1/businesses/demo_brisa/profile"),
        ):
            with self.subTest(path=path, code=response_code):
                schema = copy.deepcopy(document["paths"][path][method]["responses"][response_code]["content"]["application/json"]["schema"])
                schema["components"] = document["components"]
                response = self.client.get(request_path)
                self.assertEqual(response.status_code, int(response_code))
                Draft7Validator(schema, format_checker=FormatChecker()).validate(response.json())

    def test_private_and_error_responses_have_security_headers(self):
        for path in ("/", "/demo/v1/workspace", "/assets/app.js", "/not-present"):
            response = self.client.get(path)
            for name, expected in w.HEADERS.items():
                self.assertEqual(response.headers[name], expected)
            self.assertTrue(response.headers["x-request-id"].startswith("req_"))

    def test_foreign_origin_and_missing_intent_denied(self):
        body = {"persona": "lucia", "scenario": "active_creador"}
        for headers in ({}, {"Origin": "https://evil.invalid", "X-Workspace-Intent": "fixture-demo"}, {"Origin": ORIGIN}):
            with self.subTest(headers=headers):
                self.assertEqual(self.client.post("/demo/v1/session", json=body, headers=headers).status_code, 403)
        self.assertEqual(len(self.app.state.sessions), 0)

    def test_non_loopback_host_denied(self):
        response = self.client.get("/", headers={"Host": "evil.invalid"})
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["code"], "LOCAL_ONLY")

    def test_non_loopback_peer_cannot_spoof_forwarding_headers(self):
        with TestClient(self.app, base_url=ORIGIN, client=("203.0.113.5", 4000)) as remote:
            response = remote.get("/", headers={"X-Forwarded-For": "127.0.0.1"})
            self.assertEqual(response.status_code, 403)

    def test_payload_limit_and_sanitized_error(self):
        response = self.client.post("/demo/v1/session", content="SYNTHETIC_SECRET" * 500, headers={**INTENT, "Content-Type": "application/json"})
        self.assertEqual(response.status_code, 413)
        self.assertNotIn("SYNTHETIC_SECRET", response.text)

    def test_session_storage_has_explicit_bound(self):
        for i in range(w.MAX_SESSIONS):
            self.app.state.sessions[str(i)] = w.DemoSession("lucia", "active_creador", self.clock.now + 100)
        response = self.client.post("/demo/v1/session", json={"persona": "lucia", "scenario": "active_creador"}, headers=INTENT)
        self.assertEqual(response.status_code, 429)
        self.assertEqual(len(self.app.state.sessions), w.MAX_SESSIONS)

    def test_session_cleanup_releases_expired_slots(self):
        self.app.state.sessions["expired"] = w.DemoSession("lucia", "active_creador", self.clock.now - 1)
        self.start()
        self.assertNotIn("expired", self.app.state.sessions)

    def test_server_only_serves_asset_allowlist(self):
        for path in ("/assets/workspace.py", "/assets/.env", "/assets/requirements.txt", "/docs", "/openapi.json"):
            self.assertEqual(self.client.get(path).status_code, 404)

    def test_no_legacy_module_imported(self):
        self.start()
        self.client.get("/demo/v1/workspace")
        for module in sys.modules.values():
            path = getattr(module, "__file__", None)
            self.assertFalse(path and "/miniapps/api/" in str(path))


if __name__ == "__main__":
    unittest.main()
