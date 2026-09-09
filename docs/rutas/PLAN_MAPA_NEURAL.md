# Plan: mapa neural gamificado de la ruta 0 → 100

Fecha: 2026-09-09 · Estado: v1 funcional en `beglobal/piloto/ruta-neural.html` · Datos: `beglobal/piloto/ruta-dropshipping-0-100.json` (+ `.js` para carga sin servidor)

## 1. Concepto

Un mapa de neuronas y sinapsis en el que el miembro viaja del **Punto A (hoy, 0 puntos)** al **Punto B (Master, 100 puntos)**. Cada etapa de la ruta es una neurona grande sobre una sinapsis principal en forma de onda. Al tocarla se expande en un abanico: sus hitos, un nodo de paso a paso (que a su vez se expande en pasos numerados encadenados) y un nodo de materiales. Las tres rutas críticas aparecen como **compuertas** (rombos con candado) entre etapas; se abren solo cuando la etapa previa está completa.

La estética usa el branding Be Global: cromo blanco con navy #062F55, azul #63ABE6, dorado #FDB12B y verde #45B114 sobre un lienzo navy oscuro con puntos y filamentos que respiran, como una red neuronal.

## 2. Qué hace la v1 (entregada)

| Área | Funcionalidad |
|---|---|
| Mapa | Zoom con rueda o pinch, arrastre, "Ver todo", "Colapsar", expansión y colapso animados desde el nodo padre |
| Neuronas | Punto A y B, 8 etapas con anillo de progreso y banda de puntos, 27 hitos con talla y XP, 3 compuertas, clúster de pasos y de materiales por etapa, pasos numerados |
| Sinapsis | Estados: bloqueada (punteada), disponible (dorada con pulso animado), aprobada (verde), compuerta (dorada) |
| Panel lateral | Detalle por nodo: objetivo, cursos con enlace a la Academia, videos de YouTube (✓ si tienen transcripción), entregable, estado, checklist de la compuerta, paso a paso con casillas |
| Gamificación | Puntaje 0-100 por hitos aprobados (banda por etapa, repartida por talla), XP (50 × talla por aprobación, 10 por entrega, 5 por paso), nivel con umbrales Fibonacci, racha diaria, 9 insignias, confeti y toasts |
| Roles | Modo Miembro (entrega evidencia) y modo Team (aprueba, devuelve o reabre) |
| Misión activa | Siempre visible en el HUD; el botón la centra en el mapa y la marca con halo dorado |
| Persistencia | `localStorage` con bitácora de eventos; botón de reinicio con confirmación |
| Enlaces directos | `ruta-neural.html#M_E2-M3`, `#S_E3`, `#G_RC1`, `#C_E2_steps` abren y centran ese nodo; útil para que el agente member o la miniapp envíen al miembro al punto exacto |
| Responsive | En móvil el panel sube desde abajo y la leyenda se oculta |

Sin dependencias externas ni servidor: abre en cualquier navegador y en el hosting estático actual.

## 3. Reglas de juego

- Solo se avanza aprobando hitos con evidencia. Ver lecciones no da puntos.
- La etapa N se desbloquea al completar la N-1. Las compuertas RC1 (antes de E3), RC2 (antes de E5) y RC3 (antes de E7) se abren con la etapa previa completa.
- La misión activa es el primer hito no aprobado de la primera etapa disponible: siempre hay un siguiente paso, nunca dos.
- Las tallas Fibonacci de los hitos definen el XP; una talla 8 (E7-M6) se descompone en la miniapp antes de asignarse.
- Insignias: primer hito, primera venta, tienda viva, RC1, RC2, RC3, mitad del camino, racha de 7 días, master.

## 4. Roadmap del mapa

| Fase | Entregable | Dependencia | Talla |
|---|---|---|---|
| 1 (hecha) | v1 estática con datos locales y estado en navegador | ninguna | 5 |
| 2 | Conectar estado a la API de Mini Apps: `mission_progress`, `gamification`, aprobación real por Team; el mapa deja de usar `localStorage` como fuente de verdad | backend en verde (P0) | 5 |
| 3 | Seed de misiones desde el JSON de la ruta: 27 hitos con talla, XP y etapa; espiral 1-1-2-3-5-8 | fase 2 | 3 |
| 4 | Enlaces directos desde el agente member y `beglobal-pacer`: cada recordatorio lleva `#M_<hito>` | fase 2 | 2 |
| 5 | Vista Team: cola de evidencias pendientes sobre el mapa, filtro por miembro, aprobación en lote | fase 2 | 3 |
| 6 | Vista Corporate: mapa de cohorte con calor por etapa, desvío talla vs. tiempo real, calibración con `beglobal-aureo` | fase 5 | 5 |
| 7 | Integración en la miniapp de Telegram como pantalla principal del skill tree | fase 3 | 3 |

## 5. Métricas del mapa

| Métrica | Objetivo |
|---|---|
| Tiempo hasta primer hito aprobado | ≤ 3 días |
| % de sesiones que terminan con acción (entrega o paso marcado) | ≥ 50 % |
| Hitos aprobados por semana por miembro activo | ≥ 1 |
| % de miembros que abren la compuerta RC1 en 4 semanas | ≥ 60 % |

## 6. Límites conocidos de la v1

- El estado vive en el navegador; cambiar de dispositivo lo pierde. Es la limitación que resuelve la fase 2.
- La aprobación en modo Team es honoraria: cualquiera puede cambiar el modo. La autoridad real llega con la API y perfiles.
- El mapeo curso → etapa está marcado como pendiente de validación por Corporate.
- No hay leaderboard ni comparación entre miembros; se decide en la fase 5 según el gobierno de datos.
