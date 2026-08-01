# 📋 Guía de Audit Trail

## Qué es

**Audit Trail** es el registro completo e inmutable de todas las acciones críticas del sistema.

- ✅ Quién hizo qué
- ✅ Cuándo lo hizo
- ✅ Qué recurso fue afectado
- ✅ Detalles adicionales

## Acceso

**Ubicación**: Corporate Dashboard → Tab "Audit"

**Datos mostrados**:
- Acción (mission_approved, escalated, decision_made, etc)
- Actor (nombre del usuario)
- Perfil del actor (member, team, corporate)
- Timestamp (relativo: "hace 2h", "hace 1d")
- Recurso (tipo + ID: mission #123, decision #5)

## Eventos Registrados

| Evento | Actor | Recurso | Cuándo |
|--------|-------|---------|--------|
| mission_approved | Team | Mission ID | Cuando se aprueba |
| mission_rejected | Team | Mission ID | Cuando se pide cambios |
| escalated_to_team | Member | User ID | Cuando sube a Team |
| escalated_to_corporate | Team | User ID | Cuando sube a Corporate |
| decision_made | Corporate | Decision ID | Cuando se vota decisión |
| gate_completed | Corporate | Gate ID | Cuando se marca gate |
| setup_acknowledged | User | User ID | Cuando completa setup |

## Query Examples

### Ver todas las misiones aprobadas
```bash
GET /api/corporate/audit-trail?filter=mission_approved
```

### Ver escalamientos en últimas 24h
```bash
GET /api/corporate/audit-trail?filter=escalated
```

### Ver decisiones votadas
```bash
GET /api/corporate/audit-trail?filter=decision_made
```

### Exportar audit trail completo
```bash
GET /api/corporate/audit-trail/export?format=csv
```

## Use Cases

### Dispute Resolution
User: "No recibí aprobación"
Team: Busca en audit → "mission #456 aprobada por @team_admin hace 2h"

### Performance Review
Manager: "¿Cuántas misiones aprobó este team?"
Corporate: Filtra `mission_approved` + actor name + date range

### Compliance
Auditor: "Necesitamos log de todas las decisiones"
Corporate: Exporta CSV de audit trail

## Data Retention

- ✅ **Almacenamiento**: Permanente en BD
- ✅ **Confidencialidad**: Solo Corporate puede ver
- ✅ **Backup**: Incluido en dumps diarios
- ✅ **Purge**: Ningún registro se borra

## Schema

```sql
CREATE TABLE audit_trail (
  id INTEGER PRIMARY KEY,
  timestamp INTEGER,           -- Unix timestamp
  actor_tg_id INTEGER,         -- Quién lo hizo
  actor_profile TEXT,          -- Perfil del actor (member/team/corporate)
  action TEXT,                 -- Qué hizo (mission_approved, etc)
  resource_type TEXT,          -- Tipo de recurso (mission, user, decision)
  resource_id TEXT,            -- ID del recurso
  details TEXT                 -- JSON con detalles adicionales
);

CREATE INDEX idx_audit_timestamp ON audit_trail(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_trail(action);
```

## Interpretar Timestamps

- "ahora" = hace <60s
- "2m" = hace 2 minutos
- "1h" = hace 1 hora
- "1d" = hace 1 día

## Troubleshooting

### "No veo evento que debería estar aquí"

**Posible causa**: Filtro mal configurado
**Solución**: Usa `/api/corporate/audit-trail?limit=100` sin filtro

### "Audit trail muy largo, necesito un rango de fechas"

**Posible causa**: No hay filtro de fechas en API
**Solución**: Descarga CSV y filtra en Excel/GSheets

### "Sospecho manipulación de audit trail"

**Causa**: Sistema inmutable por diseño
**Verificar**: Los timestamps deben ser secuenciales (no retroceden)

## Compliance Considerations

- ✅ GDPR-ready: Datos de usuario linkados
- ✅ Non-repudiation: Firma HMAC en eventos críticos
- ✅ Tamper-evident: Timestamps verificables
- ✅ Export-ready: CSV, JSON disponibles
