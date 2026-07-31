# Mini Apps de Telegram · Be Global Pro

Tres Mini Apps (Member, Team, Corporate) servidas por una API FastAPI con
autenticación nativa de Telegram (`initData` + HMAC por bot) y evidencias en el
Media Hub aislado. Ver `PLAN.md` para el contexto y las fases.

```
miniapps/
├── PLAN.md                 # Plan aprobado y estado
├── api/
│   ├── main.py             # FastAPI: endpoints + estáticos de las apps
│   ├── auth.py             # Validación initData por perfil + allowlist
│   ├── db.py               # SQLite: esquema y semillas del piloto
│   ├── requirements.txt
│   └── .env.example
├── webapp/
│   ├── shared/             # CSS/JS compartidos (estilo del dashboard)
│   ├── member/index.html   # «Mi Guía»
│   ├── team/index.html     # «Centro de operación»
│   └── corporate/index.html# «Torre de control»
└── deploy/
    ├── beglobal-miniapps.service   # systemd
    └── nginx.conf.example          # TLS + proxy
```

## Desarrollo local

```bash
cd api
python3 -m venv venv && venv/bin/pip install -r requirements.txt
DEV_BYPASS=1 venv/bin/uvicorn main:app --reload --port 8090
# http://localhost:8090/app/member/  (DEV_BYPASS omite la firma de Telegram)
```

`DEV_BYPASS=1` es solo para desarrollo: simula un usuario y salta la
validación. **Jamás activarlo en el VPS.**

## Despliegue en el VPS (después del gate F0)

Prerrequisitos: los 3 bots creados en BotFather (decisión pendiente de la
reunión) y un subdominio con TLS — Telegram no abre Mini Apps sin HTTPS.

1. Copiar `api/` y `webapp/` a `/srv/beglobal/miniapps/`.
2. Crear el usuario de servicio y el venv:
   ```bash
   useradd -r -s /usr/sbin/nologin beglobal
   python3 -m venv /srv/beglobal/miniapps/venv
   /srv/beglobal/miniapps/venv/bin/pip install -r /srv/beglobal/miniapps/api/requirements.txt
   mkdir -p /srv/beglobal/mediahub
   chown -R beglobal:beglobal /srv/beglobal
   ```
3. Crear `/srv/beglobal/miniapps/api/.env` desde `.env.example` con permisos
   `0600`: tokens de los 3 bots y allowlists (mismos IDs que el gateway).
4. Instalar `deploy/beglobal-miniapps.service` en `/etc/systemd/system/`,
   `systemctl enable --now beglobal-miniapps`.
5. Configurar nginx con `deploy/nginx.conf.example` + certbot.
6. En BotFather, para cada bot: **Bot Settings → Menu Button** con su URL:
   - Member → `https://miniapps.DOMINIO/app/member/`
   - Team → `https://miniapps.DOMINIO/app/team/`
   - Corporate → `https://miniapps.DOMINIO/app/corporate/`

## Seguridad

- `initData` se valida con HMAC contra el token del bot del perfil; expira a
  la hora (`INITDATA_MAX_AGE`).
- Allowlist vacía = nadie entra (seguro por defecto).
- Un member solo ve sus propios datos; Team y Corporate no comparten bot.
- Evidencias: máx. 20 MB, guardadas por perfil/usuario en el Media Hub.
- La API corre como usuario sin privilegios, detrás de nginx, solo en
  `127.0.0.1:8090`.

## Pruebas de aceptación sugeridas

1. Abrir cada Mini App desde su bot con un ID en la allowlist → carga.
2. Abrirla con un ID fuera de la allowlist → «Acceso no autorizado».
3. Reusar un initData de hace más de 1 hora → rechazado.
4. Member sube evidencia → Team la ve en su bandeja → al aprobarla, la etapa
   del member pasa a «lista» y las métricas de Corporate se actualizan.
5. Intentar acceso cruzado (token de un bot contra la API de otro perfil) →
   401.
