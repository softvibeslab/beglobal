# 🌍 Guía del Orchestrator — Router Central

## Descripción General

El **Orchestrator** es el punto de entrada de Be Global Duolingo. Detecta automáticamente el perfil del usuario, valida permisos, y lo redirige al dashboard correcto.

**Ubicación**: `/app/orchestrator/index.html`

## Flujo de Entrada

### 1. Detección Automática de Perfil

```
Usuario abre el enlace
        ↓
Orchestrator lee X-Tg-Init-Data
        ↓
Intenta validar contra 3 bots (member, team, corporate)
        ↓
El primero que responda es su perfil
        ↓
Redirige al dashboard correcto
```

### 2. Primeros Usuarios

Si es la primera vez del usuario:
1. Muestra **Setup Wizard** con instrucciones
2. Valida que completó setup (click botón "Continuar")
3. Redirige a onboarding (diagnosis para members)

### 3. Escalaciones Pendientes

Si el usuario es elegible para escalar (5 misiones como member, 10 revisiones como team):
1. Muestra modal "¿Escalación Pendiente?"
2. Explica beneficios del nuevo rol
3. Propone upgrade automático
4. Si acepta: escalación + bonus XP + redirect

## API Endpoints

### `GET /api/orchestrator/detect-profile`

Detecta el perfil del usuario actual.

**Response**:
```json
{
  "profile": "member",
  "onboarding_complete": true,
  "escalation_pending": false,
  "escalation_message": null,
  "permissions": {
    "can_review_missions": false,
    "can_access_metrics": false,
    "can_make_decisions": false
  }
}
```

### `GET /api/orchestrator/onboarding-status`

Retorna qué paso del onboarding falta.

**Response**:
```json
{
  "profile": "member",
  "completed_steps": ["diagnosis"],
  "next_step": "lessons",
  "message": "Paso siguiente: lessons"
}
```

### `POST /api/orchestrator/acknowledge-setup`

Marca el setup inicial como completado.

**Response**:
```json
{
  "ok": true,
  "message": "Setup completado"
}
```

## Rutas de Redirección

| Perfil | Endpoint | Descripción |
|--------|----------|-------------|
| `member` | `/app/member/` | Dashboard de aprendizaje |
| `team` | `/app/team/` | Centro de operaciones |
| `corporate` | `/app/corporate/` | Torre de control |

## Seguridad

- ✅ Valida X-Tg-Init-Data contra tokens del bot
- ✅ HMAC signature verification
- ✅ Timestamp validation (3600s max age)
- ✅ Allowlist per profile
- ✅ Audit logging de accesos

## Troubleshooting

### "No se pudo cargar"

**Causa**: Usuario no autenticado en Telegram
**Solución**: Verificar que abre desde el bot correcto (@Beglobalplus_bot)

### "Error de autenticación"

**Causa**: X-Tg-Init-Data inválido o expirado
**Solución**: Cerrar y reabrir la miniapp

### Redirección incorrecta

**Causa**: Usuario tiene perfil inconsistente en BD
**Solución**: Contactar al equipo técnico (ejecutar audit-trail)

## Flujo Completo (Diagrama)

```
┌─────────────────────────────────────┐
│  Usuario abre /app/orchestrator/    │
└──────────────┬──────────────────────┘
               │
         ┌─────▼─────┐
         │ Detectar  │
         │  Perfil   │
         └─────┬─────┘
               │
        ┌──────┴──────┐
        │             │
    ¿Primera vez?    ¿Escalar?
        │             │
       SÍ            SÍ
        │             │
        ▼             ▼
   Setup Wizard   Modal Escalación
        │             │
        └──────┬──────┘
               │
            [Click OK]
               │
        ┌──────▼──────────┐
        │  Crear usuario  │
        │  en BD + Audit  │
        └──────┬──────────┘
               │
        ┌──────▼────────────────┐
        │ Redirect a Dashboard  │
        │ (member/team/corp)    │
        └───────────────────────┘
```

## Monitoreo

**Métricas importantes**:
- Tasa de escalación (member→team, team→corp)
- Bounce rate en setup wizard
- Tiempo promedio a primer dashboard
- Errores de autenticación por hora

**Logs a revisar**:
```
tail -f api.log | grep "orchestrator"
tail -f audit_trail.log | grep "profile_detected"
```
