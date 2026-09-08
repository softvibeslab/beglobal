# Mapa de conocimiento corporativo Be Global

Esta base federa el grafo de Commerce OS, el grafo de YouTube y las fuentes propias del proyecto. No sustituye la fuente: cada respuesta sensible debe citar `source_file` y respetar precedencia.

## Cobertura

- 986 nodos
- 2344 relaciones
- 9 hiperrelaciones
- 250 fuentes catalogadas con SHA-256

## Dominios

- `commerce-os`: 65 fuentes
- `decisiones-y-reuniones`: 4 fuentes
- `gobernanza-corporativa`: 21 fuentes
- `metodologia-operativa`: 34 fuentes
- `producto-y-aplicaciones`: 27 fuentes
- `proyecto`: 72 fuentes
- `youtube-y-capacitacion`: 27 fuentes

## Fuentes canónicas y precedencia

- P1 `beglobal/meetings/summary.md`
- P1 `beglobal/meetings/prompt.md`
- P2 `hermes/beglobal-corporate/SOUL.md`
- P2 `hermes/beglobal-corporate/PERMISSIONS.md`
- P2 `hermes/beglobal-pro/skills/beglobal/beglobal-pro-guide/references/01_METODOLOGIA.md`
- P2 `hermes/beglobal-pro/skills/beglobal/beglobal-pro-guide/references/04_FAQ_GUARDRAILS.md`
- P3 `hermes/beglobal-pro/workspace/be-global-commerce-os/kb/01_master_brief.md`
- P3 `hermes/beglobal-pro/workspace/be-global-commerce-os/kb/08_mvp_pilot_charter.md`
- P3 `hermes/beglobal-pro/workspace/be-global-commerce-os/kb/09_risks_guardrails.md`
- P4 `beglobal/meetings/Meeting Transcription (9).txt`

## Protocolo de consulta

1. Para gobierno, método, precio, permisos, riesgo o piloto: consulta primero las fuentes P1–P2.
2. Para arquitectura, CRM, agentes, marketplace o operación: consulta Commerce OS P3.
3. Para capacitación o evidencia histórica: consulta YouTube/transcripciones P4 y etiqueta inferencias.
4. Cita siempre el `source_file`; no presentes una relación `INFERRED` como hecho aprobado.
5. Si las fuentes chocan, gana la de menor número de prioridad y, dentro del mismo nivel, la decisión aprobada más reciente.

## Archivos

- `knowledge_graph.json`: grafo federado completo.
- `source_catalog.json`: inventario, dominio, prioridad y hash de cada fuente.
- `query_graph.py`: búsqueda local determinista del grafo.
