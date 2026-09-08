# Propuesta corporativa BeGlobal × Softvibes

Presentación estática en español para `https://beglobal.softvibes.pro/propuesta/`.

## Estado de entrega · 2026-09-08

Dashboard creado y probado localmente, guardado en la rama pública `release/propuesta-20260908`. **Todavía no publicado en Hostinger**: la API de carga y de creación de cron devolvió HTTP 500; el administrador de archivos web devolvió HTTP 403. La consulta posterior de cron no encontró tareas creadas. La URL objetivo sigue respondiendo 404.

El sitio raíz, `/piloto/`, `/vapi/` y `/trainning/` mantienen los mismos documentos HTML y respuestas HTTP 200 que antes del intento. No se alteraron `main` ni `gh-pages`.

Entregables locales adicionales en `deliverables/propuesta-beglobal/`: PDF, ZIP con carpeta `propuesta` y solo ocho archivos públicos, capturas y resultados de pruebas. El siguiente paso es restablecer el acceso de escritura al hosting, subir solo esta carpeta y ejecutar las pruebas de producción. No subir el ZIP mediante una función que reemplace todo el sitio.

## Alcance

Diez secciones: visión, CTA de prueba, beneficios, agentes corporativos, membresías PRO, activación y costo total, modelo económico, capacidad del equipo, piloto y decisión. Incluye audio sintético del podcast, impresión/PDF y descargas locales de escenario y resumen.

Los precios son propuestas en MXN antes de impuestos. No hay cobro, formularios remotos, aprobaciones, llamadas a proveedores, analítica ni agentes activos dentro de esta página. Las demostraciones son ejemplos escritos. No se incluyen corpus, transcripciones, credenciales ni datos de miembros. `noindex` no restringe el acceso público.

## Fuentes y criterio comercial

- Propuesta comercial y podcast desarrollados con Roger en esta conversación.
- `docs/academia-pro-public/PUBLICATION.json`: 50 cursos, 1,181 referencias y 94 lecciones con ASR local; corte 2026-09-08.
- `beglobal/vapi/README.md` y `hermes/beglobal-academy-pro/README.md`: preparación y validaciones pendientes, no auditoría actual de producción.
- https://vapi.ai/pricing, consultado 2026-09-08: el alojamiento Vapi y los proveedores tienen costos diferenciados.

La comparación separa desembolso inicial evitado de ahorro total. El simulador distingue facturación, costos, utilidad y participación; las pérdidas no se reparten automáticamente. El cálculo de soporte representa capacidad neta de supervisión, no ahorro automático de nómina. Los costos y la mezcla de membresías son hipótesis editables, no facturas ni previsiones.

## Desarrollo y pruebas

```sh
python3 -m http.server 8769 --bind 127.0.0.1 --directory beglobal/propuesta
node --test scripts/test_propuesta_economics.cjs
PLAYWRIGHT_MODULE=/ruta/a/node_modules/@playwright/test node scripts/test_propuesta_ui.cjs
PROPOSAL_URL=https://beglobal.softvibes.pro/propuesta/ PLAYWRIGHT_MODULE=/ruta/a/node_modules/@playwright/test node scripts/test_propuesta_ui.cjs
```

El navegador usa Chrome instalado. Las pruebas verifican vistas de 1440 y 390 px, escenarios negativos, entradas inválidas, restablecimiento, descargas JSON/Markdown, modo presentación, FAQ, duración del audio, ausencia de errores y de solicitudes externas. Generan capturas y PDF en una carpeta temporal, sin modificar el sitio.

## Publicación limitada

Lista pública permitida: `index.html`, `styles.css`, `economics.js`, `app.js`, `.htaccess`, `logo-beglobal.png`, `podcast.mp3`, `SHA256SUMS`.

`scripts/deploy_beglobal_propuesta.sh` descarga una revisión Git fijada, valida todas las sumas y crea únicamente `/propuesta`. El staging queda fuera de `public_html`. Una ruta preexistente desconocida bloquea la instalación. Las ejecuciones repetidas solo verifican el mismo contenido. La tarea cron temporal de entrega debe eliminarse al terminar.

No usar despliegue estático de raíz: podría sustituir el piloto, Vapi y las otras rutas. No hacer un commit global del repositorio: existen trabajos ajenos en curso. Los cambios futuros deben actualizar las sumas y usar un procedimiento separado con copia de seguridad, ya que el instalador inicial no sobrescribe releases existentes.

Se utilizó `landing-page-generator` para la estructura comercial y visual, adaptada al sitio estático existente; `playwright-pro` guio las pruebas reales de escritorio y móvil.
