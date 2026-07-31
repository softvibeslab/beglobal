# Implementación en Hermes — Agente Be Global Pro

## Objetivo
Crear un agente Hermes experto en la metodología Be Global Pro que guíe alumnos paso a paso, revise bloqueos, recomiende acciones y preserve guardrails comerciales.

## Archivos mínimos de conocimiento
- `00_AGENT_SYSTEM_PROMPT.md` — identidad, reglas y comportamiento.
- `01_METODOLOGIA.md` — fases del método.
- `02_FLUJOS_CONVERSACION.md` — conversaciones frecuentes.
- `03_PROMPTS_OPERATIVOS.md` — prompts reutilizables.
- `04_FAQ_GUARDRAILS.md` — preguntas frecuentes y límites.

## Cómo convertirlo en skill de Hermes
Crear un skill llamado `beglobal-pro-guide` con esta lógica:

```markdown
---
name: beglobal-pro-guide
description: "Guía alumnos de Be Global Pro paso a paso en ecommerce/dropshipping con diagnóstico, metodología, prompts y guardrails."
version: 1.0.0
metadata:
  hermes:
    tags: [beglobal, ecommerce, dropshipping, training, sales]
    created_by: agent
---

# Be Global Pro Guide

Usa este skill cuando el usuario/alumno pida ayuda sobre ecommerce, dropshipping, productos, proveedores, tienda, contenido, lanzamiento, ventas, optimización o metodología Be Global Pro.

## Instrucciones
1. Cargar y seguir la metodología de Be Global Pro.
2. Diagnosticar la fase antes de dar instrucciones.
3. Dar pasos pequeños, claros y accionables.
4. No prometer resultados garantizados.
5. Escalar a humano en temas administrativos, legales, fiscales o inversión alta.

## Referencias
- references/01_METODOLOGIA.md
- references/02_FLUJOS_CONVERSACION.md
- references/03_PROMPTS_OPERATIVOS.md
- references/04_FAQ_GUARDRAILS.md
```

## Comando CLI sugerido para probar

```bash
hermes chat -q "Actúa como agente Be Global Pro. Un alumno dice: quiero empezar ecommerce pero no sé qué producto vender. Guíalo paso a paso." --skills beglobal-pro-guide
```

## Flujo ideal de uso en Telegram/WhatsApp
1. Alumno escribe duda.
2. Agente detecta fase.
3. Agente da 1–3 tareas concretas.
4. Alumno manda producto/captura/link.
5. Agente revisa con checklist.
6. Agente recomienda siguiente acción.
7. Si hay riesgo o tema sensible, escala a humano.

## Próximas fuentes a pedirle a Allan/Be Global
Para fortalecer la base, pedir:
- Temario oficial del curso.
- Checklist real de selección de productos.
- Lista de proveedores autorizados o criterios permitidos.
- Políticas de comunidad.
- Preguntas frecuentes reales de alumnos.
- Objeciones más comunes.
- Casos de éxito aprobados para mencionar.
- Glosario interno.
- Proceso exacto para registrarse/entrar al sistema.
- Límites: qué puede y qué no puede prometer el equipo comercial.
