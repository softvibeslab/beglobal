# Ledger real vs simulado · cierre SP-001

Producción: **NEEDS WORK**. Done local ≠ publicado.

## Real (comprobado en este incremento)

- Prototipo loopback `beglobal/member-workspace/` con fixtures explícitos.
- MembershipBridge fail-closed reutilizado; fixtures rechazados en staging/production.
- Suite local archivada en `qa/latest/` (backend, puente, navegador, contratos formales).
- Gasto externo nuevo: 0 USD. Sin commit, push, deploy ni cuentas de miembros.
- Worktree de ejecución: `BeGlobal-SP-001` / `SPEC_AGENTS` @ `a264c30`. Copia principal `feat/equipo-crm-p0` no se alteró en rutas legacy.

## Simulado (etiquetado; no es PASS de producción)

- Identidad Telegram/web real, linking y BFF con cookie `__Host-`.
- Adapter de la plataforma BeGlobal y vigencia académica verdadera.
- Hostinger, VPS, Hermes, OAuth, MCP, pagos, misiones, uploads.
- Velocidad histórica, LTV, conversión o ahorro de la alianza.
- Paridad de la API legacy (BL-004 / BG-036 sigue propuesto).
- Revisión independiente de seguridad.

Una simulación de escenario de fixture **no** se registra como evidencia de entorno real.
