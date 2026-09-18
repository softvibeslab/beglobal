# Backlog trazable de BeGlobal

> Generado desde `backlog.json` y `sprints.json`. No editar este estado a mano. Propuesta ≠ compromiso ≠ aceptación.

Puntos y orden: propuestas por refinar. Toda historia futura necesita revisar DoR/INVEST, insumos y alcance antes de compromiso. Responsables heredados son propuestas, no asignaciones aceptadas.

La cobertura indica dónde se trabajará cada requisito, **no** que esté cumplido. BG-001…005 cubren sólo un subconjunto local con fixtures; los requisitos de autenticación real siguen en BG-006…008.

## Índice

| ID | Resultado | Área | Puntos | Prioridad | Score orientativo |
|---|---|---|---|---|---|
| [BG-001](#bg-001) | Arrancar una demo local reproducible sin alterar el sistema existente | EP-01 | 2 | critical | 4.55/5 |
| [BG-002](#bg-002) | Abrir un contexto de miembro ficticio con aislamiento de negocio | EP-01 | 3 | critical | 4.70/5 |
| [BG-003](#bg-003) | Calcular y distinguir membresía académica, verificación y plan | EP-01 | 3 | critical | 4.70/5 |
| [BG-004](#bg-004) | Ver un perfil local claro con estados de acceso y próximos pasos | EP-01 | 3 | high | 4.40/5 |
| [BG-005](#bg-005) | Demostrar el perfil y sus denegaciones con una suite repetible | EP-01 | 2 | critical | 4.55/5 |
| [BG-006](#bg-006) | Iniciar sesión Telegram con prueba verificada | EP-01 | 5 | critical | 4.55/5 |
| [BG-007](#bg-007) | Vincular web y Telegram sin fusionar identidades ajenas | EP-01 | 5 | critical | 4.55/5 |
| [BG-008](#bg-008) | Conectar el puente con la plataforma real de membresías | EP-01 | 5 | critical | 4.55/5 |
| [BG-009](#bg-009) | Confirmar el bloqueo antes de recomendar una misión | EP-02 | 3 | high | 4.40/5 |
| [BG-010](#bg-010) | Crear y consultar una misión con criterio verificable | EP-02 | 5 | high | 4.40/5 |
| [BG-011](#bg-011) | Adjuntar evidencia propia validada | EP-02 | 5 | high | 4.55/5 |
| [BG-012](#bg-012) | Revisar evidencia sólo con asignación autorizada | EP-02 | 5 | high | 4.25/5 |
| [BG-013](#bg-013) | Mostrar avance con denominador y ruta versionados | EP-02 | 3 | high | 4.40/5 |
| [BG-014](#bg-014) | Conservar misión e historial al cambiar de canal | EP-02 | 5 | high | 4.40/5 |
| [BG-015](#bg-015) | Renderizar tarjetas de chat tipadas y accesibles | EP-03 | 3 | high | 4.30/5 |
| [BG-016](#bg-016) | Convertir orientación pública en lead sólo con consentimiento | EP-03 | 3 | medium | 4.25/5 |
| [BG-017](#bg-017) | Responder con fuentes permitidas y nivel de evidencia visible | EP-04 | 5 | critical | 4.55/5 |
| [BG-018](#bg-018) | Publicar nuevas ingestas con revisión y procedencia | EP-04 | 5 | medium | 3.85/5 |
| [BG-019](#bg-019) | Crear un kit de contenido revisable desde un brief | EP-05 | 5 | high | 4.25/5 |
| [BG-020](#bg-020) | Reservar y conciliar consumo sin sobrepasar topes | EP-05 | 5 | critical | 4.25/5 |
| [BG-021](#bg-021) | Elegir y gestionar conexiones mediante onboarding guiado | EP-06 | 3 | high | 4.40/5 |
| [BG-022](#bg-022) | Conectar Google con acceso documental mínimo | EP-06 | 5 | medium | 3.85/5 |
| [BG-023](#bg-023) | Conectar Shopify para diagnóstico de sólo lectura | EP-06 | 5 | medium | 4.25/5 |
| [BG-024](#bg-024) | Aplicar broker y aprobación fuera del modelo | EP-06 | 5 | critical | 4.25/5 |
| [BG-025](#bg-025) | Resolver reintentos y resultados inciertos sin duplicar efectos | EP-06 | 5 | critical | 4.25/5 |
| [BG-026](#bg-026) | Consultar recibos y auditoría sanitizada | EP-07 | 3 | high | 4.00/5 |
| [BG-027](#bg-027) | Gestionar memoria, exportación y solicitudes de borrado propias | EP-07 | 5 | high | 4.15/5 |
| [BG-028](#bg-028) | Ensayar despliegue y recuperación en staging autorizado | EP-07 | 5 | critical | 3.95/5 |
| [BG-029](#bg-029) | Medir rendimiento y colas con carga piloto definida | EP-07 | 5 | high | 3.70/5 |
| [BG-030](#bg-030) | Evaluar utilidad y resultados del piloto sin promesas causales | EP-08 | 5 | high | 4.40/5 |
| [BG-031](#bg-031) | Operar soporte e incidentes con responsables y señales | EP-07 | 3 | high | 4.40/5 |
| [BG-032](#bg-032) | Evaluar y habilitar una lectura acotada de Amazon FBA | EP-09 | 5 | low | 3.40/5 |
| [BG-033](#bg-033) | Conectar Meta para un diagnóstico de lectura aprobado | EP-09 | 5 | low | 3.70/5 |
| [BG-034](#bg-034) | Conectar Stripe del negocio sólo para conciliación de lectura | EP-09 | 5 | low | 3.55/5 |
| [BG-035](#bg-035) | Conectar Mercado Pago para reporte operativo de lectura | EP-09 | 5 | low | 3.55/5 |
| [BG-036](#bg-036) | Resolver la discrepancia de rutas legacy antes de integrar el nuevo módulo | EP-07 | 5 | critical | 3.85/5 |
| [BG-037](#bg-037) | Revocar la sesión local y cerrar todas las copias del sujeto | EP-01 | 5 | critical | 4.25/5 |
| [BG-038](#bg-038) | Desvincular Telegram local con HMAC fresco y un acceso web alternativo | EP-01 | 5 | critical | 4.25/5 |

<a id="bg-001"></a>

## BG-001 · Arrancar una demo local reproducible sin alterar el sistema existente

Como responsable técnico quiero una base local aislada y verificable para construir el perfil sin romper las rutas y datos existentes.

Estado `done` · 2 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: confirmed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Harness local y baseline del puente/contratos; no migrar DB, reescribir rutas legacy ni desplegar.

Requisitos: R-03, R-26 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [01-base-existente.md](../SPECS/01-base-existente.md), [12-api-eventos-contratos.md](../SPECS/12-api-eventos-contratos.md), [18-puente-plataforma-beglobal.md](../SPECS/18-puente-plataforma-beglobal.md).

Dependencias: ninguna historia previa. Gates/insumos: A-02, A-04.

### Criterios de aceptación

- **BG-001-AC1:** Dada la base aislada aprobada, cuando se sigue el README desde cero, entonces arranca la demo local con un comando documentado y sin credenciales reales.
- **BG-001-AC2:** Dadas las rutas legacy inventariadas, cuando se incorpora la demo, entonces no se eliminan ni sustituyen y se conserva evidencia del diff y del baseline.
- **BG-001-AC3:** Dado un arranque con fixtures, cuando el entorno declarado es staging o producción, entonces se deniega ese modo y no se concede acceso PRO.
- **BG-001-AC4:** Dado el puente existente, cuando se ejecuta su suite y la validación de contratos, entonces se archivan resultados reales y se distinguen pruebas sintéticas de E2E.

### Control y evidencia

DoR: sprints/SP-001/READY.md. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 4. Aceptación: registrada; ver JSON/fuente. No inferir cumplimiento por trazabilidad.

| Tarea | Acción | Responsable propuesto | Estado |
|---|---|---|---|
| BG-001-T1 | Inventariar base aprobada, dependencias disponibles y rutas sin modificar datos | Codex | done |
| BG-001-T2 | Preparar harness local aislado y comandos de arranque/cierre | Codex | done |
| BG-001-T3 | Guardar baseline sanitizado de contratos, puente y compatibilidad | Codex | done |

<a id="bg-002"></a>

## BG-002 · Abrir un contexto de miembro ficticio con aislamiento de negocio

Como miembro de prueba quiero entrar a mi contexto y no al de otra persona para validar el perfil sin exponer información ajena.

Estado `done` · 3 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: confirmed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Dos personas/negocios sintéticos con grants explícitos y sesión de desarrollo sólo local. No sustituye firma Telegram, linking ni autenticación productiva de BG-006/007.

Requisitos: R-01, R-06 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [03-identidad-membresias.md](../SPECS/03-identidad-membresias.md), [11-modelo-de-datos.md](../SPECS/11-modelo-de-datos.md).

Dependencias: [BG-001](#bg-001). Gates/insumos: A-03, A-04.

### Criterios de aceptación

- **BG-002-AC1:** Dado el modo desarrollo local, cuando se inicia una sesión de fixture permitida, entonces el servidor deriva personId y businessId de esa sesión y muestra que es una simulación.
- **BG-002-AC2:** Dada la sesión de la persona A, cuando se solicita el negocio o perfil de B, entonces se deniega sin devolver nombre, historial ni membresía de B.
- **BG-002-AC3:** Dada una sesión ausente o vencida, cuando se solicita el perfil, entonces se devuelve un error de sesión distinto de una membresía no verificada.
- **BG-002-AC4:** Dado un plan Negocio ficticio, cuando se evalúan roles, entonces no se conceden Team ni Corporate y la autorización no confía en campos de rol enviados por el navegador.

### Control y evidencia

DoR: sprints/SP-001/READY.md. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 4. Aceptación: registrada; ver JSON/fuente. No inferir cumplimiento por trazabilidad.

| Tarea | Acción | Responsable propuesto | Estado |
|---|---|---|---|
| BG-002-T1 | Definir fixtures de personas, negocios, grants y sesiones locales | Codex | done |
| BG-002-T2 | Resolver contexto de petición y denegaciones en servidor | Codex | done |
| BG-002-T3 | Probar sesión inválida y acceso cruzado sin usar datos reales | Codex | done |

<a id="bg-003"></a>

## BG-003 · Calcular y distinguir membresía académica, verificación y plan

Como miembro quiero entender mi estado de membresía y capacidades del agente por separado para saber por qué una función está disponible o pendiente.

Estado `done` · 3 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: confirmed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Integrar MembershipBridge existente a una política local. Fixture de desarrollo o proveedor no configurado; no inventar API de BeGlobal ni activar PRO real.

Requisitos: R-03, R-04, R-05, R-06 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [03-identidad-membresias.md](../SPECS/03-identidad-membresias.md), [04-planes-permisos-consumo.md](../SPECS/04-planes-permisos-consumo.md), [18-puente-plataforma-beglobal.md](../SPECS/18-puente-plataforma-beglobal.md).

Dependencias: [BG-002](#bg-002). Gates/insumos: A-01, A-03.

### Criterios de aceptación

- **BG-003-AC1:** Dado un miembro ficticio vigente y plan Creador, cuando se consulta acceso, entonces se devuelven en campos separados academia, verificación, plan y capacidades autorizadas.
- **BG-003-AC2:** Dado proveedor no configurado, timeout o sujeto distinto, cuando se consulta acceso, entonces se deniega conocimiento PRO y se informa verificación no disponible, no una compra obligatoria.
- **BG-003-AC3:** Dado un snapshot vencido o una baja simulada, cuando llega la siguiente consulta protegida, entonces se reevalúa el permiso y no se reutiliza un acceso positivo anterior.
- **BG-003-AC4:** Dado plan Negocio sin membresía académica vigente, cuando se solicita un recurso PRO, entonces el plan no sustituye el derecho académico ni concede roles humanos.

### Control y evidencia

DoR: sprints/SP-001/READY.md. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 4. Aceptación: registrada; ver JSON/fuente. No inferir cumplimiento por trazabilidad.

| Tarea | Acción | Responsable propuesto | Estado |
|---|---|---|---|
| BG-003-T1 | Inyectar puente e identidad verificada local sin modificar el provider real pendiente | Codex | done |
| BG-003-T2 | Implementar política y contrato de acceso con estados independientes | Codex | done |
| BG-003-T3 | Probar matriz de permisos, expiración y fallo cerrado | Codex | done |

<a id="bg-004"></a>

## BG-004 · Ver un perfil local claro con estados de acceso y próximos pasos

Como miembro quiero ver mi perfil, plan y estado de acceso de forma comprensible para saber qué puedo hacer sin confundir membresía con inicio de sesión.

Estado `done` · 3 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: confirmed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Perfil de sólo lectura con branding existente, estados vacíos y notice permitido. Sin chat generativo, misiones funcionales, checkout, conectores ni instalación PWA nueva.

Requisitos: R-04, R-16, R-26 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [07-perfil-misiones-progreso.md](../SPECS/07-perfil-misiones-progreso.md), [08-miniapps-chat-web.md](../SPECS/08-miniapps-chat-web.md).

Dependencias: [BG-003](#bg-003). Gates/insumos: A-01, A-03.

### Criterios de aceptación

- **BG-004-AC1:** Dada una sesión de fixture, cuando abre el perfil, entonces ve persona/negocio, academia, plan y capacidades leídos del servidor, con etiqueta visible de demo.
- **BG-004-AC2:** Dado 401, 403, error de red o verificación pendiente, cuando se renderiza el estado, entonces cada caso tiene mensaje y acción diferentes sin mostrar éxito falso.
- **BG-004-AC3:** Dada navegación por teclado y viewport de 320 px, cuando se recorre el perfil, entonces controles y foco son visibles, no hay bloqueo por desbordamiento y el contenido principal es accesible.
- **BG-004-AC4:** Dado texto no confiable o tarjeta no permitida, cuando se intenta renderizar, entonces no se ejecuta HTML/JS y se muestra un fallback seguro; historial y misiones vacíos no inventan progreso.

### Control y evidencia

DoR: sprints/SP-001/READY.md. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 4. Aceptación: registrada; ver JSON/fuente. No inferir cumplimiento por trazabilidad.

| Tarea | Acción | Responsable propuesto | Estado |
|---|---|---|---|
| BG-004-T1 | Preparar UI y estados con assets de marca existentes | Codex | done |
| BG-004-T2 | Conectar perfil read-only al contrato local y render seguro | Codex | done |
| BG-004-T3 | Verificar teclado, móvil, red y estados con evidencia visual | Codex | done |

<a id="bg-005"></a>

## BG-005 · Demostrar el perfil y sus denegaciones con una suite repetible

Como Product Owner quiero una demo y pruebas reproducibles para aceptar el primer incremento sabiendo qué funciona y qué sigue simulado.

Estado `done` · 2 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: confirmed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Suite local y evidencia para SP-001; no acredita Telegram físico, OAuth, plataforma BeGlobal, prueba de carga o disponibilidad productiva.

Requisitos: R-03, R-05, R-06, R-26 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [13-operacion-evaluacion.md](../SPECS/13-operacion-evaluacion.md), [15-requisitos-y-pruebas.md](../SPECS/15-requisitos-y-pruebas.md).

Dependencias: [BG-004](#bg-004). Gates/insumos: A-05.

### Criterios de aceptación

- **BG-005-AC1:** Dado el incremento candidato, cuando se ejecuta la suite documentada, entonces se prueban miembro vigente/vencido/desconocido, sesión inválida y acceso cruzado con resultado por caso.
- **BG-005-AC2:** Dado un intento de activar fixtures fuera de desarrollo, cuando arranca el sistema, entonces la suite confirma que no hay acceso PRO permitido por ese modo.
- **BG-005-AC3:** Dada la demo y sus archivos, cuando Roger sigue los pasos, entonces reproduce el perfil y las denegaciones sin tokens ni servicios pagados.
- **BG-005-AC4:** Dado el informe de entrega, cuando se revisa, entonces cada criterio de SP-001 tiene evidencia versionada o se declara fallido/pendiente, sin marcar historias aceptadas en nombre de Roger.

### Control y evidencia

DoR: sprints/SP-001/READY.md. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 4. Aceptación: registrada; ver JSON/fuente. No inferir cumplimiento por trazabilidad.

| Tarea | Acción | Responsable propuesto | Estado |
|---|---|---|---|
| BG-005-T1 | Consolidar regresiones y recorrido integrado local | Codex | done |
| BG-005-T2 | Preparar demo, matriz AC-evidencia y revisión técnica declarada | Codex | done |
| BG-005-T3 | Entregar revisión del sprint, limitaciones y propuesta de retrospectiva | Codex | done |

<a id="bg-006"></a>

## BG-006 · Iniciar sesión Telegram con prueba verificada

Como miembro quiero entrar desde Telegram con identidad verificada para acceder sólo a mi espacio.

Estado `done` · 5 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: confirmed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: HMAC/initData de fixture en member-workspace; IDs 900001/900002. No BotFather, webhook, Hostinger, cuentas reales ni linking BG-007.

Requisitos: R-01 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [03-identidad-membresias.md](../SPECS/03-identidad-membresias.md), [08-miniapps-chat-web.md](../SPECS/08-miniapps-chat-web.md).

Dependencias: [BG-005](#bg-005). Gates/insumos: D-02, D-08.

### Criterios de aceptación

- **BG-006-AC1:** Dado initData válido y fresco del bot permitido, cuando se intercambia, entonces se crea una sesión corta ligada al sujeto verificado.
- **BG-006-AC2:** Dada firma, bot, fecha o replay inválidos, cuando se intenta entrar, entonces no se crea sesión.
- **BG-006-AC3:** Dado un request sin sesión, cuando pide datos privados, entonces se deniega sin confiar en userId del cliente.
- **BG-006-AC4:** Dado un cierre o caducidad de sesión, cuando se vuelve a consultar, entonces se exige autenticar sin borrar el historial propio.

### Control y evidencia

DoR: sprints/SP-002/READY.md. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 4. Aceptación: registrada; ver JSON/fuente. No inferir cumplimiento por trazabilidad.

| Tarea | Acción | Responsable propuesto | Estado |
|---|---|---|---|
| BG-006-T1 | Verificar HMAC y replay de initData fixture | Codex | done |
| BG-006-T2 | Intercambiar prueba válida por sesión opaca | Codex | done |
| BG-006-T3 | Denegar firma/bot/caducidad/userId de cliente | Codex | done |

<a id="bg-007"></a>

## BG-007 · Vincular web y Telegram sin fusionar identidades ajenas

Como miembro quiero vincular mis canales demostrando posesión para conservar mi espacio sin arriesgar el de otra persona.

Estado `done` · 5 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: confirmed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: HMAC/initData fixture + sesión web local en member-workspace; desafío de 5 min; unicidad telegram↔persona sin merge. No BotFather, staging BFF, Hostinger, cuentas reales, BG-008 ni recuperación asistida.

Requisitos: R-01, R-02, R-12 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [03-identidad-membresias.md](../SPECS/03-identidad-membresias.md), [11-modelo-de-datos.md](../SPECS/11-modelo-de-datos.md).

Dependencias: [BG-006](#bg-006). Gates/insumos: D-02, D-08.

### Criterios de aceptación

- **BG-007-AC1:** Dadas una sesión web ficticia libre y un initData fresco del mismo sujeto mapeado, cuando se confirma la vinculación con el desafío vigente, entonces se registra un enlace único auditado.
- **BG-007-AC2:** Dada una identidad ya vinculada, un initData de otro sujeto o un desafío vencido, cuando se solicita vincular, entonces se rechaza sin fusionar historial.
- **BG-007-AC3:** Dada una sesión web, cuando se ejecuta una operación de vinculación con cookies, entonces se validan origen e intención y no se exponen tokens al cliente.
- **BG-007-AC4:** Dado un intento de recuperación por displayName o email sintético, cuando no hay prueba HMAC vigente de la política de este sprint, entonces no se reasigna la identidad.

### Control y evidencia

DoR: sprints/SP-003/READY.md. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 4. Aceptación: registrada; ver JSON/fuente. No inferir cumplimiento por trazabilidad.

| Tarea | Acción | Responsable propuesto | Estado |
|---|---|---|---|
| BG-007-T1 | Desafío de vinculación de un solo uso ligado a la sesión | Codex | done |
| BG-007-T2 | Rechazar cruce, replay y dueño previo sin merge | Codex | done |
| BG-007-T3 | Denegar recuperación por nombre o email | Codex | done |

<a id="bg-008"></a>

## BG-008 · Conectar el puente con la plataforma real de membresías

Como miembro quiero que el agente reconozca mi vigencia en BeGlobal para recibir el acceso que realmente me corresponde.

Estado `proposed` · 5 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Estimación sujeta al contrato real; reestimar o dividir si requiere transportes adicionales. No activar sin sandbox y IDs estables.

Requisitos: R-03, R-04, R-05 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [18-puente-plataforma-beglobal.md](../SPECS/18-puente-plataforma-beglobal.md), [03-identidad-membresias.md](../SPECS/03-identidad-membresias.md).

Dependencias: [BG-007](#bg-007). Gates/insumos: D-01, D-02, D-08.

### Criterios de aceptación

- **BG-008-AC1:** Dado contrato, autenticación y mapeo verificado, cuando responde el sandbox, entonces se normalizan ID, estado y vigencia sin editar las reglas de planes.
- **BG-008-AC2:** Dadas alta, suspensión, baja, expiración y reactivación de prueba, cuando se consulta acceso, entonces la siguiente operación refleja el estado efectivo correspondiente.
- **BG-008-AC3:** Dado timeout, respuesta ambigua o sujeto distinto, cuando se consulta, entonces se falla cerrado y se informa indisponibilidad sin revelar secretos.
- **BG-008-AC4:** Dado el canal de actualización acordado, cuando llegan cambios repetidos o fuera de orden, entonces no se restaura una vigencia revocada por datos anteriores; la reconciliación queda probada.
- **BG-008-AC5:** Dado el gate de activación, cuando faltan semántica, sandbox o pruebas, entonces el provider real permanece deshabilitado y no se usa un fixture como sustituto productivo.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-009"></a>

## BG-009 · Confirmar el bloqueo antes de recomendar una misión

Como miembro quiero corregir el diagnóstico de mi bloqueo para recibir una misión adecuada a mi situación.

Estado `proposed` · 3 puntos provisionales · EP-02 Miembro: misión, evidencia y avance · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Hipótesis trazables y confirmación; modelo/dataset y costo por aprobar, no diagnóstico infalible.

Requisitos: R-08 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [05-agentes-skills-flujos.md](../SPECS/05-agentes-skills-flujos.md), [07-perfil-misiones-progreso.md](../SPECS/07-perfil-misiones-progreso.md).

Dependencias: [BG-008](#bg-008), [BG-017](#bg-017). Gates/insumos: D-03, D-06.

### Criterios de aceptación

- **BG-009-AC1:** Dado un bloqueo propuesto, cuando el miembro lo corrige, entonces se conserva la corrección antes de generar la misión.
- **BG-009-AC2:** Dado un dato no aportado, cuando el agente infiere una causa, entonces se etiqueta como hipótesis y no se guarda como hecho.
- **BG-009-AC3:** Dado rechazo del diagnóstico, cuando se continúa, entonces se permite reformular sin forzar una misión.
- **BG-009-AC4:** Dado un fallo del modelo, cuando se responde, entonces se informa el error y no se inventa confirmación del miembro.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-010"></a>

## BG-010 · Crear y consultar una misión con criterio verificable

Como miembro quiero una misión con pasos, fuentes y criterio de terminado para ejecutar con claridad.

Estado `proposed` · 5 puntos provisionales · EP-02 Miembro: misión, evidencia y avance · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Una ruta piloto versionada y CRUD autorizado; no catálogo completo de rutas.

Requisitos: R-09 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [07-perfil-misiones-progreso.md](../SPECS/07-perfil-misiones-progreso.md), [12-api-eventos-contratos.md](../SPECS/12-api-eventos-contratos.md).

Dependencias: [BG-009](#bg-009). Gates/insumos: D-07.

### Criterios de aceptación

- **BG-010-AC1:** Dado un bloqueo confirmado, cuando se crea la misión, entonces contiene objetivo, pasos, fuente permitida, versión y evidencia requerida.
- **BG-010-AC2:** Dado criterio ausente o fuente no admisible, cuando se intenta publicar la misión, entonces queda pendiente sin presentarse como válida.
- **BG-010-AC3:** Dada una misión de otro negocio, cuando se lee o modifica, entonces se deniega sin filtrar contenido.
- **BG-010-AC4:** Dadas ediciones concurrentes, cuando una usa versión obsoleta, entonces se devuelve conflicto sin sobrescribir el avance.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-011"></a>

## BG-011 · Adjuntar evidencia propia validada

Como miembro quiero adjuntar evidencia segura a mi misión para demostrar lo que ejecuté.

Estado `proposed` · 5 puntos provisionales · EP-02 Miembro: misión, evidencia y avance · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Tipos/tamaños/cuota y almacenamiento privado por aprobar; validación y cuarentena antes de preview.

Requisitos: R-13 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [07-perfil-misiones-progreso.md](../SPECS/07-perfil-misiones-progreso.md), [10-seguridad-privacidad.md](../SPECS/10-seguridad-privacidad.md).

Dependencias: [BG-010](#bg-010). Gates/insumos: D-03, D-06, D-08.

### Criterios de aceptación

- **BG-011-AC1:** Dado un archivo validado del mismo negocio, cuando se adjunta, entonces se registra una versión inmutable con autor y checksum.
- **BG-011-AC2:** Dado MIME, tamaño o cuota inválidos, cuando se sube, entonces se rechaza sin preview público ni enlace reutilizable.
- **BG-011-AC3:** Dado un asset ajeno o en cuarentena, cuando se intenta adjuntar, entonces se deniega y no se marca evidencia lista.
- **BG-011-AC4:** Dado un upload interrumpido, cuando se reintenta, entonces no se duplica una evidencia ni se pierde el estado previo válido.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-012"></a>

## BG-012 · Revisar evidencia sólo con asignación autorizada

Como revisor asignado quiero evaluar una evidencia con rúbrica para dar retroalimentación sin ver casos ajenos.

Estado `proposed` · 5 puntos provisionales · EP-02 Miembro: misión, evidencia y avance · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Bandeja con grants/asignaciones explícitas; comprar un plan no concede rol de revisor.

Requisitos: R-14, R-24 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [07-perfil-misiones-progreso.md](../SPECS/07-perfil-misiones-progreso.md), [11-modelo-de-datos.md](../SPECS/11-modelo-de-datos.md).

Dependencias: [BG-011](#bg-011). Gates/insumos: D-07.

### Criterios de aceptación

- **BG-012-AC1:** Dado revisor asignado vigente, cuando evalúa, entonces registra rúbrica, resultado y versión de la evidencia.
- **BG-012-AC2:** Dado Team no asignado o autor de la evidencia, cuando intenta aceptar, entonces se deniega sin incrementar avance.
- **BG-012-AC3:** Dada revisión repetida o versión obsoleta, cuando se envía, entonces no se duplica el resultado y se informa conflicto cuando corresponde.
- **BG-012-AC4:** Dada una asignación revocada, cuando el revisor vuelve a abrir el caso, entonces pierde acceso y queda un recibo sanitizado.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-013"></a>

## BG-013 · Mostrar avance con denominador y ruta versionados

Como miembro quiero conocer mi avance real para decidir el siguiente paso sin confundir actividad con resultados aceptados.

Estado `proposed` · 3 puntos provisionales · EP-02 Miembro: misión, evidencia y avance · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Avance de ruta piloto; no índice comercial de éxito ni ranking público.

Requisitos: R-15 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [07-perfil-misiones-progreso.md](../SPECS/07-perfil-misiones-progreso.md).

Dependencias: [BG-012](#bg-012). Gates/insumos: D-07.

### Criterios de aceptación

- **BG-013-AC1:** Dadas dos de cuatro misiones obligatorias aceptadas, cuando se consulta progreso, entonces se muestra 50% con denominador y versión.
- **BG-013-AC2:** Dada una ruta sin misiones obligatorias, cuando se consulta, entonces se muestra sin ruta evaluable y no 100%.
- **BG-013-AC3:** Dada una nueva versión de ruta, cuando se migra con la política acordada, entonces no se borran revisiones previas ni se mezclan denominadores.
- **BG-013-AC4:** Dada evidencia subida pero no aceptada, cuando se recalcula, entonces se distingue trabajo enviado de misión completada.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-014"></a>

## BG-014 · Conservar misión e historial al cambiar de canal

Como miembro quiero continuar en web lo que inicié en Telegram para no repetir contexto ni perder mi avance.

Estado `proposed` · 5 puntos provisionales · EP-02 Miembro: misión, evidencia y avance · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Historial central autorizado, no importación automática del localStorage antiguo.

Requisitos: R-12, R-26 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [07-perfil-misiones-progreso.md](../SPECS/07-perfil-misiones-progreso.md), [08-miniapps-chat-web.md](../SPECS/08-miniapps-chat-web.md).

Dependencias: [BG-007](#bg-007), [BG-013](#bg-013), [BG-015](#bg-015). Gates/insumos: D-06, D-08.

### Criterios de aceptación

- **BG-014-AC1:** Dada identidad vinculada, cuando alterna canales, entonces ve la misma misión, evidencia y revisión desde el estado central.
- **BG-014-AC2:** Dado conversationId ajeno, cuando se solicita, entonces se deniega en ambos canales sin filtrar mensajes.
- **BG-014-AC3:** Dada caída de red, cuando reanuda, entonces se recupera estado confirmado sin duplicar el envío.
- **BG-014-AC4:** Dado historial antiguo sólo local, cuando abre la nueva experiencia, entonces no se importa ni comparte sin un flujo de consentimiento aprobado.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-015"></a>

## BG-015 · Renderizar tarjetas de chat tipadas y accesibles

Como miembro quiero tarjetas accionables seguras para pasar del chat a misiones, recursos y aprobaciones con claridad.

Estado `proposed` · 3 puntos provisionales · EP-03 Chat y captación consentida · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Seis tipos definidos en el contrato; acciones verificadas por servidor, nunca HTML arbitrario del LLM.

Requisitos: R-16, R-26 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [08-miniapps-chat-web.md](../SPECS/08-miniapps-chat-web.md), [12-api-eventos-contratos.md](../SPECS/12-api-eventos-contratos.md).

Dependencias: [BG-007](#bg-007). Gates/insumos: DoR general.

### Criterios de aceptación

- **BG-015-AC1:** Dada tarjeta válida, cuando se renderiza, entonces resuelve sólo recursos permitidos mediante el contrato tipado.
- **BG-015-AC2:** Dado HTML, JS, tipo desconocido o campos extra, cuando llega el payload, entonces se rechaza y presenta fallback seguro.
- **BG-015-AC3:** Dado un botón de tarjeta, cuando cambia el permiso antes del clic, entonces el servidor revalida y deniega si corresponde.
- **BG-015-AC4:** Dado teclado y viewport de 320 px, cuando se usa cada tipo de tarjeta, entonces foco, etiquetas y errores permiten completar el recorrido sin bloqueo.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-016"></a>

## BG-016 · Convertir orientación pública en lead sólo con consentimiento

Como visitante quiero probar la ayuda y decidir si comparto mis datos para recibir seguimiento sin presión ni mensajes no solicitados.

Estado `proposed` · 3 puntos provisionales · EP-03 Chat y captación consentida · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Revisar y reutilizar CRM/consentimiento existente; no duplicar backend ni enviar campañas por defecto.

Requisitos: R-17 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [08-miniapps-chat-web.md](../SPECS/08-miniapps-chat-web.md), [10-seguridad-privacidad.md](../SPECS/10-seguridad-privacidad.md).

Dependencias: [BG-015](#bg-015). Gates/insumos: D-06, D-07.

### Criterios de aceptación

- **BG-016-AC1:** Dado consentimiento explícito, cuando se crea un lead, entonces conserva propósito, canal, aviso y evidencia de consentimiento.
- **BG-016-AC2:** Dada negativa al seguimiento, cuando continúa la conversación, entonces sigue disponible orientación pública y no se envían mensajes comerciales.
- **BG-016-AC3:** Dado handoff solicitado, cuando se crea el caso, entonces sólo se entrega a personal autorizado con la información mínima.
- **BG-016-AC4:** Dado un reintento de alta, cuando se procesa, entonces no se duplica contacto ni consentimiento y se permite revocarlo según el flujo aprobado.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-017"></a>

## BG-017 · Responder con fuentes permitidas y nivel de evidencia visible

Como miembro quiero respuestas con fuentes y límites claros para distinguir enseñanza comprobada de referencias o inferencias.

Estado `proposed` · 5 puntos provisionales · EP-04 Conocimiento y procedencia · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Filtrado antes de retrieval y caché aislada; índices actuales son fuente, no permiso de publicación.

Requisitos: R-07, R-10 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [06-conocimiento-ingesta-grafos.md](../SPECS/06-conocimiento-ingesta-grafos.md).

Dependencias: [BG-008](#bg-008). Gates/insumos: D-03, D-06.

### Criterios de aceptación

- **BG-017-AC1:** Dado ámbito autorizado, cuando se recupera contenido, entonces cada cita devuelve fuente, versión y nivel de evidencia permitido.
- **BG-017-AC2:** Dado cambio de tier o negocio en el request, cuando se consulta, entonces no se filtran fragmentos PRO/internos ni caché de otro miembro.
- **BG-017-AC3:** Dada una lección con sólo título, cuando se responde, entonces se declara que es referencia de catálogo y no transcripción analizada.
- **BG-017-AC4:** Dada una relación inferida, cuando se muestra, entonces no se presenta como enseñanza confirmada ni caso de éxito revisado.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-018"></a>

## BG-018 · Publicar nuevas ingestas con revisión y procedencia

Como responsable de conocimiento quiero revisar derechos, duplicados y evidencia para ampliar el corpus sin exponer contenido privado.

Estado `proposed` · 5 puntos provisionales · EP-04 Conocimiento y procedencia · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Reutilizar skills de ingesta del repo al implementar; fuentes y gasto de descarga/transcripción requieren alcance aprobado.

Requisitos: R-10, R-11 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [06-conocimiento-ingesta-grafos.md](../SPECS/06-conocimiento-ingesta-grafos.md).

Dependencias: [BG-017](#bg-017). Gates/insumos: D-06, D-07.

### Criterios de aceptación

- **BG-018-AC1:** Dado contenido revisado, cuando se publica al índice autorizado, entonces incluye checksum, versión, tier, derechos y revisor.
- **BG-018-AC2:** Dado duplicado o derecho ausente, cuando se intenta ingerir, entonces no crea copia pública ni estado aprobado.
- **BG-018-AC3:** Dado catálogo sin transcripción, cuando entra al grafo, entonces conserva su nivel de evidencia y no inventa contenido de la lección.
- **BG-018-AC4:** Dada una versión retirada, cuando se revoca, entonces deja de recuperarse y se conserva trazabilidad del retiro sin exponer el archivo.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-019"></a>

## BG-019 · Crear un kit de contenido revisable desde un brief

Como miembro Creador quiero transformar mi estrategia en piezas revisables para publicar con consistencia en mis canales.

Estado `proposed` · 5 puntos provisionales · EP-05 PRO Creador y consumo · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Brief, plantilla y borradores; multimedia sólo si modelo/derechos/topes están aprobados. Sin publicación automática.

Requisitos: R-06, R-10, R-22 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [04-planes-permisos-consumo.md](../SPECS/04-planes-permisos-consumo.md), [05-agentes-skills-flujos.md](../SPECS/05-agentes-skills-flujos.md).

Dependencias: [BG-010](#bg-010), [BG-017](#bg-017), [BG-020](#bg-020). Gates/insumos: D-03, D-06.

### Criterios de aceptación

- **BG-019-AC1:** Dado plan Creador vigente y brief confirmado, cuando se solicita un kit, entonces genera borradores con objetivo, canal, CTA y revisión pendiente.
- **BG-019-AC2:** Dado plan Agente, cuando solicita capacidad Creador, entonces se deniega sin retirar funciones de guía permitidas.
- **BG-019-AC3:** Dado presupuesto insuficiente o derechos no confirmados, cuando se pide multimedia, entonces no se dispara generación ni se promete un recurso terminado.
- **BG-019-AC4:** Dados cinco briefs sintéticos acordados, cuando se evalúa la entrega, entonces se documentan criterios de calidad y fuentes sin publicar en cuentas externas.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-020"></a>

## BG-020 · Reservar y conciliar consumo sin sobrepasar topes

Como miembro y operador quiero conocer y limitar consumo para evitar cargos o generaciones que no autoricé.

Estado `proposed` · 5 puntos provisionales · EP-05 PRO Creador y consumo · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Ledger de unidades y reservas; no fija precios comerciales ni garantiza margen de alianza.

Requisitos: R-22 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [04-planes-permisos-consumo.md](../SPECS/04-planes-permisos-consumo.md), [11-modelo-de-datos.md](../SPECS/11-modelo-de-datos.md).

Dependencias: [BG-008](#bg-008). Gates/insumos: D-03.

### Criterios de aceptación

- **BG-020-AC1:** Dadas reservas concurrentes, cuando compiten por saldo, entonces ninguna combinación supera el límite aprobado.
- **BG-020-AC2:** Dado costo real disponible, cuando termina una operación, entonces se concilia con unidad y recibo y se libera sólo la reserva que corresponda.
- **BG-020-AC3:** Dado saldo desconocido o insuficiente, cuando se solicita generar, entonces no se llama al proveedor.
- **BG-020-AC4:** Dado fallo o resultado incierto, cuando se actualiza consumo, entonces se aplica la política aprobada sin inventar devolución ni ocultar un costo conocido.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-021"></a>

## BG-021 · Elegir y gestionar conexiones mediante onboarding guiado

Como miembro quiero conectar mis cuentas por propósito y ver su estado para usar skills sin configuraciones confusas.

Estado `proposed` · 3 puntos provisionales · EP-06 Conexiones y ejecución controlada · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Centro de conexiones y estados; esta historia no implementa OAuth de cada proveedor.

Requisitos: R-18, R-26 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [09-conexiones-onboarding.md](../SPECS/09-conexiones-onboarding.md).

Dependencias: [BG-007](#bg-007), [BG-015](#bg-015). Gates/insumos: D-04.

### Criterios de aceptación

- **BG-021-AC1:** Dado proveedor habilitado, cuando se inicia conexión, entonces explica propósito, cuenta, permisos y capacidades antes de autorizar.
- **BG-021-AC2:** Dado proveedor no habilitado, cuando se muestra su logo, entonces aparece En preparación y no simula una conexión disponible.
- **BG-021-AC3:** Dada cancelación, error o revocación, cuando vuelve al centro, entonces el estado refleja el resultado y no muestra Conectado falsamente.
- **BG-021-AC4:** Dado teclado o pantalla móvil, cuando se recorre el onboarding, entonces se puede cancelar y volver sin perder contexto ni quedar atrapado.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-022"></a>

## BG-022 · Conectar Google con acceso documental mínimo

Como miembro autorizado quiero seleccionar documentos de Google para aportar contexto propio sin compartir toda mi cuenta.

Estado `proposed` · 5 puntos provisionales · EP-06 Conexiones y ejecución controlada · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Google documental candidato; confirmar plan y scopes. App/sandbox propios antes de Ready; no Gmail completo ni shell.

Requisitos: R-18, R-19, R-21 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [09-conexiones-onboarding.md](../SPECS/09-conexiones-onboarding.md), [10-seguridad-privacidad.md](../SPECS/10-seguridad-privacidad.md).

Dependencias: [BG-021](#bg-021), [BG-024](#bg-024). Gates/insumos: D-04, D-06, D-08.

### Criterios de aceptación

- **BG-022-AC1:** Dada cuenta y app autorizadas, cuando completa OAuth válido, entonces sólo se habilitan documentos/operaciones de lectura aprobados.
- **BG-022-AC2:** Dado state inválido, replay o cuenta cruzada, cuando llega callback, entonces se deniega sin exponer tokens.
- **BG-022-AC3:** Dada credencial almacenada, cuando se usa la skill, entonces permanece en servidor y el broker resuelve sólo la cuenta del negocio actual.
- **BG-022-AC4:** Dada revocación, cuando se pide otra lectura, entonces se deniega y la UI ofrece reconexión sin reutilizar el permiso anterior.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-023"></a>

## BG-023 · Conectar Shopify para diagnóstico de sólo lectura

Como miembro Negocio quiero consultar mi tienda para detectar oportunidades sin que el agente cambie precios o pedidos.

Estado `proposed` · 5 puntos provisionales · EP-06 Conexiones y ejecución controlada · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Tienda de prueba, recursos mínimos aprobados y lectura; no cambios de inventario, cobros ni publicación.

Requisitos: R-18, R-19, R-21 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [09-conexiones-onboarding.md](../SPECS/09-conexiones-onboarding.md).

Dependencias: [BG-021](#bg-021), [BG-024](#bg-024). Gates/insumos: D-04, D-05, D-06, D-08.

### Criterios de aceptación

- **BG-023-AC1:** Dada tienda y app aprobadas, cuando autoriza scopes mínimos, entonces se identifica la tienda elegida y se prueba una lectura permitida.
- **BG-023-AC2:** Dado callback adulterado o tienda ajena, cuando se procesa, entonces se deniega sin asociar la cuenta al negocio equivocado.
- **BG-023-AC3:** Dada consulta permitida, cuando el broker devuelve un diagnóstico, entonces incluye fuente y recibo sin datos personales innecesarios.
- **BG-023-AC4:** Dada petición de cambiar precio, inventario o pedido, cuando se evalúa la tool, entonces se deniega en el piloto de lectura aunque el texto del agente lo proponga.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-024"></a>

## BG-024 · Aplicar broker y aprobación fuera del modelo

Como dueño de negocio quiero límites verificables por acción para que una conexión no autorice al agente a hacer cualquier cosa.

Estado `proposed` · 5 puntos provisionales · EP-06 Conexiones y ejecución controlada · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Allowlist por skill/cuenta y aprobación vinculante para acciones futuras simuladas; no abre escrituras del piloto ni MCP global.

Requisitos: R-20, R-21 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [05-agentes-skills-flujos.md](../SPECS/05-agentes-skills-flujos.md), [10-seguridad-privacidad.md](../SPECS/10-seguridad-privacidad.md).

Dependencias: [BG-008](#bg-008), [BG-020](#bg-020). Gates/insumos: D-05.

### Criterios de aceptación

- **BG-024-AC1:** Dada operación allowlisted y permisos vigentes, cuando se ejecuta lectura, entonces el broker aplica cuenta, ámbito y límites antes de llamar al proveedor.
- **BG-024-AC2:** Dado cambio de digest, cuenta, objeto, costo o caducidad, cuando se reutiliza una aprobación, entonces se rechaza sin efecto.
- **BG-024-AC3:** Dado texto del modelo que diga aprobado, cuando se evalúa el gate, entonces no sustituye confirmación humana autenticada.
- **BG-024-AC4:** Dada tool de shell, URL arbitraria, pago o escritura no habilitada, cuando se solicita, entonces se deniega sin cambiar el perfil base no_mcp.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-025"></a>

## BG-025 · Resolver reintentos y resultados inciertos sin duplicar efectos

Como miembro quiero que un reintento no duplique cargos o cambios para confiar en las automatizaciones autorizadas.

Estado `proposed` · 5 puntos provisionales · EP-06 Conexiones y ejecución controlada · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Persistencia y proveedor simulado para escrituras futuras; prueba no autoriza pagos reales.

Requisitos: R-23 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [12-api-eventos-contratos.md](../SPECS/12-api-eventos-contratos.md), [11-modelo-de-datos.md](../SPECS/11-modelo-de-datos.md).

Dependencias: [BG-024](#bg-024). Gates/insumos: D-05, D-08.

### Criterios de aceptación

- **BG-025-AC1:** Dada misma clave y payload, cuando se reintenta, entonces se devuelve el resultado previo sin otro cargo/efecto.
- **BG-025-AC2:** Dada misma clave con payload distinto, cuando se solicita, entonces se devuelve conflicto y no se ejecuta.
- **BG-025-AC3:** Dado timeout después de posible efecto externo, cuando no hay confirmación, entonces queda outcome_unknown y no se repite automáticamente.
- **BG-025-AC4:** Dada reconciliación con evidencia del proveedor, cuando se resuelve el estado, entonces se registra el resultado final preservando historial y reserva de consumo correspondiente.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-026"></a>

## BG-026 · Consultar recibos y auditoría sanitizada

Como miembro y operador autorizado quiero rastrear acciones y costos para resolver dudas sin exponer secretos o datos ajenos.

Estado `proposed` · 3 puntos provisionales · EP-07 Privacidad y operación · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Recibos propios y agregados minimizados; acceso excepcional nominal, no visibilidad Corporate universal.

Requisitos: R-24 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [11-modelo-de-datos.md](../SPECS/11-modelo-de-datos.md), [13-operacion-evaluacion.md](../SPECS/13-operacion-evaluacion.md).

Dependencias: [BG-008](#bg-008). Gates/insumos: D-06, D-07.

### Criterios de aceptación

- **BG-026-AC1:** Dada acción sensible, cuando termina o falla, entonces genera actor, ámbito, versión, resultado y costo conocido con correlación.
- **BG-026-AC2:** Dado token o contenido privado innecesario, cuando se registra una operación, entonces no aparece en logs ni recibos.
- **BG-026-AC3:** Dado un miembro que pide recibo ajeno, cuando se autoriza lectura, entonces se deniega sin metadatos de otro negocio.
- **BG-026-AC4:** Dado reporte corporativo, cuando se consulta, entonces usa agregados/minimización y no expone conversaciones individuales por defecto.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-027"></a>

## BG-027 · Gestionar memoria, exportación y solicitudes de borrado propias

Como miembro quiero controlar mis datos y memoria para decidir qué contexto conserva el agente.

Estado `proposed` · 5 puntos provisionales · EP-07 Privacidad y operación · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Política aprobada antes de Ready; no borrar corpus académico o evidencia retenida por obligación sin revisión.

Requisitos: R-25 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [10-seguridad-privacidad.md](../SPECS/10-seguridad-privacidad.md), [07-perfil-misiones-progreso.md](../SPECS/07-perfil-misiones-progreso.md).

Dependencias: [BG-014](#bg-014), [BG-026](#bg-026). Gates/insumos: D-06, D-07, D-08.

### Criterios de aceptación

- **BG-027-AC1:** Dado miembro verificado, cuando cambia preferencias de memoria, entonces se aplican a futuras operaciones y se explica qué historial permanece.
- **BG-027-AC2:** Dada exportación propia, cuando se genera, entonces excluye corpus licenciado y datos de otros miembros/negocios.
- **BG-027-AC3:** Dada solicitud de borrado, cuando se procesa, entonces respeta alcance, retención aprobada y estado visible sin prometer eliminación instantánea total.
- **BG-027-AC4:** Dado intento de exportar con sesión vencida o ID ajeno, cuando se solicita, entonces se deniega y no deja un enlace público permanente.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-028"></a>

## BG-028 · Ensayar despliegue y recuperación en staging autorizado

Como operador quiero restaurar el sistema sin reactivar permisos revocados para recuperar servicio con seguridad.

Estado `proposed` · 5 puntos provisionales · EP-07 Privacidad y operación · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Infraestructura, rutas y presupuesto aprobados para staging; no asumir VPS ni desplegar en Hostinger por analogía.

Requisitos: R-28 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [13-operacion-evaluacion.md](../SPECS/13-operacion-evaluacion.md), [02-arquitectura.md](../SPECS/02-arquitectura.md).

Dependencias: [BG-025](#bg-025), [BG-026](#bg-026). Gates/insumos: D-06, D-07, D-08.

### Criterios de aceptación

- **BG-028-AC1:** Dado backup de staging, cuando se restaura, entonces se mide cumplimiento del RPO/RTO acordado con evidencia.
- **BG-028-AC2:** Dada credencial revocada después del backup, cuando se restaura, entonces no vuelve a habilitarse por datos antiguos.
- **BG-028-AC3:** Dados jobs previos, cuando se recupera, entonces se reconcilian sin repetir operaciones como nuevas.
- **BG-028-AC4:** Dado despliegue fallido de prueba, cuando se usa el runbook, entonces se revierte al estado acordado sin tocar rutas o DB de producción.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-029"></a>

## BG-029 · Medir rendimiento y colas con carga piloto definida

Como miembro quiero respuestas oportunas y estado de trabajos largos para saber que mi solicitud sigue avanzando.

Estado `proposed` · 5 puntos provisionales · EP-07 Privacidad y operación · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Dataset, concurrencia, hardware y ventana definidos antes de Ready; 600 miembros no equivale a 600 sesiones simultáneas.

Requisitos: R-27 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [13-operacion-evaluacion.md](../SPECS/13-operacion-evaluacion.md).

Dependencias: [BG-014](#bg-014), [BG-028](#bg-028). Gates/insumos: D-03, D-08.

### Criterios de aceptación

- **BG-029-AC1:** Dado escenario de carga aprobado, cuando se mide perfil, entonces p95 es ≤800 ms o se registra incumplimiento sin ocultar muestras.
- **BG-029-AC2:** Dado trabajo asíncrono aceptado, cuando se mide su acuse durable, entonces p95 es ≤2 s en el mismo escenario definido.
- **BG-029-AC3:** Dada multimedia larga simulada o autorizada, cuando se procesa, entonces no bloquea la petición y se separan espera propia y proveedor.
- **BG-029-AC4:** Dado límite de cola o servicio caído, cuando llega otra petición, entonces se informa backpressure/estado sin perder silenciosamente el trabajo.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-030"></a>

## BG-030 · Evaluar utilidad y resultados del piloto sin promesas causales

Como responsable de la alianza quiero comparar utilidad, calidad y costos para decidir expansión con evidencia.

Estado `proposed` · 5 puntos provisionales · EP-08 Piloto e impacto verificable · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Cohorte, baseline, dataset y método aprobados; no atribuir renovación o cinco años de LTV sin datos longitudinales.

Requisitos: R-29 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [13-operacion-evaluacion.md](../SPECS/13-operacion-evaluacion.md), [15-requisitos-y-pruebas.md](../SPECS/15-requisitos-y-pruebas.md).

Dependencias: [BG-013](#bg-013), [BG-017](#bg-017), [BG-029](#bg-029), [BG-031](#bg-031). Gates/insumos: D-03, D-06, D-07.

### Criterios de aceptación

- **BG-030-AC1:** Dado dataset revisado, cuando se evalúa el agente, entonces se reportan utilidad, citas correctas y denegaciones por versión con evidencia.
- **BG-030-AC2:** Dada cohorte piloto, cuando se publica un indicador, entonces incluye denominador, periodo y fuente sin inventar tasa de renovación.
- **BG-030-AC3:** Dada comparación de tiempo/costo, cuando se comunica ahorro, entonces declara baseline, método y límites de atribución.
- **BG-030-AC4:** Dado incidente crítico o costo fuera de tope, cuando se revisa el gate, entonces se detiene expansión y se documenta corrección pendiente.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-031"></a>

## BG-031 · Operar soporte e incidentes con responsables y señales

Como miembro y operador quiero un canal de ayuda y escalamiento claro para resolver fallos sin depender de promesas de atención ilimitada.

Estado `proposed` · 3 puntos provisionales · EP-07 Privacidad y operación · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Guardia, canal, horario y severidades acordados; no enviar alertas o contactar miembros fuera del entorno autorizado.

Requisitos: R-24, R-28, R-29 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [13-operacion-evaluacion.md](../SPECS/13-operacion-evaluacion.md).

Dependencias: [BG-026](#bg-026), [BG-028](#bg-028). Gates/insumos: D-07, D-08.

### Criterios de aceptación

- **BG-031-AC1:** Dado incidente simulado, cuando se dispara una señal, entonces un responsable nominal recibe el caso por el canal autorizado.
- **BG-031-AC2:** Dado horario y alcance de soporte, cuando el miembro pide ayuda, entonces se informa expectativa real sin prometer disponibilidad no contratada.
- **BG-031-AC3:** Dada evidencia de incidente, cuando se comparte con soporte, entonces está sanitizada y restringida a quien necesita verla.
- **BG-031-AC4:** Dado cierre del ensayo, cuando se revisa el runbook, entonces se documentan causa, mitigación, recuperación y mejora con dueño.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-032"></a>

## BG-032 · Evaluar y habilitar una lectura acotada de Amazon FBA

Como miembro Negocio quiero consultar una señal autorizada de Amazon FBA para orientar decisiones sin modificar mi operación.

Estado `proposed` · 5 puntos provisionales · EP-09 Expansión por proveedor · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Propuesta a refinar con autorización y recurso exacto de SP-API; no existe promesa de MCP oficial ni integración lista.

Requisitos: R-18, R-19, R-21, R-24 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [09-conexiones-onboarding.md](../SPECS/09-conexiones-onboarding.md).

Dependencias: [BG-024](#bg-024), [BG-025](#bg-025), [BG-030](#bg-030). Gates/insumos: D-04, D-05, D-06, D-08.

### Criterios de aceptación

- **BG-032-AC1:** Dado recurso y cuenta aprobados, cuando se autoriza, entonces se habilita sólo esa lectura y se identifica la cuenta correcta.
- **BG-032-AC2:** Dada falta de app, autorización o elegibilidad, cuando se muestra el proveedor, entonces permanece en preparación y no simula conexión.
- **BG-032-AC3:** Dada revocación o solicitud de cuenta ajena, cuando se consulta, entonces se deniega sin filtrar reportes.
- **BG-032-AC4:** Dada petición de escritura o cambio operativo, cuando se evalúa, entonces se rechaza y se registra recibo de la lectura permitida sin secretos.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-033"></a>

## BG-033 · Conectar Meta para un diagnóstico de lectura aprobado

Como miembro Negocio quiero revisar resultados de un activo Meta elegido para mejorar mi estrategia sin publicar ni aumentar gasto automáticamente.

Estado `proposed` · 5 puntos provisionales · EP-09 Expansión por proveedor · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Activo, métrica y app review por definir antes de Ready; anuncios/publicación/escrituras fuera.

Requisitos: R-18, R-19, R-21, R-24 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [09-conexiones-onboarding.md](../SPECS/09-conexiones-onboarding.md).

Dependencias: [BG-024](#bg-024), [BG-025](#bg-025), [BG-030](#bg-030). Gates/insumos: D-04, D-05, D-06, D-08.

### Criterios de aceptación

- **BG-033-AC1:** Dado activo y permiso aprobados, cuando conecta, entonces se prueba sólo la lectura de métricas permitidas del activo elegido.
- **BG-033-AC2:** Dada app sin aprobación necesaria o cancelación, cuando termina onboarding, entonces no se marca conectado.
- **BG-033-AC3:** Dado cambio de cuenta o revocación, cuando pide un reporte, entonces se revalida el permiso y se deniega el ámbito anterior cuando corresponda.
- **BG-033-AC4:** Dada orden de publicar o aumentar presupuesto, cuando se evalúa el broker, entonces se deniega sin efecto externo y el diagnóstico cita su fuente y periodo.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-034"></a>

## BG-034 · Conectar Stripe del negocio sólo para conciliación de lectura

Como miembro Negocio quiero consultar una conciliación de mi cuenta Stripe para entender mi operación sin autorizar cobros o reembolsos.

Estado `proposed` · 5 puntos provisionales · EP-09 Expansión por proveedor · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Cuenta mercantil del miembro y entorno de prueba; separado de billing de agentes y membresía académica.

Requisitos: R-18, R-19, R-21, R-24 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [09-conexiones-onboarding.md](../SPECS/09-conexiones-onboarding.md), [04-planes-permisos-consumo.md](../SPECS/04-planes-permisos-consumo.md).

Dependencias: [BG-024](#bg-024), [BG-025](#bg-025), [BG-030](#bg-030). Gates/insumos: D-04, D-05, D-06, D-08.

### Criterios de aceptación

- **BG-034-AC1:** Dada conexión y recurso aprobados, cuando se consulta conciliación, entonces se leen sólo datos mínimos de la cuenta elegida con periodo y moneda.
- **BG-034-AC2:** Dado token inválido o cuenta ajena, cuando se usa la skill, entonces se deniega sin revelar transacciones.
- **BG-034-AC3:** Dada orden de cobrar, transferir o reembolsar, cuando se evalúa, entonces se rechaza sin efecto financiero.
- **BG-034-AC4:** Dado un pago comercial visible, cuando se calculan derechos del miembro, entonces no se usa como prueba de academia PRO ni modifica el plan del agente.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-035"></a>

## BG-035 · Conectar Mercado Pago para reporte operativo de lectura

Como miembro Negocio quiero consultar un reporte de Mercado Pago para entender mi cobranza sin ceder control de pagos al agente.

Estado `proposed` · 5 puntos provisionales · EP-09 Expansión por proveedor · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: App y cuenta sandbox aprobadas, lectura mínima; no habilita cobros, retiros ni membresía.

Requisitos: R-18, R-19, R-21, R-24 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [09-conexiones-onboarding.md](../SPECS/09-conexiones-onboarding.md), [10-seguridad-privacidad.md](../SPECS/10-seguridad-privacidad.md).

Dependencias: [BG-024](#bg-024), [BG-025](#bg-025), [BG-030](#bg-030). Gates/insumos: D-04, D-05, D-06, D-08.

### Criterios de aceptación

- **BG-035-AC1:** Dada conexión autorizada, cuando se consulta el reporte permitido, entonces identifica cuenta, periodo y moneda sin mezclar otros negocios.
- **BG-035-AC2:** Dado callback inválido o revocación, cuando se intenta usar la conexión, entonces se deniega sin exponer credenciales.
- **BG-035-AC3:** Dada orden de cobrar, devolver o transferir, cuando se evalúa la skill, entonces se deniega por fuera del piloto de lectura.
- **BG-035-AC4:** Dado un reporte exitoso, cuando se entrega, entonces incluye recibo sanitizado y no altera derechos académicos ni billing de la alianza.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-036"></a>

## BG-036 · Resolver la discrepancia de rutas legacy antes de integrar el nuevo módulo

Como responsable de integración quiero una base legacy sin rutas duplicadas y con paridad comprobada para incorporar el nuevo módulo sin cambiar handlers por accidente.

Estado `proposed` · 5 puntos provisionales · EP-07 Privacidad y operación · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: proposed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Hallazgo BL-004 de SPEC_AGENTS a264c30; comparar con la copia principal y decidir conservación de handlers. Fuera de SP-001; no autoriza rebase, commit, deploy ni migraciones.

Requisitos: R-01, R-28 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [01-base-existente.md](../SPECS/01-base-existente.md), [12-api-eventos-contratos.md](../SPECS/12-api-eventos-contratos.md).

Dependencias: [BG-005](#bg-005). Gates/insumos: D-02, D-08.

### Criterios de aceptación

- **BG-036-AC1:** Dado el baseline con cuatro duplicados, cuando se comparan los handlers entre ramas, entonces queda documentada la implementación elegida y la razón sin borrar diferencias no revisadas.
- **BG-036-AC2:** Dada la base candidata aprobada, cuando corre la comprobación global, entonces cada método/ruta es único sin debilitar el validador.
- **BG-036-AC3:** Dadas las rutas y contratos existentes, cuando se prepara integración en entorno autorizado, entonces las pruebas de regresión preservan comportamiento y autorización esperados.
- **BG-036-AC4:** Dado un conflicto con cambios ajenos o falta de aprobación, cuando se intenta integrar, entonces se detiene el cambio y se conserva la demo local independiente.

### Control y evidencia

DoR: sin revisión registrada. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 0. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

<a id="bg-037"></a>

## BG-037 · Revocar la sesión local y cerrar todas las copias del sujeto

Como miembro quiero cerrar esta sesión de prueba y todas las de mi sujeto para que una cookie vieja no siga abriendo mi espacio.

Estado `done` · 5 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: sin asignar.

Ejecutor: Codex · Revisión producto: Roger · Asignación: confirmed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Cookie opaca loopback y versión de sesión en memoria en member-workspace. No plataforma real de membresías (BG-008), Hostinger, BotFather, cookie __Host-, BFF de staging ni JWT.

Requisitos: R-01 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [03-identidad-membresias.md](../SPECS/03-identidad-membresias.md), [10-seguridad-privacidad.md](../SPECS/10-seguridad-privacidad.md).

Dependencias: [BG-007](#bg-007). Gates/insumos: D-02, D-08.

### Criterios de aceptación

- **BG-037-AC1:** Dada una sesión web ficticia vigente, cuando se cierra solo esa cookie, entonces el siguiente GET privado responde 401 de sesión y no un error de membresía, y el historial sintético no se borra.
- **BG-037-AC2:** Dadas dos cookies de la misma persona, cuando se cierran todas, entonces sube la versión de sesión y ambas copias quedan inválidas sin afectar a otra persona.
- **BG-037-AC3:** Dada una mutación de cierre global, cuando faltan origen o intención, entonces se deniega y la sesión sigue; un recover por nombre o email permanece denegado.
- **BG-037-AC4:** Dada una membresía de prueba no verificable con sesión viva, cuando se pide el recurso PRO, entonces responde 503; después de cerrar todas, el mismo recurso responde 401 de sesión.

### Control y evidencia

DoR: sprints/SP-004/READY.md. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 4. Aceptación: registrada; ver JSON/fuente. No inferir cumplimiento por trazabilidad.

| Tarea | Acción | Responsable propuesto | Estado |
|---|---|---|---|
| BG-037-T1 | Revocar la cookie actual sin confundirla con membresía | Codex | done |
| BG-037-T2 | Incrementar versión de sesión al cerrar todas las copias | Codex | done |
| BG-037-T3 | Mantener origen/intención y 503 distinto de 401 | Codex | done |

<a id="bg-038"></a>

## BG-038 · Desvincular Telegram local con HMAC fresco y un acceso web alternativo

Como miembro quiero desvincular mi Telegram de prueba tras demostrar posesión y sin quedarme sin acceso web para que ese sujeto deje de abrir mi espacio.

Estado `in_review` · 5 puntos provisionales · EP-01 Identidad y acceso seguro · Sprint candidato: SP-005.

Ejecutor: Codex · Revisión producto: Roger · Asignación: confirmed. Revisor independiente: no designado; no afirmar revisión independiente.

Alcance: Unlink HMAC fixture en member-workspace; acceso alternativo = sesión web opaca. No BG-008, Hostinger, BotFather, recuperación asistida, merge ni cookie __Host-.

Requisitos: R-01, R-02 en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: [03-identidad-membresias.md](../SPECS/03-identidad-membresias.md), [10-seguridad-privacidad.md](../SPECS/10-seguridad-privacidad.md).

Dependencias: [BG-007](#bg-007). Gates/insumos: D-02, D-08.

### Criterios de aceptación

- **BG-038-AC1:** Dada una persona con cookie web vigente y un vínculo Telegram, cuando confirma desvincular con HMAC fresco del mismo sujeto, entonces el vínculo se borra, el personId permanece, la cookie sigue viva y un initData posterior de ese Telegram no abre ese espacio.
- **BG-038-AC2:** Dada una persona cuyo único acceso verificado es el vínculo Telegram, cuando pide desvincular, entonces se rechaza y el vínculo permanece.
- **BG-038-AC3:** Dada una sesión web vigente, cuando pide desvincular sin HMAC fresco, con HMAC de otro sujeto, con replay o sin origen o intención, entonces se deniega, el vínculo permanece y no sube la versión de sesión.
- **BG-038-AC4:** Dado el Telegram de una persona A, cuando la persona B intenta desvincularlo, entonces se deniega sin fusionar ni reasignar, y recuperar por nombre o email sigue denegado.

### Control y evidencia

DoR: sprints/SP-005/READY.md. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.

Evidencias registradas: 4. Aceptación: pendiente. No inferir cumplimiento por trazabilidad.

| Tarea | Acción | Responsable propuesto | Estado |
|---|---|---|---|
| BG-038-T1 | POST unlink con HMAC fresco y auditoría | Codex | done |
| BG-038-T2 | Rechazar último acceso, HMAC inválido y CSRF | Codex | done |
| BG-038-T3 | Cruce de persona sin merge y recover denegado | Codex | done |

## Cobertura de requisitos

| Requisito | Historias propuestas |
|---|---|
| R-01 | [BG-002](#bg-002), [BG-006](#bg-006), [BG-007](#bg-007), [BG-036](#bg-036), [BG-037](#bg-037), [BG-038](#bg-038) |
| R-02 | [BG-007](#bg-007), [BG-038](#bg-038) |
| R-03 | [BG-001](#bg-001), [BG-003](#bg-003), [BG-005](#bg-005), [BG-008](#bg-008) |
| R-04 | [BG-003](#bg-003), [BG-004](#bg-004), [BG-008](#bg-008) |
| R-05 | [BG-003](#bg-003), [BG-005](#bg-005), [BG-008](#bg-008) |
| R-06 | [BG-002](#bg-002), [BG-003](#bg-003), [BG-005](#bg-005), [BG-019](#bg-019) |
| R-07 | [BG-017](#bg-017) |
| R-08 | [BG-009](#bg-009) |
| R-09 | [BG-010](#bg-010) |
| R-10 | [BG-017](#bg-017), [BG-018](#bg-018), [BG-019](#bg-019) |
| R-11 | [BG-018](#bg-018) |
| R-12 | [BG-007](#bg-007), [BG-014](#bg-014) |
| R-13 | [BG-011](#bg-011) |
| R-14 | [BG-012](#bg-012) |
| R-15 | [BG-013](#bg-013) |
| R-16 | [BG-004](#bg-004), [BG-015](#bg-015) |
| R-17 | [BG-016](#bg-016) |
| R-18 | [BG-021](#bg-021), [BG-022](#bg-022), [BG-023](#bg-023), [BG-032](#bg-032), [BG-033](#bg-033), [BG-034](#bg-034), [BG-035](#bg-035) |
| R-19 | [BG-022](#bg-022), [BG-023](#bg-023), [BG-032](#bg-032), [BG-033](#bg-033), [BG-034](#bg-034), [BG-035](#bg-035) |
| R-20 | [BG-024](#bg-024) |
| R-21 | [BG-022](#bg-022), [BG-023](#bg-023), [BG-024](#bg-024), [BG-032](#bg-032), [BG-033](#bg-033), [BG-034](#bg-034), [BG-035](#bg-035) |
| R-22 | [BG-019](#bg-019), [BG-020](#bg-020) |
| R-23 | [BG-025](#bg-025) |
| R-24 | [BG-012](#bg-012), [BG-026](#bg-026), [BG-031](#bg-031), [BG-032](#bg-032), [BG-033](#bg-033), [BG-034](#bg-034), [BG-035](#bg-035) |
| R-25 | [BG-027](#bg-027) |
| R-26 | [BG-001](#bg-001), [BG-004](#bg-004), [BG-005](#bg-005), [BG-014](#bg-014), [BG-015](#bg-015), [BG-021](#bg-021) |
| R-27 | [BG-029](#bg-029) |
| R-28 | [BG-028](#bg-028), [BG-031](#bg-031), [BG-036](#bg-036) |
| R-29 | [BG-030](#bg-030), [BG-031](#bg-031) |
