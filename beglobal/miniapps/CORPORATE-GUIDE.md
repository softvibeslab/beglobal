# 🏛️ Guía de Corporate — Torre de Control

## Descripción General

La **Torre de Control** es el dashboard de gobernanza para decisiones estratégicas, métricas agregadas y gates de despliegue.

**Ubicación**: `/app/corporate/index.html`

## Funcionalidades Principales

### Tab 1: Métricas en Vivo

**Socios Activos**: Usuarios con racha >0 en últimos 7 días
**Misiones Completadas**: Total de misiones revisadas y aprobadas
**Score Promedio**: Calificación 1-5 de todas las misiones
**Racha 7+ Días**: Usuarios con participación consistente

**Auto-refresh**: Cada 60 segundos

### Tab 2: Gates de Despliegue

**5 Gates críticos antes de Go-Live**:

1. **20+ Socios Registrados**
   - Base de usuarios mínima
   - Status: ✅ o ⬜
   - Click "Completar" cuando se alcance

2. **50+ Misiones Completadas**
   - Volumen de pruebas
   - Status: ✅ o ⬜

3. **Score Promedio ≥4.0**
   - Calidad de entregables
   - Status: ✅ o ⬜

4. **Cero Escalamientos Críticos**
   - Todos los problemas resueltos
   - Status: ✅ o ⬜

5. **Todas Decisiones Aprobadas**
   - Gobernanza alineada
   - Status: ✅ o ⬜

**Progress Bar**: Indica % de gates completados
**ETA**: Estimado de días para Go-Live

### Tab 3: Decisiones Críticas

**Workflow**:
1. Propones nueva decisión
   - Título: "Escalar a 100 socios"
   - Impact: 1-10 (default 5)
   - Detalles: descripción

2. Sistema registra en audit trail

3. Status pasa a "⏳ Pendiente"

4. Otros corporate votan
   - ✅ Aprobar
   - ❌ Rechazar

5. Queda registrada con razón y votante

**Ejemplos**:
- "Cambiar estructura de pagos"
- "Usar Google Ads vs Meta"
- "Escalar a 100 socios nuevos"

### Tab 4: Audit Trail

**Completa trazabilidad de**:
- Misiones aprobadas/rechazadas
- Usuarios escalados
- Decisions votadas
- Gates completados
- Cambios en configuración

**Campos**:
- Acción (mission_approved, escalated, decision_made)
- Actor (nombre del usuario)
- Perfil (member, team, corporate)
- Timestamp (relativo: "hace 2 horas")
- Recurso (mission #123, decision #4, etc)

## Go-Live Checklist

```
BEFORE DEPLOYING TO PRODUCTION:

□ Gate 1: 20+ socios          [check: x/20]
□ Gate 2: 50+ misiones        [check: y/50]
□ Gate 3: Score ≥4.0          [check: z/5]
□ Gate 4: Cero escalamientos  [check: 0 críticos]
□ Gate 5: Decisiones votadas  [check: n/n aprobadas]

Get ready % = gates_done / 5 * 100

Ready to GO when 100%
```

## Notifications

### Que recibes (Telegram):
- 🔔 Misiones aprobadas (daily)
- 🚨 Escalamientos críticos
- 📊 Reporte diario de métricas

### Que envías:
- ✅ Aprobación de decisión → audit log
- ❌ Rechazo de decisión → audit log

## Key Metrics to Monitor

| Métrica | Meta | Rojo | Verde |
|---------|------|------|-------|
| Socios Activos | 20+ | <5 | ≥20 |
| Missiones/día | 10+ | <3 | ≥10 |
| Score Promedio | ≥4.0 | <3.5 | ≥4.0 |
| Escalamientos abiertos | 0 | >2 | 0 |
| Tiempo decisión | <48h | >72h | <48h |

## API Endpoints

### GET /api/corporate/metrics
Métricas agregadas del sistema.

### GET /api/corporate/metrics/trending?days=7
Datos por día para gráficos.

### GET /api/corporate/gates
Lista de gates con status.

### POST /api/corporate/gates/{id}/complete
Marcar gate como completado.

### GET /api/corporate/decisions
Listado de decisiones.

### POST /api/corporate/decisions/{id}/decide
Votar (approve/reject) una decisión.

### GET /api/corporate/audit-trail?limit=50
Historial de auditoría.

### GET /api/corporate/go-live-check
Verificar readiness para Go-Live.

## Troubleshooting

### Métrica desactualizada

**Causa**: No se refresca
**Solución**: Click botón refresh o esperar 60s

### No puedo crear decisión

**Causa**: Título vacío
**Solución**: Llena el campo de título

### Gate no se marca como completado

**Causa**: Criterio aún no alcanzado
**Solución**: Verifica que met objetivo (20+ socios, etc)

## Best Practices

1. **Decisiones claras**: Título + detalles específicos
2. **Vote rápido**: No dejes decisiones >48h pendientes
3. **Monitor gates**: Check weekly progress
4. **Audit trail**: Referencia cuando hay dispute
5. **ETA realista**: Adjust basado en velocity actual

## Escalación desde Team

Cuando un **Team** completa 10 revisiones:
1. Sistema detecta elegibilidad
2. Recibe modal de escalación
3. Confirma upgrade
4. Se convierte en **Corporate**
5. Acceso inmediato a Torre de Control
