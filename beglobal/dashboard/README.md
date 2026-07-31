# Be Global Pro — Pilot Control

Dashboard operativo del piloto de agentes IA, construido a partir de:

- `../meetings/summary.md`
- `../meetings/prompt.md`
- `../meetings/Meeting Transcription (9).txt`
- `../meetings/transcript-workflow-analysis.md`
- `../../hermes/beglobal-pro/workspace/be-global-commerce-os/AGENTS.md`
- `../../hermes/BEGLOBAL_PROFILES.md`
- `../../hermes/BEGLOBAL_PERMISSIONS_MATRIX.md`
- `../../hermes/BEGLOBAL_ACTIVATION_RUNBOOK.md`
- `../../hermes/beglobal-corporate/`
- `../../hermes/beglobal-team/`
- `../../hermes/beglobal-member/`

## Módulos

- Resumen ejecutivo.
- Perfiles Hermes: mindset, skills, toolsets, permisos y límites.
- Onboarding: precheck, intake, setup, primera misión y aceptación.
- Planeación de reunión: cronograma de 120 minutos, Kanban de necesidades,
  responsables, fechas, subtareas, evidencia y minuta persistente por perfil.
  Cada subtarea incluye una ficha desplegable para respuesta/necesidad,
  acuerdo, owner, compromiso y adjuntos, además de indicadores de reunión en
  vivo.
- Workflow Studio: escalera Corporate → Team → Member, builder de pasos,
  responsables, entradas, resultados y evidencia.
- Media Hub unificado: captura desde cámara, carga de cualquier tipo de archivo
  del dispositivo, biblioteca autorizada del equipo, enlaces externos y
  vinculación sin duplicados desde Planeación o cada paso del workflow.
- Repositorio de conocimiento: categorías, etiquetas, estado de revisión,
  búsqueda sobre notas y texto indexado, y navegación independiente.
- Knowledge Notebooks: colecciones por perfil con fuentes, objetivo,
  instrucciones, resumen curado, preguntas guía y consulta local que devuelve
  coincidencias citando la fuente.
- Personalización de agentes: identidad, necesidades, habilidades, conocimiento,
  escalera de entrenamiento, guardrails, permisos, simulación local y
  exportación JSON por perfil.
- Ejecución y entregables.
- Métricas y criterios de salida.
- Riesgos y guardrails.

## Desarrollo

```bash
npm install
npm run dev
```

## Validación

```bash
npm run check
npm run build
```

El seguimiento interactivo se guarda en `localStorage` y los archivos de hasta
100 MB se conservan en IndexedDB dentro del navegador. No existe todavía un
repositorio central entre dispositivos ni se presentan métricas sin evidencia
como datos reales.

## Despliegue

El proyecto genera un sitio estático en `out/` y se publica en Hostinger. La
asociación anterior con OpenAI Sites fue retirada del código local para evitar
despliegues accidentales al destino anterior.

Producción:

`https://lavenderblush-ibex-989145.hostingersite.com`
