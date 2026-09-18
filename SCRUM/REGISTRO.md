# Registro de decisiones, impedimentos y cambios

Registro append-only de hechos relevantes. No editar el pasado para aparentar aprobación. Enlaces a mensajes deben ser referencias verificables, no citas inventadas; nunca copiar secretos.

## 2026-09-13 · Preparación

- Roger pidió control Scrum, historias, asignaciones y sprints; quiere aportar los insumos al aprobar el plan y revisar al final.
- Se preparan metodología y propuesta SP-001. Esta petición autoriza documentar el control, **no demuestra aprobación de las historias de implementación**.
- Autoridad de membresía: confirmación previa de Roger sobre la plataforma de BeGlobal. El contrato real sigue pendiente; [D-01](../SPECS/16-decisiones.md).
- Rama observada en lectura: `feat/equipo-crm-p0`, distinta del destino histórico `SPEC_AGENTS`. Se preservan cambios existentes y se requiere coordinación en A-02. No se hizo checkout, commit, push ni deploy por esta preparación.
- Decisión de propuesta: prototipo local con fixtures, sin gasto externo ni datos reales. Falta ratificación de Roger.
- Verificación de esta preparación: 885 comprobaciones estructurales del control y 24 pruebas de regresión PASS. Revalidación separada de SPECS: 265 comprobaciones documentales y 22 pruebas del puente PASS; no se ejecutó el producto futuro ni cuentas reales. La primera generación detectó un enlace al reporte aún no creado; se corrigió el orden de generación y la validación final pasó. Baseline de producto sigue pendiente de aprobación.

## Impedimentos de arranque

| ID | Estado | Afecta | Responsable de resolver, propuesto | Siguiente acción |
|---|---|---|---|---|
| BL-001 | Abierto | Inicio SP-001 | Roger + Codex | Resolver A-02 y comprobar base aislada sin pérdida de cambios |
| BL-002 | Abierto | Inicio SP-001 | Roger | Completar A-01…A-06 y aprobar versión exacta |
| BL-003 | Pendiente futuro, no bloquea fixtures | PRO real | BeGlobal técnico, por nombrar | Contrato/sandbox, IDs y semántica de membresía D-01 |

Estos son pendientes de preparación, no días de bloqueo de un sprint activo. No hay cambios de alcance aprobados ni historias aceptadas en este registro.

## 2026-09-13 · Aprobación y ejecución de SP-001

- Roger respondió «lo apruebo date hermano». [Registro de aprobación](sprints/SP-001/APROBACION.md); A-01…A-05 ratificados y A-06 concretado como inicio inmediato/límite de cinco días hábiles, sin reunión ni disponibilidad personal inventada.
- BL-001 resuelto con worktree aislado `BeGlobal-SP-001` en SPEC_AGENTS; BL-002 resuelto por la aprobación. El cuadro anterior es el estado histórico de preparación, no un bloqueo actual. BL-003 sigue pendiente para la integración real, fuera de SP-001.
- Implementación local y pruebas terminadas; las cinco historias pasan a revisión, no a Done. [Demo/evidencia/retrospectiva](sprints/SP-001/REVISION.md).
- Nuevo [BL-004](sprints/SP-001/BL-004-BASE-LEGACY.md): duplicados legacy en la base histórica SPEC_AGENTS; gate de integración bloqueado. BG-036 se añade como propuesta, no cambio del alcance aprobado.
- No hay aceptación de producto todavía. No se ha publicado, hecho commit/push ni utilizado credenciales reales.

## 2026-09-13 · Aceptación nocturna y cierre SP-001

- Roger, al irse a dormir, autorizó seguir sugerencias, simular lo desconocido y terminar el trabajo. [Fuente](sprints/SP-001/evidencias/ACEPTACION-20260913.md).
- BG-001…005 pasan a `done` sobre la entrega `dbe9e8a7…`. SP-001 `closed`. [Cierre](sprints/SP-001/CIERRE.md).
- INC-001: control oficial = huella ejecutada `4d685084…`; snapshot paralelo conservado.
- No commit, push, Hostinger, gasto, SP-002 ni producción READY.

## 2026-09-13 · SP-002 activo

- Tras el commit de SP-001, Roger pidió continuar. Slice: BG-006 con initData fixture. [APROBACION](sprints/SP-002/APROBACION.md).

## 2026-09-14 · SP-002 en revisión

- UI de initData/logout/TTL en Member Workspace. 43+22 pruebas locales PASS. [Revisión](sprints/SP-002/REVISION.md).
- BG-006 `in_review`. Sin aceptación de producto, Hostinger ni bot real.

## 2026-09-15 · Aceptación SP-002

- Roger: «aceotoi» → acepto. [Fuente](sprints/SP-002/evidencias/ACEPTACION-20260915.md). BG-006 `done`. SP-002 `closed`. [Cierre](sprints/SP-002/CIERRE.md).
- No se interpreta como BotFather, Hostinger, BG-007 ni producción.

## 2026-09-18 · SP-005 en revisión

- «sigue» tras SP-004. Slice: BG-038 unlink HMAC local. [Evidencia](sprints/SP-005/evidencias/BG-038.md).
- BG-038 `in_review`. Sin aceptación de producto, Hostinger ni bot real.

## 2026-09-18 · SP-006 en revisión

- «sigue» con SP-005 abierto. Slice: BG-039 misión local fixture. [Evidencia](sprints/SP-006/evidencias/BG-039.md).
- BG-039 `in_review`. BG-038 sigue pendiente de «acepto». No Hostinger ni BG-008.

## Cómo añadir un evento

Usar [BITACORA](plantillas/BITACORA.md), [BLOQUEO](plantillas/BLOQUEO.md) o [CAMBIO](plantillas/CAMBIO.md). Registrar cuándo, historia, hecho/evidencia, impacto, responsable, siguiente acción y autoridad si aplica. Cada actualización de estado debe tener un evento en `backlog.json` y evidencia consistente; el tablero se regenera, no se edita a mano.
