# SP-005 · Plan de sprint

> Generado desde `backlog.json` y `sprints.json`. No editar este estado a mano. Propuesta ≠ compromiso ≠ aceptación.

Versión 0.1.0 · Estado `in_review` · Aprobación: registrada; consultar fuente.

## Objetivo

Demostrar localmente que una sesión web puede desvincular un Telegram del mismo sujeto con HMAC fresco, que no se puede dejar al miembro sin acceso verificado, y que un sujeto ajeno no fusiona identidades.

## Entrega y capacidad

1 historias candidatas, 5 puntos de un sobre de 16 (31.25%). Sobre provisional; 5 puntos candidatos. No velocidad histórica.

Timebox propuesto: 3 días hábiles. Inicio: 2026-09-17T23:00:00-05:00. Fin: 2026-09-22T18:00:00-05:00. Revisión: 2026-09-22T18:00:00-05:00 (America/Cancun).

Entorno: Desarrollo local aislado; HMAC fixture; deshabilitado en staging/producción.

| Orden candidato | Historia | Puntos | Depende de |
|---|---|---|---|
| 1 | [BG-038 · Desvincular Telegram local con HMAC fresco y un acceso web alternativo](../../BACKLOG.md#bg-038) | 5 | BG-007 |

La secuencia es una dependencia real; no cinco desarrollos independientes. Pruebas se escriben con cada historia, no se posponen todas a la última.

## Incluye

- Desvincular Telegram con HMAC fresco del mismo sujeto.
- Rechazo de último acceso Telegram-only.
- Rechazo de cruce, replay, origen y recover por nombre/email.

## Excluye

- BG-008 y sandbox de membresías reales.
- Recuperación asistida y merge de historiales.
- BotFather, Hostinger, cuentas reales, cookie __Host-.

## Autorización y aceptación

Ejecutor/revisor propuestos: Codex / Roger. Auto-revisión técnica declarada; aceptación de producto por Roger. Sin revisión independiente ni producción.

Tope de nuevos gastos externos: 0 USD. Nuevos cargos a APIs y terceros.

Rutas propuestas: `beglobal/member-workspace/`; `SCRUM/sprints/SP-005/`.

[Completar los seis insumos y aprobar](ARRANQUE.md). [Reglas de autonomía/DoR/DoD](../../METODOLOGIA.md). No heredar autorizaciones antiguas de despliegues, videos o credenciales a este sprint.

## Demo prevista

Abrir perfil local con branding → comparar vigente, vencido y verificación no disponible → distinguir plan y rol → intentar acceso cruzado y ver denegación → recorrer UI con teclado/móvil → reproducir pruebas. Todo con datos ficticios y etiqueta de simulación. No presentar capturas como prueba de OAuth o plataforma real.

## Huella del paquete

```text
128513b86785a9effc62728187d8308ad2a38c99df215d9f40ddd2934e47c86b
```

SHA-256 del alcance, criterios, tareas/roles propuestos, límites, timebox, respuestas de arranque y reglas operativas. No es firma digital ni aprobación. Estado y evidencias de ejecución no cambian esta huella; cambiar el plan sí. Conservar el snapshot aprobado antes de ejecutar.
