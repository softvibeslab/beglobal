# Be Global Asistente widget

Chat público de texto conectado exclusivamente al perfil Hermes `beglobalasistente`. Vapi continúa como canal de voz independiente.

## Arquitectura

`beglobal.softvibes.pro/vapi/` inserta `https://chatbeglobal.softvibes.pro/asistente/` como iframe. Caddy elimina el prefijo `/asistente` y envía al adaptador local en `127.0.0.1:8654`. El adaptador fija el modelo `beglobalasistente` y llama a su API privada en `127.0.0.1:8645`.

El navegador nunca recibe la clave Hermes. Las sesiones usan cookie Secure/HttpOnly, token CSRF en memoria, TTL de 30 minutos, límite por IP, historial acotado y un solo turno concurrente por sesión. No acepta roles, modelos, perfiles ni IDs de sesión enviados por el cliente.

## Comprobación

```sh
npm run check
curl -fsS http://127.0.0.1:8654/healthz
curl -fsS http://127.0.0.1:8645/health/detailed
```

Los archivos privados `/etc/beglobalasistente-widget.env` y el `.env` del perfil no se versionan. Vapi conserva sin cambios `beglobal/vapi/config.json`.
