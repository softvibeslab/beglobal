# Fase 1: Entity Relationship Diagram

## Diagrama de Tablas

```
┌─────────────────────────────────────────────────────────────────────────┐
│ GAMIFICATION SYSTEM (Duolingo Be Global)                                │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌──────────────────────┐
                        │      USERS           │
                        │──────────────────────│
                        │ tg_id (PK)           │
                        │ profile (PK)         │
                        │ name                 │
                        │ experience_level     │
                        │ product_type         │
                        │ main_channel         │
                        │ main_blocker         │
                        │ onboarding_step      │
                        │ diagnosis_complete   │
                        │ last_activity        │
                        └──────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
            ┌────────────────────────────────────────────────┐
            │        GAMIFICATION                            │
            │────────────────────────────────────────────────│
            │ tg_id (FK, PK)                                 │
            │ profile (FK, PK)                               │
            │ points                                         │
            │ streak_current                                 │
            │ streak_max                                     │
            │ lessons_completed                              │
            │ missions_completed                             │
            │ achievements (JSON array)                      │
            │ level                                          │
            │ xp_current                                     │
            │ xp_next_level                                  │
            │ last_activity_date                             │
            └────────────────────────────────────────────────┘
                    │
                    ├─────────────────────────────────────────────────────┐
                    │                                                     │
                    ▼                                                     ▼
    ┌──────────────────────────┐                      ┌──────────────────────────┐
    │   LESSONS                │                      │   MISSIONS               │
    │──────────────────────────│                      │──────────────────────────│
    │ id (PK)                  │                      │ id (PK)                  │
    │ code (UNIQUE)            │                      │ code (UNIQUE)            │
    │ ord                       │                      │ title                    │
    │ title                     │                      │ description              │
    │ description               │                      │ difficulty               │
    │ content_type             │                      │ xp_reward                │
    │ duration_minutes          │                      │ coins_reward             │
    │ content_url              │                      │ time_estimate_minutes    │
    │ quiz_data (JSON)         │                      │ deliverable_type         │
    │ prerequisites (JSON)      │                      │ success_criteria         │
    │ xp_reward                │                      │ related_lessons (JSON)   │
    │ difficulty               │                      │ ord                      │
    └──────────────────────────┘                      └──────────────────────────┘
            │                                                   │
            │ (1-to-many)                                       │ (1-to-many)
            ▼                                                   ▼
    ┌──────────────────────────┐                      ┌──────────────────────────┐
    │ LESSON_PROGRESS          │                      │ MISSION_PROGRESS         │
    │──────────────────────────│                      │──────────────────────────│
    │ tg_id (FK, PK)           │                      │ tg_id (FK, PK)           │
    │ lesson_id (FK, PK)       │                      │ mission_id (FK, PK)      │
    │ status                   │                      │ status                   │
    │ quiz_score               │                      │ attempts                 │
    │ attempts                 │                      │ started_at               │
    │ completed_at             │                      │ completed_at             │
    └──────────────────────────┘                      │ score                    │
                                                       │ coach_feedback           │
                                                       └──────────────────────────┘
                                                               │
                                                               │ (1-to-many)
                                                               ▼
                                                       ┌──────────────────────────┐
                                                       │ EVIDENCE                 │
                                                       │──────────────────────────│
                                                       │ id (PK)                  │
                                                       │ tg_id (FK)               │
                                                       │ stage_code               │
                                                       │ filename                 │
                                                       │ stored_path              │
                                                       │ note                     │
                                                       │ status                   │
                                                       │ score                    │
                                                       │ review_note              │
                                                       │ reviewed_by              │
                                                       │ created_at               │
                                                       └──────────────────────────┘


    ┌──────────────────────────┐
    │   ACHIEVEMENTS           │
    │──────────────────────────│
    │ id (PK)                  │
    │ code (UNIQUE)            │
    │ title                    │
    │ description              │
    │ icon                     │
    │ condition_type           │
    │ condition_value          │
    │ xp_bonus                 │
    └──────────────────────────┘
            │
            └─────────────────────────────────────────────────────────┐
                                                                      │
                      Referenciado por GAMIFICATION.achievements
                                  (JSON array de codes)


    ┌──────────────────────────┐        ┌──────────────────────────┐
    │ DIAGNOSIS_RESPONSES      │        │ LEARNING_SESSIONS        │
    │──────────────────────────│        │──────────────────────────│
    │ id (PK)                  │        │ id (PK)                  │
    │ tg_id (FK)               │        │ tg_id (FK)               │
    │ question_code            │        │ profile (FK)             │
    │ response                 │        │ session_type             │
    │ response_value           │        │ content_id               │
    │ timestamp                │        │ duration_seconds         │
    │ UNIQUE(tg_id, ...)       │        │ completed                │
    └──────────────────────────┘        │ started_at               │
                                        │ ended_at                 │
                                        │ device_info              │
                                        └──────────────────────────┘

```

---

## Flujo de Datos

### 1. Onboarding (Diagnóstico)

```
Usuario Nuevo
    │
    ▼
GET /api/onboarding/diagnosis/questions
    │
    ▼
[5 preguntas personalizadas]
    │
    └─► response = {experience, product, channel, blocker, capital}
            │
            ▼
        POST /api/onboarding/diagnosis/submit
            │
            ├─► INSERT INTO diagnosis_responses (tg_id, question_code, response, ...)
            │
            ├─► UPDATE users SET experience_level=?, product_type=?, ... WHERE tg_id=?
            │
            ├─► INSERT INTO gamification (tg_id, profile, level=1, xp_current=0, ...)
            │
            └─► recommend_lessons(experience, product) → [lesson_ids]
                    │
                    ▼
                Response: {
                  "profile_level": "beginner",
                  "recommended_lessons": [{id, title, xp_reward}],
                  "next_step": "lessons"
                }
```

### 2. Completar Lección

```
Usuario en GET /api/lessons
    │
    ▼
[Lista de lecciones desbloqueadas]
    │
    └─► SELECT * FROM lessons WHERE id IN (recommended_ids)
            │
            ▼
        Usuario elige leccion_id=1
            │
            ▼
        GET /api/lessons/1
            │
            ├─► SELECT * FROM lessons WHERE id=1
            │
            └─► SELECT * FROM lesson_progress WHERE tg_id=?, lesson_id=1
                    │
                    ▼
                Response: {lesson, progress}
                    │
                    ▼
                Usuario completa leccion
                    │
                    ▼
                POST /api/lessons/1/complete (quiz_score=95)
                    │
                    ├─► INSERT INTO lesson_progress (status='completed', quiz_score=95)
                    │
                    ├─► grant_xp(tg_id, "member", 50)
                    │   ├─► UPDATE gamification SET xp_current += 50
                    │   ├─► [Si xp_current >= xp_next_level → LEVEL UP]
                    │   └─► Return: {xp_gained: 50, level_up: false}
                    │
                    ├─► UPDATE gamification SET lessons_completed += 1
                    │
                    └─► check_achievements(tg_id, "member")
                        └─► [Verificar y desbloquear logros si aplica]
                            └─► INSERT INTO achievements nueva lista
                                │
                                ▼
                        Response: {
                          ok: true,
                          xp_gained: 50,
                          new_achievements: ["first_mission", ...]
                        }
```

### 3. Completar Misión

```
Usuario en GET /api/missions
    │
    ▼
[Lista de misiones desbloqueadas]
    │
    └─► SELECT * FROM missions WHERE ord <= (level * 2)
            │
            ▼
        Usuario elige mission_id=1
            │
            ▼
        POST /api/missions/1/submit (note="...", file=landing.png)
            │
            ├─► Guardar archivo a MEDIA_DIR/mission/{tg_id}/{uuid}_{filename}
            │
            ├─► INSERT INTO mission_progress (status='review', attempts=1)
            │
            ├─► INSERT INTO evidence (tg_id, stage_code='mission_1', filename, stored_path, note)
            │
            ├─► INSERT INTO learning_sessions (session_type='mission', content_id=1, completed=1)
            │
            └─► Response: {ok: true, message: "Misión enviada a revisión"}
                    │
                    ▼
            [Team recibe en GET /api/team/missions-queue]
                    │
                    ▼
            Team Reviewer ve la misión en cola
                    │
                    ▼
            POST /api/team/mission/{mp_id}/approve (score=5, feedback="...")
                    │
                    ├─► UPDATE mission_progress SET status='completed', score=5
                    │
                    ├─► grant_xp(tg_id, "member", 100)
                    │
                    ├─► UPDATE gamification SET missions_completed += 1
                    │
                    ├─► check_achievements(tg_id, "member")
                    │
                    └─► Response: {
                          ok: true,
                          xp_granted: 100,
                          member_level: 2
                        }
```

### 4. Dashboard de Gamificación

```
Usuario en GET /api/gamification/dashboard
    │
    ▼
get_gamification_dashboard(tg_id, "member")
    │
    ├─► SELECT * FROM gamification WHERE tg_id=? AND profile='member'
    │
    ├─► achievements_earned = SELECT * FROM achievements WHERE code IN (gam["achievements"])
    │
    └─► Response: {
          level: 2,
          xp_progress: {current: 250, next_level: 500, pct: 50},
          streak: {current: 3, best: 5},
          stats: {
            lessons_completed: 2,
            missions_completed: 1,
            total_points: 150
          },
          achievements: [
            {code: "first_mission", title: "Primeros pasos", icon: "🚀"}
          ]
        }
```

---

## Índices para Performance

```sql
CREATE INDEX idx_gamification_profile ON gamification(profile, level);
CREATE INDEX idx_lesson_progress_status ON lesson_progress(status);
CREATE INDEX idx_mission_progress_status ON mission_progress(status);
CREATE INDEX idx_learning_sessions_tg_id ON learning_sessions(tg_id);
CREATE INDEX idx_diagnosis_responses_tg_id ON diagnosis_responses(tg_id);
```

**Justificación**:
- Queries frecuentes por perfil y nivel (Corporate metrics)
- Queries por estado (filtros de UI)
- Telemetría por usuario

---

## Transacciones ACID

### Garantías de Atomicidad

#### Grant XP + Level Up
```python
with conn:
    gamification.grant_xp(conn, tg_id, profile, xp)
    # Si level_up → automático en grant_xp
    # Si falla: ROLLBACK de todo
```

#### Complete Lesson + Check Achievements
```python
with conn:
    conn.execute("INSERT INTO lesson_progress ...")
    grant_xp(conn, tg_id, profile, lesson_xp)
    check_achievements(conn, tg_id, profile)
    # Si falla cualquiera: ROLLBACK de todo
```

---

## Constraints y Validaciones

| Campo | Constraint | Razón |
|-------|-----------|-------|
| `gamification.level` | >= 1 | No puede haber nivel 0 |
| `gamification.xp_current` | >= 0 | XP no puede ser negativo |
| `gamification.xp_next_level` | > xp_current | Umbral siempre adelante |
| `lesson_progress.status` | IN ('locked','unlocked','in_progress','completed') | Estados válidos |
| `mission_progress.status` | IN ('locked','unlocked','in_progress','review','completed','failed') | Estados válidos |
| `evidence.score` | IN (1,2,3,4,5) | Score siempre 1-5 |
| `achievements.condition_value` | > 0 | Valor umbral positivo |
| `tg_id` | > 0 | IDs Telegram válidos |

---

## WAL Mode & Concurrencia

SQLite con `PRAGMA journal_mode=WAL` permite:
- Lecturas concurrentes mientras se escribe
- Escrituras más rápidas (no bloquea lectura)
- Múltiples conexiones simultaneas

```python
conn.execute("PRAGMA journal_mode=WAL")
conn.execute("PRAGMA foreign_keys=ON")
```

---

**Última actualización**: 2026-07-31  
**Version**: Fase 1 Beta  
**Revisión**: Post-Deployment
