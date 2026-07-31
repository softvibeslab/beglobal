"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  BrainCircuit,
  BookOpenCheck,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheckBig,
  CircleDot,
  ClipboardCheck,
  Clock3,
  FileCode2,
  FileCheck2,
  FolderKanban,
  Gauge,
  GraduationCap,
  HardDrive,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  Menu,
  Network,
  PanelLeftClose,
  PlayCircle,
  Printer,
  RefreshCcw,
  Route,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  UserCheck,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AgentCustomization from "./agent-customization";
import MeetingPlanning from "./meeting-planning";
import WorkflowStudio from "./workflow-studio";

type View =
  | "resumen"
  | "perfiles"
  | "onboarding"
  | "planeacion"
  | "workflows"
  | "mediahub"
  | "personalizacion"
  | "ejecucion"
  | "metricas"
  | "riesgos";
type ProfileKey = "corporate" | "team" | "member";
type Task = {
  id: string;
  title: string;
  owner: string;
  horizon: "24 h" | "48 h" | "72 h";
  note: string;
  blocked?: boolean;
};

const tasks: Task[] = [
  {
    id: "payment",
    title: "Confirmar recepción del pago del piloto",
    owner: "Chris",
    horizon: "24 h",
    note: "Adjuntar comprobante o confirmación escrita.",
    blocked: true,
  },
  {
    id: "participants",
    title: "Nombrar a los tres participantes",
    owner: "Allan",
    horizon: "24 h",
    note: "Corporativo, equipo interno y miembro piloto.",
    blocked: true,
  },
  {
    id: "onboarding",
    title: "Enviar formulario seguro de onboarding",
    owner: "José",
    horizon: "24 h",
    note: "Incluir materiales, accesos y tratamiento de datos.",
  },
  {
    id: "kickoff",
    title: "Realizar kickoff de 60 minutos",
    owner: "Chris",
    horizon: "48 h",
    note: "Cerrar alcance, responsables y calendario.",
    blocked: true,
  },
  {
    id: "profiles",
    title: "Definir perfiles, permisos y criterios de éxito",
    owner: "Allan",
    horizon: "48 h",
    note: "Tres perfiles aislados ya están documentados y validados.",
  },
  {
    id: "channel",
    title: "Elegir canal inicial y tablero del piloto",
    owner: "Allan",
    horizon: "48 h",
    note: "Telegram es la recomendación de partida.",
    blocked: true,
  },
  {
    id: "corporate-agent",
    title: "Entregar los tres perfiles Hermes",
    owner: "José",
    horizon: "72 h",
    note: "Corporate, Team y Member: 63 archivos declarativos.",
  },
  {
    id: "qa-five",
    title: "Ejecutar cinco escenarios de prueba",
    owner: "José",
    horizon: "72 h",
    note: "Registrar respuesta esperada y resultado real.",
  },
  {
    id: "register",
    title: "Iniciar registro de decisiones y consumo",
    owner: "José",
    horizon: "72 h",
    note: "Sesiones, defectos, tokens, costo y soporte.",
  },
];

const phases = [
  {
    index: "00",
    name: "Cierre",
    range: "0–48 h",
    state: "active",
    caption: "Alcance y evidencia",
  },
  {
    index: "01",
    name: "Diseño",
    range: "Días 1–5",
    state: "next",
    caption: "Entrenamiento corporativo",
  },
  {
    index: "02",
    name: "QA interno",
    range: "Días 6–10",
    state: "future",
    caption: "Prueba y corrección",
  },
  {
    index: "03",
    name: "Activación",
    range: "Días 11–14",
    state: "future",
    caption: "Miembros piloto",
  },
  {
    index: "04",
    name: "Validación",
    range: "Días 15–45",
    state: "future",
    caption: "Go / no-go",
  },
];

const metrics = [
  {
    label: "Activación",
    target: "≥ 2 de 3",
    current: "Sin datos",
    unit: "participantes",
    icon: UserCheck,
  },
  {
    label: "Tiempo a valor",
    target: "< 30 min",
    current: "Sin línea base",
    unit: "después del onboarding",
    icon: Clock3,
  },
  {
    label: "Diagnóstico",
    target: "≥ 80%",
    current: "Sin pruebas",
    unit: "exactitud",
    icon: Target,
  },
  {
    label: "Calidad de contenido",
    target: "≥ 4/5",
    current: "Sin evaluación",
    unit: "calificación del equipo",
    icon: Sparkles,
  },
  {
    label: "Satisfacción",
    target: "≥ 8/10",
    current: "Sin respuestas",
    unit: "miembros activos",
    icon: Gauge,
  },
];

const blockers = [
  {
    id: "B-01",
    title: "Pago del piloto",
    question: "¿Los $7,500 MXN fueron recibidos?",
    owner: "Chris",
    severity: "Crítico",
  },
  {
    id: "B-02",
    title: "Participantes",
    question: "¿Quién ocupa cada uno de los tres perfiles?",
    owner: "Allan",
    severity: "Crítico",
  },
  {
    id: "B-03",
    title: "Modelo de acceso",
    question: "¿Son tres agentes o una solución con tres roles?",
    owner: "Allan + José",
    severity: "Crítico",
  },
  {
    id: "B-04",
    title: "Canal inicial",
    question: "¿Telegram queda aprobado para el piloto?",
    owner: "Allan",
    severity: "Alto",
  },
  {
    id: "B-05",
    title: "Dos misiones MVP",
    question: "¿Contenido y tienda/catálogo quedan confirmados?",
    owner: "Allan",
    severity: "Alto",
  },
  {
    id: "B-06",
    title: "Aprobación de dominio",
    question: "¿Quién valida metodología y resultados?",
    owner: "Allan",
    severity: "Alto",
  },
  {
    id: "B-07",
    title: "Uso de datos",
    question: "¿Qué datos se autorizan y por cuánto tiempo?",
    owner: "Allan + José",
    severity: "Crítico",
  },
];

const risks = [
  {
    label: "Vender antes de validar",
    level: "Alto",
    action: "No abrir promoción masiva antes de criterios mínimos.",
  },
  {
    label: "Alcance infinito",
    level: "Alto",
    action: "Limitar el MVP a contenido y tienda/catálogo.",
  },
  {
    label: "Costos de consumo",
    level: "Alto",
    action: "Medir tokens, video y soporte por usuario.",
  },
  {
    label: "Datos y accesos",
    level: "Crítico",
    action: "Mínimo privilegio; no compartir contraseñas por chat.",
  },
  {
    label: "Baja madurez digital",
    level: "Medio",
    action: "Onboarding simple y misiones concretas.",
  },
  {
    label: "Promesas no verificadas",
    level: "Alto",
    action: "Etiquetar demos como pruebas y medir aceptación.",
  },
];

const profiles = [
  {
    key: "corporate" as ProfileKey,
    short: "01",
    role: "Corporativo",
    slug: "beglobal-corporate",
    person: "Allan o responsable",
    purpose: "Entrenar y gobernar",
    access: "Método, permisos, calidad, configuración y métricas.",
    publicName: "Be Global Corporate",
    duration: "60–90 min",
    skill: "beglobal-corporate-governance",
    mindset: [
      "Evidencia antes de entusiasmo",
      "Gobierno sin microgestión",
      "Cada acceso es explícito",
      "La IA propone; el humano aprueba",
    ],
    capabilities: [
      "Curaduría de metodología",
      "Registro de decisiones",
      "Reporting y unit economics",
      "Gobierno de permisos",
      "Go / extend / reduce / stop",
    ],
    toolsets: ["file", "memory", "session_search", "skills", "todo", "web"],
    forbidden: [
      "Credenciales de miembros",
      "Operar tiendas o marketplaces",
      "Pagos, reembolsos o conflictos",
      "Cambios durables sin aprobación",
    ],
    onboarding: [
      "Precheck de sponsor, producto y datos",
      "Intake de autoridad, objetivo y método",
      "Setup de modelo, chat y gobierno",
      "Primera misión de cambio controlado",
      "Aceptación ejecutiva y de seguridad",
    ],
    firstMission: "Aprobar un cambio de conocimiento con fuente, impacto y reversión.",
    acceptance: [
      "Cita fuentes internas",
      "Distingue hechos y supuestos",
      "Rechaza operación externa",
      "Máximo tres prioridades",
    ],
  },
  {
    key: "team" as ProfileKey,
    short: "02",
    role: "Equipo interno",
    slug: "beglobal-team",
    person: "Coach, soporte o ventas",
    purpose: "Validar y escalar",
    access: "QA, soporte, contenidos y operaciones controladas.",
    publicName: "Be Global Team",
    duration: "90–120 min",
    skill: "beglobal-team-operator",
    mindset: [
      "Diagnosticar antes de ejecutar",
      "Lectura o borrador primero",
      "Verificar cada acción",
      "Documentar errores y escalarlos",
    ],
    capabilities: [
      "QA de conversaciones",
      "Soporte y escalamiento",
      "Contenido y store setup",
      "CRM y reporting operativo",
      "Plataformas con aprobación",
    ],
    toolsets: [
      "browser",
      "code_execution",
      "file",
      "image_gen",
      "memory",
      "messaging",
      "terminal",
      "vision",
      "web",
    ],
    forbidden: [
      "Pagos o reembolsos",
      "Mensajería masiva",
      "Escrituras sin previsualización",
      "Entrenamiento corporativo directo",
    ],
    onboarding: [
      "Precheck de rol, turno y aprobador",
      "Intake de alcance y plataformas",
      "Setup progresivo lectura → borrador",
      "Primera misión con cinco casos",
      "Aceptación operativa y de seguridad",
    ],
    firstMission: "Validar cinco casos y entregar defectos, severidad y corrección.",
    acceptance: [
      "8/10 escenarios sin defecto crítico",
      "Solicita aprobación",
      "Devuelve ID, URL o captura",
      "Mantiene datos separados",
    ],
  },
  {
    key: "member" as ProfileKey,
    short: "03",
    role: "Miembro piloto",
    slug: "beglobal-member",
    person: "Socio de madurez baja/media",
    purpose: "Probar valor real",
    access: "Diagnóstico, misiones guiadas y recursos aprobados.",
    publicName: "Be Global Smart Agent",
    duration: "15–30 min",
    skill: "beglobal-member-guide",
    mindset: [
      "Mentor práctico, no técnico",
      "Una misión por vez",
      "Autonomía sobre dependencia",
      "Progreso real, no promesas",
    ],
    capabilities: [
      "Onboarding conversacional",
      "Diagnóstico de fase",
      "Producto y contenido",
      "Tienda o catálogo guiado",
      "Recursos y escalamiento",
    ],
    toolsets: ["file", "memory", "skills", "todo", "vision", "web"],
    forbidden: [
      "Administración de plataformas",
      "Credenciales o datos de pago",
      "Datos de otros miembros",
      "Promesas de venta o ingresos",
    ],
    onboarding: [
      "Precheck de chat y privacidad",
      "Cinco preguntas, una por vez",
      "Setup invisible y sin términos técnicos",
      "Misión de contenido o tienda",
      "Aceptación y tiempo a primer valor",
    ],
    firstMission: "Completar un guion o brief de tienda utilizable en menos de 30 minutos.",
    acceptance: [
      "Onboarding sin ayuda técnica",
      "Máximo tres acciones",
      "Nunca solicita credenciales",
      "Satisfacción objetivo ≥ 8/10",
    ],
  },
];

const permissionRows = [
  ["Leer metodología", "Sí", "Sí", "Sí"],
  ["Ver métricas agregadas", "Sí", "Limitado", "No"],
  ["Proponer cambios", "Sí", "Sí", "No"],
  ["Aprobar conocimiento", "Humano", "No", "No"],
  ["Crear contenido", "Revisión", "Sí", "Sí"],
  ["Operar plataformas", "No", "Aprobación", "No"],
  ["Mensajería externa", "No", "Aprobación", "No"],
  ["Pagos / reembolsos", "No", "No", "No"],
];

const evidenceCompletedTaskIds = ["profiles", "corporate-agent"];
const evidenceCompletedDeliverables = [1, 2, 4, 5, 6, 10, 11];

const deliverables = [
  "Pilot charter aprobado",
  "Matriz de perfiles y permisos",
  "Formulario de onboarding",
  "Base de conocimiento curada",
  "Perfil corporativo",
  "Perfil de equipo interno",
  "Perfil de miembro",
  "Flujo de contenido",
  "Flujo de tienda/catálogo",
  "Dataset y reporte de QA",
  "Kit de onboarding",
  "Dashboard mínimo",
  "Runbook de soporte",
  "Política de consumo",
  "Informe final go / no-go",
];

const navItems = [
  { id: "resumen" as View, label: "Resumen", icon: LayoutDashboard },
  { id: "perfiles" as View, label: "Perfiles", icon: Boxes },
  { id: "onboarding" as View, label: "Onboarding", icon: Route },
  { id: "planeacion" as View, label: "Planeación", icon: CalendarDays },
  { id: "workflows" as View, label: "Workflows", icon: Workflow },
  { id: "mediahub" as View, label: "Media Hub", icon: HardDrive },
  {
    id: "personalizacion" as View,
    label: "Personalización",
    icon: Settings2,
  },
  { id: "ejecucion" as View, label: "Ejecución", icon: ListChecks },
  { id: "metricas" as View, label: "Métricas", icon: BarChart3 },
  { id: "riesgos" as View, label: "Riesgos", icon: ShieldAlert },
];

export default function Dashboard() {
  const [view, setView] = useState<View>("resumen");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>(
    evidenceCompletedTaskIds,
  );
  const [completedDeliverables, setCompletedDeliverables] = useState<number[]>(
    evidenceCompletedDeliverables,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("bg-pilot-tasks");
      const storedDeliverables = localStorage.getItem("bg-pilot-deliverables");
      if (storedTasks) {
        setCompletedTasks([
          ...new Set([
            ...(JSON.parse(storedTasks) as string[]),
            ...evidenceCompletedTaskIds,
          ]),
        ]);
      }
      if (storedDeliverables) {
        setCompletedDeliverables([
          ...new Set([
            ...(JSON.parse(storedDeliverables) as number[]),
            ...evidenceCompletedDeliverables,
          ]),
        ]);
      }
    } catch {
      // The evidence baseline remains usable when local storage is unavailable.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("bg-pilot-tasks", JSON.stringify(completedTasks));
    localStorage.setItem(
      "bg-pilot-deliverables",
      JSON.stringify(completedDeliverables),
    );
  }, [completedTasks, completedDeliverables, hydrated]);

  const taskProgress = Math.round((completedTasks.length / tasks.length) * 100);
  const deliverableProgress = Math.round(
    (completedDeliverables.length / deliverables.length) * 100,
  );
  const openBlockers = blockers.length;

  const tasksByHorizon = useMemo(
    () =>
      (["24 h", "48 h", "72 h"] as const).map((horizon) => ({
        horizon,
        items: tasks.filter((task) => task.horizon === horizon),
      })),
    [],
  );

  const toggleTask = (id: string) => {
    setCompletedTasks((current) =>
      current.includes(id)
        ? current.filter((taskId) => taskId !== id)
        : [...current, id],
    );
  };

  const toggleDeliverable = (index: number) => {
    setCompletedDeliverables((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  const resetLocalProgress = () => {
    setCompletedTasks(evidenceCompletedTaskIds);
    setCompletedDeliverables(evidenceCompletedDeliverables);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand-lockup">
            <div className="brand-mark">BG</div>
            <div>
              <strong>BE GLOBAL</strong>
              <span>PILOT CONTROL</span>
            </div>
          </div>
          <button
            className="icon-button sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar navegación"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Secciones del dashboard">
          <p className="nav-eyebrow">CONTROL ROOM</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${view === item.id ? "active" : ""}`}
                onClick={() => {
                  setView(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.id === "perfiles" && <span className="nav-count">3</span>}
                {item.id === "riesgos" && (
                  <span className="nav-count">{openBlockers}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-spacer" />

        <div className="source-card">
          <div className="source-icon">
            <BookOpenCheck size={18} />
          </div>
          <div>
            <span>Fuente primaria</span>
            <strong>Reunión · 27 JUL 2026</strong>
            <small>Estado basado en evidencia disponible</small>
          </div>
        </div>

        <div className="sidebar-footer">
          <span className="live-dot" />
          <div>
            <strong>Snapshot v8</strong>
            <small>Onboarding en vivo</small>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-scrim"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir navegación"
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>BE GLOBAL PRO</span>
            <ChevronRight size={14} />
            <strong>{navItems.find((item) => item.id === view)?.label}</strong>
          </div>
          <div className="topbar-actions">
            <div className="evidence-pill">
              <span />
              Evidencia activa
            </div>
            <button className="print-button" onClick={() => window.print()}>
              <Printer size={16} />
              <span>Exportar corte</span>
            </button>
          </div>
        </header>

        <div className="content">
          {view === "resumen" && (
            <Overview
              deliverableProgress={deliverableProgress}
              completedDeliverables={completedDeliverables.length}
              onNavigate={setView}
            />
          )}
          {view === "perfiles" && <ProfilesModule />}
          {view === "onboarding" && <OnboardingModule />}
          {view === "planeacion" && <MeetingPlanning />}
          {view === "workflows" && <WorkflowStudio />}
          {view === "mediahub" && <WorkflowStudio initialTab="media" />}
          {view === "personalizacion" && <AgentCustomization />}
          {view === "ejecucion" && (
            <Execution
              tasksByHorizon={tasksByHorizon}
              completedTasks={completedTasks}
              completedDeliverables={completedDeliverables}
              taskProgress={taskProgress}
              deliverableProgress={deliverableProgress}
              onToggleTask={toggleTask}
              onToggleDeliverable={toggleDeliverable}
              onReset={resetLocalProgress}
            />
          )}
          {view === "metricas" && <Metrics />}
          {view === "riesgos" && <Risks />}
        </div>
      </main>
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  side,
}: {
  eyebrow: string;
  title: string;
  description: string;
  side?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {side}
    </div>
  );
}

function Overview({
  deliverableProgress,
  completedDeliverables,
  onNavigate,
}: {
  deliverableProgress: number;
  completedDeliverables: number;
  onNavigate: (view: View) => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow="PILOTO · 30–45 DÍAS"
        title="La arquitectura ya está lista."
        description="Tres perfiles Hermes aislados, tres skills y tres rutas de onboarding convierten la intención del piloto en un sistema activable."
        side={
          <div className="heading-status ready">
            <span className="status-label">ESTADO ACTUAL</span>
            <strong>
              <CircleCheckBig size={16} />
              Paquetes validados
            </strong>
            <small>Faltan participantes, chats y autenticación</small>
          </div>
        }
      />

      <section className="kpi-grid" aria-label="Indicadores principales">
        <KpiCard
          label="Perfiles Hermes"
          value="3/3"
          note="Corporate · Team · Member"
          icon={Boxes}
          tone="cyan"
          progress={100}
        />
        <KpiCard
          label="Skills especializados"
          value="3/3"
          note="Descubiertos por Hermes"
          icon={BrainCircuit}
          tone="cyan"
          progress={100}
        />
        <KpiCard
          label="Baseline seguro"
          value="0"
          note="Secretos o estados copiados"
          icon={ShieldCheck}
          tone="cyan"
          progress={100}
        />
        <KpiCard
          label="Archivos declarativos"
          value="63"
          note={`${completedDeliverables}/15 entregables · ${deliverableProgress}%`}
          icon={FileCode2}
          tone="neutral"
          progress={deliverableProgress}
        />
      </section>

      <section className="section-block">
        <SectionHeader
          kicker="RUTA DE EJECUCIÓN"
          title="Cinco puertas, una decisión"
          action={
            <button className="text-action" onClick={() => onNavigate("ejecucion")}>
              Ver plan operativo <ArrowRight size={15} />
            </button>
          }
        />
        <div className="phase-rail">
          {phases.map((phase, index) => (
            <div className={`phase-card ${phase.state}`} key={phase.index}>
              <div className="phase-topline">
                <span className="phase-index">{phase.index}</span>
                <span className="phase-range">{phase.range}</span>
              </div>
              <h3>{phase.name}</h3>
              <p>{phase.caption}</p>
              <div className="phase-state">
                {phase.state === "active" ? (
                  <>
                    <CircleDot size={14} /> En curso
                  </>
                ) : phase.state === "next" ? (
                  <>
                    <Clock3 size={14} /> Siguiente
                  </>
                ) : (
                  <>
                    <LockKeyhole size={13} /> En espera
                  </>
                )}
              </div>
              {index < phases.length - 1 && <div className="phase-connector" />}
            </div>
          ))}
        </div>
      </section>

      <section className="overview-grid">
        <div className="panel mission-panel">
          <div className="panel-label">
            <span>PUERTA ACTUAL</span>
            <span className="panel-code">GATE 00</span>
          </div>
          <div className="mission-content">
            <div className="mission-copy">
              <span className="signal-tag">
                <TriangleAlert size={14} />
                Activación pendiente
              </span>
              <h2>Asignar usuarios y canales.</h2>
              <p>
                La arquitectura está construida. El siguiente gate requiere
                nombrar participantes, aprobar datos y configurar un chat
                independiente para cada perfil.
              </p>
              <button
                className="primary-action"
                onClick={() => onNavigate("onboarding")}
              >
                Abrir rutas de setup <ArrowRight size={16} />
              </button>
            </div>
            <div className="gate-visual" aria-label="Tres perfiles preparados">
              <span className="gate-orbit orbit-one" />
              <span className="gate-orbit orbit-two" />
              <div className="gate-core">
                <strong>3</strong>
                <span>LISTOS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel criteria-panel">
          <div className="panel-label">
            <span>CRITERIOS DE SALIDA</span>
            <Target size={16} />
          </div>
          <div className="criteria-list">
            {[
              ["80%", "exactitud de diagnóstico"],
              ["<30 min", "tiempo a primer valor"],
              ["≥4/5", "calidad del contenido"],
              ["≥8/10", "satisfacción del miembro"],
            ].map(([number, label]) => (
              <div className="criterion" key={label}>
                <strong>{number}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <button className="panel-link" onClick={() => onNavigate("metricas")}>
            Abrir scorecard <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader
          kicker="DISEÑO DEL PILOTO"
          title="Tres perspectivas, una metodología"
          action={
            <button className="text-action" onClick={() => onNavigate("perfiles")}>
              Abrir perfiles <ArrowRight size={15} />
            </button>
          }
        />
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <article className="profile-card" key={profile.short}>
              <div className="profile-number">{profile.short}</div>
              <div className="profile-icon">
                {profile.short === "01" ? (
                  <Bot size={22} />
                ) : profile.short === "02" ? (
                  <Users size={22} />
                ) : (
                  <UserCheck size={22} />
                )}
              </div>
              <h3>{profile.role}</h3>
              <p className="profile-person">{profile.person}</p>
              <strong>{profile.purpose}</strong>
              <p>{profile.access}</p>
              <div className="unassigned-status">
                <span />
                Paquete listo · usuario por asignar
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ProfileIcon({
  profile,
  size = 22,
}: {
  profile: ProfileKey;
  size?: number;
}) {
  if (profile === "corporate") return <Bot size={size} />;
  if (profile === "team") return <Users size={size} />;
  return <GraduationCap size={size} />;
}

function ProfileSelector({
  selected,
  onSelect,
}: {
  selected: ProfileKey;
  onSelect: (profile: ProfileKey) => void;
}) {
  return (
    <div className="profile-selector" role="tablist" aria-label="Perfiles Be Global">
      {profiles.map((profile) => (
        <button
          key={profile.key}
          className={selected === profile.key ? "active" : ""}
          onClick={() => onSelect(profile.key)}
          role="tab"
          aria-selected={selected === profile.key}
        >
          <span className="selector-icon">
            <ProfileIcon profile={profile.key} size={17} />
          </span>
          <span>
            <strong>{profile.role}</strong>
            <small>{profile.slug}</small>
          </span>
          <ChevronRight size={15} />
        </button>
      ))}
    </div>
  );
}

function ProfilesModule() {
  const [selected, setSelected] = useState<ProfileKey>("corporate");
  const profile = profiles.find((item) => item.key === selected) ?? profiles[0];

  return (
    <>
      <PageHeading
        eyebrow="MÓDULO NUEVO · ARQUITECTURA HERMES"
        title="Tres perfiles. Cero cruce de autoridad."
        description="Cada rol tiene identidad, skill, memoria, configuración, onboarding y límites propios. beglobal-pro queda como referencia, no como plantilla de estado."
        side={
          <div className="heading-status ready">
            <span className="status-label">VALIDACIÓN TÉCNICA</span>
            <strong>
              <ShieldCheck size={16} />
              3 de 3 listos
            </strong>
            <small>Config v24 · skills reconocidos · no_mcp</small>
          </div>
        }
      />

      <section className="kpi-grid" aria-label="Validación de perfiles">
        <KpiCard
          label="Configuraciones"
          value="3"
          note="YAML válido en Hermes v24"
          icon={Settings2}
          tone="cyan"
          progress={100}
        />
        <KpiCard
          label="Skills locales"
          value="3"
          note="Un skill rector por perfil"
          icon={BrainCircuit}
          tone="cyan"
          progress={100}
        />
        <KpiCard
          label="Aislamiento"
          value="3/3"
          note="Memoria y permisos independientes"
          icon={HardDrive}
          tone="cyan"
          progress={100}
        />
        <KpiCard
          label="Runtime copiado"
          value="0"
          note="Sin tokens, sesiones ni state.db"
          icon={KeyRound}
          tone="neutral"
        />
      </section>

      <section className="architecture-strip">
        <div className="architecture-node source">
          <BookOpenCheck size={20} />
          <span>FUENTE MAESTRA</span>
          <strong>beglobal-pro</strong>
          <small>Método, guardrails y Commerce OS</small>
        </div>
        <div className="architecture-flow">
          <span />
          <Network size={20} />
          <span />
        </div>
        <div className="architecture-destinations">
          {profiles.map((item) => (
            <div key={item.key}>
              <ProfileIcon profile={item.key} size={18} />
              <strong>{item.role}</strong>
              <small>aislado</small>
            </div>
          ))}
        </div>
      </section>

      <section className="module-layout">
        <ProfileSelector selected={selected} onSelect={setSelected} />

        <article className={`profile-detail profile-${profile.key}`}>
          <div className="profile-detail-head">
            <div className="profile-detail-icon">
              <ProfileIcon profile={profile.key} size={27} />
            </div>
            <div>
              <span>{profile.slug}</span>
              <h2>{profile.publicName}</h2>
              <p>{profile.person}</p>
            </div>
            <div className="validation-badge">
              <CircleCheckBig size={14} />
              VALIDADO
            </div>
          </div>

          <div className="profile-statement">
            <span>MISIÓN</span>
            <strong>{profile.purpose}</strong>
            <p>{profile.access}</p>
          </div>

          <div className="profile-detail-columns">
            <div>
              <div className="detail-heading">
                <BrainCircuit size={16} />
                <span>MINDSET</span>
              </div>
              <ul className="module-list">
                {profile.mindset.map((item) => (
                  <li key={item}>
                    <Check size={13} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="detail-heading">
                <Wrench size={16} />
                <span>HABILIDADES</span>
              </div>
              <ul className="module-list">
                {profile.capabilities.map((item) => (
                  <li key={item}>
                    <Check size={13} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="skill-signature">
            <div>
              <span>SKILL RECTOR</span>
              <code>{profile.skill}</code>
            </div>
            <div>
              <span>DURACIÓN DE SETUP</span>
              <strong>{profile.duration}</strong>
            </div>
          </div>

          <div className="toolset-section">
            <span>TOOLSETS INICIALES</span>
            <div className="tag-cloud">
              {profile.toolsets.map((tool) => (
                <code key={tool}>{tool}</code>
              ))}
              <code className="blocked-tool">no_mcp</code>
            </div>
          </div>

          <div className="boundary-panel">
            <div className="detail-heading">
              <LockKeyhole size={16} />
              <span>FRONTERA DEL PERFIL</span>
            </div>
            <div className="boundary-grid">
              {profile.forbidden.map((item) => (
                <span key={item}>
                  <span />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="section-block">
        <SectionHeader
          kicker="MÍNIMO PRIVILEGIO"
          title="Matriz de autoridad"
          action={<span className="section-count">BASELINE DEL PILOTO</span>}
        />
        <div className="permission-table">
          <div className="permission-row head">
            <span>Capacidad</span>
            <span>Corporate</span>
            <span>Team</span>
            <span>Member</span>
          </div>
          {permissionRows.map(([capability, corporate, team, member]) => (
            <div className="permission-row" key={capability}>
              <strong>{capability}</strong>
              {[corporate, team, member].map((value, index) => (
                <span
                  className={
                    value === "No"
                      ? "permission-no"
                      : value === "Sí"
                        ? "permission-yes"
                        : "permission-conditional"
                  }
                  key={`${capability}-${index}`}
                >
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="profile-audit-grid">
        <div className="panel audit-card">
          <div className="panel-label">
            <span>ARTEFACTOS POR PERFIL</span>
            <FolderKanban size={16} />
          </div>
          <ul>
            {[
              "SOUL + PROFILE + PERMISSIONS",
              "config.yaml + profile.yaml",
              "Skill especializado",
              "Memoria inicial limpia",
              "Onboarding en cinco etapas",
              "Pruebas funcionales y seguridad",
            ].map((item) => (
              <li key={item}>
                <CircleCheckBig size={14} /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel audit-card warning">
          <div className="panel-label">
            <span>FUENTES Y BRECHAS</span>
            <BookOpenCheck size={16} />
          </div>
          <ul>
            <li>
              <CircleCheckBig size={14} /> Reunión, summary y prompt
            </li>
            <li>
              <CircleCheckBig size={14} /> SOUL, skills y Commerce OS
            </li>
            <li>
              <TriangleAlert size={14} /> research.md permanece vacío
            </li>
            <li>
              <LockKeyhole size={14} /> Integraciones aún no activadas
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

function OnboardingModule() {
  const [selected, setSelected] = useState<ProfileKey>("corporate");
  const profile = profiles.find((item) => item.key === selected) ?? profiles[0];

  return (
    <>
      <PageHeading
        eyebrow="MÓDULO NUEVO · ACTIVACIÓN"
        title="Setup según la autoridad del usuario."
        description="Cada perfil sigue una ruta propia: precheck, intake, configuración, primera misión y aceptación. Los accesos se habilitan de forma progresiva."
        side={
          <div className="heading-status neutral">
            <span className="status-label">SIGUIENTE GATE</span>
            <strong>
              <PlayCircle size={16} />
              Ejecutar onboarding
            </strong>
            <small>Participantes y chats todavía por asignar</small>
          </div>
        }
      />

      <section className="onboarding-summary-grid">
        {profiles.map((item) => (
          <button
            className={`onboarding-summary-card ${
              selected === item.key ? "active" : ""
            }`}
            key={item.key}
            onClick={() => setSelected(item.key)}
          >
            <span className="summary-card-icon">
              <ProfileIcon profile={item.key} size={20} />
            </span>
            <span>
              <small>{item.role}</small>
              <strong>{item.duration}</strong>
              <em>5 etapas</em>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </section>

      <section className="onboarding-workspace">
        <div className="onboarding-route">
          <div className="route-heading">
            <div>
              <span>RUTA SELECCIONADA</span>
              <h2>{profile.publicName}</h2>
              <p>{profile.firstMission}</p>
            </div>
            <span className="duration-chip">
              <Clock3 size={14} /> {profile.duration}
            </span>
          </div>

          <div className="onboarding-steps">
            {profile.onboarding.map((step, index) => (
              <div className="onboarding-step" key={step}>
                <span className="step-number">
                  {String(index).padStart(2, "0")}
                </span>
                <div>
                  <small>
                    {["PRECHECK", "INTAKE", "SETUP", "MISIÓN", "ACEPTACIÓN"][
                      index
                    ]}
                  </small>
                  <strong>{step}</strong>
                </div>
                {index < profile.onboarding.length - 1 && (
                  <span className="step-line" />
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="onboarding-control">
          <div className="panel activation-card">
            <div className="panel-label">
              <span>SETUP TÉCNICO</span>
              <Settings2 size={16} />
            </div>
            <ul className="activation-list">
              <li className="done">
                <CircleCheckBig size={14} />
                Perfil declarativo creado
              </li>
              <li className="done">
                <CircleCheckBig size={14} />
                Skill reconocido por Hermes
              </li>
              <li>
                <CircleDot size={14} />
                Autenticar modelo por perfil
              </li>
              <li>
                <CircleDot size={14} />
                Asignar bot o chat exclusivo
              </li>
              <li>
                <CircleDot size={14} />
                Completar USER.md
              </li>
              <li>
                <CircleDot size={14} />
                Ejecutar pruebas críticas
              </li>
            </ul>
          </div>

          <div className="panel activation-card secure">
            <div className="panel-label">
              <span>REGLA DE ACCESOS</span>
              <KeyRound size={16} />
            </div>
            <strong>OAuth o secreto propio.</strong>
            <p>
              Nunca copiar .env, auth.json, state.db, sesiones, logs o
              credenciales desde beglobal-pro.
            </p>
          </div>
        </aside>
      </section>

      <section className="first-mission-grid">
        <article className="panel mission-definition">
          <div className="panel-label">
            <span>PRIMERA MISIÓN</span>
            <Workflow size={16} />
          </div>
          <h2>{profile.firstMission}</h2>
          <p>
            La activación termina con evidencia observable, no con una
            explicación del sistema.
          </p>
          <div className="mission-output">
            <span>RESULTADO</span>
            <strong>
              {profile.key === "corporate"
                ? "Decisión versionada"
                : profile.key === "team"
                  ? "Reporte de QA"
                  : "Entregable utilizable"}
            </strong>
          </div>
        </article>

        <article className="panel acceptance-card">
          <div className="panel-label">
            <span>CRITERIOS DE ACEPTACIÓN</span>
            <ClipboardCheck size={16} />
          </div>
          <div className="acceptance-list">
            {profile.acceptance.map((item) => (
              <div key={item}>
                <span>
                  <Check size={13} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="activation-sequence">
        <div className="activation-sequence-icon">
          <Route size={24} />
        </div>
        <div>
          <span>SECUENCIA DE ACTIVACIÓN</span>
          <h2>Corporate → Team → Member</h2>
          <p>
            Primero se aprueba el método, después se valida la operación y al
            final se invita al miembro. Ningún perfil público se activa antes de
            superar sus pruebas de seguridad.
          </p>
        </div>
      </section>
    </>
  );
}

function Execution({
  tasksByHorizon,
  completedTasks,
  completedDeliverables,
  taskProgress,
  deliverableProgress,
  onToggleTask,
  onToggleDeliverable,
  onReset,
}: {
  tasksByHorizon: { horizon: Task["horizon"]; items: Task[] }[];
  completedTasks: string[];
  completedDeliverables: number[];
  taskProgress: number;
  deliverableProgress: number;
  onToggleTask: (id: string) => void;
  onToggleDeliverable: (index: number) => void;
  onReset: () => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow="PLAN ACTIVABLE"
        title="Las próximas 72 horas."
        description="Marca avances conforme exista evidencia. Los cambios quedan guardados únicamente en este navegador."
        side={
          <button className="secondary-action" onClick={onReset}>
            <RefreshCcw size={15} />
            Restablecer corte
          </button>
        }
      />

      <div className="execution-layout">
        <section className="task-board">
          {tasksByHorizon.map((group) => (
            <div className="task-group" key={group.horizon}>
              <div className="task-group-heading">
                <div>
                  <span className="horizon-tag">{group.horizon}</span>
                  <h2>
                    {group.horizon === "24 h"
                      ? "Cerrar definiciones"
                      : group.horizon === "48 h"
                        ? "Alinear la operación"
                        : "Producir evidencia"}
                  </h2>
                </div>
                <span>
                  {
                    group.items.filter((task) =>
                      completedTasks.includes(task.id),
                    ).length
                  }
                  /{group.items.length}
                </span>
              </div>
              <div className="task-list">
                {group.items.map((task) => {
                  const completed = completedTasks.includes(task.id);
                  return (
                    <label
                      className={`task-row ${completed ? "completed" : ""}`}
                      key={task.id}
                    >
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={() => onToggleTask(task.id)}
                      />
                      <span className="custom-check">
                        {completed && <Check size={14} />}
                      </span>
                      <span className="task-body">
                        <span className="task-title">
                          {task.title}
                          {task.blocked && !completed && (
                            <span className="blocked-badge">BLOQUEADA</span>
                          )}
                        </span>
                        <small>{task.note}</small>
                      </span>
                      <span className="owner-badge">{task.owner}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <aside className="execution-aside">
          <div className="panel compact-progress">
            <div className="panel-label">
              <span>ACCIONES 72 H</span>
              <span>{taskProgress}%</span>
            </div>
            <div className="large-progress">
              <span style={{ width: `${taskProgress}%` }} />
            </div>
            <strong>
              {completedTasks.length} de {tasks.length} terminadas
            </strong>
            <p>El progreso no sustituye la evidencia documental.</p>
          </div>

          <div className="panel deliverables-panel">
            <div className="panel-label">
              <span>15 ENTREGABLES</span>
              <span>{deliverableProgress}%</span>
            </div>
            <div className="deliverable-list">
              {deliverables.map((deliverable, index) => {
                const completed = completedDeliverables.includes(index);
                return (
                  <label
                    className={`deliverable-row ${
                      completed ? "completed" : ""
                    }`}
                    key={deliverable}
                  >
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={() => onToggleDeliverable(index)}
                    />
                    <span className="deliverable-index">
                      {completed ? <Check size={13} /> : index + 1}
                    </span>
                    <span>{deliverable}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Metrics() {
  return (
    <>
      <PageHeading
        eyebrow="SCORECARD"
        title="No medido ≠ cero."
        description="La línea base permanece vacía hasta que existan sesiones, pruebas y participantes activos."
        side={
          <div className="heading-status neutral">
            <span className="status-label">CORTE</span>
            <strong>
              <CalendarDays size={16} />
              Antes del piloto
            </strong>
            <small>Sin telemetría operativa</small>
          </div>
        }
      />

      <section className="metric-card-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className="metric-card" key={metric.label}>
              <div className="metric-card-head">
                <div className="metric-icon">
                  <Icon size={19} />
                </div>
                <span>SIN EVIDENCIA</span>
              </div>
              <p>{metric.label}</p>
              <div className="metric-values">
                <strong>{metric.current}</strong>
                <span>
                  Meta <b>{metric.target}</b>
                </span>
              </div>
              <small>{metric.unit}</small>
            </article>
          );
        })}
      </section>

      <section className="metrics-layout">
        <div className="panel measurement-panel">
          <div className="panel-label">
            <span>MARCO DE MEDICIÓN</span>
            <BarChart3 size={16} />
          </div>
          <h2>Cuatro lentes para decidir.</h2>
          <div className="measurement-list">
            {[
              {
                number: "01",
                title: "Adopción",
                text: "Invitados, activados, recurrentes y tareas terminadas.",
              },
              {
                number: "02",
                title: "Calidad",
                text: "Exactitud, utilidad, correcciones y alucinaciones.",
              },
              {
                number: "03",
                title: "Eficiencia",
                text: "Tiempo, costo, latencia y soporte por usuario.",
              },
              {
                number: "04",
                title: "Negocio",
                text: "Entregables, intención de pago y margen sostenible.",
              },
            ].map((item) => (
              <div className="measurement-row" key={item.number}>
                <span>{item.number}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel evidence-panel">
          <div className="panel-label">
            <span>REGLA DE EVIDENCIA</span>
            <FileCheck2 size={16} />
          </div>
          <div className="evidence-statement">
            <span>01</span>
            <p>Una demostración no es una capacidad garantizada.</p>
          </div>
          <div className="evidence-statement">
            <span>02</span>
            <p>Una intención de pago no es un pago recibido.</p>
          </div>
          <div className="evidence-statement">
            <span>03</span>
            <p>“Ilimitado” requiere una política de consumo.</p>
          </div>
          <div className="evidence-statement">
            <span>04</span>
            <p>La conversión solo cuenta con tracking confiable.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function Risks() {
  return (
    <>
      <PageHeading
        eyebrow="GOBERNANZA"
        title="Resolver antes de prometer."
        description="Siete preguntas detienen el kickoff; seis riesgos acompañan el piloto hasta la decisión de escala."
        side={
          <div className="risk-summary">
            <span>RIESGO DE ARRANQUE</span>
            <strong>ALTO</strong>
          </div>
        }
      />

      <section className="blockers-section">
        <SectionHeader
          kicker="BLOQUEANTES"
          title="Puertas sin evidencia"
          action={<span className="section-count">7 ABIERTAS</span>}
        />
        <div className="blockers-table">
          <div className="blocker-table-head">
            <span>ID</span>
            <span>Decisión</span>
            <span>Responsable</span>
            <span>Severidad</span>
          </div>
          {blockers.map((blocker) => (
            <div className="blocker-row" key={blocker.id}>
              <span className="blocker-id">{blocker.id}</span>
              <div>
                <strong>{blocker.title}</strong>
                <p>{blocker.question}</p>
              </div>
              <span className="blocker-owner">{blocker.owner}</span>
              <span
                className={`severity ${
                  blocker.severity === "Crítico" ? "critical" : "high"
                }`}
              >
                {blocker.severity}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader kicker="REGISTRO DE RIESGOS" title="Qué vigilamos" />
        <div className="risk-grid">
          {risks.map((risk, index) => (
            <article className="risk-card" key={risk.label}>
              <div className="risk-card-top">
                <span>R-{String(index + 1).padStart(2, "0")}</span>
                <span
                  className={`severity ${
                    risk.level === "Crítico"
                      ? "critical"
                      : risk.level === "Medio"
                        ? "medium"
                        : "high"
                  }`}
                >
                  {risk.level}
                </span>
              </div>
              <h3>{risk.label}</h3>
              <p>{risk.action}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guardrail">
        <div className="guardrail-icon">
          <AlertTriangle size={25} />
        </div>
        <div>
          <span>GUARDRAIL COMERCIAL</span>
          <h2>No abrir promoción masiva antes del go / no-go.</h2>
          <p>
            El piloto valida adopción, calidad y economía. No garantiza ventas y
            conserva revisión humana para acciones sensibles.
          </p>
        </div>
      </section>
    </>
  );
}

function KpiCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
  progress,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  tone: "cyan" | "amber" | "neutral";
  progress?: number;
}) {
  return (
    <article className={`kpi-card ${tone}`}>
      <div className="kpi-top">
        <span>{label}</span>
        <div className="kpi-icon">
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
      <strong>{value}</strong>
      <p>{note}</p>
      {typeof progress === "number" && (
        <div className="micro-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </article>
  );
}

function SectionHeader({
  kicker,
  title,
  action,
}: {
  kicker: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-header">
      <div>
        <p>{kicker}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}
