# Controles del perfil público

## Permitir inicialmente

- Conversación en español con conocimiento suministrado por el servidor.
- Diagnóstico y respuesta dentro de la sesión actual.
- Enlaces públicos verificados y resumen visible.

## Desactivar en la configuración efectiva del runtime

- Terminal, ejecución de código, lectura/escritura de archivos y navegación.
- MCPs, skills heredadas, instalación de skills/plugins y delegación.
- Memoria global, escritura de perfil de usuario, cron y mensajería.
- Herramientas de administración, pagos, CRM o inscripción hasta implementarlas con contrato específico.

Un perfil sin skills no implica un agente sin herramientas. Comprobar la lista efectiva de herramientas y las capacidades del canal API de la versión instalada. Si no puede impedirse el acceso a herramientas administrativas, ejecutar el perfil en un contenedor/usuario aislado sin acceso a otros perfiles, al repositorio privado o a credenciales operativas antes de abrirlo al público.

## Frontera de red

- API Hermes en loopback y con clave propia, nunca publicada directamente al navegador.
- Backend público con modelo/perfil fijo. Acepta solo texto del visitante y controla historial/sesiones en servidor.
- No aceptar roles `system`/`developer`, overrides, toolsets, rutas, perfiles o identificadores arbitrarios de conversación del cliente.
- No exponer dashboard, API de administración ni claves Hermes en el iframe.
- Datos personales sin persistencia global. Si se almacenan sesiones para operar, definir retención y borrado, acceso por sesión y aviso de privacidad antes de publicar.
- Límites de tamaño, frecuencia, concurrencia y duración; errores sin secretos; respuestas renderizadas como texto o Markdown sanitizado.

El propietario solicita preparar este despliegue. No es necesario pedirle confirmaciones rutinarias para crear archivos, configurar el perfil aislado o hacer pruebas locales. Los datos comerciales ausentes se mantienen como no verificados.
