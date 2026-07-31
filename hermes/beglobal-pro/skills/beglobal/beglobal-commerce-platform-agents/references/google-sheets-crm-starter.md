# Google Sheets CRM starter — Be Global Commerce OS

Use when Roger chooses Google Sheets as the initial CRM/source of truth before marketplace automation.

## Recommended tabs

1. `Productos_Ofertas`
   - Tracks offer/product candidates from Amazon, Mercado Libre, Shopify, Telegram, etc.
   - Suggested columns: `fecha_captura`, `estado`, `plataforma`, `categoria`, `titulo`, `precio_lista`, `precio_oferta`, `moneda`, `condicion_descuento`, `cupones`, `link_principal`, `links_extra`, `fuente`, `notas`, `proximo_paso`.
2. `Leads`
   - Suggested columns: `fecha`, `nombre`, `telefono`, `email`, `telegram`, `origen`, `interes`, `producto_interes`, `etapa`, `proxima_accion`, `fecha_seguimiento`, `notas`.
3. `Publicaciones`
   - Suggested columns: `fecha`, `canal`, `producto`, `tipo_publicacion`, `copypaste`, `url_publicada`, `estado`, `metricas`, `notas`.
4. `Config`
   - Stores operational defaults such as country/site, default Shopify store, and marketplace mode.

## Local-first workflow

If Google OAuth is not authenticated yet, do not block the work. Create local seed CSVs under the Commerce OS workspace, then upload/sync once credentials are ready.

Suggested path:

`/root/.hermes/profiles/beglobal-pro/workspace/be-global-commerce-os/crm/google-sheets/`

Suggested files:

- `01_productos_ofertas.csv`
- `02_leads.csv`
- `03_publicaciones.csv`
- `04_config.csv`
- `README.md`

## Google auth requirement

Before creating/updating the live spreadsheet, the profile needs Google OAuth configured with Drive/Sheets scopes. Ask for the OAuth Desktop App client secret JSON path (`google_client_secret.json`) or guide the user through Google Cloud Console setup.

Do not frame missing OAuth as a failure. Say: “plantilla local lista; falta autenticar Google para crear el Sheet real.”

## Marketplace sequencing

When the user says “Google Sheets first, then Mercado Libre”:

1. Create/prepare the CRM structure and seed current products/offers.
2. Authenticate Google and create the live Sheet.
3. Start Mercado Libre Operator in read-only mode first: user, categories, existing listings.
4. Only publish/edit after credentials are verified and the user confirms the exact listing action.
