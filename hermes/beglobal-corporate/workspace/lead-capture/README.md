# Captación de leads (gobierno Corporate)

El perfil `beglobal-corporate` **aprueba** este catálogo. No atiende visitantes ni recibe hilos del chat público.

El perfil `beglobalasistente` **ejecuta** la conversación. El widget en `beglobal/asistente-widget/` **escribe** el CRUD.

## Ratificación pendiente

`approved_by` está como propuesta Softvibes. Hasta que Corporate firme: no hay fecha de webinar, no hay red social verificada, no hay envíos automáticos.

Para publicar un webinar real, sustituye la CTA `webinar-lista` por una ficha con `starts_at` futuro, zona horaria, requisitos y `url` de inscripción. Copia el JSON a `beglobal/asistente-widget/lead-catalog.json` y regenera el SOUL runtime en el VPS.

## CRUD

Personas designadas: `https://chatbeglobal.softvibes.pro/asistente/equipo/leads` con `LEADS_ADMIN_TOKEN`. No uses Mini Apps ni `DEV_BYPASS`.
