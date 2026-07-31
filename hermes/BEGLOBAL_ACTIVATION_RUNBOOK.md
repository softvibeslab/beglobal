# Runbook de activación

Los directorios `beglobal-corporate`, `beglobal-team` y `beglobal-member` son perfiles declarativos limpios. Este runbook explica cómo activarlos sin copiar estado de `beglobal-pro`.

## 1. Revisión

Para cada perfil:

1. Leer `SOUL.md`.
2. Aprobar `PERMISSIONS.md`.
3. Completar `workspace/onboarding/00_PRECHECK.md`.
4. Nombrar usuario, aprobador y canal.
5. Confirmar que `research.md` ya fue completado o aceptar formalmente que no aporta evidencia.

## 2. Crear el perfil destino

Crear un perfil Hermes vacío, sin clonar `beglobal-pro`:

```bash
hermes profile create beglobal-corporate --no-skills \
  --description "Gobierno, metodología, permisos, calidad y métricas Be Global."

hermes profile create beglobal-team --no-skills \
  --description "QA, soporte y operación controlada Be Global."

hermes profile create beglobal-member --no-skills \
  --description "Guía simple de diagnóstico y ejecución para miembros Be Global."
```

No usar `--clone` ni `--clone-all`.

## 3. Instalar archivos declarativos

Copiar desde cada paquete únicamente:

- `config.yaml`;
- `profile.yaml`;
- `SOUL.md`;
- `PROFILE.md`;
- `PERMISSIONS.md`;
- `SKILLS.md`;
- `SOURCE_MANIFEST.md`;
- `skills/`;
- `memories/`;
- `workspace/`;
- `tests/`.

No copiar archivos runtime desde ningún perfil existente.

## 4. Autenticación

1. Autenticar el proveedor del modelo por perfil.
2. Crear bot/canal independiente.
3. Agregar únicamente los usuarios o chats autorizados.
4. Guardar secretos mediante el mecanismo seguro del host.
5. Verificar que los secretos no aparezcan en `config.yaml`, documentos o memoria.

## 5. Prueba previa

```bash
HERMES_HOME=/ruta/al/perfil hermes config check
HERMES_HOME=/ruta/al/perfil hermes skills list
```

Después ejecutar los escenarios incluidos. No arrancar un gateway público antes de aprobar `security-boundaries.md`.

## 6. Integraciones

Orden:

1. Ningún MCP.
2. Lectura de CRM.
3. Telegram.
4. Shopify en lectura.
5. Shopify con escritura controlada para Team.
6. Otras plataformas por separado.

Corporate y Member permanecen sin MCPs durante el piloto salvo una decisión corporativa posterior documentada. Member no debe recibir operadores de plataforma.

## 7. Go-live

El perfil puede activarse cuando:

- configuración y skill cargan;
- onboarding termina;
- escenarios críticos pasan;
- no existen secretos copiados;
- chat allowlist está definido;
- hay responsable humano;
- rollback y canal de soporte están disponibles.

