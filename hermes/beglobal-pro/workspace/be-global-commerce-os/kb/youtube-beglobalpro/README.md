# Base de conocimiento YouTube Be Global Pro

Generado: 2026-05-24 23:33

## Objetivo

Crear una KB/grafo de los videos de YouTube de **@beglobalpro** para que el Agente Guía recomiende el video correcto según la fase, bloqueo o intención del alumno.

## Archivos

- `video_index.jsonl`: índice principal, 1 video/short por línea.
- `video_index.csv`: versión editable en spreadsheet.
- `video_graph.json`: grafo ligero video → fase → intención.
- `scripts/recommend.py`: recomendador local por texto del alumno.

## Cobertura inicial

- Videos largos: 270
- Shorts: 212
- Total piezas indexadas: 482

## Fases usadas

1. `F1_entender_modelo` — empezar desde cero / modelo ecommerce.
2. `F2_producto_nicho` — producto, nicho, tendencia, margen.
3. `F3_proveedor_margen` — proveedores, importación, inventario.
4. `F4_tienda_canal` — Shopify, Mercado Libre, Amazon, pagos, catálogo.
5. `F5_contenido_lanzamiento` — redes, reels, IA, Canva, lanzamiento.
6. `F6_ventas_cierre` — confianza, oferta, ticket, cierre.
7. `F7_ads_tracking` — Meta Ads, pixel, campañas.
8. `F8_optimizacion_escala` — optimización, temporada, escala.
9. `F0_mentalidad` — miedo, acción, bloqueo mental.

## Uso rápido

```bash
python kb/youtube-beglobalpro/scripts/recommend.py "quiero subir productos a Mercado Libre"
python kb/youtube-beglobalpro/scripts/recommend.py "me da miedo grabarme para redes"
python kb/youtube-beglobalpro/scripts/recommend.py "necesito configurar Shopify y pagos"
```

## Siguiente mejora necesaria

Este índice inicial está clasificado por título/metadata. Para hacerlo más poderoso:

1. Descargar transcripciones de los videos que tengan subtítulos.
2. Resumir cada video en: problema, fase, conceptos, tareas, timestamps.
3. Crear embeddings o grafo semántico video → tema → fase → pregunta frecuente.
4. Conectar el recomendador al Agente Guía para responder:
   - diagnóstico del usuario,
   - explicación corta,
   - video recomendado,
   - tarea concreta después de verlo.

## Regla conversacional obligatoria

No mandar 10 videos. Recomendar máximo 1–2.

Cuando el alumno pregunte por cualquiera de estos temas —dropshipping Be Global, Mercado Libre, Shopify, canales de venta, contabilidad ecommerce, reels/publicaciones o ventas de temporada— el Agente Guía debe recomendar primero el video más relevante de esta KB, pedir que lo vea/aplique y después ponerse en modo espera hasta que regrese con captura, link, duda concreta o feedback.

> Por lo que me dices, estás en fase [fase]. Mira primero este video: [título]. Te va a servir para [beneficio]. Después haz [tarea concreta] y mándame [evidencia].

## Actualización manual Roger GV — 2026-05-25

Se agregaron 7 videos clave con abstract, summary, link, fase e intención al índice principal y al grafo ligero:

1. Cómo funciona el dropshipping en Be Global Pro
2. Cómo subir productos de Be Global Pro en Mercado Libre
3. Cómo funciona Shopify (guía para principiantes)
4. Canales de venta en ecommerce
5. Contabilidad en tu ecommerce
6. Estructura de reels y publicaciones
7. Maximiza tus ventas de temporada

Fuente editable: `manual_roger_gv_core_videos.md`.

