# Be Global Commerce OS — Agentes especializados por plataforma

Fecha: 2026-05-29
Perfil: beglobal-pro
Tienda Shopify principal: `nbfsr0-wq.myshopify.com` / Softvibes Lab

## Estado actual

### Instalado / operativo

- Shopify CLI: `4.1.0`
- Shopify Dev MCP: `shopify_dev` con `@shopify/dev-mcp`
- Toolsets Hermes activos: web, browser, terminal, file, code_execution, vision, image_gen, tts, skills, memory, session_search, delegation, cronjob, messaging.
- Skill Be Global guía: `beglobal-pro-guide`
- Skill plataforma creado: `beglobal-commerce-platform-agents`

### Pendiente por credenciales/decisión

- Mercado Libre API/OAuth: conectado en modo lectura inicial para usuario `176464677` / site `MLM`; publicaciones actuales verificadas: 0. Falta refresh token para operación continua si la app no lo devuelve.
- Amazon Product Advertising API o modo afiliado manual.
- Meta Business / Instagram Graph API.
- TikTok Business API.
- WhatsApp Business API/proveedor.
- CRM fuente de verdad: Google Sheets elegido y creado: `Be Global CRM Ofertas` (`1hUl6fAsdt_llBdv-6R743SX93fTW5kODjtWGQV-FutU`). Plantilla local en `crm/google-sheets/`.

## Agentes propuestos

### 1. Shopify Operator

Responsable de:
- Productos.
- Colecciones.
- Imágenes.
- Menú.
- Publicación online.
- Precios, compare-at-price y SKUs.
- Verificación con Admin GraphQL.

Herramientas:
- Shopify CLI.
- Shopify Dev MCP.
- Admin GraphQL.

Estado: operativo.

### 2. Mercado Libre Operator

Responsable de:
- Publicaciones.
- Stock/precio.
- Preguntas.
- Órdenes.
- Reputación.

Requisitos:
- App Mercado Libre.
- Client ID/Secret.
- Refresh token OAuth.
- Site ID: `MLM` para México.

Estado: pendiente credenciales.

### 3. Amazon/Afiliados Operator

Responsable de:
- Curar ofertas.
- Normalizar links afiliados.
- Crear fichas de producto.
- Verificar precio/disponibilidad.

Requisitos:
- Definir si se usará Amazon afiliados manual o Product Advertising API.
- Verificar políticas actuales de Amazon.

Estado: pendiente decisión/API.

### 4. Ads & Social Operator

Responsable de:
- Meta Ads.
- TikTok Ads.
- Copies.
- Reels.
- Creativos.
- Reporte de campañas.

Requisitos:
- Business Manager.
- Tokens/permisos.
- Cuentas publicitarias.

Estado: pendiente credenciales.

### 5. Telegram/WhatsApp Sales Agent

Responsable de:
- Publicar ofertas.
- Responder interesados.
- Derivar a Shopify.
- Capturar leads.
- Seguimiento.

Requisitos:
- Telegram ya conectado.
- WhatsApp requiere proveedor/API oficial.

Estado: Telegram operativo; WhatsApp pendiente proveedor.

### 6. CRM & Reporting Agent

Responsable de:
- Base de productos.
- Margen estimado.
- Leads.
- Conversión.
- Reportes diarios.

Requisitos:
- Elegir fuente de verdad: Sheets/Airtable/Notion/CRM propio.

Estado: pendiente decisión.

## Orden recomendado de implementación

1. Shopify Operator completo: productos + colecciones + imágenes + ofertas.
2. CRM simple: Google Sheet/Airtable para registrar productos y leads.
3. Telegram Sales Agent: publicar ofertas y capturar interesados.
4. Mercado Libre Operator: primero lectura, luego publicación.
5. Amazon/Afiliados Operator: reglas de links y políticas.
6. Meta/TikTok Ads Operator: contenido + campañas + métricas.
7. WhatsApp Business Agent: cuando haya proveedor/API.

## Guardrails

- No automatizar compras, pagos, reembolsos, reclamos o conflictos sin humano.
- No enviar mensajes masivos sin autorización explícita.
- No crear o editar publicaciones en marketplaces sin revisar comisiones, políticas y reputación.
- No prometer ventas ni disponibilidad.
- Verificar siempre el resultado con ID, URL o estado API.
