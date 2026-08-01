# 🚀 DEPLOYMENT INSTRUCTIONS

## 1️⃣ ACCEDER AL VPS

```bash
ssh root@31.220.63.211
# Password: Rogermck224@
```

---

## 2️⃣ CLONAR REPOSITORIO

```bash
cd /opt
git clone https://github.com/softvibeslab/beglobal.git
cd beglobal/beglobal-member-miniapp
```

---

## 3️⃣ CONFIGURAR AMBIENTE

```bash
# Copiar archivos de ejemplo
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Editar backend/.env y agregar tu token de Telegram
nano backend/.env
```

**Contenido de backend/.env:**
```
MEMBER_BOT_TOKEN=TU_TOKEN_AQUI
DB_PATH=/data/be_global_member.db
REDIS_URL=redis://redis:6379
ENV=production
```

---

## 4️⃣ INSTALAR DOCKER (si no está instalado)

```bash
# Descargar script de instalación
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar
docker --version
docker-compose --version
```

---

## 5️⃣ LANZAR APLICACIÓN

```bash
cd /opt/beglobal/beglobal-member-miniapp

# Construir y ejecutar
docker-compose up -d

# Verificar que está corriendo
docker-compose ps
```

**Esperado:**
```
NAME                COMMAND                  SERVICE    STATUS      PORTS
backend             "python -m uvicorn"      backend    Up          0.0.0.0:8090->8090/tcp
frontend            "npm run dev"            frontend   Up          0.0.0.0:5173->5173/tcp
redis               "redis-server"           redis      Up          6379/tcp
```

---

## 6️⃣ VERIFICAR QUE FUNCIONA

```bash
# Health check backend
curl http://localhost:8090/healthz

# Esperado:
# {"ok":true,"timestamp":1722559200}
```

---

## 7️⃣ CONFIGURAR NGINX (Reverse Proxy)

**Crear archivo:** `/etc/nginx/sites-available/beglobal`

```nginx
upstream backend {
    server localhost:8090;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 80;
    server_name beglobal.rovicrm.com;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Activar:**
```bash
sudo ln -s /etc/nginx/sites-available/beglobal /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

---

## 8️⃣ CERTIFICADO SSL (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx

sudo certbot certonly --nginx -d beglobal.rovicrm.com
```

**Actualizar Nginx config para HTTPS:**

```nginx
server {
    listen 443 ssl http2;
    server_name beglobal.rovicrm.com;

    ssl_certificate /etc/letsencrypt/live/beglobal.rovicrm.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/beglobal.rovicrm.com/privkey.pem;

    # ... resto del config
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name beglobal.rovicrm.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 9️⃣ MONITOREO

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Backend solo
docker-compose logs -f backend

# Frontend solo
docker-compose logs -f frontend

# Redis
docker-compose logs -f redis
```

---

## 🔟 MANTENIMIENTO

### Detener servicios
```bash
docker-compose down
```

### Reiniciar
```bash
docker-compose restart
```

### Reconstruir (después de cambios de código)
```bash
docker-compose up -d --build
```

### Ver estado del DB
```bash
docker-compose exec backend sqlite3 be_global_member.db ".tables"
```

---

## 🆘 TROUBLESHOOTING

### Puerto en uso
```bash
# Ver qué está usando el puerto
lsof -i :8090
lsof -i :5173

# Matar proceso
kill -9 PID
```

### Certificado expirado
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Logs de errores
```bash
docker-compose logs backend | tail -100
docker-compose logs frontend | tail -100
```

### Database corrupted
```bash
# Recrear base de datos
docker-compose exec backend python db.py
docker-compose restart backend
```

---

## 📊 URLS POST-DEPLOY

- **Frontend:** https://beglobal.rovicrm.com
- **Backend API:** https://beglobal.rovicrm.com/api
- **Health Check:** https://beglobal.rovicrm.com/api/healthz
- **Info:** https://beglobal.rovicrm.com/api/info

---

## ✅ CHECKLIST DE DEPLOY

- [ ] SSH al VPS
- [ ] Clonar repositorio
- [ ] Editar backend/.env con token de Telegram
- [ ] Docker instalado
- [ ] docker-compose up -d
- [ ] Verificar servicios (docker-compose ps)
- [ ] curl http://localhost:8090/healthz
- [ ] Configurar Nginx reverse proxy
- [ ] SSL con Let's Encrypt
- [ ] Prueba la app en https://beglobal.rovicrm.com

---

## 🎉 POST-DEPLOY

1. **Probar onboarding:** Abre la app y completa el diagnóstico
2. **Verificar leaderboard:** Revisa que se carga correctamente
3. **Test con bot de Telegram:** `/start` en @beglobal_member_bot
4. **Monitorear logs:** `docker-compose logs -f`
5. **Configurar alertas:** (Sentry, datadog, etc)

---

## 📞 PROBLEMAS FRECUENTES

| Problema | Solución |
|----------|----------|
| 502 Bad Gateway | `docker-compose restart` |
| CORS errors | Verificar VITE_API_BASE_URL en .env |
| Bot no responde | Verificar MEMBER_BOT_TOKEN |
| DB locked | `docker-compose restart backend` |
| Frontend no carga | Verificar nginx logs: `tail -f /var/log/nginx/error.log` |

---

**¡Deploy completado! 🚀**
