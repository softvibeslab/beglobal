# 🎮 GAME DESIGN DOCUMENT v0.1
## BeGlobal Member Miniapp - "Aprende Ecommerce Jugando"

**Author:** Juan (Game Designer)  
**Date:** Agosto 2026  
**Version:** 0.1 (DRAFT - for Week 1-2 discussion)  
**Status:** DRAFT → FINAL by Week 3  

---

## 📋 DOCUMENT PURPOSE

This GDD serves as the **creative north star** for:
- ✅ Mechanics that feel fair & satisfying
- ✅ Progression curves that motivate
- ✅ Reward systems that drive engagement
- ✅ Story/narrative that inspires

**NOT technical specs.** That's the API docs + component specs.

---

## 🎯 CORE VISION

### One-liner:
**"Duolingo for ecommerce entrepreneurs"** - Learn to build a 6-figure online store through bite-sized lessons, real-world missions, and gamification that celebrates every win.

### Design Philosophy:
1. **Progress feels real** - XP, levels, achievements represent actual skill
2. **Failure is learning** - Rejected missions = feedback loop, not shame
3. **Community matters** - Leaderboard + peer mentorship (escalation)
4. **Time respects you** - 10-20 min sessions, not 2-hour time sinks

---

## 👥 TARGET PLAYER

### Primary Archetype: "The Builder"
- **Age:** 22-45
- **Motivation:** See their ecommerce business grow
- **Blocker:** Overwhelmed by too much information
- **Learning style:** Short actionable lessons + immediate application
- **Device:** Mostly mobile (evenings/weekends)
- **Session length:** 10-20 minutes max
- **Churn risk:** Low (if seeing results)

### Secondary Archetypes (discovered in research):
- **The Competitor:** Motivated by ranking, comparison, winning
- **The Mentor:** Motivated by helping others, community, mastery
- **The Skeptic:** Only cares about proven ROI, data-driven

**Note:** Design for "The Builder" first. Secondary archetypes get bonus content (leaderboard for Competitor, Team role for Mentor).

---

## 🎮 CORE LOOP (Minute-to-Minute Gameplay)

```
┌─────────────────────────────────────────┐
│         CORE GAME LOOP (5-10 min)       │
├─────────────────────────────────────────┤
│                                         │
│  1. Player opens app                    │
│  2. Sees dashboard (XP progress)        │
│  3. Chooses lesson OR mission           │
│  4. Completes task (active play)        │
│  5. Receives XP + feedback              │
│  6. Celebration animation               │
│  7. Encouraged to do next task OR exit  │
│                                         │
│     (Total: ~10 minutes)                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📊 PROGRESSION SYSTEM

### Level Curve (100 Levels)
```
Formula: 500 × 1.2^(n-1) XP to reach level n

Level  | XP Required | Total XP | Duration (assuming 50 XP/day)
-------|------------|----------|---------------------------
1      | 0          | 0        | Start
2      | 500        | 500      | 10 days
5      | 1,036      | 4,310    | ~2.5 months
10     | 1,849      | 12,835   | ~8 months
20     | 3,704      | 48,835   | ~2.7 years
50     | 103,858    | 1.4M     | ~76 years (aspirational)
100    | 19.8M      | 39.6M    | Never (intentional)
```

**Design intent:**
- ✅ Levels 1-10: Quick wins (first 8 months feel achievable)
- ✅ Levels 10-30: Long-term engagement (years, not months)
- ✅ Levels 30+: Prestige/community status (badge of honor)
- ✅ Level 100: Mythical (gives hope, prevents boredom)

### XP Sources
```
Lesson completion    : 50-150 XP (based on difficulty)
  Easy              : 50 XP
  Medium            : 100 XP
  Hard              : 150 XP

Mission completion   : 100-400 XP (based on difficulty)
  Easy              : 100 XP
  Medium            : 250 XP
  Hard              : 400 XP

Daily mission bonus  : 2x XP (if completed "mission of the day")

Streak bonus         : +25 XP per day (daily login)

Achievement unlock   : 25-100 XP (one-time bonus)

Escalation bonus     : +500 XP (member→team)
                      +1000 XP (team→corporate)
```

### Difficulty Progression
```
WEEK 1: All easy lessons (confidence building)
WEEK 2: Mixed easy + medium lessons
WEEK 3-4: Medium lessons with hard variants
MONTH 2+: Hard lessons + hard missions

Design principle:
- Difficulty increases gradually (no skill cliff)
- Players always see 1 "easy" option available
- Hard tasks always have "hints" (prerequisites)
```

---

## 🏆 REWARDS & ACHIEVEMENTS (11 Total)

### Tier 1: Early Game (Unlock: Week 1-2)
```
Achievement        | Condition         | XP Bonus | Icon
-------------------|-------------------|----------|------
First Steps        | Complete 1 lesson | 0 XP     | 🚀
Learning Momentum  | Complete 3 lessons| 25 XP    | 📚
```

### Tier 2: Mission Phase (Unlock: Week 3-4)
```
Mission Starter    | Complete 1 mission| 0 XP     | 🎯
Quincenal          | Complete 5 missions| 50 XP   | ⭐
```

### Tier 3: Streak Phase (Unlock: Week 2-8)
```
Consistency Streak | 3-day streak      | 25 XP    | 🔥
On Fire!          | 7-day streak      | 75 XP    | 🔥🔥
Unstoppable       | 30-day streak     | 250 XP   | 🔥🔥🔥
```

### Tier 4: Progression (Unlock: Ongoing)
```
Rising Star       | Reach level 5     | 50 XP    | ⭐⭐
Master Learner    | Reach level 10    | 200 XP   | ⭐⭐⭐
Expert Operator   | Reach level 20    | 500 XP   | 👑
```

### Tier 5: Community (Unlock: Month 2+)
```
Team Ally         | Ready to join Team| 0 XP     | 🤝
Leader Ready      | Ready to corporate| 0 XP     | 🏛️
Go Live!          | Complete escalation| 500 XP  | 🚀✨
```

---

## 💡 RETENTION MECHANICS

### Daily Active User (DAU) Drivers

#### 1. **Streak System** 🔥
```
Mechanic: Consecutive login bonus
- Day 1: +0 XP (baseline)
- Day 3: 🔥 Visual indicator
- Day 7: 🔥🔥 Notification: "Racha en riesgo!"
- Day 30: 🔥🔥🔥 Badge + celebration
- Day 90: Hall of fame leaderboard

Design principle:
- Visual fire indicator grows (1→2→3 flames)
- Missed day = streak resets (PAINFUL)
- But can be saved with "streak freeze" (earned by achievements)
```

#### 2. **Daily Mission Bonus**
```
Mechanic: "Mission of the day" (2x XP)
- Changes daily at 12 AM UTC
- Shows on dashboard: "Complete [mission] today for 2x XP!"
- Random selection (not same mission every day)
- Encourages revisiting missions

Design principle:
- Creates daily reason to open app
- Low friction (can skip if not interested)
- Rewards consistency without punishment
```

#### 3. **Progress Visibility**
```
Mechanic: XP bar that fills visibly
- Show: "500 XP to next level" → clear goal
- After lesson: +50 XP popup with animation
- Level-up: FULLSCREEN celebration
- Profile: Streak calendar (visual heat map of activity)

Design principle:
- Progress must be VISIBLE and TANGIBLE
- Dopamine hits from milestone moments
```

### Churn Prevention

#### Predictive Nudges (after launch)
```
Day 2-3 no login: "We miss you! Complete a quick lesson today"
Day 5-7 no login: "Your racha is at risk! 🔥"
Day 8+ no login: "Come back and rebuild your streak!"
```

#### Onboarding Retention (Week 1)
```
Day 1: Diagnosis + celebrate first lesson complete
Day 2: "Ready for more?" - Suggest next lesson
Day 3: Daily mission highlighted
Day 7: First achievement unlocked (celebratory)
```

---

## 🎭 NARRATIVE & VOICE

### Mentor Character: "Sofia"
- **Personality:** Warm, expert, non-judgmental
- **Tone:** Friend who's "been there" in ecommerce
- **Role:** Celebrate wins, encourage on setbacks, guide progression

### Narrative Beats:

```
ONBOARDING (Day 1):
Sofia: "¡Hola! Soy Sofia, tu mentora.
Aquí aprendes ecommerce jugando.
¿Preparado para tu primer lección?"

FIRST LESSON COMPLETE:
Sofia: "¡Bravo! 🎉 Completaste tu primera lección.
+50 XP ganados. ¡Sigue el momentum!"

FIRST MISSION SUBMIT:
Sofia: "¡Tu misión llegó a revisión! 
Nuestro equipo te dará feedback en 24h.
Mientras tanto, ¿otra lección?"

STREAK MILESTONE (3 days):
Sofia: "🔥 ¡3 días de racha!
Esto es lo que quería ver. Vamos por más!"

STREAK BROKEN:
Sofia: "Se rompió tu racha, pero no importa.
Lo importante es que AHORA la reconstruimos.
¡Una lección te pone en movimiento de nuevo!"

LEVEL UP:
Sofia: "🎊 ¡NIVEL 5! 
No es suerte. Es consistencia.
Cada día haces progreso. ¡Sigue así!"

ACHIEVEMENT UNLOCK:
Sofia: "[Achievement name]
[Why they earned it]
[Motivational message]
Equipo Be Global te ve 👀"

FIRST MISSION APPROVED:
Sofia: "✅ ¡Tu misión fue APROBADA!
+100 XP + feedback del equipo.
Your work is actually making a difference."

ESCALATION ELIGIBLE:
Sofia: "¡MOMENTO ESPECIAL!
Completaste 5 misiones. Ganas XP.
¿Listo para ayudar otros como Team?"
```

### Writing Principles:
- ✅ Celebrate **effort**, not just results
- ✅ Use Spanish + occasional English (mirrors user bilingual reality)
- ✅ Short sentences (mobile-friendly, scannable)
- ✅ Emojis for visual emphasis (not overused)
- ✅ Never blame user for failure ("feedback, not rejection")

---

## 🎨 MICROINTERACTIONS & DELIGHT

### Celebration Moments

#### Lesson Complete 🎉
```
Trigger: User finishes quiz correctly
Sequence:
1. Confetti animation (2 sec)
2. Score display: "+50 XP" (animated)
3. Level check: If level-up → special animation
4. Toast: "Great work! Next: [Suggested mission]"
5. Auto-dismiss or continue
Duration: 3-5 seconds total
Feeling: Accomplishment, momentum
```

#### Level Up ⭐
```
Trigger: Total XP crosses level threshold
Sequence:
1. FULLSCREEN takeover (modal)
2. Number animation: "LEVEL 5" (large, bold)
3. Starry particle effects
4. Achievement badge
5. XP milestone (e.g., "+500 XP to next level")
6. Sofia message: "[Personalized level-up message]"
7. Button: "Continue" or "View Profile"
Duration: 5-10 seconds (user can skip)
Feeling: Pride, celebration, official recognition
```

#### Achievement Unlock 🏆
```
Trigger: Achievement condition met
Sequence:
1. Medal animation (3D spin)
2. Title: "[Achievement Name]"
3. Description: "[Why earned]"
4. XP bonus: "+25 XP extra"
5. Sofia: "[Congratulatory message]"
6. Close or share (future)
Duration: 5-10 seconds
Feeling: Special status, milestone reached
```

#### Streak Reached 🔥
```
Trigger: Day 3, 7, 30 streak milestones
Sequence:
1. Fire icon grows (1→2→3 flames)
2. Number display: "3 DAYS!" / "7 DAYS!" / etc
3. Sofia message specific to milestone
4. Notification badge on profile
Duration: 2-3 seconds
Feeling: momentum, burning hot
```

### Error States (Never Punishment)

```
❌ WRONG QUIZ ANSWER:
Display: "Not quite. Hint: [relevant concept]"
Tone: Friendly, encouraging
Action: Allow retry without penalty
Feeling: Learning moment, not failure

❌ MISSION REJECTED:
Display: "[Team member name]: Great effort!
Here's feedback to make it even better:
[Constructive feedback]
Want to resubmit?"
Tone: Constructive, supportive
Action: Allow revision without penalty
Feeling: Coaching, not rejection
```

---

## 📱 MOBILE-FIRST GAMEPLAY

### Session Length Goals:
```
Perfect session: 10-15 minutes
Max session: 30 minutes (before fatigue)
Min session: 3-5 minutes (daily login)
```

### Mobile Considerations:
```
Onboarding: 1-2 minutes
  (diagnosis: 5 quick questions)

Lesson: 5-10 minutes
  (video 3-5 min + quiz 2-3 min)

Mission: 5-15 minutes
  (read + submit + upload)

Dashboard check: 1-2 minutes
  (scroll, check progress, see next step)

Total ideal flow: 10-20 minutes (not overwhelming)
```

---

## 🏆 COMPETITIVE BALANCE (vs. Real Life)

### The Core Tension:
**Learning ecommerce = Hard IRL**  
**Miniapp must = Feel Easy + Rewarding**

```
Real Challenge          | Miniapp Equivalent
-----------------------|---------------------------
Starting from zero     | Diagnostic positions you
Choosing a niche       | Quiz helps narrow options
Building first product | Missions break it down small
Launching store setup   | Guided step-by-step
First sale             | Celebrate EVERY win
Scaling                | Leaderboard shows path
```

### Difficulty Calibration:
- Lessons: **60% pass rate** (achievable, motivating)
- Missions: **70% approval rate** (feedback on 30% rejections)
- Streaks: **40% 3-day streak** (hard but achievable)
- Level-up: **10-15% reach level 5** (milestone feeling)

---

## 🎯 SUCCESS METRICS (Designed for)

### Primary (Launch Week 1)
- ✅ DAU > 50% (of onboarded users)
- ✅ Avg session > 8 minutes
- ✅ Day 7 retention > 60%

### Secondary (Month 1)
- ✅ Avg level reached > 3
- ✅ Lesson completion > 70%
- ✅ Streak 3+ days > 40%

### Tertiary (Month 3)
- ✅ Escalation rate > 15% (5+ missions)
- ✅ NPS > 50
- ✅ Organic retention (no nudges) > 30%

---

## 🚫 DESIGN ANTI-PATTERNS (DO NOT DO)

```
❌ NO gacha/loot boxes (unfair, predatory)
❌ NO real-money cosmetics (our target can't afford it)
❌ NO forced wait times (energy system, cool-downs)
❌ NO shame mechanics (failed lessons, public failures)
❌ NO FOMO-based pushes ("LIMITED TIME, miss it!")
❌ NO leaderboard shame (bottom 10% never shown)
❌ NO pay-to-win (XP boost purchases)
❌ NO dark patterns (confusing UI, hidden costs)
```

**Why?** Our user is an entrepreneur trying to learn, not a whale to extract money from.

---

## 🔄 FEEDBACK LOOP DESIGN

### Player Action → System Response → Player Reaction

```
ACTION: Complete lesson
SYSTEM: +50 XP, check achievements, update level
FEEDBACK: Toast ("+50 XP") → Check level status
→ Suggest next step

ACTION: Submit mission
SYSTEM: Queue for Team review, notify Team, notify Member
FEEDBACK: Toast ("Misión enviada") → Show expected timeline
→ Suggest lesson while waiting

ACTION: Achievement earned
SYSTEM: Award XP bonus, update profile, log to audit trail
FEEDBACK: Fullscreen celebration → Add to achievement gallery

ACTION: Miss daily streak
SYSTEM: Reset streak counter (internally)
FEEDBACK: Toast (sad): "Se rompió la racha, pero volamos!"
→ Suggest easy lesson to rebuild
```

---

## 📅 CONTENT ROADMAP (Post-Launch)

### Month 1-2: Core (v1.0)
- 10 lessons (live)
- 10 missions (live)
- 11 achievements (live)
- Leaderboard (basic)

### Month 3-4: Engagement (v1.1)
- Seasonal events (Navidad special, etc)
- Leaderboard seasons (monthly reset)
- Challenges (team-based missions)
- Badges (cosmetic unlocks)

### Month 5-6: Community (v1.2)
- Referral system (invite friends)
- Peer reviews (member-to-member feedback)
- Mentorship paths (Mentor archetype)
- Hall of Fame (top performers)

---

## 🎓 EDUCATIONAL PHILOSOPHY

**"Gamification is a delivery mechanism, not the goal."**

The game wraps around real learning:

```
Lesson   → User learns real ecommerce concept
Mission  → User applies it to their business
Feedback → Team coach validates work
XP/Achievement → Recognize progress (intrinsic motivation)
```

**NOT:**
- "Play more to get more stuff"
- "Grind for cosmetics"
- "Compete to win rewards"

**YES:**
- "Learn real skills"
- "Get feedback from experts"
- "Progress toward 6-figure business"

---

## ✅ SIGN-OFF

**Author:** Juan (Game Designer)  
**Status:** DRAFT v0.1  
**Due:** Friday Week 1 for team review  
**Next:** Incorporate research findings (Week 2) → FINAL GDD v1.0

---

## 📞 QUESTIONS FOR RESEARCH (Week 1-2)

As Sofia conducts user interviews, she'll validate:

1. ✅ Do users want gamification at all?
2. ✅ Streaks or achievements matter more?
3. ✅ Will they use leaderboard (or does it intimidate)?
4. ✅ What celebrates feel authentic (not cheesy)?
5. ✅ How much mentor narrative is too much?

**Research findings → GDD v1.0 refinements**

---

**Ready to playtest?** Week 3 prototype coming! 🎮✨
