# 🚀 GETTING STARTED - BeGlobal Member Miniapp

## ⚡ Quick Start (5 min)

### Prerequisites
- Docker & Docker Compose
- OR: Python 3.11 + Node 18

### Option 1: Docker (Recommended)

```bash
# 1. Clone repo
cd beglobal-member-miniapp

# 2. Setup environment
cp backend/.env.example backend/.env
# Edit backend/.env and add your MEMBER_BOT_TOKEN

# 3. Start everything
docker-compose up

# 4. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:8090
```

### Option 2: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # on Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with MEMBER_BOT_TOKEN
python -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 3 - Tests:**
```bash
cd backend
pytest tests/ -v --watch  # or use pytest-watch
```

---

## 📁 Project Structure

```
beglobal-member-miniapp/
├── backend/                    - FastAPI + Python
│   ├── main.py                - App entry
│   ├── db.py                  - Database schema
│   ├── gamification.py        - XP/level engine
│   ├── tests/                 - Unit + integration tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                  - React + TypeScript
│   ├── src/
│   │   ├── App.tsx            - Main component
│   │   ├── components/        - React components
│   │   ├── hooks/             - Custom hooks
│   │   ├── store/             - Zustand state
│   │   └── tests/             - Vitest configuration
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
├── .github/
│   └── workflows/ci.yml       - CI/CD pipeline
│
├── docker-compose.yml
├── .gitignore
├── README.md
├── SPRINT_1_COMPLETE.md       - What's done
└── GETTING_STARTED.md         - This file
```

---

## 🧪 Running Tests

### Backend

```bash
cd backend

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=. --cov-report=html

# Run specific test
pytest tests/test_gamification.py -v

# Watch mode
ptw  # requires pytest-watch
```

### Frontend

```bash
cd frontend

# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# UI dashboard
npm run test:ui
```

---

## 🔧 Common Tasks

### Add a Python dependency

```bash
cd backend
pip install package_name
pip freeze > requirements.txt
```

### Add a Node dependency

```bash
cd frontend
npm install package_name
git add package.json package-lock.json
```

### Check types

```bash
# Backend (Pydantic validation)
cd backend && python -m mypy . --ignore-missing-imports

# Frontend
cd frontend && npm run type-check
```

### Format code

```bash
# Backend
cd backend
black .
flake8 .

# Frontend
cd frontend
npm run format  # if configured
```

### Build for production

```bash
# Backend
cd backend
docker build -t beglobal-member:latest .

# Frontend
cd frontend
npm run build  # creates dist/
```

---

## 🔐 Environment Setup

### Backend (.env)

```
MEMBER_BOT_TOKEN=your_telegram_bot_token
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

## 📱 Telegram Integration

### Step 1: Create Bot
1. Go to [@BotFather](https://t.me/botfather) on Telegram
2. `/newbot` → follow prompts
3. Copy the token

### Step 2: Create WebApp
1. Send to BotFather: `/mybots`
2. Select your bot → "App menu"
3. Create app with URL: `https://your-domain.com/miniapp`

### Step 3: Local Testing
1. Add your user ID to allowlist in main.py (temporary)
2. Access via: `https://t.me/your_bot_username/start`

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # need 3.11+

# Check port conflict
lsof -i :8090  # see what's using port 8090

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # need 18+

# Check port conflict
lsof -i :5173
```

### Auth errors (401)
- Check `x-tg-init-data` header is being sent
- Verify bot token in .env
- Ensure Telegram WebApp SDK is initialized

### Database locked
```bash
# SQLite with WAL might have lock files
rm *.db-shm *.db-wal
```

---

## 📚 Documentation

- [Backend README](backend/README.md) - API docs, gamification reference
- [Frontend README](frontend/README.md) - Component library, hooks
- [SPRINT 1 Complete](SPRINT_1_COMPLETE.md) - What's implemented
- [Game Design Document](../GAME_DESIGN_DOCUMENT_v0.1.md) - Gamification spec

---

## 🎯 Next Steps

1. **Try the backend:**
   ```bash
   curl http://localhost:8090/healthz
   ```

2. **Try the frontend:**
   Open http://localhost:5173 in your browser

3. **Read SPRINT_1_COMPLETE.md** to understand what's done

4. **Check backend/README.md** for API endpoints

5. **Start SPRINT 2:** Implement onboarding UI

---

## 💡 Tips

- Use `docker-compose logs -f` to watch logs
- Backend auto-reloads on file changes (development mode)
- Frontend HMR (Hot Module Reload) works in dev
- Tests run in watch mode with live feedback
- Use `.env.local` for local-only overrides

---

## 🆘 Need Help?

1. Check README files in each folder
2. Look at tests for usage examples
3. Review SPRINT_1_COMPLETE.md for implementation details
4. Check git log for recent changes

---

**Status:** ✅ SPRINT 1 COMPLETE  
**Started:** July 31, 2026  
**Ready for:** SPRINT 2 (Onboarding)
