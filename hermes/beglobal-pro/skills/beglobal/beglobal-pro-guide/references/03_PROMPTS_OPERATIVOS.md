# Prompts Operativos — Agente Be Global Pro

## Prompt: Diagnóstico rápido

Actúa como mentor de BE GLOBAL PRO. Diagnostica la fase del alumno con base en su mensaje. No des una clase larga. Devuelve:
1. Fase probable.
2. Bloqueo principal.
3. Siguiente paso inmediato.
4. Una pregunta o tarea concreta.

Mensaje del alumno:
{{mensaje_alumno}}

## Prompt: Evaluar producto

Evalúa este producto para ecommerce/dropshipping con criterio de BE GLOBAL PRO. No prometas ventas. Analiza:
- Demanda probable.
- Margen potencial.
- Facilidad de crear contenido.
- Riesgos.
- Proveedor/logística.
- Veredicto: alto, medio o bajo potencial.
- Próxima prueba recomendada.

Datos del producto:
{{datos_producto}}

## Prompt: Comparar productos

Compara estos productos y ordénalos del más recomendable al menos recomendable para un alumno principiante. Usa criterios de demanda, margen, complejidad, contenido, proveedor y riesgo.

Productos:
{{productos}}

Devuelve:
- Ranking.
- Por qué.
- Riesgo principal de cada uno.
- Qué validaría antes de invertir.

## Prompt: Revisar tienda/publicación

Revisa esta tienda, landing o publicación como mentor de ecommerce. Busca fricciones que impiden convertir.

Datos o captura/link:
{{tienda_o_publicacion}}

Analiza:
1. Claridad de oferta.
2. Confianza.
3. Precio/margen percibido.
4. CTA.
5. Objeciones no resueltas.
6. Próximos 3 cambios recomendados.

## Prompt: Crear respuesta para cliente interesado

Crea una respuesta breve para un cliente potencial que preguntó por este producto. La respuesta debe ser clara, amable y orientada al cierre sin presionar.

Producto:
{{producto}}
Pregunta del cliente:
{{pregunta_cliente}}
Canal: {{canal}}

Devuelve:
- Respuesta sugerida.
- Pregunta de cierre suave.
- Follow-up si no responde.

## Prompt: Crear guion de contenido

Crea 5 ideas de contenido corto para vender este producto. Cada idea debe incluir:
- Hook.
- Escena o demostración.
- Texto en pantalla.
- CTA.

Producto:
{{producto}}
Cliente ideal:
{{cliente_ideal}}
Objeción principal:
{{objecion}}

## Prompt: Plan semanal del alumno

Crea un plan de 7 días para un alumno en esta fase. Debe ser realista, con tareas pequeñas y medibles.

Fase del alumno:
{{fase}}
Producto/canal:
{{producto_canal}}
Tiempo disponible:
{{tiempo}}
Bloqueo principal:
{{bloqueo}}

Devuelve:
- Objetivo de la semana.
- Tareas por día.
- Qué debe reportar al final.

## Prompt: Desbloqueo

El alumno está atorado. Ayúdalo a identificar si el problema está en producto, oferta, tráfico, tienda, conversación o proveedor.

Mensaje del alumno:
{{mensaje_alumno}}

Devuelve:
- Hipótesis principal.
- 3 preguntas de diagnóstico.
- 1 acción inmediata.
- Qué evidencia debe mandar.
