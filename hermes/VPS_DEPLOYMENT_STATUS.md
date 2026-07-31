# Estado de despliegue Hermes — Be Global

Fecha de auditoría y preparación: 2026-07-30.

## Destino

- Host Hermes: `salesmastersminds`.
- Sistema detectado: Ubuntu 25.10.
- Hermes Agent detectado: `v0.15.0 (2026.5.28)`.
- Workspace, dashboard, gateway y FileHub existentes se conservaron.
- Los servicios existentes no se reiniciaron ni se reemplazaron.

## Perfiles instalados

| Perfil | Ruta Hermes | Skill | Estado |
|---|---|---|---|
| Orchestrator | `/root/.hermes/profiles/beglobal-orchestrator` | `beglobal-orchestrate-onboarding` | Activo con `@Beglobalplus_bot` |
| Corporate | `/root/.hermes/profiles/beglobal-corporate` | `beglobal-corporate-governance` | Configuración válida; Telegram pendiente |
| Team | `/root/.hermes/profiles/beglobal-team` | `beglobal-team-operator` | Configuración válida; Telegram pendiente |
| Member | `/root/.hermes/profiles/beglobal-member` | `beglobal-member-guide` | Configuración válida; Telegram pendiente |

Los perfiles se crearon limpios. No se copiaron `.env`, tokens, credenciales,
sesiones, logs, cachés ni bases de estado desde `beglobal-pro`.

El proveedor OpenAI Codex se resuelve actualmente mediante la autenticación
global del host. Para facturación o identidad completamente separadas se deben
autenticar cuentas de proveedor independientes por perfil.

## Validaciones realizadas

- `config.yaml` versión 24 válido en los tres perfiles.
- Un skill local, correcto y habilitado por perfil.
- Prueba real del modelo:
  - Orchestrator pregunta primero el área en una sesión nueva.
  - Orchestrator enruta Team y Member a su primera tarea.
  - Orchestrator rechaza secretos y no reutiliza el área de otra conversación.
  - Corporate rechaza operar cuentas de socios sin autorización.
  - Team exige aprobación para publicaciones y acciones sensibles.
  - Member rechaza pedir credenciales o publicar por el usuario.
- El Orchestrator tiene una sola skill habilitada:
  `beglobal-orchestrate-onboarding`; 85 skills integradas quedaron
  explícitamente deshabilitadas.
- El tablero `beglobal-onboarding` contiene 15 tarjetas detalladas, asignadas a
  los tres perfiles y estacionadas como `scheduled` para impedir ejecución
  automática antes de la reunión.

## Telegram

`@Beglobalplus_bot` está activo en `beglobal-orchestrator`. La migración:

- respaldó el `.env` anterior;
- copió únicamente las variables Telegram necesarias;
- activó `hermes-gateway-beglobal-orchestrator.service`;
- detuvo y deshabilitó `hermes-gateway-beglobal-pro.service`;
- verificó el envío de la primera pregunta al chat principal.

La memoria durable del orquestador permanece desactivada para impedir que el
área o progreso de un participante se reutilice con otro. Hasta conectar un
registro autenticado por usuario, el seguimiento se conserva únicamente dentro
de la conversación correspondiente.

Para activar los perfiles nuevos se requieren tres decisiones:

1. `@Beglobalplus_bot` se conserva como Master.
2. Crear bots independientes para Corporate, Team y Member.
3. Definir el ID de usuario o chat permitido para cada perfil.

Los secretos deben escribirse directamente en el `.env` de cada perfil, con
permisos `0600`. Nunca deben registrarse en el dashboard, Kanban, documentación
o mensajes.

Después de crear los tres bots con BotFather, ejecutar desde la terminal del
VPS:

```bash
/usr/local/sbin/configure-beglobal-telegram
```

El configurador:

- oculta los tokens mientras se escriben;
- valida la identidad de cada bot con `getMe`;
- impide reutilizar el bot Master o asignar un bot a dos perfiles;
- solicita allowlist y chat principal por perfil;
- escribe los `.env` de forma atómica y con permisos `0600`;
- conserva respaldo de una configuración anterior;
- no arranca gateways antes de las pruebas.

## Media Hub

El FileHub existente no debe usarse para Be Global en su estado actual:

- comparte almacenamiento con otros proyectos;
- no tiene autenticación;
- expone carga, descarga, renombrado y eliminación.

La integración segura requiere almacenamiento aislado, autenticación, límite de
tamaño, metadatos, auditoría y separación por perfil. La ruta reservada en el
VPS es `/srv/beglobal/mediahub`.

## Riesgos del host

- Ubuntu 25.10 aparece fuera de soporte.
- El firewall UFW está inactivo.
- Hermes y FileHub se ejecutan como `root`.
- Los puertos Docker `8082` y `8083` están publicados directamente.
- Existen servicios de gateway de usuario y sistema simultáneamente, lo que
  produce administración ambigua.

No se corrigieron automáticamente porque el VPS aloja otros proyectos. Antes de
actualizar el sistema, firewall o servicios se necesita snapshot verificable y
ventana de mantenimiento.

## Siguientes gates

1. Recibir la decisión de mapeo de bots y configurar tokens en el VPS.
2. Probar `getMe`, allowlists, recepción, respuesta y aislamiento por bot.
3. Publicar una API autenticada para sincronizar dashboard, workflows, tareas y
   evidencias.
4. Conectar el Media Hub aislado y ejecutar pruebas de acceso cruzado.
5. Preparar snapshot y ventana para migrar el VPS a una versión LTS soportada.
