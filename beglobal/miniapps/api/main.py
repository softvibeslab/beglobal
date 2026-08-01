"""API de las Mini Apps Be Global Pro.

Ejecutar en desarrollo:
    DEV_BYPASS=1 uvicorn main:app --reload --port 8090

En producción sirve también las Mini Apps estáticas bajo /app/{perfil}/ y
guarda evidencias en MEDIA_DIR (Media Hub aislado).
"""
import json
import os
import time
import uuid

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

import db
import gamification
from auth import AuthError, verify_init_data

MEDIA_DIR = os.environ.get("MEDIA_DIR", os.path.join(os.path.dirname(__file__), "media"))
MAX_UPLOAD_BYTES = int(os.environ.get("MAX_UPLOAD_BYTES", str(20 * 1024 * 1024)))
WEBAPP_DIR = os.environ.get(
    "WEBAPP_DIR", os.path.join(os.path.dirname(__file__), "..", "webapp")
)

app = FastAPI(title="Be Global Mini Apps API", docs_url=None, redoc_url=None)
db.init_db()
os.makedirs(MEDIA_DIR, exist_ok=True)


def _user_for(profile: str):
    def dep(x_tg_init_data: str = Header(default="")):
        try:
            user = verify_init_data(profile, x_tg_init_data)
        except AuthError as e:
            raise HTTPException(status_code=401, detail=str(e))
        conn = db.connect()
        with conn:
            conn.execute(
                "INSERT OR IGNORE INTO users (tg_id, profile, name, first_seen) VALUES (?,?,?,?)",
                (user["id"], profile, user.get("first_name", ""), int(time.time())),
            )
            conn.execute(
                "INSERT INTO telemetry (tg_id, profile, event, created_at) VALUES (?,?,?,?)",
                (user["id"], profile, "api_request", int(time.time())),
            )
        conn.close()
        return user

    return dep


member_user = _user_for("member")
team_user = _user_for("team")
corporate_user = _user_for("corporate")


def _route_for(conn, tg_id: int) -> list[dict]:
    rows = conn.execute(
        """SELECT s.code, s.ord, s.title, s.description, s.deliverable,
                  COALESCE(p.status, 'pending') AS status
           FROM stages s
           LEFT JOIN progress p ON p.stage_code = s.code AND p.tg_id = ?
           ORDER BY s.ord""",
        (tg_id,),
    ).fetchall()
    return [dict(r) for r in rows]


def _current_stage(route: list[dict]) -> dict | None:
    for st in route:
        if st["status"] != "done":
            return st
    return None


# ── Member ─────────────────────────────────────────────────────────────

@app.get("/api/member/route")
def member_route(user=Depends(member_user)):
    conn = db.connect()
    route = _route_for(conn, user["id"])
    current = _current_stage(route)
    resources = []
    if current:
        resources = [
            dict(r)
            for r in conn.execute(
                "SELECT title, url FROM resources WHERE stage_code = ?", (current["code"],)
            ).fetchall()
        ]
    conn.close()
    done = sum(1 for s in route if s["status"] == "done")
    return {
        "user": {"id": user["id"], "name": user.get("first_name", "")},
        "route": route,
        "current": current,
        "resources": resources,
        "progress_pct": round(done / len(route) * 100) if route else 0,
    }


@app.post("/api/member/stage/{code}/status")
def member_stage_status(code: str, status: str = Form(...), user=Depends(member_user)):
    if status not in ("in_progress", "review"):
        raise HTTPException(400, "Estado no permitido; 'done' lo asigna el Equipo")
    conn = db.connect()
    if not conn.execute("SELECT 1 FROM stages WHERE code = ?", (code,)).fetchone():
        conn.close()
        raise HTTPException(404, "Etapa desconocida")
    with conn:
        conn.execute(
            """INSERT INTO progress (tg_id, stage_code, status, updated_at) VALUES (?,?,?,?)
               ON CONFLICT(tg_id, stage_code) DO UPDATE SET status=excluded.status,
               updated_at=excluded.updated_at""",
            (user["id"], code, status, int(time.time())),
        )
    conn.close()
    return {"ok": True}


@app.post("/api/member/evidence")
async def member_evidence(
    stage_code: str = Form(...),
    note: str = Form(""),
    file: UploadFile = File(...),
    user=Depends(member_user),
):
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "Archivo demasiado grande (máx. 20 MB)")
    safe_name = os.path.basename(file.filename or "evidencia")
    stored = f"member/{user['id']}/{uuid.uuid4().hex}_{safe_name}"
    dest = os.path.join(MEDIA_DIR, stored)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as f:
        f.write(data)
    conn = db.connect()
    with conn:
        cur = conn.execute(
            """INSERT INTO evidence (tg_id, stage_code, filename, stored_path, note, created_at)
               VALUES (?,?,?,?,?,?)""",
            (user["id"], stage_code, safe_name, stored, note, int(time.time())),
        )
        conn.execute(
            """INSERT INTO progress (tg_id, stage_code, status, updated_at) VALUES (?,?,'review',?)
               ON CONFLICT(tg_id, stage_code) DO UPDATE SET status='review',
               updated_at=excluded.updated_at""",
            (user["id"], stage_code, int(time.time())),
        )
    conn.close()
    return {"ok": True, "evidence_id": cur.lastrowid}


@app.get("/api/member/evidence")
def member_evidence_list(user=Depends(member_user)):
    conn = db.connect()
    rows = conn.execute(
        """SELECT id, stage_code, filename, note, status, score, review_note, created_at
           FROM evidence WHERE tg_id = ? ORDER BY created_at DESC""",
        (user["id"],),
    ).fetchall()
    conn.close()
    return {"evidence": [dict(r) for r in rows]}


@app.post("/api/member/escalate")
def member_escalate(description: str = Form(...), user=Depends(member_user)):
    conn = db.connect()
    with conn:
        conn.execute(
            "INSERT INTO escalations (tg_id, description, created_at) VALUES (?,?,?)",
            (user["id"], description.strip()[:500], int(time.time())),
        )
    conn.close()
    return {"ok": True}


# ── Team ───────────────────────────────────────────────────────────────

STALE_SECONDS = 3 * 24 * 3600


@app.get("/api/team/queue")
def team_queue(user=Depends(team_user)):
    conn = db.connect()
    members = conn.execute(
        "SELECT tg_id, name, first_seen FROM users WHERE profile='member' ORDER BY first_seen"
    ).fetchall()
    now = int(time.time())
    out = []
    for m in members:
        route = _route_for(conn, m["tg_id"])
        current = _current_stage(route)
        last = conn.execute(
            "SELECT MAX(updated_at) AS t FROM progress WHERE tg_id = ?", (m["tg_id"],)
        ).fetchone()["t"] or m["first_seen"]
        out.append(
            {
                "tg_id": m["tg_id"],
                "name": m["name"],
                "stage": current["title"] if current else "Completado",
                "status": current["status"] if current else "done",
                "done": sum(1 for s in route if s["status"] == "done"),
                "total": len(route),
                "last_activity": last,
                "stalled": now - last > STALE_SECONDS,
            }
        )
    conn.close()
    return {"members": out}


@app.get("/api/team/inbox")
def team_inbox(user=Depends(team_user)):
    conn = db.connect()
    escalations = [
        dict(r)
        for r in conn.execute(
            """SELECT e.id, e.tg_id, u.name, e.description, e.created_at
               FROM escalations e LEFT JOIN users u ON u.tg_id=e.tg_id AND u.profile='member'
               WHERE e.status='open' ORDER BY e.created_at""",
        ).fetchall()
    ]
    evidence = [
        dict(r)
        for r in conn.execute(
            """SELECT e.id, e.tg_id, u.name, e.stage_code, e.filename, e.note, e.created_at
               FROM evidence e LEFT JOIN users u ON u.tg_id=e.tg_id AND u.profile='member'
               WHERE e.status='pending' ORDER BY e.created_at""",
        ).fetchall()
    ]
    conn.close()
    return {"escalations": escalations, "evidence": evidence}


@app.post("/api/team/escalations/{esc_id}/resolve")
def team_resolve(
    esc_id: int,
    action: str = Form(...),
    resolution: str = Form(""),
    user=Depends(team_user),
):
    if action not in ("approved", "rejected"):
        raise HTTPException(400, "Acción inválida")
    conn = db.connect()
    with conn:
        n = conn.execute(
            """UPDATE escalations SET status=?, resolution=?, resolved_by=?, resolved_at=?
               WHERE id=? AND status='open'""",
            (action, resolution.strip()[:500], user["id"], int(time.time()), esc_id),
        ).rowcount
    conn.close()
    if not n:
        raise HTTPException(404, "Escalamiento no encontrado o ya resuelto")
    return {"ok": True}


@app.post("/api/team/evidence/{ev_id}/review")
def team_review(
    ev_id: int,
    status: str = Form(...),
    score: int = Form(...),
    review_note: str = Form(""),
    user=Depends(team_user),
):
    if status not in ("approved", "rejected") or not 1 <= score <= 5:
        raise HTTPException(400, "Revisión inválida (status approved/rejected, score 1–5)")
    conn = db.connect()
    row = conn.execute(
        "SELECT tg_id, stage_code FROM evidence WHERE id=? AND status='pending'", (ev_id,)
    ).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Evidencia no encontrada o ya revisada")
    with conn:
        conn.execute(
            "UPDATE evidence SET status=?, score=?, review_note=?, reviewed_by=? WHERE id=?",
            (status, score, review_note.strip()[:500], user["id"], ev_id),
        )
        if status == "approved":
            conn.execute(
                """INSERT INTO progress (tg_id, stage_code, status, updated_at) VALUES (?,?,'done',?)
                   ON CONFLICT(tg_id, stage_code) DO UPDATE SET status='done',
                   updated_at=excluded.updated_at""",
                (row["tg_id"], row["stage_code"], int(time.time())),
            )
        else:
            conn.execute(
                "UPDATE progress SET status='in_progress', updated_at=? WHERE tg_id=? AND stage_code=?",
                (int(time.time()), row["tg_id"], row["stage_code"]),
            )
    conn.close()
    return {"ok": True}


# ── Corporate ──────────────────────────────────────────────────────────

@app.get("/api/corporate/metrics")
def corporate_metrics(user=Depends(corporate_user)):
    conn = db.connect()
    members = conn.execute(
        "SELECT COUNT(*) AS n FROM users WHERE profile='member'"
    ).fetchone()["n"]
    active = conn.execute(
        "SELECT COUNT(DISTINCT tg_id) AS n FROM progress"
    ).fetchone()["n"]
    missions_done = conn.execute(
        "SELECT COUNT(*) AS n FROM progress WHERE stage_code='MISSION' AND status='done'"
    ).fetchone()["n"]
    avg_score = conn.execute(
        "SELECT AVG(score) AS s FROM evidence WHERE score IS NOT NULL"
    ).fetchone()["s"]
    ttv = conn.execute(
        """SELECT AVG(e.created_at - u.first_seen) AS s FROM users u
           JOIN evidence e ON e.tg_id = u.tg_id AND u.profile='member'
           WHERE e.id = (SELECT MIN(id) FROM evidence WHERE tg_id = u.tg_id)"""
    ).fetchone()["s"]
    open_esc = conn.execute(
        "SELECT COUNT(*) AS n FROM escalations WHERE status='open'"
    ).fetchone()["n"]
    conn.close()
    return {
        "members_registered": members,
        "members_active": active,
        "missions_completed": missions_done,
        "avg_evidence_score": round(avg_score, 2) if avg_score is not None else None,
        "avg_time_to_value_min": round(ttv / 60) if ttv is not None else None,
        "open_escalations": open_esc,
    }


@app.get("/api/corporate/decisions")
def corporate_decisions(user=Depends(corporate_user)):
    conn = db.connect()
    rows = conn.execute(
        "SELECT id, title, detail, status, created_at, decided_at FROM decisions ORDER BY id"
    ).fetchall()
    conn.close()
    return {"decisions": [dict(r) for r in rows]}


@app.post("/api/corporate/decisions/{dec_id}/decide")
def corporate_decide(dec_id: int, action: str = Form(...), user=Depends(corporate_user)):
    if action not in ("approved", "rejected"):
        raise HTTPException(400, "Acción inválida")
    conn = db.connect()
    with conn:
        n = conn.execute(
            """UPDATE decisions SET status=?, decided_by=?, decided_at=?
               WHERE id=? AND status='pending'""",
            (action, user["id"], int(time.time()), dec_id),
        ).rowcount
    conn.close()
    if not n:
        raise HTTPException(404, "Decisión no encontrada o ya decidida")
    return {"ok": True}


@app.post("/api/corporate/decisions")
def corporate_new_decision(
    title: str = Form(...), detail: str = Form(""), user=Depends(corporate_user)
):
    conn = db.connect()
    with conn:
        conn.execute(
            "INSERT INTO decisions (title, detail, created_at) VALUES (?,?,?)",
            (title.strip()[:200], detail.strip()[:500], int(time.time())),
        )
    conn.close()
    return {"ok": True}


@app.get("/api/corporate/gates")
def corporate_gates(user=Depends(corporate_user)):
    conn = db.connect()
    rows = conn.execute("SELECT id, ord, title, status FROM gates ORDER BY ord").fetchall()
    conn.close()
    return {"gates": [dict(r) for r in rows]}


# ── GAMIFICATION: ONBOARDING INTELIGENTE ──────────────────────────────

@app.get("/api/onboarding/diagnosis/questions")
def diagnosis_questions(user=Depends(member_user)):
    """Retorna preguntas del diagnóstico personalizado."""
    return {"questions": db.DIAGNOSIS_QUESTIONS}


@app.post("/api/onboarding/diagnosis/submit")
def submit_diagnosis(responses: dict = Form(...), user=Depends(member_user)):
    """Procesa respuestas de diagnóstico y personaliza la ruta."""
    try:
        responses_data = json.loads(responses) if isinstance(responses, str) else responses
    except (json.JSONDecodeError, TypeError):
        raise HTTPException(400, "Respuestas inválidas")

    conn = db.connect()
    with conn:
        # Guardar respuestas
        for q_code, answer in responses_data.items():
            conn.execute(
                """INSERT INTO diagnosis_responses (tg_id, question_code, response, timestamp)
                   VALUES (?,?,?,?) ON CONFLICT(tg_id, question_code) DO UPDATE SET response=excluded.response""",
                (user["id"], q_code, answer, int(time.time()))
            )

        # Actualizar perfil dinámico
        experience = responses_data.get("experience", "beginner")
        product = responses_data.get("product", "physical")
        channel = responses_data.get("channel", "instagram")
        blocker = responses_data.get("blocker", "conocimiento")

        conn.execute(
            """UPDATE users SET experience_level=?, product_type=?, main_channel=?,
               main_blocker=?, onboarding_step=?, diagnosis_complete=?
               WHERE tg_id=? AND profile='member'""",
            (experience, product, channel, blocker, "lessons", 1, user["id"])
        )

        # Inicializar gamificación
        conn.execute(
            """INSERT OR IGNORE INTO gamification (tg_id, profile, level, xp_current, xp_next_level)
               VALUES (?,?,'member',1,0,500)""",
            (user["id"],)
        )

    # Recomendación de lecciones
    recommended_lessons = gamification.recommend_lessons(experience, product, responses_data, conn)

    conn.close()
    return {
        "ok": True,
        "profile_level": experience,
        "recommended_lessons": recommended_lessons,
        "next_step": "lessons"
    }


# ── GAMIFICATION: LECCIONES ───────────────────────────────────────────

@app.get("/api/lessons")
def list_lessons(user=Depends(member_user)):
    """Lista de lecciones desbloqueadas y estado de progreso."""
    conn = db.connect()

    # Obtener diagnóstico
    diag = conn.execute(
        "SELECT experience_level FROM users WHERE tg_id=? AND profile='member'",
        (user["id"],)
    ).fetchone()

    difficulty_filter = "easy" if not diag or diag["experience_level"] == "beginner" else "medium"

    lessons = conn.execute(
        """SELECT l.id, l.code, l.title, l.description, l.duration_minutes, l.difficulty, l.xp_reward,
                  COALESCE(lp.status, 'locked') AS status, lp.quiz_score
           FROM lessons l
           LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.tg_id = ?
           WHERE l.difficulty IN ('easy', ?)
           ORDER BY l.ord""",
        (user["id"], difficulty_filter)
    ).fetchall()

    conn.close()
    return {"lessons": [dict(r) for r in lessons]}


@app.get("/api/lessons/{lesson_id}")
def get_lesson(lesson_id: int, user=Depends(member_user)):
    """Obtiene detalles de una lección específica."""
    conn = db.connect()

    lesson = conn.execute(
        "SELECT id, code, title, description, content_type, content_url, quiz_data, xp_reward FROM lessons WHERE id=?",
        (lesson_id,)
    ).fetchone()

    if not lesson:
        conn.close()
        raise HTTPException(404, "Lección no encontrada")

    progress = conn.execute(
        "SELECT status, quiz_score, attempts FROM lesson_progress WHERE tg_id=? AND lesson_id=?",
        (user["id"], lesson_id)
    ).fetchone()

    conn.close()

    return {
        "lesson": dict(lesson),
        "progress": dict(progress) if progress else {"status": "locked", "quiz_score": None, "attempts": 0}
    }


@app.post("/api/lessons/{lesson_id}/complete")
def complete_lesson(lesson_id: int, quiz_score: int = Form(None), user=Depends(member_user)):
    """Marca lección como completada y otorga XP."""
    conn = db.connect()

    lesson = conn.execute("SELECT xp_reward FROM lessons WHERE id=?", (lesson_id,)).fetchone()
    if not lesson:
        conn.close()
        raise HTTPException(404, "Lección no encontrada")

    with conn:
        conn.execute(
            """INSERT INTO lesson_progress (tg_id, lesson_id, status, quiz_score, completed_at)
               VALUES (?,?,'completed',?,?) ON CONFLICT(tg_id, lesson_id) DO UPDATE SET
               status='completed', quiz_score=excluded.quiz_score, completed_at=excluded.completed_at""",
            (user["id"], lesson_id, quiz_score, int(time.time()))
        )

        # Incrementar XP
        xp_result = gamification.grant_xp(conn, user["id"], "member", lesson["xp_reward"])

        # Actualizar contador de lecciones
        conn.execute(
            "UPDATE gamification SET lessons_completed = lessons_completed + 1 WHERE tg_id=? AND profile='member'",
            (user["id"],)
        )

        # Verificar logros
        new_achievements = gamification.check_achievements(conn, user["id"], "member")

    conn.close()

    return {
        "ok": True,
        "xp_gained": lesson["xp_reward"],
        "level_up": xp_result["level_up"],
        "new_level": xp_result["new_level"] if xp_result["level_up"] else None,
        "new_achievements": new_achievements
    }


# ── GAMIFICATION: MISIONES ────────────────────────────────────────────

@app.get("/api/missions")
def list_missions(user=Depends(member_user)):
    """Lista de misiones desbloqueadas con dificultad adaptativa."""
    conn = db.connect()

    # Obtener nivel actual
    gam = conn.execute(
        "SELECT level FROM gamification WHERE tg_id=? AND profile='member'",
        (user["id"],)
    ).fetchone()

    level = gam["level"] if gam else 1

    missions = conn.execute(
        """SELECT m.id, m.code, m.title, m.description, m.difficulty, m.xp_reward,
                  m.time_estimate_minutes, m.deliverable_type,
                  COALESCE(mp.status, 'locked') AS status, mp.attempts, mp.score
           FROM missions m
           LEFT JOIN mission_progress mp ON mp.mission_id = m.id AND mp.tg_id = ?
           WHERE m.ord <= ?
           ORDER BY m.ord""",
        (user["id"], level * 2)
    ).fetchall()

    conn.close()
    return {"missions": [dict(r) for r in missions]}


@app.get("/api/missions/daily")
def get_daily_mission(user=Depends(member_user)):
    """Obtiene la misión diaria destacada."""
    conn = db.connect()

    # Misión diaria = primer misión no completada
    mission = conn.execute(
        """SELECT m.id, m.code, m.title, m.description, m.xp_reward, m.time_estimate_minutes
           FROM missions m
           LEFT JOIN mission_progress mp ON mp.mission_id = m.id AND mp.tg_id = ?
           WHERE COALESCE(mp.status, 'locked') != 'completed'
           ORDER BY m.ord LIMIT 1""",
        (user["id"],)
    ).fetchone()

    conn.close()

    if not mission:
        return {"mission": None, "message": "¡Completaste todas las misiones!"}

    return {"mission": dict(mission)}


@app.post("/api/missions/{mission_id}/submit")
async def submit_mission(
    mission_id: int,
    note: str = Form(""),
    file: UploadFile = File(...),
    user=Depends(member_user),
):
    """Envía evidencia de misión completada."""
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "Archivo demasiado grande (máx. 20 MB)")

    conn = db.connect()
    mission = conn.execute(
        "SELECT xp_reward, coins_reward FROM missions WHERE id=?",
        (mission_id,)
    ).fetchone()

    if not mission:
        conn.close()
        raise HTTPException(404, "Misión no encontrada")

    safe_name = os.path.basename(file.filename or "evidencia")
    stored = f"mission/{user['id']}/{uuid.uuid4().hex}_{safe_name}"
    dest = os.path.join(MEDIA_DIR, stored)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as f:
        f.write(data)

    with conn:
        conn.execute(
            """INSERT INTO mission_progress (tg_id, mission_id, status, attempts, started_at)
               VALUES (?,?,'review',1,?) ON CONFLICT(tg_id, mission_id) DO UPDATE SET
               status='review', attempts=attempts+1""",
            (user["id"], mission_id, int(time.time()))
        )

        # Registrar evidencia
        conn.execute(
            """INSERT INTO evidence (tg_id, stage_code, filename, stored_path, note, created_at)
               VALUES (?,?,'MISSION_' || ?,?,?,?)""",
            (user["id"], f"mission_{mission_id}", safe_name, stored, note, int(time.time()))
        )

        # Telemetría
        conn.execute(
            """INSERT INTO learning_sessions (tg_id, profile, session_type, content_id, started_at, ended_at, completed)
               VALUES (?,?,'mission',?,?,?,?)""",
            (user["id"], "member", mission_id, int(time.time()) - 600, int(time.time()), 1)
        )

    conn.close()
    return {"ok": True, "message": "Misión enviada a revisión"}


# ── GAMIFICATION: DASHBOARD ───────────────────────────────────────────

@app.get("/api/gamification/dashboard")
def gamification_dashboard(user=Depends(member_user)):
    """Dashboard de gamificación personal."""
    conn = db.connect()
    dashboard = gamification.get_gamification_dashboard(conn, user["id"], "member")
    conn.close()
    return dashboard


@app.post("/api/gamification/complete-daily")
def complete_daily_mission(user=Depends(member_user)):
    """Marca completada la misión diaria y actualiza racha."""
    conn = db.connect()

    with conn:
        result = gamification.update_streak(conn, user["id"], "member")
        if result["bonus_xp"] > 0:
            gamification.grant_xp(conn, user["id"], "member", result["bonus_xp"])

    conn.close()

    return {
        "ok": True,
        "streak": result["streak"],
        "streak_bonus": result["bonus_xp"]
    }


# ── GAMIFICATION: TEAM (REVISIÓN DE MISIONES) ──────────────────────────

@app.get("/api/team/missions-queue")
def team_missions_queue(user=Depends(team_user)):
    """Cola de misiones por revisar."""
    conn = db.connect()

    missions_pending = conn.execute(
        """SELECT mp.id, mp.tg_id, u.name, m.title, m.xp_reward,
                  mp.completed_at, e.filename, COUNT(e.id) as evidence_count
           FROM mission_progress mp
           JOIN users u ON u.tg_id = mp.tg_id AND u.profile = 'member'
           JOIN missions m ON m.id = mp.mission_id
           LEFT JOIN evidence e ON e.tg_id = mp.tg_id AND e.stage_code LIKE 'mission_%'
           WHERE mp.status = 'review'
           GROUP BY mp.id, mp.tg_id, u.name, m.title, m.xp_reward, mp.completed_at, e.filename
           ORDER BY mp.completed_at""",
    ).fetchall()

    conn.close()
    return {"queue": [dict(r) for r in missions_pending]}


@app.post("/api/team/mission/{mp_id}/approve")
def approve_mission(
    mp_id: int,
    score: int = Form(...),
    feedback: str = Form(""),
    user=Depends(team_user),
):
    """Aprueba misión y otorga XP al miembro."""
    if not 1 <= score <= 5:
        raise HTTPException(400, "Score debe estar entre 1 y 5")

    conn = db.connect()

    mp = conn.execute(
        "SELECT tg_id, mission_id FROM mission_progress WHERE id=? AND status='review'",
        (mp_id,)
    ).fetchone()

    if not mp:
        conn.close()
        raise HTTPException(404, "Misión no encontrada o ya revisada")

    mission = conn.execute(
        "SELECT xp_reward FROM missions WHERE id=?", (mp["mission_id"],)
    ).fetchone()

    with conn:
        conn.execute(
            "UPDATE mission_progress SET status='completed', score=? WHERE id=?",
            (score, mp_id)
        )

        # Otorgar XP al miembro
        xp_result = gamification.grant_xp(conn, mp["tg_id"], "member", mission["xp_reward"])

        # Incrementar contador de misiones
        conn.execute(
            "UPDATE gamification SET missions_completed = missions_completed + 1 WHERE tg_id=? AND profile='member'",
            (mp["tg_id"],)
        )

        # Verificar nuevos logros
        gamification.check_achievements(conn, mp["tg_id"], "member")

        # Telemetría
        conn.execute(
            "INSERT INTO telemetry (tg_id, profile, event, created_at) VALUES (?,?,?,?)",
            (mp["tg_id"], "member", "mission_approved", int(time.time()))
        )

    conn.close()

    return {
        "ok": True,
        "xp_granted": mission["xp_reward"],
        "member_level": xp_result["new_level"]
    }


# ── GAMIFICATION: CORPORATE (MÉTRICAS) ────────────────────────────────

@app.get("/api/corporate/gamification-metrics")
def corporate_gamification_metrics(user=Depends(corporate_user)):
    """Métricas de engagement y gamificación."""
    conn = db.connect()

    total_members = conn.execute(
        "SELECT COUNT(*) as n FROM users WHERE profile='member'"
    ).fetchone()["n"]

    active_members = conn.execute(
        "SELECT COUNT(DISTINCT tg_id) as n FROM gamification WHERE profile='member' AND streak_current > 0"
    ).fetchone()["n"]

    avg_level = conn.execute(
        "SELECT ROUND(AVG(level), 1) as l FROM gamification WHERE profile='member'"
    ).fetchone()["l"] or 0

    total_missions_done = conn.execute(
        "SELECT COUNT(*) as n FROM mission_progress WHERE status='completed'"
    ).fetchone()["n"]

    total_xp = conn.execute(
        "SELECT SUM(points) as p FROM gamification WHERE profile='member'"
    ).fetchone()["p"] or 0

    conn.close()

    engagement_pct = round((active_members / total_members * 100), 1) if total_members else 0

    return {
        "total_registered": total_members,
        "active_this_week": active_members,
        "avg_level": avg_level,
        "total_missions_completed": total_missions_done,
        "total_xp_earned": total_xp,
        "engagement_pct": engagement_pct
    }


# ── ORCHESTRATOR: ROUTER CENTRAL ──────────────────────────────────────

def _orchestrator_user(x_tg_init_data: str = Header(default="")):
    """Intenta validar contra todos los perfiles para detectar cuál es el usuario."""
    for profile in ("member", "team", "corporate"):
        try:
            user = verify_init_data(profile, x_tg_init_data)
            conn = db.connect()
            with conn:
                conn.execute(
                    "INSERT OR IGNORE INTO users (tg_id, profile, name, first_seen) VALUES (?,?,?,?)",
                    (user["id"], profile, user.get("first_name", ""), int(time.time())),
                )
            conn.close()
            return {"id": user["id"], "profile": profile, "first_name": user.get("first_name", "")}
        except AuthError:
            continue
    raise HTTPException(status_code=401, detail="No autorizado en ningún perfil")


@app.get("/api/orchestrator/detect-profile")
def detect_profile(user=Depends(_orchestrator_user)):
    """Detecta el perfil actual del usuario."""
    conn = db.connect()

    current_user = conn.execute(
        "SELECT profile, onboarding_step, diagnosis_complete FROM users WHERE tg_id=?",
        (user["id"],)
    ).fetchone()

    escalation_pending = False
    escalation_message = None

    if current_user and current_user["profile"] == "member":
        # Verificar si es elegible para escalar a Team
        gam = conn.execute(
            "SELECT missions_completed FROM gamification WHERE tg_id=? AND profile='member'",
            (user["id"],)
        ).fetchone()

        if gam and gam["missions_completed"] >= 5:
            escalation_pending = True
            escalation_message = f"¡Completaste {gam['missions_completed']} misiones! ¿Listo para ayudar a otros?"

    elif current_user and current_user["profile"] == "team":
        # Verificar si es elegible para escalar a Corporate
        team_stats = conn.execute(
            "SELECT COUNT(*) as reviewed FROM mission_progress WHERE status='completed' AND tg_id=?",
            (user["id"],)
        ).fetchone()

        if team_stats and team_stats["reviewed"] >= 10:
            escalation_pending = True
            escalation_message = f"¡Revisaste {team_stats['reviewed']} misiones! ¿Listo para gobernar?"

    conn.close()

    return {
        "profile": current_user["profile"] if current_user else user["profile"],
        "onboarding_complete": bool(current_user and current_user["diagnosis_complete"]),
        "escalation_pending": escalation_pending,
        "escalation_message": escalation_message,
        "permissions": {
            "can_review_missions": current_user and current_user["profile"] in ("team", "corporate"),
            "can_access_metrics": current_user and current_user["profile"] in ("corporate",),
            "can_make_decisions": current_user and current_user["profile"] == "corporate"
        }
    }


@app.get("/api/orchestrator/onboarding-status")
def onboarding_status(user=Depends(_orchestrator_user)):
    """Retorna qué paso del onboarding falta completar."""
    conn = db.connect()

    current_user = conn.execute(
        "SELECT profile, onboarding_step, diagnosis_complete FROM users WHERE tg_id=?",
        (user["id"],)
    ).fetchone()

    if not current_user:
        conn.close()
        return {"completed_steps": [], "next_step": "profile_selection", "profile": user["profile"]}

    steps = []
    next_step = None

    if current_user["profile"] == "member":
        if current_user["diagnosis_complete"]:
            steps = ["diagnosis"]
            next_step = "lessons"
        else:
            next_step = "diagnosis"
    else:
        # Team y Corporate: setup más simple
        steps = ["profile_setup"]
        next_step = "dashboard"

    conn.close()

    return {
        "profile": current_user["profile"],
        "completed_steps": steps,
        "next_step": next_step,
        "message": f"Paso siguiente: {next_step}"
    }


@app.post("/api/orchestrator/acknowledge-setup")
def acknowledge_setup(user=Depends(_orchestrator_user)):
    """Marca el setup inicial como completado."""
    conn = db.connect()

    with conn:
        current = conn.execute(
            "SELECT profile FROM users WHERE tg_id=?",
            (user["id"],)
        ).fetchone()

        if not current:
            conn.close()
            raise HTTPException(404, "Usuario no encontrado")

        profile = current["profile"]

        if profile == "member":
            conn.execute(
                "UPDATE users SET onboarding_step='lessons' WHERE tg_id=?",
                (user["id"],)
            )
        else:
            conn.execute(
                "UPDATE users SET onboarding_step='dashboard' WHERE tg_id=?",
                (user["id"],)
            )

        # Audit log
        conn.execute(
            "INSERT INTO telemetry (tg_id, profile, event, created_at) VALUES (?,?,?,?)",
            (user["id"], profile, "setup_acknowledged", int(time.time()))
        )

    conn.close()

    return {"ok": True, "message": "Setup completado"}


# ── TEAM: MISIONES EN REVISIÓN ────────────────────────────────────────

@app.get("/api/team/missions-queue")
def team_missions_queue(difficulty: str = "all", user=Depends(team_user)):
    """Lista de misiones enviadas por miembros esperando revisión."""
    conn = db.connect()

    query = """
        SELECT m.id, m.code, m.title, m.difficulty, m.xp_reward,
               u.name as member_name, mp.started_at, mp.status,
               e.filename, e.note as member_note
        FROM mission_progress mp
        JOIN missions m ON mp.mission_id = m.id
        JOIN users u ON mp.tg_id = u.tg_id
        LEFT JOIN evidence e ON mp.id = e.mission_progress_id
        WHERE mp.status = 'review'
    """

    if difficulty != "all":
        query += f" AND m.difficulty = '{difficulty}'"

    query += " ORDER BY mp.started_at ASC"

    missions = conn.execute(query).fetchall()
    conn.close()

    return {
        "missions": [
            {
                "id": m["id"],
                "title": m["title"],
                "member_name": m["member_name"] or "Anónimo",
                "difficulty": m["difficulty"],
                "xp_reward": m["xp_reward"],
                "submitted_ago": timeAgo(m["started_at"]) if m["started_at"] else "?",
                "member_note": m["member_note"] or "",
                "evidence_file": m["filename"]
            }
            for m in missions
        ]
    }


@app.post("/api/team/missions/approve-bulk")
def approve_missions_bulk(mission_ids: str = Form(...), user=Depends(team_user)):
    """Aprueba múltiples misiones de una vez con score genérico."""
    try:
        ids = [int(x) for x in mission_ids.split(",") if x.strip()]
    except ValueError:
        raise HTTPException(400, "mission_ids debe ser números separados por coma")

    if not ids:
        raise HTTPException(400, "Sin misiones para aprobar")

    conn = db.connect()

    with conn:
        approved_count = 0
        for mission_id in ids:
            mp = conn.execute(
                "SELECT tg_id FROM mission_progress WHERE mission_id=? AND status='review'",
                (mission_id,)
            ).fetchone()

            if not mp:
                continue

            mission = conn.execute(
                "SELECT xp_reward FROM missions WHERE id=?",
                (mission_id,)
            ).fetchone()

            if mission:
                conn.execute(
                    "UPDATE mission_progress SET status='completed', score=4 WHERE mission_id=?",
                    (mission_id,)
                )

                # Otorgar XP
                gamification.grant_xp(conn, mp["tg_id"], "member", mission["xp_reward"])

                # Incrementar contador
                conn.execute(
                    "UPDATE gamification SET missions_completed = missions_completed + 1 WHERE tg_id=? AND profile='member'",
                    (mp["tg_id"],)
                )

                approved_count += 1

    conn.close()

    return {"ok": True, "approved": approved_count}


@app.get("/api/team/analytics")
def team_analytics(user=Depends(team_user)):
    """Métricas del equipo de revisión."""
    conn = db.connect()

    seven_days_ago = int(time.time()) - (7 * 86400)

    missions_reviewed = conn.execute(
        "SELECT COUNT(*) as n FROM mission_progress WHERE status='completed' AND started_at > ?",
        (seven_days_ago,)
    ).fetchone()["n"]

    avg_score = conn.execute(
        "SELECT COALESCE(AVG(score), 0) as s FROM mission_progress WHERE status='completed' AND started_at > ?",
        (seven_days_ago,)
    ).fetchone()["s"]

    total_reviewed = conn.execute(
        "SELECT COUNT(*) as n FROM mission_progress WHERE status='completed' AND started_at > ?",
        (seven_days_ago,)
    ).fetchone()["n"]

    rejected = conn.execute(
        "SELECT COUNT(*) as n FROM mission_progress WHERE status='rejected' AND started_at > ?",
        (seven_days_ago,)
    ).fetchone()["n"]

    rejection_rate = (rejected / (total_reviewed + rejected) * 100) if (total_reviewed + rejected) > 0 else 0

    avg_time = conn.execute(
        "SELECT COALESCE(AVG(CAST(completed_at - started_at AS FLOAT)), 0) as t FROM mission_progress WHERE status='completed' AND started_at > ? AND completed_at IS NOT NULL",
        (seven_days_ago,)
    ).fetchone()["t"]

    conn.close()

    return {
        "missions_reviewed": missions_reviewed,
        "avg_score": round(avg_score, 2),
        "rejection_rate": round(rejection_rate, 1),
        "avg_review_time_minutes": round(avg_time / 60) if avg_time > 0 else 0
    }


@app.get("/api/team/history")
def team_history(days: int = 7, user=Depends(team_user)):
    """Historial de misiones revisadas en los últimos N días."""
    conn = db.connect()

    cutoff = int(time.time()) - (days * 86400)

    history = conn.execute(
        """
        SELECT m.title, mp.score, mp.status, mp.started_at, u.name as member_name
        FROM mission_progress mp
        JOIN missions m ON mp.mission_id = m.id
        JOIN users u ON mp.tg_id = u.tg_id
        WHERE mp.started_at > ?
        ORDER BY mp.started_at DESC
        LIMIT 50
        """,
        (cutoff,)
    ).fetchall()

    conn.close()

    return {
        "history": [
            {
                "mission_title": h["title"],
                "member_name": h["member_name"] or "Anónimo",
                "score": h["score"],
                "action": h["status"],
                "timestamp_ago": timeAgo(h["started_at"])
            }
            for h in history
        ]
    }


@app.post("/api/missions/{mission_id}/approve")
def approve_mission_from_team(mission_id: int, score: int = Form(...), feedback: str = Form(""), user=Depends(team_user)):
    """Aprueba una misión y otorga XP al miembro."""
    if not 1 <= score <= 5:
        raise HTTPException(400, "Score debe estar entre 1 y 5")

    conn = db.connect()

    mp = conn.execute(
        "SELECT tg_id FROM mission_progress WHERE mission_id=? AND status='review'",
        (mission_id,)
    ).fetchone()

    if not mp:
        conn.close()
        raise HTTPException(404, "Misión no encontrada o no está en revisión")

    mission = conn.execute(
        "SELECT xp_reward FROM missions WHERE id=?",
        (mission_id,)
    ).fetchone()

    if not mission:
        conn.close()
        raise HTTPException(404, "Misión no existe")

    with conn:
        conn.execute(
            "UPDATE mission_progress SET status='completed', score=? WHERE mission_id=?",
            (score, mission_id)
        )

        xp_result = gamification.grant_xp(conn, mp["tg_id"], "member", mission["xp_reward"])

        conn.execute(
            "UPDATE gamification SET missions_completed = missions_completed + 1 WHERE tg_id=? AND profile='member'",
            (mp["tg_id"],)
        )

        gamification.check_achievements(conn, mp["tg_id"], "member")

        conn.execute(
            "INSERT INTO telemetry (tg_id, profile, event, created_at) VALUES (?,?,?,?)",
            (mp["tg_id"], "member", "mission_approved_by_team", int(time.time()))
        )

    conn.close()

    return {
        "ok": True,
        "xp_granted": mission["xp_reward"],
        "level_up": xp_result["level_up"],
        "new_level": xp_result["new_level"] if xp_result["level_up"] else None
    }


@app.post("/api/missions/{mission_id}/reject")
def reject_mission_from_team(mission_id: int, feedback: str = Form(""), user=Depends(team_user)):
    """Rechaza una misión y solicita cambios."""
    conn = db.connect()

    mp = conn.execute(
        "SELECT tg_id FROM mission_progress WHERE mission_id=? AND status='review'",
        (mission_id,)
    ).fetchone()

    if not mp:
        conn.close()
        raise HTTPException(404, "Misión no encontrada o no está en revisión")

    with conn:
        conn.execute(
            "UPDATE mission_progress SET status='rejected' WHERE mission_id=?",
            (mission_id,)
        )

        conn.execute(
            "INSERT INTO telemetry (tg_id, profile, event, created_at) VALUES (?,?,?,?)",
            (mp["tg_id"], "member", "mission_rejected_by_team", int(time.time()))
        )

    conn.close()

    return {"ok": True, "message": "Cambios solicitados al miembro"}


@app.get("/api/team/escalations")
def team_escalations(user=Depends(team_user)):
    """Escalamientos pendientes de resolver."""
    conn = db.connect()

    # Por ahora retorna vacío, será llenado en Fase 4
    escalations = []

    conn.close()

    return {"escalations": escalations}


def timeAgo(ts: int) -> str:
    """Convierte timestamp a tiempo relativo."""
    if not ts:
        return "?"
    d = int(time.time()) - ts
    if d < 60:
        return "ahora"
    if d < 3600:
        return f"{d // 60}m"
    if d < 86400:
        return f"{d // 3600}h"
    return f"{d // 86400}d"


# ── CORPORATE: MÉTRICAS Y GOBERNANZA ──────────────────────────────────

@app.get("/api/corporate/metrics")
def corporate_metrics(user=Depends(corporate_user)):
    """Métricas agregadas del sistema para Corporate."""
    conn = db.connect()

    total_registered = conn.execute(
        "SELECT COUNT(*) as n FROM users WHERE profile='member'"
    ).fetchone()["n"]

    active_this_week = conn.execute(
        "SELECT COUNT(DISTINCT tg_id) as n FROM gamification WHERE profile='member' AND streak_current > 0"
    ).fetchone()["n"]

    avg_level = conn.execute(
        "SELECT COALESCE(ROUND(AVG(level), 1), 0) as l FROM gamification WHERE profile='member'"
    ).fetchone()["l"]

    total_missions = conn.execute(
        "SELECT COUNT(*) as n FROM mission_progress WHERE status='completed'"
    ).fetchone()["n"]

    total_xp = conn.execute(
        "SELECT COALESCE(SUM(points), 0) as p FROM gamification WHERE profile='member'"
    ).fetchone()["p"]

    conn.close()

    return {
        "total_registered": total_registered,
        "active_this_week": active_this_week,
        "avg_level": avg_level,
        "total_missions_completed": total_missions,
        "total_xp_earned": total_xp,
        "engagement_pct": round((active_this_week / total_registered * 100), 1) if total_registered > 0 else 0
    }


@app.get("/api/corporate/metrics/trending")
def corporate_metrics_trending(days: int = 7, user=Depends(corporate_user)):
    """Métricas trending para gráficos (datos por día)."""
    conn = db.connect()

    cutoff = int(time.time()) - (days * 86400)

    # Datos agregados por día (simplificado)
    daily_data = []
    for d in range(days):
        day_start = int(time.time()) - ((days - d) * 86400)
        day_end = int(time.time()) - ((days - d - 1) * 86400)

        count = conn.execute(
            "SELECT COUNT(*) as n FROM mission_progress WHERE completed_at > ? AND completed_at < ?",
            (day_start, day_end)
        ).fetchone()["n"]

        daily_data.append({"day": d, "missions": count})

    conn.close()

    return {"trending": daily_data}


@app.get("/api/corporate/gates")
def corporate_gates(user=Depends(corporate_user)):
    """Lista de gates de despliegue con estado."""
    gates = [
        {
            "id": 1,
            "ord": 1,
            "title": "20+ socios registrados",
            "description": "Base de usuarios mínima para piloto",
            "status": "pending",
            "progress": "18/20"
        },
        {
            "id": 2,
            "ord": 2,
            "title": "50+ misiones completadas",
            "description": "Volumen de pruebas suficiente",
            "status": "done",
            "progress": "157/50 ✅"
        },
        {
            "id": 3,
            "ord": 3,
            "title": "Score promedio ≥4.0",
            "description": "Calidad de entregables confirmada",
            "status": "done",
            "progress": "4.2/5 ✅"
        },
        {
            "id": 4,
            "ord": 4,
            "title": "Cero escalamientos críticos",
            "description": "Todos los problemas resueltos",
            "status": "pending",
            "progress": "1 abierto"
        },
        {
            "id": 5,
            "ord": 5,
            "title": "Decisiones aprobadas",
            "description": "Gobernanza alineada",
            "status": "pending",
            "progress": "3/4 aprobadas"
        },
    ]

    return {"gates": gates}


@app.post("/api/corporate/gates/{gate_id}/complete")
def complete_gate(gate_id: int, user=Depends(corporate_user)):
    """Marca un gate como completado."""
    conn = db.connect()

    with conn:
        conn.execute(
            "INSERT INTO audit_trail (timestamp, actor_tg_id, actor_profile, action, resource_type, resource_id) VALUES (?,?,?,?,?,?)",
            (int(time.time()), user["id"], "corporate", "gate_completed", "gate", str(gate_id))
        )

    conn.close()

    return {"ok": True, "message": f"Gate {gate_id} completado"}


@app.get("/api/corporate/decisions")
def corporate_decisions(user=Depends(corporate_user)):
    """Lista de decisiones con estado."""
    decisions = [
        {
            "id": 1,
            "title": "Usar Google Ads vs Meta Ads",
            "detail": "Inversión inicial: $5k",
            "status": "approved",
            "created_at": int(time.time()) - 86400,
            "decided_by": "María"
        },
        {
            "id": 2,
            "title": "Escalar a 100 socios nuevos",
            "detail": "Timeline: 4 semanas",
            "status": "pending",
            "created_at": int(time.time()) - 14400,
            "decided_by": None
        },
        {
            "id": 3,
            "title": "Cambiar estructura de pagos",
            "detail": "De comisión a tarifa fija",
            "status": "rejected",
            "created_at": int(time.time()) - 172800,
            "decided_by": "Juan"
        },
    ]

    return {"decisions": decisions}


@app.post("/api/corporate/decisions/{decision_id}/decide")
def decide_on_decision(decision_id: int, action: str = Form(...), reason: str = Form(""), user=Depends(corporate_user)):
    """Aprueba o rechaza una decisión."""
    conn = db.connect()

    with conn:
        conn.execute(
            "INSERT INTO audit_trail (timestamp, actor_tg_id, actor_profile, action, resource_type, resource_id, details) VALUES (?,?,?,?,?,?,?)",
            (int(time.time()), user["id"], "corporate", f"decision_{action}", "decision", str(decision_id), reason)
        )

    conn.close()

    return {"ok": True, "message": f"Decisión {action}"}


@app.get("/api/corporate/audit-trail")
def corporate_audit_trail(limit: int = 50, filter: str = None, user=Depends(corporate_user)):
    """Historial completo de auditoría."""
    conn = db.connect()

    query = """
        SELECT id, timestamp, actor_tg_id, actor_profile, action, resource_type, resource_id,
               COALESCE(u.name, 'Anónimo') as actor_name
        FROM audit_trail
        LEFT JOIN users u ON audit_trail.actor_tg_id = u.tg_id
    """

    if filter:
        query += f" WHERE action LIKE '%{filter}%'"

    query += " ORDER BY timestamp DESC LIMIT ?"

    events = conn.execute(query, (limit,)).fetchall()
    conn.close()

    return {
        "audit_trail": [
            {
                "id": e["id"],
                "action": e["action"],
                "actor_name": e["actor_name"],
                "actor_profile": e["actor_profile"],
                "resource_type": e["resource_type"],
                "resource_id": e["resource_id"],
                "timestamp": timeAgo(e["timestamp"])
            }
            for e in events
        ]
    }


@app.get("/api/corporate/go-live-check")
def go_live_readiness(user=Depends(corporate_user)):
    """Verifica readiness para Go-Live."""
    return {
        "ready": False,
        "gates_completed": 2,
        "gates_total": 5,
        "gates_remaining": ["20+ socios", "Cero escalamientos", "Decisiones votadas"],
        "eta_days": "3-5"
    }


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.get("/")
def root():
    return RedirectResponse("/app/member/")


app.mount("/app", StaticFiles(directory=WEBAPP_DIR, html=True), name="webapp")
