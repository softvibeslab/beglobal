# Revisión técnica · SP-003

Fecha de evidencia: 2026-09-16T13:50:00Z. Código evaluado: `a8a357e86e33bee32c59d90a499c98cfe85bb99ca436651fe7a07bbcd8a59f80`.

**Auto-revisión de Codex; no revisión independiente ni aprobación productiva.** Se inspeccionaron desafío de 5 min, HMAC reutilizado, unicidad telegram↔persona, denegación de recuperación y UI de vínculo.

## Resultados

- 49 pruebas unittest PASS (`test_workspace.py` + `test_telegram.py` + `test_link.py`).
- 24 recorridos Playwright/Chrome PASS, incluidos vínculo Lucía/900001, conflicto Diego y recuperación por nombre.
- Desafío de un solo uso ligado a la sesión (`LINK_CHALLENGE_TTL` = 300). Consumo en cada intento de `/demo/v1/link`.
- Cruce de sujeto o dueño previo → 409 `LINK_CONFLICT` sin merge de historial (el historial de miembro sigue vacío).
- POST `/demo/v1/recover` con nombre o email → 403 `IDENTITY_RECOVERY_DENIED`.
- Origen + `X-Workspace-Intent: fixture-demo` en mutaciones; challengeId no se persiste en GET workspace.

## Fronteras revisadas

Sigue siendo demo loopback. No hay Mini App, BotFather ni BFF de staging. CRM/`miniapps/api` no se importó. El working tree puede tener cambios ajenos (CRM); no forman parte de este slice.

## Límites y pendientes

No se certifica BG-008, cuentas reales, recuperación asistida, Hostinger ni producción. Aikido no se ejecutó: el conector pide login. Roger debe aceptar o devolver BG-007.
