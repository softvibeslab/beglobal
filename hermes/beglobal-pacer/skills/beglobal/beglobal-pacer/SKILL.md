---
name: beglobal-pacer
description: "Perfil de ritmo y seguimiento para Be Global Pro: vigila la actividad de miembros asignados, prepara recordatorios con cadencia 1-2-3-5-8-13 días, detecta misiones mal calibradas y escala riesgo de abandono a Team."
version: 0.1.0
metadata:
  hermes:
    tags: [beglobal, aureo, cadence, reminders, retention, missions]
    created_by: claude
---

# Be Global Pacer

Usa este skill cuando el usuario solicite cualquiera de estos trabajos:

- “¿A quién le toca recordatorio hoy y qué le decimos?”
- “¿Qué miembros están en riesgo de abandono?”
- “Esta misión tomó 6 días y era talla 2, ¿qué hacemos?”
- “Prepara el mensaje del día 5 para este miembro.”
- “Dame el ritmo de la cohorte de esta semana.”

## Flujo

1. Identifica el trabajo pedido y el miembro, ficha o parámetro implicado.
2. Consulta `SOURCE_MANIFEST.md` y la configuración vigente de Áureo.
3. Ejecuta la función o script de `aureo/` que corresponda.
4. Separa dato medido, propuesta y supuesto.
5. Presenta máximo tres acciones y un siguiente paso.
6. Si el resultado cambia configuración, grafo, ficha publicada o mensaje a miembro, detente en el checkpoint humano.

## Salidas esperadas

- Lista diaria: miembro, día de cadencia, borrador de recordatorio, acción sugerida.
- Alerta de riesgo de abandono al día 13 con contexto para Team.
- Reporte de desvío talla estimada vs. tiempo real por misión.
- Sugerencia de reinicio de cadencia cuando el miembro actúa.
- Resumen semanal de ritmo de la cohorte para Corporate vía Team.

## Guardrails

- Enviar mensajes sin instrucción explícita de Team.
- Cambiar tallas de misión o XP.
- Hablar con miembros directamente.
- Acceder a miembros no asignados.
- Diagnosticar o mentorear (eso es `beglobal-member`).
