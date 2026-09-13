import copy
import unittest
from unittest.mock import patch

import control


class ControlTests(unittest.TestCase):
    def setUp(self):
        self.backlog, self.sprints = control.read_sources()
        # Unit scenarios reset operational state in memory; never require the real
        # project to stay unapproved forever and never write approval fixtures.
        self.backlog["assignment_defaults"]["status"] = "proposed"
        for story in self.backlog["stories"]:
            story["status"] = "proposed"
            for key in ("assignment", "ready_evidence", "history", "acceptance", "evidence", "blocker", "technical_review", "delivery_revision"):
                story.pop(key, None)
            for task in story.get("tasks", []):
                task["status"] = "proposed"
        self.sprints = [sp for sp in self.sprints if sp["id"] == "SP-001"]
        self.sprints[0].update(status="proposed", approval=None, history=[], review=None)
        for item in self.sprints[0]["intake"]:
            item.update(status="pending", answer=None, evidence=None)

    def errors(self):
        return control.validate(self.backlog, self.sprints)["errors"]

    def test_initial_proposal_is_consistent_but_not_approved(self):
        report = control.validate(self.backlog, self.sprints)
        self.assertEqual(report["errors"], [])
        self.assertEqual(report["approved_sprints"], 0)
        self.assertEqual(report["done_stories"], 0)
        self.assertIsNone(report["historical_velocity"])

    def test_full_requirement_coverage(self):
        report = control.validate(self.backlog, self.sprints)
        self.assertEqual(report["requirements_covered"], 29)
        self.assertEqual(report["stories"], len(self.backlog["stories"]))

    def test_no_implicit_sprint_activation(self):
        self.sprints[0]["status"] = "active"
        self.assertTrue(any("sin aprobación" in error for error in self.errors()))

    def test_no_implicit_story_execution(self):
        self.backlog["stories"][0]["status"] = "in_progress"
        self.assertTrue(any("sin sprint aprobado" in error for error in self.errors()))

    def test_done_requires_acceptance_and_evidence(self):
        self.backlog["stories"][0]["status"] = "done"
        errors = self.errors()
        self.assertTrue(any("Done sin aceptación" in error for error in errors))
        self.assertTrue(any("falta evidencia PASS" in error for error in errors))

    def test_ready_requires_review_record(self):
        self.backlog["stories"][0]["status"] = "ready"
        self.assertTrue(any("falta evidencia Ready" in error for error in self.errors()))

    def test_blocked_requires_impediment_record(self):
        self.backlog["stories"][0]["status"] = "blocked"
        self.assertTrue(any("bloqueo sin registro" in error for error in self.errors()))

    def test_duplicate_story_rejected(self):
        self.backlog["stories"].append(copy.deepcopy(self.backlog["stories"][0]))
        self.assertTrue(any("IDs de historia duplicados" in error for error in self.errors()))

    def test_dependency_missing_rejected(self):
        self.backlog["stories"][0]["dependencies"] = ["BG-999"]
        self.assertTrue(any("dependencia inválida" in error for error in self.errors()))

    def test_dependency_cycle_rejected(self):
        self.backlog["stories"][0]["dependencies"] = ["BG-005"]
        self.assertTrue(any("Ciclo de dependencias" in error for error in self.errors()))

    def test_story_size_must_be_split(self):
        self.backlog["stories"][-1]["points"] = 13
        self.assertTrue(any("Fibonacci" in error for error in self.errors()))

    def test_acceptance_criteria_required(self):
        self.backlog["stories"][0]["acceptance_criteria"] = []
        self.assertTrue(any("faltan criterios" in error for error in self.errors()))

    def test_unknown_requirement_rejected(self):
        self.backlog["stories"][0]["requirements"].append("R-99")
        self.assertTrue(any("requisito R-99 inexistente" in error for error in self.errors()))

    def test_capacity_buffer_enforced(self):
        self.sprints[0]["capacity_points"] = 13
        self.assertTrue(any("superan el sobre" in error for error in self.errors()))

    def test_same_story_cannot_be_in_two_open_sprints(self):
        second = copy.deepcopy(self.sprints[0])
        second["id"] = "SP-002"
        self.sprints.append(second)
        self.assertTrue(any("más de un sprint abierto" in error for error in self.errors()))

    def test_hash_changes_with_criteria_not_runtime_status(self):
        baseline = control.plan_hash(self.backlog, self.sprints[0])
        self.backlog["stories"][0]["status"] = "ready"
        self.assertEqual(baseline, control.plan_hash(self.backlog, self.sprints[0]))
        self.backlog["stories"][0]["acceptance_criteria"][0] += " Cambio material."
        self.assertNotEqual(baseline, control.plan_hash(self.backlog, self.sprints[0]))

    def test_hash_changes_with_budget(self):
        baseline = control.plan_hash(self.backlog, self.sprints[0])
        self.sprints[0]["budget"]["external_spend_limit"] = 100
        self.assertNotEqual(baseline, control.plan_hash(self.backlog, self.sprints[0]))

    def test_fake_or_stale_approval_fails(self):
        self.sprints[0]["approval"] = {"approved_by": "Roger", "plan_sha256": "0" * 64}
        errors = self.errors()
        self.assertTrue(any("difieren de la aprobación" in error for error in errors))
        self.assertTrue(any("falta fuente local" in error for error in errors))

    def test_generation_does_not_mutate_sources(self):
        before = copy.deepcopy((self.backlog, self.sprints))
        docs = control.generated_documents(self.backlog, self.sprints)
        self.assertEqual(before, (self.backlog, self.sprints))
        self.assertEqual(len(docs), 3)
        self.assertIn("PENDIENTE; no iniciar", next(text for path, text in docs.items() if path.name == "PLAN.md"))

    def test_timestamps_need_timezone(self):
        self.assertIsNone(control.aware_timestamp("2026-09-13T09:00:00"))
        self.assertIsNotNone(control.aware_timestamp("2026-09-13T09:00:00-05:00"))

    def approve_in_memory(self):
        """Synthetic fixtures for validator tests, never project authorizations."""
        sp = self.sprints[0]
        sp.update(status="approved", history=[{"fixture": "unit-test-only"}])
        sp["timebox"].update(start_at="2026-09-14T09:00:00-05:00", end_at="2026-09-18T17:00:00-05:00", review_at="2026-09-18T17:00:00-05:00")
        for item in sp["intake"]:
            item.update(status="resolved", answer="synthetic test", evidence="unit-fixture.md")
        for story in self.backlog["stories"]:
            if story["id"] in sp["stories"]:
                story.update(status="committed", ready_evidence="unit-fixture.md", assignment={"status": "confirmed"}, history=[{"at": "2026-09-14T09:00:00-05:00", "to": "committed", "evidence": "unit-fixture.md"}])
        payload = control.planning_payload(self.backlog, sp)
        sp["approval"] = {"approved_by": "Roger", "approved_at": "2026-09-14T08:00:00-05:00", "source": "unit-fixture.md", "plan_sha256": control.canonical_hash(payload), "baseline": "unit-baseline.json"}
        return payload

    def validate_with_synthetic_files(self, payload):
        import json
        # Patch reads only during validation; no synthetic approval persisted.
        with patch.object(control, "local_file", return_value=True), patch.object(control.Path, "read_text", autospec=True) as read:
            original = self.original_read_text
            read.side_effect = lambda path, *a, **kw: json.dumps(payload) if path.name == "unit-baseline.json" else original(path, *a, **kw)
            return self.errors()

    original_read_text = staticmethod(control.Path.read_text)

    def test_consistent_approved_sprint_can_pass(self):
        payload = self.approve_in_memory()
        self.assertEqual(self.validate_with_synthetic_files(payload), [])

    def test_approved_sprint_rejects_criteria_drift(self):
        payload = self.approve_in_memory()
        self.backlog["stories"][0]["acceptance_criteria"][0] += " Changed after approval."
        self.assertTrue(any("difieren de la aprobación" in error for error in self.validate_with_synthetic_files(payload)))

    def test_review_rejects_evidence_from_old_revision(self):
        payload = self.approve_in_memory()
        story = self.backlog["stories"][0]
        story.update(status="in_review", delivery_revision="v2", technical_review="unit-review.md")
        story["history"][-1]["to"] = "in_review"
        for task in story["tasks"]:
            task["status"] = "done"
        story["evidence"] = [{"ac": f"{story['id']}-AC{i}", "path": "unit-evidence.md", "revision": "v1", "environment": "unit", "at": "2026-09-14T10:00:00-05:00", "result": "PASS"} for i, _ in enumerate(story["acceptance_criteria"], 1)]
        self.assertTrue(any("falta evidencia PASS" in error for error in self.validate_with_synthetic_files(payload)))

    def test_archived_sprint_keeps_original_scope_after_refinement(self):
        payload = self.approve_in_memory()
        self.sprints[0].update(status="closed", review="unit-review.md")
        self.backlog["stories"][0]["scope"] = "Refined for next sprint."
        self.assertEqual(self.validate_with_synthetic_files(payload), [])


if __name__ == "__main__":
    unittest.main()
