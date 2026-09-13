# Bitácora · SP-001

## 2026-09-13 · Inicio

- Roger aprobó el plan; se conservó el snapshot anterior y se concretó inicio inmediato con revisión asíncrona. [Aprobación](APROBACION.md), [DoR](READY.md).
- Worktree aislado creado en `BeGlobal-SP-001`, rama `SPEC_AGENTS`; copia principal preservada. Ningún commit/push/deploy.
- Dependencias locales en venv, sin `.env`, DB ni cuentas reales. No se importó API legacy durante la inspección.
- BG-001 entra en implementación; BG-002…005 quedan comprometidas. Aceptaciones de producto vacías.
- Próximo: harness local, contratos de perfil/acceso, comprobaciones negativas y UI con evidencia real.

## 2026-09-13 · Implementación y pruebas

- BG-001…003: fábrica local, sesión opaca de fixture, identidad/grants, wrapper del puente y política por recurso. No se modificó `membership-bridge/bridge.py` ni se importó la API legacy.
- BG-004: UI de perfil read-only con branding, tres estados de acceso, vacío de progreso/historial, comparación de planes futuros y botones de validación real contra el servidor.
- BG-005: suite de backend, navegador, contratos, puente, evidencia por criterio y demo. Se reejecutó tras corregir restauración de selectores/foco y capturas.
- Puerto 8765 ocupado por otro proceso; no se detuvo. Preview propio en 18765; test server aislado en 18766. Se reinició sólo el preview propio para cargar el backend final.
- Diferencia de baseline: `SPEC_AGENTS` conserva cuatro rutas legacy duplicadas. Prueba global FAIL y archivo idéntico a HEAD; [BL-004](BL-004-BASE-LEGACY.md). No se arregló ni rebasó fuera de alcance. Siete archivos de referencia ya existentes se copiaron al worktree sólo para resolver enlaces documentales, sin modificar sus originales ni importar datos de miembros.
- Resultados finales: contratos formales PASS, 32 backend + 22 puente + 20 navegador PASS; 24 pruebas del control PASS. El reporte local conserva por separado el FAIL global legacy.
- Parte de las transiciones se consolidó al preparar la entrega, con fecha de registro real; no se atribuye una hora de inicio individual no capturada. Cinco historias en `in_review`, tareas técnicamente realizadas, 0 aceptadas.
- Handoff: [revisión](REVISION.md), [auto-revisión técnica](REVISION-TECNICA.md), fuentes/evidencias sincronizadas al repo principal. Sin gastos externos, cuentas reales, commit/push ni publicación.

## 2026-09-13 · Aceptación y cierre

- Roger autorizó continuar y cerrar según sugerencias. Historias BG-001…005 `done`. Sprint `closed`.
- [Aceptación](evidencias/ACEPTACION-20260913.md), [cierre](CIERRE.md), [handoff](HANDOFF-MANANA.md), [real vs simulado](REAL-VS-SIMULADO.md).
- SP-002 no iniciado; solo [propuesta](../SP-002/PROPUESTA.md).
