# Beneficios de aplicar Áureo en Be Global

Cada beneficio indica qué problema actual resuelve y cómo se mide. Los beneficios son esperados, no comprobados, hasta que las métricas del plan los confirmen.

## Para el miembro

| Beneficio | Problema que resuelve | Cómo se nota |
|---|---|---|
| Sabe siempre cuál es el siguiente paso | El "Builder" del GDD está abrumado por exceso de información | Cada respuesta cierra con 1 paso; máximo 3 acciones |
| Primera victoria en días, no semanas | Misiones iniciales demasiado grandes desmotivan | Misión 1 es talla 1 con evidencia inmediata |
| Progresión sin acantilados | Saltos de dificultad arbitrarios | Tallas crecen 1-1-2-3-5-8 |
| Sesiones con ritmo | Sesiones que se alargan o se quedan en teoría | 8 minutos de hacer, 5 de aprender |
| Recordatorios que no agobian | Silencio total o spam diario | Cadencia 1-2-3-5-8-13 días; se reinicia al actuar |

## Para los agentes

| Beneficio | Problema que resuelve | Cómo se nota |
|---|---|---|
| Contexto centrado en la persona | El agente recita el programa en lugar de mentorear | 62 % del contexto es estado del miembro |
| Respuestas auditables | No hay criterio objetivo de calidad de respuesta | Regla 1-2-3-5 verificable con `check_response` |
| Escucha proporcional a la fase | Instruye cuando debería preguntar y viceversa | 3 de 5 turnos en pregunta durante diagnóstico |
| Handoffs compactos | Team y Corporate reciben conversaciones enteras | Lo que sube se comprime al 62 % en cada salto |
| Un solo formato de recuperación | Cada nivel del conocimiento tiene estructura distinta | Plantilla fractal idéntica en 5 niveles |

## Para Team

| Beneficio | Problema que resuelve | Cómo se nota |
|---|---|---|
| Detecta misiones mal calibradas | No hay forma de saber si una misión es demasiado grande | Desvío real vs. talla > 1 talla dispara revisión |
| Detecta abandono a tiempo | El abandono se descubre cuando ya ocurrió | Escalado automático al día 13 sin acción |
| Revisión de fichas con criterio | La calidad de fichas depende del revisor | 62/38 accionable/contexto con tolerancia ±10 |

## Para Corporate

| Beneficio | Problema que resuelve | Cómo se nota |
|---|---|---|
| Calibra gamificación con pocos miembros | Sin volumen para A/B, los parámetros se fijan a ojo | 6 ciclos reducen el intervalo de XP al 5.6 % |
| Decisiones registradas | Cambios de parámetro sin trazabilidad | Cada valor vive en `aureo.config.beglobal.json` con fecha y motivo |
| Ingesta alineada a la fase del piloto | 15 % de ingesta promedio repartido sin foco | 62 % de capacidad en 3-5 cursos foco |
| Grafo navegable | 5 comunidades de 23 a 78 nodos, cohesión 0.05 | Ninguna comunidad supera 21 nodos |

## Para el proyecto

| Beneficio | Detalle |
|---|---|
| Menos decisiones arbitrarias | Tamaños, cadencias, presupuestos y proporciones salen de una sola escala, no de discusiones caso por caso |
| Reutilizable | Áureo no depende de Be Global; sirve para otra academia o programa de mentoría de Softvibes |
| Barato de adoptar | Solo stdlib, 12 pruebas, sin servicios nuevos; las Fases 0 y 1 no tocan el backend en rojo |
| Compatible con el gobierno existente | Reglas marcadas INFERRED, métricas "sin datos" hasta tener telemetría, nada expuesto al miembro |

## Lo que Áureo no aporta

- No mejora la precisión factual de los agentes; eso depende de las fichas verificadas y Graphify.
- No fija la dificultad de aprendizaje; la evidencia apunta a ~85 % de acierto, no a 62 %.
- No es argumento de marca ni de marketing.
