# QA del control Scrum

Estas pruebas validan la integridad de planificación y registros, **no el producto BeGlobal ni la aprobación de Roger**.

Baseline de preparación, 13/09/2026: 885 comprobaciones y 24 pruebas PASS; entonces había 35 historias y ningún sprint aprobado. **Estado vigente:** SP-001 aprobado y en revisión, 36 historias en backlog (BG-036 agregado), cinco historias en revisión y cero aceptadas. Consultar `validation.json` para el conteo actual. La suite del control usa aprobaciones sintéticas sólo en memoria; la aprobación real del sprint está registrada por separado.

Comandos y formato de evidencia en [OPERACION](../OPERACION.md). Resultado estructural reproducible en [validation.json](validation.json). Suite de regresión en [test_control.py](../tools/test_control.py).

La suite incluye intentos de iniciar sin aprobación, marcar Done sin aceptación/evidencia, dependencias inválidas/cíclicas, criterios incompletos, IDs duplicados, capacidad excedida, huella alterada y regeneración no mutante. Los tests restablecen el estado de propuesta únicamente en memoria para probar invariantes, sin cambiar el estado real del proyecto.

Resultado del incremento local y límite global: [revisión SP-001](../sprints/SP-001/REVISION.md). El control consistente no convierte el FAIL de la base legacy en PASS, ni concede aceptación al producto.

No se simulan resultados de integración ni pruebas de carga. El puente existente conserva su propia [suite y limitaciones](../../beglobal/membership-bridge/README.md). SPECS tiene su [QA documental separado](../../SPECS/qa/README.md).
