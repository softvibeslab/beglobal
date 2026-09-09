# Plan de aplicación de Áureo en Be Global

Fecha de inicio: 2026-09-08
Duración: 12 semanas (hasta 2026-11-30)
Estado: propuesta · todas las reglas son INFERRED hasta que el piloto las valide

## Restricción de arranque

Actualización 2026-09-09: las tres suites del backend pasan con recursos temporales (`test_phase1` 12/12, `test_p0_security` 6/6, `test_acceptance_cycle`); la FK de `audit_trail`, las rutas duplicadas y los P0 están corregidos en el árbol de trabajo según `beglobal/miniapps/REVALIDATION_2026-09-08.md`, pendientes de commit. El párrafo siguiente describe el estado de agosto.

El contexto operativo marca las Mini Apps en rojo: `audit_trail`, pruebas fallidas, rutas duplicadas y riesgos P0 de seguridad. Áureo no compite con eso. Las fases 0 y 1 solo tocan documentos, SOUL, seed y scripts de ingesta. Nada del plan requiere desplegar a producción antes de que el backend esté estable.

## Objetivo

Que en 12 semanas el piloto opere con reglas de proporción explícitas y medibles en cuatro frentes: respuestas del agente, tamaño y ritmo de misiones, prioridad de ingesta y estructura del grafo. Y que un parámetro de gamificación quede calibrado con datos reales.

## Fases

### Fase 0 · Fundación (semana 1: 8 al 14 de septiembre)

| Entregable | Dónde | Talla | Dueño | Estado |
|---|---|---|---|---|
| Proyecto `aureo/` con biblioteca, CLI, pruebas y auditoría del grafo | `aureo/` | 2 | Roger | ✅ 2026-09-08 |
| Regla 1-2-3-5 pegada en los tres SOUL | `hermes/beglobal-member/SOUL.md`, `beglobal-team`, `beglobal-corporate` | 1 | Roger | ✅ 2026-09-08 |
| Configuración vigente `aureo.config.beglobal.json` revisada por Corporate | `aureo/` | 1 | Corporate | pendiente |
| Perfiles Hermes `beglobal-aureo`, `beglobal-curator`, `beglobal-pacer` (borrador, no activados) | `hermes/` | 3 | Roger | ✅ 2026-09-08 |
| Criterio ficha 62/38 en el checklist de revisión | `docs/premium-knowledge-mediahub/FICHA_TECNICA_TEMPLATE.md` | 1 | Team | ✅ 2026-09-08 |

Criterio de salida: pruebas en verde, SOUL actualizados, Corporate aprueba o ajusta la configuración.

### Fase 1 · Misiones y ingesta (semanas 2-3: 15 al 28 de septiembre)

| Entregable | Dónde | Talla | Dueño | Estado |
|---|---|---|---|---|
| Campo `size` Fibonacci en las 10 misiones del seed y XP = 50 × talla | `beglobal/miniapps/api/db.py`, `gamification.py` | 2 | Backend | ✅ verificado 2026-09-09 en árbol de trabajo (test 12/12), sin commit |
| Espiral 1-1-2-3-5-8 aplicada al orden de misiones del onboarding | seed de `missions` | 1 | Backend + Team | ✅ `MISSION_SIZES = (1,1,2,3,5,8,5,8,8,13)`, sin commit |
| Activar `beglobal-curator` y `beglobal-aureo` tras revisión de configuración | `hermes/` | 2 | Corporate | pendiente de D1 y D2 (`aureo/decisions/DECISION_CORPORATE_2026-09-09.md`) |
| Presupuesto de ingesta 62/38 por ciclo en el inventario de pendientes | `scripts/build_pending_ingestion_inventory.py` | 2 | Roger | ✅ verificado 2026-09-09, lee `aureo.config.beglobal.json`, sin commit |
| Cursos foco de la fase actual definidos (3-5) | `aureo.config.beglobal.json` | 1 | Corporate | propuesta en D1, pendiente |

Criterio de salida: cada misión tiene talla; el inventario de ingesta imprime profundidad/amplitud y lista los cursos foco.

### Fase 2 · Ritmo y estructura (semanas 4-6: 29 de septiembre al 19 de octubre)

| Entregable | Dónde | Talla | Dueño |
|---|---|---|---|
| Cadencia de recordatorios 1-2-3-5-8-13 con escalado a Team el día 13 | módulo de notificaciones (Fase 3 del roadmap de Mini Apps) | 3 | Backend |
| Activar `beglobal-pacer` con miembros asignados | `hermes/` | 2 | Team |
| Partición de las 5 comunidades con severidad alta (78, 59, 44, 31, 23 nodos) | Graphify + `beglobal/dashboard/app/knowledge-path.tsx` | 5 | Roger + Team |
| Handoff en espiral documentado en permisos y runbook | `hermes/BEGLOBAL_PERMISSIONS_MATRIX.md` | 1 | Corporate |

Criterio de salida: ninguna comunidad supera 21 nodos; los recordatorios se registran en `audit_trail`.

Dependencia: la cadencia de recordatorios requiere que el módulo de notificaciones exista. Si se retrasa, esta fase entrega solo la partición del grafo y el handoff.

### Fase 3 · Calibración y experiencia (semanas 7-12: 20 de octubre al 30 de noviembre)

| Entregable | Dónde | Talla | Dueño |
|---|---|---|---|
| Búsqueda por sección áurea sobre XP de misión media: 6 ciclos de 7 días | dashboard Corporate + `decision_log` | 5 | Corporate + Roger |
| Layout 62/38 y tarjetas 1:1.618 en la miniapp del member | `duolingo.css`, dashboard Next.js | 3 | Frontend |
| Sesión 8+5 minutos como bloque por defecto | miniapp | 2 | Frontend |
| Revisión de resultados: qué reglas se quedan, cuáles se retiran | `aureo/out/` + wiki | 2 | Corporate |

Criterio de salida: intervalo de XP reducido a menos del 10 % del original; decisión auditada de qué reglas pasan a EXTRACTED (validadas) o se descartan.

Dependencia: la búsqueda áurea necesita una cohorte estable de miembros activos y el backend en verde. Si el piloto no arranca a tiempo, se sustituye por simulación con datos de `learning_sessions` y se pospone.

## Cronograma

```text
Sep 8   Sep 15        Sep 29              Oct 20                          Nov 30
|-F0----|-----F1------|--------F2---------|-------------F3----------------|
 base    tallas+ingesta  recordatorios+grafo  búsqueda áurea + layout + revisión
```

## Métricas de validación

| Regla | Métrica | Línea base | Objetivo a 12 semanas |
|---|---|---|---|
| 1-2-3-5 | % respuestas del agente que cumplen la regla (auditoría Team) | sin datos | ≥ 90 % |
| Espiral de misiones | Días hasta primera misión aprobada | sin datos | ≤ 3 días |
| Tallas Fibonacci | Desvío entre tiempo real y talla estimada | sin datos | ≤ 1 talla en 80 % de misiones |
| Recordatorios | Retención al día 13 | sin datos | +20 % vs. cohorte sin cadencia |
| Ingesta 62/38 | % lecciones de cursos foco con ficha aprobada | ~15 % promedio general | ≥ 62 % en cursos foco |
| Ramificación | Comunidades > 21 nodos | 5 de 10 | 0 |
| Búsqueda áurea | Ancho del intervalo de XP | 400 | < 25 |
| Sesión 62/38 | Duración media de sesión y % con misión completada | sin datos | 10-15 min, ≥ 50 % |

Toda métrica sin línea base se reporta como **sin datos** hasta que exista telemetría, siguiendo la regla de la wiki.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Backend no estabiliza y bloquea Fases 2 y 3 | Fases 0 y 1 no dependen de él; Fase 3 se simula con telemetría existente |
| Corporate percibe φ como decoración | Presentar solo métricas y decisiones; φ no aparece en la interfaz ni en marketing |
| Reglas rígidas frenan al agente en casos límite | Cada regla tiene excepción explícita: escalado a humano prevalece sobre 1-2-3-5 |
| Partición del grafo rompe rutas de conocimiento del dashboard | Migración con ids inmutables y comparación antes/después en `aureo/out/` |
| Sobreajuste a pocos miembros en la búsqueda áurea | Mínimo 8 miembros activos por ciclo; si no, ciclo de 14 días |

## Gobierno

- Cada cambio de parámetro se registra en `aureo.config.beglobal.json` con fecha y motivo.
- Corporate decide qué reglas se validan; Team audita cumplimiento; Member nunca ve la palabra "áureo".
- Revisión quincenal de 13 minutos: 8 de datos, 5 de decisión.
