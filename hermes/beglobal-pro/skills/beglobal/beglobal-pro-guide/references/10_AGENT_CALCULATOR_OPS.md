# Calculadora de agentes Be Global — aportación, operación y comisiones

Usa esta referencia cuando Roger/equipo pida una calculadora para agentes, propuestas comerciales, aportación inicial, gastos operativos, implementación o comisión por venta.

## Concepto comercial corregido

- El término correcto es **aportación inicial**, no “aceptación principal”.
- La aportación inicial debe comenzar desde **$35,000 MXN**.
- La comisión por venta se calcula sobre **utilidad neta**, no sobre venta bruta.
- La comisión representa la participación de **Allan/Be Global** como alianza estratégica.
- Regla comercial actual: **a mayor aportación inicial, mayor porcentaje de comisión** para Allan/Be Global sobre las ventas/utilidad generadas por el agente.

## Niveles sugeridos

1. **Base — $35,000 MXN**
   - 1 agente.
   - 1 flujo principal.
   - configuración inicial.
   - base de conocimiento inicial.
   - pruebas básicas.
   - comisión Allan/Be Global sugerida: **10%** sobre utilidad neta.

2. **Crecimiento — $50,000 MXN**
   - más integraciones.
   - automatizaciones.
   - CRM/seguimiento.
   - capacitación.
   - comisión Allan/Be Global sugerida: **15%** sobre utilidad neta.

3. **Crecimiento Plus — $75,000 MXN**
   - mayor alcance operativo.
   - más flujos o más canales.
   - seguimiento/reporting inicial.
   - comisión Allan/Be Global sugerida: **20%** sobre utilidad neta.

4. **Premium — $100,000 MXN o más**
   - múltiples agentes o canales.
   - arquitectura completa.
   - ecommerce/CRM/reportes.
   - soporte avanzado.
   - comisión Allan/Be Global sugerida: **25% o negociada** sobre utilidad neta.

4. **Operación propia Be Global**
   - aportación puede venir de capital interno o socio operador.
   - reparto por roles: sourcing, operación, ventas, agente y equipo.

## Fórmulas base

```text
Costo implementación = horas internas × costo/hora + integraciones + QA/capacitación + pago único de implementación

Nota: si el pago único de implementación es $75,000 MXN, debe sumarse solo al costo de implementación; no debe tratarse como gasto operativo mensual.

Gasto operativo mensual = IA/tokens + hosting + WhatsApp/CRM/apps + soporte humano + salario ingenieros + salario mercadólogos + monitoreo + contingencia

Utilidad neta por venta = precio venta - costo producto - pasarela - envío/subsidio - adquisición - reserva riesgo

Comisión por venta = MAX(0, utilidad neta por venta × % comisión)

Ventas para cubrir operación = gasto operativo mensual / utilidad neta por venta

Meses para recuperar implementación = costo implementación / utilidad mensual estimada
```

## Costos operativos a considerar

Además de costos técnicos directos, la calculadora debe reflejar el equipo real que sostiene al agente:

- IA / tokens.
- Hosting / herramientas.
- WhatsApp / CRM / apps.
- Soporte humano.
- **Salario de ingenieros**.
- **Salario de mercadólogos**.
- Monitoreo, contingencia y otros costos recurrentes.

Esto puede volver un escenario “No aprobar todavía”, lo cual es útil: evita vender proyectos que no cubren la operación real del equipo.

## Entregable recomendado

Cuando el usuario pida “crear una calculadora”, entregar dos formatos:

1. **HTML5 interactivo**
   - interfaz amigable.
   - inputs editables.
   - actualización en tiempo real.
   - resumen ejecutivo.
   - escenarios conservador/base/agresivo.
   - descarga JSON o copiar resumen.

2. **Sheet tipo Excel/Google Sheets**
   - pestañas sugeridas:
     - Resumen ejecutivo
     - Configuración
     - Costos implementación
     - Gastos operativos
     - Ventas y margen
     - Comisiones
     - Escenarios
   - fórmulas listas para subir a Google Sheets.

Si Google OAuth no está configurado, no bloquear el avance: crear `.xlsx` importable y explicar que se puede subir a Google Drive.

## Validación mínima

- Abrir el HTML en navegador local.
- Confirmar que no hay errores de consola.
- Cambiar un input clave y verificar que resultados se actualicen.
- Abrir/verificar el XLSX y confirmar pestañas + fórmulas principales.

## Link público / demo compartible

Roger suele necesitar compartir estas herramientas rápido con clientes o equipo. Si después de crear el HTML pide “link público”, no te quedes solo en `MEDIA:` o ruta local:

1. Primero verifica que el HTML funciona localmente.
2. Si no hay hosting permanente configurado, crea una demo temporal con túnel hacia el servidor local y verifica con `curl -I -L` o navegador que responda `200`.
3. Preséntalo como **temporal/de prueba** y aclara que depende de que sigan activos el servidor local y el túnel.
4. Ofrece como siguiente paso publicarlo permanente en Shopify, Netlify, Vercel, GitHub Pages, Cloudflare Pages o un subdominio Be Global.

No guardes URLs temporales como conocimiento duradero; guarda solo el patrón operativo.

## Regeneración de calculadora existente

Cuando Roger pida “volver a generar esta calculadora” o pegue un resumen previo de cambios, actúa como operación interna de artefactos, no como diagnóstico de alumno:

1. Buscar primero artefactos existentes bajo Commerce OS, especialmente `artifacts/calculadora-agentes/`.
2. Regenerar todos los entregables relacionados en la misma pasada: HTML interactivo, XLSX/Sheet importable, CSV y propuesta comercial `.txt`.
3. Mantener el concepto comercial exacto del último cambio. Ejemplo aplicado: `Setup estratégico adicional` de `$75,000 MXN` suma al costo de implementación base y **no** al gasto mensual; con horas/integraciones/QA base debe reflejar `$105,000 MXN`.
4. Verificar antes de responder: servir HTML localmente, confirmar `200`, revisar consola en navegador, confirmar que el cálculo visible muestra el monto esperado y que la propuesta generada contiene el texto actualizado.
5. Si se crea link con Cloudflare quick tunnel, presentarlo como temporal y adjuntar también los archivos finales con `MEDIA:`.

Pitfall: no basta con cambiar el HTML visible; si la herramienta tiene propuesta interna, CSV y XLSX, actualiza los cuatro para evitar inconsistencias comerciales.

## Guardrails

- No prometer ventas ni ROI garantizado.
- No presentar cálculos como asesoría financiera certificada.
- Incluir aviso de validación de costos, contratos, impuestos, políticas y comisiones con el equipo.
- Para ofertas dinámicas/marketplaces, validar precio, stock y disponibilidad antes de aceptar pago o prometer margen.
