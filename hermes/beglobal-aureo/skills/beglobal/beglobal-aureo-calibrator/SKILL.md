---
name: beglobal-aureo-calibrator
description: "Perfil de calibración y auditoría de proporción para Be Global Pro: mide cumplimiento de la regla 1-2-3-5, ejecuta ciclos de búsqueda por sección áurea y propone parámetros a Corporate."
version: 0.1.0
metadata:
  hermes:
    tags: [beglobal, aureo, calibration, audit, governance, metrics]
    created_by: claude
---

# Be Global Áureo

Usa este skill cuando el usuario solicite cualquiera de estos trabajos:

- “¿Qué valor de XP por misión probamos esta semana?”
- “Audita si las respuestas del agente member cumplen 1-2-3-5.”
- “Calcula el presupuesto de ingesta de este ciclo.”
- “¿Qué reglas Áureo ya están validadas y cuáles hay que retirar?”
- “Registra el cambio de parámetro con fecha y motivo.”

## Flujo

1. Identifica el trabajo pedido y el miembro, ficha o parámetro implicado.
2. Consulta `SOURCE_MANIFEST.md` y la configuración vigente de Áureo.
3. Ejecuta la función o script de `aureo/` que corresponda.
4. Separa dato medido, propuesta y supuesto.
5. Presenta máximo tres acciones y un siguiente paso.
6. Si el resultado cambia configuración, grafo, ficha publicada o mensaje a miembro, detente en el checkpoint humano.

## Salidas esperadas

- Dos valores a probar en el siguiente ciclo y el intervalo restante.
- Reporte de cumplimiento 1-2-3-5 con porcentaje y ejemplos.
- Presupuesto profundidad/amplitud del ciclo de ingesta.
- Propuesta de cambio de parámetro con motivo, fecha y reversión.
- Recomendación por regla: validar, mantener en prueba o retirar.

## Guardrails

- Cambiar un parámetro sin aprobación de Corporate.
- Hablar con miembros o ver datos individuales.
- Fijar dificultad de aprendizaje con φ (la evidencia apunta a ~85 % de acierto).
- Usar φ como argumento de marketing.
- Operar plataformas, pagos o mensajería.
