# Operación del control · fuente única y evidencia

## Archivos editables y derivados

- **Editar:** `backlog.json`, `sprints.json`, metodología, arranque y registros; conservar IDs y eventos previos.
- **Generar:** `BACKLOG.md`, `TABLERO.md`, `sprints/*/PLAN.md`, `qa/validation.json`.
- **No usar como autoridad:** la wiki comercial, un mockup, una salida del generador ni la ausencia de errores de validación.

Los valores comunes de responsable/estado de asignación y campos de evidencia vacíos están en `assignment_defaults` y `story_defaults`. Una historia puede sobrescribirlos explícitamente. No cambiar los defaults para fingir aceptación de todas las historias.

Desde la raíz del repo, sin dependencias adicionales ni servicios de red:

```sh
python3 SCRUM/tools/control.py --render
python3 SCRUM/tools/control.py --check
python3 -m unittest discover -s SCRUM/tools -p 'test_*.py' -v
```

`--render` hace una regeneración mecánica de vistas/reporte; no modifica las fuentes JSON, no registra aprobaciones y no inicia trabajo. `--check` es sólo lectura y debe fallar si las vistas están desactualizadas. Ambos devuelven salida no cero ante errores de integridad; “PASS” significa estructura consistente, no “puede empezar”.

## Preparar y aprobar un sprint

1. Leer estado Git, último registro, SPECs y contratos afectados. Resolver conflictos sin mover cambios ajenos. Fijar base y rutas exactas en el arranque.
2. Refinar historias e INVEST. Completar pruebas, tareas e insumos; usar datos sintéticos cuando ése sea el alcance aprobado.
3. Cambiar una historia a `ready` sólo con archivo de revisión DoR y evento. Registrar asignación confirmada únicamente cuando los responsables hayan sido acordados.
4. Completar respuestas reales de intake y fechas. Regenerar el plan y presentar su versión/huella definitiva. Si el usuario aprobó expresamente esas opciones y límites en su respuesta, conservar esa evidencia; cualquier cambio material posterior exige nueva aprobación.
5. Guardar el payload exacto de `planning_payload()` como baseline JSON dentro de `sprints/SP-XXX/baselines/`, sin secretos. Es una instantánea, no editarla después. Usar la misma serialización canónica del control para su huella.
6. Registrar aprobación con `approved_by`, `approved_at` ISO-8601 con zona, `source` (archivo local sanitizado que identifica el mensaje real), `plan_sha256` y `baseline` (ruta relativa a SCRUM). El hash identifica contenido; **no verifica la identidad del aprobador**.
7. Actualizar en una misma revisión consistente el sprint a `approved`, las historias a `committed`, las asignaciones a `confirmed` y sus eventos. Validar. Iniciar `active` sólo durante la ventana y con DoR realmente satisfecha; registrar la transición.

No rellenar estos campos para que “pase” la herramienta. El responsable debe contrastar evidencia, respuesta del usuario y plan.

## Ejecución de una historia

Mantener la asignación por historia: `assignment: {executor, product_reviewer, status: "confirmed"}`. El revisor independiente permanece nulo si no existe. Cada cambio de estado añade un evento a `history` con `at`, `from`, `to`, `evidence` y explicación; `evidence` apunta a un registro local dentro del repositorio relativo a SCRUM.

Agregar pruebas a `evidence` con estos campos:

```json
{
  "ac": "BG-XXX-AC1",
  "result": "PASS",
  "path": "sprints/SP-XXX/evidencias/EV-001.md",
  "revision": "commit o huella del diff evaluado",
  "environment": "local-fixture",
  "at": "fecha ISO-8601 real con zona horaria"
}
```

Es un formato, no evidencia real. Registrar `delivery_revision` en la historia; toda evidencia PASS vigente debe coincidir con esa versión. Adjuntar también `technical_review` con tipo de revisión y versión. Las tareas pueden finalizar técnicamente antes de aceptación de producto; una tarea `done` no da puntos de historia. Al pasar a `in_review`, todos los AC necesitan evidencia PASS y las tareas deben estar terminadas. Revalidar si cambia la implementación; conservar resultados fallidos anteriores identificando su versión.

Para `done`, registrar `acceptance: {by, at, source, revision}` con decisión real de Roger y la misma versión entregada. El validador comprueba presencia y consistencia básica, **no puede juzgar por sí solo si un PASS es genuino ni si la demo cumple el criterio**.

## Cambios, bloqueos y cierre

- Bloqueo: estado `blocked`, `blocker` con ruta al registro, dueño y alternativa. Continuar sólo historias independientes ya aprobadas. Si no las hay, pedir dirección con el impedimento concreto.
- Cambio de plan: registrar CR y el baseline anterior; volver a `proposed` durante la replanificación si hace falta y no ejecutar el delta. Guardar la aprobación anterior en `changes` con snapshot/fuente. Presentar versión/huella nueva, registrar aprobación y retomar sin borrar historia. No copiar la aprobación vieja a una huella nueva.
- Cierre: archivo de revisión/retro, aceptación de cada historia y carryover explícito. `review` del sprint apunta a ese documento; el cierre no exige fingir que todas las historias fueron aceptadas.
- Cancelación: sólo registrar por decisión real del PO, con motivo, inventario y trabajo pendiente.
- Próximo sprint: nuevo ID, intake propio y aprobación vacía. Mantener IDs de historias arrastradas y sus eventos, anotar a qué versión/sprint pertenecen las evidencias.

El validador admite historial de sprints cerrados contra su snapshot original, pero no permite seleccionar una historia en dos sprints abiertos a la vez. Las modificaciones posteriores al backlog no reescriben el compromiso archivado. El responsable revisa manualmente que el carryover no reciba puntos dos veces.

## Controles y límites de la automatización

Comprueba IDs, ACs, tamaños, gates, enlaces, cobertura R-01…R-29, ciclos, sobre de capacidad, fuentes de Ready/aprobación, snapshot/huella, estado, evidencia por criterio, aceptación y vistas actualizadas. No contacta GitHub, Hostinger, Telegram ni BeGlobal.

Quedan controles humanos/técnicos: autenticidad de aprobación, calidad de pruebas, seguridad del diff, compatibilidad real, semántica de decisiones, disponibilidad de personas, cumplimiento del timebox y criterio de aceptación. Un archivo con nombre “evidencia” no sustituye esos controles.

Las plantillas de la skill `agile-product-owner` se reutilizaron para narrativa, criterios, INVEST y planificación. No se adoptó automáticamente su generador de prioridades/INVEST: sus supuestos genéricos no acreditan independencia ni disponibilidad real en BeGlobal. El orden del sprint respeta dependencias explícitas y el margen ≤85%.
