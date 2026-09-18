# SP-006 · Plan de sprint

> Generado desde `backlog.json` y `sprints.json`. No editar este estado a mano. Propuesta ≠ compromiso ≠ aceptación.

Versión 0.1.0 · Estado `in_review` · Aprobación: registrada; consultar fuente.

## Objetivo

Demostrar localmente que un miembro de fixture puede crear y consultar una misión con objetivo, pasos y criterio, sin inventar avance de ruta ni aceptar su propia evidencia.

## Entrega y capacidad

1 historias candidatas, 5 puntos de un sobre de 16 (31.25%). Sobre provisional; 5 puntos candidatos. No velocidad histórica.

Timebox propuesto: 3 días hábiles. Inicio: 2026-09-18T00:16:00-05:00. Fin: 2026-09-23T18:00:00-05:00. Revisión: 2026-09-23T18:00:00-05:00 (America/Cancun).

Entorno: Desarrollo local aislado; misión en memoria; deshabilitado en staging/producción.

| Orden candidato | Historia | Puntos | Depende de |
|---|---|---|---|
| 1 | [BG-039 · Crear y consultar una misión local con criterio, sin avance inventado](../../BACKLOG.md#bg-039) | 5 | BG-005 |

La secuencia es una dependencia real; no cinco desarrollos independientes. Pruebas se escriben con cada historia, no se posponen todas a la última.

## Incluye

- Crear y listar misión draft/active con criterio.
- Rechazo de misión incompleta y de auto-aceptación.
- Aislamiento entre personas y conflicto de versión.

## Excluye

- BG-008 y sandbox de membresías reales.
- Diagnóstico LLM, evidencia adjunta y tarjetas de chat.
- BotFather, Hostinger, cuentas reales, ruta académica versionada.

## Autorización y aceptación

Ejecutor/revisor propuestos: Codex / Roger. Auto-revisión técnica declarada; aceptación de producto por Roger. Sin revisión independiente ni producción.

Tope de nuevos gastos externos: 0 USD. Nuevos cargos a APIs y terceros.

Rutas propuestas: `beglobal/member-workspace/`; `SCRUM/sprints/SP-006/`.

[Completar los seis insumos y aprobar](ARRANQUE.md). [Reglas de autonomía/DoR/DoD](../../METODOLOGIA.md). No heredar autorizaciones antiguas de despliegues, videos o credenciales a este sprint.

## Demo prevista

Abrir perfil local con branding → comparar vigente, vencido y verificación no disponible → distinguir plan y rol → intentar acceso cruzado y ver denegación → recorrer UI con teclado/móvil → reproducir pruebas. Todo con datos ficticios y etiqueta de simulación. No presentar capturas como prueba de OAuth o plataforma real.

## Huella del paquete

```text
9626fe118c049feabe7d479ed6193426e5c0e6b91f8df5fece54d612a284863a
```

SHA-256 del alcance, criterios, tareas/roles propuestos, límites, timebox, respuestas de arranque y reglas operativas. No es firma digital ni aprobación. Estado y evidencias de ejecución no cambian esta huella; cambiar el plan sí. Conservar el snapshot aprobado antes de ejecutar.
