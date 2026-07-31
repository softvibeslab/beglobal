# Voice-note knowledge ingestion for commercial/sales agents

Use this when Chris/Roger/Mario provide a Google Drive folder/link or ZIP of voice notes intended to train a personalized sales agent.

## Pattern from session

Input may arrive as:
- a Drive folder link that is not public yet
- a direct `drive.google.com/uc?id=...&export=download` link
- a Telegram file path that may not actually exist in the runtime
- a ZIP containing many `.m4a` voice notes plus a `MANIFEST.json`

## Recommended workflow

1. **Verify access first**
   - If a folder link redirects to Google sign-in or `gdown --folder` returns `401`, tell the user to set sharing to **Cualquier persona con el enlace → Lector** or send a direct ZIP/download link.
   - Do not claim the Drive file is inaccessible forever; it may simply need public sharing or a direct file link.

2. **Download direct Drive files robustly**
   - Large Drive files often return a “Google Drive can't scan this file for viruses” HTML page first.
   - Parse the confirmation form and retry against `https://drive.usercontent.google.com/download` with the hidden fields: `id`, `export=download`, `confirm`, and `uuid`.
   - Save the real binary and verify with `file`/zip inspection before proceeding.

3. **Extract and inventory**
   - Use Python `zipfile` when `unzip` is unavailable.
   - Count files, classify extensions, read `MANIFEST.json` if present, and estimate audio duration with `ffprobe`.
   - Report concise totals to the user: number of audios, total duration, notable named files.

4. **Transcribe as a background job when large**
   - For multi-hour audio packs, start transcription in the background with completion notification instead of blocking the chat.
   - If installing Whisper or other speech tooling needs temporary space, use a writable temp dir such as `/root/tmp` via `TMPDIR=/root/tmp`.
   - Keep raw transcripts under a clear folder like `/tmp/<project>/transcripts/` before promoting curated knowledge.

5. **Promote knowledge after transcription**
   - Convert transcripts into reusable sales-agent knowledge: philosophy, scripts, objections, pitch structures, closing language, coaching/motivation, and examples.
   - Preserve provenance by audio filename and mark uncertain transcription sections for review.

## User-facing style

Keep the progress message short and concrete:
- “Ya lo descargué y extraje.”
- “Encontré X audios, aprox. Y horas.”
- “Ya dejé corriendo la transcripción.”
- “Cuando termine, lo ordeno en scripts, objeciones, cierres y entrenamiento.”
