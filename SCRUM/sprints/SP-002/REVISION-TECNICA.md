# Revisión técnica · SP-002

Fecha de evidencia: 2026-09-14T06:40:00Z. Código evaluado: `0e6e09530645247eb950da34388f9c1c063b783d256774b02f4f30a21d557a54`.

**Auto-revisión de Codex; no revisión independiente ni aprobación productiva.** Se inspeccionaron HMAC fixture, replay, mapeo servidor, cookie opaca, UI de intercambio/logout/TTL y tests.

## Resultados

- 43 pruebas unittest PASS (`test_workspace.py` + `test_telegram.py`).
- 22 recorridos Playwright/Chrome PASS, incluidos logout de encabezado e initData→Diego.
- Token de bot: fixture `000000:SP002-FIXTURE-NOT-A-REAL-BOT`. IDs 900001/900002. HMAC `WebAppData`. Replay en memoria. Extra `userId`/`personId` → 422.
- UI no construye el HMAC en el navegador; `POST /demo/v1/telegram-fixture` emite la prueba y `telegram-session` la verifica.
- Sesión 15 minutos; caducidad y logout devuelven `SESSION_REQUIRED`, no un error de membresía.

## Fronteras revisadas

Sigue siendo demo loopback. Cookie HttpOnly sin Secure. El selector de persona y el minteo de initData son atajos de laboratorio; no prueban posesión de una cuenta Telegram. CRM/`miniapps/api` no se importó. El working tree puede tener cambios ajenos (CRM); no forman parte de este slice.

## Límites y pendientes

No se certifica BotFather, webhook, linking BG-007, BG-036, Hostinger ni producción. Aikido no se ejecutó: el conector pide login. Roger debe aceptar o devolver BG-006.
