# SP-003 · Plan de sprint

> Generado desde `backlog.json` y `sprints.json`. No editar este estado a mano. Propuesta ≠ compromiso ≠ aceptación.

Versión 0.1.0 · Estado `active` · Aprobación: registrada; consultar fuente.

## Objetivo

Demostrar localmente que una sesión web ficticia y un initData HMAC del mismo sujeto se vinculan en un enlace único auditado, y que un sujeto ajeno, un desafío vencido o un nombre/email no fusionan identidades.

## Entrega y capacidad

1 historias candidatas, 5 puntos de un sobre de 16 (31.25%). Sobre provisional; 5 puntos candidatos. No velocidad histórica.

Timebox propuesto: 3 días hábiles. Inicio: 2026-09-16T08:36:00-05:00. Fin: 2026-09-18T18:00:00-05:00. Revisión: 2026-09-18T18:00:00-05:00 (America/Cancun).

Entorno: Desarrollo local aislado; initData HMAC de fixture; deshabilitado en staging/producción.

| Orden candidato | Historia | Puntos | Depende de |
|---|---|---|---|
| 1 | [BG-007 · Vincular web y Telegram sin fusionar identidades ajenas](../../BACKLOG.md#bg-007) | 5 | BG-006 |

La secuencia es una dependencia real; no cinco desarrollos independientes. Pruebas se escriben con cada historia, no se posponen todas a la última.

## Incluye

- Desafío de vinculación de un solo uso (5 minutos) ligado a la sesión web.
- Enlace único telegram↔persona con auditoría en memoria.
- Denegaciones de cruce, dueño previo, desafío vencido, replay y recuperación por nombre/email.

## Excluye

- BotFather, webhook y Mini App productiva.
- Cuentas Telegram reales, BFF de staging y recuperación asistida.
- BG-008, BG-036, chat premium.
- Hostinger, producción y gasto externo.

## Autorización y aceptación

Ejecutor/revisor propuestos: Codex / Roger. Auto-revisión técnica declarada; aceptación de producto por Roger. Sin revisión independiente ni producción.

Tope de nuevos gastos externos: 0 USD. Nuevos cargos a APIs y terceros.

Rutas propuestas: `beglobal/member-workspace/`; `SCRUM/sprints/SP-003/`.

[Completar los seis insumos y aprobar](ARRANQUE.md). [Reglas de autonomía/DoR/DoD](../../METODOLOGIA.md). No heredar autorizaciones antiguas de despliegues, videos o credenciales a este sprint.

## Demo prevista

Abrir perfil local con branding → comparar vigente, vencido y verificación no disponible → distinguir plan y rol → intentar acceso cruzado y ver denegación → recorrer UI con teclado/móvil → reproducir pruebas. Todo con datos ficticios y etiqueta de simulación. No presentar capturas como prueba de OAuth o plataforma real.

## Huella del paquete

```text
83e7adc66f4f6fb8d40117ef89504b6e61ffbbe874e4ff8861b5a3ebd13c92f8
```

SHA-256 del alcance, criterios, tareas/roles propuestos, límites, timebox, respuestas de arranque y reglas operativas. No es firma digital ni aprobación. Estado y evidencias de ejecución no cambian esta huella; cambiar el plan sí. Conservar el snapshot aprobado antes de ejecutar.
