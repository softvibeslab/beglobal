"""SP-004: revoke one session or all copies of a persona. Not a real BFF or membership provider."""
import unittest

from fastapi.testclient import TestClient

import workspace as w
from test_workspace import INTENT, ORIGIN, Clock


class SessionLifecycleTests(unittest.TestCase):
    def setUp(self):
        self.clock = Clock()
        self.app = w.create_app(environment="test", fixtures_enabled=True, clock=self.clock)
        self.client = TestClient(self.app, base_url=ORIGIN)

    def tearDown(self):
        self.client.close()

    def start(self, client=None, persona="lucia", scenario="active_creador"):
        client = client or self.client
        response = client.post("/demo/v1/session", json={"persona": persona, "scenario": scenario}, headers=INTENT)
        self.assertEqual(response.status_code, 200, response.text)
        return response

    def test_logout_revokes_only_this_cookie_as_session_error(self):
        sibling = TestClient(self.app, base_url=ORIGIN)
        self.start()
        self.start(sibling)
        token = self.client.cookies.get(w.COOKIE)
        response = self.client.post("/demo/v1/logout", json={}, headers=INTENT)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["data"]["closed"])
        self.assertNotIn("token", response.text.lower())
        self.client.cookies.set(w.COOKIE, token)
        denied = self.client.get("/demo/v1/workspace")
        self.assertEqual(denied.status_code, 401)
        self.assertEqual(denied.json()["code"], "SESSION_REQUIRED")
        self.assertNotIn("membershipStatus", denied.text)
        live = sibling.get("/demo/v1/workspace")
        self.assertEqual(live.status_code, 200)
        self.assertEqual(live.json()["data"]["history"], [])
        sibling.close()

    def test_logout_all_bumps_version_and_invalidates_sibling_cookies(self):
        sibling = TestClient(self.app, base_url=ORIGIN)
        diego = TestClient(self.app, base_url=ORIGIN)
        self.start()
        self.start(sibling)
        self.start(diego, persona="diego")
        first = self.client.get("/demo/v1/workspace").json()["data"]["context"]["sessionVersion"]
        self.assertEqual(first, 0)
        response = self.client.post("/demo/v1/logout-all", json={}, headers=INTENT)
        self.assertEqual(response.status_code, 200, response.text)
        body = response.json()["data"]
        self.assertTrue(body["closedAll"])
        self.assertEqual(body["sessionVersion"], 1)
        self.assertEqual(sibling.get("/demo/v1/workspace").status_code, 401)
        self.assertEqual(sibling.get("/demo/v1/workspace").json()["code"], "SESSION_REQUIRED")
        self.assertEqual(self.client.get("/demo/v1/workspace").status_code, 401)
        still = diego.get("/demo/v1/workspace")
        self.assertEqual(still.status_code, 200)
        self.assertEqual(still.json()["data"]["profile"]["personId"], "demo_diego")
        revived = self.start()
        self.assertEqual(revived.json()["data"]["sessionVersion"], 1)
        self.assertEqual(self.client.get("/demo/v1/workspace").json()["data"]["context"]["sessionVersion"], 1)
        sibling.close()
        diego.close()

    def test_logout_all_requires_origin_and_does_not_merge_or_recover(self):
        self.start()
        self.assertEqual(self.client.post("/demo/v1/logout-all", json={}).status_code, 403)
        self.assertEqual(self.client.get("/demo/v1/workspace").status_code, 200)
        recover = self.client.post("/demo/v1/recover", json={"displayName": "Lucía · demo"}, headers=INTENT)
        self.assertEqual(recover.status_code, 403)
        self.assertEqual(recover.json()["code"], "IDENTITY_RECOVERY_DENIED")

    def test_unverified_membership_stays_503_until_session_is_gone(self):
        self.start(scenario="unavailable_creador")
        pro = self.client.get("/api/v1/businesses/demo_nube/resources/demo-pro")
        self.assertEqual(pro.status_code, 503)
        self.assertEqual(pro.json()["code"], "MEMBERSHIP_UNVERIFIED")
        self.client.post("/demo/v1/logout-all", json={}, headers=INTENT)
        missing = self.client.get("/api/v1/businesses/demo_nube/resources/demo-pro")
        self.assertEqual(missing.status_code, 401)
        self.assertEqual(missing.json()["code"], "SESSION_REQUIRED")


if __name__ == "__main__":
    unittest.main()
