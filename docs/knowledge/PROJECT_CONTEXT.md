# Contexto del proyecto

## Problema

BeGlobal busca reducir la distancia entre conocer ecommerce y completar una acción verificable. El piloto organiza conocimiento, diagnóstico, ejecución guiada, revisión humana y gobierno sin prometer resultados comerciales.

## Resultado mínimo del piloto

Un participante **Member** completa diagnóstico y una misión; **Team** revisa la evidencia; **Corporate** observa métricas y registra una decisión; **Orchestrator** identifica contexto y enruta sin convertirse en superusuario.

Flujo rector:

```text
diagnóstico → acción → recurso → misión → evidencia → revisión → métricas
```

## Roles

| Rol | Responsabilidad | Límite |
|---|---|---|
| Orchestrator | Identificar contexto y enrutar | No hereda permisos ni aprueba |
| Member | Ejecutar su siguiente tarea y entregar evidencia | Solo datos propios; sin acciones sensibles |
| Team | QA, soporte, feedback y escalamiento | Solo casos asignados; propone, no gobierna método |
| Corporate | Método, permisos, gates y decisiones | Acceso individual solo bajo gobierno explícito |

Fuentes: [perfiles](../../hermes/BEGLOBAL_PROFILES.md) y [permisos](../../hermes/BEGLOBAL_PERMISSIONS_MATRIX.md).

## Propuesta de valor

- Diagnóstico antes de recomendar.
- Una a tres acciones concretas.
- Recurso aprobado según fase.
- Entregable observable con evidencia.
- Revisión humana para calidad y riesgo.
- Aprendizaje que vuelve a Corporate como propuesta trazable, no como cambio automático.

## Alcance MVP documentado

- Perfiles Hermes aislados.
- Dashboard de control exportable como sitio estático.
- Mini Apps Telegram para Member, Team y Corporate con API FastAPI y SQLite.
- Media Hub de evidencias.
- Base de conocimiento y grafo derivados del corpus Be Global.
- Un único caso inicial: contenido **o** preparación guiada de tienda/catálogo.

## Fuera de alcance hasta superar gates

- Plataforma amplia o marketplace completo.
- Pagos, reembolsos, reclamos o publicación automática.
- Acceso cruzado entre miembros.
- Promesas de ventas, ingresos o viralidad.
- Promoción de rol por XP sin designación humana.
- Escalamiento comercial antes de una aceptación real Member → Team → Corporate.

El estado verificable está en [PILOT_STATE.md](PILOT_STATE.md); no inferir producción a partir de esta descripción.
