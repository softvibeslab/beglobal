# Amenazas · SP-004 (local)

STRIDE mínimo antes de código. No es revisión independiente ni producción.

| Amenaza | Mitigación en este slice |
|---|---|
| Spoofing de cookie | Cookie HttpOnly; `current()` exige versión vigente; mutaciones origen + intención. |
| Tampering de versión | La versión vive en `app.state`, no en el cliente. |
| Elevation | Cerrar todas de Lucía no cierra a Diego. |
| Repudiation | Respuesta `closed` / `closedAll` sin token. |
| Info disclosure | 401 de sesión no incluye `membershipStatus`. |

Won’t: `__Host-`, JWT, BFF productivo, Aikido como gate.
