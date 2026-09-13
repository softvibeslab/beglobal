# SP-001 · Entrega aceptada (prototipo local)

[INC-001](INC-001-RECONCILIACION.md) quedó resuelto en control: snapshot ejecutado oficial; paralelo conservado.

**Estado: cerrado.** Aceptación de producto registrada el 2026-09-13T05:07:00-05:00. Ver [CIERRE](CIERRE.md). Producción: NEEDS WORK.

## Abrir y revisar

[Demo en esta computadora](http://127.0.0.1:18765/) · [README y comandos](../../../beglobal/member-workspace/README.md) · [captura de escritorio](../../../beglobal/member-workspace/qa/latest/profile-1440.png) · [captura móvil](../../../beglobal/member-workspace/qa/latest/profile-390.png).

1. Abrir Lucía / Vigente · PRO Creador: distinguir identidad, negocio, membresía, verificación y plan.
2. Probar acceso PRO: sólo mensaje sintético. Probar aislamiento: 404 del otro negocio sin sus datos.
3. Comparar Vencida · PRO Negocio y Sin verificar · PRO Creador: perfil disponible, pero contenido protegido denegado; sin forzar compra/login.
4. Cambiar persona, recargar y revisar que el contexto se mantiene; cerrar sesión. Ver estados vacíos sin progreso inventado.
5. Revisar con teclado y móvil; conexiones, misiones y creación de contenido siguen como capacidades futuras, sin botones que simulen ejecución.

## Resultado del objetivo

Perfil read-only funcional sobre backend local, cookie de fixture y política de permisos, con branding BeGlobal. Se integró el puente existente sin inventar API real de la plataforma. Fuente evaluada: `dbe9e8a7eb12809cc351cce1fe77dcf6323e386e9886e49a6c8d6afaa8b52b20`. Plan aprobado: `4d685084f36b515fb97e393eede6199ca1300ff512448d3ace1c84d394d9fa72`.

| Historia | Evidencia | Resultado técnico | Decisión de Roger |
|---|---|---|---|
| BG-001 | [Cuatro criterios](evidencias/BG-001.md) | PASS local | Aceptada ([fuente](evidencias/ACEPTACION-20260913.md)) |
| BG-002 | [Cuatro criterios](evidencias/BG-002.md) | PASS local | Aceptada |
| BG-003 | [Cuatro criterios](evidencias/BG-003.md) | PASS local | Aceptada |
| BG-004 | [Cuatro criterios](evidencias/BG-004.md) | PASS local | Aceptada |
| BG-005 | [Cuatro criterios](evidencias/BG-005.md) | PASS local | Aceptada |

[Revisión técnica](REVISION-TECNICA.md): 32 pruebas backend, 22 puente, 20 navegador y contratos formales PASS. 24 pruebas del control Scrum también pasaron. Sin pruebas de cuentas reales ni producción.

## Riesgo separado del incremento

El validador global de SPECS falla en la base histórica SPEC_AGENTS por cuatro rutas duplicadas, sin modificaciones de este sprint. [BL-004](BL-004-BASE-LEGACY.md) / BG-036 deja la integración legacy bloqueada. No se presenta ese FAIL como verde ni se corrige fuera de alcance. El prototipo es otro proceso y no importa/ejecuta el servicio antiguo.

## Control, costo y entrega

- 13 puntos comprometidos, **13 aceptados** al cierre. Velocidad histórica: N/A (un solo sprint). No se promete el mismo ritmo en SP-002.
- Alcance añadido a SP-001: ninguno. BG-036 se añadió sólo como propuesta de backlog.
- Nuevos cargos externos: 0 USD. Sin datos reales, commit, push ni despliegue.
- Timebox: inicio autorizado en esta sesión; entrega preparada antes del límite del 18/09. No se necesita esperar a esa fecha para revisar.
- Proceso de preview local: puerto 18765, PID 14608 observado al reiniciar la versión verificada; vive mientras ese proceso siga abierto. El servidor de tests usa 18766 y se detiene al terminar la suite.
- Copia de ejecución: worktree `BeGlobal-SP-001` en `SPEC_AGENTS`; rama principal `feat/equipo-crm-p0` preservada. Control y fuentes de la entrega se sincronizan al repo principal sin copiar entornos, node_modules ni modificar legacy.

## Retrospectiva propuesta

1. Antes de SP-002, Codex comparará los baselines de ramas **como refinamiento**, y Roger decidirá cuál integrar; evitar descubrir discrepancias tarde. Implementar BG-036 necesita aprobación propia.
2. En el siguiente sprint, Codex actualizará estados por bloque de trabajo más pequeño: en esta sesión parte de las transiciones se consolidó al entregar, sin retrofecharlas. Conservar evidencia incremental además del cierre.

Siguiente decisión (mañana): si quieres commit/push o abrir SP-002, dilo explícito. [Handoff](HANDOFF-MANANA.md). No se publica la demo.
