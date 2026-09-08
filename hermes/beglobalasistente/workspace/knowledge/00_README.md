# Be Global Pro — Base de conocimiento para Vapi

Este paquete contiene una base de conocimiento inicial y un prompt maestro para crear un agente de voz en Vapi llamado, sugerido, **Asesor Be Global Pro**.

## Estado de autoridad

- **Confirmado:** sitio oficial público: https://www.beglobalpro.org/
- **Confirmado:** el sitio público presenta Be Global Pro como sistema educativo y contiene secciones de membresías, proveedores/tienda, blog y academia/cursos.
- **Confirmado:** el sitio público contiene referencias a capacitaciones y webinars por videoconferencia dentro de descripciones de membresía.
- **Propuesto:** diagnóstico gratis como flujo conversacional del agente.
- **Propuesto:** invitación a webinar/clase y membresía Pro como CTA del asesor.
- **Propuesto:** marco de diagnóstico por etapas ecommerce.

## Archivos

1. `01_PROMPT_VAPI.md` — prompt principal para pegar en Vapi.
2. `02_KB_BE_GLOBAL.md` — conocimiento base del agente.
3. `03_FAQ_RESPUESTAS.md` — respuestas frecuentes.
4. `04_DIAGNOSTICO_GRATIS.md` — flujo de diagnóstico.
5. `05_GUARDRAILS.md` — límites, frases prohibidas y escalamiento.
6. `06_WIDGET_REQUIREMENTS.md` — lo que necesito de Vapi para embeber el widget.
7. `07_LEAD_SCHEMA_PROPUESTO.json` — esquema sugerido para leads si se activa webhook.

## Uso recomendado

- Cargar `01_PROMPT_VAPI.md` como system/instructions del assistant de Vapi.
- Subir `02_KB_BE_GLOBAL.md`, `03_FAQ_RESPUESTAS.md`, `04_DIAGNOSTICO_GRATIS.md` y `05_GUARDRAILS.md` como Knowledge Base o contexto documental.
- No incluir tokens privados, API keys ni credenciales dentro de Vapi prompt o frontend.
