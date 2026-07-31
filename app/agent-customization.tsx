"use client";

import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleCheckBig,
  Download,
  FlaskConical,
  GraduationCap,
  KeyRound,
  Library,
  LockKeyhole,
  MessageSquareText,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRoundCog,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CustomProfileKey = "corporate" | "team" | "member";
type Priority = "critical" | "high" | "medium";
type PermissionValue = "allowed" | "approval" | "blocked";
type CollectionKey = "needs" | "skills" | "knowledge" | "guardrails";

type ConfigItem = {
  id: string;
  label: string;
  priority: Priority;
  approved: boolean;
};

type AgentConfig = {
  publicName: string;
  assignedTo: string;
  maturityLevel: string;
  trainedBy: string;
  trains: string;
  activationChannel: string;
  trainingCadence: string;
  escalationRoute: string;
  mission: string;
  tone: string;
  welcome: string;
  successCriteria: string;
  needs: ConfigItem[];
  skills: ConfigItem[];
  knowledge: ConfigItem[];
  guardrails: ConfigItem[];
  permissions: Record<string, PermissionValue>;
};

type AgentConfigs = Record<CustomProfileKey, AgentConfig>;

type SimulationResult = {
  profile: string;
  scenario: string;
  route: string[];
  approvedSkills: string[];
  guardrails: string[];
  warning?: string;
};

const storageKey = "bg-agent-customization-v1";

const profileMeta: Record<
  CustomProfileKey,
  {
    label: string;
    slug: string;
    caption: string;
    color: string;
  }
> = {
  corporate: {
    label: "Corporativo",
    slug: "beglobal-corporate",
    caption: "Gobierno, método y decisiones",
    color: "cyan",
  },
  team: {
    label: "Equipo interno",
    slug: "beglobal-team",
    caption: "Operación, QA y escalamiento",
    color: "green",
  },
  member: {
    label: "Miembro piloto",
    slug: "beglobal-member",
    caption: "Diagnóstico y misiones guiadas",
    color: "amber",
  },
};

const priorityLabels: Record<Priority, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Media",
};

const permissionLabels: Record<PermissionValue, string> = {
  allowed: "Permitido",
  approval: "Con aprobación",
  blocked: "Bloqueado",
};

const permissionDefinitions = [
  {
    id: "readKnowledge",
    label: "Consultar conocimiento aprobado",
    description: "Usar fuentes vigentes del proyecto.",
  },
  {
    id: "proposeChanges",
    label: "Proponer cambios",
    description: "Preparar recomendaciones sin aplicarlas.",
  },
  {
    id: "createDrafts",
    label: "Crear borradores",
    description: "Generar contenido o configuraciones para revisión.",
  },
  {
    id: "externalMessaging",
    label: "Mensajería externa",
    description: "Enviar mensajes fuera del entorno de prueba.",
  },
  {
    id: "operatePlatforms",
    label: "Operar plataformas",
    description: "Realizar acciones en tiendas, CRM o canales.",
  },
  {
    id: "publishContent",
    label: "Publicar contenido",
    description: "Hacer visible un resultado a terceros.",
  },
  {
    id: "approveKnowledge",
    label: "Aprobar conocimiento",
    description: "Convertir una propuesta en fuente oficial.",
  },
  {
    id: "financialActions",
    label: "Pagos y reembolsos",
    description: "Ejecutar movimientos financieros o disputas.",
  },
];

const lockedPermissions: Record<CustomProfileKey, string[]> = {
  corporate: ["operatePlatforms", "publishContent", "financialActions"],
  team: ["approveKnowledge", "financialActions"],
  member: [
    "externalMessaging",
    "operatePlatforms",
    "publishContent",
    "approveKnowledge",
    "financialActions",
  ],
};

function item(
  id: string,
  label: string,
  priority: Priority,
  approved = true,
): ConfigItem {
  return { id, label, priority, approved };
}

function createDefaultConfigs(): AgentConfigs {
  return {
    corporate: {
      publicName: "Be Global Corporate",
      assignedTo: "",
      maturityLevel: "Nivel 3–4 · gobierno, orquestación y release",
      trainedBy: "Sponsor + integrador técnico + evidencia Be Global",
      trains: "Equipo interno",
      activationChannel: "Chat corporativo independiente",
      trainingCadence: "Semanal durante el piloto y antes de cada release",
      escalationRoute: "Sponsor → integrador técnico → decisión go/no-go",
      mission:
        "Gobernar la metodología, los permisos, la calidad y las decisiones del piloto con base en evidencia.",
      tone: "Ejecutivo, directo, prudente y orientado a decisiones",
      welcome:
        "Estoy listo para revisar evidencia, riesgos y decisiones del piloto. ¿Qué resultado necesitas validar?",
      successCriteria:
        "Cada recomendación cita su fuente, separa hechos de supuestos y termina con máximo tres prioridades.",
      needs: [
        item(
          "corporate-need-1",
          "Trazabilidad entre decisiones, fuentes y versiones",
          "critical",
        ),
        item(
          "corporate-need-2",
          "Visibilidad de métricas, costos y riesgos del piloto",
          "high",
        ),
        item(
          "corporate-need-3",
          "Separación explícita de autoridad entre perfiles",
          "critical",
        ),
        item(
          "corporate-need-4",
          "Control de versiones para método, plantillas y medios",
          "critical",
        ),
        item(
          "corporate-need-5",
          "Visibilidad de infraestructura, tokens y archivos pesados",
          "high",
        ),
        item(
          "corporate-need-6",
          "Canal y SLA de soporte para el equipo interno",
          "high",
        ),
      ],
      skills: [
        item(
          "corporate-skill-1",
          "Curaduría y gobierno del conocimiento",
          "critical",
        ),
        item(
          "corporate-skill-2",
          "Registro de decisiones y control de cambios",
          "high",
        ),
        item(
          "corporate-skill-3",
          "Reporting ejecutivo y unit economics",
          "high",
        ),
        item(
          "corporate-skill-4",
          "Diseño de templates para contenido, tienda y diagnóstico",
          "critical",
        ),
        item(
          "corporate-skill-5",
          "Capacitación, evaluación y habilitación del equipo",
          "critical",
        ),
        item(
          "corporate-skill-6",
          "Gobierno de permisos, datos, versiones y releases",
          "critical",
        ),
      ],
      knowledge: [
        item(
          "corporate-knowledge-1",
          "Metodología y plantillas oficiales Be Global",
          "critical",
        ),
        item(
          "corporate-knowledge-2",
          "Pilot charter, riesgos y criterios de salida",
          "critical",
        ),
        item(
          "corporate-knowledge-3",
          "Cursos, videos, FAQs, políticas y casos oficiales",
          "critical",
        ),
        item(
          "corporate-knowledge-4",
          "Catálogo de plantillas con owner, versión y vigencia",
          "high",
        ),
        item(
          "corporate-knowledge-5",
          "Costos, infraestructura, integraciones y límites técnicos",
          "high",
        ),
      ],
      guardrails: [
        item(
          "corporate-guardrail-1",
          "No operar tiendas, pagos ni cuentas de miembros",
          "critical",
        ),
        item(
          "corporate-guardrail-2",
          "Solicitar aprobación antes de cambios durables",
          "critical",
        ),
        item(
          "corporate-guardrail-3",
          "No liberar conocimiento sin owner, versión y evidencia de QA",
          "critical",
        ),
        item(
          "corporate-guardrail-4",
          "Separar hechos, supuestos, propuesta y decisión",
          "high",
        ),
      ],
      permissions: {
        readKnowledge: "allowed",
        proposeChanges: "allowed",
        createDrafts: "approval",
        externalMessaging: "approval",
        operatePlatforms: "blocked",
        publishContent: "blocked",
        approveKnowledge: "approval",
        financialActions: "blocked",
      },
    },
    team: {
      publicName: "Be Global Team",
      assignedTo: "",
      maturityLevel: "Nivel 3 controlado · operación, QA y capacitación",
      trainedBy: "Agente corporativo + responsable de metodología",
      trains: "Miembro / socio",
      activationChannel: "Chat operativo independiente",
      trainingCadence: "Antes de cada release y revisión semanal de casos",
      escalationRoute: "Operador → líder de equipo → corporativo → técnico",
      mission:
        "Validar casos, apoyar a los miembros y ejecutar operaciones controladas con revisión y evidencia.",
      tone: "Operativo, claro, resolutivo y cuidadoso",
      welcome:
        "Puedo ayudarte a diagnosticar el caso, preparar un borrador y definir el escalamiento correcto.",
      successCriteria:
        "Resuelve al menos 8 de 10 escenarios sin defecto crítico y verifica cada acción con evidencia.",
      needs: [
        item(
          "team-need-1",
          "Distinguir lectura, borrador, aprobación y escritura",
          "critical",
        ),
        item(
          "team-need-2",
          "Escalamiento claro por severidad y responsable",
          "high",
        ),
        item(
          "team-need-3",
          "Acceso únicamente a proyectos y miembros asignados",
          "critical",
        ),
        item(
          "team-need-4",
          "Onboarding escrito, sesión en vivo y video de referencia",
          "high",
        ),
        item(
          "team-need-5",
          "Inbox de evidencia, defectos y solicitudes del socio",
          "critical",
        ),
        item(
          "team-need-6",
          "Plantillas operables para contenido y tienda",
          "high",
        ),
      ],
      skills: [
        item("team-skill-1", "QA de conversaciones y entregables", "critical"),
        item(
          "team-skill-2",
          "Soporte, diagnóstico y escalamiento",
          "high",
        ),
        item(
          "team-skill-3",
          "Contenido y preparación guiada de tienda",
          "high",
        ),
        item(
          "team-skill-4",
          "Entrenamiento y acompañamiento del socio desde cero",
          "critical",
        ),
        item(
          "team-skill-5",
          "Ingeniería inversa de video: hook, emoción, beneficio, CTA y tomas",
          "high",
        ),
        item(
          "team-skill-6",
          "Captura estructurada de paleta, producto, canal y operación",
          "high",
        ),
      ],
      knowledge: [
        item(
          "team-knowledge-1",
          "Método, plantillas y respuestas esperadas",
          "critical",
        ),
        item(
          "team-knowledge-2",
          "Dataset de QA y runbook de soporte",
          "high",
        ),
        item(
          "team-knowledge-3",
          "Templates aprobados de contenido, tienda y catálogo",
          "critical",
        ),
        item(
          "team-knowledge-4",
          "Casos de prueba correctos, ambiguos y prohibidos",
          "high",
        ),
        item(
          "team-knowledge-5",
          "Onboarding, videos y criterios para habilitar al socio",
          "high",
        ),
      ],
      guardrails: [
        item(
          "team-guardrail-1",
          "Lectura o borrador antes de cualquier escritura",
          "critical",
        ),
        item(
          "team-guardrail-2",
          "No ejecutar pagos, reembolsos o conflictos",
          "critical",
        ),
        item(
          "team-guardrail-3",
          "No enseñar una propuesta que Corporate todavía no aprobó",
          "critical",
        ),
        item(
          "team-guardrail-4",
          "Verificar con evidencia antes de cerrar una misión",
          "high",
        ),
      ],
      permissions: {
        readKnowledge: "allowed",
        proposeChanges: "allowed",
        createDrafts: "allowed",
        externalMessaging: "approval",
        operatePlatforms: "approval",
        publishContent: "approval",
        approveKnowledge: "blocked",
        financialActions: "blocked",
      },
    },
    member: {
      publicName: "Be Global Smart Agent",
      assignedTo: "",
      maturityLevel: "Nivel 2 · diagnóstico y misión guiada",
      trainedBy: "Coach / equipo interno",
      trains: "No entrena perfiles; devuelve evidencia y feedback",
      activationChannel: "Telegram al inicio; canal independiente por socio",
      trainingCadence: "Onboarding + primera misión + revisión semanal",
      escalationRoute: "Miembro → coach → líder de equipo → corporativo",
      mission:
        "Ubicar al miembro en su fase y ayudarle a completar una misión útil sin exponer complejidad técnica.",
      tone: "Cercano, sencillo, motivador y práctico",
      welcome:
        "Primero voy a ubicar tu punto de partida para darte el siguiente paso correcto, no una lista genérica.",
      successCriteria:
        "El miembro recibe máximo tres acciones y obtiene un guion o brief utilizable en menos de 30 minutos.",
      needs: [
        item(
          "member-need-1",
          "Saber cuál es el siguiente paso correcto",
          "critical",
        ),
        item(
          "member-need-2",
          "Convertir una idea o producto en un entregable",
          "high",
        ),
        item(
          "member-need-3",
          "Recibir ayuda sin términos técnicos ni listas extensas",
          "high",
        ),
        item(
          "member-need-4",
          "Subir foto, video, audio, PDF, archivo o enlace en el mismo recorrido",
          "high",
        ),
        item(
          "member-need-5",
          "Saber quién revisa su evidencia y cuándo recibirá respuesta",
          "critical",
        ),
        item(
          "member-need-6",
          "Conservar su contexto sin ver datos de otros socios",
          "critical",
        ),
      ],
      skills: [
        item(
          "member-skill-1",
          "Diagnóstico conversacional de fase",
          "critical",
        ),
        item(
          "member-skill-2",
          "Misión guiada de contenido",
          "high",
        ),
        item(
          "member-skill-3",
          "Brief guiado de tienda o catálogo",
          "high",
        ),
        item(
          "member-skill-4",
          "Guion con hook, problema, emoción, beneficio, CTA y tomas",
          "high",
        ),
        item(
          "member-skill-5",
          "Carga de evidencia y solicitud de revisión",
          "critical",
        ),
        item(
          "member-skill-6",
          "Escalamiento simple cuando falta información o autorización",
          "high",
        ),
      ],
      knowledge: [
        item(
          "member-knowledge-1",
          "Recursos y rutas aprobadas para miembros",
          "critical",
        ),
        item(
          "member-knowledge-2",
          "Plantillas de contenido y tienda",
          "high",
        ),
        item(
          "member-knowledge-3",
          "Ejemplos visuales y videos aprobados por el equipo",
          "high",
        ),
        item(
          "member-knowledge-4",
          "Productos, canales y recursos asignados a su propio proyecto",
          "critical",
        ),
      ],
      guardrails: [
        item(
          "member-guardrail-1",
          "Nunca solicitar credenciales ni datos de pago",
          "critical",
        ),
        item(
          "member-guardrail-2",
          "No prometer ventas, ingresos o resultados",
          "critical",
        ),
        item(
          "member-guardrail-3",
          "No mostrar datos de otros miembros",
          "critical",
        ),
        item(
          "member-guardrail-4",
          "No ejecutar ni publicar; entregar borrador para revisión",
          "critical",
        ),
        item(
          "member-guardrail-5",
          "No dar más de tres acciones en una sola misión",
          "high",
        ),
      ],
      permissions: {
        readKnowledge: "allowed",
        proposeChanges: "blocked",
        createDrafts: "allowed",
        externalMessaging: "blocked",
        operatePlatforms: "blocked",
        publishContent: "blocked",
        approveKnowledge: "blocked",
        financialActions: "blocked",
      },
    },
  };
}

function mergeStoredConfig(
  defaults: AgentConfig,
  stored?: Partial<AgentConfig>,
): AgentConfig {
  if (!stored) return defaults;
  const mergeItems = (
    proposed: ConfigItem[],
    fallback: ConfigItem[],
  ): ConfigItem[] => [
    ...proposed,
    ...fallback.filter(
      (defaultItem) =>
        !proposed.some((storedItem) => storedItem.id === defaultItem.id),
    ),
  ];
  return {
    ...defaults,
    ...stored,
    needs: mergeItems(stored.needs ?? [], defaults.needs),
    skills: mergeItems(stored.skills ?? [], defaults.skills),
    knowledge: mergeItems(stored.knowledge ?? [], defaults.knowledge),
    guardrails: mergeItems(stored.guardrails ?? [], defaults.guardrails),
    permissions: { ...defaults.permissions, ...(stored.permissions ?? {}) },
  };
}

function ProfileIcon({
  profile,
  size = 18,
}: {
  profile: CustomProfileKey;
  size?: number;
}) {
  if (profile === "corporate") return <Bot size={size} />;
  if (profile === "team") return <Users size={size} />;
  return <GraduationCap size={size} />;
}

function EditableCollection({
  title,
  caption,
  icon,
  items,
  onAdd,
  onToggle,
  onDelete,
}: {
  title: string;
  caption: string;
  icon: React.ReactNode;
  items: ConfigItem[];
  onAdd: (label: string, priority: Priority) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [priority, setPriority] = useState<Priority>("high");

  const submit = () => {
    const clean = draft.trim();
    if (!clean) return;
    onAdd(clean, priority);
    setDraft("");
  };

  return (
    <section className="agent-collection panel">
      <div className="agent-collection-head">
        <div className="agent-collection-icon">{icon}</div>
        <div>
          <h3>{title}</h3>
          <p>{caption}</p>
        </div>
        <strong>{items.length}</strong>
      </div>
      <div className="agent-item-list">
        {items.map((entry) => (
          <article className={entry.approved ? "approved" : ""} key={entry.id}>
            <button
              className="agent-approval-toggle"
              onClick={() => onToggle(entry.id)}
              aria-label={`${entry.approved ? "Marcar como propuesta" : "Aprobar"} ${entry.label}`}
            >
              {entry.approved && <Check size={12} />}
            </button>
            <div>
              <span>{entry.label}</span>
              <small className={`priority-${entry.priority}`}>
                {priorityLabels[entry.priority]} ·{" "}
                {entry.approved ? "Aprobada" : "Propuesta"}
              </small>
            </div>
            <button
              className="agent-delete-item"
              onClick={() => onDelete(entry.id)}
              aria-label={`Eliminar ${entry.label}`}
            >
              <Trash2 size={14} />
            </button>
          </article>
        ))}
        {items.length === 0 && (
          <div className="agent-empty-list">Agrega el primer elemento.</div>
        )}
      </div>
      <div className="agent-add-row">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder={`Agregar ${title.toLowerCase()}…`}
          aria-label={`Agregar ${title.toLowerCase()}`}
        />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
          aria-label={`Prioridad de ${title.toLowerCase()}`}
        >
          <option value="critical">Crítica</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
        </select>
        <button onClick={submit} aria-label={`Añadir ${title.toLowerCase()}`}>
          <Plus size={16} />
        </button>
      </div>
    </section>
  );
}

export default function AgentCustomization() {
  const [selected, setSelected] =
    useState<CustomProfileKey>("corporate");
  const [configs, setConfigs] = useState<AgentConfigs>(createDefaultConfigs);
  const [hydrated, setHydrated] = useState(false);
  const [scenario, setScenario] = useState("");
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [importMessage, setImportMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AgentConfigs>;
        const defaults = createDefaultConfigs();
        setConfigs({
          corporate: mergeStoredConfig(defaults.corporate, parsed.corporate),
          team: mergeStoredConfig(defaults.team, parsed.team),
          member: mergeStoredConfig(defaults.member, parsed.member),
        });
      }
    } catch {
      // Default profile proposals remain available without local storage.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify(configs));
  }, [configs, hydrated]);

  useEffect(() => {
    setSimulation(null);
    setScenario("");
    setImportMessage("");
  }, [selected]);

  const config = configs[selected];
  const meta = profileMeta[selected];
  const approvedCount = useMemo(
    () =>
      (
        [
          ...config.needs,
          ...config.skills,
          ...config.knowledge,
          ...config.guardrails,
        ] as ConfigItem[]
      ).filter((entry) => entry.approved).length,
    [config],
  );
  const totalCount =
    config.needs.length +
    config.skills.length +
    config.knowledge.length +
    config.guardrails.length;

  const updateConfig = (
    updater: (current: AgentConfig) => AgentConfig,
  ) => {
    setConfigs((current) => ({
      ...current,
      [selected]: updater(current[selected]),
    }));
  };

  const updateText = (
    field: keyof Pick<
      AgentConfig,
      | "publicName"
      | "assignedTo"
      | "maturityLevel"
      | "trainedBy"
      | "trains"
      | "activationChannel"
      | "trainingCadence"
      | "escalationRoute"
      | "mission"
      | "tone"
      | "welcome"
      | "successCriteria"
    >,
    value: string,
  ) => {
    updateConfig((current) => ({ ...current, [field]: value }));
  };

  const addItem = (
    collection: CollectionKey,
    label: string,
    priority: Priority,
  ) => {
    updateConfig((current) => ({
      ...current,
      [collection]: [
        ...current[collection],
        {
          id: `${selected}-${collection}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          label,
          priority,
          approved: false,
        },
      ],
    }));
  };

  const toggleItem = (collection: CollectionKey, id: string) => {
    updateConfig((current) => ({
      ...current,
      [collection]: current[collection].map((entry) =>
        entry.id === id
          ? { ...entry, approved: !entry.approved }
          : entry,
      ),
    }));
  };

  const deleteItem = (collection: CollectionKey, id: string) => {
    updateConfig((current) => ({
      ...current,
      [collection]: current[collection].filter((entry) => entry.id !== id),
    }));
  };

  const updatePermission = (id: string, value: PermissionValue) => {
    if (lockedPermissions[selected].includes(id)) return;
    updateConfig((current) => ({
      ...current,
      permissions: { ...current.permissions, [id]: value },
    }));
  };

  const importMeetingNeeds = () => {
    try {
      const stored = localStorage.getItem("bg-onboarding-planning-v1");
      if (!stored) {
        setImportMessage("No hay una captura de onboarding guardada.");
        return;
      }
      const planning = JSON.parse(stored) as {
        notes?: Record<string, string>;
      };
      const taskId = `${selected}-intake`;
      const note = planning.notes?.[taskId]?.trim();
      if (!note) {
        setImportMessage(
          `No hay notas guardadas para ${profileMeta[selected].label}.`,
        );
        return;
      }
      const imported = note
        .split(/\n+/)
        .map((line) => line.replace(/^[-*•]\s*/, "").trim())
        .filter(Boolean)
        .filter(
          (line) =>
            !config.needs.some(
              (entry) => entry.label.toLowerCase() === line.toLowerCase(),
            ),
        );
      if (imported.length === 0) {
        setImportMessage("Las notas ya están incluidas en las necesidades.");
        return;
      }
      updateConfig((current) => ({
        ...current,
        needs: [
          ...current.needs,
          ...imported.map((label, index) =>
            item(
              `${selected}-imported-${Date.now()}-${index}`,
              label,
              "high",
              false,
            ),
          ),
        ],
      }));
      setImportMessage(
        `${imported.length} ${imported.length === 1 ? "necesidad importada" : "necesidades importadas"} como propuesta.`,
      );
    } catch {
      setImportMessage("No fue posible leer la captura de onboarding.");
    }
  };

  const runSimulation = () => {
    const cleanScenario = scenario.trim();
    if (!cleanScenario) return;
    const approvedSkills = config.skills
      .filter((entry) => entry.approved)
      .map((entry) => entry.label)
      .slice(0, 3);
    const activeGuardrails = config.guardrails
      .filter((entry) => entry.approved)
      .map((entry) => entry.label)
      .slice(0, 3);
    const sensitive =
      /pago|reembolso|contraseña|password|publica|publicar|transferencia|tarjeta/i.test(
        cleanScenario,
      );
    const route =
      selected === "corporate"
        ? [
            "Clasificar hechos, propuestas, supuestos y bloqueos.",
            "Revisar la fuente y el impacto en los tres perfiles.",
            "Proponer máximo tres decisiones para aprobación humana.",
          ]
        : selected === "team"
          ? [
              "Identificar proyecto, miembro, fase y datos faltantes.",
              "Trabajar primero en lectura o borrador y verificar el resultado.",
              "Escalar antes de cualquier acción externa o sensible.",
            ]
          : [
              "Hacer una pregunta para ubicar fase y bloqueo.",
              "Elegir una sola misión con máximo tres acciones.",
              "Pedir evidencia y escalar sin solicitar credenciales.",
            ];
    setSimulation({
      profile: meta.label,
      scenario: cleanScenario,
      route,
      approvedSkills,
      guardrails: activeGuardrails,
      warning: sensitive
        ? "El escenario contiene una acción sensible: debe detenerse y pasar por aprobación humana."
        : undefined,
    });
  };

  const exportConfig = () => {
    const artifact = {
      profile: selected,
      slug: meta.slug,
      status: "proposal",
      exportedAt: new Date().toISOString(),
      notice:
        "Borrador local. Requiere revisión humana antes de aplicar cambios al perfil Hermes.",
      config,
    };
    const blob = new Blob([JSON.stringify(artifact, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${meta.slug}-personalizacion.json`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const resetProfile = () => {
    const defaults = createDefaultConfigs();
    setConfigs((current) => ({
      ...current,
      [selected]: defaults[selected],
    }));
    setSimulation(null);
    setImportMessage("");
  };

  return (
    <>
      <div className="page-heading agent-custom-heading">
        <div>
          <p className="eyebrow">ESTUDIO DE CONFIGURACIÓN · BORRADOR LOCAL</p>
          <h1>Personaliza cada agente sin mezclar sus fronteras.</h1>
          <p className="page-description">
            Captura necesidades, aprueba habilidades, ajusta la experiencia y
            prueba escenarios antes de convertir una propuesta en configuración
            activa.
          </p>
        </div>
        <div className="heading-status ready">
          <span className="status-label">CONFIGURACIÓN SELECCIONADA</span>
          <strong>
            <CircleCheckBig size={16} />
            {approvedCount}/{totalCount} aprobados
          </strong>
          <small>Autoguardado · requiere revisión humana</small>
        </div>
      </div>

      <section
        className="agent-profile-switcher"
        aria-label="Perfil para personalizar"
      >
        {(Object.keys(profileMeta) as CustomProfileKey[]).map((profile) => {
          const profileInfo = profileMeta[profile];
          return (
            <button
              className={`${selected === profile ? "active" : ""} tone-${profileInfo.color}`}
              key={profile}
              onClick={() => setSelected(profile)}
            >
              <span className="agent-profile-icon">
                <ProfileIcon profile={profile} size={20} />
              </span>
              <span>
                <strong>{profileInfo.label}</strong>
                <small>{profileInfo.caption}</small>
              </span>
              <ChevronRight size={16} />
            </button>
          );
        })}
      </section>

      <section className="agent-value-ladder panel">
        <div className="agent-panel-label">
          <span>ESCALERA DE ENTRENAMIENTO · HALLAZGO DE LA TRANSCRIPCIÓN</span>
          <GraduationCap size={17} />
        </div>
        <div className="agent-value-flow">
          <article>
            <span>01 · DEFINE Y APRUEBA</span>
            <strong>Corporativo</strong>
            <p>Método, templates, permisos, versiones y criterios de salida.</p>
          </article>
          <ArrowRight size={18} />
          <article>
            <span>02 · PRUEBA Y ENSEÑA</span>
            <strong>Equipo interno</strong>
            <p>QA, operación, onboarding, soporte y retroalimentación.</p>
          </article>
          <ArrowRight size={18} />
          <article>
            <span>03 · EJECUTA Y EVIDENCIA</span>
            <strong>Miembro / socio</strong>
            <p>Diagnóstico, una misión simple, entregable y evidencia.</p>
          </article>
        </div>
        <div className="agent-feedback-route">
          <Sparkles size={14} />
          La evidencia regresa del socio al equipo; los patrones, defectos y
          necesidades regresan del equipo al corporativo.
        </div>
      </section>

      <section className="agent-training-contract panel">
        <div className="agent-panel-label">
          <span>CONTRATO DE HABILITACIÓN · {meta.label.toUpperCase()}</span>
          <Users size={17} />
        </div>
        <div className="agent-training-grid">
          <label>
            <span>Nivel de madurez</span>
            <input
              value={config.maturityLevel}
              onChange={(event) =>
                updateText("maturityLevel", event.target.value)
              }
            />
          </label>
          <label>
            <span>Aprende de</span>
            <input
              value={config.trainedBy}
              onChange={(event) => updateText("trainedBy", event.target.value)}
            />
          </label>
          <label>
            <span>Entrena a / devuelve a</span>
            <input
              value={config.trains}
              onChange={(event) => updateText("trains", event.target.value)}
            />
          </label>
          <label>
            <span>Canal de activación</span>
            <input
              value={config.activationChannel}
              onChange={(event) =>
                updateText("activationChannel", event.target.value)
              }
            />
          </label>
          <label>
            <span>Cadencia de entrenamiento</span>
            <input
              value={config.trainingCadence}
              onChange={(event) =>
                updateText("trainingCadence", event.target.value)
              }
            />
          </label>
          <label>
            <span>Ruta de escalamiento</span>
            <input
              value={config.escalationRoute}
              onChange={(event) =>
                updateText("escalationRoute", event.target.value)
              }
            />
          </label>
        </div>
      </section>

      <section className="agent-identity-grid">
        <article className="agent-identity-panel panel">
          <div className="agent-panel-label">
            <span>IDENTIDAD Y PROPÓSITO</span>
            <UserRoundCog size={17} />
          </div>
          <div className="agent-form-grid">
            <label>
              <span>Nombre público</span>
              <input
                value={config.publicName}
                onChange={(event) =>
                  updateText("publicName", event.target.value)
                }
              />
            </label>
            <label>
              <span>Persona asignada</span>
              <input
                value={config.assignedTo}
                onChange={(event) =>
                  updateText("assignedTo", event.target.value)
                }
                placeholder="Nombre y rol"
              />
            </label>
            <label className="full">
              <span>Misión del agente</span>
              <textarea
                rows={3}
                value={config.mission}
                onChange={(event) => updateText("mission", event.target.value)}
              />
            </label>
            <label className="full">
              <span>Tono y personalidad</span>
              <input
                value={config.tone}
                onChange={(event) => updateText("tone", event.target.value)}
              />
            </label>
            <label className="full">
              <span>Criterio de éxito</span>
              <textarea
                rows={3}
                value={config.successCriteria}
                onChange={(event) =>
                  updateText("successCriteria", event.target.value)
                }
              />
            </label>
          </div>
        </article>

        <article className={`agent-preview panel profile-${selected}`}>
          <div className="agent-panel-label">
            <span>VISTA PREVIA DE EXPERIENCIA</span>
            <MessageSquareText size={17} />
          </div>
          <div className="agent-preview-persona">
            <div>
              <ProfileIcon profile={selected} size={25} />
            </div>
            <span>
              <strong>{config.publicName || "Agente sin nombre"}</strong>
              <small>{meta.slug}</small>
            </span>
          </div>
          <p className="agent-preview-mission">{config.mission}</p>
          <label>
            <span>MENSAJE DE BIENVENIDA</span>
            <textarea
              rows={5}
              value={config.welcome}
              onChange={(event) => updateText("welcome", event.target.value)}
            />
          </label>
          <div className="agent-preview-footer">
            <span>Tono</span>
            <strong>{config.tone}</strong>
          </div>
        </article>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p>CAPACIDADES DEL PERFIL</p>
            <h2>Necesidades, habilidades y contexto aprobado</h2>
          </div>
          <button className="text-action" onClick={importMeetingNeeds}>
            Importar notas de onboarding
            <ArrowRight size={15} />
          </button>
        </div>
        {importMessage && (
          <div className="agent-import-message">
            <Sparkles size={14} />
            {importMessage}
          </div>
        )}
        <div className="agent-collections-grid">
          <EditableCollection
            title="Necesidades"
            caption="Resultados o problemas que el perfil debe resolver."
            icon={<UserRoundCog size={18} />}
            items={config.needs}
            onAdd={(label, priority) => addItem("needs", label, priority)}
            onToggle={(id) => toggleItem("needs", id)}
            onDelete={(id) => deleteItem("needs", id)}
          />
          <EditableCollection
            title="Habilidades"
            caption="Capacidades candidatas y aprobadas para el agente."
            icon={<BrainCircuit size={18} />}
            items={config.skills}
            onAdd={(label, priority) => addItem("skills", label, priority)}
            onToggle={(id) => toggleItem("skills", id)}
            onDelete={(id) => deleteItem("skills", id)}
          />
          <EditableCollection
            title="Conocimiento"
            caption="Fuentes, métodos y materiales que puede consultar."
            icon={<Library size={18} />}
            items={config.knowledge}
            onAdd={(label, priority) => addItem("knowledge", label, priority)}
            onToggle={(id) => toggleItem("knowledge", id)}
            onDelete={(id) => deleteItem("knowledge", id)}
          />
          <EditableCollection
            title="Guardrails"
            caption="Límites y comportamientos que nunca debe ignorar."
            icon={<ShieldCheck size={18} />}
            items={config.guardrails}
            onAdd={(label, priority) => addItem("guardrails", label, priority)}
            onToggle={(id) => toggleItem("guardrails", id)}
            onDelete={(id) => deleteItem("guardrails", id)}
          />
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p>MATRIZ DE AUTORIDAD</p>
            <h2>Permisos configurables con límites duros</h2>
          </div>
          <span className="meeting-duration">
            <LockKeyhole size={14} />
            Mínimo privilegio
          </span>
        </div>
        <div className="agent-permissions panel">
          {permissionDefinitions.map((permission) => {
            const locked = lockedPermissions[selected].includes(permission.id);
            const value =
              config.permissions[permission.id] ?? ("blocked" as const);
            return (
              <div className="agent-permission-row" key={permission.id}>
                <div className="agent-permission-icon">
                  {locked ? <LockKeyhole size={17} /> : <KeyRound size={17} />}
                </div>
                <div>
                  <strong>{permission.label}</strong>
                  <span>{permission.description}</span>
                </div>
                <select
                  className={`permission-${value}`}
                  value={value}
                  disabled={locked}
                  onChange={(event) =>
                    updatePermission(
                      permission.id,
                      event.target.value as PermissionValue,
                    )
                  }
                  aria-label={`Permiso para ${permission.label}`}
                >
                  <option value="allowed">Permitido</option>
                  <option value="approval">Con aprobación</option>
                  <option value="blocked">Bloqueado</option>
                </select>
                <small>{locked ? "LÍMITE DURO" : permissionLabels[value]}</small>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-block agent-lab-grid">
        <article className="agent-test-lab panel">
          <div className="agent-panel-label">
            <span>LABORATORIO LOCAL DE COHERENCIA</span>
            <FlaskConical size={17} />
          </div>
          <h2>Prueba un escenario antes de activar cambios.</h2>
          <p>
            Este simulador no llama al agente real. Convierte la configuración
            actual en una ruta de comportamiento esperada.
          </p>
          <textarea
            rows={5}
            value={scenario}
            onChange={(event) => setScenario(event.target.value)}
            placeholder="Ejemplo: el miembro pide publicar un video y todavía no aprobó el copy…"
          />
          <button className="primary-action" onClick={runSimulation}>
            Simular comportamiento
            <ArrowRight size={16} />
          </button>
        </article>

        <article className="agent-simulation panel">
          <div className="agent-panel-label">
            <span>RUTA ESPERADA</span>
            <BrainCircuit size={17} />
          </div>
          {!simulation ? (
            <div className="agent-simulation-empty">
              <FlaskConical size={23} />
              <strong>Aún no hay simulación</strong>
              <span>Escribe un escenario y ejecuta la prueba local.</span>
            </div>
          ) : (
            <div className="agent-simulation-result">
              <span className="agent-simulation-profile">
                <ProfileIcon profile={selected} size={15} />
                {simulation.profile}
              </span>
              <p>{simulation.scenario}</p>
              {simulation.warning && (
                <div className="agent-simulation-warning">
                  <LockKeyhole size={15} />
                  {simulation.warning}
                </div>
              )}
              <ol>
                {simulation.route.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="agent-simulation-columns">
                <div>
                  <span>HABILIDADES</span>
                  {simulation.approvedSkills.map((skill) => (
                    <small key={skill}>{skill}</small>
                  ))}
                </div>
                <div>
                  <span>GUARDRAILS</span>
                  {simulation.guardrails.map((guardrail) => (
                    <small key={guardrail}>{guardrail}</small>
                  ))}
                </div>
              </div>
            </div>
          )}
        </article>
      </section>

      <section className="agent-export-strip">
        <div>
          <Download size={20} />
          <span>
            <strong>Exporta una propuesta revisable</strong>
            <small>
              El archivo JSON no modifica el perfil Hermes; documenta el cambio
              para aprobación e implementación.
            </small>
          </span>
        </div>
        <div>
          <button className="secondary-action" onClick={resetProfile}>
            <RefreshCcw size={15} />
            Restaurar perfil
          </button>
          <button className="primary-action" onClick={exportConfig}>
            <Download size={15} />
            Exportar JSON
          </button>
        </div>
      </section>
    </>
  );
}
