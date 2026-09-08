---
name: beglobal-corporate-governance
description: "Gobierna Be Global con fuentes, grafo, permisos, calidad, métricas y decisiones del piloto."
version: 1.1.0
metadata:
  hermes:
    tags: [beglobal, governance, knowledge-graph, pilot, reporting, quality, permissions]
    created_by: codex
---

# Be Global Corporate Governance

Usa este skill para preguntas sobre Be Global, Allan, Commerce OS, método, entrenamiento, alcance, permisos, métricas, calidad, riesgos, conocimiento o decisiones del piloto.

## Fuente de verdad

El perfil dispone de una base federada en `workspace/knowledge/`:

- `KNOWLEDGE_MAP.md`: cobertura, dominios y precedencia.
- `knowledge_graph.json`: grafo completo de Commerce OS, YouTube y proyecto.
- `source_catalog.json`: inventario con prioridad y SHA-256.
- `query_graph.py`: búsqueda determinista.

`SOURCE_MANIFEST.md` define las fuentes canónicas. El grafo es un índice de navegación: nunca lo cites como única evidencia cuando exista `source_file` original.

## Flujo obligatorio

1. Identifica la decisión o resultado requerido.
2. Lee `SOURCE_MANIFEST.md` y `workspace/knowledge/KNOWLEDGE_MAP.md` si la pregunta depende del proyecto.
3. Busca en el grafo por entidades y términos; abre las fuentes mejor clasificadas.
4. Aplica precedencia: P1 decisiones; P2 gobierno/método; P3 Commerce OS; P4 evidencia/capacitación; P5 implementación.
5. Separa confirmado, propuesto, supuesto, inferido, validado y bloqueado.
6. Evalúa impacto en miembro, equipo, datos, costo y promesa comercial.
7. Presenta máximo tres prioridades y cita rutas de fuente.
8. Si existe un cambio durable, prepara registro de cambio y solicita aprobación.
9. Si afecta plataforma, contrato, pago, dato sensible o comunicación externa, detente en el checkpoint humano.

## Consulta del grafo

Con ejecución local disponible:

```bash
python3 workspace/knowledge/query_graph.py "pregunta o concepto"
```

Sin ejecución local, usa `search_files` sobre `knowledge_graph.json` o `source_catalog.json`, y después lee el `source_file` original.

Reglas:

- Una relación `INFERRED` es hipótesis, no política aprobada.
- Metadata de un video sin transcripción no prueba lo dicho en el video.
- Si dos fuentes chocan, no las fusiones: aplica precedencia y muestra el conflicto.
- Para Allan, piloto, precio, alcance o promesa, revisa primero P1–P2 y luego el charter P3.

## Formato recomendado

### Estado ejecutivo

Máximo cinco líneas.

### Evidencia

| Hallazgo | Fuente | Estado | Impacto |
|---|---|---|---|

### Decisión requerida

Indica responsable, fecha objetivo y alternativa segura.

### Siguientes acciones

Entre una y tres.

## Métricas mínimas

- Participantes invitados, activados y recurrentes.
- Diagnósticos completados y precisión.
- Misiones iniciadas y terminadas.
- Tiempo a primer valor.
- Calidad de contenido.
- Errores, escalaciones y tiempo de soporte.
- Consumo y costo por usuario activo.
- Satisfacción.

## Guardrails

- No aceptar una anécdota como validación.
- No declarar una demo como SLA.
- No llamar ilimitado a un servicio sin cuota definida.
- No alterar permisos ni conocimiento sin responsable y evidencia.
- No prometer ingresos o ventas.
- Escalar legal, fiscal, financiero, pagos, reembolsos y conflictos.

## Criterio de finalización

Una respuesta sensible está completa solo cuando identifica estado, fuente original, precedencia, impacto, responsable y siguiente acción; si falta alguno, declara el bloqueo.
