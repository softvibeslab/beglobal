# Be Global Asistente — Vapi y Hermes

Paquete en español para el asesor público de Be Global. Preparado el 8 de septiembre de 2026.

## Para Vapi

1. [Base de conocimiento para subir](BASE_CONOCIMIENTO_VAPI.txt).
2. [First Message para pegar](FIRST_MESSAGE.txt), con **Assistant speaks first**.
3. [System Prompt completo para pegar](SYSTEM_PROMPT_VAPI.txt).
4. [Configuración paso a paso](CONFIGURAR_VAPI.md).

La herramienta de conocimiento debe llamarse `consultar_conocimiento_beglobal`, o se debe ajustar el prompt al nombre real configurado. La consulta requiere asociación explícita al asistente.

## Para Hermes en el VPS

1. [Actualizar el checkout e iniciar el encargo](ACTUALIZAR_VPS.md).
2. [Tarea completa para el Hermes operador](TAREA_HERMES_VPS.md).
3. [Paquete declarativo del perfil](../../hermes/beglobalasistente/PROFILE.md).

## Mantenimiento

- [Registro comercial editable](catalogo-comercial.json).
- [Fuentes y límites de verificación](FUENTES.md).
- [Pruebas de aceptación](PRUEBAS.md).
- Validación local: `python3 scripts/validate_beglobalasistente_package.py`.

La entrega contiene textos, registro comercial, perfil declarativo y encargo de implementación. No incluye un widget implementado ni un perfil runtime desplegado. Precios, beneficios exactos y próximos webinars están sin verificar; los prompts incluyen respuestas de respaldo. El diagnóstico gratuito se realiza durante la conversación y no requiere contacto o compra.

Al actualizar: mantener una única fuente de conocimiento en el TXT, regenerar SOUL runtime en Hermes y sustituir el archivo asociado en Vapi. Evitar que una versión antigua siga adjunta. Publicar cambios en GitHub no actualiza automáticamente ninguno de los agentes vivos. El cierre posterior al diagnóstico (acompañamiento + Ver membresías) está en SOUL, BASE 1.1 y SYSTEM_PROMPT; hay que pegarlo en Vapi y regenerar el SOUL del perfil Hermes en el VPS.
