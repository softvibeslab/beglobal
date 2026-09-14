# SP-002 · Plan de sprint

> Generado desde `backlog.json` y `sprints.json`. No editar este estado a mano. Propuesta ≠ compromiso ≠ aceptación.

Versión 0.1.0 · Estado `in_review` · Aprobación: registrada; consultar fuente.

## Objetivo

Demostrar localmente que una prueba HMAC de initData ficticia abre sólo la sesión del sujeto mapeado en servidor, y que firma, caducidad, replay o userId de cliente no conceden acceso.

## Entrega y capacidad

1 historias candidatas, 5 puntos de un sobre de 16 (31.25%). Sobre provisional; 5 puntos candidatos. No velocidad histórica.

Timebox propuesto: 3 días hábiles. Inicio: 2026-09-13T05:25:00-05:00. Fin: 2026-09-16T18:00:00-05:00. Revisión: 2026-09-16T18:00:00-05:00 (America/Cancun).

Entorno: Desarrollo local aislado; initData HMAC de fixture; deshabilitado en staging/producción.

| Orden candidato | Historia | Puntos | Depende de |
|---|---|---|---|
| 1 | [BG-006 · Iniciar sesión Telegram con prueba verificada](../../BACKLOG.md#bg-006) | 5 | BG-005 |

La secuencia es una dependencia real; no cinco desarrollos independientes. Pruebas se escriben con cada historia, no se posponen todas a la última.

## Incluye

- Verificación HMAC de initData sintético.
- Sesión corta opaca ligada al mapeo servidor.
- Denegaciones de firma, bot, caducidad, replay y userId de cliente.

## Excluye

- BotFather, webhook y Mini App productiva.
- Cuentas Telegram reales y Telegram Premium.
- Linking web BG-007, BG-036, chat premium.
- Hostinger, push, producción y gasto externo.

## Autorización y aceptación

Ejecutor/revisor propuestos: Codex / Roger. Auto-revisión técnica declarada; aceptación de producto por Roger. Sin revisión independiente ni producción.

Tope de nuevos gastos externos: 0 USD. Nuevos cargos a APIs y terceros.

Rutas propuestas: `beglobal/member-workspace/`; `SCRUM/sprints/SP-002/`.

[Completar los seis insumos y aprobar](ARRANQUE.md). [Reglas de autonomía/DoR/DoD](../../METODOLOGIA.md). No heredar autorizaciones antiguas de despliegues, videos o credenciales a este sprint.

## Demo prevista

Abrir perfil local con branding → comparar vigente, vencido y verificación no disponible → distinguir plan y rol → intentar acceso cruzado y ver denegación → recorrer UI con teclado/móvil → reproducir pruebas. Todo con datos ficticios y etiqueta de simulación. No presentar capturas como prueba de OAuth o plataforma real.

## Huella del paquete

```text
4c93f0f0074345e893337f086e421dda5aa6e55fa17b12fa87a4291fa7271d22
```

SHA-256 del alcance, criterios, tareas/roles propuestos, límites, timebox, respuestas de arranque y reglas operativas. No es firma digital ni aprobación. Estado y evidencias de ejecución no cambian esta huella; cambiar el plan sí. Conservar el snapshot aprobado antes de ejecutar.
