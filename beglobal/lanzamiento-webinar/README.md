# Activación de lanzamiento BeGlobal

Vista previa estática de la campaña: banner, popup de invitación al webinar y tres recorridos de muestra hacia el asesor público de referencia.

## Abrir

Servir **la carpeta `beglobal`**, porque esta página reutiliza el logo y favicon oficiales existentes en `agent/` sin modificarlos:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory beglobal
```

Abrir `http://127.0.0.1:8765/lanzamiento-webinar/`. También se puede abrir `index.html` directamente; si el portapapeles no está disponible, el botón selecciona el texto para copiarlo manualmente.

- `index.html`: landing, banner, diálogo de tres pasos y enlace de referencia.
- `styles.css`: marca oficial, responsive, foco y movimiento reducido.
- `app.js`: interacción sin SDK externo, red, almacenamiento ni envío de mensajes.
- `ACTIVACION.md`: invitaciones listas para completar, guion del agente, agenda, distribución, seguimiento, medición y validaciones.

## Límites explícitos

Esta vista no registra asistentes, no utiliza IA ni activa seguimiento. `/vapi/` es un enlace de referencia a un servicio existente; su disponibilidad conversacional no se verificó aquí. La pregunta se copia manualmente, no se transfiere automáticamente al asesor. La fecha y destino definitivo no están confirmados. El usuario elige si visita el servicio externo y si envía su pregunta.

No se modificó `/agent/`, `/vapi/`, el dashboard, el VPS ni Hostinger. No se exponen datos, contenido PRO ni credenciales. No publicar `ACTIVACION.md` como contenido dirigido al visitante sin revisión: contiene instrucciones internas y campos pendientes. `noindex` no es una medida de acceso privado.

## Revisión técnica

El popup se abre solo por clic. Su cierre funciona con X, “Ahora no”, Escape y el fondo. Retorna el foco al botón original y elimina la pregunta de la vista al cerrar. La selección solo vive en memoria de la página; no hay identificación del visitante. La copia al portapapeles es una acción explícita y muestra estado real de éxito o un fallback manual.

La política CSP bloquea conexiones, formularios y scripts externos. El único enlace externo de la experiencia lleva a `/vapi/` en otra pestaña, con `noopener noreferrer`. No se pasan datos ni parámetros de campaña en esta vista.

Los botones de entrada están deshabilitados hasta que JavaScript inicializa el diálogo. Con JavaScript desactivado se pueden leer invitación, agenda y preguntas frecuentes; se explica la limitación.

Pruebas reproducibles en `../../scripts/test_beglobal_webinar.spec.cjs` y `../../scripts/playwright.webinar.config.cjs`. El runner se resuelve con `BEGLOBAL_PLAYWRIGHT_MODULE` si no está instalado en el proyecto. Los resultados y capturas se guardan fuera de los archivos publicables.

Antes de publicar en Hostinger: confirmar campaña y registro con `ACTIVACION.md`, aprobar destino/ruta, respaldar los archivos que se vayan a reemplazar y subir solo los activos aprobados a esa ruta. Esta entrega no hace ese despliegue.
