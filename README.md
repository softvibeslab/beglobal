# Be Global Pro — Pilot Control

Dashboard operativo del piloto de agentes IA, construido a partir de:

- `../meetings/summary.md`
- `../meetings/prompt.md`
- `../../hermes/beglobal-pro/workspace/be-global-commerce-os/AGENTS.md`

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

El seguimiento interactivo de tareas y entregables se guarda en `localStorage`.
No existe una base de datos ni se presentan métricas sin evidencia como datos
reales.

## Despliegue

El proyecto genera un sitio estático en `out/` y se publica en Hostinger. La
asociación anterior con OpenAI Sites fue retirada del código local para evitar
despliegues accidentales al destino anterior.

Producción:

`https://lavenderblush-ibex-989145.hostingersite.com`
