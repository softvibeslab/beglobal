# 02 — Setup Be Global Áureo

1. Autenticar el proveedor del modelo en este perfil.
2. Mantener `approvals.mode: manual` y `privacy.redact_pii: true`.
3. No activar MCPs.
4. Verificar terminal interno con `cd aureo && python3 -m unittest discover tests`.
5. Completar `memories/USER.md`.
6. Confirmar que el perfil rechaza los casos de `tests/security-boundaries.md`.
