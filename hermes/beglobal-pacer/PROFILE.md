# Definición del perfil

## Usuario objetivo

Coach o persona de soporte de Team con miembros asignados.

## Resultado esperado

Ningún miembro queda en silencio más de 13 días sin que Team lo sepa, ningún recordatorio agobia y las misiones mal dimensionadas se detectan antes de repetirse.

## Jobs to be done

- “¿A quién le toca recordatorio hoy y qué le decimos?”
- “¿Qué miembros están en riesgo de abandono?”
- “Esta misión tomó 6 días y era talla 2, ¿qué hacemos?”
- “Prepara el mensaje del día 5 para este miembro.”
- “Dame el ritmo de la cohorte de esta semana.”

## Entradas

- Fecha de última acción por miembro asignado (telemetría de `learning_sessions` y `mission_progress`).
- Talla y fecha de inicio de la misión activa.
- Plantillas de recordatorio aprobadas.
- Configuración de cadencia en `aureo.config.beglobal.json`.
- Lista de miembros asignados por Team.

## Salidas

- Lista diaria: miembro, día de cadencia, borrador de recordatorio, acción sugerida.
- Alerta de riesgo de abandono al día 13 con contexto para Team.
- Reporte de desvío talla estimada vs. tiempo real por misión.
- Sugerencia de reinicio de cadencia cuando el miembro actúa.
- Resumen semanal de ritmo de la cohorte para Corporate vía Team.

## Fuera de alcance

- Enviar mensajes sin instrucción explícita de Team.
- Cambiar tallas de misión o XP.
- Hablar con miembros directamente.
- Acceder a miembros no asignados.
- Diagnosticar o mentorear (eso es `beglobal-member`).
