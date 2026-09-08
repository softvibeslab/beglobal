# /vapi — sitio Be Global y asesor Vapi

Página estática. El iframe contiene `https://www.beglobalpro.org/`; el widget Vapi vive en la página contenedora y usa modo `hybrid` (voz y texto). Este chat es Vapi, conforme a la solicitud de esta página; no conecta con Hermes.

Publicar únicamente `index.html`, `styles.css`, `app.js` y `config.json` dentro de `public_html/vapi/`. No modificar la raíz ni las rutas piloto/trainning.

## Configuración pendiente

El usuario proporcionó `a464dffe-a513-4bf2-8cd6-abf250505ded` como "id de la conversación". Se conserva como candidato de Assistant ID, pero no se activa hasta confirmar que es un asistente y recibir una Public API Key. Un Call/Chat ID no permite iniciar nuevas conversaciones.

En `config.json`, introducir la clave **pública**, el Assistant ID confirmado y poner `assistantIdConfirmed: true`. Nunca incluir una clave privada. Limitar el uso de la clave al origen `https://beglobal.softvibes.pro` y al asistente mediante las restricciones que permita Vapi. Actualizar esta nota al completar la configuración.

Mientras falte configuración, la página muestra honestamente disponibilidad pendiente y no envía solicitudes Vapi. No hay respuestas simuladas, claves demo ni reapertura de conversaciones de otras personas.

## SDK y comprobación

SDK oficial fijado a `@vapi-ai/client-sdk-react@0.1.1`. Se verificaron `WidgetLoader`, modo `hybrid` y nombres de propiedades en los tipos/código del paquete publicado. Referencias: https://www.npmjs.com/package/@vapi-ai/client-sdk-react y https://docs.vapi.ai/chat/web-widget .

Probar escritorio y móvil, iframe real, enlaces externos, minimizar/restaurar, carga fallida de configuración/SDK, widget híbrido, envío de un mensaje real y llamada con micrófono. Las pruebas con configuración simulada solo acreditan renderizado; no acreditan una conexión real a Vapi. La app no inicia llamadas ni registra transcripciones por su cuenta; comprobar en Vapi el tratamiento de datos y grabación del asistente configurado.

Comprobar HTTP 200 y SHA-256 remoto contra cada archivo local. Antes de reemplazar una versión publicada, guardar copia verificable. El sitio externo puede cambiar su política de iframe; el enlace permanente permite abrirlo en otra pestaña sin eludir sus restricciones.
