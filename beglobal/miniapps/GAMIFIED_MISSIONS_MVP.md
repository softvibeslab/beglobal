# MVP · Misiones gamificadas Be Global Team + Miembro

Estado: implementado como MVP local/public-tunnel para validación inicial.

## Objetivo

Mejorar la adopción de los agentes Be Global Team y Miembro con un sistema de misiones, méritos y prompts proactivos que conecte chat + Mini App.

El chat sigue siendo la mentora/guía principal. La Mini App funciona como superficie visual para progreso, evidencias, méritos y siguientes acciones.

## Evidencia usada

- Aportes Team: documento de Gilberto sobre progresión/no salto de niveles y límites de IA para socios.
- Aportes Team: necesidad de convertir prácticas en guías/checklists, QA y escalamiento.
- Contexto corporativo: primer resultado útil en menos de 30 minutos, evidencia observable y checkpoint humano para temas sensibles.
- Estado actual: no existe perfil `beglobal-member` como perfil Hermes separado; el MVP usa la app `member` existente dentro de `miniapps`.

## Sistema por perfil

### Miembro

Meta: llevar al socio de bloqueo/ruido mental a acción mínima verificable.

Misiones MVP:

1. Diagnóstico claro
   - Acción: responder fase actual, producto/categoría, canal, bloqueo y tiempo disponible.
   - Evidencia: texto corto o captura.
2. Producto validable
   - Acción: escoger 1 producto antes de catálogo/escala.
   - Evidencia: ficha del producto o captura.
3. Oferta y contenido mínimo
   - Acción: gancho, beneficios, objeciones y CTA.
   - Evidencia: copy, guion o borrador.
4. Primera evidencia útil
   - Acción: generar entregable en menos de 30 minutos.
   - Evidencia: captura, link, archivo, métrica o guion.

### Team / Equipo

Meta: convertir experiencia del equipo en QA, reglas operativas y aprendizajes escalables.

Misiones MVP:

1. Capturar práctica real
   - Evidencia: guía, checklist o regla propuesta.
2. Validar límite Member
   - Evidencia: respuesta real del agente + calificación + ajuste requerido.
3. Feedback accionable
   - Evidencia: antes/después de una respuesta débil.
4. Escalar aprendizaje
   - Evidencia: reporte corto para Allan/Corporate o Pilot Control.

## Méritos

- Member: XP calculado por etapas, evidencia en revisión, evidencia aprobada y score de calidad.
- Team: XP por evidencias revisadas y escalamientos resueltos.
- Rango visual: Explorador → Constructor → Validador → Pro.

## Skill creada

`beglobal-gamified-missions-proactivity`

Uso: orientar respuestas proactivas por perfil con esta estructura:

```text
Estado:
Bloqueo detectado:
Reformulación:
Misión sugerida:
Evidencia esperada:
Mérito al completar:
```

## Mini App implementada

Archivos modificados:

- `api/main.py`: endpoints `/api/member/gamification`, `/api/team/gamification`, `/api/member/missions`, `/api/team/missions`.
- `api/db.py`: misiones semilla y tabla `mission_actions`.
- `webapp/member/index.html`: tablero de méritos, prompts y misiones.
- `webapp/team/index.html`: ahora replica la guía completa tipo socio para Team: siguiente misión, acción mínima, evidencia, textarea de avance, completar misión y envío/apertura del chat.
- `webapp/missions/index.html`: Mini App unificada por perfil con botón `Enviar / abrir chat` y prompts por misión.
- `webapp/shared/app.js` / `app.css`: helpers visuales y conexión Telegram.

## Interconexión Telegram

La Mini App intenta primero `Telegram.WebApp.sendData(...)` con payload:

```json
{"type":"beglobal_mission_prompt","profile":"team|member","prompt":"..."}
```

Si Telegram no permite `sendData` porque la app fue abierta como Menu Button, copia el prompt y abre el bot correspondiente:

- Team: `@beglobal_team_bot`
- Member: `@Beglobalmember_bot`.

También puede forzarse el bot por URL con `?bot=nombre_bot`.

## Guardrails

- No prometer ventas, ingresos ni resultados garantizados.
- No dejar que el socio salte niveles.
- Legal, fiscal, pagos, conflictos, promesa comercial o cambio metodológico se escalan a Corporate.
- Méritos premian evidencia, no intención.

## Link público temporal

Base actual de prueba:

`https://bear-dallas-prevention-incentive.trycloudflare.com`

URLs para BotFather / Menu Button:

- Member: `https://bear-dallas-prevention-incentive.trycloudflare.com/app/missions/?profile=member&bot=Beglobalmember_bot`
- Team: `https://bear-dallas-prevention-incentive.trycloudflare.com/app/team/`
- Corporate: `https://bear-dallas-prevention-incentive.trycloudflare.com/app/corporate/`

Nota: este link es de Cloudflare quick tunnel, sirve para demo/MVP y no tiene garantía de permanencia. Para producción se requiere dominio TLS fijo y desactivar `DEV_BYPASS`.
