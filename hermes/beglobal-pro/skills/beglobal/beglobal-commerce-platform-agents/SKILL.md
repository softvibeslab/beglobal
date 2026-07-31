---
name: beglobal-commerce-platform-agents
description: "Orquesta agentes especializados por plataforma para Be Global/Softvibes ecommerce: Shopify, Mercado Libre, Amazon, ads/social, Telegram/WhatsApp, CRM y reporting."
version: 1.0.0
metadata:
  hermes:
    tags: [beglobal, ecommerce, platform-agents, shopify, mercado-libre, amazon, telegram, crm]
    created_by: agent
---

# Be Global Commerce Platform Agents

Usa este skill cuando Roger/equipo pida configurar, instalar, coordinar o usar agentes especializados por plataforma ecommerce.

## Principio

No crear automatización total sin diagnóstico, permisos y pruebas. Empezar por lectura segura + operador asistido; después pasar a escritura controlada.

## Agentes recomendados

### 1. Agente Shopify Operator

**Rol:** productos, colecciones, menús, precios, imágenes, publicación, inventario básico y verificación.

**Herramientas:** Shopify CLI, Shopify Dev MCP, Admin GraphQL.

**Estado actual conocido:** Shopify CLI funciona contra `nbfsr0-wq.myshopify.com` cuando hay auth de tienda. Shopify Dev MCP está instalado como `shopify_dev`.

**Flujo:**
1. Verificar tienda: `shopify store execute --store <shop> --query 'query { shop { name myshopifyDomain } }' --json`.
2. Validar GraphQL con Shopify Dev MCP antes de mutaciones.
3. Crear/actualizar productos con `productCreate`, `productUpdate` y `productVariantsBulkUpdate`.
4. Publicar con `publishablePublish` y verificar `publishedAt`/`onlineStoreUrl`.
5. Para imágenes locales, convertir a JPG baseline no progresivo antes de staged upload.
6. Para tandas de ofertas afiliadas tipo Telegram (Amazon/Mercado Libre con cupones, precios e imágenes), normalizar primero y verificar CTA/precio/publicación; ver `references/shopify-affiliate-offer-ingestion.md`.
7. Para validar ofertas de **servicios premium/agentes personalizados** dentro de una tienda existente, crear una página landing dedicada con `templates/page.<suffix>.json` + `pageCreate/pageUpdate(templateSuffix)`, CTA a WhatsApp y branding propio; mantener la tienda principal intacta y ocultar/reemplazar header/footer que confundan la marca.

**Pitfalls:**
- `ACTIVE` no significa publicado.
- Imágenes locales deben subirse vía `stagedUploadsCreate` + upload HTTP + media attach.
- No decir “ganancia neta”; margen es antes de comisiones/envío/impuestos.
- No prometer precio final/cupón/stock en ofertas afiliadas: indicar que se verifica en el marketplace al pagar.
- No afirmar que Mercado Pago está activo si en checkout solo aparece “Tarjeta de crédito”; reportar exactamente lo visible y pedir/verificar Admin si hace falta.
- Después de pruebas de carrito/checkout, limpiar el carrito de prueba con `/cart/clear.js`.
- Si el botón de homepage falla pero producto/carrito/checkout funcionan, aislarlo como problema de CTA/tema de home, no como falla general de checkout.

### Shopify Payments setup

**Rol del agente:** guiar al merchant al Admin correcto y revisar opciones/errores por captura.

**Guardrail:** no configurar ni pedir datos bancarios, identidad, RFC/documentos o verificación por chat. Los métodos de pago se completan en Shopify Admin, no por CLI. Ver `references/shopify-payments-admin-setup.md`.

### 2. Agente Mercado Libre Operator

**Rol:** publicaciones, precios, stock, preguntas, órdenes y reputación.

**Requisitos:** app de Mercado Libre, `CLIENT_ID`, `CLIENT_SECRET`, refresh token OAuth, país/site (`MLM` para México).

**Flujo seguro inicial:** solo lectura de usuario, categorías y publicaciones antes de editar.

**OAuth/CLI bootstrap probado:** crear app requiere acción humana por login/reCAPTCHA en Dev Center; usar un Redirect URI público válido como `https://oauth.pstmn.io/v1/callback` si Mercado Libre rechaza localhost con “La dirección debe ser válida”, flujos Authorization Code + Client Credentials, permisos mínimos, y después generar/intercambiar código por CLI con `curl`/`jq`. Ver `references/mercado-libre-oauth-cli-bootstrap.md`.

**Pitfall CLI:** al guardar `ML_SCOPE` en `.env`, envolver el valor con comillas/`shlex.quote` porque Mercado Libre devuelve scopes con espacios; si no, `source` interpreta cada scope como comando.

**Pitfall token:** si Mercado Libre devuelve `refresh_token: null`, la conexión de lectura funciona temporalmente pero no es operación continua; revisar que Refresh Token esté habilitado en la app antes de prometer automatización persistente.

**Pendiente:** configurar credenciales reales antes de escribir.

### 3. Agente Amazon/Afiliados Operator

**Rol:** curar ofertas, normalizar links afiliados, comparar precios, crear fichas para tienda/canales.

**Requisitos posibles:** Amazon Product Advertising API o flujo manual/afiliado. Verificar políticas actuales de Amazon afiliados antes de automatizar scraping o claims.

**Guardrail:** no prometer disponibilidad ni precio final; siempre decir que el precio se verifica en Amazon al pagar.

### 4. Agente Ads & Social Commerce

**Rol:** Meta Ads, TikTok, reels, copies, creativos, CTAs, audiencias y reporting.

**Requisitos:** tokens/permisos de Meta Business/TikTok Business si se desea publicar o leer métricas. Sin credenciales, operar en modo estrategia/copy/creativos.

### 5. Agente Telegram/WhatsApp Sales

**Rol:** publicar ofertas, responder leads, capturar intención, enviar links, hacer seguimiento y derivar a humano.

**Herramientas:** Telegram gateway, send_message, cronjob para alertas, catálogo Shopify como fuente.

**Guardrail:** no enviar mensajes masivos o a grupos/contactos sin confirmación explícita del target y mensaje.

### 6. Agente CRM & Reporting

**Rol:** registrar leads, productos, márgenes, ventas, campañas, conversiones y próximos seguimientos.

**Opciones:** Google Sheets, Airtable, Notion o CRM propio. Elegir uno como fuente de verdad antes de duplicar.

**Google Sheets bootstrap probado:** crear seeds locales (`Productos_Ofertas`, `Leads`, `Publicaciones`, `Config`), autenticar Google Workspace, crear el spreadsheet, cargar pestañas, verificar lectura y guardar URL/ID en la KB operativa. Ver `references/google-sheets-crm-bootstrap.md`.

**Google Sheets starter:** cuando Roger elija Google Sheets como CRM inicial, usar una estructura simple con pestañas `Productos_Ofertas`, `Leads`, `Publicaciones` y `Config`. Si Google OAuth aún no está autenticado, avanzar local-first creando CSV seed en el Commerce OS y dejar claro: “plantilla local lista; falta autenticar Google para crear el Sheet real”. Ver `references/google-sheets-crm-starter.md`.

## Matriz de instalación por plataforma

- Shopify: instalado/operativo con Shopify CLI + Shopify Dev MCP. Para métodos de pago, guiar por Admin y no pedir datos sensibles en chat; ver `references/shopify-payments-admin-setup.md`.
- Mercado Libre: requiere app OAuth y credenciales.
- Amazon: requiere definir si será afiliados manual o Product Advertising API.
- Meta/TikTok: requiere Business Manager/app/tokens.
- Telegram: gateway operativo; usar confirmación antes de mensajes externos.
- WhatsApp: requiere proveedor/API oficial o integración externa.
- CRM: elegir Google Sheets/Airtable/Notion antes de conectar. Si Roger elige Google Sheets, usar el flujo probado en `references/google-sheets-crm-bootstrap.md`.

## Checklist de seguridad antes de escribir datos

1. ¿Qué plataforma exacta?
2. ¿Lectura o escritura?
3. ¿Credenciales/permisos verificados?
4. ¿Prueba en recurso seguro o DRAFT?
5. ¿Verificación posterior con URL/ID/estado?
6. ¿Humano confirma si afecta clientes, pagos, envíos, reputación o inversión?

## Respuesta breve a Roger

Cuando Roger pida “instalar agentes por plataforma”, responder con fase y próximos pasos:

1. Shopify queda como primer agente operativo.
2. Mercado Libre/Amazon/Meta/TikTok requieren credenciales o decisión de API.
3. Crear un Command Center/CRM simple para enrutar tareas y evitar operar todo mezclado.
