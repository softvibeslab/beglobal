# Shopify Payments / Payment Methods Setup

Use when Roger asks to connect payment methods on the Softvibes Lab / Be Global Shopify store.

## Key rule

Do **not** try to configure Shopify payment providers fully by CLI or Admin API. Payment setup involves sensitive owner/banking/tax/identity data and platform verification, so the merchant must complete it inside Shopify Admin.

## Direct path

Default store known in this profile:

- `nbfsr0-wq.myshopify.com`
- Payments settings: `https://admin.shopify.com/store/nbfsr0-wq/settings/payments`

If the direct link fails, guide the user:

1. Shopify Admin
2. Settings / Configuración
3. Payments / Pagos

## Recommended order

1. Shopify Payments if available.
2. PayPal as backup.
3. Mercado Pago or other external provider if Shopify Payments is unavailable or unsuitable for Mexico/account type.

## Sensitive-data guardrail

Never ask the user to paste bank account numbers, IDs, tax documents, or verification documents into chat. Ask for screenshots of provider choices/errors only, with sensitive fields covered.

## What the merchant should have ready

- Legal name / business name.
- RFC or tax data if requested.
- Address.
- Bank account details.
- Owner identity verification.
- Phone/email for the account.

## Next-step response pattern

Give the direct payments URL, explain that they must enter sensitive info in Admin, then ask what payment options appear: Shopify Payments, PayPal, Mercado Pago, or another provider/error.
