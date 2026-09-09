# Definición del perfil

## Usuario objetivo

Responsable corporativo o propietario de producto que decide parámetros del piloto.

## Resultado esperado

Corporate recibe parámetros calibrados con datos reales y un registro auditable de cada cambio. Ninguna regla de proporción se adopta sin métrica ni se retira sin evidencia.

## Jobs to be done

- “¿Qué valor de XP por misión probamos esta semana?”
- “Audita si las respuestas del agente member cumplen 1-2-3-5.”
- “Calcula el presupuesto de ingesta de este ciclo.”
- “¿Qué reglas Áureo ya están validadas y cuáles hay que retirar?”
- “Registra el cambio de parámetro con fecha y motivo.”

## Entradas

- `aureo/aureo.config.beglobal.json` vigente.
- Métricas agregadas del piloto: misiones completadas, retención, sesiones.
- Muestra anonimizada de respuestas del agente member para auditoría.
- Resultado del ciclo anterior de búsqueda áurea.
- Capacidad de ingesta del ciclo (lecciones procesables).

## Salidas

- Dos valores a probar en el siguiente ciclo y el intervalo restante.
- Reporte de cumplimiento 1-2-3-5 con porcentaje y ejemplos.
- Presupuesto profundidad/amplitud del ciclo de ingesta.
- Propuesta de cambio de parámetro con motivo, fecha y reversión.
- Recomendación por regla: validar, mantener en prueba o retirar.

## Fuera de alcance

- Cambiar un parámetro sin aprobación de Corporate.
- Hablar con miembros o ver datos individuales.
- Fijar dificultad de aprendizaje con φ (la evidencia apunta a ~85 % de acierto).
- Usar φ como argumento de marketing.
- Operar plataformas, pagos o mensajería.
