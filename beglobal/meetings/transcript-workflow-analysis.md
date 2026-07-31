# Be Global Pro — Análisis de workflows y escalera de valor

Fuente analizada: `Meeting Transcription (9).txt`  
Reunión: 27 de julio de 2026  
Duración: 155 minutos

## Hallazgo rector

La reunión describe una escalera de entrenamiento, no tres agentes aislados:

`Corporate → Team → Member → evidencia → Team → Corporate`

- **Corporate** conserva metodología, plantillas, reglas, permisos y decisión.
- **Team** convierte el método en operación, QA, soporte, contenido y
  escalamiento.
- **Member** recibe una experiencia simple de nivel asistente, completa una
  misión y devuelve evidencia.
- La evidencia del miembro alimenta defectos y mejoras del equipo.
- Los patrones validados por el equipo regresan a Corporate para aprobación y
  versionado.

## Evidencia principal de la transcripción

| Tiempo | Evidencia | Implicación para el producto |
|---|---|---|
| 01:01:55–01:03:29 | El principal cuello de botella es crear contenido, comprender estructuras de video, grabar y editar. | Debe existir un workflow de contenido desde referencia hasta evidencia publicable. |
| 01:07:16–01:10:33 | El agente diagnostica fase, recomienda recursos y guía la configuración de una tienda. | El perfil Member necesita diagnóstico y misiones de contenido o tienda. |
| 01:11:02–01:11:40 | Be Global quiere aplicar sus plantillas y conservar supervisión humana. | Los workflows deben aceptar templates, versionado y checkpoints humanos. |
| 01:17:25–01:18:28 | Se propone un formulario estándar con paleta, productos y pasos iguales para todos. | El builder debe capturar entradas, salidas, responsables y evidencia por paso. |
| 01:18:39–01:20:02 | Primero se prueba internamente y el equipo entrena el sistema antes de escalar. | Corporate entrena Team; no se activa Member antes del QA interno. |
| 01:21:52–01:23:49 | Se proponen tres participantes y perfiles: corporativo, equipo/vendedor y socio. | Los datos, autoridad y workflows deben permanecer separados. |
| 01:23:27–01:23:39 | “El empresarial entrenaría a todos los demás”. | Corporate es la fuente superior de conocimiento y reglas. |
| 01:29:18–01:31:10 | El socio típico no quiere MCPs ni arquitectura; quiere pedir “hazme la tienda”. | Member debe operar con lenguaje natural y alcance reducido. |
| 01:30:43–01:33:25 | Corporate tendría niveles avanzados y entrenaría el asistente personalizado del socio. | La escalera de valor debe mostrar niveles distintos de autonomía. |
| 01:33:56–01:34:47 | El sistema puede recibir video, imagen, PDF, Word, Excel, PowerPoint, audio y enlaces. | Se necesita un Media Hub con tipos diversos y vínculos a workflows. |
| 01:36:44–01:38:56 | Se quieren replicar templates de video y probar el proceso como un socio desde cero. | Cada workflow necesita casos de prueba, entradas, outputs y evidencia de aceptación. |
| 01:43:26–01:45:37 | Archivos pesados pueden requerir un enlace o almacenamiento intermedio. | El Media Hub debe admitir archivos locales y referencias por URL. |
| 01:46:04–01:48:00 | Se solicita onboarding optimizado, curso de mejores prácticas, sesión en vivo, video y guía escrita. | Team necesita un workflow de capacitación del miembro y materiales versionados. |
| 01:48:30–01:51:58 | El agente extrae gancho, escenas, problema, beneficio, CTA y tomas desde un video plantilla. | El workflow de contenido debe representar esas etapas explícitamente. |
| 01:51:58–01:53:22 | Se requiere un agente para educar y otro para probar como socio desde cero. | Separar entrenamiento interno de experiencia Member. |
| 02:00:17–02:00:38 | Se formaliza la propuesta de tres perfiles: dueño, equipo y cliente. | El dashboard debe ofrecer un builder independiente por perfil. |
| 02:12:10–02:13:42 | Los flujos básicos y los avanzados tienen costos distintos; el video profesional es un upsell. | Cada workflow debe marcar nivel, costo/riesgo y dependencias avanzadas. |
| 02:32:50–02:33:41 | “Este es para ti, este para tus empleados y este para tus clientes”; el superior entrena al inferior. | La escalera Corporate → Team → Member es el modelo operativo explícito. |

## Workflows iniciales

### Corporate

1. Curar conocimiento y medios oficiales.
2. Convertir metodología en reglas, templates y criterios.
3. Aprobar workflows y permisos.
4. Entrenar al equipo interno.
5. Revisar QA, métricas y defectos.
6. Publicar una versión aprobada o revertir.

### Team

1. Recibir paquete versionado de Corporate.
2. Ejecutar casos como miembro desde cero.
3. Validar contenido, tienda, seguridad y escalamiento.
4. Registrar defectos y proponer correcciones.
5. Preparar guía escrita, video y sesión en vivo.
6. Entrenar al miembro y observar la primera misión.

### Member

1. Completar diagnóstico breve.
2. Seleccionar una misión: contenido o tienda.
3. Entregar datos, fotos, producto o referencia.
4. Recibir máximo tres acciones.
5. Producir un guion, contenido o brief utilizable.
6. Enviar evidencia y satisfacción.

## Reglas de diseño

- Ningún archivo subido implica aprobación automática.
- Ningún paso sensible puede saltarse el checkpoint humano.
- Un workflow debe registrar owner, duración, inputs, outputs, estado y
  evidencia.
- Los materiales pueden ser fuente, template, ejemplo, evidencia o
  capacitación.
- Los archivos y memoria no se comparten entre perfiles sin vínculo explícito.
- El miembro no recibe herramientas avanzadas solo porque existan en Corporate.
- Los aprendizajes suben por evidencia; la autoridad baja por versiones
  aprobadas.

