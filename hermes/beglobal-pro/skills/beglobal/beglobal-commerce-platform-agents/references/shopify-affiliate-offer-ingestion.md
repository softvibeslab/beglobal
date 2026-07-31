# Shopify affiliate offer ingestion from Telegram-style deal posts

Use when Roger sends raw offer blocks with title, marketplace link, price drop, coupon notes, bank coupons, and screenshots/images.

## Durable workflow

1. Parse each offer into a normalized record before creating products:
   - `title`
   - `source_marketplace` (Amazon, Mercado Libre, etc.)
   - `affiliate_url` / outbound URL
   - `compare_at_price` from “De $X”
   - `price` from “A $Y”
   - `conditions` (e.g. “Planifica y Ahorra”, “precio a la hora de pagar”, coupon code, bank coupons)
   - `disclaimer`: price/coupon availability must be verified at marketplace checkout.
2. Match images/screenshots to the correct offer by order and product context; if uncertain, ask only about the ambiguous image mapping, not the whole batch.
3. Create/update Shopify product entries as offer/catalog pages, but do not imply Shopify itself fulfills or guarantees the marketplace price.
4. If products use outbound affiliate links, make the primary CTA clear: “Ver oferta” / “Comprar en Amazon/Mercado Libre”, and store the outbound link in a metafield or button configuration rather than relying on Shopify checkout.
5. Verify each created product with a public product URL, image presence, price/compare-at price, and CTA behavior.

## Checkout/storefront verification pattern

- For regular Shopify checkout products: add a test item, open cart, proceed to checkout, verify visible payment options, then clear test cart using `/cart/clear.js`.
- Do not say “Mercado Pago está activo” unless it is visibly named in checkout or verified in Shopify Admin/payment settings. If checkout only shows “Tarjeta de crédito”, say it may be behind card processing but was not visible by name.
- If the homepage “Agregar al carrito” button fails while the product page/cart still works, report it as a theme/homepage CTA issue and offer to fix that specific button separately.

## Guardrails

- Do not promise final price, availability, coupon eligibility, bank discount, or stock. Use “precio visto en la oferta; verificar al pagar”.
- Preserve coupon/bank terms exactly as provided, but label them as conditions.
- Avoid long explanations to Roger; return a short completion summary with URLs/IDs and the one next fix if something failed.
