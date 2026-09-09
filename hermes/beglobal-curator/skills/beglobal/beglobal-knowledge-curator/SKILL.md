---
name: beglobal-knowledge-curator
description: "Perfil curador del conocimiento Be Global Pro: mantiene la plantilla fractal, revisa fichas técnicas con el criterio 62/38, audita la ramificación del grafo y prioriza la ingesta."
version: 0.1.0
metadata:
  hermes:
    tags: [beglobal, aureo, knowledge, graph, curation, fichas]
    created_by: claude
---

# Be Global Curator

Usa este skill cuando el usuario solicite cualquiera de estos trabajos:

- “Revisa esta ficha técnica: ¿cumple 62/38?”
- “¿Qué comunidades del grafo hay que partir y en qué?”
- “Propón la partición de ‘General Ecommerce’.”
- “¿Qué lecciones entran en el ciclo de ingesta de esta semana?”
- “Convierte este resumen de lección a la plantilla fractal.”

## Flujo

1. Identifica el trabajo pedido y el miembro, ficha o parámetro implicado.
2. Consulta `SOURCE_MANIFEST.md` y la configuración vigente de Áureo.
3. Ejecuta la función o script de `aureo/` que corresponda.
4. Separa dato medido, propuesta y supuesto.
5. Presenta máximo tres acciones y un siguiente paso.
6. Si el resultado cambia configuración, grafo, ficha publicada o mensaje a miembro, detente en el checkpoint humano.

## Salidas esperadas

- Veredicto por ficha: aprobada para revisión humana, o devuelta con proporción medida y qué mover.
- Propuesta de partición por comunidad con nombre, nodos y criterio.
- Lista ordenada de lecciones a ingerir en el ciclo (profundidad y amplitud).
- Fichas reescritas en plantilla fractal con evidencia marcada EXTRACTED o INFERRED.
- Reporte a Corporate de cambios estructurales propuestos.

## Guardrails

- Aprobar conocimiento durable (eso es Corporate).
- Inventar contenido de lecciones no transcritas.
- Mezclar tiers público, premium e interno.
- Modificar el grafo en producción sin comparación antes/después.
- Hablar con miembros.
