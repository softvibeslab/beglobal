# INC-001 · Colisión de registros · resuelto en control

13/09/2026 · **RESUELTO para el control oficial.** Los dos snapshots se conservan. No se reescribe la huella ejecutada.

## Decisión (mandato nocturno de Roger)

Roger autorizó seguir las sugerencias de Codex y simular lo desconocido. Sugerencia aplicada:

| Rol | Snapshot | Huella |
|---|---|---|
| **Oficial (plan ejecutado y cerrado)** | [aprobado-0.1.0.json](baselines/aprobado-0.1.0.json) · «lo apruebo date hermano» · worktree SPEC_AGENTS | `4d685084f36b515fb97e393eede6199ca1300ff512448d3ace1c84d394d9fa72` |
| Apéndice (misma historia, otros textos de A-06/base) | [SP-001-v0.1.0.json](baselines/SP-001-v0.1.0.json) · «sigue con lo que tu recomiendes…» | `bccd4e1a33ba383b6435d4c3059531d1ab3cee0b10b559915ac71b7eb7b86773` |

Criterios y puntos de BG-001…005 son idénticos en ambos. No se fusionaron las huellas ni se atribuyó la aprobación de arranque a una huella nueva.

## Hechos (sin cambio)

Durante un sync al repo principal, un preflight falló y el `rsync` continuó: error de coordinación. No se usa `--delete` retrospectivo. El código de la demo y `qa/latest/` siguen siendo la entrega técnica.

## Qué no autoriza esta resolución

Commit, push, Hostinger, SP-002, BG-036, ni declarar producción READY.
