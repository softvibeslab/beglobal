# Shopify CLI store auth from Telegram/gateway sessions

Use this when connecting Shopify CLI to a merchant store from a headless Hermes gateway/Telegram session.

## Context

`shopify auth login` uses a device-code flow and works well in a background PTY: the user authorizes a code in their browser, then the CLI stores the account login.

`shopify store auth --store <shop>.myshopify.com --scopes ...` is different: it uses a local PKCE callback server at `http://127.0.0.1:13387/auth/callback`. In a headless gateway it may say it will open a browser and then wait without printing the authorization URL. The user needs the URL, and after authorization they may need to paste the final `127.0.0.1` callback URL back to Hermes so the server can complete the token exchange.

## Recommended sequence

1. Start account login first:

```bash
terminal(command="shopify auth login", background=true, pty=true, watch_patterns=["User verification code", "Open this link", "verification code", "accounts.shopify.com"])
```

Send the device-code URL/code to the user and wait for `✔ Logged in.`.

2. Start store auth with a conservative first scope:

```bash
terminal(command="shopify store auth --store STORE.myshopify.com --scopes read_products", background=true, pty=true, watch_patterns=["Open this URL manually", "https://", "Logged in", "Authenticated", "error"])
```

3. If the CLI prints an authorization URL, send it to the user. If the browser redirects to `http://127.0.0.1:13387/auth/callback?...`, ask the user to paste that full URL back.

4. Complete the callback from the server:

```bash
curl -sS 'http://127.0.0.1:13387/auth/callback?code=...&shop=...&state=...' | head -c 300
```

Then wait for the background process and verify:

```bash
shopify store execute --store STORE.myshopify.com --query 'query { shop { name myshopifyDomain id } }' --json
```

5. For write-scope validation, create a harmless DRAFT product and delete it immediately:

```bash
shopify store execute --store STORE.myshopify.com --query 'mutation { productCreate(product: {title: "Hermes Permission Test", status: DRAFT}) { product { id title status } userErrors { field message } } }' --allow-mutations --json
shopify store execute --store STORE.myshopify.com --query 'mutation { productDelete(input: {id: "gid://shopify/Product/ID"}) { deletedProductId userErrors { field message } } }' --allow-mutations --json
```

## Headless URL not printed workaround

If `store auth` only prints `Shopify CLI will open the app authorization page in your browser.` and then hangs, the CLI may believe browser opening succeeded even though no usable browser exists.

A last-resort workaround is to temporarily force Shopify CLI's open helper to return `false`, so it prints `Browser did not open automatically. Open this URL manually:`.

Observed with Shopify CLI 4.0.0 installed under Node/NVM:

```bash
python - <<'PY'
from pathlib import Path
p = Path('/root/.nvm/versions/node/v22.22.2/lib/node_modules/@shopify/cli/dist/chunk-BDVAE5MS.js')
b = p.with_suffix('.js.bak-hermes')
if not b.exists():
    b.write_text(p.read_text())
text = p.read_text()
old = 'async function zm(e){let t=await import("./open-VA7TLUIL.js");try{return await t.default(e),!0}catch{return!1}}'
new = 'async function zm(e){return !1}'
if old not in text:
    raise SystemExit('open helper pattern not found; inspect current CLI bundle before patching')
p.write_text(text.replace(old, new, 1))
print('patched')
PY
```

Important: this is a brittle bundle patch. Prefer supported env/config options if Shopify adds one. Keep a backup and restore after the auth flow if normal browser opening is needed later.

## Scope pitfall

Requesting very broad scopes can fail after user authorization if Shopify grants fewer scopes than requested. Example: `write_price_rules` may be rejected/missing while `read_price_rules` and `write_discounts` work. If this happens, remove the missing scope and re-run `shopify store auth` with the remaining operational scopes.

Avoid claiming “all permissions” unless verified. Say “operational ecommerce permissions” and list what was granted/validated.
