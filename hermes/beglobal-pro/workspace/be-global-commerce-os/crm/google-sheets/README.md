# Be Global CRM — Google Sheets

Estado: plantilla local lista. Falta autenticación Google para crear el spreadsheet real.

## Pestañas propuestas

1. `Productos_Ofertas` — catálogo de ofertas, links, precios y próximo paso.
2. `Leads` — contactos e interesados.
3. `Publicaciones` — registro de publicaciones por canal.
4. `Config` — datos base de operación.

## Flujo recomendado

1. Autorizar Google Workspace con scopes de Drive/Sheets.
2. Crear Google Sheet `Be Global CRM Ofertas`.
3. Cargar estos CSV como pestañas iniciales.
4. Después configurar Mercado Libre Operator en modo lectura: usuario, categorías y publicaciones.

## Archivos seed

- `01_productos_ofertas.csv`
- `02_leads.csv`
- `03_publicaciones.csv`
- `04_config.csv`
