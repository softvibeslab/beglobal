# Arranque resuelto · SP-002

Roger pidió commit de SP-001 y «ya apúrate con el otro». Se interpreta como autorización de ejecutar SP-002 con la recomendación: **initData HMAC de fixture, sin bot productivo**.

| ID | Resolución |
|---|---|
| A-01 | Objetivo: intercambiar initData sintético válido → sesión corta; denegar firma/bot/caducidad/replay y userId de cliente. Excluye BotFather, Hostinger, cuentas reales, BG-007, BG-036, chat premium. |
| A-02 | Seguir en `beglobal/member-workspace/` sobre `feat/equipo-crm-p0` sin mezclar CRM; commit atómico del slice. Sin push salvo pedido. |
| A-03 | Los mismos dos sujetos ficticios; Telegram IDs 900001/900002 mapeados en servidor. Token de bot de fixture, no secreto real. |
| A-04 | Local, fixtures off fuera de development/test. 0 USD. |
| A-05 | Codex ejecuta y auto-revisa; Roger revisa al entregar. |
| A-06 | Inicio inmediato 13/09/2026; límite 16/09/2026 18:00 America/Cancun. |

Fuente: [APROBACION.md](APROBACION.md).
