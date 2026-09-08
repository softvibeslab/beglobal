# Actualizar el repositorio y delegar a Hermes en el VPS

Este documento no afirma que el VPS ya esté actualizado. Ejecutar por SSH bajo el usuario que operará el proyecto. La ruta absoluta del checkout en el VPS debe localizarse; no asumir que coincide con la Mac ni con una ruta histórica.

## Si ya existe el checkout

Desde la carpeta del repositorio BeGlobal:

```bash
git remote get-url origin
git status --short
git branch --show-current
git fetch --prune origin
```

El remoto debe corresponder a `softvibeslab/beglobal`. Si estás en `main` y el árbol está limpio:

```bash
git pull --ff-only origin main
git log -1 --oneline
test -f docs/beglobalasistente/TAREA_HERMES_VPS.md
```

Si hay cambios locales, conserva una copia o un commit propio antes de integrar; no uses `reset --hard`, `clean -fd` ni un stash automático. Si estás en otra rama o main ha divergido, el Hermes operador puede crear un checkout independiente con `git worktree add --detach ../beglobal-asistente-deploy origin/main` y trabajar desde allí, conservando la instalación existente. En actualizaciones posteriores deberá hacer fetch desde ese checkout y moverlo al nuevo commit solo estando limpio.

## Si aún no existe el repositorio

Desde la carpeta del VPS elegida para aplicaciones:

```bash
git clone https://github.com/softvibeslab/beglobal.git
cd beglobal
```

Usa la autenticación de GitHub del VPS si el repositorio es privado; no pegues tokens en la conversación ni en la URL.

## Validar el paquete y abrir Hermes

```bash
python3 scripts/validate_beglobalasistente_package.py
hermes --help
hermes profile --help
hermes
```

En el Hermes operador del VPS, pega:

> Trabaja desde este checkout de BeGlobal. Lee y ejecuta `docs/beglobalasistente/TAREA_HERMES_VPS.md`. Prepara el perfil `beglobalasistente`, el chat web y el iframe siguiendo sus criterios. Usa los archivos existentes como fuente del prompt y conocimiento. Verifica la versión instalada antes de elegir comandos/configuración. Conserva los servicios y cambios ajenos. Continúa con todo lo que puedas preparar y probar; pide únicamente los datos que falten para conectar Vapi o publicar en el dominio. Al final entrega URLs, commit, pruebas, servicios y lo que quedó pendiente.

## Qué tener disponible en el VPS

- Proveedor/modelo de Hermes autenticado mediante su mecanismo seguro.
- Dominio final y acceso al proxy/TLS ya utilizado en el servidor.
- Assistant ID y clave pública Vapi del asistente creado con `CONFIGURAR_VAPI.md`.
- Oferta y calendario confirmados si se quiere dar información comercial detallada.

La falta de catálogo no bloquea un prototipo: usar los fallbacks ya redactados. La falta de claves Vapi no bloquea implementar y probar el chat, pero sí una llamada real. Un dominio ausente no bloquea pruebas locales, pero impide afirmar que existe una URL pública final.

No ejecutar el script genérico `DEPLOY_VPS.sh` para esta entrega: pertenece al despliegue existente y no instala por sí mismo este nuevo perfil ni su chat.
