# Fase 1: API de Gamificación - Documentación

## Overview

Fase 1 implementa los endpoints base para el sistema de gamificación Duolingo de Be Global. Incluye:
- Schema de BD (8 tablas nuevas)
- Onboarding inteligente (diagnóstico)
- Sistema de lecciones y misiones
- Gamificación (XP, niveles, logros, racha)
- Integración con perfiles (Team review, Corporate metrics)

## Setup

### 1. Instalar dependencias

```bash
cd /Users/rogergv/Documents/SoftvibesLab/BeGlobal/beglobal/miniapps/api
pip install -r requirements.txt
```

### 2. Inicializar BD

La BD se inicializa automáticamente al arrancar la API:

```bash
DEV_BYPASS=1 uvicorn main:app --reload --port 8090
```

### 3. Verificar seed data

```bash
python3 -c "
import db
db.init_db()
conn = db.connect()
lessons = conn.execute('SELECT COUNT(*) as n FROM lessons').fetchone()
missions = conn.execute('SELECT COUNT(*) as n FROM missions').fetchone()
achievements = conn.execute('SELECT COUNT(*) as n FROM achievements').fetchone()
print(f'✅ {lessons[\"n\"]} lecciones')
print(f'✅ {missions[\"n\"]} misiones')
print(f'✅ {achievements[\"n\"]} logros')
conn.close()
"
```

Esperado:
```
✅ 10 lecciones
✅ 10 misiones
✅ 11 logros
```

---

## Nuevos Endpoints

### Onboarding Inteligente

#### GET `/api/onboarding/diagnosis/questions`
Obtiene las 5 preguntas del diagnóstico personalizado.

**Response:**
```json
{
  "questions": [
    {
      "code": "experience",
      "type": "choice",
      "title": "¿Cuál es tu experiencia con e-commerce?",
      "options": [
        {"id": "beginner", "label": "Nunca lo he hecho"},
        {"id": "intermediate", "label": "Tengo 1-2 intentos"},
        {"id": "advanced", "label": "Soy veterano"}
      ]
    },
    // ... más preguntas
  ]
}
```

#### POST `/api/onboarding/diagnosis/submit`
Procesa respuestas del diagnóstico y retorna recomendaciones personalizadas.

**Request:**
```bash
curl -X POST http://localhost:8090/api/onboarding/diagnosis/submit \
  -H "x-tg-init-data: <init_data>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'responses={
    "experience": "beginner",
    "product": "physical",
    "channel": "instagram",
    "blocker": "conocimiento",
    "capital": "bajo"
  }'
```

**Response:**
```json
{
  "ok": true,
  "profile_level": "beginner",
  "recommended_lessons": [
    {"id": 1, "code": "lesson_01", "title": "🚀 Fundamentos de e-commerce", "xp_reward": 50, ...},
    ...
  ],
  "next_step": "lessons"
}
```

---

### Lecciones

#### GET `/api/lessons`
Lista todas las lecciones desbloqueadas por experiencia del usuario.

**Response:**
```json
{
  "lessons": [
    {
      "id": 1,
      "code": "lesson_01",
      "title": "🚀 Fundamentos de e-commerce",
      "description": "Qué es e-commerce y por qué funciona",
      "difficulty": "easy",
      "duration_minutes": 5,
      "xp_reward": 50,
      "status": "unlocked",
      "quiz_score": null
    },
    ...
  ]
}
```

#### GET `/api/lessons/{lesson_id}`
Obtiene detalles de una lección específica incluyendo progreso.

**Response:**
```json
{
  "lesson": {
    "id": 1,
    "code": "lesson_01",
    "title": "🚀 Fundamentos de e-commerce",
    "content_type": "video",
    "content_url": null,
    "quiz_data": null,
    "xp_reward": 50
  },
  "progress": {
    "status": "locked",
    "quiz_score": null,
    "attempts": 0
  }
}
```

#### POST `/api/lessons/{lesson_id}/complete`
Marca una lección como completada, otorga XP y verifica logros.

**Request:**
```bash
curl -X POST http://localhost:8090/api/lessons/1/complete \
  -H "x-tg-init-data: <init_data>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'quiz_score=95'
```

**Response:**
```json
{
  "ok": true,
  "xp_gained": 50,
  "level_up": false,
  "new_level": null,
  "new_achievements": []
}
```

---

### Misiones

#### GET `/api/missions`
Lista misiones desbloqueadas adaptadas al nivel del usuario.

**Response:**
```json
{
  "missions": [
    {
      "id": 1,
      "code": "mission_01",
      "title": "Tu primer landing",
      "description": "Crea una landing page simple...",
      "difficulty": "easy",
      "xp_reward": 100,
      "time_estimate_minutes": 15,
      "deliverable_type": "link",
      "status": "unlocked",
      "attempts": 0,
      "score": null
    },
    ...
  ]
}
```

#### GET `/api/missions/daily`
Obtiene la misión diaria destacada (próxima misión no completada).

**Response:**
```json
{
  "mission": {
    "id": 1,
    "code": "mission_01",
    "title": "Tu primer landing",
    "description": "...",
    "xp_reward": 100,
    "time_estimate_minutes": 15
  }
}
```

#### POST `/api/missions/{mission_id}/submit`
Envía evidencia de una misión completada.

**Request:**
```bash
curl -X POST http://localhost:8090/api/missions/1/submit \
  -H "x-tg-init-data: <init_data>" \
  -F "note=Mi landing para validar demanda" \
  -F "file=@landing.png"
```

**Response:**
```json
{
  "ok": true,
  "message": "Misión enviada a revisión"
}
```

---

### Gamificación

#### GET `/api/gamification/dashboard`
Dashboard personal con stats completos (nivel, XP, racha, logros).

**Response:**
```json
{
  "level": 1,
  "xp_progress": {
    "current": 0,
    "next_level": 500,
    "pct": 0
  },
  "streak": {
    "current": 0,
    "best": 0
  },
  "stats": {
    "lessons_completed": 0,
    "missions_completed": 0,
    "total_points": 0
  },
  "achievements": [
    {
      "code": "first_mission",
      "title": "Primeros pasos",
      "description": "Completaste tu primera misión",
      "icon": "🚀"
    },
    ...
  ]
}
```

#### POST `/api/gamification/complete-daily`
Completa la misión diaria, actualiza racha y otorga bonus XP.

**Response:**
```json
{
  "ok": true,
  "streak": 1,
  "streak_bonus": 25
}
```

---

### Team: Revisión de Misiones

#### GET `/api/team/missions-queue`
Cola de misiones pendientes de revisar.

**Response:**
```json
{
  "queue": [
    {
      "id": 1,
      "tg_id": 123456789,
      "name": "Juan",
      "title": "Tu primer landing",
      "xp_reward": 100,
      "completed_at": 1722470400,
      "filename": "landing.png",
      "evidence_count": 1
    },
    ...
  ]
}
```

#### POST `/api/team/mission/{mp_id}/approve`
Aprueba una misión y otorga XP al miembro.

**Request:**
```bash
curl -X POST http://localhost:8090/api/team/mission/1/approve \
  -H "x-tg-init-data: <init_data>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'score=5&feedback=Excelente landing, muy clara la propuesta'
```

**Response:**
```json
{
  "ok": true,
  "xp_granted": 100,
  "member_level": 2
}
```

---

### Corporate: Métricas de Gamificación

#### GET `/api/corporate/gamification-metrics`
Métricas agregadas de engagement y gamificación.

**Response:**
```json
{
  "total_registered": 50,
  "active_this_week": 32,
  "avg_level": 2.5,
  "total_missions_completed": 145,
  "total_xp_earned": 18500,
  "engagement_pct": 64.0
}
```

---

## Cambios en Base de Datos

### Nuevas columnas en `users`
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS (
  experience_level TEXT,
  product_type TEXT,
  main_channel TEXT,
  main_blocker TEXT,
  onboarding_step TEXT DEFAULT 'diagnosis',
  diagnosis_complete INTEGER DEFAULT 0,
  last_activity INTEGER
);
```

### 8 Nuevas tablas
- `gamification` — Estado de gamificación por usuario/perfil
- `lessons` — Catálogo de lecciones
- `lesson_progress` — Progreso por usuario en lecciones
- `missions` — Catálogo de misiones
- `mission_progress` — Progreso por usuario en misiones
- `achievements` — Catálogo de logros/achievements
- `diagnosis_responses` — Respuestas del diagnóstico por usuario
- `learning_sessions` — Telemetría de sesiones de aprendizaje

### Índices
- `idx_gamification_profile` — Para queries de perfil
- `idx_lesson_progress_status` — Para queries de estado
- `idx_mission_progress_status` — Para queries de estado
- `idx_learning_sessions_tg_id` — Para telemetría
- `idx_diagnosis_responses_tg_id` — Para diagnóstico

---

## Variables de Entorno

Agregar a `.env`:

```bash
# Existentes
DB_PATH=/path/to/beglobal.db
MEDIA_DIR=/srv/beglobal/mediahub
TELEGRAM_BOT_TOKEN=...

# Nuevas para Gamificación (opcionales)
GAMIFICATION_ENABLED=1
XP_LEVEL_UP_THRESHOLD=500
STREAK_RESET_HOURS=48
```

---

## Testing Local

### 1. Iniciar API

```bash
cd /Users/rogergv/Documents/SoftvibesLab/BeGlobal/beglobal/miniapps/api
DEV_BYPASS=1 uvicorn main:app --reload --port 8090
```

### 2. Test de Diagnóstico

```bash
curl -X GET http://localhost:8090/api/onboarding/diagnosis/questions \
  -H "x-tg-init-data: test_data"
```

### 3. Test de Submit Diagnóstico

```bash
curl -X POST http://localhost:8090/api/onboarding/diagnosis/submit \
  -H "x-tg-init-data: test_data" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'responses={"experience":"beginner","product":"physical","channel":"instagram","blocker":"conocimiento","capital":"bajo"}'
```

### 4. Test de Lecciones

```bash
curl -X GET http://localhost:8090/api/lessons \
  -H "x-tg-init-data: test_data"
```

### 5. Test de Completar Lección

```bash
curl -X POST http://localhost:8090/api/lessons/1/complete \
  -H "x-tg-init-data: test_data" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'quiz_score=95'
```

### 6. Test de Dashboard

```bash
curl -X GET http://localhost:8090/api/gamification/dashboard \
  -H "x-tg-init-data: test_data"
```

---

## Checklist de Fase 1

- [x] Schema DB con 8 tablas nuevas
- [x] Seed data: 10 lecciones, 10 misiones, 11 logros
- [x] API endpoints de diagnóstico
- [x] API endpoints de lecciones
- [x] API endpoints de misiones
- [x] API endpoints de gamificación (member)
- [x] API endpoints de team (revisión)
- [x] API endpoints de corporate (métricas)
- [x] Utilidades de gamificación (XP, streaks, achievements)
- [x] Telemetría y learning sessions
- [ ] Tests unitarios
- [ ] Documentación de BD (ER diagram)
- [ ] Deployment en VPS

---

## Próximos pasos

**Fase 2 (Frontend Duolingo)**
- Diagnosis UI interactivo
- Skill Tree de lecciones
- Card grid de misiones
- Dashboard de progreso con animaciones
- Implementar Telegram Mini App SDK

**Fase 3 (Integración)**
- Team queue dashboard
- Corporate metrics dashboard
- Enrutamiento automático a perfiles
- Push notifications

---

## Troubleshooting

### "Module 'gamification' not found"
Asegúrate de que `gamification.py` está en el mismo directorio que `main.py`.

### "Tabla ya existe"
SQLite ignora `CREATE TABLE IF NOT EXISTS`, so esto no es problema. Si necesitas reset total:
```bash
rm beglobal.db
python3 -c "import db; db.init_db()"
```

### "x-tg-init-data invalid"
En dev, `DEV_BYPASS=1` permite cualquier valor. En prod, necesitas token real de Telegram.

---

**Estado**: ✅ Fase 1 Completada  
**Fecha**: 2026-07-31  
**Autor**: Claude Code  
**Próxima revisión**: Post-deployment en VPS
