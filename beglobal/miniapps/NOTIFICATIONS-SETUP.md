# 🔔 Guía de Notificaciones

## Sistema de Notificaciones

Be Global usa **2 canales**:
1. **In-App** (notificaciones dentro de la miniapp)
2. **Telegram** (notificaciones push del bot)

## In-App Notifications

**Aparecen en**: Esquina superior derecha

**Tipos**:
- 🎯 **mission** — Misión completada/rechazada
- 🏆 **achievement** — Logro desbloqueado
- 📈 **level_up** — Subida de nivel
- 🚀 **escalation** — Oportunidad de escalar
- ℹ️ **info** — Información general

**Comportamiento**:
- Auto-dismiss después de 5 segundos
- Stacked (múltiples aparecen verticalmente)
- Click X para cerrar manualmente
- Polling cada 30 segundos

## Telegram Notifications

**Bot tokens** (por perfil):
- `MEMBER_BOT_TOKEN` — Notificaciones para members
- `TEAM_BOT_TOKEN` — Notificaciones para team
- `CORPORATE_BOT_TOKEN` — Notificaciones para corporate

### Eventos que generan Telegram

**Para Members**:
- ✅ Misión aprobada (+XP, nivel)
- ❌ Misión rechazada (feedback)
- 🏆 Logro desbloqueado
- 🚀 Escalación disponible

**Para Team**:
- 📋 Nueva misión en cola
- 🚨 Escalamiento crítico abierto

**Para Corporate**:
- 📊 Reporte diario (socios activos, misiones)
- 🚦 Gate completado

## Setup de Telegram Notifications

### 1. Obtener Bot Token

```bash
# Crear bot con @BotFather en Telegram
/newbot
# Nombre: "Be Global Member Bot"
# Username: "beglobal_member_bot"
# Copiar token
```

### 2. Configurar .env

```bash
MEMBER_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TEAM_BOT_TOKEN=...
CORPORATE_BOT_TOKEN=...
```

### 3. Verificar Token

```bash
curl https://api.telegram.org/bot{TOKEN}/getMe
# Response: {"ok":true,"result":{"id":123,...}}
```

### 4. Probar Notificación

```bash
# Enviar mensaje de prueba
curl -X POST \
  -d "chat_id=YOUR_CHAT_ID&text=Test message" \
  https://api.telegram.org/bot{TOKEN}/sendMessage
```

## API Endpoints

### POST /api/notifications/subscribe
Suscribirse a notificaciones (setup polling).

**Response**:
```json
{
  "ok": true,
  "message": "Suscrito a notificaciones"
}
```

### GET /api/notifications/pending
Obtener notificaciones pendientes (polling).

**Response**:
```json
{
  "notifications": [
    {
      "type": "mission",
      "message": "✅ Misión aprobada\n+100 XP",
      "icon": "🎯"
    }
  ]
}
```

### POST /api/notifications/telegram-webhook
Enviar notificación Telegram (interno, llamado desde backend).

**Payload**:
```json
{
  "event": "mission_approved",
  "tg_id": 123456,
  "data": {
    "mission_title": "Tu primer landing",
    "xp_gained": 100,
    "new_level": 5
  }
}
```

## Notificación Examples

### Misión Aprobada
```
✅ Misión Aprobada

Tu misión Tu primer landing fue revisada y aprobada.

+100 XP
Nuevo nivel: 5

¡Sigue adelante! 🚀
```

### Logro Desbloqueado
```
🏆 ¡Nuevo Logro!

Has desbloqueado: Primeros pasos

¡Vas en buen camino! 🎯
```

### Escalación Disponible
```
🚀 Escalación Disponible

¡Completaste tus primeras misiones!

¿Estás listo para ayudar a otros?

Como TEAM podrás:
• Revisar trabajo de otros
• Dar feedback
• Ganar más XP
• Nuevo badge: Team Ally

Abre la miniapp para continuar →
```

## Troubleshooting

### No recibo notificaciones Telegram

1. ✅ Verifica token en .env
2. ✅ Verifica chat_id correcto
3. ✅ Bot tiene permisos en grupo/canal
4. ✅ Webhook URL registrada en Telegram

### Notificaciones in-app no aparecen

1. ✅ JavaScript habilitado
2. ✅ Polling en 30s (refreshing)
3. ✅ Revisa console.log para errores

### Demasiadas notificaciones

Configura en settings:
- Silenciar notificaciones de tipo "info"
- Cambiar intervalo de polling a 60s

## Métricas

**KPIs a monitorear**:
- % notificaciones enviadas exitosamente
- Latencia entre evento y notificación
- CTR (click-through rate) de notificaciones

**Logs**:
```bash
tail -f api.log | grep "notification"
```

## Changelog

- v1.0: Notificaciones in-app + Telegram
- v1.1: Polling cada 30s (antes 60s)
- v1.2: Soporte para custom emojis
