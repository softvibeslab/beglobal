# Entrega de videos de producto por Telegram

Uso: cuando Roger/alumno pida un MP4 listo para publicar y luego diga que no lo ve, no lo puede bajar o está en computadora.

## Diagnóstico rápido

- Si el usuario envió videos como plantilla, Telegram puede haberlos cacheado aunque el modelo no haya recibido análisis visual completo. Distingue: recepción/caché del archivo vs. análisis model-visible.
- Si el agente generó un MP4 pero Telegram no lo muestra, revisa si el archivo está en una ruta segura para MEDIA. Las rutas bajo `workspace/` dentro de `/root` pueden ser bloqueadas por el gateway como `Skipping unsafe MEDIA directive path outside allowed roots`.

## Patrón de entrega correcto

1. Genera y verifica el MP4: duración, tamaño y que `ffprobe` no falle.
2. Copia el MP4 final a una raíz segura de envío, preferentemente:
   - `/root/.hermes/profiles/beglobal-pro/cache/videos/<nombre>.mp4`
3. Si el usuario está en computadora o Telegram Desktop no lo muestra, crea también ZIP y colócalo en:
   - `/root/.hermes/profiles/beglobal-pro/cache/documents/<nombre>.zip`
4. Antes de responder, valida que la ruta sea aceptada por el gateway si tienes acceso a Hermes internals:
   - `from gateway.platforms.base import validate_media_delivery_path`
   - `bool(validate_media_delivery_path('/ruta/al/archivo'))`
5. Entrega con `MEDIA:/ruta/segura.mp4` y, si aplica, `MEDIA:/ruta/segura.zip`.

## Respuesta corta sugerida

“Te lo mando como archivo descargable. Si estás en compu: clic derecho → Guardar como. Si no aparece, usa el ZIP.”

Evita decir que es un “link público” si no fue subido a Drive/S3/CDN; en Telegram es un adjunto descargable, no una URL pública permanente.
