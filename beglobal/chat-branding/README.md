# Branding del chat Be Global

Interfaz para `https://chatbeglobal.softvibes.pro/`: logo oficial, azul Be Global y selector Claro/Oscuro. Sigue el tema del dispositivo hasta la primera elección; después guarda `beglobal-chat-theme` en el navegador. Sin almacenamiento disponible, el selector funciona durante la visita. Conserva historial, borradores, recursos visuales y comportamiento del chat existente.

## Archivos

- `index.html`: shell público actual con logo, selector y referencias a los assets nuevos.
- `branding.css`: estilos de marca y dos paletas que complementan `/styles.css`.
- `theme.js`: preferencia, cambio del sistema y sincronización entre pestañas; carga antes de pintar.
- `logo-beglobal.png`: logo oficial sin alterar, compartido con `/agent/` y `/vapi/`.
- `manifest.json`: hashes de los cuatro archivos publicados.

No se copia ni modifica el renderer `/app.js`, el CSS de distribución ni el proveedor/perfil Hermes. El ajuste del servidor agrega únicamente tres rutas estáticas explícitas; conserva la política CSP.

## Servicio localizado y publicación

Comprobado el 2026-09-08: VPS `169.58.107.205`, aplicación `/opt/chatbeglobal-widget`, servicio `chatbeglobal-widget.service`, usuario del proceso `chatbeglobal-widget`. El acceso operativo disponible usa SSH root; los secretos permanecen en el VPS.

`scripts/deploy_chat_beglobal_branding.py` valida los hashes previos de `server.js` e `index.html`, comprueba el paquete y la sintaxis, crea un respaldo privado y publica archivos atómicamente. Rechaza sobrescribir rutas nuevas existentes; en actualizaciones posteriores se debe revisar una nueva migración. No reinicia servicios por sí mismo.

Después de instalar, reiniciar únicamente `chatbeglobal-widget.service` para cargar las rutas nuevas y verificar `/health`, los hashes públicos y el navegador. En caso de fallo, restaurar `server.js` e `index.html` desde el respaldo indicado y reiniciar ese mismo servicio. `app.js` y `styles.css` se verifican sin cambios.

## Verificación

Pruebas del servidor existente ejecutadas con upstream simulado: 7/7. Pruebas de interfaz:

```sh
node scripts/test_chat_beglobal_branding.cjs --live
```

Requiere Playwright disponible en Node. Admite `PLAYWRIGHT_CHROMIUM` para seleccionar su ejecutable. Comprueba temas, preferencia del sistema, persistencia, sincronización entre pestañas, almacenamiento bloqueado, borrador, checklist y tamaños 1440/390/320. Las solicitudes POST del test se interceptan; no envía mensajes al modelo real.

El branding se aplica automáticamente cuando `/agent/` y el piloto cargan este dominio en sus iframes. No hace falta sustituir sus páginas.
