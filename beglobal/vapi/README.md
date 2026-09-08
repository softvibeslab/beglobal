# /vapi — sitio Be Global y asesor Vapi

Página estática. El iframe contiene `https://www.beglobalpro.org/`; el widget Vapi vive en la página contenedora y usa modo `hybrid` (voz y texto). Este chat es Vapi, conforme a la solicitud de esta página; no conecta con Hermes.

Publicar `index.html`, `styles.css`, `app.js`, `config.json`, `logo-beglobal.png` y su manifiesto `SHA256SUMS` dentro de `public_html/vapi/`. No modificar la raíz ni las rutas piloto/trainning.

## Branding

Logo oficial descargado sin modificaciones de https://www.beglobalpro.org/static/media/logo-bgp.b0e63402045ffa3af6cf.png . Azul principal `#062F55`, verificado en el estilo de los botones del sitio oficial. Encabezado y tarjeta utilizan el logo; controles Vapi, acentos y fondos usan la paleta azul. La actualización de branding tiene respaldo y despliegue limitado mediante `scripts/brand_beglobal_vapi.sh`.

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

## Accesos rápidos

Diagnóstico gratis, membresías, próximos webinars y primeros pasos aparecen en la tarjeta inicial y junto al campo del chat. Abren el widget y preparan un borrador, sin enviar solicitudes ni iniciar llamadas. Conservan el texto previo y no repiten el mismo mensaje cuando ya está incluido. Los controles permanecen desactivados si falta la configuración y se ocultan durante voz o al cerrar el panel.

El SDK 0.1.1 no expone métodos públicos para abrir y editar borradores. El adaptador de `app.js` usa el lanzador y el input del SDK fijado, actualiza el estado React mediante el setter nativo y conserva la barra fuera de su árbol DOM. Al actualizar el SDK, volver a verificar apertura, edición del borrador, envío manual, cierre y móvil.

Validación de esta entrega: cuatro accesos, conservación del borrador, ausencia de envío automático, texto correcto al enviar (red Vapi interceptada), escritorio/móvil y ausencia de errores JS. Esta comprobación no cambia ni vuelve a verificar el estado de facturación de Vapi.
