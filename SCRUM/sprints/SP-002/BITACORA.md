# Bitácora · SP-002

## 2026-09-13 · Inicio e implementación

- Roger pidió commit de SP-001 y acelerar el siguiente slice. Alcance: HMAC/initData de fixture en Member Workspace.
- Añadidos `telegram_initdata.py`, `POST /demo/v1/telegram-session` y `test_telegram.py`. 42 pruebas locales PASS (32 previas + 10 nuevas).
- Token `000000:SP002-FIXTURE-NOT-A-REAL-BOT`. IDs 900001→Lucía, 900002→Diego. Replay en memoria. Sin BotFather, Hostinger ni cuentas reales.
- BG-036 y CRM de `miniapps/api` no se tocaron.
