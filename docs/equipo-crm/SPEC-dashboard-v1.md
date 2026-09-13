# SPEC · Dashboard de equipo Be Global (CRM ligero)

**Estado:** P0 implementado en `beglobal/asistente-widget/` (shell + módulo Leads). P1–P4 no construidos.  
**Fecha:** 13 septiembre 2026  
**Audiencia:** Team (operación) y Corporate (gobierno).  
**Fuera de alcance de este SPEC:** cobro, WhatsApp, HubSpot/Salesforce, Mini Apps Telegram en producción (F0 sigue bloqueado), voz Vapi, Hermes conversando con el visitante.

Versión del documento: `equipo-crm/1.0-draft`.

---

## 1. Problema

Hoy el CRUD de leads es una tabla HTML en [https://chatbeglobal.softvibes.pro/asistente/equipo](https://chatbeglobal.softvibes.pro/asistente/equipo): login por token, lista, cambio de estado y borrado. No hay navegación, ficha, actividad, ni vista de miembros PRO.

El chat PRO vive en otro runtime (`chatbeglobal-premium-widget`, perfil `beglobal-premium-web`). Las Mini Apps tienen métricas Corporate en código (`/api/corporate/metrics`) pero **no son el panel de producción** hasta F0 (bots + TLS + allowlists).

Hace falta un **shell de trabajo** tipo CRM interno: varios módulos, misma identidad Be Global, mismos roles, sin mezclar PII de leads con transcripciones PRO.

---

## 2. Principios

1. **Un shell, varios módulos.** Leads no es “el producto”; es un módulo.
2. **Datos reales o el módulo dice “sin fuente”. **Nunca KPIs de demostración.**
3. **Separación de runtimes.** Lead (asistente público) ≠ miembro PRO (chat autenticado) ≠ Mini Apps (Telegram, F0).
4. **PII mínima.** Sin transcripción completa. Resumen de diagnóstico / misión / eventos agregados.
5. **Team opera; Corporate gobierna.** Team no exporta masivo ni cambia catálogos CTA. Corporate no chatea con el lead.
6. **El agente no cierra high ticket.** El dashboard no simula un closer.

---

## 3. Usuarios y permisos

| Rol | Entra con | Ve | No ve / no hace |
|---|---|---|---|
| Team designado | Token de equipo o sesión posterior (P1) | Leads, monitor PRO (agregados + lista seudonimizada), avances de miembros que Corporate habilite | Export CSV masivo, T&C, tokens, hilos Hermes |
| Corporate designado | Mismo shell, rol `corporate` | Todo Team + KPIs, retención, designar quién ve fichas nominativas | Hablar con el visitante desde Hermes |
| Visitante / miembro | No entra al dashboard | — | — |

P0 conserva `LEADS_ADMIN_TOKEN` (ya en `/etc/beglobalasistente-widget.env`). P1 introduce usuarios nombrados (`team@`, `corporate@`) con hash Argon2/bcrypt, cookie HttpOnly, CSRF, 2FA opcional. El token actual queda como break-glass.

---

## 4. Arquitectura de información (shell)

URL propuesta (mismo origen que el chat público, path nuevo):

`https://chatbeglobal.softvibes.pro/equipo/`

Redirect 301 desde `/asistente/equipo` → `/equipo/leads`.

```
/equipo/                 Resumen (home CRM)
/equipo/leads            Módulo Leads
/equipo/leads/:id        Ficha lead
/equipo/pro              Monitor agente PRO
/equipo/pro/:userId      Ficha miembro (seudónimo por defecto)
/equipo/avances          Avances, insights, evidencias
/equipo/kpis             Tablero de indicadores
/equipo/ajustes          Catálogo CTA, retención, quién accede (solo Corporate)
```

Navegación izquierda fija (escritorio) / inferior (móvil): Resumen · Leads · PRO · Avances · KPIs. Ajustes en pie.

Marca: navy `#062F55`, azul `#63ABE6`, oro `#FDB12B`, verde `#45B114`, Inter + Montserrat, wordmark oficial. No copiar HubSpot; sí: densidad de tabla + panel de detalle.

---

## 5. Módulo A — Resumen (home)

**Objetivo:** en 5 segundos saber qué atender hoy.

Widgets (solo si hay fuente):

| Widget | Fuente P0–P1 | Si no hay fuente |
|---|---|---|
| Leads nuevos 7 días | `leads.json` | Ocultar, no mostrar 0 falso de otro sistema |
| Leads por estado | CRUD actual | — |
| Sesiones PRO 24 h | P2, telemetría premium | Módulo PRO en “sin instrumentar” |
| Misiones / evidencias | Mini Apps o eventos PRO P3 | Igual |

Lista “Cola de hoy”: leads `nuevo` + miembros PRO con error 403 reciente o sin mensaje en 7 días (P2).

---

## 6. Módulo B — Leads (evolución del CRUD)

### 6.1 Lista (P0/P1)

Sustituir la tabla cruda por:

- Filtros: estado, CTA (`webinar-lista`, `sitio-oficial`, `membresias` no aplica a lead), etapa (curioso…escalando), rango de fechas, “tiene teléfono”.
- Columnas: alta, nombre, correo (Team ve completo; log de acceso), teléfono, CTA, etapa, estado, última nota.
- Vista **tablero** (P1): columnas = estados actuales `nuevo / contactado / inscrito / socio / baja`. Arrastrar = PATCH status + evento `lead.status_changed`.
- Vista **tabla** (P0): la de ahora, con densidad y click a ficha.
- Búsqueda: nombre, correo, teléfono, cta_id.
- Vacío: copy “Aún no hay leads con este filtro. El alta ocurre en el chat público con consentimiento.”

Estados: no añadir `cualificado` hasta que Corporate defina criterio (sí/no evidencia). SPEC reserva el campo `qualification: none | fit | no_fit` para P1.1.

### 6.2 Ficha (P1) — pantalla principal de trabajo

Cabecera: nombre, estado, CTA, etapa, fechas, botones Contactado / Inscrito / Socio / Baja / Anonimizar.

Bloques:

1. **Consentimiento:** versiones T&C/aviso, finalidades, `retention_until`, token de borrado no se muestra (solo acción Anonimizar).
2. **Contexto del agente:** etapa, resumen de misión (280 c). No historial de chat.
3. **Actividad:** timeline append-only (`nota`, `estado`, `correo_enviado_manual`). Notas internas ≤ 500 c en P0; P1 timeline en archivo o SQLite.
4. **CTA destino:** URL del catálogo o “lista de espera, sin fecha”.

Prohibido: botón “WhatsApp” hasta integración real. Mailto `mailto:` sí (abre cliente local, no registra envío hasta que Team pulse “Marqué enviado”).

### 6.3 API (contrato actual + extensiones)

Existente:

- `GET /api/equipo/leads?status&q`
- `PATCH /api/equipo/leads/:id` `{status, notes_internal}`
- `DELETE /api/equipo/leads/:id` anonimiza

P1:

- `GET /api/equipo/leads/:id`
- `POST /api/equipo/leads/:id/events` `{type, text}`
- `GET /api/equipo/summary`

Paginación: `limit=50&cursor=` cuando >100 filas.

Almacenamiento P0: JSON actual. P1: SQLite en `StateDirectory` (`/var/lib/beglobalasistente-widget`) con migración desde JSON. No Mini Apps DB.

---

## 7. Módulo C — Monitor del agente PRO

**Objetivo:** ver quién usa `beglobal-premium-web` sin leer el corpus ni el hilo.

### 7.1 Hecho hoy (no inventar)

- Servicio vivo: `chatbeglobal-premium-widget` en `https://chatbeglobal.softvibes.pro/` (`publicAccess: false`).
- Auth de membresía en servidor; anónimo 401, no PRO 403.
- El dashboard de equipo **no** consulta Hermes ni el corpus ASR.
- No hay API pública de “usuarios PRO online”. Hay que **instrumentar** el widget premium (P2).

### 7.2 Eventos a emitir (servidor, no navegador)

Tabla `pro_events` (SQLite del dashboard o del widget premium, no del perfil Hermes):

| event | payload (sin texto de usuario) |
|---|---|
| `session_start` | user_hash, ts |
| `session_end` | duration_s |
| `auth_ok` / `auth_401` / `auth_403` | user_hash opcional |
| `message_out` | tokens_est, tool_ids usados (nombres, no args) |
| `tool_academy_hit` / `tool_academy_miss` | course_id público del índice, no transcripción |
| `error_upstream` | código, no body |

`user_hash` = HMAC(membresía_id, LEADS_HASH_SALT). Corporate puede revelar email solo con permiso y log.

### 7.3 Pantalla lista PRO

Columnas: seudónimo, última sesión, msgs 7d, 401/403, herramientas academia (hits), estado `activo / frío / bloqueado`.

Filtros: 24h / 7d / 30d. No “online” si el WS no existe; usar `last_event < 15 min` como “reciente”.

### 7.4 Ficha miembro PRO

- Identidad: seudónimo; email/nombre solo Corporate + motivo.
- Serie 30 días: sesiones, mensajes (conteo).
- Últimas herramientas (ids).
- Vínculo opcional a lead si el correo coincide **y** hay consentimiento de “novedades” o alta como socio. Si no hay match, no se fusiona.

**No mostrar:** mensajes, corpus, cookies, Telegram initData.

---

## 8. Módulo D — Avances e insights

Tres fuentes posibles; el UI declara cuál está activa:

| Fuente | Qué aporta | Condición |
|---|---|---|
| Mini Apps SQLite | diagnóstico, `lesson_progress`, `mission_progress`, evidencia, score, TTV | F0 verde (hoy no) |
| Eventos PRO `tool_academy_*` | cursos consultados, no “lección completada” | P2 |
| Academia índice `/piloto` | catálogo 50 cursos / 1.181 lecciones (metadatos) | ya público; no es progreso de persona |

### 8.1 Lista de avances

Fila = miembro (hash). Columnas: etapa onboarding (si Mini Apps), misiones hechas, última evidencia (estado pending/approved), score medio, racha.

Insights (reglas, no LLM sobre PII):

- “Sin misión en 14 días y >3 sesiones” → riesgo de abandono.
- “Evidencia pending > 5 días” → cola Team.
- “Solo tool_miss” → el índice no cubre su pregunta (insight de contenido, no de persona).

### 8.2 Detalle

Línea de tiempo de misiones/lecciones (Mini Apps) o de consultas a academia (PRO). Team deja `coach_feedback` solo si Mini Apps F0 está on; si no, notas en la ficha PRO (mismo store de eventos, tipo `coach_note`).

---

## 9. Módulo E — KPIs

Un tablero, dos embudos. Cada KPI lleva **definición, fórmula, fuente, ventana, dueño**.

### Embudo captación (asistente)

| KPI | Definición | Fórmula | Fuente | Meta piloto |
|---|---|---|---|---|
| Diagnósticos con CTA | Chats donde el widget ofreció CTA | conteo servidor (nuevo evento `cta_shown`) | widget asistente P1 | medir, no meta |
| Leads con consentimiento | Altas `register_lead` OK | count leads status≠borrado | leads store | — |
| Tasa lead / sesión | leads / sesiones 7d | P1 necesita `session_created` persistido | hoy sesión es RAM 30 min | no reportar hasta persistir |
| Contactados 48 h | leads nuevo→contactado en 48h | eventos status | P1 timeline | — |
| Socio desde lead | status `socio` | manual Team | no auto | no atribuir al bot |

### Embudo miembro PRO

| KPI | Definición | Fórmula | Fuente | Nota |
|---|---|---|---|---|
| Auth OK | 200 de chat con membresía | count `auth_ok` | P2 | |
| Rechazo 403 | registrado sin PRO | `auth_403` | P2 | no es lead |
| DAU/WAU chat | usuarios distintos con `message_out` | distinct user_hash | P2 | |
| Consultas academia útiles | `tool_academy_hit` / (hit+miss) | P2 | |
| Tiempo a primer valor | first `tool_academy_hit` − first `auth_ok` | P2 | minutos |
| Misiones completadas | Mini Apps `mission_progress.completed` | F0 | ocultar si F0 rojo |
| Score evidencia | AVG(evidence.score) | F0 | igual |

### Qué no es KPI

Tokens, “likes”, leads pegados en el chat sin formulario, visitas a `/piloto` (catálogo, no persona).

Home KPIs: máximo 6 números. El resto en `/equipo/kpis` con la ventana 7/30/90.

---

## 10. UX detallada (componentes)

### Shell

- Alto 56 px: wordmark + “Equipo” + rol + salir.
- Sidebar 220 px. Ítem activo: fondo soft `#EAF5FF`, texto navy.
- Contenido: fondo `#F7FAFE`, cards blancas, radio 16–22 px, sombra única del sistema actual del asistente.

### Login P0

Conservar token. Copy: “Solo personas designadas. Este panel no es el chat.” Tras login, persistir cookie `bgas_admin` (ya existe) y ocultar el campo.

### Accesibilidad

WCAG 2.2 AA: contraste del oro sobre blanco no usar para texto pequeño; foco visible 3 px azul; tablas con `<th scope>`; ficha en dialog o ruta propia (preferir ruta para compartir).

### Responsive

<960 px: sidebar → tabs; tablero leads → lista; no kanban horizontal obligatorio.

### Estados

Loading (skeleton 3 filas), error 401 (volver a login), error 502 (copy “el módulo no responde”, no inventar cifras), vacío (copy por módulo).

---

## 11. Modelo de datos objetivo (P1+)

```
users_equipo(id, email, role, password_hash, created_at)
leads(...)                         -- ya definido
lead_events(id, lead_id, actor, type, payload, ts)
pro_identities(user_hash, membership_hint_enc, created_at)
pro_events(id, user_hash, event, payload_json, ts)
module_flags(name, enabled, source_note)  -- p.ej. miniapps_f0=false
audit_log(id, actor, action, entity, ts)
```

Cifrado: email de miembro solo en `membership_hint_enc` si Corporate activa “ver identidad”. P0 no lo implementa.

Retención: leads 548 días (catálogo). Eventos PRO 90 días (propuesto; Corporate confirma). Audit 2 años.

---

## 12. No objetivos (explícitos)

- Unificar bases del asistente, premium y Mini Apps en un solo SQLite en P0.
- Mostrar el chat PRO o el corpus.
- Autodesignar Guía/Creador/Negocio desde este panel.
- Envío masivo de email/WhatsApp.
- Reemplazar el dashboard ejecutivo `/piloto/` (ese es de presentación, no CRM).
- Conectar n8n como CRM.

---

## 13. Fases y criterios de hecho

### P0 — Shell + Leads usable (1 iteración)

- Layout CRM, módulo Leads = tabla mejorada + filtros + ficha lectura.
- Redirect `/asistente/equipo`.
- APIs actuales.
- **Hecho:** Team trabaja leads sin la tabla 2010; 0 regresiones en alta pública.

### P1 — CRM leads

- Kanban, timeline, summary home, persistir `cta_shown` y sesiones (conteo, no texto).
- SQLite leads.
- **Hecho:** ficha URL `/equipo/leads/:id` y evento al cambiar estado.

### P2 — Monitor PRO

- Instrumentar `chatbeglobal-premium-widget` (eventos).
- Módulo PRO con lista y ficha hash.
- **Hecho:** un miembro PRO real genera `auth_ok` + `message_out` visibles en <5 min. Anónimo no aparece como usuario.

### P3 — Avances

- Si F0 sigue rojo: avances = solo señales PRO (consultas academia).
- Si F0 verde: conectar métricas Mini Apps ya especificadas (`members_active`, misiones, TTV, evidencias).
- **Hecho:** la UI declara la fuente en un chip “Mini Apps” o “Chat PRO”.

### P4 — KPIs

- Tablero con definiciones del §9. CSV solo Corporate, con motivo en audit.
- **Hecho:** cada KPI muestra fuente y ventana; oculto si falta evento.

Rollback: restaurar `/opt/beglobalasistente-widget.backup-*` y quitar reverse proxy `/equipo/` si se añadió.

---

## 14. Pruebas de aceptación (mínimas)

1. Lead de prueba con consentimiento aparece en Leads; sin consentimiento, no.
2. Soporte/reembolso en el chat no crea lead ni CTA.
3. Team no ve `/equipo/ajustes`.
4. Dos miembros PRO no cruzan eventos.
5. Export (P4) deja `audit_log`.
6. Anonimizar lead borra nombre/correo/teléfono; eventos quedan sin PII.
7. Módulo PRO con flag off muestra “sin instrumentar”, no ceros.
8. Lighthouse móvil lista leads: foco y contraste.

---

## 15. Decisión que Corporate debe tomar antes de P2

1. ¿Identidad nominativa de miembros PRO en el panel, o solo hash hasta incidente?
2. ¿Retención de eventos PRO 90 días?
3. ¿F0 Mini Apps en el horizonte, o avances solo desde el chat web?
4. ¿Usuarios nombrados (email) en P1 o seguir con un solo token de equipo?
