# Controles del perfil público

## Permitir inicialmente

- Conversación en español con conocimiento suministrado por el servidor.
- Diagnóstico y respuesta dentro de la sesión actual.
- Enlaces públicos verificados y resumen visible.
- Invitar al formulario de consentimiento del widget después del diagnóstico o si la persona pide aviso/webinar/comunidad.

## Desactivar en la configuración efectiva del runtime

- Terminal, ejecución de código, lectura/escritura de archivos y navegación.
- MCPs, skills heredadas, instalación de skills/plugins y delegación.
- Memoria global, escritura de perfil de usuario, cron y mensajería.
- Lectura del CRUD de leads, tokens de administración, Hermes de otros perfiles.

El registro de leads lo ejecuta el backend del widget, no este perfil. Corporate aprueba el catálogo; no conversa con el visitante ni recibe el hilo.

Un perfil sin skills no implica un agente sin herramientas. Comprobar la lista efectiva de herramientas y las capacidades del canal API de la versión instalada. Si no puede impedirse el acceso a herramientas administrativas, ejecutar el perfil en un contenedor/usuario aislado sin acceso a otros perfiles, al repositorio privado o a credenciales operativas antes de abrirlo al público.

## Frontera de red

- API Hermes en loopback y con clave propia, nunca publicada directamente al navegador.
- Backend público con modelo/perfil fijo. Acepta solo texto del visitante y controla historial/sesiones en servidor.
- No aceptar roles `system`/`developer`, overrides, toolsets, rutas, perfiles o identificadores arbitrarios de conversación del cliente.
- No exponer dashboard, API de administración ni claves Hermes en el iframe.
- Datos personales sin persistencia en Hermes. El widget puede persistir un lead con aviso, términos, finalidades y retención definidos en el catálogo Corporate. No copiar PII a USER.md ni a memoria global.
- Límites de tamaño, frecuencia, concurrencia y duración; errores sin secretos; respuestas renderizadas como texto o Markdown sanitizado.

El propietario solicita preparar este despliegue. No es necesario pedirle confirmaciones rutinarias para crear archivos, configurar el perfil aislado o hacer pruebas locales. Los datos comerciales ausentes se mantienen como no verificados.
