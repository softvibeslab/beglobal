"""Tests for gamification engine."""
import pytest
import json
import time
import gamification as gm

def test_xp_for_level():
  """Test XP progression curve."""
  assert gm.xp_for_level(1) == 500
  assert gm.xp_for_level(2) == 600
  assert gm.xp_for_level(3) == 720
  assert gm.xp_for_level(4) == 864

def test_grant_xp_no_levelup(test_db):
  """Test granting XP without level up."""
  tg_id = 123
  test_db.execute("INSERT INTO gamification (tg_id, profile, xp_current, xp_next_level, level) VALUES (?, ?, ?, ?, ?)",
                  (tg_id, "member", 0, 500, 1))
  test_db.commit()

  gm.grant_xp(test_db, tg_id, "member", 100)

  row = test_db.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()
  assert row["xp_current"] == 100
  assert row["level"] == 1

def test_grant_xp_with_levelup(test_db):
  """Test granting XP with level up."""
  tg_id = 123
  test_db.execute("INSERT INTO gamification (tg_id, profile, xp_current, xp_next_level, level) VALUES (?, ?, ?, ?, ?)",
                  (tg_id, "member", 400, 500, 1))
  test_db.commit()

  gm.grant_xp(test_db, tg_id, "member", 150)

  row = test_db.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()
  assert row["level"] == 2
  assert row["xp_current"] == 50

def test_update_streak_first_activity(test_db):
  """Test streak on first activity."""
  tg_id = 123
  test_db.execute("INSERT INTO gamification (tg_id, profile, streak_current, streak_max, streak_last_date) VALUES (?, ?, ?, ?, ?)",
                  (tg_id, "member", 0, 0, None))
  test_db.commit()

  gm.update_streak(test_db, tg_id)

  row = test_db.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()
  assert row["streak_current"] == 1

def test_unlock_achievement(test_db):
  """Test unlocking an achievement."""
  tg_id = 123
  test_db.execute("INSERT INTO gamification (tg_id, profile, achievements, level) VALUES (?, ?, ?, ?)",
                  (tg_id, "member", "[]", 1))
  test_db.execute("INSERT INTO achievements (code, title, icon, condition_type, condition_value, xp_bonus) VALUES (?, ?, ?, ?, ?, ?)",
                  ("first_mission", "First Mission", "🚀", "missions", 1, 25))
  test_db.commit()

  ach = test_db.execute("SELECT * FROM achievements WHERE code = ?", ("first_mission",)).fetchone()
  gm.unlock_achievement(test_db, tg_id, ach)

  row = test_db.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()
  achievements = json.loads(row["achievements"])
  assert len(achievements) == 1
  assert achievements[0]["code"] == "first_mission"

def test_calculate_level():
  """Test level calculation from XP."""
  assert gm.calculate_level(400) == 1
  assert gm.calculate_level(600) == 2
  assert gm.calculate_level(1200) == 2
