"""API de las Mini Apps Be Global Pro.

Ejecutar en desarrollo:
    DEV_BYPASS=1 uvicorn main:app --reload --port 8090

En producción sirve también las Mini Apps estáticas bajo /app/{perfil}/ y
guarda evidencias en MEDIA_DIR (Media Hub aislado).
"""
import os
import time
import uuid

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

import db
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


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.get("/")
def root():
    return RedirectResponse("/app/member/")


app.mount("/app", StaticFiles(directory=WEBAPP_DIR, html=True), name="webapp")
