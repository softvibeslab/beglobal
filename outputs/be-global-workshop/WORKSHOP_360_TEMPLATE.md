# Workshop 360 — Escalera de valor Be Global

Estado: plantilla propuesta para facilitar Design Thinking con Allan, equipo y miembros piloto.

## Objetivo del workshop
Validar en conjunto qué mejoras del ecosistema atacan prioridades comerciales y cuellos de botella reales, sin ampliar el MVP antes de obtener evidencia.

## Roles
| Perfil | Rol en el workshop | Evidencia que aporta | Decisión esperada |
|---|---|---|---|
| Allan / Corporativo | Dueño de visión, método y guardrails | Promesa, prioridades, límites, criterios de marca | Aprobar / rechazar / mandar a roadmap |
| Equipo interno | Operación, soporte, QA y contenido | Casos reales, errores, preguntas frecuentes, tiempos | Proponer mejoras testeables |
| Miembro piloto | Experiencia desde cero | Bloqueos, entregables, satisfacción, tiempo a primer valor | Validar si hay valor real |

## Agenda sugerida — 90 minutos
1. Apertura y objetivo — 5 min
2. Escalera de valor por perfil — 10 min
3. Mapa 360 de cuellos de botella — 20 min
4. Design Thinking: empatizar, definir, idear — 25 min
5. Priorización impacto/esfuerzo/riesgo — 15 min
6. Convertir top 3 en experimentos — 10 min
7. Cierre: responsables, métricas y checkpoint — 5 min

## Dashboard dinámico — campos
### Ficha de oportunidad
- ID:
- Perfil: Allan / Equipo / Miembro
- Prioridad: Comercial / Contenido / Operación / Soporte / Datos
- Dolor observado:
- Evidencia:
- Solución propuesta:
- Prototipo mínimo:
- Métrica de validación:
- Riesgo / guardrail:
- Responsable:
- Estado: Idea / Prototipo / En prueba / Validado / Roadmap / Descartado

## Reglas de validación
1. No se aprueba por opinión: requiere evidencia de uso o prueba.
2. No se promete venta, viralidad, stock, SLA ni ingresos.
3. Toda acción sensible escala a Allan o responsable designado.

## Prompt para Miro o Milanote
Copia y pega este prompt en Miro AI, Milanote AI o en un asistente que pueda crear tableros:

```text
Crea un tablero visual para un workshop de 90 minutos llamado “Be Global — Escalera de Valor 360 del Piloto”.

Objetivo: que Allan, el equipo interno y los miembros piloto propongan, prioricen y validen mejoras del ecosistema Be Global sin ampliar el MVP antes de tener evidencia.

Estructura el tablero en 7 zonas horizontales:
1. Norte del piloto: objetivo, promesa segura y guardrails.
2. Escalera de valor por perfil: Allan/Corporativo, Equipo Interno, Miembro Piloto.
3. Mapa 360 de cuellos de botella: comercial, contenido, operación, soporte y datos.
4. Empatizar: notas adhesivas para dolores, frases reales, tareas abandonadas y dudas frecuentes.
5. Definir: fichas de oportunidad con perfil afectado, evidencia, impacto, riesgo y responsable.
6. Idear y prototipar: templates, prompts, checklists, flujos conversacionales, mini dashboard o guiones.
7. Validar: matriz impacto/esfuerzo/riesgo y tablero de experimentos con estados Idea, Prototipo, En prueba, Validado, Roadmap y Descartado.

Usa colores:
- Azul para Allan/Corporativo.
- Verde para Equipo interno.
- Morado para Miembro piloto.
- Rojo para riesgos/checkpoints humanos.
- Amarillo para hipótesis no validadas.

Incluye una tabla final de Top 3 experimentos con: hipótesis, prototipo mínimo, métrica, responsable, fecha de revisión y decisión esperada.

Guardrails visibles: no prometer ventas, ingresos, viralidad, stock, disponibilidad, SLA o publicación automática; no usar credenciales de miembros; escalar pagos, contratos, datos sensibles e integraciones.
```

## MCP / integración
- Miro: hay servidores MCP públicos en npm, por ejemplo `@aiwerk/mcp-server-miro`, `@k-jarzyna/mcp-miro` y `@xmarts/miro-mcp`. Requieren token/API OAuth de Miro y filtro de herramientas antes de usar.
- Milanote: no encontré un MCP dedicado publicado en npm con búsqueda `milanote mcp`; opción segura: usar prompt/export manual o automatización vía navegador/API si existiera acceso aprobado.

Configuración Hermes propuesta para Miro, pendiente de credenciales y aprobación:

```yaml
mcp_servers:
  miro:
    command: "npx"
    args: ["-y", "@aiwerk/mcp-server-miro"]
    env:
      MIRO_ACCESS_TOKEN: "${MIRO_ACCESS_TOKEN}"
    tools:
      include:
        - create_board
        - get_board
        - list_boards
        - create_sticky_note
        - create_shape
        - create_connector
```

Verificación Hermes después de configurar:
```bash
hermes mcp test miro
# iniciar sesión nueva o usar /reload-mcp
```
