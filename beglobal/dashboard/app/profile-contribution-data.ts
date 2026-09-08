export type EvidenceStatus = "confirmed" | "proposed" | "inferred";

export type ProfileCorpusCoverage = {
  profile: "beglobal-corporate" | "beglobal-team";
  role: string;
  includedContributions: number;
  sessions: number;
  contributors: number;
  period: string;
  channels: string[];
  excluded: string;
  dominantSignals: Array<{ label: string; messages: number }>;
};

export type MemberImpactArea = {
  id: string;
  signal: string;
  corporateContribution: string;
  teamContribution: string;
  memberImpact: string;
  evidenceExpected: string;
  status: EvidenceStatus;
};

export const profileContributionAnalysis = {
  generatedAt: "2026-08-14T06:10:30Z",
  scope:
    "Lectura agregada de todos los mensajes de usuario activos disponibles en los perfiles live; se excluyen avisos automáticos, mensajes vacíos, secretos, identidades y texto crudo.",
  method:
    "Los mensajes de usuario se contaron desde state.db en modo solo lectura, se agruparon por señales superpuestas y se contrastaron con SOUL.md, PERMISSIONS.md y SOURCE_MANIFEST.md. Las conversaciones son evidencia operativa, no política aprobada.",
  coverage: [
    {
      profile: "beglobal-corporate",
      role: "Gobierno, método y decisiones del piloto",
      includedContributions: 93,
      sessions: 16,
      contributors: 2,
      period: "01–13 ago 2026",
      channels: ["Telegram · 71", "CLI · 15", "Cron · 7"],
      excluded: "7 avisos automáticos de procesos",
      dominantSignals: [
        { label: "Piloto y producto", messages: 34 },
        { label: "Gobierno y metodología", messages: 20 },
        { label: "Experiencia y onboarding", messages: 19 },
        { label: "Contenido y comercio", messages: 17 },
        { label: "Seguridad y datos", messages: 10 },
      ],
    },
    {
      profile: "beglobal-team",
      role: "Operación, soporte, despliegue y aprendizaje interno",
      includedContributions: 96,
      sessions: 20,
      contributors: 4,
      period: "02–14 ago 2026",
      channels: ["CLI · 52", "Telegram · 44"],
      excluded: "10 avisos automáticos y 3 mensajes vacíos",
      dominantSignals: [
        { label: "Piloto y producto", messages: 19 },
        { label: "Canales e integraciones", messages: 18 },
        { label: "Conocimiento y evidencia", messages: 17 },
        { label: "Experiencia y onboarding", messages: 13 },
        { label: "Contenido y comercio", messages: 10 },
      ],
    },
  ] satisfies ProfileCorpusCoverage[],
  executiveFindings: [
    {
      title: "La simplicidad es parte del producto",
      detail:
        "Corporate fija una experiencia sin jerga técnica; Team aporta fricción real de onboarding, canales y soporte. Member debe conversar en lenguaje cotidiano y revelar solo el siguiente paso.",
      status: "confirmed",
    },
    {
      title: "La ejecución necesita evidencia",
      detail:
        "Ambos perfiles convergen en pocas acciones, checkpoints humanos y prueba verificable. Member debe cerrar cada misión con captura, enlace, borrador o dato observable.",
      status: "confirmed",
    },
    {
      title: "Contenido y tienda son los dos flujos iniciales",
      detail:
        "Las aportaciones refuerzan guiones desde producto/referencia y preparación guiada de tienda o catálogo como casos de mayor valor temprano.",
      status: "confirmed",
    },
    {
      title: "El aprendizaje no se transfiere sin aprobación",
      detail:
        "Las conversaciones ayudan a detectar patrones, pero solo metodología y recursos aprobados deben llegar a Member. La adopción real todavía debe validarse con miembros piloto.",
      status: "inferred",
    },
  ] satisfies Array<{ title: string; detail: string; status: EvidenceStatus }>,
};

export const memberImpactAreas: MemberImpactArea[] = [
  {
    id: "guided-onboarding",
    signal: "Onboarding guiado y diagnóstico de fase",
    corporateContribution:
      "Define una experiencia simple, tres roles separados y prueba desde cero antes de escalar.",
    teamContribution:
      "Aporta preguntas, bloqueos y fricción observada en activación, soporte y uso de canales.",
    memberImpact:
      "Preguntar una cosa por vez, identificar experiencia/producto/canal/bloqueo y asignar una primera misión breve.",
    evidenceExpected: "Onboarding terminado sin ayuda técnica y tiempo a primer valor menor a 30 minutos.",
    status: "proposed",
  },
  {
    id: "minimum-action",
    signal: "Pocas acciones y evidencia de avance",
    corporateContribution:
      "Prioriza evidencia sobre entusiasmo, alcance reducido y decisiones etiquetadas por estado.",
    teamContribution:
      "Convierte errores en checklists, valida resultados y documenta escalaciones.",
    memberImpact:
      "Entregar de una a tres acciones y pedir una evidencia concreta antes de recomendar el siguiente paso.",
    evidenceExpected: "Misión terminada, evidencia aceptada y siguiente acción desbloqueada.",
    status: "confirmed",
  },
  {
    id: "content-mission",
    signal: "Contenido desde producto o referencia",
    corporateContribution:
      "Mantiene el flujo dentro del MVP y evita presentar demostraciones como capacidades garantizadas.",
    teamContribution:
      "Aporta criterios operativos para revisar gancho, demostración, beneficio, CTA, copy y tomas.",
    memberImpact:
      "Convertir producto, cliente, referencia y canal en un guion accionable sin copiar ni inventar resultados.",
    evidenceExpected: "Guion o plan de contenido calificado por el equipo con al menos 4/5.",
    status: "proposed",
  },
  {
    id: "store-catalog",
    signal: "Preparación guiada de tienda o catálogo",
    corporateContribution:
      "Define permisos, límites del MVP y checkpoint humano antes de acciones externas.",
    teamContribution:
      "Aporta secuencia de datos, QA de enlaces/estados y aprendizaje de integraciones reales.",
    memberImpact:
      "Recopilar progresivamente producto, precio, proveedor, canal, identidad, pago, envío, imágenes y copy; preparar, no publicar.",
    evidenceExpected: "Formulario completo sin campos obligatorios omitidos y borrador listo para revisión humana.",
    status: "proposed",
  },
  {
    id: "approved-knowledge",
    signal: "Conocimiento aprobado y recursos relevantes",
    corporateContribution:
      "Aporta precedencia, gobierno de fuentes y distinción entre confirmado, propuesto, supuesto, validado y bloqueado.",
    teamContribution:
      "Aporta dudas recurrentes, defectos, casos y evidencia que deben volver a Corporate para aprobación.",
    memberImpact:
      "Recomendar máximo uno o dos recursos aprobados según fase; nunca exponer el corpus interno ni métricas corporativas.",
    evidenceExpected: "Recurso utilizado y relación observable con la tarea del miembro.",
    status: "confirmed",
  },
  {
    id: "human-escalation",
    signal: "Confianza, límites y escalamiento humano",
    corporateContribution:
      "Define privilegio explícito, separación de datos y aprobación humana de decisiones sensibles.",
    teamContribution:
      "Aporta señales operativas para escalar pagos, conflictos, permisos, inversión alta o frustración fuerte.",
    memberImpact:
      "Detener la automatización, explicar el motivo con lenguaje sencillo y entregar un paquete mínimo de contexto al equipo.",
    evidenceExpected: "Escalamiento trazable sin compartir secretos ni información de terceros.",
    status: "confirmed",
  },
  {
    id: "channel-friction",
    signal: "Canales confiables sin complejidad visible",
    corporateContribution:
      "Separa la experiencia del miembro de la arquitectura e integraciones corporativas.",
    teamContribution:
      "Documenta fricción real de Telegram, despliegue y configuración que no debe recaer en el miembro.",
    memberImpact:
      "Ofrecer una entrada estable y guiada; convertir errores técnicos en mensajes accionables o escalarlos silenciosamente.",
    evidenceExpected: "Activación y recurrencia sin intervención técnica del miembro.",
    status: "inferred",
  },
  {
    id: "audio-text-alternative",
    signal: "Entrega conversacional, breve y accesible",
    corporateContribution:
      "La experiencia Member debe ocultar complejidad y adaptar el formato sin convertir una preferencia aislada en regla global.",
    teamContribution:
      "Las aportaciones piden mensajes cortos, CTA claro, audio cuando agregue valor y rotación de estilo para evitar respuestas mecánicas.",
    memberImpact:
      "Recibir respuestas breves y accionables; usar audio como opción y conservar siempre una alternativa textual por accesibilidad, costo y contexto.",
    evidenceExpected: "El miembro comprende la acción, puede ejecutarla en su formato disponible y no depende de audio obligatorio.",
    status: "proposed",
  },
  {
    id: "governed-trends",
    signal: "Tendencias y referencias bajo curaduría",
    corporateContribution:
      "Protege el método y evita que una tendencia, demo o promesa de desempeño sustituya evidencia y aprobación.",
    teamContribution:
      "Aporta necesidades de contenido actual, análisis de referencias y reglas de escenas reutilizables con guardrails.",
    memberImpact:
      "Consumir referencias ya curadas y convertirlas en estructura propia; no ejecutar vigilancia abierta ni copiar contenido literalmente.",
    evidenceExpected: "Pieza original vinculada a una referencia aprobada, sin promesa de viralidad ni resultado garantizado.",
    status: "inferred",
  },
  {
    id: "learning-loop",
    signal: "Bucle Member → Team → Corporate",
    corporateContribution:
      "Aprueba cambios de conocimiento y decide continuar, ajustar, escalar o detener.",
    teamContribution:
      "Clasifica feedback, defectos, soporte, tiempos y calidad con evidencia verificable.",
    memberImpact:
      "Recibir una experiencia cada vez más clara sin permitir que una conversación aislada modifique el método.",
    evidenceExpected: "Cambio documentado, aprobado y vinculado a evidencia de varios casos o una decisión explícita.",
    status: "proposed",
  },
];

export const reusableAssets = [
  {
    title: "Mapa corporativo de conocimiento",
    origin: "Corporate",
    contribution:
      "Federa Commerce OS, YouTube y fuentes del proyecto para localizar evidencia con precedencia y trazabilidad.",
    memberUse:
      "Member no consulta el grafo directamente; recibe uno o dos recursos aprobados y relevantes para su fase.",
    status: "confirmed" as EvidenceStatus,
  },
  {
    title: "Límites y método Fase 1",
    origin: "Corporate + Team",
    contribution:
      "Las conversaciones convirtieron límites del asistente de socios en un documento limpio y un flujo de validación interna.",
    memberUse:
      "Alimenta respuestas seguras solo después de revisión Corporate; no crea permisos nuevos por sí mismo.",
    status: "proposed" as EvidenceStatus,
  },
  {
    title: "Checklist de pruebas Team",
    origin: "Team",
    contribution:
      "Estructura casos desde cero, contenido, tienda, falta de ventas y acciones sensibles con resultado esperado y evidencia.",
    memberUse:
      "Reduce defectos antes de activar miembros y convierte fallos repetidos en mejoras verificables.",
    status: "proposed" as EvidenceStatus,
  },
  {
    title: "Template TikTok/Reels y reglas de escenas",
    origin: "Corporate",
    contribution:
      "Una corrección de usuario mostró que replicar un template requiere conservar su mecánica de escenas, no solo voz sobre imagen estática.",
    memberUse:
      "Ayuda a adaptar referencias en guiones y tomas originales; no promete viralidad ni rendimiento.",
    status: "confirmed" as EvidenceStatus,
  },
  {
    title: "Entrega conversacional y onboarding",
    origin: "Team",
    contribution:
      "Reúne tono corto, CTA, audio opcional, preguntas progresivas y una primera misión en vez de una explicación extensa.",
    memberUse:
      "Disminuye carga cognitiva y acelera el primer entregable sin exponer lenguaje técnico.",
    status: "proposed" as EvidenceStatus,
  },
  {
    title: "Transferencia + Media Hub",
    origin: "Team",
    contribution:
      "Establece cómo reflejar aprendizajes y activos en Pilot Control con fuente, estado y relación a evidencia.",
    memberUse:
      "Permite que el equipo reutilice materiales aprobados; la interfaz actual no equivale a sincronización automática ni backend central.",
    status: "confirmed" as EvidenceStatus,
  },
];

export const memberDataBoundaries = [
  "No copiar mensajes crudos, nombres, IDs, chats ni memoria de Corporate o Team al perfil Member.",
  "No mostrar métricas corporativas, precios, acuerdos internos, reportes de operación ni decisiones no aprobadas.",
  "No transferir contraseñas, tokens, credenciales, rutas sensibles, logs o detalles administrativos.",
  "Mantener aislado el contexto de cada miembro: fase, objetivo, producto, canal, bloqueo, tareas y evidencia mínima.",
  "Usar las conversaciones para detectar patrones; usar fuentes aprobadas para definir comportamiento y metodología.",
  "Etiquetar como propuesta o inferencia cualquier adaptación que aún no haya sido validada por miembros piloto.",
];

export const analysisGaps = [
  "Este corte no incluye conversaciones reales de beglobal-member; todavía mide intención y operación, no valor validado para el miembro.",
  "Las categorías se superponen: una aportación puede contribuir a más de una señal y los conteos no deben sumarse como total único.",
  "Parte del corpus Team corresponde a despliegue y administración; informa la reducción de fricción, pero no debe convertirse en contenido del miembro.",
  "El corte es una fotografía al 14 de agosto de 2026; requiere regeneración para incorporar conversaciones posteriores.",
];

export const contributionSources = [
  "beglobal-corporate/state.db · mensajes user activos · solo lectura",
  "beglobal-team/state.db · mensajes user activos · solo lectura",
  "hermes/beglobal-corporate/SOURCE_MANIFEST.md",
  "hermes/beglobal-team/SOURCE_MANIFEST.md",
  "hermes/beglobal-member/SOURCE_MANIFEST.md",
  "hermes/beglobal-member/SOUL.md y PERMISSIONS.md",
  "beglobal/meetings/summary.md · precedencia P1",
];
