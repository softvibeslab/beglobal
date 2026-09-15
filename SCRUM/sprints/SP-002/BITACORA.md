# Bitácora · SP-002

## 2026-09-13 · Inicio e implementación

- Roger pidió commit de SP-001 y acelerar el siguiente slice. Alcance: HMAC/initData de fixture en Member Workspace.
- Añadidos `telegram_initdata.py`, `POST /demo/v1/telegram-session` y `test_telegram.py`. 42 pruebas locales PASS (32 previas + 10 nuevas).
- UI: mint fixture, intercambio HMAC, TTL 15 min y logout. 43 unittest + 22 Playwright PASS. BG-006 y SP-002 pasan a `in_review`. Aceptación de Roger pendiente.

## 2026-09-15 · Aceptación y cierre

- Roger escribió «aceotoi» (acepto). BG-006 `done`. SP-002 `closed`. [ACEPTACION](evidencias/ACEPTACION-20260915.md).
