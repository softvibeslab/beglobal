# Telegram MiniApp — Onboarding conversacional Be Global Pro

Usa esta referencia cuando Roger/equipo pida convertir el diagnóstico inicial del alumno en una experiencia interactiva dentro de Telegram.

## Objetivo

Crear una MiniApp simple, mobile-first y conversacional que reduzca fricción del onboarding:

- No presentar un formulario largo tipo examen.
- Guiar con storytelling de “mapa de ecommerce”.
- Hacer una pregunta por pantalla.
- Diagnosticar la fase del alumno.
- Generar un payload JSON para que el Be Global Smart Agent continúe la conversación.

## Flujo recomendado

1. Bienvenida breve:
   - “Tu mapa de ecommerce empieza aquí.”
   - Aclarar que no se dará todo el curso de golpe.
   - Enfatizar que primero se ubica el punto de partida.

2. Preguntas una por una:
   - Experiencia vendiendo online.
   - Producto.
   - Canal principal.
   - Proveedor.
   - Bloqueo actual.

3. Resultado:
   - Fase detectada.
   - Explicación simple.
   - Máximo 1–3 tareas.
   - Botón principal: “Enviar al agente”.

4. Payload:
   - `accion: diagnostico_alumno_beglobal_pro`
   - `source: beglobal-pro-onboarding-miniapp`
   - `fase`
   - `fase_titulo`
   - `objetivo`
   - `respuestas`
   - `respuestas_legibles`
   - `tareas_sugeridas`
   - `siguiente_paso`

## UX / tono

- Breve, conversacional e intuitivo.
- Fragmentar información en bloques pequeños.
- Botones grandes y fáciles de tocar.
- Evitar texto técnico visible para alumno final.
- Ocultar JSON por defecto en un bloque “Ver diagnóstico técnico” o modo debug.
- CTA principal claro: “Enviar al agente”.

## Diagnóstico — prioridad de reglas

Cuando el alumno no tiene producto, normalmente debe ir primero a **Fase 2: Elegir producto**, aunque también diga que no sabe elegir proveedor. Sin producto no tiene sentido revisar proveedor todavía.

Orden sugerido:

1. Si ya lanzó y el bloqueo es ventas → Fase 9.
2. Si el bloqueo es contenido → Fase 6.
3. Si el bloqueo es tienda/canal → Fase 5.
4. Si no tiene producto o el bloqueo es producto → Fase 2.
5. Si tiene ideas sin ordenar → Fase 2.
6. Si el bloqueo real es proveedor y ya hay producto/idea → Fase 4.
7. Si tiene producto pero no canal claro → Fase 3.
8. Si está desde cero y dice no saber por dónde empezar → Fase 1.

## Implementación HTML

- HTML estático primero.
- Cargar `https://telegram.org/js/telegram-web-app.js` para uso dentro de Telegram.
- Inicializar con:
  - `const tg = window.Telegram?.WebApp;`
  - `tg.ready();`
  - `tg.expand();`
- En navegador normal, permitir prueba sin Telegram.
- Enviar al bot con `tg.sendData(JSON.stringify(payload))`.
- Si no está en Telegram, copiar el payload al portapapeles para pruebas.

## Link público temporal

Para demos rápidas, se puede exponer el servidor local con Cloudflare Tunnel:

```bash
python3 -m http.server 8878
cloudflared tunnel --url http://127.0.0.1:8878 --no-autoupdate
```

Usar el link `https://*.trycloudflare.com/...` solo como demo temporal. Para producción, publicar en Cloudflare Pages, Vercel o Netlify.

## Conexión a Telegram

1. Publicar la MiniApp en HTTPS.
2. En BotFather o vía Bot API, configurar Web App/Menu Button con la URL para DMs o bot home.
3. Para grupos, no asumas que Telegram aceptará un botón `web_app`: puede rechazarlo con `BUTTON_TYPE_INVALID`. En grupos, usa link directo o botón URL como fallback y manda al alumno al DM del bot para abrir la MiniApp como popup.
4. Si se necesita popup real, configura el menú del bot en el DM con `setChatMenuButton` o BotFather, y dile al usuario exactamente qué bot abrir.
5. El bot debe escuchar `web_app_data`.
6. Parsear el JSON.
7. Enrutar según `accion` y responder con el diagnóstico + siguiente paso.

### Aplicar en un chat/grupo existente

Cuando Roger pida “aplícala en este chat”:

1. Identifica el target exacto con `send_message(action="list")` o `channel_directory.json` antes de enviar.
2. Si el chat es un grupo, menciona el nombre exacto del grupo en la respuesta para evitar confusión (“abre Be Global Vibes”, no “este chat” solamente).
3. Envía primero un mensaje breve con link directo HTTPS. Si se usa botón inline o `reply_markup`, verifica con captura o respuesta del usuario que realmente se renderizó.
4. Si el botón no aparece, no insistas: manda el link directo como fallback y pide prueba desde Telegram móvil.
6. Si Roger quiere “que no lo rechace Telegram”, no fuerces `web_app` en grupo: configura el MiniApp/Menu Button en DM del bot y en el grupo publica un deep-link/link directo al bot o a la URL.
7. Aclara si el link es temporal (`trycloudflare.com`) o permanente.

## Pitfalls

- No mostrar el JSON abierto al usuario final: se ve técnico y satura.
- No hacer todas las preguntas en una sola pantalla si se busca una experiencia conversacional.
- No usar túneles temporales como solución permanente.
- No diagnosticar proveedor antes que producto cuando el alumno todavía no sabe qué vender.
- No decir “ya quedó con botón” sin verificar: en Telegram puede llegar el texto pero no renderizarse el botón/inline markup según el método usado.
- No responder “abre este chat” si hay varios grupos/DMs posibles; dar el nombre exacto del chat o grupo.
- No usar `web_app` inline en grupos como única ruta: Telegram puede devolver `BUTTON_TYPE_INVALID`. Para popup/MiniApp real, manda al usuario al DM del bot y configura el botón de menú del bot.
- No prometer resultados ni “producto ganador”; mantener validación y criterio.
