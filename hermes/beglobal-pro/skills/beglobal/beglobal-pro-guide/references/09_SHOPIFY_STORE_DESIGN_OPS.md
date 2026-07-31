# Shopify store design ops — Shopify storefronts / ecommerce moda / multiproducto

Use when helping Be Global/Roger/equipo configure a Shopify storefront: shoe/fashion ecommerce, multiproduct offer stores, curated catalog stores, or launch-ready channel setup.

## Discovery / verification pattern

1. Confirm the store and live theme:
   - `shopify theme list --store <store>.myshopify.com`
2. Pull only what you need first:
   - `mkdir -p /tmp/<store>-theme`
   - `shopify theme pull --store <store>.myshopify.com --theme <theme_id> --path /tmp/<store>-theme --only config/settings_data.json --only templates/index.json --only templates/password.json`
3. Query current shop/products/pages through Admin GraphQL:
   - `shopify store execute --store <store>.myshopify.com --query-file query.graphql --json --output-file result.json`
4. Apply small, verifiable changes and push with explicit `--only` files:
   - `shopify theme push --store <store>.myshopify.com --theme <theme_id> --path /tmp/<store>-theme --only templates/index.json --allow-live`
5. Verify visually with browser against the storefront and/or `/password` if password protection is active.
6. If the storefront browser view still shows old copy after a successful push, do not assume the push failed. Re-pull the exact files and search for the new strings, then verify with `?preview_theme_id=<theme_id>&_cb=<timestamp>` to bypass stale storefront/preview state.
7. For ecommerce redesign requests like “no me gusta, agrega más imágenes”, act instead of only advising: use existing product `featuredMedia` to build a product-first home with hero collage, category tiles, product grid, prices/compare-at prices, and explicit CTAs.

## Shopify JSON theme pitfalls

- Shopify theme JSON files may start with an auto-generated `/* ... */` comment. When programmatically editing, strip the comment before JSON parsing and re-add it before writing.
- Horizon theme rejects some out-of-range values at push time. Known limits observed:
  - `card_corner_radius` max `16`
  - `product_corner_radius` max `16`
  - `button_border_radius_secondary` max `100`
  - section `padding-block-start/end` max `100`
- `shopify theme check` can be noisy/incomplete if only partial theme files were pulled. Prefer Shopify push validation plus browser verification for small JSON-only changes.
- If the storefront is password-protected, the visible public page is `templates/password.json`; update it too, otherwise the user may not see the new brand/copy.

## Fashion/shoe ecommerce design pattern

Research patterns from Allbirds, Nike, Steve Madden, etc. translate into:

- Product-first visuals: real shoe photos dominate. A good copy structure cannot compensate for missing product imagery.
- Hero: short aspirational claim + clear CTA.
- Navigation by purchase intent: category, occasion, gender, trend, sale.
- Trust blocks: sizing, availability, real photos, shipping/returns/contact.
- Copy style: short, fashion-oriented, not long explanatory paragraphs.
- If the user asks to “mix” known brands, translate the mix into generic visual codes only (e.g. Nike = minimal/clean/product-first; Steve Madden = fashion/editorial/attitude/black-cream contrast). Do not use logos, trademarked branding, or copy that implies affiliation.
- For shoes, useful sections include:
  1. Hero / campaign claim.
  2. Brand proposition.
  3. Shop by occasion: office, casual, event.
  4. Editorial campaign block.
  5. Trust objections: real photos, sizing, direct support.
  6. Product grid.
  7. How to buy.

## Copy bank for Softvibes-like zapatería

- “Zapatos que elevan tu outfit diario.”
- “Comodidad que se ve bien.”
- “De la oficina a la salida.”
- “Compra simple, sin adivinar.”
- “Fotos reales.”
- “Talla primero.”
- “Atención directa.”

## Product/page/menu ops

- Product descriptions can be updated with `productUpdate` and should include SEO title/description.
- Pages can be created/updated via `pageCreate` / `pageUpdate`.
- Menus can be updated via `menuUpdate` with `MenuItemUpdateInput`; for Shopify pages prefer `resourceId` instead of hardcoding URLs when possible.

## Multiproduct / curated offers conversion pattern

When converting a Shopify store from a single niche/old brand into a multiproduct offer store:

1. Reframe the brand promise first: short store name, one-line benefit, and broad category language like tecnología, hogar, belleza, accesorios or básicos diarios.
2. Create an internal organization layer before pushing traffic:
   - apply a durable tag to all relevant products;
   - create/update a collection for that tag;
   - create a public page listing the offer catalog if product publication is blocked;
   - update main menu with Inicio, Ofertas/Catálogo, guidance/checklist page, Contacto.
3. Add an operator checklist page for launch readiness: payments, Shop Pay, card brands, shipping rates, domain, test order and support/contact path.
4. Verify both admin data and storefront URLs. If products exist but are not buyable, check `publishedAt` / `onlineStoreUrl`; active products can still be unpublished.
5. If API scope `write_publications` is missing, do not keep retrying publication mutations. Tell the human to publish from Shopify Admin or reauthorize with the proper scope, then continue with checkout/testing.

## Visual ecommerce home pattern for multiproduct stores

For a fast visual upgrade on Horizon/custom-liquid homes:

1. Query products with `title`, `handle`, `onlineStoreUrl`, `featuredMedia.preview.image.url`, `price` and `compareAtPrice`.
2. Build the home around real product media:
   - hero with 4–6 product images as a collage;
   - category tiles using product/category images;
   - product grid with image, offer badge, title, price, compare-at price and clear CTAs;
   - trust/launch-readiness block below.
3. For a store that must feel “llave en mano”, product cards should include both:
   - `Ver detalles` / product URL for research and full description;
   - `Agregar al carrito` with a real Shopify product form using the first available variant ID, not a fake button.
4. Product-form pattern for custom liquid/HTML sections:
   - query each product variant ID (`variants(first: 1) { nodes { id availableForSale } }`);
   - convert the GraphQL GID variant ID to the numeric ID Shopify expects in `/cart/add` forms;
   - render `<form method="post" action="/cart/add"><input type="hidden" name="id" value="<variant_id>"><button type="submit">Agregar al carrito</button></form>`;
   - hide/disable the button if there is no variant or if the product is not available.
5. After pushing, use `browser_vision` or equivalent visual QA. Do not rely only on accessibility text: it may list images even when cards appear visually blank.
6. Verify behavior, not just layout: click/add at least one product to cart, confirm the cart line appears, then proceed far enough into checkout to confirm delivery fields and active payment options.
7. If some product images render blank or weak, especially GIFs/transparent/white-on-white product media, improve the image wells: non-white gradient background, `object-fit: contain`, larger padding, `loading="eager"` for above/catalog cards, and stable JPG/WebP fallbacks for critical tiles.
8. Preview bars from Shopify/Horizon can cover the hero in `preview_theme_id` mode; distinguish that from a real production layout issue before changing the design.

## Offer-store pricing and live-launch pattern

When Roger/equipo sends Hot Sale/Amazon/Mercado Libre offer blocks and wants to “salir en vivo” quickly:

1. Treat the posted marketplace deal price as **source cost**, not necessarily the Shopify sale price. Set a Softvibes/customer price with margin, keep `compareAtPrice` as the original “DE $X”, and store the source cost in `inventoryItem.cost` when the API accepts it.
2. Use `inventoryPolicy: CONTINUE` for fast offer catalogs if inventory quantity is zero but the product is intended to be sellable after manual availability verification. Do not present this as guaranteed stock; tell the operator to verify provider price/availability before accepting high-ticket payment.
3. For duplicate offer blocks, update the existing product by handle instead of creating another product. Update price, compare-at, description, SKU/cost, and optionally add the newer screenshot as extra media.
4. Publish to the Online Store publication and verify `onlineStoreUrl`, `availableForSale`, image presence, and price/compare-at before telling the user it is live.
5. When a product create/update run looks like it failed because the CLI result could not be parsed, verify by handle/title/ASIN before retrying. Shopify may have created the product successfully while the local parser failed; update the existing product/variant instead of creating duplicates.
6. In `execute_code`, do not parse JSON files returned by Hermes `read_file()` because it includes line-number prefixes. For `/tmp/*.json` output files created by `shopify store execute --output-file`, parse with normal Python `open(path).read()` / `json.load(open(path))` inside the script.
7. For immediate launch, recommend **warm traffic first** (WhatsApp, stories, groups) before paid traffic. Give the user one short copy block and 1–3 action steps, not a long plan.

## Brand/menu cleanup when renaming Shopify offer stores

If storefront still shows an old brand after product/theme changes:

1. Check the actual storefront HTML for injected brand scripts or stale copy, not just theme JSON. Search for the old brand in rendered HTML.
2. Pull and inspect likely global files: `layout/theme.liquid`, `sections/header-group.json`, menu data, and any announcement/header/footer group JSON.
3. Patch/remove temporary brand-replacement scripts that override `document.title` or text nodes.
4. Update announcement text in `sections/header-group.json` when the top banner still shows the old brand.
5. Update main navigation via Admin GraphQL `menuUpdate` when labels/URLs still point to an old page, e.g. change “Ofertas Tropical Ozala” to “Ofertas Softvibes” and point it to `/collections/all` if the offer page is stale.
6. Verify with a cache-busted public URL and, if needed, `preview_theme_id`. If preview shows the new home but public shows old content, re-pull exact live files and compare before changing more.

## Live checkout readiness verification

Before saying “ya podemos vender”:

1. Query products by the launch tag and count published/available/image-ready items.
2. Open public storefront and confirm current brand, launch copy, product cards, and menu labels.
3. Submit at least one real `/cart/add` form and verify `/cart.js` has the item.
4. Open checkout far enough to confirm the buyer form, country/region, delivery section, and active payment method(s) such as PayPal.
5. Hand off unresolved Admin-only items clearly: final store name in checkout, payment providers, shipping rates, policies, domain, and a final internal test order.

Default final handoff for Roger/equipo: say exactly what changed, what was verified, what is blocked by Shopify permissions/Admin-only settings, and give the next 1–3 manual steps. Include manual Shopify Admin items that API/theme edits cannot safely close: store name shown at checkout, payment provider activation, shipping rates, domain, policies and final test order.

## Human escalation / caution

- Do not finalize legal/refund/shipping language as certified legal advice. Use operational placeholders and tell the user to verify final store policies in Shopify/admin or with the team.
- For used/paca/condition-variable products, insist on real photos and condition details before opening the store publicly.
