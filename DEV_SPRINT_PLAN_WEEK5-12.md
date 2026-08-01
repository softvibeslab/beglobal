# 💻 Development Sprint Plan: Week 5-12 (8 Sprints de 1 Semana)

**Responsable:** Miguel (Backend Architect) + Alex (Frontend Lead)  
**Timeline:** Lunes 18 Agosto - Viernes 10 Octubre  
**Metodología:** Agile 1-week sprints + daily standup  

---

## 🏗️ TECH STACK FINAL

### Frontend
```json
{
  "framework": "React 18 + TypeScript 5",
  "styling": "Tailwind CSS 3 + custom theme",
  "animations": "Framer Motion 10",
  "state": "Zustand",
  "http": "TanStack Query v5",
  "form": "React Hook Form",
  "validation": "Zod",
  "build": "Vite",
  "testing": "Vitest + Playwright",
  "deployment": "Vercel",
  "mobile": "Telegram WebApp SDK"
}
```

### Backend (Extend Existing)
```json
{
  "framework": "FastAPI 0.141",
  "database": "SQLite → PostgreSQL (migration sem 11)",
  "cache": "Redis (leaderboard)",
  "auth": "HMAC-SHA256 (Telegram)",
  "testing": "pytest",
  "deployment": "Docker + supervisord",
  "hosting": "31.220.63.211 (current VPS)"
}
```

### Infrastructure
```
Staging: https://beglobal-staging.rovicrm.com
Production: https://beglobal.rovicrm.com/app/member/
CI/CD: GitHub Actions (auto-deploy)
Monitoring: Sentry + Datadog
```

---

## 📅 SPRINT SCHEDULE (8 × 1-week sprints)

### SPRINT 1: Foundations (Aug 18-22)
**Theme:** Core architecture + database + API setup

#### Backend Tasks (Diego):
- [ ] Migrate gamification tables (SQLite → PostgreSQL ready)
- [ ] Implement XP/level calculation engine
- [ ] Auth middleware (Telegram HMAC validation)
- [ ] Seed data (10 lessons, 10 missions, 11 achievements)
- [ ] Database migrations scripts
- [ ] **Deliverable:** API running locally, tests passing

#### Frontend Tasks (Alex):
- [ ] Establish component structure
- [ ] Setup Tailwind theme (colors, spacing, typography)
- [ ] Create component stubs (Button, Card, Modal, Badge, etc.)
- [ ] Telegram WebApp SDK integration
- [ ] Routing setup (React Router)
- [ ] State management (Zustand store skeleton)
- [ ] **Deliverable:** Storybook with 10+ components

#### QA Tasks (Ana):
- [ ] Setup Jest + Vitest
- [ ] Setup Playwright for E2E
- [ ] Accessibility testing checklist
- [ ] Performance baseline (Lighthouse)
- [ ] **Deliverable:** CI/CD pipeline passing, coverage baseline

---

### SPRINT 2: Onboarding (Aug 25-29)
**Theme:** User entry point + diagnosis flow

#### Backend Tasks (Diego):
- [ ] POST /api/member/diagnosis endpoint
  - Input: 5 diagnosis answers
  - Output: user profile + recommendation
- [ ] GET /api/member/onboarding-status
- [ ] Database logic for diagnosis storage
- [ ] **Tests:** 5 unit tests (happy path + edge cases)

#### Frontend Tasks (Alex):
- [ ] Onboarding screens (5 screens)
  1. Welcome (call-to-action)
  2. Q1: Experience level
  3. Q2: Product/niche
  4. Q3: Main channel
  5. Q4+Q5: Blocker + capital
- [ ] Progress bar (visual progress)
- [ ] Diagnosis form validation
- [ ] Submit + redirect to dashboard
- [ ] **Deliverable:** Full onboarding flow working

#### QA Tasks (Ana):
- [ ] Mobile onboarding testing (3 devices)
- [ ] Form validation E2E tests
- [ ] Accessibility: form labels, keyboard nav
- [ ] **Deliverable:** Bugs identified + prioritized

---

### SPRINT 3: Dashboard + Profile (Sep 1-5)
**Theme:** User home screen + stats display

#### Backend Tasks (Diego):
- [ ] GET /api/member/dashboard
  - Returns: xp, level, streak, missions_progress, achievements
  - Caching layer (Redis 30s)
- [ ] GET /api/member/profile
  - Stats: total_xp, level, streak_max, missions_completed
- [ ] Streak calculation logic (daily tracking)
- [ ] **Tests:** 8 unit tests

#### Frontend Tasks (Alex):
- [ ] Dashboard main screen
  - Hero: XP bar + level badge
  - Stats grid: streaks, missions, achievements
  - Quick access buttons (lessons, missions, profile)
- [ ] Profile modal/page
  - Avatar + name
  - Stats cards
  - Badge showcase
- [ ] Dark mode toggle
- [ ] **Deliverable:** Dashboard fully functional

#### Design (Maria):
- [ ] Final animations for dashboard
- [ ] Profile page wireframe finalized
- [ ] Component polish

#### QA Tasks (Ana):
- [ ] Dashboard rendering (various screen sizes)
- [ ] Streak logic tests
- [ ] Performance: dashboard load <1s
- [ ] **Deliverable:** Dashboard QA passed

---

### SPRINT 4: Skill Tree (Sep 8-12)
**Theme:** Lessons display + progression

#### Backend Tasks (Diego):
- [ ] GET /api/member/lessons
  - Filter: ?status=locked|unlocked|completed
  - Return: lesson metadata + progress
- [ ] GET /api/member/lessons/{id}
  - Full lesson details + quiz data
- [ ] POST /api/member/lessons/{id}/start
  - Track session start
- [ ] Prerequisite validation logic
- [ ] **Tests:** 10 unit tests

#### Frontend Tasks (Alex):
- [ ] Skill tree hexagon grid layout
  - Responsive: 6 columns (desktop) → 3 (tablet) → 2 (mobile)
  - Hexagon component with states (locked, unlocked, completed)
- [ ] Lesson detail modal
  - Display video/quiz/content
  - Progress indicator
- [ ] Prerequisite blocking (show as "locked")
- [ ] Click to start → lesson view
- [ ] **Deliverable:** Full skill tree interactive

#### Rosa (Technical Artist):
- [ ] Hexagon shape optimization
- [ ] Smooth transitions between states
- [ ] Locked state visual (grayscale + lock icon)

#### QA Tasks (Ana):
- [ ] Hexagon grid responsive testing
- [ ] Prerequisite logic validation
- [ ] State transitions E2E
- [ ] **Deliverable:** Skill tree fully tested

---

### SPRINT 5: Lesson Experience (Sep 15-19)
**Theme:** Complete lesson + quiz flow

#### Backend Tasks (Diego):
- [ ] POST /api/member/lessons/{id}/complete
  - Input: quiz_answers
  - Calculate XP (50-150 based on difficulty)
  - Award XP + trigger level check
  - Trigger achievement check
- [ ] GET /api/member/lessons/{id}/quiz
  - Return quiz questions + answers
- [ ] Assessment logic (passing score, retry logic)
- [ ] **Tests:** 15 unit tests

#### Frontend Tasks (Alex):
- [ ] Lesson content display
  - Video player (embed YouTube)
  - Quiz interface (multiple choice)
  - Content blocks (text, images)
- [ ] Quiz validation
- [ ] Completion celebration animation
  - Confetti effect
  - XP popup
  - "Great job!" toast
- [ ] Retry logic (if failed)
- [ ] **Deliverable:** End-to-end lesson experience

#### Rosa (Technical Artist):
- [ ] Confetti animation (Lottie file)
- [ ] Completion celebration choreography
- [ ] XP gain popup animation

#### QA Tasks (Ana):
- [ ] Quiz answer validation
- [ ] XP calculation verification
- [ ] Completion animation testing
- [ ] Mobile quiz UX testing
- [ ] **Deliverable:** Lesson experience QA passed

---

### SPRINT 6: Missions + Upload (Sep 22-26)
**Theme:** Mission delivery + file upload system

#### Backend Tasks (Diego):
- [ ] GET /api/member/missions
  - Filter: ?difficulty=easy|medium|hard
  - Return: mission cards + user progress
- [ ] GET /api/member/missions/{id}
  - Full mission details + deliverable specs
- [ ] POST /api/member/missions/{id}/submit
  - File upload handling (max 20MB)
  - Store deliverable URL + notes
  - Set status to "review_pending"
  - Trigger notification to Team
- [ ] File storage (S3 or local /media)
- [ ] **Tests:** 12 unit tests

#### Frontend Tasks (Alex):
- [ ] Missions list view
  - Card grid (similar to lessons)
  - Difficulty badges (easy/medium/hard)
  - Progress per mission
  - Daily mission highlight (2x XP)
- [ ] Mission detail modal
  - Mission description + deliverable type
  - Resource links (templates, examples)
  - File upload area (drag-drop)
  - Submission form (notes textarea)
- [ ] Upload progress indicator
- [ ] Success/error states
- [ ] **Deliverable:** Full mission submission flow

#### QA Tasks (Ana):
- [ ] File upload E2E tests (various formats)
- [ ] Form validation (required fields)
- [ ] Mobile upload UX
- [ ] Error handling (file too large, format invalid)
- [ ] **Deliverable:** Upload system stress tested

---

### SPRINT 7: Achievements + Notifications (Sep 29-Oct 3)
**Theme:** Achievement unlock system + notifications

#### Backend Tasks (Diego):
- [ ] Achievement check logic
  - After lesson: check all achievements
  - After mission: check all achievements
  - Detect unlock conditions
- [ ] POST /api/member/achievements/{id}/claim
  - Mark as claimed + award XP bonus
- [ ] GET /api/member/achievements
  - Return: unlocked + locked achievements
- [ ] Notification queue system
  - Queue notifications in DB
  - POST to /api/notifications (existing)
- [ ] **Tests:** 10 unit tests

#### Frontend Tasks (Alex):
- [ ] Achievement unlock modal (fullscreen)
  - Animated medal icon
  - Achievement name + description
  - XP bonus display
  - "Claim reward" button
- [ ] Achievement gallery page
  - Grid of all achievements
  - Locked/unlocked states
  - Animation on unlock
- [ ] Toast notifications
  - Mission approved/rejected
  - Streak milestones
  - Level up notifications
- [ ] In-app notification history
- [ ] **Deliverable:** Achievement system fully integrated

#### Rosa (Technical Artist):
- [ ] Medal animation (unlock moment)
- [ ] Achievement badge animations
- [ ] Notification toast transitions

#### QA Tasks (Ana):
- [ ] Achievement unlock trigger tests
- [ ] Notification delivery tests
- [ ] Modal animation performance
- [ ] Edge cases (simultaneous unlocks)
- [ ] **Deliverable:** Achievement system QA passed

---

### SPRINT 8: Leaderboard + Escalation (Oct 6-10)
**Theme:** Gamification completion + Team escalation

#### Backend Tasks (Diego):
- [ ] GET /api/member/leaderboard
  - Top 10 users by XP/level
  - User's rank
  - Caching (Redis 60s)
- [ ] Escalation eligibility check
  - After mission completion: check if >=5 missions + >=500 XP
  - GET /api/member/escalation/check-eligibility
- [ ] POST /api/member/escalate-to-team
  - Update user profile to "team"
  - Award bonus XP (500)
  - Trigger audit log + notification
- [ ] **Tests:** 8 unit tests

#### Frontend Tasks (Alex):
- [ ] Leaderboard page
  - Top 10 cards (rank, avatar, name, XP, level)
  - User's position (highlighted)
  - Refresh button
  - Mobile-optimized view
- [ ] Escalation modal
  - When eligible: show "Ready for Team?"
  - Show benefits (new abilities, community)
  - Confirm + escalate button
  - Success celebration animation
- [ ] Post-escalation redirect (to Team dashboard - stub for now)
- [ ] **Deliverable:** Complete gamification loop

#### QA Tasks (Ana):
- [ ] Leaderboard sorting + ranking
- [ ] Escalation eligibility logic
- [ ] Mobile leaderboard view
- [ ] **Deliverable:** MVP complete + final QA

---

## 🧪 SPRINT CEREMONIES

### Daily (10 AM, Async Slack)
```
Thread template:
[Name]: 
  ✅ Yesterday: [completed]
  🏗️ Today: [planned]
  🚧 Blocker: [if any]
  📊 Progress: X/Y tasks
```

### Sprint Review (Fridays 3 PM, 30 min)
- Demo completed features
- Metrics review (tests passing, coverage, performance)
- Retrospective (what went well, what to improve)

### Sprint Planning (Mondays 10 AM, 30 min)
- Review upcoming sprint goals
- Task breakdown
- Capacity planning
- Risk identification

---

## 📊 DEFINITION OF DONE (per task)

```
✅ Code written (TypeScript + linting passes)
✅ Tests written (unit + integration)
✅ Code reviewed (peer review + approval)
✅ Documented (JSDoc comments, API docs)
✅ Tested on mobile (iOS Safari + Android Chrome)
✅ Accessibility checked (WCAG AA minimum)
✅ Performance verified (Lighthouse >80)
✅ Merged to develop (no merge conflicts)
✅ Deployed to staging (QA can test)
```

---

## 🔗 API ENDPOINT COMPLETE LIST

### Sprint 1: Auth
- `POST /api/member/auth/verify` (verify Telegram initData)

### Sprint 2: Onboarding
- `POST /api/member/diagnosis` (submit diagnosis)
- `GET /api/member/onboarding-status`

### Sprint 3: Dashboard
- `GET /api/member/dashboard`
- `GET /api/member/profile`

### Sprint 4: Lessons
- `GET /api/member/lessons`
- `GET /api/member/lessons/{id}`
- `POST /api/member/lessons/{id}/start`

### Sprint 5: Quiz
- `GET /api/member/lessons/{id}/quiz`
- `POST /api/member/lessons/{id}/complete`

### Sprint 6: Missions
- `GET /api/member/missions`
- `GET /api/member/missions/{id}`
- `POST /api/member/missions/{id}/submit`

### Sprint 7: Achievements
- `GET /api/member/achievements`
- `POST /api/member/achievements/{id}/claim`

### Sprint 8: Escalation + Leaderboard
- `GET /api/member/escalation/check-eligibility`
- `POST /api/member/escalate-to-team`
- `GET /api/member/leaderboard`

**Total: 18 new endpoints (extend existing 33)**

---

## 🎯 METRICS TO TRACK (Weekly)

| Metric | Sprint 1 | Sprint 2 | ... | Sprint 8 |
|--------|----------|----------|-----|----------|
| Unit test coverage | 60% | 70% | ... | 85%+ |
| Lighthouse score | >80 | >82 | ... | >85 |
| Bundle size | <150KB | <160KB | ... | <200KB |
| Load time (API) | <500ms | <450ms | ... | <300ms |
| Mobile response time | <1s | <900ms | ... | <700ms |
| Bugs P0 | 0 | 0 | ... | 0 |
| Bugs P1 | 0-2 | 0-1 | ... | 0 |

---

## 🚨 CRITICAL PATH (Don't Skip)

1. **Sprint 1:** Database + Auth (blocks everything)
2. **Sprint 2:** Onboarding flow (user entry point)
3. **Sprint 3:** Dashboard (core experience)
4. **Sprint 4:** Lessons (content delivery)
5. **Sprint 6:** Missions (application)
6. **Sprint 8:** Escalation logic (completion)

**If behind schedule:** Drop leaderboard (Sprint 8 can be "v1.1")

---

## 🚀 DEPLOYMENT STRATEGY

### Staging (Continuous)
- Deploy to staging on every merge to `develop`
- QA tests immediately
- Staging URL: https://beglobal-staging.rovicrm.com/app/member/

### Production (Weekly)
- Merge `develop` → `main` (Friday 2 PM)
- Auto-deploy to production
- Monitoring alert setup
- Rollback plan ready

### Beta (Week 11)
- Production release to 50 users only
- Monitor crash rates, DAU, session time
- Fix critical issues
- Gradual rollout Monday Week 12

### Public Launch (Week 12)
- Release to 100% of members
- Monitor metrics closely (first 24h)
- Support team on standby

---

## 📋 FINAL CHECKLIST (Sprint 8 Friday)

**Before Beta Launch:**
- [ ] All 18 endpoints implemented + tested
- [ ] Frontend 100% feature-complete
- [ ] Unit test coverage >85%
- [ ] Lighthouse score >85
- [ ] WCAG AA compliance >95%
- [ ] Staging deployment successful
- [ ] 24h smoke test passed
- [ ] Monitoring + alerting configured
- [ ] Rollback plan documented
- [ ] Beta user list ready (50 users)
- [ ] Welcome email drafted
- [ ] FAQ + support docs ready
- [ ] Team training completed

---

## 🎬 READY TO BUILD

**Lunes, 18 de Agosto, 10 AM**

Primer standup virtual. Sprint 1 kickoff.

Let's build the best miniapp! 🚀

---

**Questions?** Miguel (Backend Lead) or Alex (Frontend Lead)
