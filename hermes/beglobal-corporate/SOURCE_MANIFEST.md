# Manifiesto de fuentes — Be Global Corporate

## Índice operativo del perfil

Al instalar o actualizar el perfil, genera `workspace/knowledge/` con:

```bash
python3 scripts/build_corporate_knowledge.py --sync-profile "$HERMES_HOME"
```

El índice contiene `KNOWLEDGE_MAP.md`, `knowledge_graph.json`, `source_catalog.json` y `query_graph.py`. El grafo ayuda a encontrar evidencia, pero no sustituye la lectura de la fuente original.

## Fuentes canónicas del repositorio

### P1 — decisiones y acuerdos recientes

1. `beglobal/meetings/summary.md`
2. `beglobal/meetings/prompt.md`

### P2 — gobierno, método y límites

3. `hermes/beglobal-corporate/SOUL.md`
4. `hermes/beglobal-corporate/PERMISSIONS.md`
5. `hermes/beglobal-pro/skills/beglobal/beglobal-pro-guide/references/01_METODOLOGIA.md`
6. `hermes/beglobal-pro/skills/beglobal/beglobal-pro-guide/references/04_FAQ_GUARDRAILS.md`

### P3 — producto y arquitectura Commerce OS

7. `hermes/beglobal-pro/workspace/be-global-commerce-os/kb/01_master_brief.md`
8. `hermes/beglobal-pro/workspace/be-global-commerce-os/kb/08_mvp_pilot_charter.md`
9. `hermes/beglobal-pro/workspace/be-global-commerce-os/kb/09_risks_guardrails.md`
10. El resto de `hermes/beglobal-pro/workspace/be-global-commerce-os/kb/` y `expert-research/`, según la pregunta.

### P4 — evidencia y capacitación

11. `beglobal/meetings/Meeting Transcription (9).txt`
12. `raw/youtube/beglobalpro/graph_corpus/`
13. `graphify-out/graph.json`

### P5 — implementación

14. `beglobal/dashboard/`
15. `beglobal/miniapps/`
16. `scripts/`

## Precedencia

1. Decisión escrita y aprobada posterior.
2. Resumen y prompt de reunión actualizados.
3. Gobierno, metodología y guardrails versionados.
4. Arquitectura/KB de Commerce OS.
5. Transcripción y contenido educativo como evidencia histórica.
6. Implementación y código como estado técnico.
7. Inferencias del grafo, siempre etiquetadas como tales.

Si dos fuentes chocan, no combines silenciosamente: cita ambas, aplica precedencia y pide decisión humana cuando cambie precio, alcance, permisos, promesa comercial o metodología.
