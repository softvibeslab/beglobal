# Real vs simulado · SP-004

Producción: **NEEDS WORK**.

## Real
- Logout que revoca la cookie de esta sesión en el servidor.
- «Cerrar todas» incrementa `session_version` de la persona e invalida copias.
- 401 `SESSION_REQUIRED` distinto de 503 `MEMBERSHIP_UNVERIFIED`.
- Mutaciones siguen exigiendo origen e intención.

## Simulado
- Cookie `__Host-` + `Secure` (hace falta HTTPS).
- BFF de staging, plataforma de membresías, webhooks, Hostinger, Mini App.
