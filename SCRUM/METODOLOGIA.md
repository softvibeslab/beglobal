# Metodología · Scrum adaptado a Roger + Codex

Estado: acuerdo de trabajo **propuesto**, no contrato ni autorización de implementación.

## 1. Marco y adaptación

Usamos objetivo de producto, backlog ordenado, objetivos de sprint, revisión y retrospectiva como referencias de Scrum. La responsabilidad de priorización y aceptación de producto corresponde a Roger. La guía distingue Product Owner, Scrum Master y Developers; aquí las tareas de facilitación y desarrollo se concentran operativamente en Codex, sin presentar a una IA como un equipo humano independiente. Fuente del marco: [Scrum Guide oficial](https://scrumguides.org/scrum-guide.html).

El resto de este documento es una propuesta específica de BeGlobal. “Sprint 0” es nuestro nombre para preparación, no un evento adicional prescrito por Scrum. No se convierte documentación histórica en un incremento productivo terminado.

## 2. Producto y medida de valor

Objetivo: que un miembro pase de una duda o bloqueo a una misión verificable, conserve su avance y pueda ampliar sus capacidades con contenido y conexiones autorizadas. El negocio busca mejorar atención, activación y permanencia; **no se garantiza ahorro, ingreso pasivo ni LTV de cinco años** sin medición.

Cada sprint debe demostrar un resultado observable. “Instalar herramientas” o “crear 20 archivos” son tareas, no por sí solos valor para el miembro. Una historia técnica explica qué capacidad segura habilita y cómo se comprueba.

## 3. Responsabilidades y asignaciones

| Rol operativo | Responsable propuesto | Puede decidir | No puede asumir |
|---|---|---|---|
| Product Owner / sponsor | Roger | Prioridad, objetivo, alcance, aceptación; coordinar decisiones de la alianza | Autoridad técnica o contractual de terceros no delegada |
| Facilitación y ejecución | Codex | Descomposición, implementación local autorizada, pruebas, bitácora, propuestas de ajuste | Precios, gastos, publicaciones, producción o permisos no aprobados |
| Dueño de membresías | Técnico de BeGlobal, por nombrar | Contrato y sandbox de su plataforma | Identidades o estados inventados para permitir PRO |
| Revisión técnica independiente | Por nombrar cuando el gate la exija | Revisión de seguridad, cambio y liberación | Dar por revisado código que no inspeccionó |
| Operación / soporte | BeGlobal + Softvibes, por nombrar | Canal, atención, escalamiento, runbooks | SLA ni guardias sin recursos acordados |

Las asignaciones del backlog son propuestas hasta aprobar el sprint. Ninguna crea cuentas, envía notificaciones o contrata personas. No se activan subagentes automáticamente; si se desea ejecución paralela por agentes, se autoriza explícitamente su alcance.

## 4. Ritmo y control

1. **Refinamiento previo:** Codex prepara objetivo, historias pequeñas, criterios comprobables, dependencias, insumos, exclusiones, presupuesto, pruebas y demo.
2. **Paquete de arranque:** Roger responde una vez las decisiones que bloquean ese sprint. Las decisiones de producción pueden seguir pendientes si quedan explícitamente fuera del alcance.
3. **Planificación y aprobación:** resolver Ready, fijar responsable, versión/huella del paquete, ventana de trabajo y capacidad provisional. Registrar una respuesta real de Roger; nunca completar una aprobación por inferencia o silencio.
4. **Ejecución:** una historia principal en curso; tareas internas pueden combinarse sin ampliar el objetivo. Registrar avances al terminar una unidad de trabajo y al cerrar la sesión. Durante una sesión activa, las actualizaciones son informativas y no esperan aprobación.
5. **Revisión:** demo reproducible, criterios con evidencias, pendientes, riesgos y diferencias frente al plan. Roger acepta o devuelve cada historia. Se entrega el estado incluso si el tiempo terminó sin completar todo.
6. **Retrospectiva:** elegir como máximo dos mejoras con dueño y condición/fecha de comprobación antes del siguiente compromiso.

Cadencia inicial propuesta: sprints de cinco días hábiles con fechas explícitas **antes de iniciar**. Los puntos no son horas ni días. No hay velocidad histórica; SP-001 usa un sobre de planificación experimental de 16 puntos y propone 13 (81.25%). No es capacidad observada ni promesa de terminarlo en cinco días. La aprobación puede reducir alcance o ajustar la ventana antes de congelarlo.

Una vez empezado, el timebox no se alarga para aparentar cumplimiento. Se revisa lo obtenido al vencer y lo no aceptado vuelve al backlog, sin puntos parciales. El objetivo sólo se cancela por decisión del Product Owner; un bloqueo pausa la historia, no concede permiso para cambiar el objetivo.

**Límite de ejecución:** Codex trabaja mientras haya una sesión o mecanismo de ejecución activo disponible. Este repositorio no crea un servicio en segundo plano ni un calendario de tareas automáticas. Al reanudar, se leen plan, aprobación, registro y Git antes de continuar. No se promete trabajo silencioso durante días con la sesión cerrada.

## 5. Autonomía dentro de un sprint aprobado

| Situación | Acción de Codex | ¿Consultar antes? |
|---|---|---|
| Editar archivos acordados, pruebas sintéticas, documentación, corrección de un defecto propio dentro del alcance | Ejecutar y registrar evidencia | No |
| Elegir nombres, estructura interna o librería ya disponible sin cambiar contratos/riesgo | Ejecutar y documentar decisión técnica | No |
| Error de prueba local o dependencia técnica solucionable con medios autorizados | Diagnosticar y corregir; usar el margen del sprint | No |
| Credencial o dato externo indispensable ausente | Agotar alternativas seguras, bloquear historia, avanzar otra independiente aprobada | Sí, si no queda trabajo útil o cambia la entrega |
| Rama ocupada, cambios ajenos superpuestos, riesgo de pérdida de archivos | No hacer checkout/revert/migración a ciegas | Sí |
| Gasto, nueva cuenta externa, mensajes a miembros, publicación, push, despliegue o migración | Ejecutar sólo si ese destino y límite figuran en la aprobación | Sí, si no están autorizados |
| Nueva dependencia/servicio con implicaciones de datos, licencia o costos | Proponer y evaluar, no activar | Sí |
| Acceso entre miembros, secretos expuestos, escritura irreversible o incidente | Contener con acciones seguras en alcance, registrar sin secretos y escalar | Sí, inmediatamente |
| Idea nueva sin relación necesaria con criterios aprobados | Añadir al backlog propuesto | No interrumpe; no se implementa |
| Cambio de alcance, criterio, proveedor, costo o fecha comprometida | Crear solicitud de cambio y mostrar impacto | Sí, antes del cambio |

No pedir confirmación repetida para operaciones ordinarias ya aprobadas. La autorización del plan **no** es un consentimiento genérico para actuar en cuentas de terceros. Para una publicación futura basta incluir en el paquete destino, rutas exactas, presupuesto, rollback y quién puede aprobar; no hace falta fraccionar después cada paso normal de ese despliegue.

## 6. Definition of Ready (DoR)

Una historia puede entrar al compromiso cuando:

- Tiene persona, necesidad y requisito enlazados; valor específico y alcance/exclusiones entendibles.
- Tiene criterios Given/When/Then identificados, con éxito y al menos una denegación o error.
- Los puntos Fibonacci son provisionales y ≤8; si no se puede estimar, se refina o se propone un spike acotado.
- Dependencias terminadas o incluidas y ordenadas en el mismo sprint; no hay ciclos ni terceros desconocidos en su camino crítico.
- Están definidos entorno, datos sintéticos/reales permitidos, pruebas, demo y rollback cuando corresponda.
- Los insumos y decisiones que bloquean **ese** sprint están resueltos con evidencia; la alternativa local no se presenta como aprobación productiva.
- Hay responsable de ejecución y revisión, permisos/budget acotados y política de rama resuelta.
- La revisión INVEST queda registrada: no marcar “independiente” o “estimable” por haber generado una historia con una herramienta.

La validación automática comprueba estructura; Ready requiere además juicio técnico documentado. Dependencias internas secuenciales en SP-001 son explícitas: no se vende una independencia inexistente.

## 7. Definition of Done (DoD) y aceptación

Para pasar a `in_review`: todos los criterios de la historia tienen evidencia de la revisión actual; pruebas pertinentes pasan; cambios revisados y diff inspeccionado; no hay defectos críticos abiertos; documentación, limitaciones y pasos de reproducción actualizados.

Para `done`: además Roger registra aceptación explícita y se cumple el gate de revisión correspondiente. En el prototipo local se admite auto-revisión técnica identificada como tal más revisión de producto por Roger. **No equivale a revisión independiente de seguridad.** Producción exige responsable/revisión independiente cuando aplique, pruebas en entorno real autorizado, rollback y autorización de liberación. “Done local” no significa “publicado”.

Cada evidencia indica historia, criterio, versión/commit o huella del diff, comando/prueba, entorno, resultado, fecha y limitación. Un enlace a un archivo no prueba que su contenido haya pasado. No reutilizar el resultado de una revisión antigua tras cambiar el código afectado sin revalidar.

## 8. Estados

| Estado | Significado |
|---|---|
| `proposed` | Propuesta con estimación inicial; sin compromiso |
| `ready` | DoR revisada con evidencia; aún no aprobada para ejecutar |
| `committed` | Seleccionada en un sprint aprobado; responsable confirmado |
| `in_progress` | Trabajo efectivo iniciado bajo esa aprobación |
| `blocked` | Impedimento registrado con dueño y siguiente acción |
| `in_review` | Criterios verificados técnicamente; espera revisión/aceptación |
| `done` | DoD y aceptación explícita registradas |

Camino normal: `proposed → ready → committed → in_progress → in_review → done`. De `in_review` puede volver a `in_progress`; de `blocked` vuelve al estado de ejecución adecuado al resolverse. No borrar el evento anterior. Un carryover se registra al cerrar el sprint y se vuelve a planificar; no se traslada silenciosamente.

## 9. Orden, estimación y métricas

Puntuación orientativa = `0.40 valor + 0.30 impacto + 0.15 reducción de riesgo + 0.15 facilidad`. Cada factor usa 1–5; facilidad convierte 1/2/3/5/8 puntos a 5/4/3/2/1. Es una ayuda, no sustituye dependencias, gates ni la decisión de Roger. Empates: dependencias, luego menor tamaño. La primera propuesta prioriza una base de acceso demostrable antes de conectores.

Registrar al cerrar cada sprint: puntos aceptados (sin parciales), objetivo logrado con evidencia, compromiso inicial, cambios autorizados, carryover, duración bloqueada, defectos e incidentes. No calcular velocidad, fiabilidad, ahorro, renovación o conversión si faltan denominadores. Tras al menos tres sprints comparables, usar capacidad observada, disponibilidad y un margen de planificación; la referencia inicial es no comprometer más del 85% del sobre disponible.

## 10. Información sensible

En el control sólo van IDs ficticios, referencias a secretos en un canal seguro y datos agregados permitidos. Nunca tokens, contraseñas, cookies, transcripciones privadas ni listados de miembros. Las evidencias sanitizadas pueden archivarse en Git tras autorización; revisar aparte si el repositorio sigue público. La wiki pública no debe exponer este registro interno por defecto.
