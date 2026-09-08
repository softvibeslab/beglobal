# Perfil propuesto: beglobalasistente

Nombre técnico exacto: `beglobalasistente`.
Nombre visible: Be Global Asistente.
Audiencia: visitantes, prospectos y orientación inicial de socios.
Canal: chat público mediante backend propio; Vapi mantiene su asistente de voz separado.
Estado: paquete declarativo preparado. Perfil runtime, proveedor, gateway, proxy, widget y dominio todavía deben crearse/verificarse en el VPS.

## Instalación

Seguir `docs/beglobalasistente/ACTUALIZAR_VPS.md` y entregar `docs/beglobalasistente/TAREA_HERMES_VPS.md` al Hermes operador del servidor.

No clonar el perfil operativo, credenciales, memoria, sesiones, MCPs ni capacidades administrativas de otros agentes. El proveedor/modelo se configura en el VPS con el mecanismo soportado por su versión instalada.

## Conocimiento inicial sin herramientas

El operador construirá el SOUL runtime concatenando este paquete `SOUL.md`, un separador y `docs/beglobalasistente/BASE_CONOCIMIENTO_VAPI.txt`. De este modo el modelo recibe la base completa sin necesitar acceso al filesystem. El TXT es la fuente única; no editar copias runtime como fuente maestra.

No se entrega un `config.yaml` supuestamente universal: el operador debe aplicar los controles de `PERMISSIONS.md` a la versión instalada y verificar los toolsets efectivos de la API. Declarar los límites solo en el prompt no cumple el requisito.
