# Portable Client Agent Skill Pack README Template

Use this README when packaging client-agent creation/sales skills or a finished client-agent configuration folder for upload to a VPS/computer.

## Package contents

```text
<pack-name>/
├── README.md
├── install.sh
├── productivity/
│   ├── client-agent-builder/
│   │   ├── SKILL.md
│   │   └── templates/
│   └── personalized-ai-agent-sales/
│       ├── SKILL.md
│       └── references/
└── client-agents/
    └── <client-name>/
        ├── agent-brief.md
        ├── system-prompt.txt
        ├── knowledge-base.md
        └── onboarding-message.md
```

## Install skills

Default Hermes profile:

```bash
unzip <pack-name>.zip
cd <pack-name>
bash install.sh
```

Named Hermes profile:

```bash
HERMES_PROFILE=<profile-name> bash install.sh
```

## After installing

Restart Hermes or open a new session so the skill loader detects the new/updated skills.

## Prompt to create a new client agent

```text
Usa la skill client-agent-builder.

Quiero crear un agente AI personalizado para un cliente.
Te voy a pasar su información y base de conocimiento.
Primero analiza todo lo que ya te di, luego hazme solo las preguntas necesarias para completar la configuración.
Cuando tengas suficiente, entrégame el agente listo para configurar en Hermes y agregarlo a un grupo.

Incluye:
- nombre y rol del agente
- misión
- tono/persona
- contexto del cliente
- base de conocimiento resumida
- tareas principales
- reglas de respuesta
- límites y escalación
- flujos de ventas/soporte/contenido si aplican
- system prompt listo para pegar
- mensaje de bienvenida para el grupo
- instrucciones de uso para el cliente
```

## Prompt to have Hermes read this folder

```text
Lee esta carpeta y dime el paso a paso para configurar el agente en Hermes.
Primero identifica las skills, prompts, base de conocimiento y archivos de onboarding.
Después dame los comandos o pasos exactos para instalarlo en el perfil correcto.
No asumas que ya está desplegado: separa configuración textual de despliegue real.
```

## Important note

A folder/ZIP can provide skills, prompts, knowledge base, and onboarding copy. It does **not** automatically create or connect a Telegram/WhatsApp bot unless the Hermes gateway/profile is configured separately.
