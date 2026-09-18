# SP-004 · Plan de sprint

> Generado desde `backlog.json` y `sprints.json`. No editar este estado a mano. Propuesta ≠ compromiso ≠ aceptación.

Versión 0.1.0 · Estado `active` · Aprobación: registrada; consultar fuente.

## Objetivo

Demostrar localmente que logout revoca esta cookie, que cerrar todas invalida las copias de la misma persona con una versión de sesión, y que 401 de sesión no se disfraza de membresía caída.

## Entrega y capacidad

1 historias candidatas, 5 puntos de un sobre de 16 (31.25%). Sobre provisional; 5 puntos candidatos. No velocidad histórica.

Timebox propuesto: 3 días hábiles. Inicio: 2026-09-17T22:47:00-05:00. Fin: 2026-09-20T18:00:00-05:00. Revisión: 2026-09-20T18:00:00-05:00 (America/Cancun).

Entorno: Desarrollo local aislado; cookie opaca; deshabilitado en staging/producción.

| Orden candidato | Historia | Puntos | Depende de |
|---|---|---|---|
| 1 | [BG-037 · Revocar la sesión local y cerrar todas las copias del sujeto](../../BACKLOG.md#bg-037) | 5 | BG-007 |

La secuencia es una dependencia real; no cinco desarrollos independientes. Pruebas se escriben con cada historia, no se posponen todas a la última.

## Incluye

- Logout de esta cookie de prueba.
- Cerrar todas las sesiones de la persona vía session_version.
- Distinción 401 de sesión vs 503 de membresía no verificada.

## Excluye

- BG-008 y sandbox de la plataforma real de membresías.
- Cookie __Host-, HTTPS, BFF de staging y JWT.
- BotFather, Hostinger, cuentas reales, chat premium.

## Autorización y aceptación

Ejecutor/revisor propuestos: Codex / Roger. Auto-revisión técnica declarada; aceptación de producto por Roger. Sin revisión independiente ni producción.

Tope de nuevos gastos externos: 0 USD. Nuevos cargos a APIs y terceros.

Rutas propuestas: `beglobal/member-workspace/`; `SCRUM/sprints/SP-004/`.

[Completar los seis insumos y aprobar](ARRANQUE.md). [Reglas de autonomía/DoR/DoD](../../METODOLOGIA.md). No heredar autorizaciones antiguas de despliegues, videos o credenciales a este sprint.

## Demo prevista

Abrir perfil local con branding → comparar vigente, vencido y verificación no disponible → distinguir plan y rol → intentar acceso cruzado y ver denegación → recorrer UI con teclado/móvil → reproducir pruebas. Todo con datos ficticios y etiqueta de simulación. No presentar capturas como prueba de OAuth o plataforma real.

## Huella del paquete

```text
ff2aba862629f84f6827f2f8354a6e6d2391fa58252c61b2722244bbe348871c
```

SHA-256 del alcance, criterios, tareas/roles propuestos, límites, timebox, respuestas de arranque y reglas operativas. No es firma digital ni aprobación. Estado y evidencias de ejecución no cambian esta huella; cambiar el plan sí. Conservar el snapshot aprobado antes de ejecutar.
