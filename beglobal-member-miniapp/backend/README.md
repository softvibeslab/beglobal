# BeGlobal Member Miniapp Backend

Motores de gamificación y API FastAPI para la miniapp de Telegram.

## SPRINT 1: Foundations

### Archivos creados

```
backend/
├── main.py              - FastAPI app (6 endpoints)
├── db.py               - Database schema (8 tables)
├── gamification.py     - XP/level/achievement engine
├── requirements.txt    - Dependencias Python
├── .env.example        - Variables de entorno
└── tests/
    ├── conftest.py     - Pytest fixtures
    ├── test_gamification.py
    ├── test_endpoints.py
    └── __init__.py
```

### Endpoints implementados

- `GET /healthz` - Health check
- `GET /info` - API info
- `POST /api/member/diagnosis` - Onboarding (diagnosis)
- `GET /api/member/lessons` - List all lessons
- `GET /api/member/lessons/{id}` - Get lesson detail
- `POST /api/member/lessons/{id}/complete` - Mark lesson complete
- `GET /api/member/dashboard` - Dashboard data

### Database schema

- **users**: Telegram user profile
- **gamification**: XP, level, streak, achievements
- **lessons**: Content lessons with prerequisites
- **lesson_progress**: User progress per lesson
- **missions**: Challenges with deliverables
- **mission_progress**: User mission submissions
- **achievements**: Unlock conditions
- **diagnosis_responses**: Onboarding answers
- **audit_trail**: Compliance logging

### Gamification engine

XP progression: 500 * 1.2^(n-1)

```
Level 1: 500 XP
Level 2: 600 XP
Level 3: 720 XP
...
Level 100: 15,476,722 XP (total)
```

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Configuration

```bash
cp .env.example .env
# Edit .env with your Telegram bot token
```

### Run

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8090
```

### Tests

```bash
pytest tests/ -v
pytest tests/ --cov=. --cov-report=html
```

### Next: SPRINT 2

- Frontend onboarding flow
- React setup
- Telegram WebApp SDK integration
