# Revisión técnica · SP-005

Fecha de evidencia: 2026-09-18T04:12:00Z. Código evaluado: `5af534408bc479f7f92109ceef4af6aa63746d495926e1fc471be39d548ec9f1`.

**Auto-revisión de Codex; no revisión independiente ni aprobación productiva.** Se inspeccionaron `POST /demo/v1/unlink`, rechazo de último acceso Telegram-only, replay/HMAC cruzado y UI «Desvincular con HMAC fresco».

## Resultados

- Unittest de workspace, telegram, link, session y unlink: PASS (4 casos de desvínculo).
- 26 recorridos Playwright/Chrome PASS, incluido desvínculo de Lucía con cookie web viva.
- `telegram-fixture` mint genera `query_id` distinto en cada llamada para que un HMAC del mismo segundo no sea replay involuntario.
- Tras unlink, `session_version` no sube; un initData posterior de 900001 responde `MEMBER_LINK_REQUIRED` y la cookie web de Lucía sigue.

## Fronteras

Loopback HTTP, cookie `SameSite=strict` sin `Secure`/`__Host-`. CRM no se importó. BG-008 permanece `proposed`.

## Pendientes

Roger debe aceptar o devolver BG-038. Aikido no se ejecutó (pide login).
