# 08 — YouTube Video KB Recommender

## Cuándo usar

Usar cuando el alumno pregunte qué clase/video ver, esté atorado en una fase, pida guía paso a paso, o cuando el Agente Guía quiera complementar una respuesta con un recurso de Be Global Pro.

## Base creada

Workspace:

`/root/.hermes/profiles/beglobal-pro/workspace/be-global-commerce-os/kb/youtube-beglobalpro/`

Archivos principales:

- `video_index.jsonl` — índice principal, una pieza por línea.
- `video_index.csv` — versión editable.
- `video_graph.json` — grafo ligero: video/short → fase → intención.
- `playlist_capacitaciones_expertos.md` — playlist `Capacitaciones en vivo de expertos` indexada con link, resumen, propósito, fase, intención, cuándo recomendar y tarea posterior.
- `playlist_capacitaciones_expertos.jsonl` / `.csv` — versiones estructuradas/editables de esa playlist.
- `manual_roger_gv_core_videos.md` — lista manual agregada por Roger GV con 7 recursos principales: dropshipping Be Global Pro, Mercado Libre, Shopify, canales de venta, contabilidad ecommerce, reels/publicaciones y ventas de temporada. Estos videos también están integrados en `video_index.jsonl`, `video_index.csv`, `video_graph.json` y `graphify-out/graph.json`.
- Skill helper: `scripts/index_youtube_playlist.py` — script reutilizable para indexar una playlist pública con `yt-dlp --flat-playlist`, generar `.md/.jsonl/.csv`, excluir privados/no disponibles y dejar `transcript_status=blocked_or_pending` cuando aún no hay transcripción.
- `scripts/recommend.py` — recomendador local por frase del alumno; ahora muestra resumen, propósito y tarea posterior cuando existen.

Cobertura inicial creada desde metadata pública:

- 270 videos largos.
- 212 Shorts.
- 482 piezas totales.

## Fases del recomendador

- `F1_entender_modelo` — ecommerce/dropshipping desde cero.
- `F2_producto_nicho` — producto, nicho, tendencia, margen.
- `F3_proveedor_margen` — proveedor, importación, inventario.
- `F4_tienda_canal` — Shopify, Mercado Libre, Amazon, pasarelas, catálogo.
- `F5_contenido_lanzamiento` — redes, reels, IA, Canva, contenido.
- `F6_ventas_cierre` — confianza, oferta, ticket, cliente, cierre.
- `F7_ads_tracking` — Meta Ads, pixel, campañas.
- `F8_optimizacion_escala` — optimización, temporada, escala.
- `F0_mentalidad` — miedo, acción, grabarse, bloqueo mental.

## Uso rápido

Desde el workspace Commerce OS:

```bash
python kb/youtube-beglobalpro/scripts/recommend.py "quiero subir productos a Mercado Libre"
python kb/youtube-beglobalpro/scripts/recommend.py "me da miedo grabarme para redes"
python kb/youtube-beglobalpro/scripts/recommend.py "necesito configurar Shopify y pagos"
```

Para indexar una nueva playlist pública o regenerar la base de esta clase:

```bash
python /root/.hermes/profiles/beglobal-pro/skills/beglobal/beglobal-pro-guide/scripts/index_youtube_playlist.py \
  "https://www.youtube.com/watch?v=f5lKVWyaQZw&list=PLB2yHEZRRHUbcs8oYALuFlXlpe8HCgA7n" \
  /root/.hermes/profiles/beglobal-pro/workspace/be-global-commerce-os/kb/youtube-beglobalpro
```

Si la transcripción no está disponible todavía, no detener el trabajo: crear índice por metadata/títulos, marcar `transcript_status=blocked_or_pending`, y enriquecer después con transcripciones/timestamps cuando el equipo las aporte.

## Directriz obligatoria para el Agente Guía

Cuando el usuario/alumno pregunte sobre un tema que tenga relación con algún video registrado en la KB de YouTube Be Global Pro, el agente debe compartir el link del video más relevante y sugerir que lo vea antes de continuar. Esto aplica especialmente a los 7 temas base de Roger GV: dropshipping Be Global, Mercado Libre, Shopify, canales de venta, contabilidad ecommerce, reels/publicaciones y ventas de temporada. Después debe ponerse en modo espera: pedir que el usuario regrese con captura, link, duda concreta o feedback de lo aplicado.

No recomendar una lista larga. Máximo 1–2 videos.

Formato sugerido:

> Por lo que me dices, estás en fase de [fase]. Mira primero este video: [título]. Te va a servir para [beneficio concreto]. Después haz [tarea concreta] y mándame [evidencia].

Después de enviar el video, el agente debe ponerse en **modo espera**: no seguir con más teoría hasta que el alumno regrese con captura, link, duda concreta o feedback de lo que aplicó.

## Próxima mejora

El índice inicial usa títulos/metadata. Para mayor precisión, completar fichas por video con transcripción, resumen, problema que resuelve, timestamps, tarea posterior y casos donde NO conviene recomendarlo.
