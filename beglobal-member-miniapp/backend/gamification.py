"""Gamification engine: XP, levels, achievements, streaks."""
import json
import time
from datetime import datetime, timedelta

# XP progression curve: 500 * 1.2^(n-1)
def xp_for_level(level: int) -> int:
  """Calculate total XP needed to reach this level."""
  return int(500 * (1.2 ** (level - 1)))

def grant_xp(conn, tg_id: int, profile: str, amount: int):
  """Award XP to user and level up if needed."""
  gam = conn.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()

  if not gam:
    return

  current_xp = gam["xp_current"] + amount
  current_level = gam["level"]
  xp_for_next = xp_for_level(current_level + 1)

  # Check level up
  while current_xp >= xp_for_next:
    current_xp -= xp_for_next
    current_level += 1
    xp_for_next = xp_for_level(current_level + 1)
    # Trigger achievement for level milestone
    check_level_achievement(conn, tg_id, current_level)

  conn.execute(
    "UPDATE gamification SET xp_current = ?, level = ?, xp_next_level = ? WHERE tg_id = ?",
    (current_xp, current_level, xp_for_next, tg_id)
  )

def update_streak(conn, tg_id: int):
  """Update daily streak."""
  gam = conn.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()

  if not gam:
    return

  today = datetime.utcnow().date().isoformat()
  last_date = gam["streak_last_date"]

  if last_date == today:
    return

  yesterday = (datetime.utcnow().date() - timedelta(days=1)).isoformat()
  if last_date == yesterday:
    streak = gam["streak_current"] + 1
  else:
    streak = 1

  streak_max = max(gam["streak_max"], streak)

  conn.execute(
    "UPDATE gamification SET streak_current = ?, streak_max = ?, streak_last_date = ? WHERE tg_id = ?",
    (streak, streak_max, today, tg_id)
  )

  # Trigger streak achievements
  check_streak_achievement(conn, tg_id, streak)

def check_achievements(conn, tg_id: int, profile: str):
  """Check all achievement conditions."""
  gam = conn.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()
  if not gam:
    return

  achievements = json.loads(gam.get("achievements", "[]"))
  achievement_codes = [a["code"] for a in achievements]

  all_achievements = conn.execute("SELECT * FROM achievements").fetchall()

  for ach in all_achievements:
    if ach["code"] in achievement_codes:
      continue

    should_unlock = False

    if ach["condition_type"] == "missions":
      missions_count = conn.execute(
        "SELECT COUNT(*) as count FROM mission_progress WHERE tg_id = ? AND status = 'completed'",
        (tg_id,)
      ).fetchone()["count"]
      if missions_count >= ach["condition_value"]:
        should_unlock = True

    elif ach["condition_type"] == "streak":
      if gam["streak_current"] >= ach["condition_value"]:
        should_unlock = True

    elif ach["condition_type"] == "profile_level":
      if gam["level"] >= ach["condition_value"]:
        should_unlock = True

    if should_unlock:
      unlock_achievement(conn, tg_id, ach)

def check_level_achievement(conn, tg_id: int, level: int):
  """Check level-specific achievements."""
  achievements = conn.execute(
    "SELECT * FROM achievements WHERE condition_type = 'profile_level' AND condition_value = ?",
    (level,)
  ).fetchall()

  for ach in achievements:
    unlock_achievement(conn, tg_id, ach)

def check_streak_achievement(conn, tg_id: int, streak: int):
  """Check streak-specific achievements."""
  achievements = conn.execute(
    "SELECT * FROM achievements WHERE condition_type = 'streak' AND condition_value = ?",
    (streak,)
  ).fetchall()

  for ach in achievements:
    unlock_achievement(conn, tg_id, ach)

def unlock_achievement(conn, tg_id: int, achievement):
  """Unlock an achievement for user."""
  gam = conn.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()
  if not gam:
    return

  achievements = json.loads(gam.get("achievements", "[]"))
  codes = [a["code"] for a in achievements]

  if achievement["code"] in codes:
    return

  new_ach = {
    "code": achievement["code"],
    "title": achievement["title"],
    "icon": achievement["icon"],
    "unlocked_at": int(time.time())
  }
  achievements.append(new_ach)

  # Award XP bonus
  grant_xp(conn, tg_id, "member", achievement["xp_bonus"])

  conn.execute(
    "UPDATE gamification SET achievements = ? WHERE tg_id = ?",
    (json.dumps(achievements), tg_id)
  )

def get_dashboard(conn, tg_id: int) -> dict:
  """Get dashboard data."""
  gam = conn.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()

  if not gam:
    return None

  lessons = conn.execute(
    "SELECT COUNT(*) as count FROM lesson_progress WHERE tg_id = ? AND status = 'completed'",
    (tg_id,)
  ).fetchone()
  missions = conn.execute(
    "SELECT COUNT(*) as count FROM mission_progress WHERE tg_id = ? AND status = 'completed'",
    (tg_id,)
  ).fetchone()

  return {
    "xp": gam["xp_current"],
    "level": gam["level"],
    "streak": gam["streak_current"],
    "streak_max": gam["streak_max"],
    "lessons_completed": lessons["count"],
    "missions_completed": missions["count"],
    "achievements": json.loads(gam.get("achievements", "[]")),
    "xp_to_next": gam["xp_next_level"] - gam["xp_current"]
  }

def calculate_level(xp: int) -> int:
  """Calculate level from total XP."""
  level = 1
  while True:
    next_level_xp = xp_for_level(level + 1)
    if xp < next_level_xp:
      return level
    xp -= next_level_xp
    level += 1
