# Mini Apps de Telegram · Be Global Pro

Plan aprobado: 2026-07-30. El chat con la Guía sigue siendo la experiencia
principal; las Mini Apps resuelven lo que un chat hace mal — ver progreso,
subir evidencias, aprobar con un tap y leer métricas.

## Arquitectura común

- **Un monorepo, tres apps** (`webapp/member`, `webapp/team`,
  `webapp/corporate`), servidas por la misma API.
- **Autenticación nativa de Telegram**: cada Mini App envía `initData` firmado;
  la API lo valida con HMAC contra el token del bot de ese perfil. Sin login ni
  contraseñas, alineado con la regla "nunca pedir credenciales".
- **Backend**: la API autenticada del VPS (gate 3 del despliegue) —
  `api/main.py` (FastAPI + SQLite). Las Mini Apps son su primer consumidor.
- **Evidencias**: se guardan en el Media Hub aislado
  (`/srv/beglobal/mediahub`), separadas por perfil y usuario.
- **Aislamiento**: allowlist por perfil idéntica al modelo del gateway; un
  member solo ve sus datos.

## Apps y su valor

### 📱 Member — "Mi Guía" (prioridad 1)

1. Mi ruta: progreso Precheck → Intake → Setup → Misión 1 → Aceptación.
2. Mi misión activa como checklist con entregable.
3. Subir evidencia (foto/archivo) ligada a la tarea actual.
4. Recursos recomendados para su fase.
5. Botón "Continuar con mi Guía" que regresa al chat.

Valor: ataca "tiempo a primer valor < 30 min" y "onboarding sin intervención
técnica".

### 🛠️ Team — "Centro de operación"

1. Cola de socios con fase, último avance y semáforo de bloqueo.
2. Bandeja de escalamientos: aprobar/rechazar con un tap.
3. QA: calificar entregables 1–5 (criterio ≥ 4/5) y registrar defectos.
4. Evidencias por revisar con la ficha de la tarea.

Valor: hace medible el checkpoint humano y baja minutos de soporte por usuario.

### 🏛️ Corporate — "Torre de control"

1. Métricas del piloto en vivo ("sin datos" cuando no hay evidencia).
2. Aprobaciones de gobierno con registro.
3. Registro de decisiones y criterios go/no-go.
4. Riesgos y gates del despliegue.

Valor: el sponsor ve el piloto donde ya vive (Telegram) y cada aprobación queda
registrada para el informe final.

## Fases

| Fase | Entregable | Depende de |
|---|---|---|
| F0 — Decisiones | Bots Corporate/Team/Member en BotFather + dominio TLS | Reunión (mapeo de bots) |
| F1 — Fundación | API autenticada + validación initData + modelo de datos + Media Hub | F0 |
| F2 — Member | Mini App "Mi Guía" probada con usuarios piloto | F1 |
| F3 — Team | Cola, escalamientos y QA | F1 |
| F4 — Corporate | Métricas y aprobaciones | F1 |

## Riesgos a cuidar

- No lanzar antes que la API (el FileHub actual no tiene autenticación).
- Validación estricta de `initData` (expiración, anti-replay) y allowlist.
- Scope: cada app arranca con sus 3–4 pantallas; lo demás va al roadmap.
- La Mini App registra telemetría para el costo por usuario.

## Estado de implementación

- [x] F1 — API (`api/`): validación initData por perfil, SQLite, Media Hub,
  endpoints de ruta/evidencias/escalamientos/QA/métricas/decisiones/gates.
- [x] F2 — `webapp/member/`
- [x] F3 — `webapp/team/`
- [x] F4 — `webapp/corporate/`
- [ ] Despliegue en VPS (requiere F0: tokens de bots + dominio TLS). Ver
  `README.md`.
