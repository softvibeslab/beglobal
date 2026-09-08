# Configurar Be Global Asistente en Vapi

Paquete en español, versión 1.0. Los archivos están preparados; no se ha creado ni publicado un asistente en tu cuenta de Vapi.

## Campos del asistente

| Campo | Valor |
|---|---|
| Name | Be Global Asistente |
| First Message Mode | Assistant speaks first |
| First Message | Contenido completo de `FIRST_MESSAGE.txt` |
| System Prompt | Contenido completo de `SYSTEM_PROMPT_VAPI.txt` |
| Idioma de transcripción | Español; comprobar reconocimiento de Be Global, ecommerce y dropshipping |
| Voz | Español latinoamericano; escuchar la muestra antes de publicar |
| Modelo | Uno disponible en tu cuenta con llamadas a herramientas; conservar el actual para la primera prueba si las soporta |
| Temperature | 0.3 como punto inicial, si el modelo admite este ajuste |

El texto "This is a blank template with minimal defaults..." es una explicación de la plantilla de Vapi. Sustituye el contenido del campo System Prompt con el archivo suministrado; no incluyas esa explicación en las instrucciones del agente.

## Base de conocimiento

1. Sube únicamente `BASE_CONOCIMIENTO_VAPI.txt` a Files / Knowledge Base en Vapi y espera a que quede procesado.
2. Crea una herramienta Query con el nombre exacto `consultar_conocimiento_beglobal` y asocia el archivo cargado. Si usas la interfaz Knowledge Base V2, asocia al asistente su herramienta de búsqueda y ajusta el nombre en el prompt al nombre real de esa herramienta.
3. Descripción de la base: "Orientación pública de Be Global Pro, metodología, diagnóstico gratuito, preguntas frecuentes, objeciones y límites de información comercial. Consultar antes de responder preguntas sobre Be Global. No contiene precios ni calendario de webinars confirmados."
4. Adjunta la herramienta al asistente. Subir el archivo sin adjuntar la herramienta no basta.
5. Pega First Message y System Prompt. Guarda y prueba primero desde el panel.
6. Ejecuta los escenarios de `PRUEBAS.md`. Comprueba en el registro que realmente consulta conocimiento y que no inventa una integración.

No subas el repositorio entero, prompts, instrucciones de VPS, contratos internos ni transcripciones premium como conocimiento público. No configures funciones de registro o envío que todavía no existen.

## Cambios comerciales

Completa `catalogo-comercial.json` con fuentes vigentes y responsable de revisión. Actualiza las secciones comerciales del TXT, cambia su versión y sustituye el archivo de conocimiento adjunto; retira la versión anterior para evitar resultados contradictorios. Editar el JSON en GitHub no actualiza Vapi automáticamente. Hasta conectar una consulta dinámica, cada cambio comercial requiere esta sincronización manual.

## Widget y voz

Configurar el widget con el assistant ID real, una clave pública Vapi y modo `voice`. Las claves privadas quedan en el servidor. La llamada comienza por acción del visitante. Configurar tiempos máximos y límites de consumo en Vapi; probar interrupciones y micrófono denegado. Mantener grabación desactivada en el piloto salvo que se configure expresamente el aviso y flujo de consentimiento correspondiente.

Los enlaces no aparecen en pantalla solo porque el agente los mencione. El iframe debe mostrar enlaces oficiales fijos y recibir resultados de la llamada si después se implementa esa integración. La primera versión no promete continuidad automática voz/chat.

Referencias oficiales consultadas el 8 de septiembre de 2026:
- https://docs.vapi.ai/knowledge-base/using-query-tool
- https://docs.vapi.ai/api-reference/knowledge-bases-v-2/knowledge-base-v-2-controller-find-one
- https://docs.vapi.ai/chat/web-widget
