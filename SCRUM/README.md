# BeGlobal · Control de producto y sprints

Versión 0.1.0 · 15/09/2026 · **SP-001 y SP-002 cerrados en control.** Prototipo local. Producción NEEDS WORK. [Cierre SP-001](sprints/SP-001/CIERRE.md) · [Cierre SP-002](sprints/SP-002/CIERRE.md).

Acuerdo propuesto: Roger aporta decisiones e insumos y aprueba un paquete cerrado de sprint. Codex ejecuta ese alcance, mantiene el registro y entrega una demo con pruebas. No se vuelve a pedir permiso para cada paso ordinario, pero tampoco se interpreta una aprobación como permiso ilimitado.

## Centro de control

| Consulta | Documento |
|---|---|
| Cómo trabajamos, responsabilidades y límites | [Metodología](METODOLOGIA.md) |
| Historias, puntos, responsables y criterios | [Backlog generado](BACKLOG.md) |
| Estado por columnas y sprint | [Tablero generado](TABLERO.md) |
| Aprobación e insumos del sprint | [Arranque resuelto](sprints/SP-001/ARRANQUE.md) |
| Cierre y handoff | [Cierre SP-001](sprints/SP-001/CIERRE.md) · [Cierre SP-002](sprints/SP-002/CIERRE.md) · [Handoff SP-002](sprints/SP-002/HANDOFF.md) |
| Objetivo, entrega y exclusiones del primer sprint | [Plan SP-001](sprints/SP-001/PLAN.md) |
| Preparación realizada frente a pendientes | [Sprint 0 — preparación](sprints/SP-000/PREPARACION.md) |
| Decisiones, bloqueos y cambios | [Registro](REGISTRO.md) |
| Orden de los siguientes incrementos | [Roadmap sin compromisos de fecha](ROADMAP.md) |
| Cómo registrar trabajo y verificar consistencia | [Operación del control](OPERACION.md) |
| Plantillas reutilizables | [Plantillas](plantillas/README.md) |
| Resultado de las comprobaciones | [QA](qa/README.md) |

## Flujo acordable

`Preparar insumos → revisar Ready → aprobar versión → ejecutar y registrar → demo/pruebas → aceptar o devolver → retrospectiva → siguiente sprint`

La fuente de estado es [backlog.json](backlog.json), junto con [el registro de sprints](sprints.json). Los Markdown del tablero, backlog y plan se generan desde esos archivos; no mantener dos estados manuales. Los SPECS siguen siendo la fuente de requisitos y arquitectura; este control organiza su ejecución.

**Hoy:** SP-001 y SP-002 cerrados. HMAC/initData de fixture aceptado (BG-006). Producción NEEDS WORK.

**Próximo paso:** si quieres otro incremento, hay que aprobar SP-003 (p. ej. BG-007 linking). Sin eso no arranco bot real ni Hostinger.

Control canónico de la entrega: esta carpeta en el repo principal `BeGlobal`. El worktree `BeGlobal-SP-001` conserva la copia de ejecución de SPEC_AGENTS; al entregar se sincronizan control, código nuevo y evidencia, sin mover cambios ajenos. No editar ambas copias independientemente ni confundir baselines de ramas.

No se publica este control interno en la wiki, GitHub ni Hostinger automáticamente. No contiene credenciales, datos de miembros ni permisos de despliegue.
