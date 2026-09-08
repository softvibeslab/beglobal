# Requisitos para integrar Vapi

Para que Orchestrator integre el widget de voz en una página/iframe, necesito del agente creado en Vapi:

## Necesario para frontend

1. **Snippet oficial del widget de Vapi**
   - El bloque `<script>` o configuración que Vapi entrega para insertar en una web.
   - Debe ser el snippet público, no la API key privada.

2. **Assistant ID**
   - ID del assistant/agente de voz.

3. **Public key / widget public key**
   - Clave pública del widget si Vapi la requiere.
   - No enviar private API key si solo se va a embeber el widget.

4. **Nombre visible del agente**
   - Sugerido: “Asesor Be Global Pro”.

5. **Primer mensaje**
   - Sugerido:
   “Hola, soy el asesor de Be Global Pro. Puedo responder tus dudas y hacerte un diagnóstico gratis para saber cuál sería tu siguiente paso en ecommerce. ¿Ya vendes por internet o apenas quieres empezar?”

6. **Dominio permitido**
   - Dominio donde vivirá el widget:
   `https://miniapps.softvibes.pro`
   o
   `https://www.beglobalpro.org`

## Opcional

- Color primario: `#062F55`.
- CTA principal: “Diagnóstico gratis”.
- Voz en español latino.
- Transcripción activada.
- Webhook para leads.
- Link exacto a membresías si se confirma ruta pública.
- Link vigente de webinar/clase.

## Seguridad

No enviar por chat:
- Vapi private API key.
- tokens secretos;
- claves de servidor;
- contraseñas.

Si se requiere configuración API privada, cargarla como variable de entorno segura y resumirla como `[REDACTED]`.
