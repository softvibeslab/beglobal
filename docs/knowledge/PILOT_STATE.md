# Estado del piloto

**Verificado:** 2026-08-14 06:59 UTC

**Fuente Git:** `origin/main` en `aecdce57083661ac62feaa21119db3f2cfa82a71`

**Semáforo:** 🔴 flujo completo no listo para piloto humano

## Implementado

- Paquetes declarativos de cuatro roles y perfiles Hermes.
- Dashboard Next.js/React/TypeScript con exportación estática.
- Frontends de Mini Apps y API FastAPI con SQLite, autenticación Telegram declarada y Media Hub.
- Una segunda implementación Member independiente bajo `beglobal-member-miniapp/`; todavía no forma una arquitectura única con `beglobal/miniapps/`.
- Inventario de 270 videos, corpus Graphify y grafo publicado de 310 nodos/1.428 relaciones.
- Un índice federado usado por el perfil Corporate activo fue observado localmente con 986 nodos, 2.344 relaciones y 250 fuentes; no está en `origin/main` y su snapshot requiere regeneración/revisión antes de transferirse.
- Documentación operativa, permisos, onboarding y runbook.

“Implementado” significa presente en el commit; no implica despliegue ni aceptación.

## Documentado

- Flujo `diagnóstico → misión → evidencia → revisión → métricas`.
- Separación Member/Team/Corporate y Orchestrator como router.
- Gates, seguridad, despliegue previsto y criterios de aceptación.
- Estado histórico en [wiki operativa](../wiki/README.md), que debe revalidarse.

## Verificado en este corte

| Comprobación | Resultado |
|---|---|
| `git fetch --prune origin` y commit fuente | PASS; worktree aislado desde `origin/main` |
| `python3 -m compileall -q beglobal/miniapps/api hermes scripts` | PASS |
| Dashboard `npm run check` | PASS |
| Dashboard `npm run build` | PASS; rutas estáticas `/`, `/_not-found`, `/contratos` |
| `beglobal/miniapps/api/test_phase1.py` con SQLite temporal | FAIL; 4 de 11 escenarios avanzaron y 7 fallaron; salida 1 |
| Member independiente `npm run type-check` | FAIL; 10 errores TypeScript |
| Member independiente `npm test -- --run` | FAIL; falta `jsdom` y no se encontraron pruebas |
| Member independiente `npm run build` | FAIL; dependencia opcional `terser` ausente |
| Dashboard Hostinger documentado | HTTP 200; no se demostró correspondencia con el commit fuente |
| `https://beglobal.rovicrm.com` | HTTP 502 |

La suite Fase 1 falla primero por la relación inválida `audit_trail.actor_tg_id → users(tg_id)` cuando `users` tiene clave compuesta; luego aparecen bloqueos de SQLite y el cleanup también falla. No se maquillan como fallos independientes.

## Evidencia histórica pendiente de revalidación

- VPS, servicios, bots, allowlists, TLS, backups y rollback.
- Correspondencia exacta entre la URL pública y este commit.
- Autenticación y aislamiento extremo a extremo con cuentas reales.
- Aprobación del currículo y de recursos concretos.
- Métricas comerciales, precio, contrato, SLA y disposición de pago.

## Bloqueadores

1. Corregir esquema/migración de `audit_trail` y manejo de conexiones/rollback.
2. Lograr suite limpia en base temporal.
3. Eliminar rutas duplicadas y datos demo de contratos productivos.
4. Cerrar webhook, SQL, cambios de rol, Telegram HTML y validación de uploads.
5. Extender CI al conjunto del piloto; conservar el lockfile del dashboard y añadir instalación reproducible a la Mini App Member y dependencias Python.
6. Decidir y consolidar las dos implementaciones de Mini App/Member.
7. Rotar o revocar material con apariencia de credencial detectado en archivos/historia rastreados; no se reproduce su valor.
8. Configurar bots/allowlists/TLS y validar backup/restore.
9. Ejecutar aceptación real Member → Team → Corporate.

## Siguiente gate

**Gate técnico:** suite Fase 1 al 100%, contrato API único y riesgos P0 cerrados.

**Dueño sugerido:** responsable técnico; Corporate aprueba el paso de gate y Team ejecuta QA. Los nombres concretos no están registrados en una fuente pública aprobada.

## Nota sobre trabajo local

El workspace original contenía cambios locales ajenos y estaba 25 commits detrás de `origin/main`. Esta documentación se generó en un worktree aislado; esos cambios no forman parte de este corte ni del futuro commit documental.
