# Áureo

Toolkit de proporción áurea y Fibonacci para sistemas de conocimiento guiados por agentes. Nació como proyecto alterno de Be Global, pero no depende de él: cualquier programa de mentoría, academia o base de conocimiento con agentes puede consumirlo.

Base teórica y advertencias: [`../docs/research/proporcion-aurea-beglobal.md`](../docs/research/proporcion-aurea-beglobal.md).

## Qué resuelve

| Problema | Regla Áureo | Función |
|---|---|---|
| El agente mezcla todo el programa con el estado del alumno | Contexto 62 % miembro / 38 % método | `context_budget` |
| Respuestas largas y sin siguiente paso | Regla 1-2-3-5 | `check_response` |
| Misiones de tamaño arbitrario | Tallas Fibonacci 1-2-3-5-8-13 | `to_fib_size`, `needs_split` |
| Primera misión demasiado grande | Espiral 1-1-2-3-5-8 | `mission_spiral` |
| Recordatorios que agobian o desaparecen | Cadencia 1-2-3-5-8-13 días | `reminder_schedule` |
| Grafo con comunidades gigantes | Ramificación 3-13 hijos | `branching_audit`, `scripts/audit_graph.py` |
| Ingesta sin prioridad | Presupuesto 62 % profundidad / 38 % amplitud | `ingestion_budget` |
| Parámetros de gamificación sin datos para A/B | Búsqueda por sección áurea | `golden_section_search`, `GoldenSearchState` |
| Sesiones sin ritmo | 62 % hacer / 38 % aprender | `session_split` |
| Fichas que son puro contexto | Proporción de palabras 62/38 | `word_ratio` |

## Estructura

```text
aureo/
  README.md              este archivo
  PLAN_BEGLOBAL.md       plan de aplicación a Be Global con fases, fechas y métricas
  BENEFICIOS.md          beneficios por perfil y por área del proyecto
  aureo.config.beglobal.json  parámetros vigentes para Be Global
  aureo/                 biblioteca Python (solo stdlib)
    __init__.py
    cli.py
  rules/                 texto listo para pegar en SOUL, fichas y revisiones
  scripts/audit_graph.py auditoría de ramificación sobre graphify-out/graph.json
  tests/                 pruebas unitarias
  out/                   salidas generadas (auditorías, reportes)
```

## Uso rápido

```bash
cd aureo
python3 -m unittest discover tests          # 12 pruebas (ejecutar siempre desde aureo/)
python3 -m aureo.cli session 13             # {"mision_min": 8, "leccion_min": 5}
python3 -m aureo.cli size 6.5               # 8
python3 -m aureo.cli reminders              # [1, 2, 3, 5, 8, 13]
python3 -m aureo.cli budget 40 4            # presupuesto de ingesta por ciclo
python3 -m aureo.cli search 100 500         # sondas del primer ciclo de búsqueda áurea
python3 scripts/audit_graph.py              # audita el grafo de Be Global
```

Desde Python:

```python
import aureo
aureo.context_budget(8000)             # {'estado_miembro': 4944, 'conocimiento': 3056}
aureo.check_response(actions=4, resources=2, next_steps=1)   # ['acciones=4, máximo 3']
st = aureo.GoldenSearchState(100, 500)
st.next_probes()                       # (252.8, 347.2)
st.update(f1=0.41, f2=0.47)            # estrecha el intervalo
```

## Principios de gobierno

1. Todas las reglas son heurísticas **INFERRED**. Se validan con datos del piloto o se retiran.
2. Áureo no decide dificultad de aprendizaje. La evidencia apunta a ~85 % de acierto, no a 62 %.
3. No se usa φ como argumento frente al miembro ni en marketing.
4. Donde la cardinalidad natural es otra (7 pasos del workflow, 10 etapas de ingesta), se respeta.

## Fuera de alcance

No es una biblioteca de retrieval ni de embeddings. No reemplaza Graphify, la API ni la gamificación existente; les da reglas de proporción y calibración.
