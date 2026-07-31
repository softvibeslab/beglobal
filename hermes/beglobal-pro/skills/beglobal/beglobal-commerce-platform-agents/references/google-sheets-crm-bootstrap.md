# Google Sheets CRM bootstrap para Be Global Commerce OS

Uso: cuando Roger elige Google Sheets como CRM/fuente de verdad antes de conectar Mercado Libre u otros operadores.

## Flujo probado

1. Preparar seeds locales en el Commerce OS, idealmente en:
   - `crm/google-sheets/01_productos_ofertas.csv`
   - `crm/google-sheets/02_leads.csv`
   - `crm/google-sheets/03_publicaciones.csv`
   - `crm/google-sheets/04_config.csv`

2. Autenticar Google Workspace con OAuth Desktop App:
   - Guardar el JSON con el setup de Google Workspace.
   - Generar URL de autorización.
   - El usuario pega la URL completa de retorno `http://localhost:1/?code=...`.
   - Intercambiar código y verificar `AUTHENTICATED`.

3. Crear spreadsheet:
   - Título recomendado: `Be Global CRM Ofertas`.
   - Primera pestaña: `Productos_Ofertas`.

4. Crear/cargar pestañas iniciales:
   - `Productos_Ofertas`: ofertas, links, precios, condición, fuente, notas y próximo paso.
   - `Leads`: contactos e interesados.
   - `Publicaciones`: publicaciones por canal y métricas.
   - `Config`: país, Shopify default, modo Mercado Libre, etc.

5. Verificar leyendo una muestra de `Productos_Ofertas!A1:E4` o rango similar antes de decir que quedó listo.

## Guardrails

- No crear/editar Sheets sin autorización del usuario cuando el contenido o cuenta no estén claros.
- Para Be Global, después del CRM el siguiente operador recomendado suele ser Mercado Libre en modo lectura primero.
- Registrar IDs/URLs del spreadsheet en KB operativa si existe (`kb/11_platform_agents_setup.md` u otra fuente de verdad del Commerce OS).

## Campos mínimos para Productos_Ofertas

`fecha_captura, estado, plataforma, categoria, titulo, precio_lista, precio_oferta, moneda, condicion_descuento, cupones, link_principal, links_extra, fuente, notas, proximo_paso`

## Nota operacional

Google OAuth y tokens son estado de credenciales; no convertir su ausencia en regla permanente. El aprendizaje durable es el flujo: seed local → OAuth → crear Sheet → cargar pestañas → verificar lectura → registrar URL/ID.