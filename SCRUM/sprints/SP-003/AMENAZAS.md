# Amenazas · SP-003 (local)

STRIDE mínimo antes de código. No es revisión independiente ni producción.

| Amenaza | Mitigación en este slice |
|---|---|
| Spoofing de sesión | Cookie HttpOnly; mutaciones exigen origen + `X-Workspace-Intent`; desafío ligado a la sesión. |
| Tampering de initData | Reusar `verify_init_data` (firma, stale, replay). Extra fields → 422. |
| Elevation / fusión | Si el Telegram mapea a otra persona o ya tiene dueño, `LINK_CONFLICT`; nunca merge de historial (el historial de miembro sigue vacío). |
| Repudiation | Eventos `identity.linked` / `identity.link_rejected` / `identity.recovery_denied` en memoria, filtrados por persona. |
| Info disclosure | Sin tokens en JSON; sujeto ajeno no se enumera más allá del código de conflicto. |

Won’t: OAuth real, PKCE de proveedor, Secure cookie de producción.
