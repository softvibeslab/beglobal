# Be Global /agent

Página estática con sitio oficial embebido, identidad azul de Be Global y chat en un diálogo accesible. Abre `https://chatbeglobal.softvibes.pro/` bajo demanda. No utiliza Vapi.

El aviso PRO comunica la audiencia; no verifica membresías. La autenticación, autorización y selección fija del perfil `beglobal-premium-web` corresponden al backend del chat. El iframe no cambia el perfil mediante parámetros ni concede acceso. Ver `docs/beglobal-premium-web/ACTIVAR_VPS.md`.

La página no contiene conocimiento premium ni credenciales. El backend debe mantener `frame-ancestors 'self' https://beglobal.softvibes.pro` y ofrecer acceso en otra pestaña para navegadores que limiten cookies dentro del iframe.
