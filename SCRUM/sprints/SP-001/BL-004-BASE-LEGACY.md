# BL-004 · Rutas duplicadas preexistentes en la base SPEC_AGENTS

Detectado durante QA de SP-001 · Estado: **pendiente de integración futura; no se modificó la API antigua**.

La rama `SPEC_AGENTS` parte de `a264c30`. Su `beglobal/miniapps/api/main.py` contiene 50 rutas únicas y cuatro decoradores GET repetidos:

- `/api/team/missions-queue`
- `/api/corporate/metrics`
- `/api/corporate/gates`
- `/api/corporate/decisions`

El archivo local y el de HEAD tienen el mismo SHA-256: `81db4dd6b10f02e14fb81c1c964eef02185a2cd03d3a924bf389fb9640961424`. La comprobación global `SPECS/qa/validate_specs.py` falla correctamente en la primera duplicada. No se suavizó el validador ni se eliminó el handler para hacer verde la prueba.

Evidencia reproducible: `beglobal/member-workspace/qa/latest/legacy-baseline.json` y `specs-worktree.txt` en el worktree. El reporte global heredado de la preparación no se presenta como si correspondiera a esta rama: el resultado vigente del worktree está registrado como FAIL en el reporte local.

Impacto: bloquear montar el nuevo módulo sobre ese servicio legacy hasta revisar qué implementación debe conservarse. La demo de SP-001 es un proceso loopback separado, no importa la API antigua ni abre su DB, y tiene sus propios tests de aislamiento. Este hallazgo no es una nueva vulnerabilidad demostrada en producción.

Alternativas consideradas: corregir handlers/rebasar rama ahora ampliaría el alcance y afectaría trabajo ajeno; se descarta. Revisar la copia principal y registrar ambos baselines de forma separada permite entregar el prototipo sin ocultar la diferencia.

Responsable propuesto: Codex para comparar implementaciones; Roger/ingeniería para aprobar integración. Historia propuesta BG-036. Siguiente acción: refinamiento previo al siguiente sprint; no ejecutarla bajo la aprobación de SP-001.
