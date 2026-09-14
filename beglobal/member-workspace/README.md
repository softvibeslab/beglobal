# Member Workspace · SP-001

**Prototipo local con backend funcional y datos ficticios.** Perfil de sólo lectura, sesión sintética, negocio aislado, membresía/verificación/plan separados, interfaz BeGlobal y comprobaciones de acceso. No es login real, integración de membresías ni una aplicación productiva.

## Abrir

En la copia de trabajo `BeGlobal-SP-001`, desde esta carpeta:

```sh
.venv/bin/python workspace.py --fixtures --port 18765
```

Abrir [demo local](http://127.0.0.1:18765/). Detener con Ctrl+C. Durante la entrega se deja un proceso local en ese puerto para revisar; no se configura un servicio persistente ni se publica en Hostinger. Si ya está abierto, no iniciar otro proceso en el mismo puerto.

Para preparar otro entorno local:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.lock.txt
npm ci --ignore-scripts --no-audit --no-fund
```

Python 3.14, Node y Chrome local utilizados en esta entrega. No instalar dependencias globales; no copiar `.venv` a otro equipo. `requirements.txt` fija dependencias directas; `requirements.lock.txt` registra el conjunto probado. Las pruebas usan Chrome ya instalado (`channel: chrome`); no una sesión de navegador personal ni una cuenta autenticada.

## Demo para Roger

1. Seleccionar **Lucía · demo / Vigente · PRO Creador** y abrir el espacio. Ver identidad, negocio, academia, verificación y plan en campos separados.
2. Probar acceso PRO: devuelve exclusivamente un mensaje sintético, no contenido de la Academia.
3. Probar aislamiento: el request real al otro negocio devuelve 404 sin datos de Diego.
4. Elegir **Vencida · PRO Negocio**: el perfil sigue disponible, pero el recurso se deniega con 403. Negocio no concede Team/Corporate.
5. Elegir **Sin verificar · PRO Creador**: no se pide comprar ni iniciar sesión otra vez; el recurso protegido devuelve 503.
6. Probar permiso de negocio retirado, cerrar sesión y recorrer a 320 px/teclado. Una ruta vacía nunca presenta 100% ni misiones ficticiamente terminadas.
7. **SP-002:** elegir sujeto HMAC 900002, generar initData fixture y abrir con prueba Telegram. Debe aparecer Diego; el encabezado muestra caducidad de 15 min.
8. Cerrar sesión desde el encabezado: el perfil desaparece. No es una membresía vencida. Un initData ya usado no reabre (replay).

Los selectores **crean una sesión ficticia**, no vinculan una cuenta real. Sirven para revisar varios casos sin credenciales; nunca deben trasladarse al login productivo.

## Fronteras de arquitectura

```text
UI local / misma procedencia
  → cookie opaca HttpOnly de sesión ficticia (15 min)
  → identidad sintética + grant de negocio
  → MembershipBridge: sujeto / estado / frescura / vigencia
  → política de plan + propiedad del recurso
  → perfil y estados / recurso sintético permitido o denegado
```

- Fábrica `create_app()` sin fixtures por defecto; `--fixtures` habilita explícitamente la exploración local.
- Toda la app rechaza `staging`, `production` y entornos desconocidos. CLI sólo escucha `127.0.0.1`; `BEGLOBAL_ENV=production` falla antes de escuchar. No modificar esa guarda para desplegarla.
- Host y peer locales; no confiar en X-Forwarded-For. Mutaciones de demo requieren origen exacto e intención en header. No CORS abierto, no JS inline, sin conexiones externas.
- Cookie **sin Secure sólo por HTTP loopback**; no es la cookie `__Host-`/BFF objetivo de producción. El token no llega a JSON, URL, logs, localStorage o prompts. Reiniciar el proceso invalida las sesiones en memoria.
- Perfil/plan/roles se derivan del servidor. No se aceptan campos `role`, `personId`, `allowed` o credenciales como autoridad en entrada.
- Se consulta el puente en cada acceso protegido, sin caché positiva. El provider no configurado, timeout o sujeto incorrecto deniegan. El bridge sólo decide academia; la política añade negocio y capacidad.
- El frontend implementa únicamente tarjetas `notice` válidas: `textContent`, campos cerrados y fallback. Las otras cinco tarjetas quedan para futuras historias.
- Sólo memoria sintética; sin DB, `.env`, imports de `miniapps/api`, chat generativo, misiones funcionales, uploads, OAuth, MCP, pagos ni escrituras en terceros.

## API local implementada

| Ruta | Alcance |
|---|---|
| GET `/healthz`, `/demo/v1/config` | Estado/configuración sintética, sin secretos |
| POST `/demo/v1/session`, `/scenario`, `/logout`, `/telegram-session`, `/telegram-fixture` | Controles de prueba; origen/intención obligatorios. `telegram-session` valida HMAC de initData **fixture**; `telegram-fixture` emite esa prueba. No es un bot real |
| GET `/demo/v1/workspace` | Proyección agregada de perfil/acceso/contexto y estados vacíos |
| GET `/api/v1/businesses/{businessId}/profile` | Forma Profile de SPECS, sólo negocio de la sesión |
| GET `/api/v1/businesses/{businessId}/access` | Forma Access de SPECS, decisión revalidada |
| GET `/api/v1/businesses/{businessId}/resources/demo-pro` | Recurso sintético para demostrar gates; no endpoint de corpus |

Los GET de perfil/acceso cumplen las formas de respuesta de SPECS; **su transporte usa la cookie local ficticia, no implementa aún el bearer/BFF real del contrato objetivo**. PATCH, intercambio Telegram y linking no están implementados. Cada respuesta lleva `requestId`, `no-store`, headers de seguridad y marca de demo.

## Pruebas y evidencia

```sh
.venv/bin/python -m unittest -v test_workspace.py
npm run test:ui:review
npm run test:ui
.venv/bin/python tools/run_checks.py
```

El último comando regenera `qa/latest/`: salidas crudas, reporte por suite, hash del código evaluado, inventario de legacy y capturas. Es un gate **local**, no liberación. El reporte conserva separadamente el fallo global existente de SPECS en el worktree; no lo convierte en PASS. Las capturas de cuatro anchos provienen del servidor real de la demo, sin mocks de su API.

**Pendiente conocido de la base `SPEC_AGENTS`:** decoradores de rutas duplicados en la API antigua; el validador global se detiene en `GET /api/team/missions-queue`. El archivo coincide con HEAD y no fue modificado aquí. No se importó ni se ejecutó ese servicio. Integrar el prototipo ahí requiere resolverlo en otro alcance; no debilitar la prueba de unicidad para ocultarlo.

Trazabilidad, revisión técnica y aceptación: [control SP-001](../../SCRUM/sprints/SP-001/PLAN.md). Los datos de consumo y progreso comerciales siguen siendo propuestas, no resultados medidos.

## Referencias técnicas y adaptación de skills

Se aplicaron narrativa/DoR/DoD de `agile-product-owner` y revisión de tests/locators semánticos/aislamiento de `playwright-pro`. Los ejemplos de la skill se adaptaron al servidor real; los comandos `/pw:*` no están instalados ni se finge haberlos ejecutado. La revisión equivalente está en `tools/review-tests.cjs` y la revisión manual de entrega.

La prueba de integración usa el [TestClient documentado por FastAPI](https://fastapi.tiangolo.com/tutorial/testing/). Playwright inicia su propio [servidor de prueba local](https://playwright.dev/docs/test-webserver), separado del proceso de preview y sin reutilizar servidores desconocidos. No se hizo auditoría integral ni prueba física de Telegram/iOS/Android.
