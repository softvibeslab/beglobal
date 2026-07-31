# Shopify product quick-add — Be Global / Softvibes Lab

Usa esta referencia cuando Roger/equipo pida “agrega/sube este producto a Shopify” con título, precio, promo, enlace fuente e imagen adjunta.

## Flujo recomendado

1. **Confirmar tienda activa**
   - Si ya hay contexto de tienda, reutilizar el dominio conocido.
   - Si Roger/equipo dice “agrega/sube estos productos” y da una URL `*.myshopify.com`, no lo transformes en catálogo local/HTML: el default correcto es subirlos a esa tienda Shopify.
   - Ejecutar una lectura segura con Shopify CLI antes de escribir:
     - `shopify store execute --store <store>.myshopify.com --query 'query { shop { name myshopifyDomain } }' --json`

2. **Validar operaciones GraphQL antes de ejecutar**
   - Para crear producto con imagen, usar Admin GraphQL y validar:
     - `productCreate(product: ..., media: ...)`
   - Para precio/compare-at del variant, validar:
     - `productVariantsBulkUpdate(productId: ..., variants: ...)`
   - Para publicar en canal Tienda online, validar:
     - `publications(first: ...)`
     - `publishablePublish(id: productId, input: [{ publicationId }])`

3. **Imagen del producto**
   - Si el usuario adjunta imagen local, Shopify necesita una URL pública para `originalSource` o un upload staged de Shopify.
   - Ruta recomendada con archivos locales: crear el producto primero, pedir `stagedUploadsCreate(resource: PRODUCT_IMAGE, httpMethod: POST)`, subir el archivo al `stagedTarget.url` con todos los `parameters` exactos, luego asociarlo con `productCreateMedia`/la mutación vigente de media y verificar `featuredMedia.status == READY`.
   - Cuando uses Shopify CLI para `stagedUploadsCreate`, escribe la respuesta a archivo con `--output-file` y lee el JSON completo desde ahí. Evita parsear stdout si contiene `policy`/firmas largas: el gateway/terminal puede truncarlas visualmente (`eyJ...WiJ9`) y la subida falla con `InvalidPolicyDocument` / `Invalid base64 encoding`.
   - Para el POST staged, usa multipart/form-data con los parámetros sin modificar y el archivo como `file`; valida HTTP `200/201/204` antes de asociar la media.
   - Si se usa URL pública externa, verifica que responda `200` antes de crear/asociar media.
   - Después de crear/asociar media, verifica que `featuredMedia.status` sea `READY` y que la URL ya esté en CDN de Shopify.

4. **Datos comerciales**
   - Precio tienda = precio promocional que Roger indique.
   - `compareAtPrice` = precio “De $X”.
   - Incluir en `descriptionHtml`: bullets claros, condición/promoción, cupón principal, cupones bancarios si aplica y enlace fuente.
   - Si la captura contradice el texto del usuario (ej. captura dice color negro pero título dice naranja), respeta el texto del usuario y menciona la discrepancia en el resumen final.

5. **Publicación y verificación final**
   - Crear producto como `ACTIVE`.
   - Actualizar variant con `price` y `compareAtPrice`.
   - Publicar explícitamente en la publicación `Tienda online` si existe.
   - Verificar con query final:
     - `id`, `title`, `handle`, `status`, `onlineStoreUrl`, `featuredMedia`, `variants.price`, `variants.compareAtPrice`.
   - Entregar al usuario: producto agregado, precio, precio comparativo, imagen, estado y link público.

## Pitfalls

- `productCreate` puede crear el variant inicial con precio `0.00`; actualiza el precio después con `productVariantsBulkUpdate`.
- `onlineStoreUrl` puede salir `null` aunque el producto esté `ACTIVE`; normalmente falta publicarlo en el canal **Tienda online**.
- Para batches de varias ofertas, crea/publica/verifica primero productos y precios; luego sube imágenes en una segunda pasada si la media requiere staged upload. Así evitas dejar toda la carga bloqueada por una imagen.
- Si una respuesta de Shopify CLI incluye campos largos (`policy`, firma, staged upload params), usa `--output-file` para preservar el JSON completo. No copies/parses valores truncados desde logs o stdout resumido.
- Evita prometer que el precio/cupones del proveedor seguirán disponibles. Indica que deben verificarse antes de vender/cobrar.
