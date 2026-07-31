# Matriz de permisos — Perfiles Be Global

Leyenda:

- **Sí:** disponible en el perfil.
- **Aprobación:** requiere autorización humana explícita y evidencia.
- **No:** fuera del perfil.
- **Posterior:** puede habilitarse después de QA y setup propio.

| Capacidad | Corporate | Team | Member |
|---|---:|---:|---:|
| Leer metodología aprobada | Sí | Sí | Sí |
| Guardar contexto propio | Sí | Sí | Sí |
| Ver métricas agregadas | Sí | Sí, limitadas | No |
| Ver datos individuales | Solo gobernanza autorizada | Solo asignados | Solo propios |
| Proponer cambio de conocimiento | Sí | Sí | No |
| Aprobar cambio de conocimiento | Aprobación | No | No |
| Ejecutar QA | Sí | Sí | No |
| Crear contenido/borradores | Sí, revisión | Sí | Sí |
| Preparar tienda/catálogo | Revisión | Sí | Sí, guiado |
| Enviar mensajes externos | No inicialmente | Aprobación | No |
| Usar terminal | No | Sí, interno | No |
| Activar MCPs | Aprobación | Posterior | No |
| Leer plataforma externa | No inicialmente | Posterior | No |
| Escribir en plataforma externa | No | Aprobación posterior | No |
| Pagos o reembolsos | No | No | No |
| Legal/fiscal definitivo | No | No | No |
| Acceder a otros miembros | No por defecto | Solo asignación explícita | No |
| Mensajería masiva | No | No | No |
| Administrar credenciales | Gobierno, sin leer secretos | Setup seguro asignado | No |

## Toolsets iniciales

| Toolset | Corporate | Team | Member |
|---|---:|---:|---:|
| `clarify` | Sí | Sí | Sí |
| `file` | Sí | Sí | Sí |
| `memory` | Sí | Sí | Sí |
| `skills` | Sí | Sí | Sí |
| `todo` | Sí | Sí | Sí |
| `web` | Sí | Sí | Sí |
| `vision` | No | Sí | Sí |
| `browser` | No | Sí, CLI | No |
| `terminal` | No | Sí, CLI | No |
| `code_execution` | No | Sí, CLI | No |
| `image_gen` | No | Sí | No |
| `messaging` | No | Sí, con aprobación | No |
| MCPs | Bloqueados | Bloqueados inicialmente | Bloqueados |

Los tres perfiles incluyen `no_mcp` en el baseline. El perfil de equipo debe retirar ese bloqueo únicamente para la plataforma que haya superado su checklist de setup.

