# Equipo CRM · P0 — publicación y operación

**Fecha:** 13 septiembre 2026  
**Alcance:** shell CRM + módulo Leads. No instrumenta el chat PRO ni Mini Apps.

## URLs

| Superficie | URL |
|---|---|
| Chat público | https://chatbeglobal.softvibes.pro/asistente/ |
| Equipo (Leads) | https://chatbeglobal.softvibes.pro/asistente/equipo/leads |
| Resumen | https://chatbeglobal.softvibes.pro/asistente/equipo/ |
| Ficha | https://chatbeglobal.softvibes.pro/asistente/equipo/leads/:id |
| Health | interno `127.0.0.1:8654/healthz` |

El proxy Caddy sigue montando el widget en `/asistente/` y recorta ese prefijo hacia Node. La cookie de equipo es `bgas_admin` con `Path=/asistente/`. No hay ruta apex `/equipo/` en este P0.

## Qué se publica

Servicio systemd `beglobalasistente-widget` en `/opt/beglobalasistente-widget`, puerto **8654**. Entorno en `/etc/beglobalasistente-widget.env` (`LEADS_ADMIN_TOKEN`, `LEADS_HASH_SALT`, `API_SERVER_KEY`, etc.). Datos en `LEADS_DATA_DIR` (`/var/lib/beglobalasistente-widget`).

No se toca `chatbeglobal-widget`, `chatbeglobal-premium-widget`, Hermes PRO ni Mini Apps.

## Publicar (VPS `chatbeglobal.softvibes.pro`)

Desde el repo, solo este paquete:

```sh
STAMP=$(date -u +%Y%m%dT%H%MZ)
ssh -i ~/.ssh/agenticvibes_vps root@169.58.107.205 \
  "cp -a /opt/beglobalasistente-widget /opt/beglobalasistente-widget.backup-$STAMP"

rsync -az --delete \
  --exclude data/ --exclude node_modules/ --exclude .env --exclude '*.json.tmp' \
  -e "ssh -i ~/.ssh/agenticvibes_vps" \
  beglobal/asistente-widget/ \
  root@169.58.107.205:/opt/beglobalasistente-widget/

ssh -i ~/.ssh/agenticvibes_vps root@169.58.107.205 \
  "systemctl restart beglobalasistente-widget && systemctl is-active beglobalasistente-widget"
```

`--delete` no borra leads: viven fuera del árbol (`StateDirectory`). Confirmar `LEADS_DATA_DIR` antes si el servicio alguna vez escribió en `/opt/.../data`.

Comprobar:

```sh
curl -sS http://127.0.0.1:8654/healthz   # en el VPS: leads:true
curl -sSI https://chatbeglobal.softvibes.pro/asistente/equipo/leads
curl -sS https://chatbeglobal.softvibes.pro/asistente/ | grep -q 'Chat · Be Global Asistente'
```

Entrar al panel con el token ya configurado. Un lead de prueba con consentimiento debe listarse; soporte/reembolso en el chat no crea lead.

## Rollback

```sh
ssh -i ~/.ssh/agenticvibes_vps root@169.58.107.205 \
  "systemctl stop beglobalasistente-widget && \
   rm -rf /opt/beglobalasistente-widget && \
   cp -a /opt/beglobalasistente-widget.backup-STAMP /opt/beglobalasistente-widget && \
   systemctl start beglobalasistente-widget"
```

Sustituir `STAMP` por el directorio de backup creado al publicar. Los leads en `/var/lib/...` no se revierten con esto.

## Pruebas locales

```sh
cd beglobal/asistente-widget
node --test test/leads.test.js
```

## Fuera de este P0

Kanban/timeline (P1), monitor PRO (P2), avances Mini Apps (P3), tablero KPI/export (P4), usuarios nombrados, ruta pública `/equipo/` sin prefijo `/asistente`.
