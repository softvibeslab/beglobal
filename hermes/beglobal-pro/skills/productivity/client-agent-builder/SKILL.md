---
name: client-agent-builder
description: "Build ready-to-deploy personalized client agents from client info and a knowledge base: intake, gap questions, agent persona, operating rules, KB structure, onboarding copy, and group-ready configuration package."
---

# Client Agent Builder

Use this skill when Roger/Chris/Mario wants to create a personalized AI agent for a client and provides some combination of client information, business context, tone, services, FAQs, documents, website/social links, or a knowledge base.

Goal: turn messy client context into a **ready-to-add-to-a-group agent package** with the least back-and-forth possible.

## Core principle

Do not start by asking 20 questions. First extract what is already provided, identify only the missing information that blocks configuration, and ask a short prioritized set of questions.

Default behavior:

1. Read/analyze the client information and KB.
2. Summarize what is understood.
3. Identify gaps.
4. Ask only the minimum questions needed.
5. Once answered, produce the complete agent configuration package.

## What the final package should include

When enough information is available, produce:

1. **Agent identity**
   - Name
   - Role
   - One-line mission
   - Personality/tone
   - What the agent should and should not do

2. **Business context**
   - Who the client is
   - What they sell/do
   - Audience/customer types
   - Offers/services/products
   - Key differentiators

3. **Knowledge base map**
   - Main facts the agent should know
   - FAQs
   - Pricing/process if provided
   - Links/documents included
   - Unknowns that must not be invented

4. **Operating instructions**
   - How to answer
   - When to ask for clarification
   - When to escalate to the human/client
   - How to handle leads/prospects
   - How to handle objections
   - How to create content or proposals if relevant

5. **Group behavior**
   - How to introduce itself in a Telegram/WhatsApp group
   - How to respond when tagged
   - What kind of tasks the client can ask it to do
   - Boundaries and privacy reminders

6. **Sales / service workflows if relevant**
   - Lead intake
   - Qualification questions
   - Follow-up style
   - Proposal structure
   - Objection responses
   - CTA style

7. **Ready-to-paste system prompt / agent brief**
   - A clean markdown block that can be used to configure the agent.

8. **Client onboarding message**
   - Short message explaining how to use the agent after it is added to the group.

## Intake checklist

Extract these fields from the provided info. Mark each as: `known`, `missing`, or `optional`.

### Client basics
- Client/business name
- Industry/niche
- Location/timezone/language
- Website/social links
- Main decision-maker/contact

### Goal of the agent
- Main purpose: sales, content, support, operations, strategy, admin, internal assistant, etc.
- Top 3 outcomes the client wants
- Problems the agent should reduce
- Tasks the agent should perform daily/weekly

### Brand voice
- Tone: casual, premium, expert, warm, direct, playful, formal, etc.
- Words/phrases to use
- Words/phrases to avoid
- Language preference
- Example messages/content from the client if available

### Business details
- Offers/services/products
- Pricing or pricing rules, if shareable
- Buying process
- Delivery process
- Guarantees/policies
- Ideal customer profile
- Common objections
- FAQs

### Knowledge base
- Documents/files/links included
- What is authoritative vs. reference only
- Sensitive/private info
- Facts the agent must never invent
- External lookup permissions

### Escalation and boundaries
- When to say “I don’t know”
- When to ask the human
- What topics are off-limits
- Whether it can draft messages only or also send them
- Whether it can browse the internet/social profiles
- Whether it can create calendar reminders/tasks/proposals/docs

## Minimum questions to ask

Ask only questions that materially change the setup. Use this compact format:

> Va, tengo suficiente para armar la base. Solo me faltan estas preguntas para dejarlo fino:
> 1. ¿Cuál es el objetivo #1 del agente?
> 2. ¿Qué tareas quieres que haga diario?
> 3. ¿Qué tono debe usar?
> 4. ¿Qué cosas NO debe decir o prometer?
> 5. ¿Cuándo debe escalar con un humano?

If client info is very thin, ask:

1. ¿Quién es el cliente y qué vende?
2. ¿Para qué va a usar el agente principalmente?
3. ¿Quién le va a escribir al agente: equipo interno, prospectos o clientes?
4. ¿Qué documentos/base de conocimiento tengo que usar?
5. ¿Qué tono quieres: formal, casual, premium, vendedor, educativo, etc.?
6. ¿Qué no debe inventar ni prometer?

## Default agent behavior rules

Unless the user says otherwise, configure client agents to:

- Be concise, useful, and action-oriented.
- Use the client’s tone and vocabulary.
- Answer only from provided knowledge when asked about facts specific to the business.
- Clearly say when information is missing.
- Ask one useful follow-up question when needed.
- Never invent prices, guarantees, timelines, credentials, availability, case studies, results, or legal/medical/financial claims.
- Draft messages and recommendations; do not claim to have sent, booked, charged, or approved anything unless tools confirm it.
- Escalate sensitive decisions to the human owner.
- Protect private client/customer information.

## Recommended output format

Use this format after enough info is available:

```markdown
## Agente listo: <Agent Name>

### 1. Resumen del cliente
- Cliente:
- Nicho:
- Audiencia:
- Oferta principal:
- Objetivo del agente:

### 2. Rol del agente
<one paragraph>

### 3. Personalidad y tono
- ...

### 4. Lo que el agente puede hacer
- ...

### 5. Lo que NO debe hacer
- ...

### 6. Base de conocimiento cargada
- ...

### 7. Preguntas pendientes / riesgos
- ...

### 8. System prompt / instrucciones del agente
```text
<ready-to-paste prompt>
```

### 9. Mensaje de bienvenida para el grupo
<short client-facing message>

### 10. Cómo usarlo
- "Respóndele a este prospecto..."
- "Hazme un follow-up..."
- "Resume esta conversación..."
- "Crea una propuesta..."
```

## Ready-to-paste system prompt structure

The system prompt should include:

```text
Eres <Agent Name>, el agente AI personalizado de <Client/Business>.

MISIÓN
<mission>

CONTEXTO DEL CLIENTE
<business context>

TONO Y ESTILO
<voice rules>

BASE DE CONOCIMIENTO
<KB summary and source hierarchy>

TAREAS PRINCIPALES
<task list>

REGLAS DE RESPUESTA
<format, brevity, language, CTA style>

LÍMITES Y ESCALACIÓN
<do-not-invent, sensitive topics, when to ask human>

FLUJOS
<sales/support/content/ops workflows>

PRIMERA RESPUESTA EN GRUPO
<onboarding intro>
```

## Deployment notes for Telegram/WhatsApp groups

When the user says “déjalo listo para agregar al grupo,” provide:

1. The agent brief/system prompt.
2. The welcome message.
3. A short “how to use me” menu.
4. A list of missing info that can be added later.
5. A suggested first test:
   - “Pídele que responda a un prospecto real.”
   - “Pídele que convierta una nota en propuesta.”
   - “Pídele que cree 5 ideas de contenido.”

Do not claim the agent is technically deployed unless it has actually been configured in Hermes/gateway or another platform. Say “queda listo para configurar/agregar” if the task only produced the configuration package.

## Portable handoff packages

When the user asks for a ZIP/folder to upload to a VPS or computer, package the work so another Hermes agent can read the folder and configure itself with minimal explanation.

Include:

1. `README.md` with install steps and starter prompts.
2. `install.sh` to copy skills into either `~/.hermes/skills/` or `~/.hermes/profiles/<profile>/skills/` when `HERMES_PROFILE` is set.
3. Relevant skills under category directories, preserving `SKILL.md`, `references/`, `templates/`, and `scripts/`.
4. Optional `client-agents/<client-name>/` with `agent-brief.md`, `system-prompt.txt`, `knowledge-base.md`, and `onboarding-message.md` for finished client agents.
5. Clear separation between “configuration package is ready” and “bot/gateway is actually deployed.”

Support files:

- `templates/portable-agent-pack-readme.md` — README starter for portable handoff ZIPs.
- `scripts/install-skill-pack.sh` — generic installer script for category-based skill packs.

## Common pitfalls

1. **Asking too many questions upfront.** Extract first, ask only the blockers.
2. **Inventing details from the client’s niche.** Use assumptions only when clearly labeled.
3. **Making the agent too generic.** Anchor it in client tone, offers, objections, and daily tasks.
4. **Forgetting escalation rules.** Every client agent needs boundaries.
5. **Selling features instead of outcomes.** The setup should explain what time/money/clarity the agent saves.
6. **Confusing configuration with deployment.** A prompt/package is not the same as adding the bot to a group.

## Fast command examples

User might say:

- “Te paso la info de un cliente, hazme el agente.”
- “Aquí está la base de conocimientos, dime qué falta.”
- “Hazme las preguntas para configurar el agente.”
- “Déjalo listo para agregarlo al grupo del cliente.”
- “Crea el mensaje de bienvenida y cómo usarlo.”

Respond by running the intake workflow and producing either the missing-question list or the final ready-to-paste package.
