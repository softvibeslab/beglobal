# Calculadora Be Global Smart Agent — aportación inicial, costos y comisiones

Usa esta referencia cuando Roger/equipo pida crear o mejorar una calculadora para vender/operar agentes Be Global, estimar costos de implementación, gastos operativos, aportación inicial y comisión por venta.

## Concepto central

La calculadora debe ayudar a decidir si un proyecto de agente se acepta, se ajusta o se rechaza antes de prometer implementación o comisiones.

Regla principal:

- **Aportación inicial mínima: $35,000 MXN**.
- La comisión se calcula sobre **utilidad neta**, no sobre venta bruta.
- La comisión es la participación de Allan/Be Global como alianza estratégica.
- A mayor aportación inicial, mayor porcentaje de comisión para Allan/Be Global.
- La comisión siempre debe calcularse sobre utilidad neta, no sobre venta bruta.
- A menor aportación inicial o mayor riesgo operativo para Be Global, mayor comisión o reparto.

Fórmula base:

```text
Utilidad neta por venta = precio de venta - costo producto/proveedor - pasarela - envío/subsidio - CAC - reserva de riesgo
Comisión Be Global = utilidad neta por venta × porcentaje comisión aprobado
```

Si la utilidad neta es menor o igual a cero, la comisión debe ser 0 y el escenario debe marcarse como no aprobable.

## Niveles sugeridos de aportación inicial

1. **Base — $35,000 MXN**
   - 1 agente.
   - 1 flujo principal.
   - Configuración inicial.
   - Base de conocimiento inicial.
   - Pruebas básicas.
   - Comisión sugerida: media.

2. **Crecimiento — $50,000 a $75,000 MXN**
   - Más integraciones.
   - CRM/seguimiento.
   - Automatizaciones.
   - Capacitación.
   - Comisión sugerida: media-baja.

3. **Premium — $100,000 MXN o más**
   - Múltiples agentes o canales.
   - Arquitectura ecommerce/CRM.
   - Reportes.
   - Soporte/optimización avanzada.
   - Comisión sugerida: baja o negociada, salvo que Be Global asuma tráfico, operación o cierre.

4. **Operación propia Be Global**
   - Aportación puede venir de capital interno o socio operador.
   - Reparto por roles: sourcing, operación, ventas, agente, equipo.

## Campos mínimos de la calculadora

### Proyecto

- Nombre del proyecto.
- Tipo de agente: ventas, atención, catálogo/productos, operador ecommerce, Telegram/ofertas, academia/equipo interno.
- Canal principal: Shopify, WhatsApp, Telegram, Mercado Libre, Amazon, multicanal.

### Implementación

- Horas internas.
- Costo por hora.
- Integraciones.
- QA/capacitación.
- Costo total de implementación.

### Operación mensual

- IA/tokens.
- Hosting/herramientas.
- WhatsApp/CRM/apps.
- Soporte humano.
- Mensualidad cobrada al cliente, si aplica.

### Venta promedio

- Precio de venta.
- Costo producto/proveedor.
- Pasarela %.
- Envío/subsidio.
- Costo de adquisición.
- Reserva de riesgo %.
- Ventas mensuales estimadas.

### Resultados

- Utilidad neta por venta.
- Comisión por venta.
- Comisión mensual.
- Ventas para cubrir operación.
- Meses para recuperar implementación.
- Recomendación: aprobable, aprobable con ajustes, riesgo medio o no aprobar todavía.

## Entregables recomendados

Cuando el usuario pida “crear la calculadora”, entrega idealmente dos formatos:

1. **HTML5 interactivo**
   - Interfaz amigable.
   - Actualización en tiempo real con JavaScript.
   - Botones: descargar escenario JSON, copiar resumen ejecutivo, generar propuesta para cliente, copiar propuesta, descargar .txt.
   - Área editable de propuesta comercial.

2. **XLSX / Google Sheets importable**
   - Pestañas recomendadas:
     - Resumen ejecutivo.
     - Configuración.
     - Costos implementación.
     - Gastos operativos.
     - Ventas y margen.
     - Comisiones.
     - Escenarios.
   - Campos editables resaltados.
   - Fórmulas protegibles.

Si Google OAuth no está configurado, no detengas el trabajo: crea un `.xlsx` listo para subir a Google Drive y aclara que se puede abrir como Google Sheets.

## Propuesta comercial generada

El HTML debe poder generar un borrador con:

- Proyecto.
- Tipo de agente.
- Canal principal.
- Objetivo.
- Aportación inicial.
- Operación mensual estimada.
- Modelo de comisión.
- Punto de equilibrio.
- Lectura del escenario.
- Condiciones importantes:
  - No garantiza ventas o ingresos.
  - Validar costos, pasarelas, impuestos, envíos, devoluciones y políticas.
  - Recalcular si cambia precio, margen, tráfico, inventario u operación.

## Pitfalls

- No uses “aceptación principal” si Roger corrige a “aportación inicial”.
- No calcules comisión sobre venta bruta.
- No presentes la calculadora como promesa de rentabilidad.
- No esperes a tener Google OAuth si el usuario pidió avanzar: genera HTML/XLSX local y comparte los archivos.
- Verifica el HTML en navegador cuando sea posible: carga, errores de consola e interacción básica de generación/cálculo.
