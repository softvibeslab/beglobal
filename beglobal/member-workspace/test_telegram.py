"""SP-002: fixture HMAC initData only. No BotFather, Hostinger or real users."""
import unittest

from fastapi.testclient import TestClient

import telegram_initdata as telegram
import workspace as w
from test_workspace import Clock, INTENT, ORIGIN


class TelegramFixtureTests(unittest.TestCase):
    def setUp(self):
        self.clock = Clock()
        self.app = w.create_app(environment="test", fixtures_enabled=True, clock=self.clock)
        self.client = TestClient(self.app, base_url=ORIGIN)

    def tearDown(self):
        self.client.close()

    def exchange(self, init_data, extra=None):
        headers = dict(INTENT)
        if extra:
            headers.update(extra)
        return self.client.post("/demo/v1/telegram-session", json={"initData": init_data}, headers=headers)

    def signed(self, telegram_id=900001, **kwargs):
        return telegram.build_init_data(telegram_id=telegram_id, auth_date=int(self.clock.now), **kwargs)

    def test_valid_fixture_opens_bound_session(self):
        response = self.exchange(self.signed())
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["data"]["auth"], "telegram-fixture")
        workspace = self.client.get("/demo/v1/workspace").json()["data"]
        self.assertEqual(workspace["profile"]["personId"], "demo_lucia")
        self.assertTrue(workspace["context"]["syntheticOnly"])

    def test_diego_maps_from_server_not_client_userid(self):
        self.assertEqual(self.exchange(self.signed(900002)).status_code, 200)
        self.assertEqual(self.client.get("/demo/v1/workspace").json()["data"]["profile"]["personId"], "demo_diego")

    def test_client_userid_cannot_choose_the_subject(self):
        response = self.client.post(
            "/demo/v1/telegram-session",
            json={"initData": self.signed(900001), "userId": 900002, "personId": "demo_diego"},
            headers=INTENT,
        )
        self.assertEqual(response.status_code, 422)
        self.assertEqual(self.client.get("/demo/v1/workspace").status_code, 401)

    def test_query_userid_is_rejected_on_private_routes(self):
        self.exchange(self.signed())
        response = self.client.get("/api/v1/businesses/demo_nube/profile?userId=900002")
        self.assertEqual(response.status_code, 422)

    def test_private_data_without_session_is_not_a_membership_error(self):
        response = self.client.get("/api/v1/businesses/demo_nube/profile")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["code"], "SESSION_REQUIRED")
        self.assertNotIn("membershipStatus", response.text)

    def test_bad_signature_bot_stale_and_replay_fail_closed(self):
        good = self.signed()
        tampered = good[:-2] + ("0" if good[-2] != "0" else "1") + good[-1]
        self.assertEqual(self.exchange(tampered).json()["code"], "INITDATA_BAD_SIGNATURE")
        other_bot = self.signed(bot_token="999999:WRONG-FIXTURE-BOT")
        self.assertEqual(self.exchange(other_bot).json()["code"], "INITDATA_BAD_SIGNATURE")
        stale = telegram.build_init_data(telegram_id=900001, auth_date=int(self.clock.now) - 3601)
        self.assertEqual(self.exchange(stale).json()["code"], "INITDATA_STALE")
        unsigned = "auth_date=1&user=%7B%22id%22%3A900001%7D"
        self.assertEqual(self.exchange(unsigned).json()["code"], "INITDATA_UNSIGNED")
        first = self.exchange(good)
        self.assertEqual(first.status_code, 200)
        replay = self.exchange(good)
        self.assertEqual(replay.status_code, 401)
        self.assertEqual(replay.json()["code"], "INITDATA_REPLAY")

    def test_unknown_telegram_id_does_not_create_a_session(self):
        response = self.exchange(self.signed(telegram_id=42))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["code"], "MEMBER_LINK_REQUIRED")
        self.assertEqual(self.client.get("/demo/v1/workspace").status_code, 401)

    def test_logout_requires_a_new_proof(self):
        self.exchange(self.signed())
        self.assertEqual(self.client.post("/demo/v1/logout", json={}, headers=INTENT).status_code, 200)
        self.assertEqual(self.client.get("/demo/v1/workspace").status_code, 401)
        second = telegram.build_init_data(telegram_id=900001, auth_date=int(self.clock.now), extra={"query_id": "AAEsecond"})
        self.assertEqual(self.exchange(second).status_code, 200)

    def test_expired_session_is_not_a_membership_denial(self):
        self.exchange(self.signed())
        self.clock.now += w.SESSION_TTL + 1
        response = self.client.get("/demo/v1/workspace")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["code"], "SESSION_REQUIRED")

    def test_server_mints_exchangeable_fixture_without_client_userid(self):
        minted = self.client.post("/demo/v1/telegram-fixture", json={"telegramId": 900002, "userId": 1}, headers=INTENT)
        self.assertEqual(minted.status_code, 422)
        minted = self.client.post("/demo/v1/telegram-fixture", json={"telegramId": 900002}, headers=INTENT)
        self.assertEqual(minted.status_code, 200, minted.text)
        self.assertTrue(minted.json()["data"]["syntheticOnly"])
        self.assertNotIn("token", minted.text.lower())
        opened = self.exchange(minted.json()["data"]["initData"])
        self.assertEqual(opened.status_code, 200)
        self.assertEqual(self.client.get("/demo/v1/workspace").json()["data"]["profile"]["personId"], "demo_diego")
        self.assertEqual(self.client.get("/demo/v1/workspace").json()["data"]["context"]["auth"], "telegram-fixture")

    def test_fixtures_off_hides_the_exchange(self):
        with TestClient(w.create_app(environment="test"), base_url=ORIGIN) as client:
            response = client.post("/demo/v1/telegram-session", json={"initData": self.signed()}, headers=INTENT)
            self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
