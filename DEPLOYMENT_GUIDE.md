# 🚀 Guía de Deployment — Be Global Duolingo Miniapp

## Requisitos Previos

✅ VPS con acceso SSH (Hermes)  
✅ Python 3.8+  
✅ Acceso a Telegram BotFather  
✅ Domain name (opcional, para HTTPS)  

---

## Paso 1: Preparar el VPS

### 1.1 Conectar al VPS

```bash
ssh -i ~/.ssh/key.pem root@your-vps-ip
```

### 1.2 Instalar dependencias

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Python y pip
apt install -y python3 python3-pip python3-venv

# Instalar supervisor (para mantener API corriendo)
apt install -y supervisor

# Instalar Nginx (opcional, para reverse proxy)
apt install -y nginx
```

### 1.3 Crear directorio del proyecto

```bash
mkdir -p /var/www/beglobal
cd /var/www/beglobal
```

---

## Paso 2: Descargar y Configurar Código

### 2.1 Clonar repositorio

```bash
cd /var/www/beglobal
git clone https://github.com/your-repo/beglobal.git .
```

### 2.2 Crear entorno virtual

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2.3 Instalar dependencias Python

```bash
cd beglobal/miniapps/api
pip install -r requirements.txt
```

### 2.4 Crear archivo .env

```bash
cat > .env << 'EOF'
# Telegram Bot Tokens
MEMBER_BOT_TOKEN=your_member_bot_token_here
TEAM_BOT_TOKEN=your_team_bot_token_here
CORPORATE_BOT_TOKEN=your_corporate_bot_token_here

# Allowed User IDs (comma-separated)
MEMBER_ALLOWED_IDS=123456,789012,345678
TEAM_ALLOWED_IDS=111111,222222
CORPORATE_ALLOWED_IDS=333333

# Environment
ENV=production
DEBUG=false

# Database
DATABASE_URL=sqlite:///be_global.db

# API
API_PORT=8090
API_HOST=0.0.0.0
EOF
```

⚠️ **Importante**: Reemplaza los tokens con tus propios bot tokens

### 2.5 Inicializar Base de Datos

```bash
python3 db.py
# Esto crea be_global.db con todas las tablas y seed data
```

---

## Paso 3: Configurar Telegram Bots

### 3.1 Crear Bot con BotFather

**En Telegram, abre chat con @BotFather**:

```
/start
/newbot

BotFather: Alright, a new bot. How are we going to call it?
Tu: Be Global Member Bot

BotFather: Good. Now let's choose a username for your bot. 
Tu: beglobal_member_bot

BotFather: Done! Congratulations on your new bot. 
You'll find it at t.me/beglobal_member_bot. 
You can now add a description, about section and profile picture for your bot, see /help for a list of commands.

Here's your token: 123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
```

**Guarda este token** → Úsalo en MEMBER_BOT_TOKEN

### 3.2 Repetir para Team y Corporate

```
/newbot
Be Global Team Bot
beglobal_team_bot
→ Guarda token en TEAM_BOT_TOKEN

/newbot
Be Global Corporate Bot
beglobal_corporate_bot
→ Guarda token en CORPORATE_BOT_TOKEN
```

### 3.3 Configurar Webhook (Opcional, para notificaciones)

```bash
# Para cada bot
curl -X POST https://api.telegram.org/bot{TOKEN}/setWebhook \
  -d "url=https://your-domain.com/webhook/{profile}"
```

---

## Paso 4: Configurar Supervisor (Auto-restart)

### 4.1 Crear configuración

```bash
cat > /etc/supervisor/conf.d/beglobal.conf << 'EOF'
[program:beglobal-api]
directory=/var/www/beglobal/beglobal/miniapps/api
command=/var/www/beglobal/venv/bin/python main.py
autostart=true
autorestart=true
startsecs=10
stopwaitsecs=10
stdout_logfile=/var/log/beglobal/api.log
stderr_logfile=/var/log/beglobal/api_error.log
environment=DEV_BYPASS=0
EOF

# Crear directorio de logs
mkdir -p /var/log/beglobal
```

### 4.2 Iniciar servicio

```bash
supervisorctl reread
supervisorctl update
supervisorctl start beglobal-api

# Verificar estado
supervisorctl status beglobal-api
```

---

## Paso 5: Configurar Nginx (Reverse Proxy)

### 5.1 Crear configuración

```bash
cat > /etc/nginx/sites-available/beglobal << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Proxy a FastAPI en puerto 8090
    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (webapp)
    location /app {
        alias /var/www/beglobal/beglobal/miniapps/webapp;
        try_files $uri $uri/ =404;
    }
}
EOF

# Activar configuración
ln -s /etc/nginx/sites-available/beglobal /etc/nginx/sites-enabled/

# Probar configuración
nginx -t

# Recargar Nginx
systemctl reload nginx
```

### 5.2 Obtener SSL Certificate (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx

certbot certonly --nginx -d your-domain.com
# Sigue las instrucciones

# Auto-renew
systemctl enable certbot.timer
```

---

## Paso 6: Verificar Deployment

### 6.1 Probar API

```bash
# Local
curl http://localhost:8090/healthz
# Response: {"ok": true}

# Remoto
curl https://your-domain.com/healthz
```

### 6.2 Probar Webapp

```
Abre en navegador:
https://your-domain.com/app/member/

Deberías ver: Página de Orchestrator con setup wizard
```

### 6.3 Verificar Logs

```bash
# Logs API
tail -f /var/log/beglobal/api.log

# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs Supervisor
tail -f /var/log/supervisor/supervisorctl.log
```

---

## Paso 7: Registrar Miniapp en Telegram

### 7.1 En BotFather, para cada bot

```
/mybots
→ Selecciona bot
→ Bot Settings
→ Menu Button
→ Web App
→ https://your-domain.com/app/{profile}/

Ejemplo para Member Bot:
https://your-domain.com/app/member/
```

### 7.2 Verificar que funciona

```
Abre tu bot en Telegram
Deberías ver un botón "Open App" o similar
Click → Abre miniapp
```

---

## Paso 8: Configurar Allowlist

### 8.1 Obtener tu Telegram User ID

En Telegram, abre chat con @userinfobot:

```
/start
Bot responde: Your user ID is: 123456789
```

### 8.2 Actualizar .env

```bash
# .env
MEMBER_ALLOWED_IDS=123456789,otro_id
TEAM_ALLOWED_IDS=123456789
CORPORATE_ALLOWED_IDS=123456789
```

### 8.3 Reload API

```bash
supervisorctl restart beglobal-api
```

---

## Monitoreo en Producción

### Logs importantes

```bash
# Ver últimas líneas
tail -100 /var/log/beglobal/api.log

# Ver en tiempo real
tail -f /var/log/beglobal/api.log | grep -E "ERROR|WARNING|mission_approved"

# Contar errores por hora
grep ERROR /var/log/beglobal/api.log | cut -d' ' -f1-2 | sort | uniq -c
```

### Métricas a monitorear

```bash
# API responses
curl -s https://your-domain.com/healthz | jq .

# Database size
du -sh /var/www/beglobal/beglobal/miniapps/api/be_global.db

# Disk space
df -h /var/www/

# Memory usage
free -h
```

### Alertas sugeridas

- ⚠️ API status != 200
- ⚠️ Database size > 100MB
- ⚠️ Disk usage > 80%
- ⚠️ Memory usage > 80%
- ⚠️ Errors > 10/hour

---

## Troubleshooting

### API no inicia

```bash
# Verificar syntax Python
python3 -m py_compile beglobal/miniapps/api/main.py

# Ver error específico
cd beglobal/miniapps/api
python3 main.py  # Verá el error en consola
```

### Telegram webhook no funciona

```bash
# Verificar token válido
curl https://api.telegram.org/bot{TOKEN}/getMe

# Verificar webhook URL
curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo
```

### Database corrupted

```bash
# Backup
cp /var/www/beglobal/beglobal/miniapps/api/be_global.db \
   /var/www/beglobal/beglobal/miniapps/api/be_global.db.backup

# Regenerar
cd /var/www/beglobal/beglobal/miniapps/api
rm be_global.db
python3 db.py
```

---

## Checklist Deployment

- [ ] VPS SSH access working
- [ ] Python 3.8+ installed
- [ ] .env file with bot tokens
- [ ] Database initialized (be_global.db created)
- [ ] API running on :8090
- [ ] Supervisor managing API
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] Telegram bots created (3 bots)
- [ ] Bots registered with miniapp URLs
- [ ] Allowlist configured with your Telegram ID
- [ ] Health check passing (curl /healthz)
- [ ] Webapp accessible at /app/{profile}/
- [ ] Telegram bot opens miniapp successfully
- [ ] Logs being written to /var/log/beglobal/

---

## Próximos Pasos

1. **Beta Testing** — Invitar 5-10 usuarios a probar
2. **Monitor Logs** — Revisar logs durante primeras horas
3. **Fix Bugs** — Resolver issues encontrados
4. **Scale** — Aumentar allowlist a 50+ usuarios
5. **Analytics** — Setup Grafana/Prometheus si necesario

---

## Soporte

**Logs**: `/var/log/beglobal/`  
**Config**: `/var/www/beglobal/.env`  
**Database**: `/var/www/beglobal/beglobal/miniapps/api/be_global.db`  
**Restart API**: `supervisorctl restart beglobal-api`

🎊 **Deployment Complete!**
