"""SP-003: local web+Telegram linking. No merge, no BotFather, no recovery by name."""
import unittest

from fastapi.testclient import TestClient

import telegram_initdata as telegram
import workspace as w
from test_workspace import Clock, INTENT, ORIGIN


class LinkFixtureTests(unittest.TestCase):
    def setUp(self):
        self.clock = Clock()
        self.app = w.create_app(environment="test", fixtures_enabled=True, clock=self.clock)
        self.client = TestClient(self.app, base_url=ORIGIN)

    def tearDown(self):
        self.client.close()

    def start(self, persona="lucia"):
        response = self.client.post("/demo/v1/session", json={"persona": persona, "scenario": "active_creador"}, headers=INTENT)
        self.assertEqual(response.status_code, 200, response.text)

    def mint(self, telegram_id=900001):
        self.clock.now += 1
        return telegram.build_init_data(telegram_id=telegram_id, auth_date=int(self.clock.now))

    def intent(self):
        response = self.client.post("/demo/v1/link-intent", json={}, headers=INTENT)
        self.assertEqual(response.status_code, 200, response.text)
        body = response.json()["data"]
        self.assertTrue(body["syntheticOnly"])
        self.assertEqual(body["ttlSeconds"], 300)
        self.assertNotIn("token", body)
        return body["challengeId"]

    def link(self, challenge_id, init_data, extra=None):
        headers = dict(INTENT)
        if extra:
            headers.update(extra)
        return self.client.post("/demo/v1/link", json={"challengeId": challenge_id, "initData": init_data}, headers=headers)

    def test_same_subject_creates_unique_audited_link(self):
        self.start()
        challenge = self.intent()
        response = self.link(challenge, self.mint(900001))
        self.assertEqual(response.status_code, 200, response.text)
        body = response.json()["data"]
        self.assertTrue(body["linked"])
        self.assertFalse(body["alreadyLinked"])
        self.assertEqual(body["telegramId"], 900001)
        self.assertEqual(body["auditEvent"], "identity.linked")
        self.assertNotIn("challengeId", body)
        self.assertNotIn("initData", response.text)
        workspace = self.client.get("/demo/v1/workspace").json()["data"]
        self.assertEqual(workspace["link"]["telegramId"], 900001)
        self.assertTrue(workspace["link"]["linked"])
        self.assertEqual(workspace["history"], [])
        self.assertEqual(workspace["link"]["events"][-1]["kind"], "identity.linked")
        self.assertNotIn("challengeId", workspace)
        self.assertNotIn(challenge, str(workspace))

    def test_cross_persona_and_prior_owner_do_not_merge(self):
        self.start("lucia")
        first = self.link(self.intent(), self.mint(900001))
        self.assertEqual(first.status_code, 200)
        crossed = self.link(self.intent(), self.mint(900002))
        self.assertEqual(crossed.status_code, 409)
        self.assertEqual(crossed.json()["code"], "LINK_CONFLICT")
        self.assertEqual(self.app.state.links_by_persona, {"lucia": 900001})
        self.assertNotIn("diego", self.app.state.links_by_telegram.values())
        self.client.post("/demo/v1/logout", json={}, headers=INTENT)
        self.start("diego")
        stolen = self.link(self.intent(), self.mint(900001))
        self.assertEqual(stolen.status_code, 409)
        self.assertEqual(stolen.json()["code"], "LINK_CONFLICT")
        self.assertEqual(self.app.state.links_by_telegram[900001], "lucia")
        diego_space = self.client.get("/demo/v1/workspace").json()["data"]
        self.assertFalse(diego_space["link"]["linked"])
        self.assertEqual(diego_space["history"], [])
        self.assertEqual(diego_space["link"]["events"][-1]["kind"], "identity.link_rejected")

    def test_expired_or_replayed_challenge_is_rejected(self):
        self.start()
        challenge = self.intent()
        self.clock.now += 301
        expired = self.link(challenge, self.mint())
        self.assertEqual(expired.status_code, 409)
        self.assertEqual(expired.json()["code"], "LINK_CHALLENGE_EXPIRED")
        self.assertEqual(self.app.state.links_by_persona, {})
        fresh = self.intent()
        ok = self.link(fresh, self.mint())
        self.assertEqual(ok.status_code, 200)
        replay = self.link(fresh, self.mint())
        self.assertEqual(replay.status_code, 409)
        self.assertEqual(replay.json()["code"], "LINK_CHALLENGE_EXPIRED")

    def test_origin_intent_and_no_client_chosen_subject(self):
        self.start()
        challenge = self.intent()
        init_data = self.mint()
        self.assertEqual(self.client.post("/demo/v1/link", json={"challengeId": challenge, "initData": init_data}).status_code, 403)
        extra = self.client.post(
            "/demo/v1/link",
            json={"challengeId": challenge, "initData": init_data, "personId": "demo_diego"},
            headers=INTENT,
        )
        self.assertEqual(extra.status_code, 422)
        body = self.link(self.intent(), init_data).json()["data"]
        self.assertNotIn("cookie", str(body).lower())
        self.assertNotIn("token", str(body).lower())

    def test_recovery_by_name_or_email_is_denied(self):
        self.start()
        by_name = self.client.post("/demo/v1/recover", json={"displayName": "Lucía · demo"}, headers=INTENT)
        self.assertEqual(by_name.status_code, 403)
        self.assertEqual(by_name.json()["code"], "IDENTITY_RECOVERY_DENIED")
        by_email = self.client.post("/demo/v1/recover", json={"email": "lucia@example.invalid"}, headers=INTENT)
        self.assertEqual(by_email.status_code, 403)
        self.assertEqual(self.app.state.links_by_persona, {})
        self.assertEqual(self.client.get("/demo/v1/workspace").json()["data"]["link"]["events"][-1]["kind"], "identity.recovery_denied")

    def test_same_pair_is_idempotent_without_merge(self):
        self.start()
        self.assertEqual(self.link(self.intent(), self.mint(900001)).status_code, 200)
        again = self.link(self.intent(), self.mint(900001))
        self.assertEqual(again.status_code, 200)
        self.assertTrue(again.json()["data"]["alreadyLinked"])
        self.assertEqual(self.app.state.links_by_telegram, {900001: "lucia"})


if __name__ == "__main__":
    unittest.main()
