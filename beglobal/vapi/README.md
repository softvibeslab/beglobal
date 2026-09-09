# /vapi — Be Global Asistente

Página estática dedicada al asistente. Presenta una jerarquía única y responsive, sin embeber el sitio corporativo como fondo. El chat escrito se abre en un diálogo con `https://chatbeglobal.softvibes.pro/asistente/`, conectado al perfil Hermes aislado `beglobalasistente`; el widget Vapi conserva su Assistant ID y clave pública y se presenta exclusivamente en modo `voice`. Las conversaciones de voz y texto son independientes.

Publicar `index.html`, `assistant-v6.css`, `app.js`, `config.json`, `logo-beglobal.png` y su manifiesto `SHA256SUMS` dentro de `public_html/vapi/`. No modificar la raíz ni las rutas piloto/trainning.

## Branding

Logo oficial descargado sin modificaciones de https://www.beglobalpro.org/static/media/logo-bgp.b0e63402045ffa3af6cf.png . Azul principal `#062F55`, verificado en el estilo de los botones del sitio oficial. Encabezado y tarjeta utilizan el logo; controles Vapi, acentos y fondos usan la paleta azul. La actualización de branding tiene respaldo y despliegue limitado mediante `scripts/brand_beglobal_vapi.sh`.

## Configuración y verificación

El ID `a464dffe-a513-4bf2-8cd6-abf250505ded` fue confirmado como Assistant ID mediante una llamada web real con la clave pública proporcionada por el propietario. Vapi respondió HTTP 201, devolvió ese assistantId y el widget llegó al estado de asistente hablando. La prueba utilizó un dispositivo de audio sintético y cerró la conexión; no acredita una evaluación auditiva de la calidad de voz.

`config.json` contiene la clave **pública** y el Assistant ID confirmado. Nunca incluir una clave privada. Limitar el uso de la clave al origen `https://beglobal.softvibes.pro` y al asistente mediante las restricciones que permita Vapi.

La prueba de texto llegó a `/chat/web`, pero Vapi devolvió dentro del stream: "Add a payment method to use chat. Pay-as-you-go orgs require a card on file." El propietario debe configurar la facturación en Vapi; después se necesita repetir la prueba de texto. Una respuesta HTTP 201 del stream por sí sola no acredita éxito del chat.

Activación publicada con `scripts/activate_beglobal_vapi.sh`: descarga configuración y manifiesto desde un commit fijo, valida hashes, respalda la versión previa fuera de public_html y reemplaza únicamente esos dos archivos. La tarea temporal de hosting debe retirarse después de verificar el resultado.

Mientras falte configuración, la página muestra honestamente disponibilidad pendiente y no envía solicitudes Vapi. No hay respuestas simuladas, claves demo ni reapertura de conversaciones de otras personas.

## SDK y comprobación

SDK oficial fijado a `@vapi-ai/client-sdk-react@0.1.1`. El Assistant ID y la clave pública permanecen iguales; solo la propiedad de presentación cambia a modo `voice`. El chat Vapi no se usa ni se modifica como backend del canal escrito. Referencias: https://www.npmjs.com/package/@vapi-ai/client-sdk-react y https://docs.vapi.ai/chat/web-widget .

Probar escritorio y móvil, enlaces externos, apertura/cierre del diálogo, carga fallida de configuración/SDK, launcher Vapi de voz, chat Hermes escrito y llamada con micrófono. El launcher usa el tamaño oficial `tiny` del SDK para no cubrir contenido; `app.js` añade nombre accesible, foco y activación por teclado al `div` interactivo del SDK. El bundle fijado usa SRI SHA-384 y CORS anónimo. Las pruebas con configuración simulada solo acreditan renderizado; no acreditan una conexión real a Vapi. La app no inicia llamadas ni registra transcripciones por su cuenta; comprobar en Vapi el tratamiento de datos y grabación del asistente configurado.

Comprobar HTTP 200 y SHA-256 remoto contra cada archivo local. Antes de reemplazar una versión publicada, guardar copia verificable. Los enlaces permanentes permiten abrir el sitio oficial y membresías en otra pestaña.

## Accesos rápidos

Diagnóstico inicial, membresías, próximos webinars y primeros pasos aparecen como tarjetas en la página. Abren el diálogo de Hermes y preparan un borrador sin enviarlo. El canal escrito continúa disponible aunque falle la configuración o carga de Vapi.

El SDK 0.1.1 no expone un control propio accesible para el launcher: renderiza un `div` interactivo. El adaptador añade semántica y teclado sin alterar el inicio de llamada. Al actualizar el SDK, volver a verificar el selector DOM, foco, Enter/Espacio, apertura, cierre y móvil.

Validación de esta entrega: cuatro accesos rápidos, ausencia de envío automático, escritorio 1440 × 1000, móvil 390 × 844, cero desbordamiento horizontal, diálogo responsive con fondo inerte y focus trap, launcher oficial `tiny` y semántica accesible. La restricción CSP del chat impide probar su iframe desde localhost; debe comprobarse nuevamente en el origen permitido de producción. Esta comprobación no cambia ni vuelve a verificar el estado de facturación de Vapi.
