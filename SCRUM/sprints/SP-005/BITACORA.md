# Bitácora · SP-005

## 2026-09-17 · Inicio

- «sigue» tras SP-004. Desvincular Telegram con HMAC fresco. No BG-008 ni merge.

## 2026-09-18 · Entrega local

- `POST /demo/v1/unlink` + UI. Mint fixture con `query_id` único (evita INITDATA_REPLAY del mismo segundo). 57 unittest + 26 Playwright PASS. BG-038 y SP-005 pasan a `in_review`. Aceptación de Roger pendiente.
