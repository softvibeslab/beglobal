# /vapi — sitio Be Global y asesor Vapi

Página estática. El iframe contiene `https://www.beglobalpro.org/`; el widget Vapi vive en la página contenedora y usa modo `hybrid` (voz y texto). Este chat es Vapi, conforme a la solicitud de esta página; no conecta con Hermes.

Publicar únicamente `index.html`, `styles.css`, `app.js` y `config.json` dentro de `public_html/vapi/`. No modificar la raíz ni las rutas piloto/trainning.

## Configuración y verificación

El ID `a464dffe-a513-4bf2-8cd6-abf250505ded` fue confirmado como Assistant ID mediante una llamada web real con la clave pública proporcionada por el propietario. Vapi respondió HTTP 201, devolvió ese assistantId y el widget llegó al estado de asistente hablando. La prueba utilizó un dispositivo de audio sintético y cerró la conexión; no acredita una evaluación auditiva de la calidad de voz.

`config.json` contiene la clave **pública** y el Assistant ID confirmado. Nunca incluir una clave privada. Limitar el uso de la clave al origen `https://beglobal.softvibes.pro` y al asistente mediante las restricciones que permita Vapi.

La prueba de texto llegó a `/chat/web`, pero Vapi devolvió dentro del stream: "Add a payment method to use chat. Pay-as-you-go orgs require a card on file." El propietario debe configurar la facturación en Vapi; después se necesita repetir la prueba de texto. Una respuesta HTTP 201 del stream por sí sola no acredita éxito del chat.

Activación publicada con `scripts/activate_beglobal_vapi.sh`: descarga configuración y manifiesto desde un commit fijo, valida hashes, respalda la versión previa fuera de public_html y reemplaza únicamente esos dos archivos. La tarea temporal de hosting debe retirarse después de verificar el resultado.

Mientras falte configuración, la página muestra honestamente disponibilidad pendiente y no envía solicitudes Vapi. No hay respuestas simuladas, claves demo ni reapertura de conversaciones de otras personas.

## SDK y comprobación

SDK oficial fijado a `@vapi-ai/client-sdk-react@0.1.1`. Se verificaron `WidgetLoader`, modo `hybrid` y nombres de propiedades en los tipos/código del paquete publicado. Referencias: https://www.npmjs.com/package/@vapi-ai/client-sdk-react y https://docs.vapi.ai/chat/web-widget .

Probar escritorio y móvil, iframe real, enlaces externos, minimizar/restaurar, carga fallida de configuración/SDK, widget híbrido, envío de un mensaje real y llamada con micrófono. Las pruebas con configuración simulada solo acreditan renderizado; no acreditan una conexión real a Vapi. La app no inicia llamadas ni registra transcripciones por su cuenta; comprobar en Vapi el tratamiento de datos y grabación del asistente configurado.

Comprobar HTTP 200 y SHA-256 remoto contra cada archivo local. Antes de reemplazar una versión publicada, guardar copia verificable. El sitio externo puede cambiar su política de iframe; el enlace permanente permite abrirlo en otra pestaña sin eludir sus restricciones.
