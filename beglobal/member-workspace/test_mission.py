"""SP-006: local fixture mission CRUD. No diagnosis LLM, evidence upload, or accepted-by-member."""
import unittest

from fastapi.testclient import TestClient

import workspace as w
from test_workspace import INTENT, ORIGIN


VALID = {
    "objective": "Definir el siguiente paso de mi estrategia",
    "steps": ["Escribir el bloqueo en una frase", "Elegir un criterio observable"],
    "doneCriterion": "Hay un criterio de terminado escrito y no se marca avance de ruta.",
}


class MissionFixtureTests(unittest.TestCase):
    def setUp(self):
        self.app = w.create_app(environment="test", fixtures_enabled=True)
        self.client = TestClient(self.app, base_url=ORIGIN)

    def tearDown(self):
        self.client.close()

    def start(self, persona="lucia"):
        response = self.client.post("/demo/v1/session", json={"persona": persona, "scenario": "active_creador"}, headers=INTENT)
        self.assertEqual(response.status_code, 200)

    def create(self, payload=None, extra=None):
        headers = dict(INTENT)
        if extra:
            headers.update(extra)
        return self.client.post("/demo/v1/missions", json=payload or VALID, headers=headers)

    def test_complete_fields_create_a_draft_without_route_progress(self):
        self.start()
        response = self.create()
        self.assertEqual(response.status_code, 200, response.text)
        body = response.json()["data"]
        self.assertEqual(body["status"], "draft")
        self.assertEqual(body["version"], 1)
        self.assertEqual(body["source"], "synthetic-local")
        self.assertFalse(body["accepted"])
        self.assertEqual(body["objective"], VALID["objective"])
        self.assertEqual(body["steps"], VALID["steps"])
        self.assertEqual(body["doneCriterion"], VALID["doneCriterion"])
        workspace = self.client.get("/demo/v1/workspace").json()["data"]
        self.assertEqual(len(workspace["missions"]), 1)
        self.assertIsNone(workspace["progress"]["percent"])
        self.assertEqual(workspace["progress"]["accepted"], 0)
        self.assertEqual(workspace["progress"]["required"], 0)
        self.assertEqual(workspace["history"], [])
        activated = self.client.post(f"/demo/v1/missions/{body['id']}/activate", json={"version": 1}, headers=INTENT)
        self.assertEqual(activated.status_code, 200, activated.text)
        self.assertEqual(activated.json()["data"]["status"], "active")
        self.assertEqual(activated.json()["data"]["version"], 2)
        after = self.client.get("/demo/v1/workspace").json()["data"]
        self.assertIsNone(after["progress"]["percent"])
        self.assertEqual(after["progress"]["accepted"], 0)

    def test_missing_criterion_stays_pending_and_member_cannot_accept(self):
        self.start()
        incomplete = self.create({**VALID, "doneCriterion": "   "})
        self.assertEqual(incomplete.status_code, 422)
        self.assertEqual(incomplete.json()["code"], "MISSION_INCOMPLETE")
        self.assertEqual(self.client.get("/demo/v1/workspace").json()["data"]["missions"], [])
        created = self.create().json()["data"]
        forbidden = self.client.post(f"/demo/v1/missions/{created['id']}/accept", json={}, headers=INTENT)
        self.assertEqual(forbidden.status_code, 403)
        self.assertEqual(forbidden.json()["code"], "MISSION_STATUS_FORBIDDEN")
        self.assertEqual(self.client.get(f"/demo/v1/missions/{created['id']}").json()["data"]["status"], "draft")
        self.assertFalse(self.client.get(f"/demo/v1/missions/{created['id']}").json()["data"]["accepted"])

    def test_foreign_mission_is_indistinguishable_from_missing(self):
        self.start("lucia")
        lucia_id = self.create().json()["data"]["id"]
        self.client.post("/demo/v1/logout", json={}, headers=INTENT)
        self.start("diego")
        missing = "msn_doesnotexist"
        foreign = self.client.get(f"/demo/v1/missions/{lucia_id}")
        absent = self.client.get(f"/demo/v1/missions/{missing}")
        self.assertEqual(foreign.status_code, 404)
        self.assertEqual(absent.status_code, 404)
        self.assertEqual(foreign.json()["code"], absent.json()["code"])
        self.assertEqual(foreign.json()["code"], "MISSION_NOT_FOUND")
        self.assertNotIn("Definir el siguiente paso", foreign.text)
        self.assertEqual(self.client.get("/demo/v1/workspace").json()["data"]["missions"], [])
        steal = self.client.post(f"/demo/v1/missions/{lucia_id}/activate", json={"version": 1}, headers=INTENT)
        self.assertEqual(steal.status_code, 404)
        self.assertEqual(steal.json()["code"], "MISSION_NOT_FOUND")

    def test_stale_version_does_not_overwrite_and_origin_is_required(self):
        self.start()
        created = self.create().json()["data"]
        first = self.client.post(
            f"/demo/v1/missions/{created['id']}/revise",
            json={**VALID, "objective": "Reescribir el objetivo", "version": 1},
            headers=INTENT,
        )
        self.assertEqual(first.status_code, 200, first.text)
        self.assertEqual(first.json()["data"]["version"], 2)
        stale = self.client.post(
            f"/demo/v1/missions/{created['id']}/revise",
            json={**VALID, "objective": "No debería quedar", "version": 1},
            headers=INTENT,
        )
        self.assertEqual(stale.status_code, 409)
        self.assertEqual(stale.json()["code"], "VERSION_CONFLICT")
        current = self.client.get(f"/demo/v1/missions/{created['id']}").json()["data"]
        self.assertEqual(current["objective"], "Reescribir el objetivo")
        self.assertEqual(current["version"], 2)
        csrf = self.client.post("/demo/v1/missions", json=VALID)
        self.assertEqual(csrf.status_code, 403)


if __name__ == "__main__":
    unittest.main()
