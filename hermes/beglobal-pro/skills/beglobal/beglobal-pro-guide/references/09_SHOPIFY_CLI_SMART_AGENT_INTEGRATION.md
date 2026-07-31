# Shopify CLI + Be Global Smart Agent / Hermes

Usa esta referencia cuando el equipo interno pregunte si se puede conectar una tienda Shopify con Hermes o con el Be Global Smart Agent.

## Contexto operativo

En lenguaje para alumnos/clientes, decir **Be Global Smart Agent**. Reservar **Hermes** para conversaciones internas o técnicas con Roger/equipo.

## Diagnóstico inicial

Antes de prometer integración completa, validar:

1. Dominio de tienda `*.myshopify.com`.
2. Si el Shopify CLI está instalado y autenticado.
3. Si existe permiso para leer/escribir datos de la tienda.
4. Qué rol tendrá el agente: ventas, atención, catálogo, pedidos, operador ecommerce o guía de alumnos.

## Niveles de integración recomendados

Cuando pregunten “¿se puede conectar Shopify con Hermes / Be Global Smart Agent?”, responder que sí, pero diagnosticar el nivel correcto antes de construir:

1. **Lectura segura / diagnóstico**: el agente consulta tienda, productos, colecciones, pedidos de prueba o estado del canal para guiar al operador.
2. **Operador asistido**: el agente propone cambios y el humano confirma antes de editar productos, páginas, tema, menús o copy.
3. **Automatización controlada**: jobs programados o webhooks para alertas, seguimiento de pedidos, inventario, leads y reportes.
4. **Agente comercial conectado**: conversación en Telegram/web/chat que usa catálogo, FAQs, políticas y estado de pedidos según permisos.

Recomendación por defecto: empezar por **lectura segura + operador asistido**. No saltar directo a automatización total sin permisos, alcance y pruebas.

## Patrón técnico validado

Con Shopify CLI moderno, la ruta básica para operar contra una tienda es:

- `shopify auth login` para iniciar sesión.
- `shopify store auth --store <tienda.myshopify.com>` para autenticar comandos de tienda.
- `shopify store execute` para ejecutar queries/mutations GraphQL Admin API.

Comandos útiles:

```bash
shopify version
shopify commands --json
shopify store execute --store <tienda.myshopify.com>
```

Para consultar datos, usar GraphQL Admin API mediante `store execute`. Primero probar lectura segura de shop/productos. Después, si se requiere escritura, hacer una prueba controlada con producto `DRAFT` y eliminarlo.

Si se requiere conexión en tiempo real, considerar webhooks de Shopify hacia un endpoint/controlador del sistema; si solo se necesita operación interna, CLI/Admin GraphQL + jobs programados puede ser suficiente y más seguro para iniciar.

## Flujo recomendado de respuesta

1. Enmarcar la fase: “configurar tu canal de venta en Shopify”.
2. Recomendar la guía básica de Shopify cuando aplique: https://www.youtube.com/watch?v=9_KVpHvTtCw
3. Ofrecer menú corto:
   - diseño de tienda;
   - productos/inventario;
   - pagos/checkout;
   - dominio;
   - conectar con Be Global Smart Agent.
4. Si el equipo pide ejecución técnica, validar CLI/auth/permisos antes de tocar datos reales.

## Product upload / offer catalog workflow

Cuando Roger/equipo pida subir productos a Shopify desde links/ofertas y proteger margen:

0. **Resolver contexto antes de crear catálogos locales**: si Roger dice “agrega/sube estos productos” y ya dio o existe un dominio de tienda reciente/default, asumir que quiere productos en Shopify, no solo un JSON/HTML local. Verificar con `shopify store execute` la tienda real y avanzar a carga/publicación. Solo crear catálogo local como apoyo interno, no como sustituto de subirlos. Para Roger, la tienda default “mi tienda” es `nbfsr0-wq.myshopify.com` salvo que indique otra.
1. Preparar un plan antes de escribir: título, fuente, costo/oferta proveedor, precio normal de referencia, precio sugerido, margen estimado, tipo de producto, vendor, SKU y URL de imagen si existe.
2. Usar `productCreate` con GraphQL Admin API moderno. En versiones 2025-07+ el argumento es `product`, no `input`:

```graphql
mutation ProductCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
  productCreate(product: $product, media: $media) {
    product { id title handle status variants(first: 1) { nodes { id } } }
    userErrors { field message }
  }
}
```

3. Después actualizar precio/costo/SKU con `productVariantsBulkUpdate`:

```graphql
mutation UpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    productVariants { id price compareAtPrice }
    userErrors { field message }
  }
}
```

4. Verificar con query por tag/handle: `price`, `compareAtPrice`, `sku`, `featuredMedia`, `publishedAt`, `onlineStoreUrl`.
5. Si `status=ACTIVE` pero `publishedAt=null` y `onlineStoreUrl=null`, el producto existe en admin pero no está publicado en Tienda online. Para publicarlo vía API se requiere `read_publications`/`write_publications`; si falta, pedir al humano publicar desde Shopify Admin o reautorizar con esos scopes.
6. Para comprobar el bloqueo sin adivinar, corre una query segura de productos por tag/handle con `status`, `publishedAt`, `onlineStoreUrl` y cuenta cuántos están sin URL pública. Si una query a `publications`, `resourcePublications` o `Product.publications` devuelve `ACCESS_DENIED`, el problema es el scope de publicaciones, no que falten productos.

### Reautorización de scopes de publicación

Cuando haya que publicar productos desde el agente y el token actual no tenga permisos:

```bash
shopify store auth \
  --store <tienda.myshopify.com> \
  --scopes read_products,write_products,read_publications,write_publications,read_inventory,write_inventory
```

- El CLI puede imprimir un URL de autorización y quedarse esperando callback local. Comparte el URL al dueño/admin de la tienda y pídele que apruebe.
- Si usas ejecución background/PTY, revisa el log del proceso para capturar el URL completo.
- Después de que el humano apruebe, vuelve a ejecutar la query de verificación antes de intentar `publishablePublish`.
- No digas “ya publiqué” hasta verificar que `publishedAt` u `onlineStoreUrl` ya no sean `null`.

Notas operativas:

- Para `shopify store execute`, usar `--output-file /tmp/...json` cuando se necesite parsear el resultado; la salida en consola puede venir con cajas/estilos que rompen `json.loads`.
- Para mutaciones con `shopify store execute`, agregar siempre `--allow-mutations`; si hay variables desde archivo, el flag correcto del CLI 4.x es `--variable-file`, no `--variables-file`.
- Si `shopify store auth` imprime una URL OAuth y el navegador del usuario redirige a `http://127.0.0.1:<puerto>/auth/callback?...`, pedir/usar esa URL de callback en la misma máquina donde quedó corriendo el CLI. Se puede cerrar la autorización con `curl 'http://127.0.0.1:<puerto>/auth/callback?...'` y luego esperar/verificar que el proceso muestre `Authenticated`.
- Para publicar productos ya creados en Tienda online, obtener primero el `Publication` de nombre `Tienda online` y ejecutar `publishablePublish(id: <productId>, input: [{ publicationId: <onlineStorePublicationId> }])` producto por producto. Verificar después `publishedAt` y `onlineStoreUrl`.
- En GraphQL Admin moderno, campos tipo `Count` como `availablePublicationsCount` requieren selección; evita pedirlos si no hacen falta en una mutación de publicación para no bloquear el flujo.
- Si falla la creación con media remota, reintentar sin media o validar la URL de imagen; no abortar todo el lote por una imagen.
- Evitar duplicados verificando primero por tag/handle/SKU cuando sea una tienda real en producción.
- Para lotes de ofertas Hot Sale/Amazon/Mercado Libre: después de crear productos, crear una colección automatizada por tag (`collectionCreate` con `ruleSet`), publicarla con `publishablePublish`, actualizar el menú principal con `menuUpdate` y verificar `productsCount` antes de reportar listo.
- Las rutas locales de imágenes (`/root/...jpg`) no sirven como media pública de Shopify; subir imágenes requiere URL pública o un flujo de upload separado. No bloquees la publicación del producto por eso: crea/publica primero y deja imágenes como pendiente explícito.

## Margin-priced offer drops / curated deal workflow

Cuando Roger/equipo mande ofertas tipo Hot Sale/Amazon/Mercado Libre y pida “ponles precio y dame margen de ganancia”:

1. Tratar el precio publicado en la oferta como **costo/proveedor estimado**, no como precio final de tienda.
2. Crear/actualizar el producto con:
   - `price`: precio Softvibes/tienda con margen incluido;
   - `compareAtPrice`: precio “DE $X” o precio normal tachado;
   - `inventoryItem.cost`: costo/oferta proveedor cuando el API lo acepte;
   - `inventoryItem.sku`: SKU interno; en GraphQL Admin moderno el SKU va dentro de `inventoryItem`, no como `sku` directo de `ProductVariantsBulkInput`.
3. Calcular y reportar al usuario:
   - margen en MXN = `precio_tienda - costo_oferta`;
   - margen bruto = `(precio_tienda - costo_oferta) / precio_tienda`;
   - opcional markup = `(precio_tienda - costo_oferta) / costo_oferta`.
4. Elegir precios psicológicos con margen razonable según ticket:
   - belleza/bajo ticket: margen alto puede ser aceptable si sigue siendo oferta visible;
   - electrónica/alto ticket: margen menor suele conservar competitividad;
   - siempre aclarar que el margen es antes de comisiones, pasarela, envío, impuestos y cambios del proveedor.
5. Si el producto ya existe, usar `productUpdate` para refrescar título/descripción/tags/SEO y `productVariantsBulkUpdate` para precio/costo/SKU. No crear duplicados si el handle ya existe.
6. Publicar en `Tienda online` con `publishablePublish` y verificar `publishedAt`, `onlineStoreUrl`, `featuredMedia` y precio final antes de decir “quedó publicado”.

## Local Telegram image upload workflow

Cuando las imágenes vienen adjuntas en Telegram y existen como archivos locales:

1. No pasar rutas locales como `originalSource`; Shopify necesita una URL pública/staged resource.
2. Convertir cada imagen a JPEG RGB baseline para evitar fallas de procesamiento:

```python
from PIL import Image
img = Image.open(src).convert('RGB')
img.thumbnail((1800, 1800))
img.save(out, format='JPEG', quality=90, optimize=True, progressive=False)
```

3. Ejecutar `stagedUploadsCreate` con `resource: PRODUCT_IMAGE`, `mimeType: image/jpeg`, `httpMethod: POST`.
4. Usar `shopify store execute --output-file /tmp/staged.json` para conservar completos `policy`, `x-goog-signature` y demás parámetros largos; no parsear desde consola cuando el CLI pueda truncar.
5. Hacer `curl -F name=value ... -F file=@imagen.jpg;type=image/jpeg` al `stagedTarget.url` y exigir HTTP `201`/`204` antes de crear media.
6. Ejecutar `productCreateMedia(productId, media: [{mediaContentType: IMAGE, originalSource: resourceUrl, alt}])`.
7. Verificar por tag/handle: `featuredMedia` presente y `media.nodes.status == READY`.
8. Si quedaron nodos `FAILED` de intentos previos, limpiar con `productDeleteMedia(productId, mediaIds)`.

## Pitfalls

- No decir a alumnos “conectar Hermes”; decir **conectar con Be Global Smart Agent**.
- No asumir permisos de escritura aunque la lectura funcione.
- No crear, editar o borrar productos reales sin confirmar alcance.
- No confundir `ACTIVE` con publicado en la tienda online: Shopify puede crear productos activos pero no publicados si faltan scopes/canales.
- Si Roger/equipo manda productos/ofertas para “agregar” y ya existe contexto de una tienda Shopify activa, no los dejes solo como catálogo local: valida la tienda, súbelos a Shopify, publícalos y verifica links públicos.
- No decir que el margen es ganancia neta: es margen estimado antes de comisiones, envío, pasarela, impuestos, devoluciones y cambios de precio/proveedor.
- Las imágenes adjuntas de Telegram son rutas locales (`/root/.../image_cache/*.jpg`); Shopify no puede usarlas como `originalSource` directo. Para que aparezcan en tienda, primero hay que subirlas como media con staged uploads y verificar `READY`.
- Si `productCreateMedia` devuelve `UPLOADED/PROCESSING` pero luego queda `FAILED`, revisa el upload real al staged URL. Usar `--output-file` en `shopify store execute` para no truncar/corromper campos largos como `policy`; si el `policy` queda abreviado (`eyJ...`), Google Storage rechaza el POST y Shopify crea media fallida.
- Las fotos progresivas o pesadas pueden fallar al procesar; convertir a JPEG RGB baseline antes de subir: `PIL.Image.open(src).convert('RGB').thumbnail((1800,1800)); save(..., format='JPEG', quality=90, optimize=True, progressive=False)`.
- Después de subir imágenes, verificar `featuredMedia`, `media.status == READY` y borrar media `FAILED` con `productDeleteMedia` antes de decir que las imágenes quedaron bien.
- Si depende de políticas, comisiones, checkout, pagos o permisos actuales de Shopify, pedir verificar dentro de la plataforma actual.

