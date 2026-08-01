"""FastAPI app for BeGlobal Member Miniapp."""
import os
import json
import time
import hashlib
import hmac
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, Header, Form
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import db
from gamification import grant_xp, check_achievements, update_streak, get_dashboard, calculate_level

load_dotenv()

app = FastAPI(title="BeGlobal Member Miniapp", docs_url=None, redoc_url=None)
db.init_db()

# ============================================================================
# AUTH
# ============================================================================

def verify_telegram_init_data(x_tg_init_data: str = Header(default="")):
  """Verify Telegram WebApp initData using HMAC-SHA256."""
  if not x_tg_init_data:
    raise HTTPException(status_code=401, detail="Missing initData")

  try:
    # Parse initData
    pairs = {}
    for pair in x_tg_init_data.split("&"):
      key, val = pair.split("=", 1)
      pairs[key] = val

    their_hash = pairs.pop("hash", None)
    if not their_hash:
      raise HTTPException(status_code=401, detail="Missing hash")

    # Calculate expected hash
    bot_token = os.environ.get("MEMBER_BOT_TOKEN", "")
    secret = hashlib.sha256(f"WebAppData{bot_token}".encode()).digest()

    data_check = "\n".join(f"{k}={v}" for k, v in sorted(pairs.items()))
    calc_hash = hmac.new(secret, data_check.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(calc_hash, their_hash):
      raise HTTPException(status_code=401, detail="Invalid signature")

    # Check auth_date (not older than 1 hour)
    auth_date = int(pairs.get("auth_date", "0"))
    if time.time() - auth_date > 3600:
      raise HTTPException(status_code=401, detail="InitData expired")

    # Extract user
    user_data = json.loads(pairs.get("user", "{}"))
    return {"id": user_data.get("id"), "username": user_data.get("username", "")}

  except Exception as e:
    raise HTTPException(status_code=401, detail=str(e))

# ============================================================================
# HEALTH & INFO
# ============================================================================

@app.get("/healthz")
def healthz():
  return {"ok": True, "timestamp": time.time()}

@app.get("/info")
def info():
  return {
    "name": "BeGlobal Member Miniapp",
    "version": "1.0.0",
    "status": "active"
  }

# ============================================================================
# ONBOARDING
# ============================================================================

@app.post("/api/member/diagnosis")
def submit_diagnosis(
  experience: str = Form(...),
  product: str = Form(...),
  channel: str = Form(...),
  blocker: str = Form(...),
  capital: str = Form(...),
  user=Depends(verify_telegram_init_data)
):
  """Submit diagnosis answers and create user."""
  tg_id = user["id"]
  conn = db.get_db()

  with conn:
    # Create user
    conn.execute(
      """INSERT OR REPLACE INTO users
         (tg_id, profile, name, first_seen, experience_level, product_type,
          main_channel, main_blocker, onboarding_step, diagnosis_complete)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
      (tg_id, "member", user.get("username", ""), int(time.time()),
       experience, product, channel, blocker, "lessons", 1)
    )

    # Store diagnosis responses
    for code, val in [("experience", experience), ("product", product),
                      ("channel", channel), ("blocker", blocker), ("capital", capital)]:
      conn.execute(
        "INSERT OR REPLACE INTO diagnosis_responses (tg_id, question_code, response, timestamp) VALUES (?, ?, ?, ?)",
        (tg_id, code, val, int(time.time()))
      )

    # Create gamification entry
    conn.execute(
      "INSERT OR IGNORE INTO gamification (tg_id, profile) VALUES (?, ?)",
      (tg_id, "member")
    )

    # Log to audit trail
    conn.execute(
      "INSERT INTO audit_trail (timestamp, actor_tg_id, actor_profile, action, resource_type, resource_id) VALUES (?, ?, ?, ?, ?, ?)",
      (int(time.time()), tg_id, "member", "diagnosis_completed", "user", str(tg_id))
    )

  conn.close()
  return {"ok": True, "status": "diagnosis_complete"}

# ============================================================================
# LESSONS
# ============================================================================

@app.get("/api/member/lessons")
def get_lessons(status: str = "all", user=Depends(verify_telegram_init_data)):
  """Get lessons for member."""
  tg_id = user["id"]
  conn = db.get_db()

  lessons_data = conn.execute(
    """SELECT l.id, l.code, l.title, l.description, l.difficulty,
              l.xp_reward, l.duration_minutes, l.prerequisites,
              COALESCE(lp.status, 'locked') as status,
              COALESCE(lp.completed_at, 0) as completed_at
       FROM lessons l
       LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.tg_id = ?
       ORDER BY l.ord ASC""",
    (tg_id,)
  ).fetchall()

  conn.close()

  result = []
  for lesson in lessons_data:
    result.append({
      "id": lesson["id"],
      "code": lesson["code"],
      "title": lesson["title"],
      "description": lesson["description"],
      "difficulty": lesson["difficulty"],
      "xp_reward": lesson["xp_reward"],
      "duration_minutes": lesson["duration_minutes"],
      "prerequisites": json.loads(lesson["prerequisites"]),
      "status": lesson["status"],
      "completed_at": lesson["completed_at"]
    })

  return {"lessons": result}

@app.get("/api/member/lessons/{lesson_id}")
def get_lesson(lesson_id: int, user=Depends(verify_telegram_init_data)):
  """Get single lesson detail."""
  tg_id = user["id"]
  conn = db.get_db()

  lesson = conn.execute(
    "SELECT * FROM lessons WHERE id = ?",
    (lesson_id,)
  ).fetchone()

  if not lesson:
    conn.close()
    raise HTTPException(status_code=404, detail="Lesson not found")

  progress = conn.execute(
    "SELECT * FROM lesson_progress WHERE tg_id = ? AND lesson_id = ?",
    (tg_id, lesson_id)
  ).fetchone()

  conn.close()

  return {
    "id": lesson["id"],
    "code": lesson["code"],
    "title": lesson["title"],
    "description": lesson["description"],
    "content_type": lesson["content_type"],
    "duration_minutes": lesson["duration_minutes"],
    "content_url": lesson["content_url"],
    "quiz_data": json.loads(lesson["quiz_data"] or "{}"),
    "xp_reward": lesson["xp_reward"],
    "prerequisites": json.loads(lesson["prerequisites"]),
    "status": progress["status"] if progress else "locked",
    "attempts": progress["attempts"] if progress else 0
  }

@app.post("/api/member/lessons/{lesson_id}/complete")
def complete_lesson(
  lesson_id: int,
  quiz_answers: str = Form(...),
  user=Depends(verify_telegram_init_data)
):
  """Mark lesson as complete."""
  tg_id = user["id"]
  conn = db.get_db()

  lesson = conn.execute("SELECT * FROM lessons WHERE id = ?", (lesson_id,)).fetchone()
  if not lesson:
    conn.close()
    raise HTTPException(status_code=404, detail="Lesson not found")

  with conn:
    # Update lesson progress
    conn.execute(
      """INSERT OR REPLACE INTO lesson_progress
         (tg_id, lesson_id, status, completed_at, attempts)
         VALUES (?, ?, ?, ?,
                (SELECT COALESCE(attempts, 0) + 1 FROM lesson_progress WHERE tg_id = ? AND lesson_id = ?))""",
      (tg_id, lesson_id, "completed", int(time.time()), tg_id, lesson_id)
    )

    # Award XP
    grant_xp(conn, tg_id, "member", lesson["xp_reward"])

    # Update gamification
    conn.execute(
      "UPDATE gamification SET lessons_completed = lessons_completed + 1 WHERE tg_id = ?",
      (tg_id,)
    )

    # Check achievements
    check_achievements(conn, tg_id, "member")

    # Update streak
    update_streak(conn, tg_id)

    # Audit log
    conn.execute(
      "INSERT INTO audit_trail (timestamp, actor_tg_id, actor_profile, action, resource_type, resource_id) VALUES (?, ?, ?, ?, ?, ?)",
      (int(time.time()), tg_id, "member", "lesson_completed", "lesson", str(lesson_id))
    )

    # Fetch updated gamification before closing
    gam = conn.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()

  conn.close()

  return {
    "ok": True,
    "xp_awarded": lesson["xp_reward"],
    "current_xp": gam["xp_current"],
    "current_level": gam["level"]
  }

# ============================================================================
# DASHBOARD
# ============================================================================

@app.get("/api/member/dashboard")
def get_dashboard_data(user=Depends(verify_telegram_init_data)):
  """Get dashboard data."""
  tg_id = user["id"]
  conn = db.get_db()

  gam = conn.execute("SELECT * FROM gamification WHERE tg_id = ?", (tg_id,)).fetchone()
  lessons = conn.execute("SELECT COUNT(*) as count FROM lesson_progress WHERE tg_id = ? AND status = 'completed'", (tg_id,)).fetchone()
  missions = conn.execute("SELECT COUNT(*) as count FROM mission_progress WHERE tg_id = ? AND status = 'completed'", (tg_id,)).fetchone()

  conn.close()

  if not gam:
    raise HTTPException(status_code=404, detail="User not initialized")

  return {
    "xp": gam["xp_current"],
    "level": gam["level"],
    "streak": gam["streak_current"],
    "streak_max": gam["streak_max"],
    "lessons_completed": lessons["count"],
    "missions_completed": missions["count"],
    "achievements": json.loads(gam["achievements"]),
    "xp_to_next": gam["xp_next_level"] - gam["xp_current"]
  }

if __name__ == "__main__":
  import uvicorn
  uvicorn.run(app, host="0.0.0.0", port=8090)
