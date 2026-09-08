# Activar el asesor premium del chat

## Entrega y estado

- `/agent/`: sitio oficial en iframe y popup con `https://chatbeglobal.softvibes.pro/`.
- Perfil nuevo: `beglobal-premium-web`. No sustituye `beglobalasistente`, `beglobal-member` ni el borrador local `beglobal-academy-pro`.
- Snapshot privado: 2026-09-08; 50 cursos, 1.181 lecciones, 94 con transcripción automática. La fecha del snapshot no acredita novedades publicadas en la Academia.
- Crear la página no cambia el perfil activo del chat ni implementa acceso PRO. Se requiere conectar el backend según este documento.

## Actualizar código en el VPS

Desde el checkout de `softvibeslab/beglobal`, revisar `git status --short`. Si está limpio en main:

```sh
git pull --ff-only origin main
```

Si tiene cambios, conservarlos y usar un checkout independiente:

```sh
git fetch origin
git worktree add --detach ../beglobal-premium-release origin/main
cd ../beglobal-premium-release
```

No ejecutar el `DEPLOY_VPS.sh` genérico. Este trabajo no necesita sustituir los servicios existentes.

## Transferir conocimiento por SSH, fuera de GitHub

El repositorio público contiene las herramientas y el prompt, no el corpus privado. En la Mac, desde el repositorio:

```sh
python3 scripts/package_beglobal_premium_knowledge.py --output /tmp/beglobal-premium-private.tar.gz
```

El comando no sobrescribe paquetes previos. El archivo contiene únicamente índice, scope, grafo y las 94 fuentes verificadas; no incluye media, cookies ni credenciales. Transferirlo mediante `scp` al VPS confirmado, fuera de `public_html`. Comparar su SHA-256 con el del comando. Descomprimir el paquete verificado desde la raíz del checkout privado de despliegue, conservando las rutas relativas. Si ya existe ese snapshot, comprobar los archivos existentes y conservar respaldo antes de reemplazarlo. No descargar el corpus desde una URL pública.

## Preparar el perfil limpio

Localizar el Python del entorno Hermes y la carpeta de perfiles del usuario que opera el servicio; estas rutas varían en Docker. Confirmar con `hermes --help` y `hermes profile --help`. Ejemplo para la instalación histórica bajo root, si sigue vigente:

```sh
python3 scripts/prepare_beglobal_premium_profile.py \
  --destination /root/.hermes/profiles/beglobal-premium-web \
  --python /root/.hermes/hermes-agent/venv/bin/python
```

Valida todas las fuentes ASR y las dependencias MCP, crea solo un destino nuevo y ajusta rutas absolutas. No inicia servicios ni copia autenticación, memoria o historial de otro perfil. El modelo/proveedor de la plantilla es OpenAI Codex; confirmar disponibilidad y autenticarlo mediante el mecanismo seguro instalado. Si se usa otro proveedor, ajustar exclusivamente la sección del modelo.

Montar el corpus en solo lectura para el proceso de chat. Confirmar que el runtime expone exclusivamente las cinco herramientas `beglobal_academy`, no terminal, archivos, navegador, memoria global ni herramientas administrativas. La configuración no sustituye el aislamiento del sistema operativo.

## Conectar chatbeglobal.softvibes.pro

Tarea concreta para el Hermes operador del VPS:

> Localiza el servicio y código que atienden chatbeglobal.softvibes.pro y su POST /chat. Haz un respaldo de su configuración. Instala el perfil beglobal-premium-web con el preparador de este repositorio y el corpus privado transferido. Configura una instancia o worker independiente para este perfil usando el procedimiento soportado por la versión instalada. Enruta el chat de miembros hacia esa instancia; el navegador no puede seleccionar perfiles arbitrarios. Conserva las funciones visuales del chat existente. Cambia el saludo visible al de SOUL.md y los accesos rápidos a «Elegir mi próximo curso», «Aplicar una lección» y «Revisar mi avance». Verifica autenticación PRO, aislamiento de sesiones, herramientas y consulta de cursos antes de activar el enrutamiento. Publica el servicio y prueba el popup en https://beglobal.softvibes.pro/agent/. Informa servicio, perfil efectivo y resultados sin mostrar secretos.

Contrato obligatorio del backend premium:

1. Verificar identidad y membresía PRO activa en el servidor antes de recuperar conocimiento o invocar el modelo; sin sesión devolver 401 y sin elegibilidad 403. Usar la fuente de membresías real de Be Global. Un email escrito o un botón «soy PRO» no sirven como verificación.
2. Asociar cada conversación al usuario autenticado. El `sessionId` generado en el navegador actual es solo un identificador; comprobar propietario en cada solicitud. Rechazar el identificador de otro miembro.
3. Fijar el perfil en servidor a `beglobal-premium-web`. Rechazar cambios de perfil y autorización enviados por cliente. Mantener memoria durable desactivada.
4. Mantener la CSP `frame-ancestors 'self' https://beglobal.softvibes.pro`. Usar cookies y protección CSRF acordes con la autenticación; ofrecer login en pestaña independiente si el navegador restringe el iframe.
5. Si no está disponible el sistema de membresías, conservar el nuevo backend premium sin acceso público hasta conectar esa validación. No exponer corpus o respuestas premium confiando únicamente en el aviso del popup.

## Pruebas antes de cambiar el perfil activo

- Anónimo: no obtiene contenido PRO. Usuario registrado sin PRO: 403. Miembro PRO: respuesta normal.
- Dos miembros: no comparten sesión, historial, memoria ni progreso. La sesión de A no es accesible para B.
- «¿Qué curso me ayuda con Shopify?» → búsqueda real, título exacto, una o dos lecciones y una acción útil.
- «¿Qué cursos nuevos incorporaron?» → aclara objetivo y distingue incorporación al índice de lanzamiento; no inventa fechas.
- Curso con solo catálogo → declara falta de transcripción. Lección ASR → cita evidencia pertinente, sin exportación masiva.
- Fuente no disponible → informa límite; no inventa contenido ni cae en herramientas administrativas.
- Popup: apertura/cierre por botón y teclado, retorno del foco, móvil sin desbordamiento y alternativa en otra pestaña.

El rollback consiste en restaurar el enrutamiento/configuración respaldados del chat; el perfil nuevo y `/agent/` son adiciones independientes.
