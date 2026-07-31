# Amazon México FBA + Shopify ops

Use when Roger/equipo or a Be Global alumno asks to sell on Amazon México, connect Shopify with Amazon FBA, validate Seller Central readiness, or choose products for Amazon/FBA.

## Core diagnosis

First classify the request into one of these phases:

1. **Seller Central setup** — account access, identity, payments, RFC/CSF validation.
2. **Product readiness** — one pilot SKU, category approval, GTIN/UPC/exemption, photos, title, pricing, dimensions.
3. **FBA readiness** — FBA enabled, shipment/inbound plan, inventory at Amazon, Prime/fulfillment settings.
4. **Shopify sync** — Shopify Marketplace Connect, SKU mapping, inventory source, order sync, price sync.
5. **Growth** — Sponsored Products, coupons, deals, pricing rules, brand registry.

Do not jump straight to Shopify connection if fiscal validation or product readiness is unresolved.

## Authoritative KB locations

Commerce OS KB:

- `/root/.hermes/profiles/beglobal-pro/workspace/be-global-commerce-os/kb/amazon-mx-fba-seller-central-kb.md`
- `/root/.hermes/profiles/beglobal-pro/workspace/be-global-commerce-os/kb/amazon-dropshipping-video-research.md`

Use these before giving Amazon/FBA guidance.

## Seller Central fiscal validation

For Mexico, Amazon requires RFC/CSF information for sellers with Mexico indicators. Operational route:

1. Seller Central: `Configuración → Información de cuenta → Información fiscal → Número de RFC`.
2. Confirm status: `Completo/Validado`, `Pendiente`, `Incompleto`, or `Rechazado`.
3. If pending, explain that Amazon may request more info and wait for validation before scaling.
4. If incomplete/rejected, fix fiscal data before syncing channels.

Guardrail: RFC, CSF, SAT, tax withholding, invoices, and retentions are fiscal/legal topics; do not act as certified tax advisor. Recommend accountant/human review when needed.

## Recommended Shopify → Amazon FBA connection flow

Use Shopify Marketplace Connect as the first operational route:

- App: https://apps.shopify.com/marketplace-connect

Flow:

1. Confirm Seller Central access and fiscal status.
2. Choose **one pilot SKU** only.
3. Verify the SKU is clean in Shopify: title, SKU, price, image, product type, inventory policy.
4. Verify the SKU is allowed/listed or ready in Amazon: category, GTIN/UPC or exemption, brand/authenticity, FBA eligibility.
5. Install/connect Shopify Marketplace Connect.
6. Connect Amazon Seller Central and select marketplace, e.g. Amazon México.
7. Map **one product/SKU**.
8. Set inventory source:
   - `Amazon/FBA` if stock is already at Amazon.
   - `Shopify` only if Shopify is the true inventory source.
9. Keep price sync manual at first.
10. Test listing, inventory, order sync, and fulfillment before syncing more products.

## Product recommendation pattern for current offer-store products

When asked which Shopify products to recommend:

1. Query live Shopify products rather than relying on memory.
2. Score by: active/published, has image, availableForSale, discount, ticket size, recognizable brand, everyday utility, and operational risk.
3. For Be Global offer catalog, treat marketplace deal price as volatile source data: verify live price/stock/coupon before taking payment.
4. Prefer first-launch products that are easy to sell and low/medium risk:
   - consumables,
   - beauty/personal care,
   - home basics,
   - ticket low to medium.
5. Use high-ticket electronics/Apple/Samsung/monitors as traffic hooks or consultative offers, not first automated checkout products without manual verification.

## Messaging pattern

Keep response short and decisive:

- “Estás en fase de ___.”
- “Antes de conectar todo, validamos ___.”
- Give 1–3 next actions.
- Ask for a screenshot/status when the next step depends on Seller Central UI.

## Pitfalls

- Do not call Amazon FBA “dropshipping.” FBA means Amazon fulfills inventory already stored/managed for the seller.
- Do not mix Amazon affiliate/curated-offer links with Seller Central/FBA flows. They are different business models.
- Do not sync all Shopify products at once.
- Do not promise sales or use Amazon’s benchmark claims as guarantees; phrase as signals or recommendations.
- Do not accept high-ticket checkout flow until availability, warranty, seller authorization and current price are verified.
