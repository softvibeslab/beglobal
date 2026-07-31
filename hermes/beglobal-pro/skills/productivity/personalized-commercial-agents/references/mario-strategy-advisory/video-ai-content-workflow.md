# Mario Video-AI Content Workflow

Use this reference when planning Mario/Roger/Chris workflows for AI-assisted video production.

## Current MVP components

- **Google Drive**: source of truth and asset hub.
- **HeyGen**: avatar/talking-head generation for Mario-style delivery.
- **HiggsField**: cinematic/B-roll/visual clip generation.
- **Premiere Pro**: final assembly, editing, subtitles, music, and exports.

## Recommended workflow shape

1. **Input**: Mario/Chris/Roger provides an idea, audio, rough script, reference, offer, or CTA.
2. **Strategy pass**: clarify the commercial objective first: BEAT Express, personalized AI agents, Sales Academy, or Mario brand authority.
3. **Script package**: produce hook, short script, scene breakdown, HeyGen text, HiggsField prompts, Premiere shotlist, subtitles, caption, CTA.
4. **Drive organization**: create or use a per-video folder with briefing, scripts, prompts, assets, Premiere project, exports, and caption.
5. **Generation**: HeyGen creates avatar/talking-head; HiggsField creates visual support clips.
6. **Editing**: Premiere Pro assembles the piece manually or via scripting when available.
7. **Delivery**: export final video to Drive with caption/CTA and publish notes.

## Suggested Drive structure

```text
Mario Content Factory/
  01_Ideas/
  02_Guiones/
  03_HeyGen/
  04_HiggsField/
  05_Premiere_Projects/
  06_Exports/
  07_Publicados/
```

Per-video folder:

```text
Video_YYYY-MM-DD_TOPIC/
  00_brief.md
  01_script_heygen.txt
  02_prompts_higgsfield.md
  03_shotlist_premiere.md
  04_subtitles.srt
  assets/
    heygen/
    higgsfield/
    music/
    logos/
  premiere/
  exports/
  caption.md
```

## MVP principle

Start semi-manual: the agent creates the full production package and Drive organization; Roger/Chris can operate HeyGen, HiggsField, and Premiere manually. Automate later via APIs/scripts only after the manual workflow is validated.

## Visual reference

Mario's avatar/look should follow the provided reference image: black glasses, navy suit, black “SER VENDE” shirt, brown shoes.

### HeyGen / avatar-shot correction notes

For Sales Academy AI video ads, do **not** default to a luxury hotel suite. When the concept is sales training, commercial operation, or a department of AI for sales, the preferred setting is a **premium sales room / executive sales training room with ocean view**:

- floor-to-ceiling windows overlooking the Caribbean/ocean
- premium conference table and executive chairs
- modern resort sales office / presentation room feel
- clean corporate layout, calm and exclusive
- explicitly avoid bedroom, hotel-suite, sofa-lounge, or private-suite framing

Avatar selection must be checked before generation. If the source image/avatar has a visible microphone, lavalier, headset, podcast mic, or handheld mic and the scene is not an interview/podcast, reject it and request/use a clean Mario avatar. Include both positive instruction and negative prompt:

> Use a clean Mario Villanueva avatar with NO visible microphone, NO lavalier mic, NO headset, NO podcast microphone, NO handheld microphone, and NO audio equipment visible.

When HeyGen drifts or loses the script, shorten the copy and add a `SCRIPT LOCK` block:

> Mario must say the following script exactly. Do not rewrite it. Do not add words. Do not remove words.

For the first Sales Academy AI ad, the corrected 15-second hook script is:

```text
Tu equipo de ventas no necesita más presión.

Necesita más apoyo.

Muchos vendedores no fallan por falta de talento.

Fallan porque no tienen un sistema que los acompañe.
```

This script works because it is simple, names a pain, does not blame sellers, and bridges naturally into Sales Academy AI as the solution.

## Commercial constraint

The goal is not just making nice videos. Every output should connect to a business objective:

- pain/desire
- promise
- proof/authority angle
- CTA
- platform-ready caption

For video ads, use a simple direct-response structure when possible: **Hook → Dolor → Story → Solución → Offer → CTA**. Keep Mario's language clear enough for a 10-year-old to understand when the user asks for simplicity, while preserving premium executive tone.
