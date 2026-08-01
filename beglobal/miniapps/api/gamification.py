"""Utilidades de gamificación para Be Global Duolingo."""
import json
import sqlite3
import time
from datetime import datetime


def grant_xp(conn: sqlite3.Connection, tg_id: int, profile: str, xp: int, bonus_streak: bool = False) -> dict:
    """Otorga XP, maneja level-up y retorna información de progreso.

    Retorna: {"xp_gained": int, "level_up": bool, "new_level": int, "xp_current": int}
    """
    # Obtener gamificación actual
    gam = conn.execute(
        "SELECT level, xp_current, xp_next_level, points FROM gamification WHERE tg_id=? AND profile=?",
        (tg_id, profile)
    ).fetchone()

    if not gam:
        # Inicializar si no existe
        conn.execute(
            "INSERT INTO gamification (tg_id, profile, level, xp_current, xp_next_level, points) VALUES (?,?,?,?,?,?)",
            (tg_id, profile, 1, 0, 500, 0)
        )
        gam = conn.execute(
            "SELECT level, xp_current, xp_next_level, points FROM gamification WHERE tg_id=? AND profile=?",
            (tg_id, profile)
        ).fetchone()

    xp_current = gam["xp_current"] + xp
    level = gam["level"]
    xp_next = gam["xp_next_level"]
    points = gam["points"] + xp

    level_up = False
    while xp_current >= xp_next:
        xp_current -= xp_next
        level += 1
        xp_next = int(500 * (1.2 ** (level - 1)))
        level_up = True

    conn.execute(
        """UPDATE gamification SET xp_current=?, level=?, xp_next_level=?, points=?, last_activity_date=?
           WHERE tg_id=? AND profile=?""",
        (xp_current, level, xp_next, points, datetime.now().strftime("%Y-%m-%d"), tg_id, profile)
    )

    return {
        "xp_gained": xp,
        "level_up": level_up,
        "new_level": level,
        "xp_current": xp_current,
        "xp_next_level": xp_next,
        "total_points": points
    }


def check_achievements(conn: sqlite3.Connection, tg_id: int, profile: str) -> list[str]:
    """Verifica y desbloquea logros ganados. Retorna lista de achievement codes nuevos."""
    gam = conn.execute(
        "SELECT level, streak_current, missions_completed, achievements FROM gamification WHERE tg_id=? AND profile=?",
        (tg_id, profile)
    ).fetchone()

    if not gam:
        return []

    current_achievements = set(json.loads(gam["achievements"] or "[]"))
    new_achievements = []

    # Condiciones de logros
    achievements_to_check = [
        ("first_mission", "missions", 1, gam["missions_completed"] >= 1),
        ("five_missions", "missions", 5, gam["missions_completed"] >= 5),
        ("streak_3", "streak", 3, gam["streak_current"] >= 3),
        ("streak_7", "streak", 7, gam["streak_current"] >= 7),
        ("streak_30", "streak", 30, gam["streak_current"] >= 30),
        ("level_2", "profile_level", 2, gam["level"] >= 2),
        ("level_5", "profile_level", 5, gam["level"] >= 5),
        ("level_10", "profile_level", 10, gam["level"] >= 10),
    ]

    for ach_code, _, _, condition_met in achievements_to_check:
        if condition_met and ach_code not in current_achievements:
            current_achievements.add(ach_code)
            new_achievements.append(ach_code)

            # Obtener bonus XP del logro
            ach = conn.execute(
                "SELECT xp_bonus FROM achievements WHERE code=?", (ach_code,)
            ).fetchone()
            if ach:
                grant_xp(conn, tg_id, profile, ach["xp_bonus"])

    # Guardar achievements actualizados
    if new_achievements:
        conn.execute(
            "UPDATE gamification SET achievements=? WHERE tg_id=? AND profile=?",
            (json.dumps(list(current_achievements)), tg_id, profile)
        )

    return new_achievements


def update_streak(conn: sqlite3.Connection, tg_id: int, profile: str) -> dict:
    """Actualiza racha diaria. Retorna {"streak": int, "bonus_xp": int}."""
    today = datetime.now().strftime("%Y-%m-%d")

    gam = conn.execute(
        "SELECT last_activity_date, streak_current, streak_max FROM gamification WHERE tg_id=? AND profile=?",
        (tg_id, profile)
    ).fetchone()

    if not gam:
        conn.execute(
            "INSERT INTO gamification (tg_id, profile, streak_current, streak_max, last_activity_date) VALUES (?,?,?,?,?)",
            (tg_id, profile, 1, 1, today)
        )
        return {"streak": 1, "bonus_xp": 25}

    last_date = gam["last_activity_date"]
    current_streak = gam["streak_current"]
    max_streak = gam["streak_max"]

    if last_date == today:
        return {"streak": current_streak, "bonus_xp": 0}  # Ya completó hoy

    # Verificar si es día consecutivo
    from datetime import datetime, timedelta
    today_dt = datetime.strptime(today, "%Y-%m-%d")
    last_dt = datetime.strptime(last_date, "%Y-%m-%d")
    days_diff = (today_dt - last_dt).days

    if days_diff == 1:
        current_streak += 1
    else:
        current_streak = 1  # Racha rota, reinicia

    max_streak = max(max_streak, current_streak)
    bonus_xp = 25

    conn.execute(
        """UPDATE gamification SET streak_current=?, streak_max=?, last_activity_date=?
           WHERE tg_id=? AND profile=?""",
        (current_streak, max_streak, today, tg_id, profile)
    )

    return {"streak": current_streak, "bonus_xp": bonus_xp}


def get_gamification_dashboard(conn: sqlite3.Connection, tg_id: int, profile: str) -> dict:
    """Retorna dashboard completo de gamificación del usuario."""
    gam = conn.execute(
        """SELECT points, streak_current, streak_max, lessons_completed, missions_completed,
                  level, xp_current, xp_next_level, achievements
           FROM gamification WHERE tg_id=? AND profile=?""",
        (tg_id, profile)
    ).fetchone()

    if not gam:
        return {
            "level": 1,
            "xp_progress": {"current": 0, "next_level": 500, "pct": 0},
            "streak": {"current": 0, "best": 0},
            "stats": {"lessons_completed": 0, "missions_completed": 0, "total_points": 0},
            "achievements": [],
        }

    achievements_earned = []
    if gam["achievements"]:
        ach_codes = json.loads(gam["achievements"])
        achievements_earned = [
            dict(r) for r in conn.execute(
                f"""SELECT code, title, description, icon FROM achievements
                   WHERE code IN ({','.join('?' * len(ach_codes))})""",
                ach_codes
            ).fetchall()
        ]

    xp_pct = round((gam["xp_current"] / gam["xp_next_level"]) * 100) if gam["xp_next_level"] else 0

    return {
        "level": gam["level"],
        "xp_progress": {
            "current": gam["xp_current"],
            "next_level": gam["xp_next_level"],
            "pct": xp_pct,
        },
        "streak": {
            "current": gam["streak_current"],
            "best": gam["streak_max"],
        },
        "stats": {
            "lessons_completed": gam["lessons_completed"],
            "missions_completed": gam["missions_completed"],
            "total_points": gam["points"],
        },
        "achievements": achievements_earned,
    }


def recommend_lessons(experience_level: str, product_type: str, responses: dict, conn: sqlite3.Connection) -> list[dict]:
    """Recomienda lecciones personalizadas basadas en diagnóstico."""
    lesson_map = {
        ("beginner", "physical"): [1, 2, 3, 4, 6],
        ("beginner", "digital"): [1, 2, 4, 8],
        ("beginner", "service"): [1, 2, 4, 8],
        ("beginner", "dropshipping"): [1, 2, 3, 6, 8],
        ("intermediate", "physical"): [2, 3, 4, 5, 6, 7, 8],
        ("intermediate", "digital"): [2, 4, 5, 7, 8],
        ("intermediate", "service"): [2, 4, 5, 7, 8],
        ("intermediate", "dropshipping"): [2, 3, 4, 6, 7, 8],
        ("advanced", "physical"): [5, 7, 8, 9, 10],
        ("advanced", "digital"): [5, 8, 9, 10],
        ("advanced", "service"): [5, 8, 9, 10],
        ("advanced", "dropshipping"): [5, 7, 8, 9, 10],
    }

    key = (experience_level or "beginner", product_type or "physical")
    recommended_ids = lesson_map.get(key, [1, 2])

    lessons = conn.execute(
        f"""SELECT id, code, title, description, difficulty, xp_reward, duration_minutes
           FROM lessons WHERE id IN ({','.join('?' * len(recommended_ids))})
           ORDER BY ord""",
        recommended_ids
    ).fetchall()

    return [dict(r) for r in lessons]
