# Handoff en espiral entre perfiles

`member → team → corporate` es una espiral: cada salto ve ~φ veces más contexto y devuelve una decisión ~φ veces más compacta.

## Lo que sube (se comprime al 62 %)

| De | A | Entrega | Tamaño objetivo |
|---|---|---|---|
| Member | Team | Evidencia + diagnóstico + bloqueo | ≤ 8 líneas |
| Team | Corporate | Patrón del lote del día + riesgo + propuesta | ≤ 5 líneas |

## Lo que baja (se expande)

| De | A | Entrega |
|---|---|---|
| Corporate | Team | Decisión con criterio y fecha |
| Team | Member | Instrucción concreta con ejemplo y evidencia esperada |

Corporate nunca recibe conversaciones completas. Member nunca recibe políticas.
