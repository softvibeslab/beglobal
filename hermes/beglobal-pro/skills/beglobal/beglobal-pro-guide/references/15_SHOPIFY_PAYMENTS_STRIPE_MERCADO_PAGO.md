# 15 — Shopify Payments: Stripe y Mercado Pago

## Cuándo usar

Usar cuando un alumno/equipo comparta una tienda Shopify y pida implementar, configurar o decidir entre Stripe, Mercado Pago u otra pasarela.

## Diagnóstico de fase

Clasifica como `F4_tienda_canal`: la tienda/canal ya existe o está en construcción y el siguiente bloqueo es recibir pagos correctamente.

## Recurso Be Global primero

Antes de dar un plan largo, recomienda máximo 1–2 videos:

1. **Cómo funciona Shopify (guía para principiantes)**  
   https://www.youtube.com/watch?v=9_KVpHvTtCw  
   Útil para revisar base de tienda, productos, configuración y flujo general.

2. **Como usar mercado pago y vincularlo a tu tienda en linea**  
   https://www.youtube.com/watch?v=z3X0ZoC6DSM  
   Útil cuando el bloqueo directo es Mercado Pago/pasarela de pago.

Después pide evidencia: captura de `Shopify Admin > Configuración > Pagos`, link de tienda, captura del checkout o la parte donde se atoró.

## Secuencia recomendada

1. **Validar carrito y checkout antes de activar pagos**
   - Producto activo.
   - Publicado en Tienda online.
   - Precio y variante válidos.
   - Inventario disponible o venta permitida sin inventario.
   - Botón “Agregar al carrito” realmente agrega el producto.
   - Checkout abre correctamente.

2. **Mercado Pago primero para México/LATAM**
   - Recomendable como primera pasarela si el público principal está en México/LATAM.
   - Motivos: familiaridad, métodos locales, confianza por marca y relación con compradores de Mercado Libre/Mercado Pago.
   - Ruta usual: Shopify Admin → Configuración → Pagos → Proveedores → Mercado Pago / Checkout Mercado Pago / Mercado Pago Checkout Pro.
   - Conectar cuenta Mercado Pago, configurar métodos, activar y hacer compra de prueba.

3. **Stripe como opción adicional si está disponible**
   - Recomendable si la cuenta Stripe está verificada, el país/moneda/Shopify lo permite o el negocio venderá a público internacional.
   - Ruta usual: Shopify Admin → Configuración → Pagos → buscar Stripe Card Payments o proveedor relacionado.
   - No prometer que Stripe estará disponible: depende de país, moneda, cuenta bancaria, Shopify y políticas vigentes.

4. **Verificación final**
   - Compra de prueba completa.
   - Pedido aparece en Shopify.
   - Pago aparece en la pasarela.
   - Email/confirmación de pedido funciona.
   - Políticas de envío, reembolso, privacidad y contacto están visibles antes de mandar tráfico.

## Pitfalls

- No recomendar activar pasarelas sin probar primero carrito/checkout. Si al tocar “Agregar al carrito” el carrito queda vacío, el bloqueo puede ser variante, stock, botón, tema o configuración de producto.
- No asumir que Stripe o Mercado Pago están disponibles para todas las cuentas. Pedir verificar en Shopify Admin y documentación/panel actual.
- No dar asesoría fiscal/legal. Para datos fiscales, facturación, impuestos, contracargos o cuentas bloqueadas, escalar a plataforma/equipo humano/contador según aplique.

## Respuesta base corta

> Por lo que me muestras, estás en fase de configurar tu canal de venta en Shopify. Antes de activar pagos, valida carrito + checkout. Mira primero este video de Mercado Pago: https://www.youtube.com/watch?v=z3X0ZoC6DSM. Luego mándame captura de Shopify Admin > Configuración > Pagos y te digo si conviene activar Mercado Pago, Stripe o ambas.
