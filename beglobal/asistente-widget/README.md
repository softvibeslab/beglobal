# Be Global Asistente · widget

Chat público en `https://chatbeglobal.softvibes.pro/asistente/`. Habla con Hermes `beglobalasistente`. Puede registrar leads **solo** con formulario, T&C y aviso.

## Local

```sh
export ALLOWED_ORIGIN=http://127.0.0.1:8654
export API_SERVER_KEY=...          # clave Hermes, no va al navegador
export LEADS_ADMIN_TOKEN=...       # ≥16 caracteres, solo equipo
export LEADS_HASH_SALT=...
node server.js
```

- Chat: `http://127.0.0.1:8654/`
- Privacidad / términos: `/privacidad` `/terminos`
- Equipo (CRM P0): `/equipo/leads` — resumen, leads (tabla + ficha), módulos PRO/avances/KPIs aún sin fuente.
- En producción el proxy sigue montando el widget en `/asistente/`, así que la URL viva es `https://chatbeglobal.softvibes.pro/asistente/equipo/leads`.

Datos: `data/leads.json` (fuera de git).

```sh
node --test test/leads.test.js
```

## Producción

Caddy sirve el widget bajo `/asistente/`. Panel de equipo: `https://chatbeglobal.softvibes.pro/asistente/equipo/leads`. Runbook: `docs/equipo-crm/DEPLOY.md`. SPEC: `docs/equipo-crm/SPEC-dashboard-v1.md`.

Definir `LEADS_ADMIN_TOKEN` (≥16) y `LEADS_HASH_SALT` en `/etc/beglobalasistente-widget.env`. Corporate debe ratificar `lead-catalog.json` antes de tratar los textos legales como definitivos.

No abrir el panel al público indexable (`noindex`). No conectar WhatsApp ni un CRM externo en esta versión. No mezclar este store con Mini Apps ni con el chat PRO.

