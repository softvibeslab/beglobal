import { ClipboardCheck, ShieldCheck, UserCheck } from "lucide-react";

export type HermesArtifactStatus = "Propuesto" | "Activo" | "Aprobado" | "Bloqueado";

export type HermesArtifact = {
  id: string;
  title: string;
  status: HermesArtifactStatus;
  owner: string;
  impact: string;
  evidence: string;
};

export type SyncProtocolRule = {
  label: string;
  text: string;
};

export const hermesArtifacts: HermesArtifact[] = [
  {
    id: "H-001",
    title: "Onboarding ejecutivo para Alan",
    status: "Propuesto",
    owner: "Corporate + Alan",
    impact:
      "Abrir la experiencia con mensaje y audio breve: claridad, evidencia, límites y primera pregunta estratégica.",
    evidence:
      "Conversación Hermes · bienvenida generada con texto + audio para Alan.",
  },
  {
    id: "H-002",
    title: "Flujo de experiencia Alan → equipo interno",
    status: "Propuesto",
    owner: "Corporate",
    impact:
      "Ordenar la demo en cuatro momentos: bienvenida, prueba guiada, entrega de valor y feedback.",
    evidence:
      "Conversación Hermes · flujo recomendado antes de pasar al equipo.",
  },
  {
    id: "H-003",
    title: "Regla de sincronización con Pilot Control",
    status: "Activo",
    owner: "José",
    impact:
      "Toda decisión, entrega, riesgo o aprendizaje trabajado con Hermes debe quedar visible en el dashboard.",
    evidence:
      "Solicitud directa del usuario en Telegram · 02 AGO 2026.",
  },
  {
    id: "H-004",
    title: "Registro desacoplado del código principal",
    status: "Activo",
    owner: "Corporate",
    impact:
      "Pilot Control lee los acuerdos de Hermes desde una fuente dedicada para que futuras sesiones actualicen el registro sin tocar la pantalla principal.",
    evidence:
      "Implementación local · app/hermes-register-data.ts.",
  },
  {
    id: "H-005",
    title: "Matriz operativa activa para Team y Member",
    status: "Aprobado",
    owner: "Allan Gerardo / Corporate",
    impact:
      "Los perfiles Team y Member ya cargan la matriz validada: principios no negociables, límites, escalamiento por área, respuestas modelo y checklist de calidad.",
    evidence:
      "Archivos activos: beglobal-team/SOUL.md, TEAM_CONTEXT.md, beglobal-member/SOUL.md, MEMBER_CONTEXT.md y workspace/knowledge/MATRIZ_OPERATIVA_AGENTE_BGP_VALIDADA.md.",
  },
];

export const syncProtocol: SyncProtocolRule[] = [
  {
    label: "Decisiones",
    text: "Se registran con estado, responsable, evidencia y siguiente acción antes de tratarlas como aprobadas.",
  },
  {
    label: "Entregables",
    text: "Guiones, audios, templates, workflows y criterios se reflejan como artefactos versionables.",
  },
  {
    label: "Riesgos",
    text: "Promesas comerciales, permisos, datos sensibles y cambios de método quedan como checkpoint humano.",
  },
];

export const hermesRegisterKpis = [
  {
    label: "Artefactos",
    value: String(hermesArtifacts.length),
    note: "Conversaciones convertidas en registro operativo",
    icon: ClipboardCheck,
    tone: "cyan" as const,
  },
  {
    label: "Estado",
    value: "Gobernado",
    note: "No sustituye aprobación humana ni fuente canónica",
    icon: ShieldCheck,
    tone: "amber" as const,
  },
  {
    label: "Próximo corte",
    value: "Alan",
    note: "Validar esencia, límites y primer caso de valor",
    icon: UserCheck,
    tone: "neutral" as const,
  },
];
