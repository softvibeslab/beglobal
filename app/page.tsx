"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Gauge,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  Menu,
  PanelLeftClose,
  Printer,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  Target,
  TriangleAlert,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type View = "resumen" | "ejecucion" | "metricas" | "riesgos";
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
    title: "Aprobar perfiles, tareas y criterios de éxito",
    owner: "Allan",
    horizon: "48 h",
    note: "Resolver si son tres agentes o tres roles.",
    blocked: true,
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
    title: "Entregar primer perfil corporativo",
    owner: "José",
    horizon: "72 h",
    note: "Metodología, plantillas, permisos y métricas.",
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
    short: "01",
    role: "Corporativo",
    person: "Allan o responsable",
    purpose: "Entrenar y gobernar",
    access: "Metodología, plantillas, configuración y métricas.",
  },
  {
    short: "02",
    role: "Equipo interno",
    person: "Coach, soporte o ventas",
    purpose: "Validar y escalar",
    access: "Casos de prueba, feedback, soporte y contenidos.",
  },
  {
    short: "03",
    role: "Miembro piloto",
    person: "Socio de madurez baja/media",
    purpose: "Probar valor real",
    access: "Interfaz simple, acciones y recursos aprobados.",
  },
];

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
  { id: "ejecucion" as View, label: "Ejecución", icon: ListChecks },
  { id: "metricas" as View, label: "Métricas", icon: BarChart3 },
  { id: "riesgos" as View, label: "Riesgos", icon: ShieldAlert },
];

export default function Dashboard() {
  const [view, setView] = useState<View>("resumen");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [completedDeliverables, setCompletedDeliverables] = useState<number[]>([
    11,
  ]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("bg-pilot-tasks");
      const storedDeliverables = localStorage.getItem("bg-pilot-deliverables");
      if (storedTasks) setCompletedTasks(JSON.parse(storedTasks));
      if (storedDeliverables)
        setCompletedDeliverables(JSON.parse(storedDeliverables));
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
    setCompletedTasks([]);
    setCompletedDeliverables([11]);
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
            <strong>Snapshot v1</strong>
            <small>Actualizado 29 JUL 2026</small>
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
              taskProgress={taskProgress}
              onNavigate={setView}
            />
          )}
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
  taskProgress,
  onNavigate,
}: {
  deliverableProgress: number;
  completedDeliverables: number;
  taskProgress: number;
  onNavigate: (view: View) => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow="PILOTO · 30–45 DÍAS"
        title="De intención a evidencia."
        description="Una vista ejecutiva para activar tres perfiles, validar dos misiones y decidir con datos antes de escalar."
        side={
          <div className="heading-status">
            <span className="status-label">ESTADO ACTUAL</span>
            <strong>
              <CircleDot size={16} />
              Pre-kickoff
            </strong>
            <small>Bloqueado por definiciones comerciales</small>
          </div>
        }
      />

      <section className="kpi-grid" aria-label="Indicadores principales">
        <KpiCard
          label="Avance de entregables"
          value={`${completedDeliverables}/15`}
          note={`${deliverableProgress}% del piloto documentado`}
          icon={FileCheck2}
          tone="cyan"
          progress={deliverableProgress}
        />
        <KpiCard
          label="Participantes activos"
          value="0/3"
          note="Objetivo mínimo: 2 activados"
          icon={Users}
          tone="neutral"
        />
        <KpiCard
          label="Bloqueos de kickoff"
          value="7"
          note="4 requieren decisión crítica"
          icon={LockKeyhole}
          tone="amber"
        />
        <KpiCard
          label="Acciones 72 h"
          value={`${taskProgress}%`}
          note="Seguimiento local del navegador"
          icon={ClipboardCheck}
          tone="neutral"
          progress={taskProgress}
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
                Decisiones antes de construir
              </span>
              <h2>Cerrar el charter del piloto.</h2>
              <p>
                El equipo puede avanzar cuando dinero, participantes, canal,
                alcance y datos estén definidos por escrito.
              </p>
              <button
                className="primary-action"
                onClick={() => onNavigate("riesgos")}
              >
                Resolver 7 bloqueos <ArrowRight size={16} />
              </button>
            </div>
            <div className="gate-visual" aria-label="Siete bloqueos abiertos">
              <span className="gate-orbit orbit-one" />
              <span className="gate-orbit orbit-two" />
              <div className="gate-core">
                <strong>7</strong>
                <span>ABIERTOS</span>
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
                Por asignar
              </div>
            </article>
          ))}
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
