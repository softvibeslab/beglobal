---
name: mario-knowledge-ingestion
description: Absorb durable Mario/BEAT knowledge from chats, notes, docs, and public context into the MarioAgent KB and refresh the Graphify knowledge graph.
triggers:
  - Mario shares new context, stories, preferences, offers, processes, objections, positioning, or strategy
  - Roger or Chris asks to preserve/transfer knowledge into the Mario assistant
  - Updating the MarioAgent knowledge base or graph
  - Using Graphify for Mario/BEAT knowledge navigation
metadata:
  created_by: agent
---

# Mario knowledge ingestion

Use this skill whenever Mario, Roger, or Chris shares durable information that should become part of the Mario / BEAT knowledge base.

## Core principle

Do not leave important Mario knowledge only in chat history. Convert durable input into project KB files, then refresh the Graphify graph so future answers can use it.

**Use Hermes memory only for compact user preferences and operating rules.** Use project files for Mario/BEAT/business knowledge.

## What counts as durable knowledge

Save when the input is about:

- Mario's voice, phrases, stories, principles, opinions, or corrections
- BEAT / Del Ser al Vender concepts or changes
- services, packages, offers, workshops, demos, pricing constraints, or delivery model
- sales process, follow-ups, objeciones, FAQs, scripts, proposals
- brand positioning, content direction, Instagram/public presence, collaborations
- client/prospect patterns and reusable commercial insights
- rules about how the assistant should behave with Mario or commercial channels

Do **not** promote as approved KB by default:

- temporary tasks, one-off logistics, stale dates
- unverified numbers/results/testimonials
- private/sensitive details not needed for future work
- assumptions from the assistant unless marked `pendiente de validar`

## Workflow

1. **Classify the input**
   - Is it durable Mario/BEAT knowledge?
   - Is it temporary task state?
   - Is it sensitive or unverified?

2. **Verify the source artifact before processing**
   - When the user provides a file path from Telegram/Drive export (for example a ZIP of voice notes), first confirm the file actually exists in the tool environment before promising extraction or ingestion.
   - If the path is only a chat-rendered attachment reference and is not present on disk, ask the user to re-upload the file directly or share an accessible Drive link; do not treat missing local setup as a durable limitation.
   - For voice-note archives, the first pass should inventory filenames, file types, and sizes, then decide whether transcription/OCR/text extraction is needed before promoting facts into the KB.

3. **Locate and verify the MarioAgent KB root**
   - Do not assume the current working directory contains `MarioAgent/`.
   - Resolve the real project root first and use absolute paths for all writes.
   - Check likely existing locations such as `/root/.npm/MarioAgent`, `/usr/local/lib/hermes-agent/MarioAgent`, or another user-provided path; verify by confirming `knowledge/` and `AGENTS.md` exist.
   - If multiple roots exist, prefer the one with the active curated `knowledge/*.md` files and recent updates; mention the path used if there is any ambiguity.

3. **Capture raw intake**
   - Write a short intake note under `<MarioAgent>/knowledge/intake/YYYY-MM-DD-topic.md`.
   - Include: source, speaker, raw summary, extracted facts, status.

4. **Promote stable facts**
   - Brand/positioning → `knowledge/marca.md`
   - Tone/voice → `knowledge/tono.md`
   - Services/offers → `knowledge/servicios.md`
   - Processes/sales → `knowledge/procesos.md`
   - Objections → `knowledge/objeciones.md`
   - FAQs → `knowledge/faqs.md`
   - Social/public findings → `knowledge/redes-sociales.md` or `knowledge/investigacion-web.md`
   - Intake system rules → `knowledge/knowledge-ingestion.md`

4. **Mark provenance**
   - `Mario dijo:` for direct statements from Mario.
   - `Roger/Chris indicó:` for operational instructions.
   - `Fuente pública:` for internet/Instagram observations.
   - `Pendiente de validar:` for uncertain items.

5. **Refresh Graphify**
   - If Graphify is installed, from the verified MarioAgent root run:

```bash
GRAPHIFY_FORCE=1 graphify extract ./knowledge --out ./knowledge/reference
```

   - For large or heavily updated KBs, Graphify extraction can exceed a foreground timeout. Prefer a background/long-running execution pattern with completion notification, then verify output files afterward, instead of repeatedly retrying the same foreground command.

   - If extraction requires an LLM backend/API key and fails, still save the KB files and tell the user graph refresh needs backend configuration.
   - Important: Graphify does **not** automatically reuse Hermes' active model/session. It expects its own backend credentials (`GEMINI_API_KEY`/`GOOGLE_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `MOONSHOT_API_KEY`) or a supported local/CLI backend such as `ollama`/`claude-cli`. If Hermes is using `openai-codex` OAuth, Graphify cannot directly consume that OAuth session without a custom adapter.
   - For OpenAI-compatible non-OpenAI providers (example: Z.ai/GLM), Graphify's installed `openai` backend may need to respect `OPENAI_BASE_URL`. Verify with a tiny `openai.OpenAI(api_key=..., base_url=...).chat.completions.create(...)` call, then run Graphify with `--backend openai --model <provider-model>` and `OPENAI_BASE_URL` set. If Graphify ignores the env var, patch `graphify/llm.py` openai backend base_url to `os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")`.
   - Avoid contaminating the corpus by extracting `knowledge/reference/` outputs as input. For Mario KB, copy only top-level `knowledge/*.md` into a temp corpus (for example `.graphify-corpus/knowledge`) and set `--out ./knowledge/reference`.
   - Useful graph commands:

```bash
cd MarioAgent/knowledge/reference && graphify query "¿qué conecta BEAT con ventas high-ticket?" --graph graphify-out/graph.json
cd MarioAgent/knowledge/reference && graphify explain "BEAT" --graph graphify-out/graph.json
```

6. **Use it immediately**
   - After ingestion, future Mario answers should read/search the KB first and use the updated facts.

## Chat response pattern

Keep the user-facing response short:

> Listo, esto ya lo tomo como conocimiento base de Mario. Lo guardé en la KB y lo usaré para futuras respuestas sobre [tema].

If Graphify was refreshed:

> También actualicé el grafo para que ese contexto se pueda conectar con BEAT/ventas/contenido.

If not refreshed:

> La KB quedó actualizada; falta refrescar Graphify porque requiere configurar el backend/API.

## Verification

Before finalizing, check:

- Intake file exists at the verified MarioAgent root.
- Curated KB file updated if applicable.
- Absolute paths were used after confirming the active KB root.
- Unverified claims are not written as facts.
- Graphify output exists or failure/timeout/setup need is reported clearly.

## Pitfalls

- Do not dump entire chat transcripts into memory.
- Do not turn private or volatile details into global memory.
- Do not state graph facts as certain if Graphify marked edges as inferred/ambiguous.
- Do not replace the curated KB with raw Graphify output; Graphify complements the KB, it is not the authority.
