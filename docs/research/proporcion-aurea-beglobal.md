# Proporción áurea aplicada a Be Global: información, agentes expertos y guía del miembro

Fecha: 2026-09-08
Estado: investigación · propuesta (heurísticas marcadas como INFERRED, no como hechos verificados)
Alcance: gestión del conocimiento del proyecto, diseño de los agentes Hermes (`orchestrator`, `corporate`, `team`, `member`) y experiencia guiada del miembro en la miniapp.

---

## 1. Resumen ejecutivo

La proporción áurea (φ ≈ 1.618, su inverso 1/φ ≈ 0.618) no es una fórmula mágica ni mejora por sí sola la precisión de un agente. Su valor real para Be Global está en tres cosas concretas:

1. **Una disciplina de proporción**: repartir atención, contexto y tiempo en ~62/38 en lugar de 50/50 o "todo a la vez". Obliga a decidir qué es lo principal.
2. **La sucesión de Fibonacci** (1, 1, 2, 3, 5, 8, 13, 21…), cuyos cocientes convergen a φ. Sirve como escala natural para tamaño de misiones, cadencias de seguimiento, ramificación del conocimiento y niveles de progresión.
3. **La búsqueda por sección áurea**, un algoritmo real de optimización que permite ajustar parámetros (dificultad, XP, cadencia de recordatorios) con muy pocos experimentos. Esto importa porque el piloto tiene pocos miembros y no admite pruebas A/B clásicas.

Hallazgo clave: el método Be Global ya es "Fibonacci implícito". El agente member diagnostica con **5** preguntas, deriva **3** perfiles, propone **1** misión, recomienda **1-2** recursos y da **1-3** acciones. La propuesta es hacer explícita y consistente esa proporción en todo el sistema, no inventar una nueva.

Advertencia honesta: gran parte de la literatura popular sobre φ en arte, naturaleza y diseño está exagerada (Markowsky 1992; Livio 2002). Todo lo que sigue debe tratarse como heurística de diseño a medir, coherente con la política del proyecto de separar EXTRACTED de INFERRED.

---

## 2. Los principios que sí se pueden usar

| Principio | Qué es | Para qué sirve en Be Global |
|---|---|---|
| Corte áureo 62/38 | Dividir un todo en mayor y menor tal que mayor/menor = todo/mayor | Presupuesto de contexto del agente, tiempo de sesión, prioridad de ingesta, layout |
| Fibonacci | Cada término es la suma de los dos anteriores | Tallas de misión, cadencias de seguimiento, ramificación del árbol de conocimiento, niveles |
| Autosimilitud (espiral) | Cada nivel repite la misma estructura a escala φ | Fichas técnicas fractales: la misma plantilla en ecosistema → comunidad → curso → lección → acción |
| Búsqueda por sección áurea | Optimización 1-D que evalúa en puntos 0.382 y 0.618 del intervalo | Calibrar parámetros de gamificación con 5-6 pruebas en lugar de decenas |
| Rectángulo áureo | Proporción 1:1.618 | Tarjetas, paneles y árbol de habilidades en la miniapp y el dashboard |

---

## 3. Aplicación 1: manejar la información de todo el proyecto

### 3.1 Estado actual (verificado en el repo)

- Grafo: 310 nodos, 1,428 relaciones, 10 comunidades. La comunidad "General Ecommerce" tiene 78 nodos y cohesión 0.05; la más pequeña tiene 18.
- Academia: 50 cursos, 1,285 lecciones anunciadas, 95 procesadas, 15.1 % de ingesta promedio.
- Método de ingesta: 10 etapas ponderadas (`weighted_verified_stages`).
- Rutas de conocimiento en el dashboard: árbol por perfil con estado `required / learning / validated` y prioridad `critical / high / medium`.

### 3.2 Arquitectura fractal del conocimiento

Propuesta: cinco niveles autosimilares, cada uno con la misma plantilla mínima (objetivo, qué hacer, evidencia esperada, siguiente nivel).

```text
Ecosistema (1)
 └─ Comunidad temática (8-13)          ← hoy 10 comunidades
     └─ Curso o ruta (3-8 por comunidad)  ← hoy 50 cursos / 10 = 5
         └─ Lección clave (5-13 por curso)
             └─ Acción / misión (1-3 por lección)
```

Regla de ramificación Fibonacci: si un nodo tiene más de 13 hijos, se subdivide; si tiene menos de 3, se fusiona con su hermano. Aplicada hoy, la comunidad "General Ecommerce" (78 nodos) debe partirse en 5-8 subcomunidades, y "Sistema Be Global Pro" (18 nodos) está en rango sano.

Beneficio para los agentes: cada agente navega el árbol con la misma plantilla en todos los niveles, así que el prompt de recuperación es uno solo y el miembro recibe siempre el mismo formato.

### 3.3 Regla 62/38 en cada ficha técnica

Cada ficha técnica y cada resumen de lección dedica ~62 % del espacio a lo accionable (pasos, plantillas, evidencia, errores comunes) y ~38 % a contexto (por qué, teoría, referencias). Esto se puede medir por conteo de palabras en `FICHA_TECNICA_TEMPLATE.md` y usar como check de calidad en la revisión humana.

### 3.4 Priorización de ingesta con presupuesto áureo

Con 1,190 lecciones pendientes no se puede procesar todo. Presupuesto por ciclo de ingesta:

| Bloque | Proporción | Contenido |
|---|---|---|
| Profundidad | 62 % | Los 3-5 cursos que sostienen la fase actual del piloto (onboarding → primeras ventas) |
| Amplitud | 38 % | Una lección representativa de cada comunidad restante, para que el grafo no quede ciego |

Dentro del 62 %, aplicar el mismo corte de nuevo: 62 % a lecciones con `EXTRACTED` posible (video accesible) y 38 % a metadata. Así la espiral se cierra sobre lo verificable primero.

### 3.5 Tallas Fibonacci para lecciones y misiones

Reemplazar "fácil / medio / difícil" por talla Fibonacci en puntos de esfuerzo: 1, 2, 3, 5, 8, 13. Esta escala es estándar en estimación ágil porque la incertidumbre crece con el tamaño y las diferencias entre tallas grandes son perceptibles. Uso práctico:

- Una misión de talla 8 o 13 se descompone antes de asignarse.
- La talla alimenta el XP y la duración estimada de la sesión.
- El agente team detecta misiones mal calibradas cuando el tiempo real se aleja más de una talla de la estimada.

### 3.6 Pesos de la metodología de ingesta

Los pesos actuales (10/10/10/15/15/15/10/5/5/5) funcionan. Una variante Fibonacci normalizada daría más peso a las etapas de valor (extracción, análisis, aprobación humana) y menos a las administrativas. No es urgente; se deja como opción para cuando Corporate revise el método.

---

## 4. Aplicación 2: agentes de IA expertos en Be Global

### 4.1 Presupuesto de contexto 62/38

Cada turno del agente member arma su contexto con dos partes:

| Parte | Proporción | Fuente |
|---|---|---|
| Estado del miembro | 62 % | Diagnóstico, fase, misión activa, evidencia previa, bloqueo declarado |
| Conocimiento del método | 38 % | Fichas técnicas verificadas de la lección o comunidad relevante |

La lógica: un mentor que conoce al alumno vale más que uno que recita el programa. Cuando el miembro está en ejecución de misión, el agente invierte la proporción de forma temporal para dar instrucciones densas, y vuelve al 62/38 al cerrar.

### 4.2 Proporción de escucha y guía por fase

| Fase del miembro | Preguntas y reflejo | Instrucción directa |
|---|---|---|
| Onboarding / diagnóstico | 62 % | 38 % |
| Ejecución de misión | 38 % | 62 % |
| Revisión de evidencia | 62 % | 38 % |

Esto se traduce en el SOUL como una regla verificable: en onboarding, al menos 3 de cada 5 turnos del agente terminan en pregunta.

### 4.3 Espiral de escalado entre perfiles

`member → team → corporate` es una espiral: cada nivel ve ~φ veces más contexto y autoridad que el anterior, y devuelve una decisión ~φ veces más compacta.

- Member ve un miembro y su misión.
- Team ve el lote de evidencias del día y el patrón de errores.
- Corporate ve métricas y una decisión auditable.

Diseño de handoff: lo que sube se resume a ~62 % de su tamaño en cada salto; lo que baja (decisión) se expande en instrucciones concretas. Esto evita que Corporate reciba conversaciones completas y que el miembro reciba políticas.

### 4.4 Cadencia Fibonacci de seguimiento y recordatorios

Recordatorios y reintentos a 1, 2, 3, 5, 8, 13 días desde la última acción del miembro. Es el patrón de espaciado creciente que usan los sistemas de repetición espaciada y los back-off de reintentos. Reinicio de la serie cuando el miembro vuelve a actuar. Si llega al día 13 sin respuesta, se escala a Team como riesgo de abandono.

### 4.5 Búsqueda por sección áurea para calibrar la gamificación

Problema real del piloto: hay pocos miembros, así que no se puede probar diez valores de un parámetro. La búsqueda por sección áurea encuentra el óptimo de una función con un solo máximo evaluando en las posiciones 0.382 y 0.618 del intervalo y descartando el tramo peor en cada paso.

Ejemplo: XP por misión mediana, intervalo inicial 100-500.

```text
Paso 1: probar 253 (0.382) y 347 (0.618) durante una semana cada uno
Paso 2: conservar el tramo con mejor tasa de misiones completadas
Paso 3: repetir; cada paso reduce el intervalo al 61.8 %
Tras 6 pasos el intervalo es ~5 % del original
```

Candidatos a calibrar así: XP de misión, bonus de racha, umbral de dificultad por semana, hora del recordatorio diario. Con una cohorte por semana, seis semanas bastan para cerrar un parámetro. El agente corporate puede ejecutar el cálculo y proponer el siguiente valor a Team.

### 4.6 Regla 1-2-3-5 de respuesta

Hacer explícita la regla que ya vive en el SOUL del member y replicarla en team y corporate:

| Cantidad | Elemento |
|---|---|
| 1 | Siguiente paso al cierre de cada respuesta |
| 2 | Recursos recomendados como máximo |
| 3 | Acciones como máximo |
| 5 | Preguntas de diagnóstico en onboarding |

Es una restricción de salida fácil de auditar por Team y de medir automáticamente.

---

## 5. Aplicación 3: cómo el agente guía al miembro

### 5.1 Embudo 5-3-1 de diagnóstico

Cinco preguntas, tres perfiles dinámicos, una misión. Ya está implementado en `diagnosis_responses` y el onboarding adaptativo. Lo nuevo es explicarlo al miembro con esa forma: "te hago 5 preguntas, te ubico en 1 de 3 caminos y te doy 1 misión".

### 5.2 Espiral de misiones

La primera misión es talla 1 (una acción, evidencia inmediata). Las siguientes crecen 1, 1, 2, 3, 5, 8. El GDD ya pide "quick wins" la semana 1 y dificultad creciente sin acantilado; Fibonacci le da la curva exacta y evita saltos arbitrarios.

```text
Misión 1  talla 1   elegir un producto del catálogo B2B y capturar su margen
Misión 2  talla 1   escribir una descripción con la plantilla de copy
Misión 3  talla 2   publicar el producto en un canal
Misión 4  talla 3   primera conversación de venta por WhatsApp (guion 30M)
Misión 5  talla 5   primera campaña orgánica de 7 días con calendario
Misión 6  talla 8   primer embudo completo con seguimiento y contabilidad básica
```

### 5.3 Sesión 62/38

La miniapp está diseñada para sesiones de 10-20 minutos. Reparto sugerido: ~62 % del tiempo en misión (hacer) y ~38 % en lección (aprender). Para una sesión de 13 minutos, son 8 de misión y 5 de lección, ambos números Fibonacci, lo que facilita bloques fijos en la interfaz.

### 5.4 Niveles con umbral Fibonacci (opcional)

La curva actual es 500 × 1.2^(n-1). Una alternativa con Fibonacci para los primeros niveles:

| Nivel | XP del nivel | XP acumulado | Días a 50 XP/día |
|---|---|---|---|
| 2 | 500 | 500 | 10 |
| 3 | 500 | 1,000 | 20 |
| 4 | 1,000 | 2,000 | 40 |
| 5 | 1,500 | 3,500 | 70 |
| 6 | 2,500 | 6,000 | 120 |
| 7 | 4,000 | 10,000 | 200 |
| 8 | 6,500 | 16,500 | 330 |

Crece más rápido que 1.2^n a partir del nivel 6, así que da menos niveles pero más significativos. Solo conviene si Corporate prefiere 8-13 niveles nombrados en lugar de 100. La curva actual no está mal; esto es una opción, no una corrección.

### 5.5 Zona de dificultad: matiz importante

La literatura sobre aprendizaje óptimo apunta a una tasa de acierto cercana al 85 % (Wilson et al. 2019), no al 62 %. Por tanto, el agente no debe usar φ para fijar la dificultad de las lecciones. Sí puede usarlo para el reparto hacer/aprender y para la progresión de tallas. Mezclar ambas cosas sería un error de diseño.

### 5.6 Interfaz de la miniapp y el dashboard

- Tarjetas de lección y misión en proporción 1:1.618.
- Panel principal dividido 62/38: progreso y misión activa a la izquierda, lección recomendada a la derecha.
- Árbol de habilidades hexagonal con radio creciente Fibonacci por anillo (1, 2, 3, 5 nodos), lo que hace visible que el camino se abre a medida que se avanza.
- Anillo de progreso que marca el 61.8 % como "punto de no retorno" de la fase, momento en que el agente celebra y anuncia la siguiente fase.

---

## 6. Qué no hacer

- No usar φ como argumento de autoridad frente al miembro ni en material de marketing. Las afirmaciones populares sobre φ en la naturaleza y el arte están en su mayoría desmentidas.
- No aplicar 62/38 a la dificultad de aprendizaje (ver 5.5).
- No sustituir métricas por proporciones. Cada regla de este documento debe registrarse como hipótesis INFERRED y validarse con datos del piloto.
- No forzar Fibonacci donde la cardinalidad natural es otra: los 7 pasos del workflow comercial y las 10 etapas de ingesta pueden quedarse como están.

---

## 7. Plan de implementación propuesto

| Fase | Entregable | Dónde toca | Esfuerzo (talla) |
|---|---|---|---|
| 1 | Regla 1-2-3-5 explícita en los SOUL de member, team y corporate | `hermes/beglobal-*/SOUL.md` | 1 |
| 2 | Talla Fibonacci en misiones y lecciones del seed | `gamification.py`, `db.py` seed, `missions` | 2 |
| 3 | Cadencia de recordatorios 1-2-3-5-8-13 con escalado a Team en día 13 | módulo de notificaciones (pendiente en Fase 3) | 3 |
| 4 | Presupuesto de ingesta 62/38 por ciclo | `scripts/build_pending_ingestion_inventory.py` | 2 |
| 5 | Regla de ramificación 3-13 y partición de "General Ecommerce" | Graphify + `knowledge-path.tsx` | 5 |
| 6 | Búsqueda por sección áurea para XP de misión (6 semanas, 1 parámetro) | dashboard Corporate + registro de decisiones | 5 |
| 7 | Layout 62/38 y tarjetas 1:1.618 en la miniapp | `duolingo.css`, dashboard Next.js | 3 |

Orden sugerido: 1, 2, 4 primero (talla 1-2 y sin dependencias); 3 y 6 cuando exista el módulo de notificaciones y una cohorte estable; 5 y 7 en la siguiente iteración de diseño.

---

## 8. Fuentes

- Markowsky, G. (1992). "Misconceptions about the Golden Ratio". *The College Mathematics Journal*, 23(1). Desmonta afirmaciones populares sobre φ.
- Livio, M. (2002). *The Golden Ratio: The Story of Phi*. Revisión histórica y crítica.
- Kiefer, J. (1953). "Sequential minimax search for a maximum". Origen de la búsqueda por sección áurea y Fibonacci.
- Cohn, M. (2005). *Agile Estimating and Planning*. Uso de la escala Fibonacci en estimación.
- Wilson, R. C. et al. (2019). "The Eighty Five Percent Rule for optimal learning". *Nature Communications*, 10:4646. Tasa de acierto óptima ≈ 85 %.
- Cepeda, N. J. et al. (2006). "Distributed practice in verbal recall tasks". *Psychological Bulletin*, 132(3). Base de la repetición espaciada con intervalos crecientes.
- Documentos internos: `graphify-out/GRAPH_REPORT.md`, `beglobal/trainning/catalog.json`, `hermes/beglobal-member/SOUL.md`, `GAME_DESIGN_DOCUMENT_v0.1.md`, `docs/premium-knowledge-mediahub/DATA_MODEL.md`.
