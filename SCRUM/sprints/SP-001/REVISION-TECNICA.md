# Revisión técnica · SP-001

Fecha de evidencia: 2026-09-13T09:51:21.680475+00:00. Código evaluado: `dbe9e8a7eb12809cc351cce1fe77dcf6323e386e9886e49a6c8d6afaa8b52b20`.

**Auto-revisión de Codex; no revisión independiente ni aprobación productiva.** Se inspeccionaron factory/guardas, resolución de sesión, contexto/ownership, puente/política, serialización, render y tests. Inventario exacto en [report.json](../../../beglobal/member-workspace/qa/latest/report.json).

## Resultados

- 32 pruebas del backend local PASS; 22 del puente PASS; 20 recorridos Playwright/Chrome PASS, sin skips ni flaky tests.
- OpenAPI 3.0.3 y esquema UI: validación formal PASS. Formas de perfil/acceso/error: respuestas reales de TestClient verificadas contra SPECS.
- Revisión de tests: ocho comprobaciones estáticas PASS y revisión manual de locators, aislamiento, aserciones y datos. No se mockeó la API propia; los escenarios representan la plataforma externa aún no conectada.
- Capturas inspeccionadas de escritorio y 320 px; sin desbordamiento horizontal en 320/390/768/1440. Logo local, marca y aviso sintético visibles. Se corrigió el origen de scroll de la captura y se reejecutó la suite.
- Correcciones incluidas antes de la verificación final: sincronizar selectores con la sesión restaurada, conservar foco al actualizar con teclado y eliminar una etiqueta decorativa que podía confundirse con avance.
- Fuentes estables durante las pruebas; ningún archivo legacy rastreado modificado. No se realizó commit/push/deploy.

## Fronteras revisadas

La demo no puede arrancar en staging/producción; escucha sólo loopback y verifica Host/peer. Mutaciones requieren origen/intención. La cookie opaca local no se expone a JS/JSON/URL, pero deliberadamente usa HTTP local sin Secure: **no copiar este transporte al BFF productivo**. Las sesiones son sintéticas y cualquier operador local puede elegir una persona ficticia; eso no prueba posesión de una identidad real.

Todo acceso a perfil/recurso verifica sesión y negocio; el recurso PRO ficticio reconsulta MembershipBridge. Plan no concede academia ni rol interno. No hay imports legacy, DB, .env, modelos, terceros, publicación o pagos. CSP limita recursos al mismo origen; notice usa textContent y contrato cerrado.

## Límites y pendientes

La validación global de SPECS sobre el **worktree antiguo** sigue en FAIL por cuatro rutas legacy duplicadas, [BL-004](BL-004-BASE-LEGACY.md). No se rebajó el gate; integración allí bloqueada hasta BG-036. El gate local del prototipo sí pasa. La copia principal y el worktree son baselines distintos, no mezclar sus reportes.

No se certifica seguridad productiva, carga/SLA, autorización Telegram real, persistencia, recuperación, MCP/OAuth ni impacto comercial. No hay defectos críticos identificados en el alcance sintético evaluado; eso no demuestra ausencia absoluta de vulnerabilidades. Roger debe revisar los 20 criterios y aceptar o devolver las historias.
