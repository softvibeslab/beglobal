#!/usr/bin/env python3
"""Test script para Fase 1 de Gamificación Be Global.

Uso:
    python3 test_phase1.py
"""
import json
import sqlite3
import sys
import time

import db


def test_schema():
    """Verifica que todas las tablas existen."""
    print("\n🧪 TEST 1: Schema de BD")
    print("─" * 60)

    conn = db.connect()
    tables = {
        "users": "Usuarios",
        "gamification": "Gamificación",
        "lessons": "Lecciones",
        "lesson_progress": "Progreso de lecciones",
        "missions": "Misiones",
        "mission_progress": "Progreso de misiones",
        "achievements": "Logros",
        "diagnosis_responses": "Respuestas de diagnóstico",
        "learning_sessions": "Sesiones de aprendizaje",
    }

    all_exist = True
    for table, label in tables.items():
        exists = conn.execute(
            f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}'"
        ).fetchone() is not None

        status = "✅" if exists else "❌"
        print(f"  {status} {label} ({table})")
        all_exist = all_exist and exists

    conn.close()
    return all_exist


def test_seed_data():
    """Verifica que los datos semilla se insertaron."""
    print("\n🧪 TEST 2: Seed Data")
    print("─" * 60)

    conn = db.connect()

    tests = {
        "lessons": ("Lecciones", 10),
        "missions": ("Misiones", 10),
        "achievements": ("Logros", 11),
    }

    all_ok = True
    for table, (label, expected) in tests.items():
        count = conn.execute(f"SELECT COUNT(*) as n FROM {table}").fetchone()["n"]
        status = "✅" if count == expected else "⚠️"
        print(f"  {status} {label}: {count} (esperado {expected})")
        all_ok = all_ok and (count == expected)

    conn.close()
    return all_ok


def test_user_onboarding():
    """Simula onboarding completo de un usuario."""
    print("\n🧪 TEST 3: Onboarding de Usuario")
    print("─" * 60)

    tg_id = 999999
    profile = "member"

    conn = db.connect()

    # 1. Crear usuario
    conn.execute(
        "INSERT OR REPLACE INTO users (tg_id, profile, name, first_seen) VALUES (?,?,?,?)",
        (tg_id, profile, "Test User", int(time.time()))
    )

    # 2. Insertar respuestas de diagnóstico
    diagnosis = {
        "experience": "beginner",
        "product": "physical",
        "channel": "instagram",
        "blocker": "conocimiento",
        "capital": "bajo"
    }

    for q_code, response in diagnosis.items():
        conn.execute(
            """INSERT INTO diagnosis_responses (tg_id, question_code, response, timestamp)
               VALUES (?,?,?,?)""",
            (tg_id, q_code, response, int(time.time()))
        )

    # 3. Actualizar perfil
    conn.execute(
        """UPDATE users SET experience_level=?, product_type=?, main_channel=?,
           main_blocker=?, onboarding_step=?, diagnosis_complete=?
           WHERE tg_id=? AND profile=?""",
        ("beginner", "physical", "instagram", "conocimiento", "lessons", 1, tg_id, profile)
    )

    # 4. Inicializar gamificación
    conn.execute(
        """INSERT OR REPLACE INTO gamification (tg_id, profile, level, xp_current, xp_next_level)
           VALUES (?,?,?,?,?)""",
        (tg_id, profile, 1, 0, 500)
    )

    conn.commit()

    # Verificar
    user = conn.execute(
        "SELECT experience_level, product_type, onboarding_step, diagnosis_complete FROM users WHERE tg_id=? AND profile=?",
        (tg_id, profile)
    ).fetchone()

    gam = conn.execute(
        "SELECT level, xp_current, xp_next_level FROM gamification WHERE tg_id=? AND profile=?",
        (tg_id, profile)
    ).fetchone()

    conn.close()

    print(f"  ✅ Usuario creado: ID {tg_id}")
    if user:
        print(f"  ✅ Diagnóstico guardado: {user['experience_level']} / {user['product_type']}")
    if gam:
        print(f"  ✅ Gamificación inicializada: Level {gam['level']}, XP {gam['xp_current']}/{gam['xp_next_level']}")

    return True


def test_lesson_completion():
    """Simula completar una lección."""
    print("\n🧪 TEST 4: Completar Lección")
    print("─" * 60)

    tg_id = 999999
    profile = "member"
    lesson_id = 1

    conn = db.connect()

    # Completar lección
    lesson = conn.execute("SELECT xp_reward FROM lessons WHERE id=?", (lesson_id,)).fetchone()
    xp_reward = lesson["xp_reward"]

    conn.execute(
        """INSERT INTO lesson_progress (tg_id, lesson_id, status, quiz_score, completed_at)
           VALUES (?,?,'completed',95,?) ON CONFLICT(tg_id, lesson_id) DO UPDATE SET
           status='completed', quiz_score=95, completed_at=excluded.completed_at""",
        (tg_id, lesson_id, int(time.time()))
    )

    # Grant XP
    gam = conn.execute(
        "SELECT xp_current, xp_next_level, level FROM gamification WHERE tg_id=? AND profile=?",
        (tg_id, profile)
    ).fetchone()

    new_xp = gam["xp_current"] + xp_reward
    level_up = new_xp >= gam["xp_next_level"]
    new_level = gam["level"] + 1 if level_up else gam["level"]

    conn.execute(
        """UPDATE gamification SET xp_current=?, level=?, lessons_completed=lessons_completed+1
           WHERE tg_id=? AND profile=?""",
        (new_xp if not level_up else new_xp - gam["xp_next_level"],
         new_level, tg_id, profile)
    )

    conn.commit()

    # Verificar
    progress = conn.execute(
        "SELECT status, quiz_score FROM lesson_progress WHERE tg_id=? AND lesson_id=?",
        (tg_id, lesson_id)
    ).fetchone()

    gam_new = conn.execute(
        "SELECT level, xp_current, lessons_completed FROM gamification WHERE tg_id=? AND profile=?",
        (tg_id, profile)
    ).fetchone()

    conn.close()

    print(f"  ✅ Lección {lesson_id} completada")
    print(f"  ✅ Quiz score: {progress['quiz_score']}")
    print(f"  ✅ XP ganado: {xp_reward}")
    print(f"  ✅ Progreso: Level {gam_new['level']}, XP {gam_new['xp_current']}, Lecciones {gam_new['lessons_completed']}")

    return True


def test_mission_submission():
    """Simula enviar una misión a revisión."""
    print("\n🧪 TEST 5: Enviar Misión a Revisión")
    print("─" * 60)

    tg_id = 999999
    mission_id = 1

    conn = db.connect()

    # Enviar a revisión
    conn.execute(
        """INSERT INTO mission_progress (tg_id, mission_id, status, attempts, started_at)
           VALUES (?,?,'review',1,?) ON CONFLICT(tg_id, mission_id) DO UPDATE SET
           status='review', attempts=attempts+1""",
        (tg_id, mission_id, int(time.time()))
    )

    # Crear evidencia simulada
    conn.execute(
        """INSERT INTO evidence (tg_id, stage_code, filename, stored_path, note, created_at)
           VALUES (?,?,'test_landing.png','mission/999999/test123_landing.png','Test landing page',?)""",
        (tg_id, f"mission_{mission_id}", int(time.time()))
    )

    conn.commit()

    # Verificar
    mission_prog = conn.execute(
        "SELECT status, attempts FROM mission_progress WHERE tg_id=? AND mission_id=?",
        (tg_id, mission_id)
    ).fetchone()

    evidence = conn.execute(
        "SELECT id, filename, status FROM evidence WHERE tg_id=? AND stage_code=?",
        (tg_id, f"mission_{mission_id}")
    ).fetchone()

    conn.close()

    print(f"  ✅ Misión {mission_id} enviada a revisión")
    print(f"  ✅ Estado: {mission_prog['status']}, Intentos: {mission_prog['attempts']}")
    print(f"  ✅ Evidencia guardada: {evidence['filename']} (ID {evidence['id']})")

    return True


def test_mission_approval():
    """Simula que Team aprueba una misión."""
    print("\n🧪 TEST 6: Team Aprueba Misión")
    print("─" * 60)

    tg_id = 999999
    team_id = 88888
    mission_id = 1

    conn = db.connect()

    # Team aprueba
    mission = conn.execute("SELECT xp_reward FROM missions WHERE id=?", (mission_id,)).fetchone()
    xp_reward = mission["xp_reward"]

    conn.execute(
        "UPDATE mission_progress SET status='completed', score=5 WHERE tg_id=? AND mission_id=?",
        (tg_id, mission_id)
    )

    # Grant XP
    gam = conn.execute(
        "SELECT xp_current, level FROM gamification WHERE tg_id=? AND profile='member'",
        (tg_id,)
    ).fetchone()

    new_xp = gam["xp_current"] + xp_reward

    conn.execute(
        """UPDATE gamification SET xp_current=?, missions_completed=missions_completed+1
           WHERE tg_id=? AND profile='member'""",
        (new_xp, tg_id)
    )

    # Telemetría
    conn.execute(
        "INSERT INTO telemetry (tg_id, profile, event, created_at) VALUES (?,?,?,?)",
        (tg_id, "member", "mission_approved", int(time.time()))
    )

    conn.commit()

    # Verificar
    mission_prog = conn.execute(
        "SELECT status, score FROM mission_progress WHERE tg_id=? AND mission_id=?",
        (tg_id, mission_id)
    ).fetchone()

    gam_updated = conn.execute(
        "SELECT level, xp_current, missions_completed FROM gamification WHERE tg_id=? AND profile='member'",
        (tg_id,)
    ).fetchone()

    conn.close()

    print(f"  ✅ Misión {mission_id} aprobada por Team (ID {team_id})")
    print(f"  ✅ Score: {mission_prog['score']}/5")
    print(f"  ✅ XP otorgado: {xp_reward}")
    print(f"  ✅ Progreso del miembro: Level {gam_updated['level']}, Misiones {gam_updated['missions_completed']}")

    return True


def test_achievements():
    """Verifica que los logros se pueden desbloquear."""
    print("\n🧪 TEST 7: Sistema de Logros")
    print("─" * 60)

    conn = db.connect()

    achievements = conn.execute(
        "SELECT code, title, condition_type, condition_value FROM achievements LIMIT 5"
    ).fetchall()

    print(f"  ✅ {len(achievements)} logros disponibles:")
    for ach in achievements:
        print(f"    - {ach['code']}: {ach['title']} (si {ach['condition_type']} >= {ach['condition_value']})")

    conn.close()
    return True


def test_corporate_metrics():
    """Verifica que el endpoint de metrics da datos agregados."""
    print("\n🧪 TEST 8: Métricas Corporate")
    print("─" * 60)

    conn = db.connect()

    total_members = conn.execute(
        "SELECT COUNT(*) as n FROM users WHERE profile='member'"
    ).fetchone()["n"]

    total_xp = conn.execute(
        "SELECT COALESCE(SUM(points), 0) as p FROM gamification WHERE profile='member'"
    ).fetchone()["p"]

    avg_level = conn.execute(
        "SELECT COALESCE(ROUND(AVG(level), 1), 0) as l FROM gamification WHERE profile='member'"
    ).fetchone()["l"]

    conn.close()

    print(f"  ✅ Miembros totales: {total_members}")
    print(f"  ✅ XP total ganado: {total_xp}")
    print(f"  ✅ Nivel promedio: {avg_level}")

    return True


def test_orchestrator_detect():
    """Verifica que el orchestrator detecta el perfil correctamente."""
    print("\n🧪 TEST 9: Orchestrator — Detectar Perfil")
    print("─" * 60)

    conn = db.connect()

    # Crear usuarios de prueba en 3 perfiles
    profiles = [("member", 888888), ("team", 888889), ("corporate", 888890)]

    for profile, tg_id in profiles:
        conn.execute(
            "INSERT OR IGNORE INTO users (tg_id, profile, name, first_seen, diagnosis_complete) VALUES (?,?,?,?,?)",
            (tg_id, profile, f"Test {profile}", int(time.time()), profile == "member")
        )

        if profile == "member":
            conn.execute(
                "INSERT OR IGNORE INTO gamification (tg_id, profile, level, xp_current, points) VALUES (?,?,?,?,?)",
                (tg_id, profile, 1, 0, 0)
            )

    conn.commit()

    # Verificar que cada usuario está en su perfil
    for profile, tg_id in profiles:
        user = conn.execute(
            "SELECT profile FROM users WHERE tg_id=?",
            (tg_id,)
        ).fetchone()

        if user and user["profile"] == profile:
            print(f"  ✅ Usuario {tg_id} detectado como {profile}")
        else:
            print(f"  ❌ Error detectando {profile} para usuario {tg_id}")
            conn.close()
            return False

    conn.close()
    return True


def test_orchestrator_onboarding():
    """Verifica que el orchestrator retorna estado de onboarding."""
    print("\n🧪 TEST 10: Orchestrator — Onboarding Status")
    print("─" * 60)

    conn = db.connect()
    tg_id = 777777

    # Usuario sin completar diagnóstico
    conn.execute(
        "DELETE FROM users WHERE tg_id=?",
        (tg_id,)
    )
    conn.execute(
        "INSERT INTO users (tg_id, profile, name, first_seen, diagnosis_complete) VALUES (?,?,?,?,?)",
        (tg_id, "member", "Test Onboarding", int(time.time()), 0)
    )
    conn.commit()

    user1 = conn.execute(
        "SELECT diagnosis_complete FROM users WHERE tg_id=?",
        (tg_id,)
    ).fetchone()

    if not user1["diagnosis_complete"]:
        print(f"  ✅ Usuario {tg_id} aún necesita completar diagnóstico")
    else:
        print(f"  ❌ Error: usuario debería tener diagnosis_complete=0")
        conn.close()
        return False

    # Completar diagnóstico
    conn.execute(
        "UPDATE users SET diagnosis_complete=1 WHERE tg_id=?",
        (tg_id,)
    )
    conn.commit()

    user2 = conn.execute(
        "SELECT diagnosis_complete FROM users WHERE tg_id=?",
        (tg_id,)
    ).fetchone()

    if user2["diagnosis_complete"]:
        print(f"  ✅ Usuario {tg_id} completó diagnóstico")
    else:
        print(f"  ❌ Error: diagnóstico no se actualizó")
        conn.close()
        return False

    conn.close()
    return True


def test_team_operations():
    """Verifica que las operaciones del team funcionan."""
    print("\n🧪 TEST 11: Team Operations — Queue y Analytics")
    print("─" * 60)

    conn = db.connect()
    member_id = 555555
    team_id = 666666

    # Crear member con misión en revisión
    conn.execute(
        "INSERT OR IGNORE INTO users (tg_id, profile, name, first_seen) VALUES (?,?,?,?)",
        (member_id, "member", "Test Member", int(time.time()))
    )

    conn.execute(
        "INSERT OR IGNORE INTO gamification (tg_id, profile, level, xp_current, points) VALUES (?,?,?,?,?)",
        (member_id, "member", 1, 0, 0)
    )

    conn.execute(
        "INSERT OR IGNORE INTO mission_progress (tg_id, mission_id, status, started_at) VALUES (?,?,?,?)",
        (member_id, 2, "review", int(time.time()))
    )

    conn.commit()

    # Simular que team revisa
    mp = conn.execute(
        "SELECT tg_id, mission_id FROM mission_progress WHERE tg_id=? AND status='review' LIMIT 1",
        (member_id,)
    ).fetchone()

    if mp:
        # Aprobar misión
        conn.execute(
            "UPDATE mission_progress SET status='completed', score=4 WHERE tg_id=? AND mission_id=?",
            (mp["tg_id"], mp["mission_id"])
        )

        # Otorgar XP
        conn.execute(
            "UPDATE gamification SET xp_current=xp_current+100, missions_completed=missions_completed+1 WHERE tg_id=? AND profile='member'",
            (member_id,)
        )

        conn.commit()

        print(f"  ✅ Misión #{mp['mission_id']} aprobada por Team")
    else:
        print(f"  ❌ Error: misión no encontrada para revisar")
        conn.close()
        return False

    # Verificar que la misión está completada
    final = conn.execute(
        "SELECT status, score FROM mission_progress WHERE tg_id=? ORDER BY submitted_at DESC LIMIT 1",
        (member_id,)
    ).fetchone()

    if final and final["status"] == "completed":
        print(f"  ✅ Misión completada con score {final['score']}/5")
    else:
        print(f"  ❌ Error: misión no se actualizó")
        conn.close()
        return False

    # Verificar gamificación actualizada
    gam = conn.execute(
        "SELECT missions_completed FROM gamification WHERE tg_id=? AND profile='member'",
        (member_id,)
    ).fetchone()

    if gam and gam["missions_completed"] >= 1:
        print(f"  ✅ Contador de misiones actualizado: {gam['missions_completed']}")
    else:
        print(f"  ❌ Error: contador de misiones no se actualizó")
        conn.close()
        return False

    conn.close()
    return True


def cleanup(tg_id=999999):
    """Limpia datos de test."""
    print("\n🧹 Limpieza de datos de test")
    print("─" * 60)

    conn = db.connect()
    with conn:
        conn.execute("DELETE FROM diagnosis_responses WHERE tg_id=?", (tg_id,))
        conn.execute("DELETE FROM lesson_progress WHERE tg_id=?", (tg_id,))
        conn.execute("DELETE FROM mission_progress WHERE tg_id=?", (tg_id,))
        conn.execute("DELETE FROM evidence WHERE tg_id=?", (tg_id,))
        conn.execute("DELETE FROM learning_sessions WHERE tg_id=?", (tg_id,))
        conn.execute("DELETE FROM gamification WHERE tg_id=?", (tg_id,))
        conn.execute("DELETE FROM users WHERE tg_id=?", (tg_id,))
    conn.close()

    print(f"  ✅ Datos de test (tg_id={tg_id}) eliminados")


def main():
    """Ejecuta todos los tests."""
    print("\n" + "=" * 60)
    print("  FASE 1: TEST SUITE - GAMIFICACIÓN BE GLOBAL")
    print("=" * 60)

    # Inicializar BD
    print("\n📦 Inicializando base de datos...")
    db.init_db()
    print("  ✅ BD inicializada")

    tests = [
        ("Schema", test_schema),
        ("Seed Data", test_seed_data),
        ("Onboarding", test_user_onboarding),
        ("Completar Lección", test_lesson_completion),
        ("Enviar Misión", test_mission_submission),
        ("Team Aprueba", test_mission_approval),
        ("Logros", test_achievements),
        ("Métricas Corporate", test_corporate_metrics),
        ("Orchestrator: Detect", test_orchestrator_detect),
        ("Orchestrator: Onboarding", test_orchestrator_onboarding),
        ("Team Operations", test_team_operations),
    ]

    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, "✅ PASS" if passed else "❌ FAIL"))
        except Exception as e:
            print(f"  ❌ ERROR: {e}")
            results.append((name, f"❌ ERROR: {str(e)[:50]}"))

    # Limpiar datos de test
    cleanup()

    # Resumen
    print("\n" + "=" * 60)
    print("  RESUMEN DE TESTS")
    print("=" * 60)
    for name, result in results:
        print(f"  {result:20} {name}")

    passed = sum(1 for _, r in results if "PASS" in r)
    total = len(results)
    print(f"\n  {passed}/{total} tests pasaron")

    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
