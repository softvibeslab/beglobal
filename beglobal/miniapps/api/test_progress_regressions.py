"""Offline endpoint regressions. Run: python -m unittest test_progress_regressions -v.

Only temporary SQLite/media, synthetic Telegram signatures and mocked notifications.
No dependency overrides: requests exercise the real auth and registered routes.
"""
import hashlib
import hmac
import json
import os
from pathlib import Path
import socket
import sqlite3
import sys
import tempfile
import time
import types
import unittest
from concurrent.futures import ThreadPoolExecutor
from contextlib import closing
from datetime import datetime, timedelta
from unittest.mock import Mock, patch
from urllib.parse import urlencode

from fastapi.testclient import TestClient

# main initializes SQLite on import. Isolate before importing, including dotenv.
_sandbox = tempfile.TemporaryDirectory(prefix="beglobal-regressions-")
os.environ["DB_PATH"] = str(Path(_sandbox.name) / "bootstrap.sqlite")
os.environ["MEDIA_DIR"] = str(Path(_sandbox.name) / "media")
os.environ["DEV_BYPASS"] = "0"
for _profile in ("member", "team", "corporate"):
    os.environ[f"{_profile.upper()}_BOT_TOKEN"] = f"synthetic-{_profile}"
    os.environ[f"{_profile.upper()}_ALLOWED_IDS"] = "11,22,99"
with patch("dotenv.load_dotenv", return_value=False):
    import main
import db
import gamification


def headers(profile="member", tg_id=11):
    data = {"auth_date": str(int(time.time())), "user": json.dumps({"id": tg_id, "first_name": f"Test {tg_id}"})}
    secret = hmac.new(b"WebAppData", f"synthetic-{profile}".encode(), hashlib.sha256).digest()
    data["hash"] = hmac.new(secret, "\n".join(f"{k}={v}" for k, v in sorted(data.items())).encode(), hashlib.sha256).hexdigest()
    return {"X-Tg-Init-Data": urlencode(data)}


class ProgressTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(dir=_sandbox.name)
        self.addCleanup(self.temp.cleanup)
        db.DB_PATH = str(Path(self.temp.name) / "test.sqlite")
        db.init_db()
        media = patch.object(main, "MEDIA_DIR", str(Path(self.temp.name) / "media"))
        media.start()
        self.addCleanup(media.stop)
        self.client = TestClient(main.app)
        self.addCleanup(self.client.close)
        network = patch.object(socket.socket, "connect", side_effect=AssertionError("Network forbidden"))
        network.start()
        self.addCleanup(network.stop)
        notifications = patch.dict(sys.modules, {"notifications": Mock()})
        notifications.start()
        self.addCleanup(notifications.stop)
        with closing(db.connect()) as conn, conn:
            for tg_id in (11, 22, 99):
                for profile in ("member", "team", "corporate"):
                    conn.execute("INSERT INTO users(tg_id,profile,name,first_seen) VALUES (?,?,?,?)", (tg_id, profile, f"{profile}-{tg_id}", 1))

    def row(self, sql, params=()):
        with closing(db.connect()) as conn:
            row = conn.execute(sql, params).fetchone()
            return dict(row) if row else None

    def delivery(self, tg_id=11, mission_id=1, status="review"):
        with closing(db.connect()) as conn, conn:
            return conn.execute("INSERT INTO mission_progress(tg_id,mission_id,status,started_at) VALUES (?,?,?,?)", (tg_id, mission_id, status, 1)).lastrowid

    def post(self, path, data=None, profile="team", tg_id=99):
        return self.client.post(path, data=data, headers=headers(profile, tg_id))

    def test_diagnosis_form_and_validation(self):
        answers = {q["code"]: q["options"][0]["id"] for q in db.DIAGNOSIS_QUESTIONS}
        response = self.post("/api/onboarding/diagnosis/submit", {"responses": json.dumps(answers)}, "member", 11)
        self.assertEqual(response.status_code, 200, response.text)
        self.assertTrue(response.json()["recommended_lessons"])
        self.assertEqual(self.row("SELECT diagnosis_complete FROM users WHERE tg_id=11 AND profile='member'")["diagnosis_complete"], 1)
        self.assertEqual(self.row("SELECT diagnosis_complete FROM users WHERE tg_id=11 AND profile='team'")["diagnosis_complete"], 0)
        for invalid in ("[]", "null", "{", '{"experience": {}}', '{"unknown": "x"}', '{"experience": "bogus"}'):
            self.assertEqual(self.post("/api/onboarding/diagnosis/submit", {"responses": invalid}, "member", 11).status_code, 400)
        self.assertEqual(self.post("/api/onboarding/diagnosis/submit", {"responses": json.dumps(answers)}, "member", 11).status_code, 200)

    def test_lesson_idempotent_and_concurrent(self):
        def complete(_):
            return self.post("/api/lessons/1/complete", {"quiz_score": 90}, "member", 11)
        with ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(complete, range(4)))
        self.assertTrue(all(r.status_code == 200 for r in results))
        self.assertEqual(sum(r.json()["xp_gained"] for r in results), 50)
        self.assertEqual(self.row("SELECT points,lessons_completed FROM gamification WHERE tg_id=11 AND profile='member'"), {"points": 50, "lessons_completed": 1})
        first = self.row("SELECT * FROM lesson_progress WHERE tg_id=11")
        self.assertEqual(complete(0).json()["xp_gained"], 0)
        self.assertEqual(self.row("SELECT * FROM lesson_progress WHERE tg_id=11"), first)

    def test_lesson_rollback_and_retry(self):
        with patch.object(gamification, "check_achievements", side_effect=RuntimeError("injected")):
            with self.assertRaises(RuntimeError):
                self.post("/api/lessons/1/complete", profile="member", tg_id=11)
        self.assertIsNone(self.row("SELECT * FROM lesson_progress WHERE tg_id=11"))
        self.assertIsNone(self.row("SELECT * FROM gamification WHERE tg_id=11"))
        self.assertEqual(self.post("/api/lessons/1/complete", profile="member", tg_id=11).status_code, 200)

    def submit(self, tg_id=11, note="first"):
        return self.client.post(
            "/api/missions/2/submit", headers=headers("member", tg_id),
            data={"note": note}, files={"file": (f"{tg_id}.txt", note.encode(), "text/plain")},
        )

    def test_multipart_acceptance_no_reward_reopening(self):
        for member in (11, 22):
            response = self.submit(member, f"note-{member}")
            self.assertEqual(response.status_code, 200, response.text)
        def queue():
            response = self.client.get("/api/team/missions-queue", headers=headers("team", 99))
            self.assertEqual(response.status_code, 200, response.text)
            return response.json()["missions"]
        rows = queue()
        self.assertEqual(len(rows), 2)
        deliveries = {r["member_name"]: r["id"] for r in rows}
        a, b = deliveries["member-11"], deliveries["member-22"]
        self.assertNotEqual(a, b)
        self.assertEqual({r["member_note"] for r in rows}, {"note-11", "note-22"})
        self.assertEqual({r["evidence_file"] for r in rows}, {"MISSION_11.txt", "MISSION_22.txt"})
        with patch("builtins.open", side_effect=AssertionError("Duplicate file write")):
            self.assertEqual(self.submit().status_code, 409)
        self.assertEqual(self.post(f"/api/team/mission/{a}/approve", {"score": 5, "feedback": "  Great  "}).status_code, 200)
        first = self.row("SELECT * FROM mission_progress WHERE id=?", (a,))
        reward = self.row("SELECT * FROM gamification WHERE tg_id=11 AND profile='member'")
        self.assertEqual(reward["missions_completed"], 1)
        self.assertEqual(reward["points"], 150)
        self.assertEqual(first["coach_feedback"], "Great")
        self.assertIsNone(self.row("SELECT * FROM gamification WHERE tg_id=22"))
        self.assertEqual([r["id"] for r in queue()], [b])
        self.assertEqual(self.post(f"/api/team/mission/{b}/reject", {"feedback": "  Retry photo  "}).status_code, 200)
        self.assertEqual(queue(), [])
        self.assertEqual(self.row("SELECT coach_feedback FROM mission_progress WHERE id=?", (b,))["coach_feedback"], "Retry photo")
        self.assertEqual(self.submit(22, "corrected").status_code, 200)
        self.assertEqual([(r["id"], r["member_note"]) for r in queue()], [(b, "corrected")])
        self.assertEqual(self.post(f"/api/team/mission/{b}/approve", {"score": 4, "feedback": "Fixed"}).status_code, 200)
        self.assertEqual(self.row("SELECT attempts,coach_feedback FROM mission_progress WHERE id=?", (b,)), {"attempts": 2, "coach_feedback": "Fixed"})
        files_before = sorted(Path(main.MEDIA_DIR).rglob("*.txt"))
        with patch("builtins.open", side_effect=AssertionError("Completed file write")):
            self.assertEqual(self.submit().status_code, 409)
            self.assertEqual(self.submit(22).status_code, 409)
        self.assertEqual(self.post(f"/api/team/mission/{a}/approve", {"score": 5}).status_code, 404)
        self.assertEqual(self.post("/api/team/missions/approve-bulk", {"mission_ids": f"{a},{b}"}).json()["approved"], 0)
        self.assertEqual(self.row("SELECT * FROM mission_progress WHERE id=?", (a,)), first)
        self.assertEqual(self.row("SELECT * FROM gamification WHERE tg_id=11 AND profile='member'"), reward)
        self.assertEqual(self.row("SELECT points,missions_completed FROM gamification WHERE tg_id=22 AND profile='member'"), {"points": 150, "missions_completed": 1})
        self.assertIsNone(self.row("SELECT * FROM gamification WHERE profile != 'member'"))
        self.assertEqual(sorted(Path(main.MEDIA_DIR).rglob("*.txt")), files_before)
        for table in ("evidence", "learning_sessions"):
            self.assertEqual(self.row(f"SELECT COUNT(*) AS n FROM {table}")["n"], 3)
        with closing(db.connect()) as conn:
            audits = [dict(r) for r in conn.execute("SELECT * FROM audit_trail ORDER BY id")]
        self.assertEqual([(r["action"], r["resource_id"], json.loads(r["details"])["feedback"]) for r in audits], [
            ("mission_approved", str(a), "Great"), ("mission_rejected", str(b), "Retry photo"),
            ("mission_approved", str(b), "Fixed"),
        ])
        self.assertTrue(all((r["actor_tg_id"], r["actor_profile"]) == (99, "team") for r in audits))

    def test_submit_rollback_removes_file_and_allows_retry(self):
        with closing(db.connect()) as conn:
            conn.execute("CREATE TRIGGER fail_session BEFORE INSERT ON learning_sessions BEGIN SELECT RAISE(ABORT, 'injected'); END")
        with self.assertRaises(sqlite3.IntegrityError):
            self.submit()
        self.assertIsNone(self.row("SELECT * FROM mission_progress"))
        self.assertIsNone(self.row("SELECT * FROM evidence"))
        self.assertEqual(list(Path(main.MEDIA_DIR).rglob("*.txt")), [])
        with closing(db.connect()) as conn:
            conn.execute("DROP TRIGGER fail_session")
        self.assertEqual(self.submit().status_code, 200)

    def test_concurrent_submit_and_approval_cannot_reopen(self):
        with ThreadPoolExecutor(max_workers=2) as pool:
            responses = list(pool.map(lambda _: self.submit(), range(2)))
        self.assertEqual(sorted(r.status_code for r in responses), [200, 409])
        delivery = self.row("SELECT id FROM mission_progress")["id"]
        with ThreadPoolExecutor(max_workers=2) as pool:
            upload = pool.submit(self.submit)
            approval = pool.submit(self.post, f"/api/team/mission/{delivery}/approve", {"score": 5})
            self.assertEqual(upload.result().status_code, 409)
            self.assertEqual(approval.result().status_code, 200)
        self.assertEqual(self.row("SELECT status,attempts FROM mission_progress"), {"status": "completed", "attempts": 1})
        self.assertEqual(self.row("SELECT COUNT(*) AS n FROM evidence")["n"], 1)
        self.assertEqual(self.row("SELECT missions_completed FROM gamification")["missions_completed"], 1)

    def test_delivery_id_migration_survives_vacuum(self):
        with closing(db.connect()) as conn:
            conn.execute("DROP TABLE mission_progress")
            legacy = db.SCHEMA.split("CREATE TABLE IF NOT EXISTS mission_progress (", 1)[1].split(";", 1)[0]
            legacy = legacy.replace("  id INTEGER PRIMARY KEY AUTOINCREMENT,\n", "").replace("UNIQUE (tg_id, mission_id)", "PRIMARY KEY (tg_id, mission_id)")
            conn.execute("CREATE TABLE mission_progress (" + legacy)
            conn.execute("CREATE INDEX custom_delivery_idx ON mission_progress(tg_id, started_at)")
            with conn:
                conn.execute("INSERT INTO mission_progress(rowid,tg_id,mission_id,status,attempts,started_at,completed_at,score,coach_feedback) VALUES (41,11,2,'completed',2,10,20,5,'historical')")
                conn.execute("INSERT INTO mission_progress(rowid,tg_id,mission_id,status,started_at) VALUES (87,22,2,'review',30)")
            before = [tuple(r) for r in conn.execute("SELECT rowid,* FROM mission_progress ORDER BY rowid")]
        db.init_db()
        db.init_db()
        with closing(db.connect()) as conn:
            self.assertEqual([tuple(r) for r in conn.execute("SELECT * FROM mission_progress ORDER BY id")], before)
            conn.execute("VACUUM")
            self.assertEqual([tuple(r) for r in conn.execute("SELECT * FROM mission_progress ORDER BY id")], before)
            indexes = {r["name"] for r in conn.execute("PRAGMA index_list(mission_progress)")}
            self.assertTrue({"custom_delivery_idx", "idx_mission_progress_status"}.issubset(indexes))
            self.assertEqual(conn.execute("PRAGMA foreign_key_check").fetchall(), [])
            with self.assertRaises(sqlite3.IntegrityError), conn:
                conn.execute("INSERT INTO mission_progress(tg_id,mission_id) VALUES (11,2)")
        self.assertEqual(self.post("/api/team/mission/87/approve", {"score": 4}).status_code, 200)
        self.assertEqual(self.row("SELECT coach_feedback FROM mission_progress WHERE id=41")["coach_feedback"], "historical")
        with closing(db.connect()) as conn, conn:
            conn.execute("DELETE FROM mission_progress WHERE id=87")
        self.assertGreater(self.delivery(22, 1), 87)

    def test_queue_delivery_identity_and_filter(self):
        a = self.delivery(11, 2)
        b = self.delivery(22, 2)
        with closing(db.connect()) as conn, conn:
            for tg_id, mission_id, filename in ((11, 2, "own"), (11, 1, "other"), (22, 2, "second")):
                conn.execute("INSERT INTO evidence(tg_id,stage_code,filename,stored_path,note,created_at) VALUES (?,?,?,?,?,?)", (tg_id, f"mission_{mission_id}", filename, filename, filename, 1))
        response = self.client.get("/api/team/missions-queue", headers=headers("team", 99))
        self.assertEqual(response.status_code, 200, response.text)
        rows = response.json()["missions"]
        self.assertEqual({r["id"] for r in rows}, {a, b})
        self.assertEqual({r["evidence_file"] for r in rows}, {"own", "second"})
        self.assertEqual(len(rows), 2)
        response = self.client.get("/api/team/missions-queue?difficulty=hard", headers=headers("team", 99))
        self.assertEqual(response.json()["missions"], [])

    def test_bulk_only_selected_delivery_and_once(self):
        a = self.delivery(11, 2)
        b = self.delivery(22, 2)
        response = self.post("/api/team/missions/approve-bulk", {"mission_ids": f"{a},{a},99999"})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["approved"], 1)
        self.assertEqual(self.row("SELECT status FROM mission_progress WHERE tg_id=22")["status"], "review")
        self.assertEqual(self.row("SELECT points,missions_completed FROM gamification WHERE tg_id=11 AND profile='member'"), {"points": 150, "missions_completed": 1})
        self.assertIsNone(self.row("SELECT * FROM gamification WHERE tg_id=22"))
        self.assertEqual(self.post("/api/team/missions/approve-bulk", {"mission_ids": str(a)}).json()["approved"], 0)
        self.assertEqual(self.post("/api/team/missions/approve-bulk", {"mission_ids": str(b)}).json()["approved"], 1)

    def test_single_approval_persists_feedback_timestamp_audit_and_is_once(self):
        delivery = self.delivery(11, 2)
        self.delivery(22, 2)
        response = self.post(f"/api/team/mission/{delivery}/approve", {"score": 5, "feedback": "  Good work  "})
        self.assertEqual(response.status_code, 200, response.text)
        row = self.row("SELECT * FROM mission_progress WHERE tg_id=11")
        self.assertEqual(row["coach_feedback"], "Good work")
        self.assertTrue(row["completed_at"])
        audit = self.row("SELECT * FROM audit_trail WHERE action='mission_approved'")
        self.assertEqual((audit["actor_tg_id"], audit["actor_profile"], audit["resource_id"]), (99, "team", str(delivery)))
        self.assertEqual(self.post(f"/api/team/mission/{delivery}/approve", {"score": 5}).status_code, 404)
        self.assertEqual(self.row("SELECT status FROM mission_progress WHERE tg_id=22")["status"], "review")

    def test_rejection_by_delivery_and_legacy_approval_alias(self):
        a = self.delivery(11, 2)
        b = self.delivery(22, 2)
        response = self.post(f"/api/team/mission/{a}/reject", {"feedback": "Retry"})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(self.row("SELECT coach_feedback,status FROM mission_progress WHERE tg_id=11"), {"coach_feedback": "Retry", "status": "rejected"})
        self.assertIsNone(self.row("SELECT * FROM gamification WHERE tg_id=11"))
        self.assertEqual(self.post(f"/api/missions/{b}/approve", {"score": 4}).status_code, 200)
        self.assertEqual(self.post(f"/api/missions/{b}/reject", {"feedback": "late"}).status_code, 404)

    def test_approval_rollback_and_concurrent_bulk(self):
        a = self.delivery(11, 2)
        b = self.delivery(22, 2)
        original = gamification.grant_xp
        def fail_second(conn, tg_id, *args, **kwargs):
            if tg_id == 22:
                raise RuntimeError("injected")
            return original(conn, tg_id, *args, **kwargs)
        with patch.object(gamification, "grant_xp", side_effect=fail_second):
            with self.assertRaises(RuntimeError):
                self.post("/api/team/missions/approve-bulk", {"mission_ids": f"{a},{b}"})
        self.assertEqual(self.row("SELECT COUNT(*) AS n FROM mission_progress WHERE status='review'")["n"], 2)
        self.assertEqual(self.row("SELECT COUNT(*) AS n FROM gamification")["n"], 0)
        self.assertEqual(self.row("SELECT COUNT(*) AS n FROM audit_trail")["n"], 0)
        with ThreadPoolExecutor(max_workers=3) as pool:
            results = list(pool.map(lambda _: self.post("/api/team/missions/approve-bulk", {"mission_ids": f"{a},{b}"}), range(3)))
        self.assertEqual(sum(r.json()["approved"] for r in results), 2)

    def test_single_bulk_race_and_single_rollback(self):
        delivery = self.delivery(11, 2)
        with patch.object(gamification, "check_achievements", side_effect=RuntimeError("injected")):
            with self.assertRaises(RuntimeError):
                self.post(f"/api/team/mission/{delivery}/approve", {"score": 4})
        self.assertEqual(self.row("SELECT status FROM mission_progress")["status"], "review")
        self.assertEqual(self.row("SELECT COUNT(*) AS n FROM gamification")["n"], 0)
        self.assertEqual(self.row("SELECT COUNT(*) AS n FROM audit_trail")["n"], 0)
        def approve(i):
            if i % 2:
                return self.post(f"/api/team/mission/{delivery}/approve", {"score": 4})
            return self.post("/api/team/missions/approve-bulk", {"mission_ids": str(delivery)})
        with ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(approve, range(4)))
        self.assertTrue(all(r.status_code in (200, 404) for r in results))
        self.assertEqual(self.row("SELECT points,missions_completed FROM gamification"), {"points": 150, "missions_completed": 1})
        self.assertEqual(self.row("SELECT COUNT(*) AS n FROM audit_trail")["n"], 1)

    def test_daily_concurrent_only_one_bonus(self):
        with ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(lambda _: self.post("/api/gamification/complete-daily", profile="member", tg_id=11), range(4)))
        self.assertTrue(all(r.status_code == 200 for r in results))
        self.assertEqual(sum(r.json()["streak_bonus"] for r in results), 25)
        self.assertEqual(self.row("SELECT points,streak_current FROM gamification"), {"points": 25, "streak_current": 1})

    def test_audit_legacy_migration_preserves_rows_and_indexes(self):
        with closing(db.connect()) as conn:
            conn.execute("PRAGMA foreign_keys=OFF")
            conn.execute("DROP TABLE audit_trail")
            legacy = db.SCHEMA.replace(
                "FOREIGN KEY (actor_tg_id, actor_profile) REFERENCES users(tg_id, profile)",
                "FOREIGN KEY (actor_tg_id) REFERENCES users(tg_id)",
            )
            conn.executescript(legacy)
            with conn:
                conn.execute("INSERT INTO audit_trail(timestamp,actor_tg_id,actor_profile,action) VALUES (1,99,'team','historical')")
        db.init_db()
        db.init_db()  # Migration must be safe to run again.
        self.assertEqual(self.row("SELECT action FROM audit_trail WHERE id=1")["action"], "historical")
        with closing(db.connect()) as conn:
            self.assertEqual(len(conn.execute("PRAGMA foreign_key_list(audit_trail)").fetchall()), 2)
            self.assertEqual(conn.execute("PRAGMA foreign_key_check(audit_trail)").fetchall(), [])
            self.assertEqual(conn.execute("PRAGMA foreign_keys").fetchone()[0], 1)
            self.assertEqual(len(conn.execute("PRAGMA index_list(audit_trail)").fetchall()), 2)
        delivery = self.delivery()
        self.assertEqual(self.post(f"/api/team/mission/{delivery}/approve", {"score": 4}).status_code, 200)
        self.assertEqual(self.row("SELECT COUNT(*) AS n FROM audit_trail")["n"], 2)

    def test_daily_empty_dates_and_consecutive(self):
        for last_date in (None, "", "not-a-date", (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")):
            with self.subTest(last_date=last_date):
                with closing(db.connect()) as conn, conn:
                    conn.execute("DELETE FROM gamification")
                    conn.execute("INSERT INTO gamification(tg_id,profile,last_activity_date,streak_current,streak_max) VALUES (11,'member',?,2,2)", (last_date,))
                response = self.post("/api/gamification/complete-daily", profile="member", tg_id=11)
                self.assertEqual(response.status_code, 200, response.text)
                self.assertEqual(response.json()["streak_bonus"], 25)
                self.assertEqual(response.json()["streak"], 3 if last_date and last_date[:4].isdigit() else 1)
                self.assertEqual(self.post("/api/gamification/complete-daily", profile="member", tg_id=11).json()["streak_bonus"], 0)

    def test_orchestrator_scoped_profile_read_and_write(self):
        for profile in ("member", "team", "corporate"):
            response = self.client.get("/api/orchestrator/detect-profile", headers=headers(profile, 11))
            self.assertEqual(response.json()["profile"], profile)
            self.assertEqual(response.json()["permissions"]["can_review_missions"], profile != "member")
            response = self.client.get("/api/orchestrator/onboarding-status", headers=headers(profile, 11))
            self.assertEqual(response.json()["profile"], profile)
        self.assertEqual(self.post("/api/orchestrator/acknowledge-setup", profile="team", tg_id=11).status_code, 200)
        self.assertEqual(self.row("SELECT onboarding_step FROM users WHERE tg_id=11 AND profile='member'")["onboarding_step"], "diagnosis")
        self.assertEqual(self.row("SELECT onboarding_step FROM users WHERE tg_id=11 AND profile='team'")["onboarding_step"], "dashboard")

    def test_cross_profile_auth_and_invalid_requests(self):
        a = self.delivery()
        for path, data in ((f"/api/team/mission/{a}/approve", {"score": 4}), (f"/api/team/mission/{a}/reject", {}), ("/api/team/missions/approve-bulk", {"mission_ids": str(a)})):
            self.assertEqual(self.post(path, data, "member", 11).status_code, 401)
            self.assertEqual(self.post(path, data, "corporate", 11).status_code, 401)
        self.assertEqual(self.post("/api/lessons/1/complete", profile="team").status_code, 401)
        self.assertEqual(self.post(f"/api/team/mission/{a}/approve", {"score": 6}).status_code, 400)
        for ids in (" ", "oops"):
            self.assertEqual(self.post("/api/team/missions/approve-bulk", {"mission_ids": ids}).status_code, 400)


if __name__ == "__main__":
    unittest.main()
