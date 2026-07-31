# Telegram offer curation + resale pricing

Use when a learner/team wants to use a public Telegram offers channel as a no-inventory catalog for affiliate/recommendation/encargo resale.

## Trigger

- User shares a public Telegram channel link like `https://t.me/<channel>` or `https://t.me/s/<channel>`.
- User wants the agent to extract offers and turn them into a catalog.
- User says the offer price should be treated as the base cost and they need a margin while staying below the original undiscounted price.

## Access pattern

1. If the user shares `https://t.me/<channel>`, try the public web mirror: `https://t.me/s/<channel>`.
2. Extract message text, product name, offer link, original price and offer price.
3. Filter by the niche the learner chose first (example: belleza/cuidado personal).
4. If the channel is private or inaccessible, ask for copied offers or screenshots.

## Pricing rule

Treat:

- **Precio oferta** = base cost.
- **Precio original / antes** = maximum ceiling.
- Add an explicit expense buffer before profit. Start with **10% estimated expenses** unless the user provides a better number.
- Target **20–30% net profit after estimated expenses**.
- Never price at or above the original undiscounted price. Keep at least a small gap below the original.

Formula:

```text
cost_with_expenses = offer_price * (1 + expense_rate)
price_20 = cost_with_expenses * 1.20
price_30 = cost_with_expenses * 1.30
max_price = original_price - small_gap
recommended_price = min(price_30, max_price)
```

If `price_20` is already above the ceiling, mark the offer as weak/risky for resale because it cannot sustain the target margin without exceeding the original price.

## Output format

For each item, keep the same product name from the source offer and provide:

- Producto:
- Link:
- Precio original:
- Precio oferta / costo base:
- Gastos estimados:
- Precio mínimo sugerido (20%):
- Precio ideal sugerido (30%):
- Techo máximo:
- Precio recomendado:
- Riesgo/check:
- Copy listo para WhatsApp/Telegram:

## Guardrails

- Do not promise sales or guaranteed profit.
- For beauty/health/cosmetics, avoid medical claims and tell the user to verify seller, authenticity, expiration, reviews and current marketplace policy.
- For bank-coupon offers, clarify that final price may depend on card/bank/availability and must be verified before taking payment.
- If operating as an affiliate/recommendation model, be transparent that the buyer should verify availability and current price before purchase.
