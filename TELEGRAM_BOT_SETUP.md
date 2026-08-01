# 📱 Guía Completa: Configurar Bots Telegram

## Overview

Necesitas **3 bots Telegram** (uno por perfil):

| Bot | Username | Para | Token |
|-----|----------|------|-------|
| Member Bot | @beglobal_member_bot | Members (learners) | MEMBER_BOT_TOKEN |
| Team Bot | @beglobal_team_bot | Team (reviewers) | TEAM_BOT_TOKEN |
| Corporate Bot | @beglobal_corporate_bot | Corporate (governance) | CORPORATE_BOT_TOKEN |

---

## Paso 1: Crear Bots con BotFather

### 1.1 Abrir BotFather

En Telegram, busca y abre chat con: **@BotFather**

### 1.2 Crear Member Bot

**Copiar y pegar en BotFather**:

```
/newbot
```

**BotFather**: "Alright, a new bot. How are we going to call it?"

```
Be Global Member Bot
```

**BotFather**: "Good. Now let's choose a username for your bot."

```
beglobal_member_bot
```

**Respuesta**:
```
Done! Congratulations on your new bot. 
You'll find it at t.me/beglobal_member_bot. 
You can now add a description, about section and profile picture for your bot, see /help for a list of commands.

Here's your token: 123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
```

✅ **Guarda este token** → `MEMBER_BOT_TOKEN`

### 1.3 Crear Team Bot

```
/newbot
Be Global Team Bot
beglobal_team_bot
```

✅ **Guarda token** → `TEAM_BOT_TOKEN`

### 1.4 Crear Corporate Bot

```
/newbot
Be Global Corporate Bot
beglobal_corporate_bot
```

✅ **Guarda token** → `CORPORATE_BOT_TOKEN`

---

## Paso 2: Configurar Bot Settings

### 2.1 Para cada bot, en BotFather

```
/mybots
→ [Seleccionar bot: Be Global Member Bot]
→ Bot Settings
```

### 2.2 Configurar Nombre

```
/mybots
→ Be Global Member Bot
→ Edit Bot Name
→ Be Global - Aprende Ecommerce
```

### 2.3 Configurar Descripción

```
/mybots
→ Be Global Member Bot
→ Edit Description
```

**Copia**:
```
Aprende ecommerce jugando. 
Lecciones, misiones y mentoría en tiempo real.
```

### 2.4 Configurar "About"

```
/mybots
→ Be Global Member Bot
→ Edit About
```

**Copia**:
```
La plataforma de mentoría #1 para ecommerce.
- Lecciones interactivas
- Misiones prácticas
- Gamificación (XP, niveles, logros)
- Comunidad de mentores

¡Comienza hoy!
```

### 2.5 Configurar Botón "Menu" (Web App)

```
/mybots
→ Be Global Member Bot
→ Bot Settings
→ Menu Button
→ Web App
```

**URL**:
```
https://your-domain.com/app/member/
```

⚠️ **Importante**: Reemplaza `your-domain.com` con tu dominio real

**Repetir para Team Bot**:
- URL: `https://your-domain.com/app/team/`

**Repetir para Corporate Bot**:
- URL: `https://your-domain.com/app/corporate/`

---

## Paso 3: Obtener tu User ID

### 3.1 Abrir @userinfobot

En Telegram, busca: **@userinfobot**

### 3.2 Obtener tu ID

```
/start
```

**Bot responde**:
```
🆔 Your user ID is: 123456789
👤 Your username: @yourname (if any)
```

✅ **Guarda tu ID** → Úsalo en `MEMBER_ALLOWED_IDS`

---

## Paso 4: Configurar .env en VPS

### 4.1 SSH al VPS

```bash
ssh root@your-vps-ip
cd /var/www/beglobal/beglobal/miniapps/api
```

### 4.2 Editar .env

```bash
nano .env
```

**Contenido**:
```
# Telegram Bot Tokens
MEMBER_BOT_TOKEN=123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
TEAM_BOT_TOKEN=987654321:XYZabcdefghIJKLMNOPQRSTUVWabc123456
CORPORATE_BOT_TOKEN=555666777:defghijklmnopqrstuvwxyzabcdefghijk

# Allowed User IDs (comma-separated)
MEMBER_ALLOWED_IDS=123456789,111111111,222222222
TEAM_ALLOWED_IDS=123456789,333333333
CORPORATE_ALLOWED_IDS=123456789

# Environment
ENV=production
DEBUG=false

# API
API_PORT=8090
API_HOST=0.0.0.0
```

✅ **Guardar** (Ctrl+X → Y → Enter)

### 4.3 Reload API

```bash
supervisorctl restart beglobal-api
```

---

## Paso 5: Probar Bots

### 5.1 Abrir tu Member Bot

En Telegram: **t.me/beglobal_member_bot**

Deberías ver:
- Nombre: "Be Global - Aprende Ecommerce"
- Descripción: "Aprende ecommerce jugando..."
- Botón "Open App" o "Web App" en la parte inferior

### 5.2 Click en "Open App"

Se abre miniapp:
- Deberías ver setup wizard (si primera vez)
- o Dashboard (si ya estás onboarded)

### 5.3 Probar Notificaciones Telegram

**En el dashboard**:
1. Completa una lección
2. Sistema envía notificación Telegram
3. Deberías recibir mensaje del bot

---

## Paso 6: Agregar Más Usuarios (Allowlist)

### 6.1 Obtener User IDs de otros usuarios

Pide a cada usuario que abra **@userinfobot** y copie su ID.

### 6.2 Actualizar .env

```bash
ssh root@your-vps-ip
nano /var/www/beglobal/beglobal/miniapps/api/.env
```

**Agregar IDs**:
```
MEMBER_ALLOWED_IDS=123456789,111111111,222222222,444444444,555555555
TEAM_ALLOWED_IDS=123456789,333333333,666666666
CORPORATE_ALLOWED_IDS=123456789
```

### 6.3 Reload API

```bash
supervisorctl restart beglobal-api
```

---

## Paso 7: Configurar Webhook (Para notificaciones)

### 7.1 Verificar que tu API es accesible

```bash
curl https://your-domain.com/healthz
# Response: {"ok": true}
```

### 7.2 Registrar webhook con Telegram

```bash
curl -X POST https://api.telegram.org/bot{MEMBER_BOT_TOKEN}/setWebhook \
  -d "url=https://your-domain.com/webhook/member"
```

**Repetir para otros bots**:
```bash
curl -X POST https://api.telegram.org/bot{TEAM_BOT_TOKEN}/setWebhook \
  -d "url=https://your-domain.com/webhook/team"

curl -X POST https://api.telegram.org/bot{CORPORATE_BOT_TOKEN}/setWebhook \
  -d "url=https://your-domain.com/webhook/corporate"
```

### 7.3 Verificar webhook

```bash
curl https://api.telegram.org/bot{MEMBER_BOT_TOKEN}/getWebhookInfo
```

**Respuesta esperada**:
```json
{
  "ok": true,
  "result": {
    "url": "https://your-domain.com/webhook/member",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

---

## Troubleshooting

### Bot no abre miniapp

**Solución**:
1. Verifica URL en Bot Settings → Menu Button → Web App
2. Abre URL en navegador directamente
3. Debe mostrar Orchestrator con setup wizard

### Usuario no puede acceder

**Error**: "No autorizado"

**Solución**:
1. Obtén su Telegram ID (@userinfobot)
2. Agrégalo a MEMBER_ALLOWED_IDS en .env
3. Restart API: `supervisorctl restart beglobal-api`

### No recibe notificaciones Telegram

**Verificar**:
1. Bot token válido:
   ```bash
   curl https://api.telegram.org/bot{TOKEN}/getMe
   # Debe retornar info del bot
   ```

2. User está en allowlist (check .env)

3. Logs del API:
   ```bash
   tail -f /var/log/beglobal/api.log | grep notification
   ```

### "Invalid token" error

**Causas**:
- Token copiado incorrectamente
- Token expirado (vuelve a copiarlo de BotFather)
- Token pertenece a otro bot

**Solución**:
```bash
/mybots → Be Global Member Bot → Edit Token → Copiar token nuevo
# Actualizar .env
nano .env
# Cambiar MEMBER_BOT_TOKEN
# supervisorctl restart beglobal-api
```

---

## Checklist Telegram Setup

- [ ] 3 bots creados (Member, Team, Corporate)
- [ ] 3 tokens guardados en .env
- [ ] Tu User ID obtenido (@userinfobot)
- [ ] Bot settings configurados (nombre, descripción)
- [ ] Menu Button → Web App configurado
- [ ] .env en VPS con tokens
- [ ] API reiniciado (supervisorctl restart)
- [ ] Bots accesibles en Telegram
- [ ] Miniapp se abre al clickear "Open App"
- [ ] Allowlist configurada con tu ID
- [ ] Webhooks registrados (opcional pero recomendado)
- [ ] Notificaciones Telegram funcionando

---

## Comandos Útiles

```bash
# Ver token actual (en BotFather)
/mybots → Bot → Edit Token

# Ver webhook info
curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo

# Remover webhook (volver a polling)
curl -X POST https://api.telegram.org/bot{TOKEN}/setWebhook -d "url="

# Test API desde bot
curl https://api.telegram.org/bot{TOKEN}/getMe

# Ver allowlist
grep ALLOWED_IDS /var/www/beglobal/beglobal/miniapps/api/.env

# Tail logs (notificaciones)
tail -f /var/log/beglobal/api.log | grep -E "notification|telegram|webhook"
```

---

## Siguientes Pasos

1. ✅ 3 bots creados y configurados
2. ✅ API corriendo con tokens en .env
3. ✅ Probado desde Telegram (botones visibles)
4. ✅ Notificaciones funcionando
5. 📊 Beta testing con 5-10 usuarios
6. 📈 Scale a 50+ usuarios
7. 🚀 Go-Live

---

**¿Necesitas ayuda con algún paso?** Pídelo específicamente.

🎊 **Telegram Setup Complete!**
