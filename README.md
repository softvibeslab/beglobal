# BeGlobal Knowledge Base

> Contexto operativo: [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) · Wiki: [`docs/wiki/README.md`](docs/wiki/README.md)

Base de conocimiento creada desde el canal de YouTube de Be Global Pro y preparada con `graphify`.

## Archivos principales

- `raw/youtube/beglobalpro/`: ingesta completa del canal, un Markdown por video.
- `raw/youtube/beglobalpro/graph_corpus/`: corpus curado para graphify.
- `graphify-out/graph.html`: grafo interactivo.
- `graphify-out/graph.json`: grafo GraphRAG-ready.
- `graphify-out/GRAPH_REPORT.md`: reporte de comunidades, nodos centrales y preguntas sugeridas.
- `graphify-out/graph.graphml`: export para Gephi, yEd u otras herramientas GraphML.

## Comandos utiles

```bash
python3 scripts/ingest_beglobal_youtube.py
python3 scripts/build_beglobal_graph_corpus.py
$(cat .graphify_python) scripts/build_beglobal_graphify_outputs.py
graphify query "ticket promedio upsell cross sell valor anadido" --graph graphify-out/graph.json
```

## Nota de cobertura

Se inventariaron 270 videos. En esta corrida se capturaron 24 transcripts completos desde captions publicos; 246 videos quedaron con metadatos y URL porque YouTube no expuso transcript usable en esta sesion.
