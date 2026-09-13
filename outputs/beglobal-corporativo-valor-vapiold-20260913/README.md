# BeGlobal · Más valor en cada conversación · v3

Edición solicitada por Roger: destino `https://beglobal.softvibes.pro/vapiold/` y una interpretación más inspiradora, cálida y entusiasta, sin exagerar. Se conservan el guion, las escenas, el branding y la duración de la versión aprobada. La edición anterior no se modifica.

## Entrega

- [Reproductor HTML](site/index.html): capítulos, descargas y enlace al agente.
- [Video subtitulado](site/media/03-comercial-corporativo-valor-v3-subtitulado.mp4).
- [Video con imagen limpia](site/media/03-comercial-corporativo-valor-v3.mp4).
- [Guion y storyboard](site/downloads/GUION-Y-STORYBOARD.md).
- [Paquete completo ZIP](BeGlobal-Comercial-Corporativo-Vapiold-v3.zip): sitio de revisión, sin registros privados ni credenciales.

## Dirección de voz

Se mantiene Chris G1 de ElevenLabs (`re0pzsXzyvweLpAwMscE`) y `eleven_multilingual_v2`. Estabilidad 0.63 → 0.48, estilo 0.12 → 0.24 y similitud 0.85. Se amplía moderadamente la expresividad sin una configuración extrema. Son ajustes de dirección, no una garantía de interpretación: Roger debe escuchar la locución para juzgar emoción y naturalidad.

Velocidad solicitada 1.1× aplicada una sola vez en la generación. Sin acelerar después y sin cambiar el reproductor a 1.1×; reproducir a 1×. La marca “Be Global” conserva el fragmento inglés de la misma voz. El resto permanece en español. Guion aprobado intacto: 1119 caracteres, una sola generación de voz, sin generaciones pagadas Comfy.

El montaje conserva 82 segundos y resincroniza escenas y subtítulos con las nuevas marcas de tiempo. No se promete que los agentes ya tengan funciones operativas ni resultados comprobados.

## Abrir la entrega desde GitHub

Descarga y descomprime el ZIP; abre `site/index.html`. GitHub muestra el código HTML, no lo ejecuta como una página web. También puedes clonar la rama y, desde esta carpeta, ejecutar `node serve-local.cjs` para ver `http://127.0.0.1:8914/`. No se requiere una API key ni una conexión a ElevenLabs para reproducir los videos.

## Alcance del commit

Se versionan únicamente el sitio autocontenido, los medios finales, el ZIP, este documento, el servidor local y los informes públicos seleccionados de `qc/`. La lista permitida de `.gitignore` excluye por defecto el resto de la producción.

Los scripts de generación, stems, alineaciones, registros de consumo, recibos, IDs de solicitud y archivos específicos de la máquina se conservan solo en el espacio local. No se necesitan para abrir la entrega. La reconstrucción de la producción completa requiere esos recursos locales y no se ofrece como parte de este paquete público.

Versionar esta entrega en GitHub no la despliega en Hostinger ni reemplaza videos anteriores. `demo-video` mantuvo la continuidad visual y sincronizó la narración; `playwright-pro` comprobó variantes, capítulos, enlace y descargas.

## Referencias técnicas

- [Ajustes de voz, estabilidad, estilo y velocidad — ElevenLabs](https://elevenlabs.io/docs/api-reference/voices/settings/get?explorer=true).
- [Síntesis con marcas de tiempo — ElevenLabs](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps).

La revisión técnica de niveles y duración no equivale a escuchar el audio. La aprobación auditiva de Roger queda pendiente.
