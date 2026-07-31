"use client";

import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  Clock3,
  FileCheck2,
  FolderKanban,
  GraduationCap,
  MessageSquareText,
  RefreshCcw,
  UserCheck,
  Users,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AttachmentPicker from "./attachment-picker";
import {
  type AgentWorkflow,
  type MediaMetadata,
  loadMediaMetadata,
  loadWorkflows,
} from "./workflow-data";

type PlanningProfile = "shared" | "corporate" | "team" | "member";
type PlanningStatus = "prepare" | "meeting" | "validate" | "done";

type PlanningTask = {
  id: string;
  profile: PlanningProfile;
  title: string;
  objective: string;
  duration: string;
  owner: string;
  initialStatus: PlanningStatus;
  notePlaceholder: string;
  workflowIds: string[];
  subtasks: string[];
};

type SubtaskDetail = {
  finding: string;
  decision: string;
  owner: string;
  commitment: string;
};

type PlanningState = {
  statuses: Record<string, PlanningStatus>;
  completedSubtasks: string[];
  notes: Record<string, string>;
  subtaskDetails: Record<string, SubtaskDetail>;
  owners: Record<string, string>;
  dueDates: Record<string, string>;
  meetingDate: string;
  facilitator: string;
  decisionOwner: string;
  attendees: string;
  decisions: string;
  blockers: string;
  nextSteps: string;
};

const storageKey = "bg-onboarding-planning-v1";

function todayLocalValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

const profileLabels: Record<PlanningProfile, string> = {
  shared: "Todos",
  corporate: "Corporativo",
  team: "Equipo",
  member: "Miembro",
};

const statusOrder: PlanningStatus[] = [
  "prepare",
  "meeting",
  "validate",
  "done",
];

const statusLabels: Record<
  PlanningStatus,
  { title: string; caption: string }
> = {
  prepare: { title: "Por preparar", caption: "Insumos y responsables" },
  meeting: { title: "En la reunión", caption: "Preguntar y documentar" },
  validate: { title: "Por validar", caption: "Decisiones y dependencias" },
  done: { title: "Cerrado", caption: "Con evidencia y owner" },
};

const agendaBlocks = [
  {
    time: "00–10",
    title: "Apertura",
    profile: "Todos",
    outcome: "Resultado, reglas, alcance y responsables de la captura",
  },
  {
    time: "10–30",
    title: "Diagnóstico corporativo",
    profile: "Gobierno",
    outcome: "Fuentes, autoridad, métricas, costos, riesgos y exclusiones",
  },
  {
    time: "30–50",
    title: "Workflow corporativo",
    profile: "Corporativo → Equipo",
    outcome: "Método, templates, capacitación y aprobación de versiones",
  },
  {
    time: "50–70",
    title: "Operación interna",
    profile: "Equipo",
    outcome: "QA, soporte, permisos, contenido, tienda y escalamiento",
  },
  {
    time: "70–90",
    title: "Experiencia del socio",
    profile: "Equipo → Miembro",
    outcome: "Diagnóstico simple, primera misión y evidencia de valor",
  },
  {
    time: "90–105",
    title: "Escalera de valor",
    profile: "Handoffs",
    outcome: "Entradas, salidas y feedback entre los tres niveles",
  },
  {
    time: "105–115",
    title: "Media y evidencia",
    profile: "Trazabilidad",
    outcome: "Archivos, enlaces, versiones, responsables y aceptación",
  },
  {
    time: "115–120",
    title: "Cierre",
    profile: "Compromisos",
    outcome: "Owners, fechas, bloqueos y siguiente sesión",
  },
];

const planningTasks: PlanningTask[] = [
  {
    id: "meeting-precheck",
    profile: "shared",
    title: "Preparar la sesión y las fuentes",
    objective:
      "Llegar con las personas, workflows y materiales mínimos para tomar decisiones.",
    duration: "Antes",
    owner: "Facilitador",
    initialStatus: "prepare",
    notePlaceholder:
      "Ausencias, materiales pendientes, restricciones, riesgos de la sesión…",
    workflowIds: [
      "corp-knowledge-training",
      "team-qa-training",
      "member-onboarding",
    ],
    subtasks: [
      "Confirmar sponsor, líder operativo, coach y una persona que represente al socio",
      "Nombrar facilitador, responsable de minuta y decisor go/no-go",
      "Compartir agenda de 120 minutos, objetivos y decisiones esperadas",
      "Reunir cursos, videos, plantillas, FAQs, casos y políticas vigentes",
      "Preparar ejemplos de contenido y tienda que sí representan el método",
      "Abrir el Workflow Studio y el Media Hub antes de iniciar",
      "Acordar que no se compartirán credenciales, secretos ni datos innecesarios",
    ],
  },
  {
    id: "meeting-open",
    profile: "shared",
    title: "Alinear resultado y reglas de la reunión",
    objective:
      "Dar contexto común y evitar que la sesión se convierta en una lluvia de soluciones sin responsables.",
    duration: "10 min",
    owner: "Facilitador",
    initialStatus: "meeting",
    notePlaceholder:
      "Objetivo confirmado, criterios de decisión, parking lot y reglas…",
    workflowIds: [],
    subtasks: [
      "Explicar la escalera Corporativo → Equipo → Miembro",
      "Confirmar que cada perfil conserva autoridad, datos y canal independientes",
      "Definir qué debe quedar decidido hoy y qué se llevará a validación",
      "Acordar formato de notas: necesidad, decisión, owner, fecha y evidencia",
      "Crear un parking lot para temas fuera del alcance del piloto",
    ],
  },
  {
    id: "corporate-intake",
    profile: "corporate",
    title: "Capturar necesidades corporativas",
    objective:
      "Definir quién gobierna el piloto, qué conocimiento es oficial y qué significa que funcione.",
    duration: "20 min",
    owner: "Sponsor",
    initialStatus: "meeting",
    notePlaceholder:
      "Autoridad, fuentes, datos, costos, métricas, aprobaciones, exclusiones…",
    workflowIds: ["corp-knowledge-training", "corp-release-governance"],
    subtasks: [
      "Nombrar sponsor, product owner, curador, aprobadores y decisor go/no-go",
      "Definir resultado a 30–45 días y los workflows del MVP",
      "Identificar cursos, videos, documentos, enlaces y templates oficiales",
      "Asignar owner, vigencia y versión a cada fuente de conocimiento",
      "Acordar datos autorizados, retención, visibilidad y trazabilidad",
      "Definir métricas de calidad, adopción, tiempo, costo y primer valor",
      "Documentar exclusiones, afirmaciones comerciales y acciones sensibles",
    ],
  },
  {
    id: "corporate-workflow",
    profile: "corporate",
    title: "Diseñar el workflow que entrena al equipo",
    objective:
      "Convertir la metodología corporativa en un paquete que el equipo pueda probar, operar y enseñar.",
    duration: "20 min",
    owner: "Responsable de metodología",
    initialStatus: "meeting",
    notePlaceholder:
      "Entradas, pasos, templates, aprobaciones, versión, criterio de liberación…",
    workflowIds: ["corp-knowledge-training", "corp-release-governance"],
    subtasks: [
      "Ordenar el método en fases, decisiones, entradas y salidas",
      "Seleccionar templates oficiales de diagnóstico, contenido, tienda y soporte",
      "Definir quién entrena, quién aprende y cómo se demuestra competencia",
      "Agregar checkpoint humano antes de cambios durables o publicación",
      "Diseñar casos de prueba con ejemplos correctos, ambiguos y prohibidos",
      "Definir la evidencia necesaria para aprobar una nueva versión",
      "Acordar cómo se comunica, revierte y audita cada release",
    ],
  },
  {
    id: "team-intake",
    profile: "team",
    title: "Capturar necesidades del equipo interno",
    objective:
      "Aterrizar la operación diaria, QA, permisos, canales y soporte al socio.",
    duration: "20 min",
    owner: "Líder operativo",
    initialStatus: "meeting",
    notePlaceholder:
      "Roles, turnos, plataformas, proyectos visibles, defectos, SLA y escalamiento…",
    workflowIds: [
      "team-qa-training",
      "team-content-production",
      "team-store-setup",
    ],
    subtasks: [
      "Registrar rol, horario, canal, experiencia y capacidad de cada operador",
      "Separar permisos de lectura, borrador, aprobación, escritura y publicación",
      "Definir miembros, proyectos y colas visibles por responsable",
      "Priorizar contenido, tienda/catálogo y soporte como workflows iniciales",
      "Documentar QA funcional, de límites, tono, fuentes y seguridad",
      "Nombrar contactos de escalamiento y tiempos por severidad",
      "Acordar reporte de defectos, necesidades nuevas y evidencia al corporativo",
    ],
  },
  {
    id: "team-workflow",
    profile: "team",
    title: "Diseñar el workflow que entrena al socio",
    objective:
      "Traducir el método aprobado en onboarding, acompañamiento y misiones simples.",
    duration: "20 min",
    owner: "Coach / operador",
    initialStatus: "meeting",
    notePlaceholder:
      "Onboarding, guías, videos, ejercicios, revisión y criterios de avance…",
    workflowIds: [
      "team-qa-training",
      "team-content-production",
      "team-store-setup",
      "member-onboarding",
    ],
    subtasks: [
      "Crear onboarding escrito, sesión en vivo y video corto de referencia",
      "Probar el recorrido como un socio que empieza desde cero",
      "Definir pregunta diagnóstica, fase, bloqueo y siguiente paso correcto",
      "Elegir una misión de contenido o tienda según el punto de partida",
      "Limitar la respuesta del agente a un máximo de tres acciones",
      "Definir cómo revisar evidencia y dar retroalimentación accionable",
      "Escalar al corporativo patrones, vacíos de método y cambios propuestos",
    ],
  },
  {
    id: "member-intake",
    profile: "member",
    title: "Capturar necesidades del miembro",
    objective:
      "Entender su punto de partida, bloqueo y capacidad para asignar una misión útil.",
    duration: "20 min",
    owner: "Coach",
    initialStatus: "meeting",
    notePlaceholder:
      "Experiencia, producto, proveedor, canal, bloqueo, objetivo, tiempo y evidencia posible…",
    workflowIds: [
      "member-onboarding",
      "member-content-mission",
      "member-store-mission",
    ],
    subtasks: [
      "Confirmar si ya vendió en internet y si tiene producto, idea o proveedor",
      "Registrar dónde vende o quiere vender y qué herramientas conoce",
      "Identificar su mayor bloqueo y objetivo para los próximos 30 días",
      "Confirmar tiempo disponible, canal y nivel de acompañamiento",
      "Elegir contenido o tienda/catálogo como primera misión",
      "Acordar qué archivo, captura, enlace o resultado demostrará primer valor",
      "Confirmar ruta de soporte sin pedir credenciales ni exponer complejidad técnica",
    ],
  },
  {
    id: "member-mission",
    profile: "member",
    title: "Definir la primera misión guiada",
    objective:
      "Salir con un recorrido corto, evidencia clara y ayuda disponible.",
    duration: "15 min",
    owner: "Coach + miembro",
    initialStatus: "validate",
    notePlaceholder:
      "Misión, entrada mínima, tres acciones, entregable, revisión y escalamiento…",
    workflowIds: ["member-content-mission", "member-store-mission"],
    subtasks: [
      "Elegir una sola misión alineada a la fase y al bloqueo",
      "Definir la entrada mínima: foto, ficha, video, enlace o formulario",
      "Describir máximo tres acciones sin jerga técnica",
      "Definir un entregable utilizable en menos de 30 minutos",
      "Indicar quién revisa la evidencia y en cuánto tiempo",
      "Definir alternativa si el socio se bloquea o no tiene el insumo",
    ],
  },
  {
    id: "value-ladder-handoffs",
    profile: "shared",
    title: "Cerrar la escalera de entrenamiento",
    objective:
      "Hacer explícito qué entrega cada nivel, qué aprende el siguiente y cómo regresa la evidencia.",
    duration: "15 min",
    owner: "Sponsor + líder operativo",
    initialStatus: "validate",
    notePlaceholder:
      "Corporate → Team, Team → Member, evidencia → Team y patrones → Corporate…",
    workflowIds: [
      "corp-knowledge-training",
      "team-qa-training",
      "member-onboarding",
    ],
    subtasks: [
      "Definir paquete que Corporate entrega a Team y su versión",
      "Definir práctica y evidencia que habilita al Team",
      "Definir paquete que Team entrega al Member",
      "Definir evidencia que el Member devuelve al Team",
      "Definir patrones y defectos que Team devuelve a Corporate",
      "Asignar owner y SLA a cada handoff",
      "Acordar criterio para avanzar, repetir entrenamiento o escalar",
    ],
  },
  {
    id: "media-evidence-map",
    profile: "shared",
    title: "Mapear archivos, medios y evidencias",
    objective:
      "Vincular cada fuente y resultado con el workflow, tarea, perfil y responsable correctos.",
    duration: "10 min",
    owner: "Curador + minuta",
    initialStatus: "validate",
    notePlaceholder:
      "Medio, categoría, workflow, tarea, owner, versión, vigencia y acceso…",
    workflowIds: [
      "corp-knowledge-training",
      "team-content-production",
      "team-store-setup",
      "member-content-mission",
    ],
    subtasks: [
      "Clasificar cada medio como fuente, plantilla, ejemplo, capacitación o evidencia",
      "Vincularlo a perfil, workflow y tarea de planeación",
      "Definir owner, versión, vigencia y nivel de acceso",
      "Usar enlace para archivos pesados y registrar dónde se hospeda",
      "Confirmar soporte para imagen, video, audio, PDF, Office y enlaces",
      "Definir nomenclatura y criterio de aceptación de evidencias",
    ],
  },
  {
    id: "meeting-close",
    profile: "shared",
    title: "Cerrar con compromisos verificables",
    objective:
      "Salir con tareas que tengan responsable, fecha, evidencia y workflow afectado.",
    duration: "5 min",
    owner: "Responsable de minuta",
    initialStatus: "validate",
    notePlaceholder:
      "Acuerdos, responsables, fechas, evidencia, versión y próxima revisión…",
    workflowIds: ["corp-release-governance"],
    subtasks: [
      "Leer decisiones y preguntas abiertas",
      "Asignar owner y fecha a cada tarjeta",
      "Confirmar workflow y evidencia de aceptación",
      "Definir fecha de setup, capacitación y primera misión",
      "Enviar minuta, tablero y enlaces el mismo día",
    ],
  },
];

function createInitialState(): PlanningState {
  return {
    statuses: Object.fromEntries(
      planningTasks.map((task) => [task.id, task.initialStatus]),
    ),
    completedSubtasks: [],
    notes: {},
    subtaskDetails: {},
    owners: Object.fromEntries(planningTasks.map((task) => [task.id, task.owner])),
    dueDates: {},
    meetingDate: todayLocalValue(),
    facilitator: "",
    decisionOwner: "",
    attendees: "",
    decisions: "",
    blockers: "",
    nextSteps: "",
  };
}

function ProfileMark({ profile }: { profile: PlanningProfile }) {
  if (profile === "corporate") return <Bot size={15} />;
  if (profile === "team") return <Users size={15} />;
  if (profile === "member") return <GraduationCap size={15} />;
  return <FolderKanban size={15} />;
}

export default function MeetingPlanning() {
  const [planning, setPlanning] = useState<PlanningState>(createInitialState);
  const [hydrated, setHydrated] = useState(false);
  const [media, setMedia] = useState<MediaMetadata[]>([]);
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>([]);
  const [expandedSubtaskId, setExpandedSubtaskId] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PlanningState>;
        const initial = createInitialState();
        setPlanning({
          ...initial,
          ...parsed,
          statuses: { ...initial.statuses, ...(parsed.statuses ?? {}) },
          notes: { ...initial.notes, ...(parsed.notes ?? {}) },
          subtaskDetails: {
            ...initial.subtaskDetails,
            ...(parsed.subtaskDetails ?? {}),
          },
          owners: { ...initial.owners, ...(parsed.owners ?? {}) },
          dueDates: { ...initial.dueDates, ...(parsed.dueDates ?? {}) },
          completedSubtasks: parsed.completedSubtasks ?? [],
          meetingDate: parsed.meetingDate || initial.meetingDate,
        });
      }
    } catch {
      // The meeting template remains usable if local storage is unavailable.
    }
    const refreshMedia = () => setMedia(loadMediaMetadata());
    const refreshWorkflows = () => setWorkflows(loadWorkflows());
    refreshMedia();
    refreshWorkflows();
    window.addEventListener("bg-media-updated", refreshMedia);
    window.addEventListener("bg-workflows-updated", refreshWorkflows);
    setHydrated(true);
    return () => {
      window.removeEventListener("bg-media-updated", refreshMedia);
      window.removeEventListener("bg-workflows-updated", refreshWorkflows);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify(planning));
  }, [hydrated, planning]);

  const allSubtasks = useMemo(
    () =>
      planningTasks.flatMap((task) =>
        task.subtasks.map((_, index) => `${task.id}:${index}`),
      ),
    [],
  );
  const completedCount = allSubtasks.filter((id) =>
    planning.completedSubtasks.includes(id),
  ).length;
  const progress = Math.round((completedCount / allSubtasks.length) * 100);
  const closedCards = planningTasks.filter(
    (task) => planning.statuses[task.id] === "done",
  ).length;
  const capturedSubtasks = Object.values(planning.subtaskDetails).filter(
    (detail) =>
      detail.finding.trim() ||
      detail.decision.trim() ||
      detail.owner.trim() ||
      detail.commitment.trim(),
  ).length;
  const subtaskEvidenceCount = media.filter(
    (item) => (item.linkedSubtaskIds?.length ?? 0) > 0,
  ).length;

  const updateField = (
    field: keyof Pick<
      PlanningState,
      | "meetingDate"
      | "facilitator"
      | "decisionOwner"
      | "attendees"
      | "decisions"
      | "blockers"
      | "nextSteps"
    >,
    value: string,
  ) => setPlanning((current) => ({ ...current, [field]: value }));

  const toggleSubtask = (taskId: string, index: number) => {
    const subtaskId = `${taskId}:${index}`;
    setPlanning((current) => ({
      ...current,
      completedSubtasks: current.completedSubtasks.includes(subtaskId)
        ? current.completedSubtasks.filter((id) => id !== subtaskId)
        : [...current.completedSubtasks, subtaskId],
    }));
  };

  const toggleSubtaskCapture = (task: PlanningTask, subtaskId: string) => {
    if (!planning.subtaskDetails[subtaskId]) {
      setPlanning((current) => ({
        ...current,
        subtaskDetails: {
          ...current.subtaskDetails,
          [subtaskId]: {
            finding: "",
            decision: "",
            owner: current.owners[task.id] ?? task.owner,
            commitment: "",
          },
        },
      }));
    }
    setExpandedSubtaskId((current) =>
      current === subtaskId ? "" : subtaskId,
    );
  };

  const updateSubtaskDetail = (
    subtaskId: string,
    field: keyof SubtaskDetail,
    value: string,
  ) => {
    setPlanning((current) => {
      const existing = current.subtaskDetails[subtaskId] ?? {
          finding: "",
          decision: "",
          owner: "",
          commitment: "",
      };
      return {
        ...current,
        subtaskDetails: {
          ...current.subtaskDetails,
          [subtaskId]: {
            ...existing,
          [field]: value,
          },
        },
      };
    });
  };

  const moveTask = (taskId: string, direction: -1 | 1) => {
    setPlanning((current) => {
      const currentStatus = current.statuses[taskId] ?? "prepare";
      const nextIndex = Math.min(
        statusOrder.length - 1,
        Math.max(0, statusOrder.indexOf(currentStatus) + direction),
      );
      return {
        ...current,
        statuses: {
          ...current.statuses,
          [taskId]: statusOrder[nextIndex],
        },
      };
    });
  };

  const resetPlanning = () => setPlanning(createInitialState());

  return (
    <>
      <div className="page-heading planning-heading">
        <div>
          <p className="eyebrow">REUNIÓN DE ONBOARDING · 120 MINUTOS</p>
          <h1>Una reunión, tres mapas y una escalera de valor.</h1>
          <p className="page-description">
            Captura necesidades, responsables, fechas y evidencia mientras
            diseñas cómo Corporativo entrena al Equipo y el Equipo habilita al
            Miembro.
          </p>
        </div>
        <div className="heading-status ready">
          <span className="status-label">AVANCE DE CAPTURA</span>
          <strong>
            <CircleCheckBig size={16} />
            {completedCount}/{allSubtasks.length} puntos
          </strong>
          <small>
            {closedCards}/{planningTasks.length} tarjetas · {progress}% del guion
          </small>
        </div>
      </div>

      <section className="meeting-command panel">
        <div className="meeting-command-heading">
          <div>
            <span>FICHA DE LA SESIÓN</span>
            <h2>Datos para abrir la reunión</h2>
          </div>
          <button className="secondary-action" onClick={resetPlanning}>
            <RefreshCcw size={15} />
            Restablecer tablero
          </button>
        </div>
        <div className="meeting-meta-grid">
          <label>
            <span>Fecha</span>
            <input
              type="date"
              value={planning.meetingDate}
              onChange={(event) => updateField("meetingDate", event.target.value)}
            />
          </label>
          <label>
            <span>Facilitador</span>
            <input
              value={planning.facilitator}
              onChange={(event) => updateField("facilitator", event.target.value)}
              placeholder="Nombre"
            />
          </label>
          <label>
            <span>Decisor final</span>
            <input
              value={planning.decisionOwner}
              onChange={(event) =>
                updateField("decisionOwner", event.target.value)
              }
              placeholder="Nombre y rol"
            />
          </label>
          <label>
            <span>Participantes</span>
            <input
              value={planning.attendees}
              onChange={(event) => updateField("attendees", event.target.value)}
              placeholder="Corporate, Team y Member"
            />
          </label>
        </div>
      </section>

      <section className="meeting-live-panel panel">
        <div className="meeting-live-head">
          <div>
            <span className="meeting-live-dot" />
            <span>
              <strong>MODO REUNIÓN EN VIVO · HOY</strong>
              <small>
                Abre cada subtarea y registra la respuesta antes de marcarla
                como completada.
              </small>
            </span>
          </div>
          <div className="meeting-live-date">
            <CalendarDays size={15} />
            {planning.meetingDate || todayLocalValue()}
          </div>
        </div>
        <div className="meeting-live-stats">
          <div>
            <strong>{allSubtasks.length}</strong>
            <span>preguntas guía</span>
          </div>
          <div>
            <strong>{capturedSubtasks}</strong>
            <span>con información</span>
          </div>
          <div>
            <strong>{completedCount}</strong>
            <span>confirmadas</span>
          </div>
          <div>
            <strong>{subtaskEvidenceCount}</strong>
            <span>con evidencia</span>
          </div>
        </div>
        <div className="meeting-live-instructions">
          <span>
            <MessageSquareText size={14} />
            1. Captura respuesta o necesidad
          </span>
          <span>
            <UserCheck size={14} />
            2. Define acuerdo y responsable
          </span>
          <span>
            <FileCheck2 size={14} />
            3. Adjunta evidencia y confirma
          </span>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p>CRONOGRAMA FACILITADO</p>
            <h2>Ocho bloques, un resultado por bloque</h2>
          </div>
          <span className="meeting-duration">
            <Clock3 size={14} />
            120 min
          </span>
        </div>
        <div className="meeting-agenda">
          {agendaBlocks.map((block, index) => (
            <article className="agenda-block" key={block.time}>
              <div className="agenda-time">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{block.time} min</strong>
              </div>
              <small>{block.profile}</small>
              <h3>{block.title}</h3>
              <p>{block.outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p>KANBAN DE NECESIDADES</p>
            <h2>Responsable, fecha, evidencia y workflow en cada tarjeta</h2>
          </div>
          <span className="meeting-duration">
            <FolderKanban size={14} />
            Autoguardado local
          </span>
        </div>

        <div className="planning-board">
          {statusOrder.map((status) => {
            const cards = planningTasks.filter(
              (task) => planning.statuses[task.id] === status,
            );
            return (
              <section className={`planning-column status-${status}`} key={status}>
                <div className="planning-column-head">
                  <div>
                    <span>{statusLabels[status].title}</span>
                    <small>{statusLabels[status].caption}</small>
                  </div>
                  <strong>{cards.length}</strong>
                </div>
                <div className="planning-card-list">
                  {cards.length === 0 && (
                    <div className="planning-empty">
                      <Check size={16} />
                      Sin tarjetas
                    </div>
                  )}
                  {cards.map((task) => {
                    const taskCompleted = task.subtasks.filter((_, index) =>
                      planning.completedSubtasks.includes(`${task.id}:${index}`),
                    ).length;
                    const currentStatusIndex = statusOrder.indexOf(status);
                    const taskMedia = media.filter((item) =>
                      item.linkedTaskIds.includes(task.id),
                    );
                    const taskWorkflows = workflows.filter((workflow) =>
                      task.workflowIds.includes(workflow.id),
                    );
                    return (
                      <article
                        className={`planning-card profile-${task.profile}`}
                        key={task.id}
                      >
                        <div className="planning-card-meta">
                          <span className="planning-profile">
                            <ProfileMark profile={task.profile} />
                            {profileLabels[task.profile]}
                          </span>
                          <span>{task.duration}</span>
                        </div>
                        <h3>{task.title}</h3>
                        <p>{task.objective}</p>
                        <div className="planning-owner-fields">
                          <label>
                            <span>RESPONSABLE</span>
                            <input
                              value={planning.owners[task.id] ?? ""}
                              onChange={(event) =>
                                setPlanning((current) => ({
                                  ...current,
                                  owners: {
                                    ...current.owners,
                                    [task.id]: event.target.value,
                                  },
                                }))
                              }
                              placeholder="Nombre y rol"
                            />
                          </label>
                          <label>
                            <span>FECHA</span>
                            <input
                              type="date"
                              value={planning.dueDates[task.id] ?? ""}
                              onChange={(event) =>
                                setPlanning((current) => ({
                                  ...current,
                                  dueDates: {
                                    ...current.dueDates,
                                    [task.id]: event.target.value,
                                  },
                                }))
                              }
                            />
                          </label>
                        </div>
                        {taskWorkflows.length > 0 && (
                          <div className="planning-linked-workflows">
                            <span>
                              <Workflow size={13} />
                              WORKFLOWS VINCULADOS
                            </span>
                            <div>
                              {taskWorkflows.map((workflow) => (
                                <small key={workflow.id}>{workflow.title}</small>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="planning-subtasks">
                          <div className="planning-subtasks-head">
                            <span>SUBTAREAS</span>
                            <strong>
                              {taskCompleted}/{task.subtasks.length}
                            </strong>
                          </div>
                          {task.subtasks.map((subtask, index) => {
                            const subtaskId = `${task.id}:${index}`;
                            const checked =
                              planning.completedSubtasks.includes(subtaskId);
                            const detail =
                              planning.subtaskDetails[subtaskId] ?? {
                                finding: "",
                                decision: "",
                                owner: "",
                                commitment: "",
                              };
                            const hasCapture = Boolean(
                              detail.finding.trim() ||
                                detail.decision.trim() ||
                                detail.owner.trim() ||
                                detail.commitment.trim(),
                            );
                            const isExpanded =
                              expandedSubtaskId === subtaskId;
                            const subtaskMedia = media.filter((item) =>
                              (item.linkedSubtaskIds ?? []).includes(
                                subtaskId,
                              ),
                            );
                            return (
                              <div
                                className={`planning-subtask-row ${checked ? "completed" : ""} ${isExpanded ? "expanded" : ""}`}
                                key={subtaskId}
                              >
                                <div className="planning-subtask-line">
                                  <label className="planning-subtask-main">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() =>
                                        toggleSubtask(task.id, index)
                                      }
                                    />
                                    <span className="planning-check">
                                      {checked && <Check size={12} />}
                                    </span>
                                    <span>{subtask}</span>
                                  </label>
                                  <button
                                    className="planning-subtask-detail-toggle"
                                    onClick={() =>
                                      toggleSubtaskCapture(task, subtaskId)
                                    }
                                    aria-label={`${isExpanded ? "Cerrar" : "Capturar"} información de ${subtask}`}
                                  >
                                    {hasCapture && <span>CAPTURA</span>}
                                    {isExpanded ? (
                                      <ChevronUp size={14} />
                                    ) : (
                                      <ChevronDown size={14} />
                                    )}
                                  </button>
                                </div>
                                {isExpanded && (
                                  <div className="subtask-capture">
                                    <div className="subtask-capture-title">
                                      <MessageSquareText size={14} />
                                      <span>
                                        <strong>Ficha de la subtarea</strong>
                                        <small>
                                          Registra lo dicho en la reunión, no
                                          una interpretación posterior.
                                        </small>
                                      </span>
                                    </div>
                                    <label>
                                      <span>RESPUESTA / NECESIDAD</span>
                                      <textarea
                                        rows={3}
                                        value={detail.finding}
                                        onChange={(event) =>
                                          updateSubtaskDetail(
                                            subtaskId,
                                            "finding",
                                            event.target.value,
                                          )
                                        }
                                        placeholder="Qué necesita, cómo lo hace hoy, bloqueo y resultado esperado…"
                                      />
                                    </label>
                                    <label>
                                      <span>ACUERDO / DECISIÓN</span>
                                      <textarea
                                        rows={3}
                                        value={detail.decision}
                                        onChange={(event) =>
                                          updateSubtaskDetail(
                                            subtaskId,
                                            "decision",
                                            event.target.value,
                                          )
                                        }
                                        placeholder="Qué se decidió, qué queda pendiente y criterio de aceptación…"
                                      />
                                    </label>
                                    <div className="subtask-capture-grid">
                                      <label>
                                        <span>RESPONSABLE</span>
                                        <input
                                          value={detail.owner}
                                          onChange={(event) =>
                                            updateSubtaskDetail(
                                              subtaskId,
                                              "owner",
                                              event.target.value,
                                            )
                                          }
                                          placeholder="Nombre y rol"
                                        />
                                      </label>
                                      <label>
                                        <span>COMPROMISO</span>
                                        <input
                                          type="datetime-local"
                                          value={detail.commitment}
                                          onChange={(event) =>
                                            updateSubtaskDetail(
                                              subtaskId,
                                              "commitment",
                                              event.target.value,
                                            )
                                          }
                                        />
                                      </label>
                                    </div>
                                    <AttachmentPicker
                                      profile={task.profile}
                                      media={media}
                                      linkedWorkflowIds={task.workflowIds}
                                      linkedTaskIds={[task.id]}
                                      linkedSubtaskIds={[subtaskId]}
                                      attachedIds={subtaskMedia.map(
                                        (item) => item.id,
                                      )}
                                      onRefresh={() =>
                                        setMedia(loadMediaMetadata())
                                      }
                                    />
                                    {subtaskMedia.length > 0 && (
                                      <div className="subtask-evidence-list">
                                        {subtaskMedia.map((item) => (
                                          <small key={item.id}>
                                            <FileCheck2 size={11} />
                                            {item.name}
                                          </small>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <label className="planning-notes">
                          <span>NOTAS Y NECESIDADES</span>
                          <textarea
                            value={planning.notes[task.id] ?? ""}
                            onChange={(event) =>
                              setPlanning((current) => ({
                                ...current,
                                notes: {
                                  ...current.notes,
                                  [task.id]: event.target.value,
                                },
                              }))
                            }
                            placeholder={task.notePlaceholder}
                            rows={4}
                          />
                        </label>
                        <div className="planning-evidence">
                          <div className="planning-evidence-head">
                            <span>
                              <FileCheck2 size={13} />
                              EVIDENCIA
                            </span>
                          </div>
                          <AttachmentPicker
                            profile={task.profile}
                            media={media}
                            linkedWorkflowIds={task.workflowIds}
                            linkedTaskIds={[task.id]}
                            onRefresh={() => setMedia(loadMediaMetadata())}
                          />
                          {taskMedia.length > 0 ? (
                            <div className="planning-evidence-list">
                              {taskMedia.map((item) => (
                                <small key={item.id}>
                                  <FileCheck2 size={12} />
                                  {item.name}
                                </small>
                              ))}
                            </div>
                          ) : (
                            <p>Sin evidencia vinculada.</p>
                          )}
                        </div>
                        <div className="planning-card-actions">
                          <button
                            onClick={() => moveTask(task.id, -1)}
                            disabled={currentStatusIndex === 0}
                            aria-label={`Mover ${task.title} hacia atrás`}
                          >
                            <ArrowLeft size={14} />
                          </button>
                          <span>{statusLabels[status].title}</span>
                          <button
                            onClick={() => moveTask(task.id, 1)}
                            disabled={
                              currentStatusIndex === statusOrder.length - 1
                            }
                            aria-label={`Mover ${task.title} hacia adelante`}
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p>MINUTA DE CIERRE</p>
            <h2>Lo que debe quedar explícito antes de terminar</h2>
          </div>
          <span className="meeting-duration">
            <CalendarDays size={14} />
            Mismo día
          </span>
        </div>
        <div className="meeting-close-grid">
          <label className="panel">
            <span>DECISIONES TOMADAS</span>
            <textarea
              rows={7}
              value={planning.decisions}
              onChange={(event) => updateField("decisions", event.target.value)}
              placeholder="Decisión · responsable · fecha · evidencia…"
            />
          </label>
          <label className="panel">
            <span>BLOQUEOS Y PREGUNTAS</span>
            <textarea
              rows={7}
              value={planning.blockers}
              onChange={(event) => updateField("blockers", event.target.value)}
              placeholder="Pregunta · impacto · quién debe resolverla · fecha límite…"
            />
          </label>
          <label className="panel">
            <span>PRÓXIMAS ACCIONES</span>
            <textarea
              rows={7}
              value={planning.nextSteps}
              onChange={(event) => updateField("nextSteps", event.target.value)}
              placeholder="Tarea · owner · fecha · workflow · criterio de aceptación…"
            />
          </label>
        </div>
      </section>
    </>
  );
}
