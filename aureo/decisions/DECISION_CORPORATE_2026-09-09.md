# Decisión Corporate · Áureo fase 0 y ruta 0 → 100

Fecha: 2026-09-09 · Preparado por: Roger (con `beglobal-aureo` en borrador) · Duración prevista de la sesión: 13 minutos (8 de datos, 5 de decisión)

## Estado ejecutivo

- Fase 0 de Áureo cerrada salvo esta revisión: toolkit con 12 pruebas en verde, regla 1-2-3-5 en los tres SOUL, criterio 62/38 en la plantilla de ficha, tres perfiles Hermes en borrador.
- Ruta maestra de dropshipping construida sobre el catálogo real: 8 etapas, 27 hitos, 425 lecciones, 51 videos. Mapa neural gamificado funcional sin backend.
- Riesgo: el mapeo curso → etapa está inferido por títulos; las Mini Apps siguen en rojo por P0 de backend.
- Se requieren tres decisiones hoy. Ninguna toca producción.

## Evidencia

| Hallazgo | Fuente | Estado | Impacto |
|---|---|---|---|
| El método ya usa 5 preguntas, 3 perfiles, 1 misión, 1-2 recursos, 1-3 acciones | `hermes/beglobal-member/SOUL.md` | confirmado | La regla 1-2-3-5 formaliza lo existente, no cambia el método |
| 5 de 10 comunidades del grafo superan 21 nodos; la mayor tiene 78 con cohesión 0.05 | `aureo/out/graph_branching_audit.json` | confirmado | Navegación pobre para agentes; partición propuesta, no aplicada |
| Ingesta promedio 15.1 %, 95 de 1,285 lecciones procesadas, sin foco por fase | `beglobal/trainning/catalog.json` | confirmado | Presupuesto 62/38 concentra en cursos foco |
| Mapeo curso → etapa marcado `title_inferred_pending_corporate` | `beglobal/piloto/academy-pro-catalog.json` | supuesto | La ruta no debe publicarse al miembro sin validación |
| Evidencia de aprendizaje óptimo apunta a ~85 % de acierto, no a 62 % | Wilson et al. 2019 | confirmado | φ no se usa para dificultad; solo para reparto y tallas |

## Decisiones requeridas

### D1 · Cursos foco de ingesta (ciclo 1)

Propuesta: Dropshipping Manager, Curso Intensivo Ventas en tu tienda online, Método Dulce Jaqueline, Aprende a crear tu tienda con Shopify desde cero. Son los cursos de E0 a E3, las etapas donde el piloto vive los próximos 45 días. Con capacidad de 40 lecciones por ciclo: 25 a profundidad en estos cuatro (6 por curso), 15 a amplitud (una por comunidad restante).

Alternativa segura: solo Dropshipping Manager y Curso Intensivo, 12 por curso.

- [ ] Aprobar propuesta · [ ] Alternativa · [ ] Ajustar: ________

### D2 · Intervalo de XP por misión media para calibrar

Propuesta: intervalo 100-500 XP, métrica tasa de misiones completadas a 7 días, ciclos de 7 días, mínimo 8 miembros activos por ciclo. Sondas del ciclo 1: 253 y 347. Si no hay 8 miembros, ciclo de 14 días o simulación con `learning_sessions`.

Alternativa segura: fijar 250 XP sin calibrar hasta tener cohorte.

- [ ] Aprobar propuesta · [ ] Alternativa · [ ] Ajustar: ________

### D3 · Validación del mapeo curso → etapa de la ruta

Propuesta: validar por muestreo las 4 etapas de la ruta crítica RC1 y RC2 (E1, E2, E3, E5) revisando que cada curso asignado enseña lo que el hito exige. Team hace la revisión en una sesión de 2 horas con el documento de la ruta; Corporate firma. Las etapas E4, E6 y E7 se validan cuando un miembro llegue a ellas.

Alternativa: validar las 8 etapas antes de mostrar la ruta a nadie (estimado 6 horas).

- [ ] Aprobar propuesta · [ ] Alternativa · [ ] Ajustar: ________

## Lo que no se decide hoy

- Activar perfiles Hermes nuevos: requiere D1 y D2 aprobadas y config revisada.
- Cambiar la curva de niveles de la miniapp: opción documentada, no urgente.
- Cualquier cambio en producción: bloqueado por P0 de backend.

## Siguientes acciones

1. Registrar las tres decisiones en `aureo/aureo.config.beglobal.json` con fecha y responsable. Dueño: Roger. Fecha: mismo día de la sesión.
2. Arrancar la prueba de E0 con un miembro y un coach usando `aureo/decisions/PROTOCOLO_PRUEBA_E0.md`. Dueño: Team. Fecha: semana del 14 de septiembre.
3. Iniciar corrección del P0 de backend. Dueño: Roger. Fecha: esta semana.

Responsable de la decisión: ________ · Fecha: ________ · Registro: `decision_log`
