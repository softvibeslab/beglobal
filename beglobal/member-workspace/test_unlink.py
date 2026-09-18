"""SP-005: unlink Telegram with fresh HMAC. No merge, no BotFather, no lockout of last access."""
import unittest

from fastapi.testclient import TestClient

import telegram_initdata as telegram
import workspace as w
from test_workspace import Clock, INTENT, ORIGIN


class UnlinkFixtureTests(unittest.TestCase):
    def setUp(self):
        self.clock = Clock()
        self.app = w.create_app(environment="test", fixtures_enabled=True, clock=self.clock)
        self.client = TestClient(self.app, base_url=ORIGIN)

    def tearDown(self):
        self.client.close()

    def start(self, persona="lucia"):
        response = self.client.post("/demo/v1/session", json={"persona": persona, "scenario": "active_creador"}, headers=INTENT)
        self.assertEqual(response.status_code, 200)

    def mint(self, telegram_id=900001):
        self.clock.now += 1
        return telegram.build_init_data(telegram_id=telegram_id, auth_date=int(self.clock.now))

    def bind(self, telegram_id=900001):
        challenge = self.client.post("/demo/v1/link-intent", json={}, headers=INTENT).json()["data"]["challengeId"]
        response = self.client.post("/demo/v1/link", json={"challengeId": challenge, "initData": self.mint(telegram_id)}, headers=INTENT)
        self.assertEqual(response.status_code, 200, response.text)

    def unlink(self, init_data, extra=None):
        headers = dict(INTENT)
        if extra:
            headers.update(extra)
        return self.client.post("/demo/v1/unlink", json={"initData": init_data}, headers=headers)

    def test_web_session_unlinks_same_subject_and_keeps_cookie(self):
        self.start()
        self.bind(900001)
        before = self.client.get("/demo/v1/workspace").json()["data"]["context"]["sessionVersion"]
        response = self.unlink(self.mint(900001))
        self.assertEqual(response.status_code, 200, response.text)
        body = response.json()["data"]
        self.assertTrue(body["unlinked"])
        self.assertEqual(body["telegramId"], 900001)
        self.assertEqual(body["sessionVersion"], before)
        self.assertNotIn("token", response.text.lower())
        workspace = self.client.get("/demo/v1/workspace").json()["data"]
        self.assertEqual(workspace["profile"]["personId"], "demo_lucia")
        self.assertFalse(workspace["link"]["linked"])
        self.assertEqual(workspace["context"]["sessionVersion"], before)
        self.assertEqual(workspace["history"], [])
        self.assertEqual(workspace["link"]["events"][-1]["kind"], "identity.unlinked")
        later = self.client.post("/demo/v1/telegram-session", json={"initData": self.mint(900001)}, headers=INTENT)
        self.assertEqual(later.status_code, 401)
        self.assertEqual(later.json()["code"], "MEMBER_LINK_REQUIRED")
        self.assertEqual(self.client.get("/demo/v1/workspace").json()["data"]["profile"]["personId"], "demo_lucia")

    def test_telegram_only_session_cannot_drop_last_verified_access(self):
        self.start()
        self.bind(900001)
        self.client.post("/demo/v1/logout", json={}, headers=INTENT)
        opened = self.client.post("/demo/v1/telegram-session", json={"initData": self.mint(900001)}, headers=INTENT)
        self.assertEqual(opened.status_code, 200)
        denied = self.unlink(self.mint(900001))
        self.assertEqual(denied.status_code, 409)
        self.assertEqual(denied.json()["code"], "LAST_VERIFIED_ACCESS")
        self.assertEqual(self.app.state.links_by_telegram[900001], "lucia")
        self.assertEqual(self.client.get("/demo/v1/workspace").json()["data"]["link"]["telegramId"], 900001)

    def test_missing_hmac_replay_cross_subject_and_origin_leave_the_link(self):
        self.start()
        self.bind(900001)
        version = self.app.state.session_versions.get("lucia", 0)
        self.assertEqual(self.client.post("/demo/v1/unlink", json={"initData": self.mint(900001)}).status_code, 403)
        proof = self.mint(900001)
        first = self.unlink(proof)
        self.assertEqual(first.status_code, 200)
        self.start()
        self.bind(900001)
        replay = self.unlink(proof)
        self.assertEqual(replay.status_code, 401)
        self.assertEqual(replay.json()["code"], "INITDATA_REPLAY")
        crossed = self.unlink(self.mint(900002))
        self.assertEqual(crossed.status_code, 409)
        self.assertEqual(crossed.json()["code"], "LINK_CONFLICT")
        self.assertEqual(self.app.state.links_by_telegram[900001], "lucia")
        self.assertEqual(self.app.state.session_versions.get("lucia", 0), version)

    def test_other_persona_cannot_unlink_or_recover_by_name(self):
        self.start("lucia")
        self.bind(900001)
        self.client.post("/demo/v1/logout", json={}, headers=INTENT)
        self.start("diego")
        stolen = self.unlink(self.mint(900001))
        self.assertEqual(stolen.status_code, 409)
        self.assertEqual(stolen.json()["code"], "LINK_CONFLICT")
        self.assertEqual(self.app.state.links_by_telegram[900001], "lucia")
        recover = self.client.post("/demo/v1/recover", json={"email": "lucia@example.invalid"}, headers=INTENT)
        self.assertEqual(recover.status_code, 403)
        self.assertEqual(recover.json()["code"], "IDENTITY_RECOVERY_DENIED")


if __name__ == "__main__":
    unittest.main()
