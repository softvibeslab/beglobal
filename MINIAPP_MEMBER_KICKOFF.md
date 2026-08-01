# 🎮 BeGlobal Member Miniapp - KICKOFF DOCUMENT
**Lanzamiento:** Lunes, Agosto 4, 2026  
**Timeline:** 12 semanas → MVP Público  
**Estado:** ✅ AUTORIZADO

---

## 📋 TEAMS & ASSIGNMENTS

### TEAM A: RESEARCH + DESIGN (Sem 1-4)

| Nombre | Rol | Email | Horas |
|--------|-----|-------|-------|
| Sofia | UX Researcher | sofia@beglobal.com | 30h/sem |
| Carlos | Product Manager | carlos@beglobal.com | 35h/sem |
| Maria | UI/UX Designer | maria@beglobal.com | 35h/sem |
| Juan | Game Designer | juan@beglobal.com | 15h/sem (consulting) |
| Laura | UX Architect | laura@beglobal.com | 20h/sem |

**Backup:** Behavioral Nudge Engine (15h/sem), Whimsy Injector (10h/sem)

---

### TEAM B: DEVELOPMENT + QA (Sem 5-12)

| Nombre | Rol | Email | Horas |
|--------|-----|-------|-------|
| Alex | Frontend Developer | alex@beglobal.com | 35h/sem |
| Diego | Backend Developer | diego@beglobal.com | 35h/sem |
| Ana | QA/Tester | ana@beglobal.com | 30h/sem |
| Miguel | Backend Architect | miguel@beglobal.com | 20h/sem |
| Rosa | Technical Artist | rosa@beglobal.com | 15h/sem (animations) |

**Backup:** DevOps Automator (5h), API Tester (5h)

---

## 📅 SEMANA 1-2: RESEARCH + DESIGN KICKOFF

### LUNES 9:00 AM: Kickoff Meeting (60 min)

**Asistentes:** Ambos teams  
**Agenda:**
1. Vision overview (10 min)
2. Timeline + deliverables (15 min)
3. Team assignments (5 min)
4. Tool setup check (10 min)
5. Q&A (20 min)

**Zoom:** [Link TBD]

---

### LUNES-VIERNES: RESEARCH SPRINT

**Sofia (UX Researcher)** - Contacto principal
- **Objetivo:** 10 user interviews (async, 30 min cada una)
- **Target:** Mix de usuarios BeGlobal: principiantes, intermedios, ex-usuarios
- **Script:** ¿Qué te motiva a aprender ecommerce? ¿Qué te hace parar?
- **Outputs:** User personas, pain points, feature requests
- **Entrega:** Viernes 5 PM (research findings doc)

**Contacts para recrutar:**
- Hermes Slack: #beglobal-mentees
- Email lista: mentees@beglobal.com
- Incentivo: 100 XP bonus (cuando miniapp esté lista)

---

### LUNES-VIERNES: DESIGN KICKOFF SPRINT

**Carlos (Product Manager)** - Creador de estrategia
- Refinance Product Strategy doc (basado en research)
- Define success metrics (DAU, retention, NPS targets)
- Create feature prioritization matrix
- **Entrega:** Jueves 6 PM (estrategia refinada)

**Maria (UI/UX Designer)** - Design system inicial
- Setup Figma file: BeGlobal Member Design System v1
- Colores + tipografía + componentes base
- Create style guide (4-5 páginas)
- Start wireframes Lo-Fi (5 screens)
- **Entrega:** Viernes 5 PM (Figma link)

**Laura (UX Architect)** - Arquitectura técnica
- Map out responsive grid system
- Define component hierarchy
- CSS architecture plan (Tailwind tokens)
- Accessibility foundation (WCAG AA checklist)
- **Entrega:** Viernes 5 PM (architecture doc)

**Juan (Game Designer)** - Game Design Doc
- First draft: Mecánicas principales
- XP curves + level progression
- Achievement definitions (11 total)
- Daily challenges design
- **Entrega:** Viernes 4 PM (GDD v0.1)

---

### LUNES-VIERNES: DEVELOPMENT PREP

**Miguel (Backend Architect)** - API contracts
- Define endpoint specs (diagnosis, lessons, missions, etc.)
- Database schema (extend current gamification)
- Authentication flow (Telegram WebApp)
- Rate limiting + error handling
- **Entrega:** Viernes 5 PM (Swagger spec)

**Alex (Frontend Developer)** - Project setup
- Initialize React + TypeScript repo
- Setup Tailwind CSS + custom theme
- Telegram WebApp SDK integration
- Folder structure + component stubs
- **Entrega:** Viernes 2 PM (GitHub repo ready)

**Ana (QA/Tester)** - QA framework
- Setup testing infrastructure (Jest + Playwright)
- Create accessibility testing checklist
- Define CI/CD pipeline basics
- Mobile testing devices list
- **Entrega:** Viernes 4 PM (testing plan)

---

## 🔗 TOOLS & REPOS

### Diseño
- **Figma:** https://figma.com/file/beglobal-member-miniapp
  - Owner: Maria
  - Access: Editor (all team A)
  - Sync: Weekly design reviews (Thursdays 4 PM)

### Desarrollo
- **GitHub:** https://github.com/softvibes/beglobal-member-miniapp
  - Owner: Alex
  - Branches: main, develop, feature/*
  - CI/CD: GitHub Actions (auto-deploy to staging)

### Documentación
- **Notion:** https://notion.so/beglobal-member-project
  - Owner: Carlos
  - Shared: All team
  - Sections: Roadmap, Spec, Decisions, Metrics, Bugs

### Comunicación
- **Slack channel:** #beglobal-member-miniapp
  - Daily standup: 10 AM (async, update thread)
  - Weekly sync: Thursdays 3 PM
  - Quick questions: thread replies

### Analytics
- **Mixpanel dashboard** (for post-launch)
- **Sentry** (error tracking)
- **Lighthouse CI** (performance)

---

## 📊 RESEARCH INTERVIEW TEMPLATE

**Duración:** 30 minutos  
**Formato:** Loom recording (no call, async)

### Script:
```
1. Intro (2 min)
   "Hola! Estamos diseñando una nueva experiencia 
    para aprender ecommerce jugando. 
    Queremos saber: ¿cómo aprendes tú?"

2. Background (5 min)
   - ¿Cuál es tu experiencia con ecommerce?
   - ¿Qué producto/nicho tienes en mente?
   - ¿Cuánto tiempo llevas intentando?

3. Learning style (8 min)
   - ¿Qué te motiva a aprender?
   - ¿Qué tipo de contenido prefieres? (video, escrito, interactivo)
   - ¿A qué hora aprendes normalmente?

4. Pain points (10 min)
   - ¿Qué te ha hecho abandonar en el pasado?
   - ¿Qué te hace seguir intentando?
   - ¿Qué te gustaría en una app de aprendizaje?

5. Closing (5 min)
   - ¿Qué es lo más importante para ti?
   - ¿Alguna pregunta para nosotros?
```

**Recruiting message:**
```
Hola! 👋

Estamos creando una miniapp tipo Duolingo 
para aprender ecommerce jugando. 

¿Te gustaría participar en una entrevista rápida (30 min)?
→ Grabación async
→ 100 XP bonus cuando esté lista

¿Sí? Responde aquí: [Calendly link]
```

---

## 🎨 DESIGN BRIEF (SEMANA 3-4)

### Visual Direction
```
Inspiración: Duolingo + BeGlobal brand

Color Palette:
  Primary:   #55d6e8 (Cyan - energía, acción)
  Success:   #70d8aa (Verde - logro, completado)
  Warning:   #ffbd66 (Ámbar - reto, en progreso)
  Danger:    #ff6b6b (Rojo - error, pero amigable)
  Background: #07101c (Gris oscuro - dark mode default)
  Text:      #ffffff (Blanco para contraste)

Typography:
  Display:   Poppins Bold 32px (motivación)
  Heading:   Poppins SemiBold 20px (secciones)
  Body:      Inter Regular 16px (contenido)
  Label:     Inter SemiBold 12px (botones, badges)

Spacing:
  Grid:      8px base unit
  Cards:     16px padding
  Sections:  24px gap

Corners:
  Buttons:   8px radius
  Cards:     12px radius
  Modals:    16px radius

Shadows:
  Light:     0 2px 4px rgba(0,0,0,0.1)
  Medium:    0 4px 12px rgba(0,0,0,0.15)
  Dark:      0 8px 24px rgba(0,0,0,0.2)
```

### Component Library (Must-have)
1. **Button** (primary, secondary, ghost, disabled states)
2. **Card** (lesson, mission, achievement variants)
3. **Badge** (level, streak, achievement unlock)
4. **Progress bar** (XP, racha, lesson completion)
5. **Modal** (lesson detail, mission submit, celebration)
6. **Toast** (notifications, errors)
7. **Input** (form fields, accessibility labels)
8. **Leaderboard card** (ranking, user stats)
9. **Hexagon** (for skill tree)
10. **Avatar** (user profile, team avatars)

### Screen Priority (Sem 3-4)
- Week 3 (LoFi → HiFi conversion):
  1. Onboarding (diagnosis flow, 5 screens)
  2. Dashboard (overview, stats, navigation)
  3. Skill tree (hexagon grid layout)
  
- Week 4 (Detail + interaction):
  4. Lesson detail (video, quiz, completion)
  5. Mission detail (description, upload, submit)
  6. Achievement unlock (celebration fullscreen)
  7. Leaderboard (top 10 rankings)
  8. Profile (stats, badges, streak calendar)

---

## 🔧 BACKEND API CONTRACTS (SEMANA 5-6)

### Endpoints Priority

#### Phase 1: Core
```
POST /api/member/diagnosis
  Input: answers (5 diagnosis questions)
  Output: recommendation, first_lesson_id
  
GET /api/member/lessons
  Query: ?status=locked|unlocked|completed
  Output: [lessons with progress]
  
GET /api/member/lessons/{id}
  Output: lesson detail + quiz data
  
POST /api/member/lessons/{id}/complete
  Input: quiz_answers
  Output: xp_awarded, level_up_data
  
GET /api/member/missions
  Query: ?difficulty=easy|medium|hard
  Output: [missions with progress]
  
POST /api/member/missions/{id}/submit
  Input: deliverable_url, file, notes
  Output: submission_id, review_pending
  
GET /api/member/dashboard
  Output: xp, level, streak, achievements, missions_progress
  
GET /api/member/leaderboard
  Query: ?limit=10
  Output: top_10_users with scores
```

#### Phase 2: Engagement
```
GET /api/member/achievements
  Output: all achievements + unlock status
  
POST /api/member/escalate-to-team
  Output: new_profile, bonus_xp
  
GET /api/member/notifications/pending
  Output: unread notifications
```

### Database Schema (Extend)
```sql
-- Existing tables (from current gamification.db):
users, gamification, lessons, lesson_progress, 
missions, mission_progress, achievements, 
diagnosis_responses, audit_trail

-- New tables:
notification_queue (id, user_id, type, data, read)
leaderboard_cache (user_id, rank, score, updated_at)
daily_challenges (date, mission_id, 2x_multiplier)
```

---

## 💻 FRONTEND REPO STRUCTURE

```
beglobal-member-miniapp/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Toast.tsx
│   │   ├── features/
│   │   │   ├── Onboarding/
│   │   │   ├── Dashboard/
│   │   │   ├── SkillTree/
│   │   │   ├── Lesson/
│   │   │   ├── Mission/
│   │   │   ├── Achievements/
│   │   │   └── Leaderboard/
│   ├── hooks/
│   │   ├── useTelegram.ts
│   │   ├── useGameState.ts
│   │   ├── useNotifications.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── gamification.ts
│   ├── store/
│   │   └── gameStore.ts (Zustand)
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.config.ts
│   └── App.tsx
├── public/
│   └── assets/
├── tests/
│   ├── components/
│   └── integration/
├── .github/workflows/
│   └── ci.yml
└── package.json
```

---

## 📈 SUCCESS METRICS (BASELINE)

### Week 1-2 (Research)
- ✅ 10 interviews completadas
- ✅ 5+ user personas identificadas
- ✅ Top 5 pain points documentados

### Week 3-4 (Design)
- ✅ Design system v1 completado (Figma)
- ✅ 10 screens en HiFi
- ✅ Component specs documentados

### Week 5-6 (Backend + Frontend)
- ✅ API 80% implementada
- ✅ Frontend skeleton funcional
- ✅ Deployed to staging

### Week 7-8 (Features)
- ✅ 70% features implementadas
- ✅ Animations integrated
- ✅ Mobile responsive

### Week 9-10 (MVP)
- ✅ 100% features completadas
- ✅ Bug P0 = 0
- ✅ WCAG AA > 95%

### Week 11 (Beta)
- ✅ 50 beta users
- ✅ DAU > 50%
- ✅ NPS > 40

### Week 12 (Launch)
- ✅ Public launch
- ✅ 500+ users in first day
- ✅ Metrics dashboard live

---

## 📞 COMMUNICATION CADENCE

### Daily
- **10 AM Standup** (async Slack thread)
  - Team A: Research progress + blockers
  - Team B: Dev progress + blockers
  - Format: 2-3 lines each, thread replies

### Weekly (Thursdays)
- **3 PM Team Sync** (30 min Zoom)
  - Review metrics + deliverables
  - Demo if applicable
  - Plan next week

- **4 PM Design Review** (30 min Figma)
  - Design team presents weekly work
  - Feedback loop
  - Approval for dev handoff

- **5 PM Sprint Planning** (15 min, async docs)
  - Next sprint definition
  - Task assignment
  - Dependency mapping

### Bi-weekly (Mondays)
- **Executive Sync** (30 min, Roger + PMs)
  - Overall progress
  - Risk mitigation
  - Stakeholder updates

---

## ⚠️ CRITICAL PATHS & DEPENDENCIES

```
Week 1-2:
  Research → Design Strategy (must complete by Fri)
  
Week 3-4:
  Design System → Component specs → Dev setup
  
Week 5-6:
  API contracts → Backend implementation
  Design → Frontend components
  
Week 7-12:
  Feature implementation (mostly parallel)
  Testing + QA (continuous)
```

---

## 🎯 WEEK 1 DELIVERABLES CHECKLIST

### Team A
- [ ] Research interviews scheduled (10 slots booked)
- [ ] Figma workspace created + shared
- [ ] Design brief refined + approved
- [ ] Product strategy doc started
- [ ] GDD v0.1 started

### Team B
- [ ] GitHub repo initialized + shared
- [ ] Telegram WebApp SDK integrated
- [ ] Tailwind CSS configured
- [ ] Component stubs created
- [ ] API spec drafted
- [ ] DB schema designed

### Cross-team
- [ ] Slack channel active (#beglobal-member-miniapp)
- [ ] Notion workspace setup
- [ ] Standup template created
- [ ] First design review scheduled (Thu 4 PM)
- [ ] First sprint planning ready (Mon)

---

## 📧 STARTING EMAILS

### To Team A (Monday 8 AM):
```
Asunto: 🚀 BeGlobal Member Miniapp - Kick Off This Week!

Hola Sofia, Carlos, Maria, Laura, Juan!

¡Oficial! Comenzamos lunes con el proyecto de la miniapp Member.

Timeline: 12 semanas → MVP público
Vision: Duolingo + BeGlobal = Juego para aprender ecommerce

Esta semana:
✅ Sofia: Research interviews (10 usuários)
✅ Carlos: Strategy refinement
✅ Maria: Design system v1 + wireframes LoFi
✅ Laura: Architecture + accessibility plan
✅ Juan: Game Design Doc v0.1

Kickoff: Lunes 9 AM en [Zoom link]
First design review: Jueves 4 PM

Questions? Slack channel: #beglobal-member-miniapp

¡Vamos! 🚀
Roger
```

### To Team B (Monday 8 AM):
```
Asunto: 🚀 BeGlobal Member Miniapp - Tech Stack Go!

Hola Alex, Diego, Ana, Miguel, Rosa!

Oficialmente autorizados para comenzar LUNES.

Timeline: 12 semanas → MVP público
Goal: Producción-ready miniapp con gamificación Duolingo-style

Esta semana:
✅ Alex: Repo setup + React + Tailwind init
✅ Diego: Backend API spec finalization
✅ Ana: QA framework + testing setup
✅ Miguel: DB schema design
✅ Rosa: Animation library research

Kickoff: Lunes 9 AM en [Zoom link]
First dev sync: Martes 3 PM (Miguel + Alex)

Tech stack confirmed:
- Frontend: React 18 + TypeScript + Tailwind + Framer Motion
- Backend: FastAPI (existing) + PostgreSQL (migration later)
- Deploy: Vercel (frontend) + Docker (backend)

Repo: https://github.com/softvibes/beglobal-member-miniapp
Notion: https://notion.so/beglobal-member-project
Slack: #beglobal-member-miniapp

¡Let's build! 🎮
Roger
```

---

## 🎬 LUNES 9 AM KICKOFF AGENDA

```
KICKOFF MEETING - 60 minutos
Asistentes: Ambos teams + Roger

9:00-9:05 (5 min)
Intro: Roger
- Bienvenida
- Por qué este proyecto
- Timeline overview

9:05-9:20 (15 min)
Vision & Strategy: Carlos
- Visión: Duolingo + BeGlobal
- Target user: Member que quiere aprender ecommerce
- Success criteria: DAU, retention, NPS

9:20-9:35 (15 min)
Architecture Overview: Miguel + Maria
- Frontend tech stack
- Backend API structure
- Design system approach

9:35-9:50 (15 min)
Timeline & Deliverables: Roger
- 12-week plan overview
- Weekly deliverables
- Critical paths

9:50-10:00 (10 min)
Q&A
- Blockers?
- Clarity?
- Concerns?

Slides: [Figma link]
Recording: Will be posted to Slack
```

---

## ✅ FINAL CHECKLIST BEFORE MONDAY

- [ ] All team members confirmed attending
- [ ] Zoom link sent to everyone
- [ ] Figma workspace created + shared (link in Slack)
- [ ] GitHub repo created + shared (link in Slack)
- [ ] Notion workspace ready + shared
- [ ] Slack channel created (#beglobal-member-miniapp)
- [ ] Research recruiting emails sent (10 slots)
- [ ] Calendar invites sent for all syncs (weekly)
- [ ] Kickoff slides prepared
- [ ] Backup video (Loom) if timezone issues

---

## 🚀 READY TO LAUNCH

**Lunes, 4 de Agosto de 2026, 9 AM**

Let's build the best ecommerce learning experience! 🎮✨

---

**Preguntas antes de empezar?** Roger: roger@beglobal.com
