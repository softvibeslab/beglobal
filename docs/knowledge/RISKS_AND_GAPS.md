# Riesgos y brechas

| Riesgo | Severidad | Evidencia | Mitigación | Cierre |
|---|---|---|---|---|
| FK inválida en `audit_trail` y bloqueos SQLite | P0 | Suite Fase 1, 2026-08-14 | Migración, rollback y cierre de conexiones | 11/11 escenarios y cleanup pasan en BD temporal |
| Webhook, filtros SQL, roles, HTML y uploads sin hardening completo | P0 | Código/wiki | Parametrizar, autenticar, transaccionar, escapar y validar contenido | Pruebas negativas y revisión de seguridad pasan |
| Rutas duplicadas/datos demo/contratos inconsistentes | P0 | Auditoría histórica pendiente de corrección | Consolidar rutas y contratos | OpenAPI y E2E únicos, sin demo productiva |
| Acceso cruzado entre perfiles | P0 | Guardrail, sin E2E real | Bots/allowlists separados y pruebas de denegación | Cero acceso cruzado en aceptación |
| Posible credencial activa en material rastreado e historia Git | Crítico | Escaneo heurístico; valor deliberadamente omitido | Rotar/revocar inmediatamente, investigar alcance y sanear con procedimiento autorizado | Credencial invalidada y escaneo completo limpio |
| Secretos o PII en historia operativa | Alto | Perfiles live y documentos históricos fuera de este paquete | Rotar/revocar, sanear y no migrar conversaciones | Escaneo limpio y revisión autorizada |
| Repositorio público contiene referencias internas y datos identificables históricos | Alto | `PROJECT_CONTEXT.md`, wiki y reuniones existentes | Inventario, redacción aprobada y política de publicación | Revisión de privacidad documentada |
| Licencia incierta de transcripciones/derivados de YouTube | Alto | `raw/youtube/` y `graphify-out/` | Confirmar titularidad/licencia; no duplicar ni redistribuir | Evidencia de permiso o exclusión |
| CI parcial y reproducibilidad incompleta | Alto | Hay workflow en Member independiente y lockfile en dashboard; Member no tiene lockfile y Python usa rangos abiertos | Gate CI de todo el piloto, lockfile Member y dependencias Python fijadas | Build/pruebas/secret scan reproducibles y obligatorios en PR |
| Dos implementaciones paralelas de Mini App/backend | Alto | `beglobal/miniapps/` y `beglobal-member-miniapp/` | Elegir arquitectura canónica y migrar/retirar la otra con pruebas | Un contrato, una persistencia y una suite E2E |
| Member independiente no compila ni ejecuta pruebas | Alto | TypeScript, Vitest y Vite ejecutados el 2026-08-14 | Corregir errores, declarar `jsdom`/`terser` y añadir pruebas | Typecheck, tests y build pasan desde instalación limpia |
| URL viva no vinculada al commit; un dominio devuelve 502 | Medio/alto | Verificación HTTP 2026-08-14 | Despliegue trazable, healthcheck y release SHA | Endpoint sano muestra versión desplegada |
| Dashboard local sin sincronización central | Medio | Dashboard README/código | Mantener MVP local o diseñar backend aprobado | Decisión y pruebas multiusuario |
| Currículo y recursos no aprobados | Alto | Fuentes y wiki | Curar mínimo, versionar y aprobar | Member recibe solo recursos aprobados |
| Métricas comerciales no verificadas | Alto | Documentos históricos | Medir con evidencia; no prometer | Datos auditables y decisión Corporate |
| VPS, backup y rollback no revalidados | Alto | Solo evidencia histórica | Acceso autorizado, snapshot, restore test | Runbook ejecutado y evidenciado |
| Federación Corporate local no versionada y con drift | Alto | Snapshot observado: 3 de 250 hashes desactualizados; builder/pruebas fuera de `origin/main` | Revisar fuentes, versionar builder y regenerar de forma determinista | Build limpio desde clone reproduce catálogo/grafo y pasa pruebas |

## Preguntas abiertas

1. ¿Qué caso único validará el piloto: contenido o tienda/catálogo?
2. ¿Quiénes son sponsor, Product Owner, responsable técnico y aprobador Corporate?
3. ¿Qué materiales tienen autorización explícita para redistribución pública?
4. ¿Qué commit está desplegado en cada URL?
5. ¿Qué bots, IDs y datos se autorizarán sin almacenarlos en Git?
6. ¿Cuál es el criterio contractual y de privacidad del piloto?
