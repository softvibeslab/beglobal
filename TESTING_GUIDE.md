# 🧪 Guía de Testing — Bot Corporativo Be Global

**Estado**: ✅ Backend deploy completado  
**Bot**: Be Global Corp (@beglobalcorp)  
**IP VPS**: 31.220.63.211  
**HTTPS**: ✅ Configurado con certificado autofirmado  
**Webhook**: ✅ Registrado en Telegram  

---

## Paso 1: Obtener tu Telegram ID

### 1.1 Abrir @userinfobot

En Telegram, busca y abre: **@userinfobot**

### 1.2 Copiar tu ID

```
/start
```

Bot responde:
```
🆔 Your user ID is: 123456789
👤 Your username: @yourname
```

**Copia tu número** (ej: 123456789)

---

## Paso 2: Agregar tu ID al allowlist

```bash
ssh root@31.220.63.211
# Contraseña: Rogermck224@

# Editar .env
nano /var/www/beglobal/beglobal/miniapps/api/.env

# Cambiar línea:
CORPORATE_ALLOWED_IDS=123456789
# (reemplaza 123456789 con tu ID)

# Guardar (Ctrl+X → Y → Enter)

# Restart API
supervisorctl restart beglobal-api
```

---

## Paso 3: Configurar Bot Menu en BotFather

### 3.1 Abrir BotFather

En Telegram: **@BotFather**

### 3.2 Configurar Menu Button

```
/mybots
→ Be Global Corp
→ Bot Settings
→ Menu Button
→ Web App
```

**URL**: 
```
https://31.220.63.211/app/corporate/
```

⚠️ **Importante**: Acepta el certificado autofirmado (navegador mostrará advertencia)

---

## Paso 4: Probar la Miniapp

### 4.1 Abrir tu Bot

En Telegram: **@beglobalcorp**

Deberías ver un botón "Open App" o similar

### 4.2 Click en "Open App"

Se abre la miniapp. Deberías ver:

- ✅ Nombre del bot: "Be Global Corp"
- ✅ Dashboard corporativo (Orchestrator router)
- ✅ Botón de bienvenida o setup wizard

### 4.3 Navegar en la Miniapp

- **Tab 1: Metrics** — Socios, misiones, score promedio
- **Tab 2: Gates** — 5 puertas de deployment
- **Tab 3: Decisions** — Decisiones de gobernanza
- **Tab 4: Audit** — Historial de eventos

---

## Paso 5: Debugging

### Si recibiste error SSL en el navegador:

```
ADVERTENCIA: Tu conexión no es privada
Certificado autofirmado es normal para testing.
```

**Solución**: Click en "Avanzado" → "Ir a 31.220.63.211"

### Si el bot no abre la miniapp:

1. Verifica que tu ID esté en `CORPORATE_ALLOWED_IDS`:
   ```bash
   grep CORPORATE_ALLOWED_IDS /var/www/beglobal/beglobal/miniapps/api/.env
   ```

2. Verifica que el API esté corriendo:
   ```bash
   supervisorctl status beglobal-api
   ```

3. Verifica logs:
   ```bash
   tail -20 /var/log/beglobal/api.log
   ```

### Si recibiste "No autorizado":

- El token HMAC falló
- Tu ID no está en el allowlist
- El header `X-Tg-Init-Data` no se está enviando

---

## Comandos Útiles

```bash
# Ver estado de todo
supervisorctl status beglobal-api
netstat -tlnp | grep 8090
curl -k https://31.220.63.211/healthz

# Ver logs en tiempo real
tail -f /var/log/beglobal/api.log

# Restart API (si hiciste cambios en .env)
supervisorctl restart beglobal-api

# Ver webhook info
curl -s https://api.telegram.org/bot8870107307:AAFUEnYgQuVPdVbgyV0yXEorQqIptJ46vlE/getWebhookInfo
```

---

## Testing Checklist

- [ ] Obtuve mi Telegram ID (@userinfobot)
- [ ] Agregué mi ID al allowlist en .env
- [ ] Reinicié el API
- [ ] Abro @beglobalcorp en Telegram
- [ ] Veo el botón "Open App"
- [ ] La miniapp carga sin errores
- [ ] Veo el dashboard corporativo
- [ ] Puedo navegar entre tabs (Metrics, Gates, Decisions, Audit)
- [ ] Hago click en una gate, se abre modal
- [ ] Puedo ver audit trail

---

## Datos de Testing

Una vez que la miniapp esté abierta, puedes:

1. **Ver Métricas** → Datos simulados de socios, misiones
2. **Ver Gates** → 5 puertas con estados (pending/done)
3. **Ver Decisiones** → 3 decisiones de ejemplo (approved/pending/rejected)
4. **Ver Audit Trail** → Historial de eventos

---

## Próximos Pasos

1. ✅ Backend deploy completado
2. ✅ Bot corporativo configurado
3. 📱 **Testing miniapp (TÚ AQUÍ)**
4. ➕ Agregar bot Member (cuando esté listo)
5. ➕ Agregar bot Team (cuando esté listo)
6. 📊 Beta testing con otros usuarios
7. 🚀 Go-Live

---

**¿Necesitas ayuda?** Comparte:
- Logs del API: `tail /var/log/beglobal/api.log`
- Errores en navegador (F12 → Console)
- Screenshots de la miniapp

🎊 **Let's Test!**
