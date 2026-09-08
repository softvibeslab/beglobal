# beglobal-premium-web

Perfil independiente para el chat de `/agent/`. Deriva del trabajo local `beglobal-academy-pro` sin modificarlo. No se ha instalado en el VPS ni seleccionado en el backend por crear estos archivos.

- Español, saludo de miembros PRO y recomendaciones de uno o dos recursos según el bloqueo.
- Consulta el corte académico 2026-09-08: 50 cursos, 1.181 lecciones, 94 con ASR. Son referencias incorporadas, no fechas de lanzamiento.
- Solo cinco herramientas de conocimiento. Memoria durable desactivada; el backend debe aislar historial por usuario autenticado.
- Catálogo y corpus privados se transfieren fuera de GitHub y fuera del directorio web público.
- Configuración portátil mediante `scripts/prepare_beglobal_premium_profile.py`. No copia secretos ni perfiles existentes, ni inicia servicios.

Ver `docs/beglobal-premium-web/ACTIVAR_VPS.md` para instalación, conexión y pruebas de acceso.
