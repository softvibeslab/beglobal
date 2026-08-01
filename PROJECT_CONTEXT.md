# Contexto operativo — BeGlobal

Actualizado: 2026-08-01 01:04 CST

## Identidad

- Canal Slack canónico: `#proyecto-beglobal` (`C0BLW4L9LS3`)
- Workspace local: `/Users/rogergv/Documents/SoftvibesLab/BeGlobal`
- Repo: `https://github.com/softvibeslab/beglobal.git` (`main`)
- Wiki operativa: [`docs/wiki/README.md`](docs/wiki/README.md)
- Dashboard: `https://lavenderblush-ibex-989145.hostingersite.com`
- Perfiles: `beglobal-orchestrator`, `beglobal-corporate`, `beglobal-team`, `beglobal-member`

## Qué es

BeGlobal es un sistema operativo de onboarding, capacitación, ejecución guiada y gobierno para Be Global Pro. Combina conocimiento de ecommerce, perfiles Hermes aislados, un dashboard de control y Mini Apps Telegram para convertir diagnóstico en misión, evidencia, revisión humana, métricas y mejora del método.

## Resultado MVP

Demostrar un ciclo real: Orchestrator enruta; un Member completa diagnóstico y una misión; Team revisa su evidencia; Corporate observa métricas y una decisión auditables. El cambio de roles requiere gobierno explícito, no solo XP.

## Estado verificado

- **Semáforo global: 🔴 Mini Apps no listas para despliegue.**
- Git: `main` local está 7 commits adelante y 0 detrás de `origin/main`; HEAD local `538ecec`, remoto `b49c3a3`.
- Conocimiento: 270 videos inventariados, 24 transcritos; grafo de 310 nodos, 1,428 relaciones y 10 comunidades.
- Dashboard: TypeScript/build aprobados durante la auditoría; URL pública respondió HTTP 200. No se confirmó que publique el HEAD local.
- Python: compilación de sintaxis aprobada.
- Pruebas: `test_phase1.py` con BD y Media Hub temporales terminó con código 1. La causa inicial es la FK parcial inválida `audit_trail.actor_tg_id → users(tg_id)` cuando `users` usa PK `(tg_id, profile)`; los locks posteriores son efectos en cascada.
- API: cuatro rutas duplicadas; existen contratos inconsistentes, datos demo en endpoints Corporate y flujos incompletos de escalamiento/notificaciones.
- Seguridad: falta autenticar webhook, parametrizar filtros SQL, validar cambios de rol transaccionalmente, escapar Telegram HTML y endurecer uploads.
- CI: no hay pipeline detectado ni lockfile npm; faltan pruebas E2E de auth, aislamiento, archivos y notificaciones.
- Despliegue: faltan bots separados, allowlists, dominio/TLS, healthcheck, backup/restore y aceptación real `Member → Team → Corporate`.
- VPS: solo hay evidencia histórica del 2026-07-30; la validación viva quedó bloqueada por autenticación SSH rechazada.

## Prioridad operativa

1. Corregir esquema/migración de `audit_trail`, conexiones y cleanup.
2. Reparar onboarding, suite y rutas duplicadas; eliminar datos demo del contrato productivo.
3. Cerrar riesgos P0 de webhook, SQL, roles, HTML y uploads.
4. Revisar/versionar commits y documentos; añadir CI y dependencias reproducibles.
5. Configurar bots, allowlists y TLS; desplegar staging.
6. Ejecutar aceptación real con un Member, una misión, un Team y un Corporate.
7. Hacer hardening del VPS con snapshot y rollback.

## Regla para Hermes

Antes de reportar: ejecutar `git fetch --prune origin`, revisar Git, correr sintaxis y suite en recursos temporales y consultar servicios vivos. Separar siempre **implementado**, **documentado** y **verificado**. Responder con semáforo, etapa, progreso verificable, pruebas, entorno vivo, bloqueadores, siguiente acción, dueño y fecha. No declarar producción activa por documentación histórica ni exponer secretos o datos personales.
