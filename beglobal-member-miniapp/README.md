# BeGlobal Member Miniapp

**Telegram miniapp tipo Duolingo para enseñar ecommerce entrepreneurship**

🎮 Gamificación con XP, niveles, logros, rachas  
📱 Responsive mobile-first (Telegram WebApp)  
🎯 Lecciones y misiones  
🚀 FastAPI backend + React frontend  

---

## 🎯 What's This?

BeGlobal Member Miniapp es una plataforma de educación interactiva dentro de Telegram que enseña a usuarios cómo crear y escalar un negocio de ecommerce.

**Features:**
- 📊 10 lecciones con prerequisitos
- 🎲 10 misiones con entregas (links, videos, documentos)
- ⭐ 11 logros (achievements)
- 🔥 Sistema de racha diaria
- 📈 Progresión de niveles exponencial (1-100)
- 🏆 Leaderboard con Redis caching
- 🔄 Escalación automática a perfil Team/Corporate

---

## 📦 Tech Stack

### Backend
- **FastAPI** 0.141.1 - Web framework
- **SQLAlchemy** 2.0.35 - ORM
- **SQLite/PostgreSQL** - Database
- **Redis** 5.1.0 - Caching
- **Python 3.11**

### Frontend
- **React** 18.3.1 - UI framework
- **TypeScript** 5.6.3 - Type safety
- **Tailwind CSS** 3.4.15 - Styling
- **Framer Motion** 11.5.4 - Animations
- **Zustand** 4.5.5 - State management
- **Vite** 5.4.10 - Build tool

### Infrastructure
- **Docker** & **Docker Compose** - Containerization
- **GitHub Actions** - CI/CD
- **Telegram WebApp SDK** - Bot integration

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (easiest)
- OR: Python 3.11 + Node 18

### Start (30 seconds)

```bash
# Clone & setup
cd beglobal-member-miniapp
cp backend/.env.example backend/.env
# Edit backend/.env with your Telegram bot token

# Run everything
docker-compose up

# Open in browser
open http://localhost:5173
```

For detailed setup, see [GETTING_STARTED.md](GETTING_STARTED.md)

---

## 📁 Project Structure

```
beglobal-member-miniapp/
├── backend/              - FastAPI + Python
│   ├── main.py          - FastAPI app
│   ├── db.py            - Database schema
│   ├── gamification.py  - XP/level engine
│   ├── tests/           - Unit tests
│   └── requirements.txt
│
├── frontend/            - React + TypeScript
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/  - UI library
│   │   ├── hooks/       - Custom hooks
│   │   └── store/       - Zustand state
│   ├── package.json
│   └── vite.config.ts
│
└── docker-compose.yml   - Local dev stack
```

---

## 🎮 Gamification System

### XP Progression
```
Level 1:  500 XP
Level 2:  600 XP  (500 * 1.2^1)
Level 3:  720 XP  (500 * 1.2^2)
...
Level 100: 15M+ XP (exponential curve)
```

### Daily Streaks
- Login daily = streak counter
- Miss a day = reset to 0
- Track both current + max streak

### 11 Achievements
- First mission, 5 missions completed
- 3-day, 7-day, 30-day streaks
- Level milestones (2, 5, 10)
- Special: vendor_ready, marketing_pro

### Content
- 10 lessons (easy → medium → hard)
- 10 missions with deliverables
- Lesson prerequisites (DAG structure)

---

## 📊 API Endpoints (7/18 in SPRINT 1)

### Health
- `GET /healthz` - Server status
- `GET /info` - API version

### Onboarding
- `POST /api/member/diagnosis` - User intake (5 questions)

### Content
- `GET /api/member/lessons` - List all lessons
- `GET /api/member/lessons/{id}` - Lesson detail
- `POST /api/member/lessons/{id}/complete` - Mark done

### Dashboard
- `GET /api/member/dashboard` - User stats & progress

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest tests/ -v                    # Run tests
pytest tests/ --cov=. --cov-report=html  # With coverage
```

### Frontend
```bash
cd frontend
npm test                 # Run tests
npm run test:ui         # UI dashboard
```

---

## 📅 Timeline (12 weeks)

| Week | Sprint | Focus | Status |
|------|--------|-------|--------|
| 1 | SPRINT 1 | Foundations (DB, auth, API) | ✅ DONE |
| 2 | SPRINT 2 | Onboarding (diagnosis) | ⏳ Next |
| 3 | SPRINT 3 | Dashboard + Profile | ⏳ |
| 4 | SPRINT 4 | Lessons (skill tree) | ⏳ |
| 5 | SPRINT 5 | Missions (file upload) | ⏳ |
| 6 | SPRINT 6 | Achievements (gallery) | ⏳ |
| 7 | SPRINT 7 | Leaderboard + Escalation | ⏳ |
| 8 | SPRINT 8 | Polish + QA | ⏳ |
| 9-12 | Beta → Launch | Testing + Launch | ⏳ |

---

## ✅ What's Done (SPRINT 1)

### Backend ✅
- [x] Database schema (8 tables)
- [x] XP/level calculation engine
- [x] Achievement system
- [x] Telegram HMAC auth
- [x] 7 API endpoints
- [x] Seed data (10 lessons, 10 missions, 11 achievements)
- [x] Unit tests + coverage
- [x] Docker setup

### Frontend ✅
- [x] React 18 + TypeScript setup
- [x] Tailwind CSS dark theme
- [x] Component library (Button, Card, Badge, Modal, ProgressBar)
- [x] Zustand state management
- [x] Telegram WebApp SDK integration
- [x] HTTP client with auth
- [x] Dashboard view with profile card
- [x] Mobile-responsive design
- [x] Framer Motion animations

### Infrastructure ✅
- [x] GitHub Actions CI/CD
- [x] Docker & Docker Compose
- [x] Environment configuration
- [x] Code coverage setup

---

## 🚀 Next: SPRINT 2 (Aug 7-14)

**Onboarding Flow:**
1. Welcome screen
2. Experience level selector
3. Product type selector
4. Main channel selector
5. Onboarding complete → Dashboard

**What to build:**
- 5 new screens
- Diagnosis form with validation
- Progress indicator
- Navigation flow

---

## 📚 Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** ← Start here
- **[SPRINT_1_COMPLETE.md](SPRINT_1_COMPLETE.md)** - What's done + reference
- **[backend/README.md](backend/README.md)** - API + gamification specs
- **[frontend/README.md](frontend/README.md)** - Component library + hooks
- **[GAME_DESIGN_DOCUMENT_v0.1.md](../GAME_DESIGN_DOCUMENT_v0.1.md)** - Game design

---

## 🔐 Environment

### Backend (.env)
```
MEMBER_BOT_TOKEN=your_token_here
DB_PATH=be_global_member.db
REDIS_URL=redis://localhost:6379
ENV=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8090
VITE_TELEGRAM_BOT_USERNAME=beglobal_member_bot
```

---

## 🎯 Key Metrics

| Metric | Value |
|--------|-------|
| Backend endpoints | 7/18 |
| Frontend components | 6 |
| Tests | 10+ |
| Database tables | 8 |
| Seed lessons | 10 |
| Seed missions | 10 |
| Achievements | 11 |
| Lines of code (SPRINT 1) | 3,200 |

---

## 🔗 Links

- **Telegram Bot:** [@beglobal_member_bot](https://t.me/beglobal_member_bot)
- **API Base:** http://localhost:8090
- **Frontend:** http://localhost:5173
- **Database:** SQLite (`:memory:` in tests)

---

## 📝 License

Closed source - BeGlobal internal project

---

## 👥 Team

- **Architecture:** AI
- **Backend:** Python/FastAPI
- **Frontend:** React/TypeScript
- **QA:** Automated testing

---

## 🚨 Status

```
SPRINT 1: ✅ COMPLETE
  - Foundations laid
  - Backend API ready
  - Frontend scaffolded
  - Tests configured

SPRINT 2: ⏳ STARTING
  - Onboarding UI
  - Diagnosis form
  - Progress flow
```

**Last Updated:** August 1, 2026  
**Ready For:** SPRINT 2 Development

---

**Questions?** See [GETTING_STARTED.md](GETTING_STARTED.md) or check individual READMEs.
