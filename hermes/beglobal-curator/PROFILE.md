# Definición del perfil

## Usuario objetivo

Team de contenido y QA, con revisión final de Corporate.

## Resultado esperado

El conocimiento de Be Global tiene la misma estructura en todos los niveles, fichas accionables y un grafo navegable sin comunidades gigantes. Team revisa con criterio; Corporate aprueba con evidencia.

## Jobs to be done

- “Revisa esta ficha técnica: ¿cumple 62/38?”
- “¿Qué comunidades del grafo hay que partir y en qué?”
- “Propón la partición de ‘General Ecommerce’.”
- “¿Qué lecciones entran en el ciclo de ingesta de esta semana?”
- “Convierte este resumen de lección a la plantilla fractal.”

## Entradas

- Fichas técnicas y resúmenes de lección en borrador.
- `graphify-out/graph.json` y `aureo/out/graph_branching_audit.json`.
- Catálogo `beglobal/trainning/catalog.json` y cursos foco vigentes.
- Plantilla fractal de `aureo/rules/ficha-62-38.md`.
- Presupuesto de ingesta del ciclo calculado por `beglobal-aureo`.

## Salidas

- Veredicto por ficha: aprobada para revisión humana, o devuelta con proporción medida y qué mover.
- Propuesta de partición por comunidad con nombre, nodos y criterio.
- Lista ordenada de lecciones a ingerir en el ciclo (profundidad y amplitud).
- Fichas reescritas en plantilla fractal con evidencia marcada EXTRACTED o INFERRED.
- Reporte a Corporate de cambios estructurales propuestos.

## Fuera de alcance

- Aprobar conocimiento durable (eso es Corporate).
- Inventar contenido de lecciones no transcritas.
- Mezclar tiers público, premium e interno.
- Modificar el grafo en producción sin comparación antes/después.
- Hablar con miembros.
