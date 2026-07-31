# Ofertas Premium MX — ingestión de catálogo y tienda rápida

Usa este flujo cuando Roger/equipo pegue bloques de productos/ofertas con título, enlace, precio, cupones e imágenes y diga “agrega estos productos”, “súbelos”, “haz la tienda” o pida “el link de la tienda”.

## Objetivo

Convertir ofertas copiadas desde Amazon/Mercado Libre en una base estructurada y, si hace falta, una tienda/catálogo estático rápido para compartir internamente o validar curación de ofertas.

## Ruta recomendada

- Carpeta base: `/root/.hermes/profiles/beglobal-pro/workspace/be-global-commerce-os`
- Catálogo: `kb/ofertas-premium-mx/ofertas-YYYY-MM-DD.json`
- Resumen humano: `kb/ofertas-premium-mx/ofertas-YYYY-MM-DD.md`
- Tienda estática: `artifacts/ofertas-premium-mx/index.html`
- Assets de imágenes: `artifacts/ofertas-premium-mx/assets/`

## Campos mínimos por producto

- `title`
- `platform`: Amazon, Mercado Libre u otra
- `url`
- `original_price`
- `source_offer_price`: precio real de promoción/plataforma origen
- `offer_price`: precio final a mostrar/cobrar al cliente
- `profit_margin_rate`: por defecto `0.50` cuando Roger indique margen sobre ahorro
- `profit_amount`: ganancia calculada
- `promotion`
- `coupon_codes`
- `extra_links`
- `notes`
- `image_paths`

## Regla TRAIN — margen sobre ahorro

Cuando Roger diga que quiere margen sobre la promoción/oferta, NO uses el precio promocional como precio final de tienda. Calcula:

- `ahorro = original_price - source_offer_price`
- `profit_amount = ahorro * profit_margin_rate`
- `offer_price = source_offer_price + profit_amount`
- `compareAtPrice = original_price`

Default actual indicado por Roger: `profit_margin_rate = 0.50`, es decir, Be Global/Roger se queda con el 50% del ahorro. Ejemplo: lista $100, oferta origen $70, ahorro $30, ganancia $15, precio final mostrado $85.

## Flujo operativo

0. Interpreta “agrega estos productos” como una orden directa de ingestión, no como una solicitud de diagnóstico.
   - Si Roger no especifica destino, usa el default seguro: catálogo JSON + Markdown en `kb/ofertas-premium-mx/`.
   - No cambies de tema hacia instalación de agentes, CRM o setup de plataformas salvo que el usuario lo pida explícitamente.
   - Si después quiere publicación en Shopify/Mercado Libre/Amazon, hazlo como fase posterior y verifica políticas/API vigentes.

1. Extrae cada producto del bloque del usuario.
   - Conserva el enlace principal.
   - Guarda links extra si vienen en una sección separada; si parecen variantes o URLs repetidas del mismo producto, déjalos en `extra_links` y no dupliques el producto sin evidencia.
   - Captura cupones y bancos como `coupon_codes` cuando aplique.
   - Asocia imágenes adjuntas por orden cuando sea posible; si no hay certeza, guarda las rutas sin sobreafirmar.

2. Escribe/actualiza JSON y genera un `.md` de revisión.
   - Si ya existe un archivo de la fecha, append o fusiona sin duplicar por URL.
   - Usa precios como números MXN cuando se puedan parsear.
   - No prometas disponibilidad ni precio final; las ofertas cambian.

3. Si piden tienda/link:
   - Genera `artifacts/ofertas-premium-mx/index.html` como catálogo mobile-first.
   - Copia imágenes locales a `assets/` para que el HTML cargue.
   - Sirve con `python3 -m http.server <PUERTO> --directory <carpeta>`.
   - Verifica con una petición local que responda 200 antes de dar el link.

## Respuesta al usuario

- Confirmar cantidad de productos agregados.
- Dar rutas cortas si es interno.
- Si hay servidor local, dar el link local.
- Aclarar: “para compartirlo con clientes necesitamos dominio o túnel público”.

## Pitfalls

- No decir que el link local sirve para clientes externos si solo es `127.0.0.1`/`0.0.0.0`.
- No inventar cupones, precios ni disponibilidad.
- No mezclar esto con asesoría financiera; solo curación/catálogo de ofertas.
- Si el usuario solo dice “link de la tienda”, primero busca si ya hay artifact/servidor; si no existe, crea una tienda estática rápida con el catálogo disponible y verifica localmente.
