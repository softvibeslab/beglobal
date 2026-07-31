# Mercado Libre OAuth CLI Bootstrap

Use when Roger wants to connect Mercado Libre to Be Global CRM / platform agents.

## Goal

Configure Mercado Libre in a safe read-first mode for Mexico (`MLM`) before any publication edits.

## Human-required step

Mercado Libre app creation usually requires browser login and reCAPTCHA, so the user must create the app in Dev Center first:

- Dev Center: `https://developers.mercadolibre.com.mx/devcenter`
- Developers home: `https://developers.mercadolibre.com.mx/`

Ask the user to send:

- `CLIENT_ID`
- `CLIENT_SECRET`

## App creation fields

Recommended initial settings:

- Redirect URI: prefer `https://oauth.pstmn.io/v1/callback` for CLI/headless setup. Mercado Libre may reject `https://localhost` or merchant-domain placeholders with “La dirección debe ser válida”.
- OAuth flows: enable `Authorization Code` and `Client Credentials`
- Refresh Token: enable if available
- Require PKCE: leave disabled for the simple CLI flow unless Mercado Libre requires it
- Negocios: select `Mercado Libre`
- VIS: leave unselected

## Minimal permissions for safe start

Start with the least access available:

- Usuarios: read/write if required to identify the authorized account
- Publicación y sincronización: read-only if available; otherwise no access until needed
- Métricas del negocio: read-only if available
- Comunicaciones pre/post venta: no access
- Publicidad: no access
- Facturación: no access
- Promociones/cupones: no access
- Venta y envíos: no access initially
- Notification callbacks/topics: leave empty for first setup

## CLI flow after app exists

1. Build authorization URL:

```bash
CLIENT_ID="..."
REDIRECT_URI="https://oauth.pstmn.io/v1/callback"
printf 'https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=%s&redirect_uri=%s\n' "$CLIENT_ID" "$REDIRECT_URI"
```

2. User opens URL, authorizes, and sends back the redirected URL or `code`.

3. Exchange code for tokens:

```bash
CLIENT_ID="..."
CLIENT_SECRET="..."
CODE="..."
REDIRECT_URI="https://oauth.pstmn.io/v1/callback"

curl -sS -X POST 'https://api.mercadolibre.com/oauth/token' \
  -H 'accept: application/json' \
  -H 'content-type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=authorization_code' \
  --data-urlencode "client_id=$CLIENT_ID" \
  --data-urlencode "client_secret=$CLIENT_SECRET" \
  --data-urlencode "code=$CODE" \
  --data-urlencode "redirect_uri=$REDIRECT_URI" | jq .
```

4. Store `access_token`, `refresh_token`, `user_id`, `expires_in` in a secure profile-local env/credential file, not in chat logs where avoidable.

5. Verify read-only basics:

```bash
ACCESS_TOKEN="..."
curl -sS -H "Authorization: Bearer $ACCESS_TOKEN" https://api.mercadolibre.com/users/me | jq .
curl -sS https://api.mercadolibre.com/sites/MLM | jq .
curl -sS -H "Authorization: Bearer $ACCESS_TOKEN" "https://api.mercadolibre.com/users/$USER_ID/items/search" | jq .
```

## Guardrails

- Do not create, edit, pause, relist, price-change, or stock-change Mercado Libre listings until read-only verification passes and Roger explicitly approves the exact write action.
- Do not request broad permissions at setup just because they might be useful later.
- Treat conflicts with buyers, refunds, claims, shipping problems, or account restrictions as human-escalation topics.
