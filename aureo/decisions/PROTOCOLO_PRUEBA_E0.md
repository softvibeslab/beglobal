# Protocolo de prueba · Etapa E0 con un miembro real

Objetivo: obtener los dos datos que hoy no existen. Días hasta el primer hito aprobado, y si la talla 1 dura lo que dice. Sin backend: se usa el mapa neural en el navegador del miembro y una hoja de registro del coach.

Duración: 7 días · Participantes: 1 miembro piloto, 1 coach de Team · Herramienta: `beglobal/piloto/ruta-neural.html`

## Día 0 · Preparación (coach, 20 min)

1. Abrir el mapa en el teléfono del miembro y dejarlo en pantalla de inicio (Chrome → Añadir a pantalla de inicio).
2. Modo Miembro activo. Explicar en una frase: "Cada bolita es una etapa; solo avanzas entregando evidencia".
3. Registrar en la hoja: fecha, hora, dispositivo, experiencia previa del miembro (0 a 3).

## Días 1 a 7 · Ejecución

El miembro sigue el paso a paso de E0 en el mapa. Tres hitos:

| Hito | Talla | Estimado | Evidencia |
|---|---|---|---|
| E0-M1 Diagnóstico de fase | 1 | 1 sesión de 13 min | 5 respuestas registradas |
| E0-M2 Plan de una página | 2 | 2-3 sesiones | Documento |
| E0-M3 Cuenta BGP y 10 candidatos | 1 | 1-2 sesiones | Captura + lista con precios |

Reglas:

- El coach no empuja. Solo responde si el miembro pregunta y sigue la cadencia de recordatorio 1, 2, 3, 5 del perfil pacer, escrita a mano en WhatsApp.
- Cada entrega se revisa en menos de 24 horas. Se aprueba en modo Team desde el teléfono del coach o se devuelve con una línea.
- Toda sesión del miembro se anota: fecha, minutos, si terminó con acción.

## Hoja de registro del coach

| Fecha | Sesión (min) | Hito trabajado | ¿Terminó con acción? | Entrega | Aprobado | Nota |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## Métricas al cierre (día 7)

| Métrica | Objetivo de Áureo | Resultado |
|---|---|---|
| Días hasta E0-M1 aprobado | ≤ 3 |  |
| Días hasta E0 completa | ≤ 7 |  |
| Sesiones para E0-M2 (talla 2) | 2-3 |  |
| % de sesiones que terminan con acción | ≥ 50 % |  |
| Recordatorios enviados antes de cada entrega | ≤ 2 |  |
| Duración media de sesión | 10-15 min |  |

Cada desvío mayor a una talla se reporta a `beglobal-aureo` como dato de calibración. Exportar el estado del mapa al final: en el navegador del miembro, consola → `localStorage.getItem('bg-ruta-neural-v1')` y pegar en la hoja.

## Qué se decide con el resultado

- Si E0 cierra en 7 días o menos: arrancar E1 con el mismo miembro y sumar un segundo miembro.
- Si E0-M2 toma más de 4 sesiones: bajar el plan de una página a media página o partirlo en dos hitos de talla 1.
- Si el miembro no abre el mapa 3 días seguidos: el problema es de hábito, no de contenido; probar recordatorio con enlace directo `#M_E0-M2`.
