export type KnowledgeTransferStatus =
  | "confirmed"
  | "proposed"
  | "assumption"
  | "blocked";

export type KnowledgeTransferEntry = {
  id: string;
  title: string;
  status: KnowledgeTransferStatus;
  owner: string;
  profile: "corporate" | "team" | "member" | "shared";
  source: string;
  situation: string;
  decision: string;
  reusableOutput: string;
  actionMinimum: string;
  evidenceExpected: string;
  riskOrLimit: string;
  escalation: string;
  chatMessages: string[];
  mediaHubLinks: {
    label: string;
    category: "source" | "template" | "example" | "evidence" | "training";
    suggestedTags: string[];
    note: string;
  }[];
};

export const statusLabels: Record<KnowledgeTransferStatus, string> = {
  confirmed: "Confirmado",
  proposed: "Propuesto",
  assumption: "Supuesto",
  blocked: "Bloqueado",
};

export const statusDescriptions: Record<KnowledgeTransferStatus, string> = {
  confirmed: "Tiene evidencia suficiente para reutilizarse sin cambiar método oficial.",
  proposed: "Parece útil, pero requiere prueba o validación adicional.",
  assumption: "Hipótesis de trabajo; no debe enseñarse como regla.",
  blocked: "Falta dato, responsable, fuente o aprobación humana/corporativa.",
};

export const knowledgeTransferEntries: KnowledgeTransferEntry[] = [
  {
    id: "shopify-store-authorization",
    title: "Autorización para creación de tiendas Shopify",
    status: "proposed",
    owner: "Roger + responsable humano/corporativo",
    profile: "team",
    source: "Chat Be Global Team · pregunta del equipo sobre Shopify",
    situation:
      "El equipo necesita saber cómo pedir autorización cuando un caso requiere crear o activar una tienda en Shopify.",
    decision:
      "El perfil Team puede preparar estructura, checklist, copy, catálogo y pasos guiados, pero no puede autorizar ni ejecutar acciones sensibles en Shopify sin aprobación explícita.",
    reusableOutput:
      "Protocolo reenviable: validar objetivo, responsable, producto/nicho, presupuesto, si será demo o real, y acción exacta solicitada antes de tocar plataforma.",
    actionMinimum:
      "Enviar una solicitud de autorización con objetivo de tienda, responsable, producto/nicho, presupuesto estimado, demo/real y acción exacta.",
    evidenceExpected:
      "Aprobación escrita del responsable humano, checklist completado y evidencia adjunta en Media Hub antes de activar cuenta, dominio, apps o pagos.",
    riskOrLimit:
      "No pedir credenciales, tarjetas, tokens ni ejecutar compras/cobros. Integraciones, pagos, dominios y apps requieren aprobación y QA.",
    escalation:
      "Escalar a corporativo/humano si implica metodología, promesa, pago, dominio, apps, datos sensibles o comunicación externa oficial.",
    chatMessages: [
      "Si el equipo pregunta que cómo puede autorizar la creación de tiendas en shopify?",
      "La creación de tiendas en Shopify sí puede prepararse, pero no debe autorizarse libremente desde el perfil Team sin checkpoint humano/corporativo.",
    ],
    mediaHubLinks: [
      {
        label: "Solicitud de autorización Shopify",
        category: "evidence",
        suggestedTags: ["shopify", "autorizacion", "checkpoint-humano"],
        note: "Adjuntar aprobación escrita, captura o documento de alcance.",
      },
      {
        label: "Checklist de preparación tienda/catálogo",
        category: "template",
        suggestedTags: ["shopify", "tienda", "catalogo", "mvp"],
        note: "Guardar plantilla reusable para coaches, soporte y equipo interno.",
      },
    ],
  },
  {
    id: "dashboard-knowledge-transfer-loop",
    title: "Vincular esta conversación con Pilot Control y Media Hub",
    status: "confirmed",
    owner: "Roger",
    profile: "shared",
    source: "Chat Be Global Team · instrucción de orquestación",
    situation:
      "Roger quiere que lo trabajado en el perfil Team se refleje en el dashboard Be Global Pro — Pilot Control.",
    decision:
      "Agregar un módulo de Transferencia para convertir conversaciones en entradas estructuradas y enlazarlas con evidencia del Media Hub.",
    reusableOutput:
      "Loop operativo: conversación → entrada estructurada → vínculo Media Hub → estado de validación → escalamiento si aplica.",
    actionMinimum:
      "Registrar cada práctica o decisión con estado, responsable, salida reusable, evidencia esperada y vínculos sugeridos al Media Hub.",
    evidenceExpected:
      "Entrada visible en el dashboard, links sugeridos al Media Hub y build local verificado.",
    riskOrLimit:
      "El dashboard local/estático no sincroniza automáticamente conversaciones de Telegram entre dispositivos; las entradas quedan versionadas en código hasta habilitar backend seguro.",
    escalation:
      "Escalar si se requiere sincronización automática, escritura remota, credenciales, autenticación o publicación a producción.",
    chatMessages: [
      "necesito que todo lo que hagamos aca se vincule o refleje igual en el dashboard Be Global Pro — Pilot Control",
      "SII igual vincula con el media hub",
    ],
    mediaHubLinks: [
      {
        label: "Evidencia de conversación Team",
        category: "source",
        suggestedTags: ["team", "transferencia", "telegram"],
        note: "Guardar extracto o captura del intercambio que originó la decisión.",
      },
      {
        label: "Activos reutilizables derivados",
        category: "template",
        suggestedTags: ["checklist", "guion", "protocolo"],
        note: "Vincular outputs finales que el equipo pueda reutilizar.",
      },
    ],
  },
];

export const knowledgeTransferLoop = [
  "Captura desde chat, audio, captura, enlace o caso real.",
  "Estructura como situación, acción, evidencia, límite y salida reusable.",
  "Vincula fuentes y activos al Media Hub con categoría y tags sugeridos.",
  "Etiqueta estado: confirmado, propuesto, supuesto o bloqueado.",
  "Escala a corporativo si cambia método, permiso, promesa, precio o acción sensible.",
];
