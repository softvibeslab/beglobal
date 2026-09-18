# Workflow · ciclo de sesión del miembro (local)

Árbol único para SP-004. No cubre el puente de membresías ni Mini App.

## Actores

Miembro de prueba (Lucía o Diego), UI local, store de sesiones en memoria.

## Happy paths

1. **Logout de esta cookie.** UI → `POST /demo/v1/logout` → se borra esa fila → cookie eliminada → siguiente GET privado `401 SESSION_REQUIRED`. Historial sintético no se borra (sigue vacío). Una segunda cookie de la misma persona **sigue viva**.
2. **Cerrar todas.** UI → `POST /demo/v1/logout-all` (sesión vigente) → `session_versions[persona] += 1` → se eliminan filas de esa persona → cookies hermanas fallan en `current()` aunque alguien reenvíe el valor.

## Fallos

| Rama | Resultado observable |
|---|---|
| Sin origen/intención en logout-all | 403 `INTENT_REQUIRED` / `ORIGIN_DENIED`; la sesión sigue. |
| Cookie caducada | 401 `SESSION_REQUIRED`. |
| Membresía no verificable con sesión viva | 503 `MEMBERSHIP_UNVERIFIED` en el recurso PRO. |
| Recover por nombre con sesión viva | 403 `IDENTITY_RECOVERY_DENIED`. |
| Tras logout-all, recurso PRO | 401, no 503. |

## Handoff

UI nunca es autoridad. Abort cleanup = borrar sesión, no entregables. Timeout de sesión = 15 min. Asunción: un proceso local; no hay réplica.
