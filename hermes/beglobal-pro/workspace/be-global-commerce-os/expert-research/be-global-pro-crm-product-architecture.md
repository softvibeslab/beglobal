# Be Global Pro — AI Commerce Academy CRM/Product Architecture

## 1. Executive architecture narrative

Be Global Pro should operate as an AI-enabled commerce academy where content, diagnostics, offers, private ecommerce stores, affiliate monetization, community support, and CRM follow-up are connected into one measurable system.

The core idea is simple:

- Instagram and content attract attention.
- A diagnostic AI agent converts attention into a structured profile.
- CRM turns that profile into a pipeline, segment, and recommended offer.
- The academy gives training, implementation support, and community.
- The catalog, affiliate links, private stores, and Telegram Offers Premium MX convert learning into revenue-generating commerce actions.
- Reporting closes the loop so the team sees which content, offers, agents, and members generate results.

Important pilot principle: do **not** request admin access to the existing Telegram channel upfront. Start with a separate pilot bot/agent and a controlled test group. Only after proof of value should deeper channel/community integration be proposed.

---

## 2. System map for a business deck

### Front door: attention and lead capture

- Instagram content: reels, stories, lives, carousels, comments, link in bio.
- Lead magnets: commerce diagnostic, store-readiness checklist, affiliate offer map, private store starter kit.
- Entry actions: DM keyword, form, landing page, quiz, webinar registration, Telegram pilot bot opt-in.

### Intelligence layer: diagnostic and routing

- Diagnostic AI Agent collects business context, goals, products, audience, experience level, budget, and urgency.
- Lead scoring ranks opportunity by fit, readiness, purchase intent, and implementation capacity.
- Offer routing recommends the next step: free community, academy tier, Telegram Offers Premium MX, product catalog access, private store setup, or high-touch advisory.

### CRM and revenue layer

- CRM tracks every person, company, conversation, source, diagnostic result, offer, purchase, follow-up, and referral.
- Pipeline moves leads from captured interest to diagnostic, offer, activation, store launch, first sale, retention, and advocacy.
- Sales and support team get clear tasks, reminders, and owner assignment.

### Commerce enablement layer

- Product catalog and offer library provide products, bundles, scripts, pricing guidance, assets, and affiliate links.
- Private ecommerce stores allow members or partners to launch branded storefronts with approved offers.
- Telegram Offers Premium MX distributes curated premium offers, drops, trainings, and promotional opportunities.

### Learning and support layer

- Academy hosts modules, playbooks, implementation sprints, onboarding tasks, live sessions, certificates, and resources.
- Community support handles Q&A, accountability, wins, objections, and peer learning.
- AI agents assist with diagnostics, product matching, scripts, support, reporting, and content repurposing.

---

## 3. Primary user types

### External users

- Visitor / Follower: consumes public Instagram/content; not yet known in CRM.
- Lead: opted in through DM, form, quiz, webinar, or Telegram pilot bot.
- Applicant / Diagnosed Lead: completed AI diagnostic and has a score/profile.
- Free Community Member: receives public resources and basic community access.
- Academy Member: paid learner with access to structured training and implementation paths.
- Premium Offers Member: subscribed to Telegram Offers Premium MX or equivalent premium offer feed.
- Store Owner / Commerce Partner: operates a private ecommerce store and uses catalog/offers.
- Affiliate / Promoter: shares tracked affiliate links and earns/receives attribution.
- High-Touch Client: receives implementation, advisory, or done-with-you support.
- Alumni / Advocate: completed program, has results, referrals, testimonials, or advanced participation.

### Internal users

- Founder / Executive: sees full business reporting, revenue, pipeline, offer performance, and strategy dashboards.
- CRM Manager: manages records, pipelines, data quality, segments, and automations.
- Sales Advisor: handles qualified leads, consultative calls, objections, offers, and closing.
- Academy Coach: supports member progress, live sessions, homework, and implementation.
- Community Manager: moderates community, prompts engagement, escalates support, captures wins.
- Catalog / Offers Manager: manages product catalog, affiliate links, offer rules, availability, and promotions.
- Store Operations Manager: supports private store setup, fulfillment coordination, and issue escalation.
- Content Manager: tracks content performance, lead sources, campaigns, and repurposing.
- Support Agent: handles member questions, access issues, order/store questions, and triage.

---

## 4. Core data entities

### People and organizations

- Contact: individual person, social handles, phone/email, location, language, consent status.
- Account / Business: company, niche, audience, current channels, revenue range, team size.
- Role: member, affiliate, store owner, coach, admin, partner.
- Consent / Preference: opt-in source, communication channel, privacy permissions, unsubscribe status.

### Lead and sales records

- Lead: source, campaign, keyword, first message, date captured, owner, stage.
- Diagnostic Profile: answers, readiness score, pain points, recommended path, objections.
- Opportunity: potential sale, tier, expected value, probability, next action.
- Interaction: DM, Telegram message, email, call, support ticket, live session attendance.
- Task: follow-up, call booking, onboarding nudge, support escalation, renewal reminder.

### Product, learning, and commerce records

- Academy Program: course, module, lesson, resource, milestone, certificate.
- Enrollment: member, tier, start date, status, progress, completion.
- Product Catalog Item: SKU/offer, margin, category, supplier, market, creative assets, rules.
- Offer: bundle, promo, Telegram drop, seasonal campaign, affiliate commission, expiration.
- Affiliate Link: owner, destination, campaign, clicks, conversions, payout/credit.
- Private Store: owner, URL, status, catalog permissions, active offers, sales summary.
- Order / Sale: store, customer, product, amount, status, source, affiliate attribution.

### Community and support records

- Community Membership: channel/group, tier, join date, status.
- Support Ticket: issue type, priority, assigned owner, resolution status.
- Knowledge Base Article: FAQ, playbook, script, diagnostic explanation, offer guide.
- Win / Testimonial: member result, proof asset, permission status, usable in marketing.

### Reporting records

- Campaign: source content, objective, spend if any, landing page, lead magnet.
- KPI Snapshot: daily/weekly performance by channel, offer, tier, store, affiliate.
- Cohort: group of members entering in a period or sprint.

---

## 5. CRM pipeline design

### Pipeline A — Audience to Academy

1. New Lead
   - Trigger: IG DM keyword, form, webinar signup, Telegram pilot opt-in.
   - Goal: capture identity, source, consent, and initial interest.

2. Diagnostic Started
   - Trigger: lead opens AI diagnostic.
   - Goal: collect enough context to classify and score.

3. Diagnostic Completed
   - Trigger: lead receives diagnostic summary.
   - Goal: assign segment and recommended path.

4. Qualified / Fit Confirmed
   - Trigger: score above threshold or manual review.
   - Goal: route to offer, call, academy tier, or premium community.

5. Offer Presented
   - Trigger: agent/sales advisor sends specific recommendation.
   - Goal: make next step clear and track objection.

6. Purchased / Enrolled
   - Trigger: payment or manual enrollment.
   - Goal: activate onboarding and permissions.

7. Activated
   - Trigger: joins academy/community, completes first task, or attends first session.
   - Goal: reduce drop-off and create first win.

8. Expansion / Upsell
   - Trigger: progress, store launch readiness, affiliate activity, premium offer interest.
   - Goal: move to Premium MX, private store, advanced coaching, or partner path.

9. Advocate / Referral
   - Trigger: result achieved or positive feedback.
   - Goal: collect testimonial, referral, or affiliate promotion.

### Pipeline B — Private Ecommerce Store Launch

1. Store Interest
2. Store Diagnostic Complete
3. Store Plan Approved
4. Catalog Assigned
5. Store Built / Configured
6. QA and Compliance Check
7. Store Launched
8. First Sale Achieved
9. Optimization / Scale

### Pipeline C — Affiliate and Offer Monetization

1. Affiliate Interest
2. Approved Affiliate
3. Link Generated
4. First Clicks
5. First Conversion
6. Active Promoter
7. Payout / Recognition
8. Dormant / Re-activation

### Pipeline D — Support and Retention

1. New Member
2. Onboarding Incomplete
3. Active Learner
4. Stalled / At Risk
5. Support Needed
6. Re-activated
7. Renewed / Upgraded
8. Alumni / Advocate

---

## 6. AI agent architecture

### 1. Instagram / Content Capture Agent

Purpose: convert public attention into owned leads.

Responsibilities:
- Respond to DM keywords with approved scripts.
- Send diagnostic link or pilot bot invitation.
- Tag source content and campaign.
- Avoid high-risk promises or unsupported claims.
- Escalate purchase-ready leads to CRM/sales.

### 2. Diagnostic AI Agent

Purpose: interview prospects and recommend the right path.

Responsibilities:
- Ask business-friendly questions about goals, experience, audience, products, budget, and urgency.
- Produce a diagnostic summary.
- Assign readiness score and segment.
- Recommend academy tier, Premium MX, private store, affiliate path, or sales call.
- Push structured fields into CRM.

### 3. CRM Follow-Up Agent

Purpose: prevent leads and members from falling through the cracks.

Responsibilities:
- Create follow-up tasks.
- Draft messages for 24h, 48h, 7-day, and stalled-member nudges.
- Alert team on high-intent leads.
- Track objections and next best action.

### 4. Academy Coach Agent

Purpose: help members implement, not only consume content.

Responsibilities:
- Recommend next lesson or playbook.
- Explain concepts in simple terms.
- Review member homework or store-readiness answers.
- Route difficult or sensitive questions to human coaches.

### 5. Product / Offer Matching Agent

Purpose: connect members with relevant products and offers.

Responsibilities:
- Match catalog items to member niche, audience, and tier.
- Suggest bundles, scripts, and promotional angles.
- Manage offer eligibility and expiration logic.
- Generate affiliate-safe promotional copy.

### 6. Private Store Setup Agent

Purpose: guide store owners through launch steps.

Responsibilities:
- Collect brand, niche, domain, payment, fulfillment, and catalog preferences.
- Generate launch checklist.
- Track blockers and escalate technical issues.
- Trigger QA before go-live.

### 7. Telegram Offers Premium MX Agent

Purpose: deliver premium offers and engagement through a controlled Telegram experience.

Responsibilities:
- Operate first as a separate pilot bot/agent, not as an admin inside the existing channel.
- Send curated offers to opted-in pilot members.
- Capture reactions, clicks, questions, and conversions.
- Route support issues to team.
- After pilot success, propose optional integration with official channel workflows.

### 8. Community Support Agent

Purpose: reduce repetitive support and increase engagement.

Responsibilities:
- Answer FAQs from approved knowledge base.
- Suggest resources and lessons.
- Identify stalled or confused members.
- Escalate conflict, refunds, sensitive cases, or compliance questions.

### 9. Reporting / Insights Agent

Purpose: convert system activity into management decisions.

Responsibilities:
- Summarize weekly channel, CRM, academy, store, affiliate, and offer performance.
- Highlight bottlenecks.
- Recommend content and offer experiments.
- Prepare investor/partner-friendly scorecards.

---

## 7. Data flows

### Flow 1 — Instagram/content to CRM

1. User sees content on Instagram.
2. User comments, DMs a keyword, clicks link, or registers for a resource.
3. Capture agent/form creates or updates Contact and Lead.
4. CRM stores source: post, campaign, keyword, date, and consent.
5. Lead receives diagnostic invitation.

### Flow 2 — Diagnostic to offer recommendation

1. Lead completes AI diagnostic.
2. Agent stores Diagnostic Profile in CRM.
3. CRM applies score and segment rules.
4. Lead is routed to one of five paths:
   - Free community nurture.
   - Academy entry tier.
   - Telegram Offers Premium MX.
   - Private ecommerce store path.
   - High-touch sales call.
5. Follow-up tasks and messages are created automatically.

### Flow 3 — Academy member activation

1. Payment/enrollment creates Member record.
2. Permissions unlock academy modules and community access.
3. Onboarding checklist is assigned.
4. Academy Coach Agent nudges first milestone.
5. CRM tracks activation, lesson progress, support tickets, and upgrade signals.

### Flow 4 — Catalog/offers to affiliate/private store

1. Product manager adds catalog items and offer rules.
2. Members see only offers allowed by their tier, geography, or approval status.
3. Affiliate links are generated per member/campaign.
4. Store owners publish selected offers in private ecommerce store.
5. Clicks, orders, conversions, and commissions/credits are reported back to CRM.

### Flow 5 — Telegram Offers Premium MX pilot

1. Qualified members opt into a separate Telegram pilot bot.
2. Bot verifies membership/tier from CRM.
3. Bot sends curated offers, prompts, training snippets, and links.
4. Reactions/clicks/questions are logged.
5. Team reviews engagement and conversion.
6. Only after pilot validation: consider deeper channel integration or admin workflows.

### Flow 6 — Reporting loop

1. CRM, academy, store, affiliate, and Telegram pilot data feed dashboards.
2. Weekly reports show lead source, diagnostic completion, conversion, activation, retention, offer performance, and store sales.
3. Insights guide next content calendar, offer drops, academy improvements, and sales follow-ups.

---

## 8. Permissions and tiers

### Suggested customer tiers

#### Free / Public

Access:
- Public content.
- Basic diagnostic teaser or summary.
- Selected free resources.
- Community preview if desired.

Limitations:
- No premium catalog.
- No private store.
- No premium Telegram offers.

#### Academy Starter

Access:
- Core academy modules.
- Implementation checklists.
- Basic community support.
- Basic affiliate education.

Best for:
- Beginners validating niche, offer, and sales motion.

#### Academy Pro

Access:
- Full academy curriculum.
- Live sessions or replays.
- Product/offer library access.
- Approved affiliate links.
- Advanced playbooks and scripts.
- Priority community support.

Best for:
- Members ready to sell and promote consistently.

#### Premium MX / Offers Premium

Access:
- Telegram Offers Premium MX pilot or channel experience.
- Curated premium offer drops.
- Early access campaigns.
- Promo templates and sales angles.
- Offer performance tracking.

Best for:
- Members who want active monetization opportunities and timely promotions.

#### Store Owner / Partner

Access:
- Private ecommerce store setup path.
- Selected catalog permissions.
- Store launch checklist and QA.
- Sales/order reporting.
- Store optimization resources.

Best for:
- Members/partners ready to operate a branded commerce channel.

#### High-Touch / VIP

Access:
- Strategic advisory or implementation support.
- Priority diagnostics.
- Custom offer/store strategy.
- More human review and escalation.
- Executive reporting.

Best for:
- Partners with higher revenue potential or need for guided execution.

### Internal permission roles

- Super Admin: full access to configuration, revenue, users, offers, stores, and data exports.
- Executive Viewer: dashboards and reports; limited operational editing.
- CRM Admin: pipelines, fields, automations, segments, records.
- Sales User: assigned leads/opportunities, notes, tasks, messages.
- Coach: member progress, academy engagement, support notes, resources.
- Community Moderator: community posts, FAQs, escalation flags; no financial data unless required.
- Catalog Manager: products, offers, assets, rules, affiliate settings.
- Store Ops: store setup, status, QA, catalog assignment, order issue visibility.
- Support: tickets, access issues, member status, knowledge base.
- Finance/Affiliate Admin: payments, commissions, payouts, refunds, reconciliation.

---

## 9. Integration architecture

### Required integrations

- Instagram / Meta: DM entry, comments, lead source tagging, campaign attribution.
- Landing pages/forms: diagnostic entry, webinar signup, lead magnets.
- CRM: contacts, leads, diagnostics, pipelines, tasks, opportunities, reporting.
- Academy/LMS: courses, modules, progress, enrollments, certificates.
- Payment processor: subscriptions, one-time payments, renewals, failed payments.
- Telegram pilot bot: opt-in delivery, member verification, offer engagement.
- Ecommerce/store platform: private stores, product catalog, orders, fulfillment status.
- Affiliate/link tracking: link creation, clicks, conversions, commissions/credits.
- Email/SMS/WhatsApp optional: nurture, reminders, transactional messages.
- Analytics dashboard: marketing, sales, learning, commerce, and community metrics.
- Knowledge base: approved FAQs, scripts, policies, product guides, offer rules.

### Integration principle

Start with a small number of reliable connections:

- Lead capture → CRM.
- Diagnostic → CRM.
- Payment/enrollment → academy permissions.
- CRM tier → Telegram pilot bot access.
- Catalog/affiliate links → click/conversion tracking.
- Weekly dashboard → leadership review.

Avoid over-integrating before offer, audience, and retention patterns are validated.

---

## 10. MVP stack assumptions

This is a business-friendly stack hypothesis, not a final procurement decision.

### MVP goal

Launch a controlled, measurable version of the academy-commerce engine without custom-building everything.

### Recommended MVP components

- CRM: HubSpot, GoHighLevel, Airtable + automations, or similar.
- Forms/diagnostic: Typeform/Tally/custom form plus AI-generated summary.
- Automation layer: Zapier, Make, n8n, or native CRM workflows.
- AI agents: separate assistants for diagnostic, follow-up, academy support, and Telegram pilot.
- Academy/LMS: Kajabi, Circle, LearnWorlds, Thinkific, Hotmart, or a lightweight member portal.
- Community: Telegram, Circle, Discord, WhatsApp, or hybrid model.
- Telegram pilot: dedicated bot/agent for opt-in members; no admin access required initially.
- Ecommerce/private stores: Shopify, WooCommerce, Tiendanube, or white-label storefront tool.
- Affiliate tracking: Rewardful, FirstPromoter, Tapfiliate, GoAffPro, or platform-native affiliate module.
- Reporting: CRM dashboards first; Looker Studio/Metabase later if data grows.
- Knowledge base: Notion, Google Drive, HelpScout Docs, Intercom articles, or internal docs.

### MVP operating assumptions

- One primary language first: Spanish for Mexico/MX audience unless leadership chooses otherwise.
- One initial market: MX-focused offers and Telegram Offers Premium MX.
- One primary acquisition channel: Instagram/content.
- One pilot bot instead of modifying the existing Telegram channel.
- One academy pathway before multiple complex certifications.
- One private store model before many storefront variations.
- Manual QA remains acceptable for store launch, offer approval, and payouts during MVP.

---

## 11. Reporting model and key metrics

### Acquisition metrics

- Instagram reach and engagement.
- DM keyword count.
- Link clicks.
- Lead capture conversion rate.
- Cost per lead if paid media is used.

### Diagnostic metrics

- Diagnostic start rate.
- Diagnostic completion rate.
- Average readiness score.
- Top pain points.
- Top recommended paths.

### Sales metrics

- Lead-to-call conversion.
- Call-to-sale conversion.
- Offer presented vs purchased.
- Revenue by tier.
- Pipeline value by stage.
- Follow-up compliance.

### Academy metrics

- Activation rate.
- First lesson completion.
- Module progress.
- Live session attendance.
- Stalled members.
- Support volume by topic.

### Commerce metrics

- Catalog item views/clicks.
- Affiliate link clicks.
- Conversion by affiliate/member.
- Private stores launched.
- First sale rate.
- Revenue by store.
- Revenue by offer.

### Telegram Offers Premium MX metrics

- Pilot opt-ins.
- Offer open/view rate if measurable.
- Clicks per offer.
- Questions per offer.
- Conversion per drop.
- Churn or inactivity.

### Community and retention metrics

- Active members.
- Questions answered.
- Response time.
- Wins/testimonials captured.
- Renewals/upgrades.
- Refund/churn reasons.

---

## 12. Governance, safety, and data quality

### Human-in-the-loop rules

AI can recommend, draft, classify, and summarize. Humans should approve:

- High-ticket offers.
- Refunds, guarantees, financial claims, and sensitive support.
- Store launch QA.
- Affiliate payout disputes.
- Public testimonials and proof claims.
- New product/offer approval.

### Data quality rules

- Every lead must have source, consent, date captured, and current stage.
- Every diagnostic must store summary, score, recommended path, and next action.
- Every offer must have owner, eligibility rules, tracking link, expiration, and assets.
- Every private store must have status, catalog permissions, QA status, and owner.
- Every support escalation must have priority, owner, and resolution.

### Compliance positioning

- Avoid promises of guaranteed income.
- Use results as examples only when permission and proof are available.
- Make affiliate relationship and commissions transparent where required.
- Respect opt-in/opt-out rules for messaging.
- Keep financial, personal, and payment data access restricted.

---

## 13. Phased roadmap

### Phase 0 — Architecture and offer alignment, 1–2 weeks

Objectives:
- Confirm tier names, pricing logic, core audience, and first market.
- Define diagnostic questions and scoring model.
- Define CRM fields, pipeline stages, and dashboard requirements.
- Decide MVP stack.

Deliverables:
- Final system blueprint.
- CRM pipeline spec.
- Diagnostic script and scoring rubric.
- Initial tier/permissions matrix.
- Pilot success metrics.

### Phase 1 — Lead capture + diagnostic MVP, 2–4 weeks

Objectives:
- Connect Instagram/content lead capture to CRM.
- Launch diagnostic AI agent or diagnostic form with AI summary.
- Route leads into segments and follow-up tasks.

Deliverables:
- Lead capture flow.
- CRM records and automations.
- Diagnostic summary template.
- Follow-up message templates.
- First dashboard: leads, diagnostics, conversions.

### Phase 2 — Academy activation, 3–6 weeks

Objectives:
- Launch initial academy path.
- Connect payment/enrollment to permissions.
- Track onboarding and progress.
- Add Academy Coach Agent for FAQs and next steps.

Deliverables:
- Starter curriculum.
- Member onboarding checklist.
- Tier-based access rules.
- Community support workflow.
- Activation and progress reporting.

### Phase 3 — Telegram Offers Premium MX pilot, 2–4 weeks

Objectives:
- Launch separate pilot bot/agent for premium offer delivery.
- Verify members against CRM tier.
- Test offer engagement, clicks, questions, and conversions.

Deliverables:
- Dedicated Telegram pilot bot.
- Offer drop template.
- Pilot member opt-in flow.
- Engagement report.
- Recommendation on whether to expand to official channel integration.

### Phase 4 — Product catalog, affiliate links, and offer engine, 4–8 weeks

Objectives:
- Build structured catalog and offer library.
- Generate affiliate links per member/campaign.
- Track clicks and conversions.
- Add product/offer matching logic.

Deliverables:
- Catalog database.
- Offer eligibility rules.
- Affiliate tracking setup.
- Promo asset library.
- Revenue report by offer/member/source.

### Phase 5 — Private ecommerce stores, 6–10 weeks

Objectives:
- Launch private store model for approved members/partners.
- Connect store status, catalog permissions, and sales data to CRM.
- Create launch QA and support process.

Deliverables:
- Store onboarding flow.
- Store setup checklist.
- QA checklist.
- Store reporting dashboard.
- First cohort of pilot stores.

### Phase 6 — Scale and optimization, ongoing

Objectives:
- Improve automation and agent coverage.
- Add advanced reporting and cohort analysis.
- Expand offers, partners, tiers, and markets.
- Formalize affiliate payouts and partner operations.

Deliverables:
- Executive dashboards.
- Weekly AI insights report.
- Partner/affiliate operations playbook.
- Advanced segmentation.
- Expansion roadmap.

---

## 14. Pitch-deck slide structure

### Slide 1 — Vision

Be Global Pro is an AI-enabled commerce academy that turns content attention into diagnosed members, trained sellers, private ecommerce stores, affiliate revenue, premium offers, and measurable community-driven commerce.

### Slide 2 — Problem

Creators and commerce communities often have attention, products, and ambition, but lose revenue because lead capture, training, offers, stores, community, and reporting are disconnected.

### Slide 3 — Solution

A connected system: Instagram → AI diagnostic → CRM → academy → catalog/offers → Telegram Premium MX → private stores → affiliate links → reporting.

### Slide 4 — User journey

Follower becomes lead, completes diagnostic, joins the right tier, activates in academy, receives offers, launches store or affiliate path, gets support, generates sales, and becomes an advocate.

### Slide 5 — CRM engine

Every person, diagnostic, offer, store, affiliate link, support issue, and sale is tracked in one operating pipeline.

### Slide 6 — AI agents

Specialized agents assist with capture, diagnostic, CRM follow-up, academy coaching, product matching, private store setup, Telegram Premium MX, community support, and reporting.

### Slide 7 — Tiers and monetization

Free, Academy Starter, Academy Pro, Premium MX, Store Owner/Partner, and VIP create a clear ladder from learning to implementation to monetization.

### Slide 8 — MVP launch

Start lean: Instagram capture, AI diagnostic, CRM, academy onboarding, separate Telegram pilot bot, basic catalog/affiliate tracking, and weekly reporting.

### Slide 9 — Roadmap

Phase 1 lead/diagnostic; Phase 2 academy; Phase 3 Telegram pilot; Phase 4 catalog/affiliate; Phase 5 private stores; Phase 6 scale.

### Slide 10 — Why this wins

The system does not just sell education. It builds an operating layer where learning, offers, community, and commerce execution are measurable and repeatable.

---

## 15. Recommended immediate next steps

1. Approve tier structure and first MVP offer.
2. Choose CRM/LMS/automation stack.
3. Finalize diagnostic questions and scoring.
4. Build Instagram lead capture and CRM pipeline.
5. Launch a separate Telegram pilot bot for Offers Premium MX.
6. Run a 30-day pilot with a small cohort.
7. Review conversion, activation, offer engagement, and store-readiness data before scaling.
