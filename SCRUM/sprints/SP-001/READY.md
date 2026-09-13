# DoR e INVEST · SP-001

13/09/2026 · revisión por Codex, no revisión técnica independiente.

- Aprobación del plan: [mensaje e interpretación acotada](APROBACION.md).
- Base: worktree exclusivo de SPEC_AGENTS, sin mutaciones al código legacy ni datos de la copia principal. Entradas SPECS/puente copiadas; no .env ni SQLite. Rutas nuevas locales, runtime productivo fuera.
- Entorno disponible: Python 3.14 aislado; FastAPI 0.129.2, Uvicorn 0.39.0, HTTPX 0.28.1 y validadores instalados en `.venv`. Node y Chrome local disponibles; Playwright se fijará como dependencia de desarrollo sin servicios externos.
- Prueba/datos: dos sujetos y dos negocios sintéticos; membresía/plan/grant separados; casos vigente, vencido, caída, revocación y sesión inválida; sin corpus PRO real.
- Revisión y entrega: Roger revisa producto; Codex auto-revisa diff y pruebas. Demo accesible localmente; evidencias por los 20 criterios del sprint, incluyendo teclado/320 px y casos negativos.
- Presupuesto y límites: 0 USD en cargos externos; no deploy/commit/push/migraciones/cuentas reales. Reversión: detener proceso local; no hay datos productivos que restaurar.

| Historia | Independencia | Valor/estimación/tamaño | Testabilidad |
|---|---|---|---|
| BG-001 | Sin historia previa | Baseline reproducible; 2 puntos provisionales | Arranque, exclusión de producción, contratos y no cambios legacy |
| BG-002 | Depende de BG-001, incluida en compromiso | Contexto de persona/negocio; 3 puntos | Sesión inválida, acceso cruzado y rol no escalable |
| BG-003 | Depende de BG-002, incluida | Distinguir academia/plan/verificación; 3 puntos | Matriz y fallo cerrado, sin caché positiva |
| BG-004 | Depende de BG-003, incluida | Perfil legible con marca; 3 puntos | Estados, teclado/móvil y texto/tarjetas no confiables |
| BG-005 | Depende de BG-004, incluida | Demo aceptable con evidencias; 2 puntos | Regresión reproducible y matriz AC-evidencia |

Negociabilidad: diseño interno, nombres y estructura pueden ajustarse sin cambiar contratos/criterios. Las cinco historias forman una secuencia explícita, no cinco trabajos paralelos independientes; no tienen dependencias de implementación fuera del compromiso. El tamaño se calibra en este primer sprint, no se presenta como velocidad observada.

Riesgos: identidad de prueba no autentica miembros reales; fábrica/servidor deben negar ejecución fuera de desarrollo/test. Conectar producción requiere los gates futuros. La librería puente existente no decide permisos de negocio ni planes: se añade esa política local sin alterar su contrato.
