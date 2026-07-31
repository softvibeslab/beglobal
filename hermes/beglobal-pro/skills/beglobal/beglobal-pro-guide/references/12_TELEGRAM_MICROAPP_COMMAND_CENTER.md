# Telegram Mini App / Microapp — Be Global Command Center

Usa esta referencia cuando Roger/equipo quiera crear una microapp de Telegram que aporte valor al Be Global Smart Agent, Commerce OS, marketplace conversacional, CRM o flujo de productos/ofertas.

## Objetivo de la microapp

La microapp no debe ser solo una página bonita. Debe ayudar al agente a recibir datos estructurados y reducir mensajes ambiguos.

Aporta valor cuando permite:

1. Capturar datos limpios.
2. Ordenar la intención del usuario.
3. Generar payloads JSON para el agente.
4. Ejecutar acciones rápidas: producto, propuesta, comisión, lead.
5. Funcionar dentro de Telegram con `Telegram.WebApp.sendData()` y también como web normal para pruebas.

## MVP recomendado: Be Global Command Center

Primera versión sugerida con 4 módulos:

1. **Agregar producto**
   - título
   - precio oferta
   - precio antes / comparativo
   - fuente: Mercado Libre, Amazon, proveedor privado, otro
   - cupón
   - link fuente
   - notas para validar stock, color, envío y precio final
   - salida esperada: `accion: crear_producto_shopify`

2. **Calcular comisión**
   - aportación inicial
   - comisión Allan/Be Global
   - utilidad neta por venta
   - ventas estimadas
   - pago único de implementación
   - operación mensual
   - salida esperada: `accion: calcular_comision_alianza`

3. **Generar propuesta**
   - cliente/proyecto
   - tipo de agente
   - canal
   - objetivo
   - siguiente paso
   - salida esperada: `accion: generar_propuesta`

4. **Registrar lead / CRM**
   - nombre
   - interés
   - presupuesto aproximado
   - urgencia
   - notas
   - salida esperada: `accion: registrar_lead_crm`

## Payload estándar

La microapp debe generar JSON compacto y explícito. Ejemplo:

```json
{
  "accion": "crear_producto_shopify",
  "titulo": "Scooter Eléctrico Plegable M2 Max-B",
  "precio": 5120,
  "precio_comparativo": 10800,
  "fuente": "Mercado Libre",
  "link": "https://meli.la/...",
  "cupon": "FINAL12",
  "notas": "Validar stock, precio final, color, envío y cupones antes de prometer disponibilidad.",
  "source": "beglobal-command-center"
}
```

## Implementación HTML mínima

- Incluir script oficial: `https://telegram.org/js/telegram-web-app.js`.
- Inicializar si existe Telegram:
  - `const tg = window.Telegram?.WebApp;`
  - `tg.ready();`
  - `tg.expand();`
- Para enviar al bot/agente:
  - `tg.sendData(JSON.stringify(payload));`
- Si no está dentro de Telegram, copiar el payload al clipboard y mostrar alerta para pruebas.

## Hosting y conexión Telegram

1. Crear HTML estático primero.
2. Probarlo en navegador normal.
3. Publicarlo con URL HTTPS: Cloudflare Pages, Vercel, Netlify, Shopify asset/page o túnel temporal solo para demo.
4. Conectar en BotFather como Web App / Menu Button usando esa URL.
5. El bot debe escuchar `web_app_data` y enrutar según `payload.accion`.

## Pitfalls corregidos

- No diseñar la microapp como una app gigante; empezar con MVP operativo de 4 módulos.
- No depender de texto libre: cada acción debe producir JSON estructurado.
- No prometer automatización completa hasta conectar backend/webhook/bot handler.
- No usar links temporales de túnel como solución permanente; son solo para demo.
- Para productos de marketplaces, incluir siempre nota de validación de stock, precio, color, envío y cupones antes de publicar o prometer disponibilidad.

## Siguiente paso estándar

Si Roger pide “sí, hazla”, entregar un HTML funcional con:

- tabs o secciones: Producto, Comisión, Propuesta, Lead.
- botón “Generar instrucción”.
- botón “Enviar al agente”.
- panel visible de payload JSON.
- opción copiar/descargar payload.
- link público temporal si ya existe servidor/túnel, aclarando que es demo.
