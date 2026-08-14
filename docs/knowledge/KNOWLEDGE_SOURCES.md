# Fuentes de conocimiento

## Protocolo

1. Localizar la fuente mediante este índice o el grafo.
2. Abrir la fuente original.
3. Aplicar precedencia y estado.
4. Separar confirmado, propuesto, inferido y bloqueado.
5. Citar ruta y fecha; revalidar servicios vivos.

## Inventario publicable

| Fuente | Cobertura | Estado | Uso |
|---|---|---|---|
| [Perfiles](../../hermes/BEGLOBAL_PROFILES.md) y [permisos](../../hermes/BEGLOBAL_PERMISSIONS_MATRIX.md) | Roles y límites | Documentado | Autoridad declarativa del piloto |
| `hermes/beglobal-*/SOURCE_MANIFEST.md` | Precedencia por perfil | Documentado | Resolver autoridad y conflictos |
| [Mini Apps](../../beglobal/miniapps/README.md) | Arquitectura y despliegue previsto | Implementado/documentado | Contrastar con código y pruebas |
| [Dashboard](../../beglobal/dashboard/README.md) | Módulos y persistencia | Implementado/documentado | Contrastar con build y entorno vivo |
| [Wiki](../wiki/README.md) | Contexto y auditoría histórica | Evidencia histórica | Revalidar antes de reportar |
| [Graph report](../../graphify-out/GRAPH_REPORT.md) | 27 archivos, ~204.053 palabras, 310 nodos, 1.428 relaciones | Derivado; contiene inferencias | Descubrimiento, no autoridad |
| `raw/youtube/beglobalpro/` | 270 videos; 24 transcripciones completas y 246 metadatos/URL según README | Inventariado | Titularidad/licencia por confirmar antes de redistribuir |
| `$HERMES_HOME/workspace/knowledge/` del Corporate activo | Federación local observada: 986 nodos, 2.344 relaciones y 250 fuentes | Derivado local; no está en `origin/main`; snapshot con drift | RESTRICTED: no copiar; regenerar desde fuentes autorizadas cuando el builder esté revisado y versionado |

## Fuentes internas o restringidas

No se copian ni se incorporan al paquete:

- `state.db`, sesiones, mensajes, memorias live, directorios de perfiles activos.
- `.env`, tokens, cookies, credenciales, auth stores y allowlists privadas.
- Logs, cachés, locks, WAL/SHM, adjuntos, Media Hub y backups.
- Transcripciones completas de reuniones y datos personales.
- Videos, audio y binarios grandes.
- Material de terceros o derivados de YouTube cuya licencia de redistribución no esté confirmada.
- Salidas generadas que no puedan reconstruirse o rastrearse a una fuente autorizada.

## Precedencia

1. Decisión aprobada y registrada.
2. Permisos, metodología y guardrails mantenidos.
3. Arquitectura y bases de conocimiento mantenidas.
4. Evidencia primaria autorizada.
5. Implementación y pruebas del commit fuente.
6. Grafo, resúmenes e inferencias.

## Brechas de procedencia

- La licencia de las transcripciones y derivados de YouTube no está documentada.
- Algunas reuniones contienen nombres y contexto interno; no deben republicarse sin revisión.
- Un nombre de archivo o título “aprobado” no demuestra aprobación Corporate.
- El grafo contiene 105 relaciones inferidas con confianza media reportada de 0,71.
- Las URLs vivas no prueban qué commit está desplegado.
- La federación Corporate local tiene 3 de 250 hashes desactualizados frente al workspace observado y su builder/pruebas no están en `origin/main`; no debe presentarse como artefacto reproducible del repositorio.

## Estados

- **Borrador:** creado, no probado.
- **Probado:** Team aportó evidencia.
- **Aprobado:** existe decisión Corporate aplicable.
- **Restringido:** no publicable o acceso limitado.
- **Inferido:** relación o conclusión pendiente de fuente primaria.
