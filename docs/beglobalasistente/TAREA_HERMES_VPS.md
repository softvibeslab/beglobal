# Encargo al Hermes operador del VPS

## Resultado solicitado

Crear el perfil independiente `beglobalasistente`, preparar y probar un widget de chat público conectado a él, y una página insertable por iframe con dos opciones: hablar con Vapi y escribir al asesor Hermes. Este es un encargo de implementación para el operador del servidor, no instrucciones que deban entregarse al agente público.

El usuario ha solicitado actualizar el repo y que Hermes haga el perfil y la integración en el VPS. Avanza en configuración, implementación y pruebas de forma autónoma. Conserva servicios y datos ajenos. Si faltan dominio o identificadores Vapi, termina la parte local y pide solo esos datos; no inventes valores productivos ni presentes un mock como funcionando.

## 1. Inspección y alcance

Lee `ACTUALIZAR_VPS.md`, `CONFIGURAR_VAPI.md`, `FUENTES.md`, `PRUEBAS.md` y `hermes/beglobalasistente/`. Registra commit del checkout, usuario operativo, versión Hermes y esquema de configuración disponible. Inspecciona `hermes profile create --help` y ayuda del gateway antes de ejecutar comandos. Detecta puertos y proxy existentes; no copies credenciales al output ni al repositorio.

No actualices todo Hermes ni reinicies todos sus perfiles por inferencia. Si la versión instalada carece de API por perfil, documenta la incompatibilidad y prepara una actualización aislada/rollback antes de modificar el servicio existente.

## 2. Crear el perfil aislado

Si no existe, usa el comando de creación soportado. En versiones que lo admiten:

```bash
hermes profile create beglobalasistente --no-skills --description "Asesor público Be Global: dudas y diagnóstico gratuito"
```

No uses clone/clone-all. Si ya existe, inspecciona su estado y respalda sus archivos declarativos antes de aplicar cambios. No sobrescribas `.env`, autenticación ni sesiones. Confirma el home real del perfil, que en la instalación estándar será `~/.hermes/profiles/beglobalasistente`.

Genera su SOUL runtime desde `hermes/beglobalasistente/SOUL.md` seguido por un delimitador de conocimiento y el contenido completo de `docs/beglobalasistente/BASE_CONOCIMIENTO_VAPI.txt`. Mantén la procedencia y versión. La base inicial es pequeña y puede incluirse completa; no hace falta habilitar lectura de archivos ni un índice vectorial para el chat del MVP.

Configura el proveedor/modelo disponible para este perfil sin replicar secretos en archivos versionados. Aplica `PERMISSIONS.md`: sin herramientas administrativas, filesystem, terminal, MCPs, delegación, skills heredadas ni memoria compartida. Verifica la configuración efectiva del canal API, no solo lo declarado por SOUL. Si el esquema no reconoce una clave, corrige con documentación/código instalado; no dejes claves decorativas sin efecto.

## 3. API privada de Hermes

Configura un puerto libre y escucha solo en `127.0.0.1`. Genera una clave aleatoria propia en un archivo de entorno privado, permisos 0600. Variables documentadas: `API_SERVER_ENABLED`, `API_SERVER_HOST`, `API_SERVER_PORT`, `API_SERVER_KEY`. No fijar CORS público si solo conecta el backend local. Configura e inicia únicamente el gateway de `beglobalasistente` según la versión instalada.

Verifica autenticación, `/v1/models` y una respuesta real. El endpoint `/v1/chat/completions` recibe el historial completo en cada solicitud. Úsalo inicialmente con historial controlado por el backend y un modelo fijo `beglobalasistente` según el ID real anunciado. No aceptes system prompts o configuración desde el navegador. Verifica que el SOUL y conocimiento del perfil están presentes en respuestas reales y que no existen herramientas peligrosas disponibles.

## 4. Backend del widget

Implementa un servicio independiente pequeño, usando la infraestructura ya disponible cuando sea compatible. No conectes el navegador directamente a la API Hermes.

Contrato mínimo propuesto:
- `GET /healthz`: estado básico sin configuración o secretos.
- `POST /api/session`: crea una sesión aleatoria y la vincula al visitante con cookie segura HttpOnly; no admite elegir sesiones ajenas.
- `POST /api/chat`: recibe solo mensaje textual y usa sesión validada; límite de longitud e historial. Perfil, modelo e instrucciones se fijan en servidor.
- `POST /api/session/reset`: elimina la conversación de esa sesión y permite empezar otra.

Gestiona TTL/retención de sesiones, límite por IP/sesión, concurrencia y timeout. Valida origen/CSRF en solicitudes que usan cookies. Para iframe entre sitios, comprobar políticas actuales del navegador y cookies de terceros: preferir hosting bajo un subdominio del sitio padre cuando sea viable; ofrecer abrir en página completa si el navegador bloquea almacenamiento. Nunca debilitar aislamiento para resolver cookies bloqueadas.

El servidor mantiene historial individual y clave Hermes. No registra texto/contactos en logs generales. Usa un estado explícito para las capacidades reales: sin CRM, envíos ni registro automático inicial. No activar esas promesas hasta que la función exista y haya pasado pruebas.

## 5. Interfaz y Vapi

Crea una página `/asistente/` con marca Be Global, explicación breve de que es un asesor virtual, selector Voz / Chat, botón de diagnóstico gratuito y enlaces oficiales al sitio y membresías. Chat renderizado como texto o Markdown sanitizado, con controles etiquetados, navegación por teclado, estado de espera, errores y nueva conversación.

Integra widget oficial Vapi modo `voice` usando assistant ID real y clave pública suministrados. No pongas claves privadas en frontend. Fija la versión del SDK probada. No inicies llamadas al cargar la página. Si no hay configuración Vapi, muestra que la voz aún no está disponible y permite usar chat. No uses el chat de Vapi en lugar del perfil Hermes pedido.

El iframe tendrá título, altura responsive y permisos de micrófono apropiados. Configura HTTPS, Permissions-Policy y CSP frame-ancestors para los dominios autorizados. No publicar el dashboard administrativo dentro del iframe. Entrega el fragmento exacto de iframe con el dominio real; hasta entonces mantén cualquier URL de ejemplo marcada como ejemplo.

Primera versión: ambos canales usan el mismo conocimiento, pero conversaciones separadas. La UI debe avisar que al cambiar de canal empieza otra conversación. No prometer continuidad automática. Como mejora posterior se puede implementar transferencia explícita de resumen con consentimiento, ID de sesión firmado, validación de origen y pruebas contra cruce de visitantes.

## 6. Catálogo y seguimiento

`catalogo-comercial.json` es un registro inicial no verificado. No mostrar placeholders como oferta real. Cuando el propietario confirme información, añadir fuentes, vigencia y responsable. El calendario vacío significa desconocido, no ausencia de eventos. Regenerar el contexto Hermes y actualizar el archivo adjunto a Vapi al cambiar el catálogo; Git por sí solo no sincroniza Vapi.

CRM, inscripción, envío de resumen y transferencia humana quedan como integraciones posteriores, salvo que ya exista un contrato verificado que el propietario haya autorizado usar. El MVP funciona con diagnóstico dentro de la conversación y enlaces oficiales. No conectar por suposición la ingesta premium de n8n como CRM.

## 7. Pruebas, operación y entrega

Ejecuta `PRUEBAS.md` en el perfil real y en la interfaz. Incluye dos visitantes simultáneos, intento de session hijacking y acceso a roles/modelos no permitidos; confirma que la API Hermes sigue inaccesible desde la red pública. Prueba llamada Vapi real únicamente con configuración y acceso a micrófono disponibles; distingue lo simulado de lo probado.

Prepara servicio supervisado según el sistema del VPS, dependencias reproducibles, arranque tras reinicio, comprobación de salud y rollback de archivos/proxy. Configura solo la ruta/dominio de esta aplicación. Si falta el dominio final, deja servicio local probado y configuración pendiente claramente identificada.

Entrega: commit desplegado, rutas del paquete, perfil creado, modelo configurado, servicios y puertos internos, URL pública si existe, iframe listo para pegar, pruebas realmente ejecutadas, pendientes y procedimiento de actualización/rollback. No reportes producción operativa solo por haber creado archivos.

Referencias oficiales:
- https://hermes-agent.nousresearch.com/docs/user-guide/profiles/
- https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server
- https://docs.vapi.ai/chat/web-widget
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/allow
