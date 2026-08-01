# 🤝 Guía del Team — Centro de Operaciones

## Descripción General

El **Team Dashboard** es la interfaz de operaciones para revisar trabajo de miembros, dar feedback y gestionar escalamientos.

**Ubicación**: `/app/team/index.html`

## Funcionalidades Principales

### Tab 1: Cola de Misiones

**Responsabilidades**:
- ✅ Revisar misiones enviadas por miembros
- ⭐ Calificar 1-5 estrellas
- 💬 Dar feedback constructivo
- ✋ Pedir cambios si es necesario

**Workflow**:
1. Nueva misión aparece en cola
2. Click "Revisar" → abre modal
3. Lees descripción y nota del miembro
4. Califica (1-5 ⭐)
5. Escribes feedback (opcional)
6. Click "Aprobar" o "Pedir cambios"
7. Se notifica al miembro automáticamente

**Filtros disponibles**:
- Todas
- ⭐ Fácil
- ⭐⭐ Normal
- ⭐⭐⭐ Difícil

**Bulk Actions**:
- Selecciona múltiples misiones
- Click "Aprobar seleccionadas"
- Todas se aprueban con score 4/5 automático

### Tab 2: Escalamientos

**Qué es**:
- Soporte escalado cuando miembro tiene problema
- Requiere decisión del team
- Se registra en audit trail

**Estados**:
- ⏳ Pendiente → acciones necesarias
- ✅ Resuelto → problema solucionado
- ✋ Descartado → no procede

### Tab 3: Analytics

**Métricas disponibles**:
- Misiones revisadas (últimos 7 días)
- Score promedio
- Tasa de rechazo (meta: <10%)
- Tiempo promedio de revisión
- Historial de últimos eventos

**Cómo interpretarlas**:
- Score promedio ≥4 = Buena calidad
- Tasa rechazo <10% = Miembros con buen nivel
- Tiempo rápido = Team eficiente

## Escalación Automática

Después de revisar 10 misiones, el team es elegible para escalar a **Corporate**.

**Beneficios**:
- Ver métricas globales
- Tomar decisiones críticas
- Acceso a gates de despliegue
- +1000 XP bonus

## Scoring Guidelines

| ⭐ | Criterio | Acción |
|---|----------|--------|
| 1 | No cumple requisitos | Pedir cambios |
| 2 | Cumple parcialmente | Pedir cambios + feedback |
| 3 | Cumple con reservas | Aprobar pero con nota |
| 4 | Cumple completamente | Aprobar (default) |
| 5 | Excepcional + bonusXP | Aprobar con felicitaciones |

## Notificaciones

### Que recibes:
- 🔔 Nueva misión en cola
- 💬 Miembro escaló un problema

### Que envías:
- ✅ Misión aprobada → +XP al miembro
- ❌ Cambios solicitados → notificación al miembro
- 📊 Métricas diarias → a Corporate

## API Key Endpoints

### GET /api/team/missions-queue?difficulty=all
Lista misiones por revisar (filtrable).

### POST /api/team/missions/approve-bulk
Aprobar múltiples misiones de una vez.

### GET /api/team/analytics
Métricas del team (7 días).

### GET /api/team/history?days=7
Historial de revisiones.

### POST /api/missions/{id}/approve
Aprobar una misión individual.

## Monitoring

**KPIs a trackear**:
- Volumen de misiones/día
- Velocidad de revisión
- Quality score
- Escalamientos abiertos

**Red flags**:
- ⚠️ Tasa rechazo >15%
- ⚠️ Tiempo promedio >2h
- ⚠️ Escalamientos sin resolver >3

## Troubleshooting

### Misión no aparece

**Causa**: Todavía no fue enviada o está esperando aprobación
**Solución**: Refrescar página, revisar filtros

### No puedo dar score

**Causa**: Calificación no seleccionada
**Solución**: Click en un ⭐ antes de aprobar

### Miembro no recibe notificación

**Causa**: Webhook Telegram no configurado
**Solución**: Verificar MEMBER_BOT_TOKEN en .env

## Best Practices

1. **Feedback claro**: Explica QUÉ mejorar, no solo CÓMO
2. **Responder rápido**: <2 horas es ideal
3. **Ser justo**: Score 4 es excelente, no esperes 5 siempre
4. **Escalamientos**: Resuelve rápido o escala a Corporate
5. **Documentar**: Todo queda en audit trail

## Escalación a Corporate

Cuando estés listo para pasar a gobernar el sistema:

1. Completa 10 revisiones mínimo
2. Sistema detecta elegibilidad automáticamente
3. Recibes modal de escalación
4. Confirmas upgrade
5. Eres **Corporate** (acceso a torre de control)
