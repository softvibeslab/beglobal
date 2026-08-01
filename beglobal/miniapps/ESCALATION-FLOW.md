# 🚀 Guía de Escalación Automática

## Concepto

Los usuarios **escalan automáticamente** a través de roles cuando alcanzan hitos.

```
Member (Aprendiz)
    ↓ [5 misiones completadas]
    ↓ [+500 XP bonus]
Team (Revisor)
    ↓ [10 misiones revisadas]
    ↓ [+1000 XP bonus]
Corporate (Gobernante)
```

## Member → Team

**Requisito**: 5 misiones completadas

**Cómo ocurre**:
1. Usuario completa 5ª misión
2. Sistema detecta elegibilidad
3. Muestra modal "¿Listo para Team?"
4. Explica beneficios:
   - Revisar trabajo de otros
   - Dar feedback
   - Ganar más XP
   - Nuevo badge: "Team Ally"
5. Usuario acepta o rechaza
6. Si acepta:
   - Perfil cambia a "team"
   - Recibe 500 XP
   - Redirige a Team Dashboard
   - Audit log: "member_escalated_to_team"

**Qué cambia**:
- Dashboard diferente
- Acceso a cola de misiones
- Ver analytics del team
- Rol en audit trail: "team"

## Team → Corporate

**Requisito**: 10 misiones revisadas

**Cómo ocurre**:
1. Team revisa 10ª misión
2. Sistema detecta elegibilidad
3. Muestra modal "¿Listo para Corporate?"
4. Explica beneficios:
   - Ver métricas globales
   - Tomar decisiones críticas
   - Acceso a gates
   - Role: "Gobernanza"
5. User acepta o rechaza
6. Si acepta:
   - Perfil cambia a "corporate"
   - Recibe 1000 XP
   - Redirige a Torre de Control
   - Audit log: "team_escalated_to_corporate"

**Qué cambia**:
- Dashboard gobernanza
- Ver todos los socios
- Votación de decisiones
- Manage gates de despliegue
- Rol en audit trail: "corporate"

## Eligibility Check

**Endpoint**: `GET /api/escalation/check-eligibility`

**Response Example**:
```json
{
  "eligible": true,
  "current_profile": "member",
  "next_profile": "team",
  "progress": 5,
  "requirement": 5,
  "bonus_xp": 500
}
```

## Irreversibilidad

⚠️ **IMPORTANTE**: Escalación es **irreversible**.

Una vez escalado:
- No puedes volver atrás
- Pierdes acceso a dashboard anterior
- Ganas permisos del nuevo rol

## Why Escalation?

1. **Engagement**: Progresión clara y recompensada
2. **Quality**: Miembros probados antes de ser Team
3. **Governance**: Team probado antes de ser Corporate
4. **Retention**: Gives users new goals

## Rollout Strategy

**Phase 1**: Member → Team (después de 1 semana de data)
**Phase 2**: Team → Corporate (después de 2 semanas de data)
**Phase 3**: Monitor retention post-escalation

## Troubleshooting

### "No me aparece modal de escalación"

**Posible causa**: No alcanzaste requisito (5 misiones)
**Verificar**: Ve a Dashboard → Stats

### "Acepté pero no se escaló"

**Posible causa**: Error en API
**Solución**: Recarga página y reintenta

### "Necesito volver atrás"

**Posible causa**: Escalación irreversible
**Solución**: Contactar support (cambio manual en BD)
