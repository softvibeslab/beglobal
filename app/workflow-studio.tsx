"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpenCheck,
  Bot,
  ChevronRight,
  CircleCheckBig,
  Copy,
  File,
  FileText,
  Film,
  FolderKanban,
  GraduationCap,
  Image as ImageIcon,
  Link2,
  Music,
  Paperclip,
  PlayCircle,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  Users,
  Workflow,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import AttachmentPicker from "./attachment-picker";
import KnowledgeNotebooks from "./knowledge-notebooks";
import {
  type AgentWorkflow,
  type KnowledgeStatus,
  type MediaCategory,
  type MediaMetadata,
  type MediaProfile,
  type WorkflowProfile,
  type WorkflowStatus,
  type WorkflowStep,
  type WorkflowStepStatus,
  createDefaultWorkflows,
  formatFileSize,
  getMediaBlob,
  knowledgeStatusLabels,
  loadMediaMetadata,
  loadWorkflows,
  mediaCategoryLabels,
  mediaSourceLabels,
  profileWorkflowLabels,
  removeMedia,
  saveWorkflows,
  stepStatusLabels,
  updateMediaMetadata,
  workflowStatusLabels,
} from "./workflow-data";

type StudioTab = "builder" | "media";
type MediaMode = "repository" | "notebooks";

const profileDescriptions: Record<
  WorkflowProfile,
  { role: string; action: string; level: string }
> = {
  corporate: {
    role: "Define y aprueba",
    action: "Entrena método, permisos y templates",
    level: "Nivel 3–4",
  },
  team: {
    role: "Prueba y enseña",
    action: "Convierte el método en QA y operación",
    level: "Nivel 3 controlado",
  },
  member: {
    role: "Ejecuta y evidencia",
    action: "Completa una misión sin complejidad técnica",
    level: "Nivel 2",
  },
};

function ProfileIcon({
  profile,
  size = 18,
}: {
  profile: WorkflowProfile;
  size?: number;
}) {
  if (profile === "corporate") return <Bot size={size} />;
  if (profile === "team") return <Users size={size} />;
  return <GraduationCap size={size} />;
}

function MediaTypeIcon({ item }: { item: MediaMetadata }) {
  if (item.externalUrl) return <Link2 size={18} />;
  if (item.type.startsWith("image/")) return <ImageIcon size={18} />;
  if (item.type.startsWith("video/")) return <Film size={18} />;
  if (item.type.startsWith("audio/")) return <Music size={18} />;
  if (
    item.type.includes("pdf") ||
    item.type.includes("text") ||
    item.type.includes("document")
  ) {
    return <FileText size={18} />;
  }
  return <File size={18} />;
}

function createBlankStep(workflowId: string): WorkflowStep {
  return {
    id: `${workflowId}-step-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: "Nuevo paso",
    description: "Describe qué debe ocurrir y por qué.",
    owner: "Por asignar",
    duration: "15 min",
    status: "pending",
    inputs: "Entradas necesarias",
    outputs: "Resultado verificable",
    evidenceIds: [],
  };
}

export default function WorkflowStudio({
  initialTab = "builder",
}: {
  initialTab?: StudioTab;
}) {
  const [tab, setTab] = useState<StudioTab>(initialTab);
  const [mediaMode, setMediaMode] = useState<MediaMode>("repository");
  const [profile, setProfile] = useState<WorkflowProfile>("corporate");
  const [workflows, setWorkflows] =
    useState<AgentWorkflow[]>(createDefaultWorkflows);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(
    "corp-knowledge-training",
  );
  const [media, setMedia] = useState<MediaMetadata[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [uploadCategory, setUploadCategory] =
    useState<MediaCategory>("evidence");
  const [uploadProfile, setUploadProfile] =
    useState<MediaProfile>("corporate");
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<
    MediaCategory | "all"
  >("all");
  const [mediaStatusFilter, setMediaStatusFilter] = useState<
    KnowledgeStatus | "all"
  >("all");
  const [previewItem, setPreviewItem] = useState<MediaMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewText, setPreviewText] = useState("");

  useEffect(() => {
    setWorkflows(loadWorkflows());
    setMedia(loadMediaMetadata());
    setHydrated(true);

    const refreshMedia = () => setMedia(loadMediaMetadata());
    window.addEventListener("bg-media-updated", refreshMedia);
    return () => window.removeEventListener("bg-media-updated", refreshMedia);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveWorkflows(workflows);
  }, [hydrated, workflows]);

  useEffect(() => {
    const matching = workflows.filter((workflow) => workflow.profile === profile);
    if (!matching.some((workflow) => workflow.id === selectedWorkflowId)) {
      setSelectedWorkflowId(matching[0]?.id ?? "");
    }
    setUploadProfile(profile);
  }, [profile, selectedWorkflowId, workflows]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const profileWorkflows = workflows.filter(
    (workflow) => workflow.profile === profile,
  );
  const activeWorkflow =
    workflows.find((workflow) => workflow.id === selectedWorkflowId) ??
    profileWorkflows[0];
  const activeMedia = activeWorkflow
    ? media.filter((item) =>
        item.linkedWorkflowIds.includes(activeWorkflow.id),
      )
    : [];
  const completeSteps =
    activeWorkflow?.steps.filter((step) => step.status === "done").length ?? 0;
  const workflowProgress = activeWorkflow?.steps.length
    ? Math.round((completeSteps / activeWorkflow.steps.length) * 100)
    : 0;

  const filteredMedia = useMemo(() => {
    const query = mediaSearch.trim().toLowerCase();
    return media
      .filter(
        (item) =>
          item.profile === uploadProfile ||
          item.profile === "shared",
      )
      .filter(
        (item) =>
          mediaCategoryFilter === "all" ||
          item.category === mediaCategoryFilter,
      )
      .filter(
        (item) =>
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.notes.toLowerCase().includes(query) ||
          item.contentExcerpt?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query)),
      )
      .filter(
        (item) =>
          mediaStatusFilter === "all" ||
          (item.knowledgeStatus ?? "inbox") === mediaStatusFilter,
      )
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }, [
    media,
    mediaCategoryFilter,
    mediaSearch,
    mediaStatusFilter,
    uploadProfile,
  ]);

  const updateWorkflow = (
    workflowId: string,
    updater: (workflow: AgentWorkflow) => AgentWorkflow,
  ) => {
    setWorkflows((current) =>
      current.map((workflow) =>
        workflow.id === workflowId ? updater(workflow) : workflow,
      ),
    );
  };

  const updateStep = (
    workflowId: string,
    stepId: string,
    updater: (step: WorkflowStep) => WorkflowStep,
  ) => {
    updateWorkflow(workflowId, (workflow) => ({
      ...workflow,
      steps: workflow.steps.map((step) =>
        step.id === stepId ? updater(step) : step,
      ),
    }));
  };

  const moveStep = (stepId: string, direction: -1 | 1) => {
    if (!activeWorkflow) return;
    updateWorkflow(activeWorkflow.id, (workflow) => {
      const currentIndex = workflow.steps.findIndex(
        (step) => step.id === stepId,
      );
      const nextIndex = Math.max(
        0,
        Math.min(workflow.steps.length - 1, currentIndex + direction),
      );
      if (currentIndex === nextIndex) return workflow;
      const steps = [...workflow.steps];
      const [moved] = steps.splice(currentIndex, 1);
      steps.splice(nextIndex, 0, moved);
      return { ...workflow, steps };
    });
  };

  const addWorkflow = () => {
    const id = `${profile}-workflow-${Date.now()}`;
    const workflow: AgentWorkflow = {
      id,
      title: "Nuevo workflow",
      profile,
      goal: "Define el resultado de negocio y la evidencia que debe producir.",
      trainer:
        profile === "corporate"
          ? "Sponsor"
          : profile === "team"
            ? "Corporate"
            : "Equipo interno",
      learner:
        profile === "corporate"
          ? "Equipo interno"
          : profile === "team"
            ? "Operador"
            : "Miembro",
      maturity:
        profile === "member"
          ? "Nivel 2 · asistente"
          : "Nivel 3 · operación controlada",
      status: "draft",
      version: "0.1",
      steps: [createBlankStep(id)],
    };
    setWorkflows((current) => [...current, workflow]);
    setSelectedWorkflowId(id);
  };

  const duplicateWorkflow = () => {
    if (!activeWorkflow) return;
    const id = `${activeWorkflow.id}-copy-${Date.now()}`;
    const duplicate: AgentWorkflow = {
      ...activeWorkflow,
      id,
      title: `${activeWorkflow.title} · copia`,
      version: "0.1",
      status: "draft",
      steps: activeWorkflow.steps.map((step, index) => ({
        ...step,
        id: `${id}-step-${index}`,
        status: "pending",
        evidenceIds: [],
      })),
    };
    setWorkflows((current) => [...current, duplicate]);
    setSelectedWorkflowId(id);
  };

  const deleteWorkflow = () => {
    if (!activeWorkflow) return;
    if (
      !window.confirm(
        `¿Eliminar el workflow “${activeWorkflow.title}” de este navegador?`,
      )
    ) {
      return;
    }
    const remaining = workflows.filter(
      (workflow) => workflow.id !== activeWorkflow.id,
    );
    setWorkflows(remaining);
    setSelectedWorkflowId(
      remaining.find((workflow) => workflow.profile === profile)?.id ?? "",
    );
  };

  const restoreTemplates = () => {
    if (
      !window.confirm(
        "¿Restaurar todos los workflows base y perder cambios locales del builder?",
      )
    ) {
      return;
    }
    const defaults = createDefaultWorkflows();
    setWorkflows(defaults);
    setProfile("corporate");
    setSelectedWorkflowId("corp-knowledge-training");
  };

  const attachEvidence = (step: WorkflowStep, evidenceId: string) => {
    if (!activeWorkflow || !evidenceId || step.evidenceIds.includes(evidenceId)) {
      return;
    }
    updateStep(activeWorkflow.id, step.id, (current) => ({
      ...current,
      evidenceIds: [...current.evidenceIds, evidenceId],
    }));
    const item = media.find((entry) => entry.id === evidenceId);
    if (item && !item.linkedWorkflowIds.includes(activeWorkflow.id)) {
      updateMediaMetadata({
        ...item,
        linkedWorkflowIds: [...item.linkedWorkflowIds, activeWorkflow.id],
      });
    }
  };

  const detachEvidence = (stepId: string, evidenceId: string) => {
    if (!activeWorkflow) return;
    updateStep(activeWorkflow.id, stepId, (current) => ({
      ...current,
      evidenceIds: current.evidenceIds.filter((id) => id !== evidenceId),
    }));
  };

  const previewMedia = async (item: MediaMetadata) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewText("");
    setPreviewUrl("");
    setPreviewItem(item);
    if (item.externalUrl) return;
    const blob = await getMediaBlob(item.id);
    if (!blob) {
      setPreviewText("El archivo local ya no está disponible.");
      return;
    }
    if (item.type.startsWith("text/") || item.type.includes("json")) {
      setPreviewText((await blob.text()).slice(0, 12000));
    } else {
      setPreviewUrl(URL.createObjectURL(blob));
    }
  };

  const updateMedia = (item: MediaMetadata, patch: Partial<MediaMetadata>) => {
    const updated = { ...item, ...patch };
    updateMediaMetadata(updated);
    setMedia((current) =>
      current.map((entry) => (entry.id === item.id ? updated : entry)),
    );
  };

  const deleteMedia = async (item: MediaMetadata) => {
    if (!window.confirm(`¿Eliminar “${item.name}” del Media Hub local?`)) return;
    await removeMedia(item);
    setMedia(loadMediaMetadata());
    if (previewItem?.id === item.id) {
      setPreviewItem(null);
      setPreviewText("");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  return (
    <>
      <div className="page-heading workflow-heading">
        <div>
          <p className="eyebrow">
            {tab === "builder"
              ? "WORKFLOW STUDIO · ESCALERA DE VALOR"
              : "MEDIA HUB · REPOSITORIO DE CONOCIMIENTO"}
          </p>
          <h1>
            {tab === "builder"
              ? "Diseña cómo aprende, opera y entrega cada agente."
              : "Convierte archivos y enlaces en conocimiento reutilizable."}
          </h1>
          <p className="page-description">
            {tab === "builder"
              ? "Construye pasos, responsables, entradas, resultados y evidencia sin romper la cadena Corporate → Team → Member."
              : "Clasifica fuentes, crea notebooks temáticos y consulta contenido manteniendo cada resultado conectado con su evidencia."}
          </p>
        </div>
        <div className="heading-status ready">
          <span className="status-label">
            {tab === "builder" ? "WORKFLOW ACTIVO" : "REPOSITORIO ACTIVO"}
          </span>
          <strong>
            <CircleCheckBig size={16} />
            {tab === "builder"
              ? `${completeSteps}/${activeWorkflow?.steps.length ?? 0} pasos`
              : `${media.length} fuentes`}
          </strong>
          <small>
            {tab === "builder"
              ? `${workflowProgress}% · ${activeMedia.length} medios vinculados`
              : `${media.filter((item) => (item.knowledgeStatus ?? "inbox") === "approved").length} aprobadas · búsqueda local`}
          </small>
        </div>
      </div>

      {tab === "builder" && (
      <section className="value-ladder" aria-label="Escalera de valor">
        {(["corporate", "team", "member"] as WorkflowProfile[]).map(
          (profileKey, index) => (
            <div className="value-ladder-segment" key={profileKey}>
              <button
                className={`${profile === profileKey ? "active" : ""} profile-${profileKey}`}
                onClick={() => {
                  setProfile(profileKey);
                  setTab("builder");
                }}
              >
                <span className="value-ladder-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="value-ladder-icon">
                  <ProfileIcon profile={profileKey} size={21} />
                </span>
                <span>
                  <small>{profileDescriptions[profileKey].level}</small>
                  <strong>{profileWorkflowLabels[profileKey]}</strong>
                  <b>{profileDescriptions[profileKey].role}</b>
                  <em>{profileDescriptions[profileKey].action}</em>
                </span>
              </button>
              {index < 2 && (
                <div className="value-ladder-connector">
                  <ArrowRight size={17} />
                  <span>{index === 0 ? "entrena" : "acompaña"}</span>
                </div>
              )}
            </div>
          ),
        )}
        <div className="value-feedback-loop">
          <ArrowLeft size={14} />
          La evidencia y el feedback regresan hacia Corporate
        </div>
      </section>
      )}

      <div className="studio-tabs" role="tablist">
        <button
          className={tab === "builder" ? "active" : ""}
          onClick={() => setTab("builder")}
          role="tab"
          aria-selected={tab === "builder"}
        >
          <Workflow size={16} />
          Builder de workflows
        </button>
        <button
          className={tab === "media" ? "active" : ""}
          onClick={() => setTab("media")}
          role="tab"
          aria-selected={tab === "media"}
        >
          <FolderKanban size={16} />
          Media Hub
          <span>{media.length}</span>
        </button>
      </div>

      {tab === "builder" && activeWorkflow && (
        <>
          <section className="workflow-builder-layout">
            <aside className="workflow-library panel">
              <div className="workflow-library-head">
                <div>
                  <span>WORKFLOWS</span>
                  <strong>{profileWorkflowLabels[profile]}</strong>
                </div>
                <button onClick={addWorkflow} aria-label="Crear workflow">
                  <Plus size={16} />
                </button>
              </div>
              <div className="workflow-library-list">
                {profileWorkflows.map((workflow) => {
                  const done = workflow.steps.filter(
                    (step) => step.status === "done",
                  ).length;
                  const linked = media.filter((item) =>
                    item.linkedWorkflowIds.includes(workflow.id),
                  ).length;
                  return (
                    <button
                      className={
                        workflow.id === activeWorkflow.id ? "active" : ""
                      }
                      key={workflow.id}
                      onClick={() => setSelectedWorkflowId(workflow.id)}
                    >
                      <span className={`workflow-status ${workflow.status}`} />
                      <span>
                        <strong>{workflow.title}</strong>
                        <small>
                          {done}/{workflow.steps.length} pasos · {linked} medios
                        </small>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}
              </div>
              <button
                className="workflow-restore"
                onClick={restoreTemplates}
              >
                <RefreshCcw size={14} />
                Restaurar templates
              </button>
            </aside>

            <article className="workflow-editor">
              <div className="workflow-editor-head panel">
                <div className="workflow-editor-title">
                  <span className={`workflow-status ${activeWorkflow.status}`} />
                  <input
                    value={activeWorkflow.title}
                    onChange={(event) =>
                      updateWorkflow(activeWorkflow.id, (current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    aria-label="Nombre del workflow"
                  />
                </div>
                <div className="workflow-editor-actions">
                  <button onClick={duplicateWorkflow}>
                    <Copy size={14} />
                    Duplicar
                  </button>
                  <button className="danger" onClick={deleteWorkflow}>
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
                <label className="workflow-goal">
                  <span>OBJETIVO</span>
                  <textarea
                    rows={2}
                    value={activeWorkflow.goal}
                    onChange={(event) =>
                      updateWorkflow(activeWorkflow.id, (current) => ({
                        ...current,
                        goal: event.target.value,
                      }))
                    }
                  />
                </label>
                <div className="workflow-meta-grid">
                  <label>
                    <span>Entrena</span>
                    <input
                      value={activeWorkflow.trainer}
                      onChange={(event) =>
                        updateWorkflow(activeWorkflow.id, (current) => ({
                          ...current,
                          trainer: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Aprende / ejecuta</span>
                    <input
                      value={activeWorkflow.learner}
                      onChange={(event) =>
                        updateWorkflow(activeWorkflow.id, (current) => ({
                          ...current,
                          learner: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Madurez</span>
                    <input
                      value={activeWorkflow.maturity}
                      onChange={(event) =>
                        updateWorkflow(activeWorkflow.id, (current) => ({
                          ...current,
                          maturity: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Estado</span>
                    <select
                      value={activeWorkflow.status}
                      onChange={(event) =>
                        updateWorkflow(activeWorkflow.id, (current) => ({
                          ...current,
                          status: event.target.value as WorkflowStatus,
                        }))
                      }
                    >
                      {(
                        Object.keys(workflowStatusLabels) as WorkflowStatus[]
                      ).map((status) => (
                        <option value={status} key={status}>
                          {workflowStatusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Versión</span>
                    <input
                      value={activeWorkflow.version}
                      onChange={(event) =>
                        updateWorkflow(activeWorkflow.id, (current) => ({
                          ...current,
                          version: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="workflow-flow">
                {activeWorkflow.steps.map((step, index) => (
                  <div className="workflow-step-wrap" key={step.id}>
                    <article
                      className={`workflow-step-card status-${step.status}`}
                    >
                      <div className="workflow-step-head">
                        <span className="workflow-step-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <input
                          value={step.title}
                          onChange={(event) =>
                            updateStep(
                              activeWorkflow.id,
                              step.id,
                              (current) => ({
                                ...current,
                                title: event.target.value,
                              }),
                            )
                          }
                          aria-label={`Nombre del paso ${index + 1}`}
                        />
                        <select
                          value={step.status}
                          onChange={(event) =>
                            updateStep(
                              activeWorkflow.id,
                              step.id,
                              (current) => ({
                                ...current,
                                status: event.target.value as WorkflowStepStatus,
                              }),
                            )
                          }
                          aria-label={`Estado del paso ${index + 1}`}
                        >
                          {(
                            Object.keys(
                              stepStatusLabels,
                            ) as WorkflowStepStatus[]
                          ).map((status) => (
                            <option value={status} key={status}>
                              {stepStatusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        className="workflow-step-description"
                        rows={2}
                        value={step.description}
                        onChange={(event) =>
                          updateStep(activeWorkflow.id, step.id, (current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        aria-label={`Descripción del paso ${index + 1}`}
                      />
                      <div className="workflow-step-meta">
                        <label>
                          <span>RESPONSABLE</span>
                          <input
                            value={step.owner}
                            onChange={(event) =>
                              updateStep(
                                activeWorkflow.id,
                                step.id,
                                (current) => ({
                                  ...current,
                                  owner: event.target.value,
                                }),
                              )
                            }
                          />
                        </label>
                        <label>
                          <span>DURACIÓN</span>
                          <input
                            value={step.duration}
                            onChange={(event) =>
                              updateStep(
                                activeWorkflow.id,
                                step.id,
                                (current) => ({
                                  ...current,
                                  duration: event.target.value,
                                }),
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="workflow-io-grid">
                        <label>
                          <span>ENTRADAS</span>
                          <textarea
                            rows={3}
                            value={step.inputs}
                            onChange={(event) =>
                              updateStep(
                                activeWorkflow.id,
                                step.id,
                                (current) => ({
                                  ...current,
                                  inputs: event.target.value,
                                }),
                              )
                            }
                          />
                        </label>
                        <label>
                          <span>RESULTADO / SALIDA</span>
                          <textarea
                            rows={3}
                            value={step.outputs}
                            onChange={(event) =>
                              updateStep(
                                activeWorkflow.id,
                                step.id,
                                (current) => ({
                                  ...current,
                                  outputs: event.target.value,
                                }),
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="workflow-evidence-box">
                        <div>
                          <span>EVIDENCIA VINCULADA</span>
                          <AttachmentPicker
                            profile={profile}
                            media={media}
                            linkedWorkflowIds={[activeWorkflow.id]}
                            attachedIds={step.evidenceIds}
                            onRefresh={() => setMedia(loadMediaMetadata())}
                            onAttach={(items) =>
                              items.forEach((item) =>
                                attachEvidence(step, item.id),
                              )
                            }
                          />
                        </div>
                        <div className="workflow-evidence-chips">
                          {step.evidenceIds.map((evidenceId) => {
                            const item = media.find(
                              (entry) => entry.id === evidenceId,
                            );
                            return (
                              <span key={evidenceId}>
                                <Paperclip size={11} />
                                {item?.name ?? "Evidencia no disponible"}
                                <button
                                  onClick={() =>
                                    detachEvidence(step.id, evidenceId)
                                  }
                                  aria-label="Desvincular evidencia"
                                >
                                  <X size={11} />
                                </button>
                              </span>
                            );
                          })}
                          {step.evidenceIds.length === 0 && (
                            <small>Sin evidencia adjunta</small>
                          )}
                        </div>
                      </div>
                      <div className="workflow-step-actions">
                        <button
                          onClick={() => moveStep(step.id, -1)}
                          disabled={index === 0}
                          aria-label="Mover paso arriba"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveStep(step.id, 1)}
                          disabled={index === activeWorkflow.steps.length - 1}
                          aria-label="Mover paso abajo"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          className="danger"
                          onClick={() =>
                            updateWorkflow(activeWorkflow.id, (workflow) => ({
                              ...workflow,
                              steps: workflow.steps.filter(
                                (entry) => entry.id !== step.id,
                              ),
                            }))
                          }
                          disabled={activeWorkflow.steps.length === 1}
                        >
                          <Trash2 size={14} />
                          Eliminar paso
                        </button>
                      </div>
                    </article>
                    {index < activeWorkflow.steps.length - 1 && (
                      <div className="workflow-step-connector">
                        <ArrowDown size={16} />
                        <span>entrega</span>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  className="workflow-add-step"
                  onClick={() =>
                    updateWorkflow(activeWorkflow.id, (workflow) => ({
                      ...workflow,
                      steps: [
                        ...workflow.steps,
                        createBlankStep(workflow.id),
                      ],
                    }))
                  }
                >
                  <Plus size={17} />
                  Agregar paso
                </button>
              </div>

              <section className="workflow-media-inbox panel">
                <div>
                  <FolderKanban size={18} />
                  <span>
                    <strong>Evidence inbox</strong>
                    <small>
                      Archivos y enlaces asociados a este workflow desde
                      Planeación o Media Hub.
                    </small>
                  </span>
                </div>
                <div className="workflow-media-mini-grid">
                  {activeMedia.slice(0, 6).map((item) => (
                    <button key={item.id} onClick={() => previewMedia(item)}>
                      <MediaTypeIcon item={item} />
                      <span>{item.name}</span>
                    </button>
                  ))}
                  {activeMedia.length === 0 && (
                    <small>Sin medios asociados todavía.</small>
                  )}
                </div>
                <button
                  className="text-action"
                  onClick={() => setTab("media")}
                >
                  Abrir Media Hub
                  <ArrowRight size={15} />
                </button>
              </section>
            </article>
          </section>
        </>
      )}

      {tab === "media" && (
        <section className="media-hub">
          <div className="media-module-tabs" role="tablist">
            <button
              className={mediaMode === "repository" ? "active" : ""}
              onClick={() => setMediaMode("repository")}
              role="tab"
              aria-selected={mediaMode === "repository"}
            >
              <FolderKanban size={15} />
              Repositorio
              <span>{media.length}</span>
            </button>
            <button
              className={mediaMode === "notebooks" ? "active" : ""}
              onClick={() => setMediaMode("notebooks")}
              role="tab"
              aria-selected={mediaMode === "notebooks"}
            >
              <BookOpenCheck size={15} />
              Knowledge Notebooks
            </button>
          </div>

          {mediaMode === "repository" ? (
          <>
          <div className="media-hub-command panel">
            <div className="media-hub-command-head">
              <div>
                <span>MEDIA HUB UNIFICADO</span>
                <h2>Una biblioteca conectada con tareas y workflows</h2>
                <p>
                  Todo lo capturado desde cámara, dispositivo, biblioteca del
                  equipo o enlace aparece aquí con su perfil y relaciones.
                  Esta versión guarda el contenido en el navegador actual.
                </p>
              </div>
              <div className="media-hub-stats">
                <strong>{media.length}</strong>
                <span>elementos</span>
              </div>
            </div>

            <div className="media-upload-settings">
              <label>
                <span>Perfil</span>
                <select
                  value={uploadProfile}
                  onChange={(event) =>
                    setUploadProfile(event.target.value as MediaProfile)
                  }
                >
                  <option value="corporate">Corporativo</option>
                  <option value="team">Equipo interno</option>
                  <option value="member">Miembro</option>
                  <option value="shared">Compartido</option>
                </select>
              </label>
              <label>
                <span>Categoría</span>
                <select
                  value={uploadCategory}
                  onChange={(event) =>
                    setUploadCategory(event.target.value as MediaCategory)
                  }
                >
                  {(
                    Object.keys(mediaCategoryLabels) as MediaCategory[]
                  ).map((category) => (
                    <option value={category} key={category}>
                      {mediaCategoryLabels[category]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Workflow relacionado</span>
                <select
                  value={selectedWorkflowId}
                  onChange={(event) =>
                    setSelectedWorkflowId(event.target.value)
                  }
                >
                  {workflows.map((workflow) => (
                    <option value={workflow.id} key={workflow.id}>
                      {profileWorkflowLabels[workflow.profile]} ·{" "}
                      {workflow.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <AttachmentPicker
              profile={uploadProfile}
              category={uploadCategory}
              media={media}
              linkedWorkflowIds={
                activeWorkflow ? [activeWorkflow.id] : []
              }
              onRefresh={() => setMedia(loadMediaMetadata())}
              openByDefault
              variant="hub"
            />
          </div>

          <div className="media-category-shelf">
            <button
              className={mediaCategoryFilter === "all" ? "active" : ""}
              onClick={() => setMediaCategoryFilter("all")}
            >
              <span>TODO</span>
              <strong>
                {
                  media.filter(
                    (item) =>
                      item.profile === uploadProfile ||
                      item.profile === "shared",
                  ).length
                }
              </strong>
            </button>
            {(Object.keys(mediaCategoryLabels) as MediaCategory[]).map(
              (category) => (
                <button
                  className={
                    mediaCategoryFilter === category ? "active" : ""
                  }
                  onClick={() => setMediaCategoryFilter(category)}
                  key={category}
                >
                  <span>{mediaCategoryLabels[category]}</span>
                  <strong>
                    {
                      media.filter(
                        (item) =>
                          item.category === category &&
                          (item.profile === uploadProfile ||
                            item.profile === "shared"),
                      ).length
                    }
                  </strong>
                </button>
              ),
            )}
          </div>

          <div className="media-hub-toolbar">
            <input
              value={mediaSearch}
              onChange={(event) => setMediaSearch(event.target.value)}
              placeholder="Buscar por nombre, etiqueta, nota o contenido…"
            />
            <select
              value={mediaCategoryFilter}
              onChange={(event) =>
                setMediaCategoryFilter(
                  event.target.value as MediaCategory | "all",
                )
              }
            >
              <option value="all">Todas las categorías</option>
              {(
                Object.keys(mediaCategoryLabels) as MediaCategory[]
              ).map((category) => (
                <option value={category} key={category}>
                  {mediaCategoryLabels[category]}
                </option>
              ))}
            </select>
            <select
              value={mediaStatusFilter}
              onChange={(event) =>
                setMediaStatusFilter(
                  event.target.value as KnowledgeStatus | "all",
                )
              }
            >
              <option value="all">Todos los estados</option>
              {(
                Object.keys(knowledgeStatusLabels) as KnowledgeStatus[]
              ).map((status) => (
                <option value={status} key={status}>
                  {knowledgeStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="media-hub-layout">
            <div className="media-grid">
              {filteredMedia.map((item) => (
                <article className="media-card panel" key={item.id}>
                  <button
                    className="media-card-preview"
                    onClick={() => previewMedia(item)}
                  >
                    <MediaTypeIcon item={item} />
                    <span>
                      <strong>{item.name}</strong>
                      <small>
                        {formatFileSize(item.size)} ·{" "}
                        {mediaCategoryLabels[item.category]} ·{" "}
                        {mediaSourceLabels[item.source ?? "device"]}
                      </small>
                    </span>
                    <PlayCircle size={15} />
                  </button>
                  <div className="media-card-controls">
                    <select
                      value={item.profile}
                      onChange={(event) =>
                        updateMedia(item, {
                          profile: event.target.value as MediaProfile,
                        })
                      }
                      aria-label={`Perfil de ${item.name}`}
                    >
                      <option value="corporate">Corporativo</option>
                      <option value="team">Equipo</option>
                      <option value="member">Miembro</option>
                      <option value="shared">Compartido</option>
                    </select>
                    <select
                      value={item.category}
                      onChange={(event) =>
                        updateMedia(item, {
                          category: event.target.value as MediaCategory,
                        })
                      }
                      aria-label={`Categoría de ${item.name}`}
                    >
                      {(
                        Object.keys(mediaCategoryLabels) as MediaCategory[]
                      ).map((category) => (
                        <option value={category} key={category}>
                          {mediaCategoryLabels[category]}
                        </option>
                      ))}
                    </select>
                    <select
                      value={item.linkedWorkflowIds[0] ?? ""}
                      onChange={(event) =>
                        updateMedia(item, {
                          linkedWorkflowIds: event.target.value
                            ? [event.target.value]
                            : [],
                        })
                      }
                      aria-label={`Workflow de ${item.name}`}
                    >
                      <option value="">Sin workflow</option>
                      {workflows.map((workflow) => (
                        <option value={workflow.id} key={workflow.id}>
                          {profileWorkflowLabels[workflow.profile]} ·{" "}
                          {workflow.title}
                        </option>
                      ))}
                    </select>
                    <select
                      value={item.knowledgeStatus ?? "inbox"}
                      onChange={(event) =>
                        updateMedia(item, {
                          knowledgeStatus: event.target
                            .value as KnowledgeStatus,
                        })
                      }
                      aria-label={`Estado de conocimiento de ${item.name}`}
                    >
                      {(
                        Object.keys(
                          knowledgeStatusLabels,
                        ) as KnowledgeStatus[]
                      ).map((status) => (
                        <option value={status} key={status}>
                          {knowledgeStatusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="media-card-tags">
                    <span>ETIQUETAS</span>
                    <input
                      value={(item.tags ?? []).join(", ")}
                      onChange={(event) =>
                        updateMedia(item, {
                          tags: event.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="onboarding, video, tienda…"
                    />
                  </label>
                  <textarea
                    rows={2}
                    value={item.notes}
                    onChange={(event) =>
                      updateMedia(item, { notes: event.target.value })
                    }
                    placeholder="Notas, resumen, fuente, derechos o criterio de uso…"
                  />
                  <div className="media-card-footer">
                    <span>
                      {new Date(item.uploadedAt).toLocaleString("es-MX")}
                    </span>
                    <button
                      className="danger"
                      onClick={() => deleteMedia(item)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </article>
              ))}
              {filteredMedia.length === 0 && (
                <div className="media-empty panel">
                  <FolderKanban size={25} />
                  <strong>No hay medios para este filtro</strong>
                  <span>Sube un archivo o agrega una referencia por enlace.</span>
                </div>
              )}
            </div>

            <aside className="media-preview-panel panel">
              <div className="agent-panel-label">
                <span>VISTA PREVIA</span>
                {previewItem && (
                  <button
                    onClick={() => {
                      setPreviewItem(null);
                      setPreviewText("");
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl("");
                    }}
                    aria-label="Cerrar vista previa"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              {!previewItem ? (
                <div className="media-preview-empty">
                  <FileText size={24} />
                  <strong>Selecciona un medio</strong>
                  <span>Aquí verás su contenido o referencia.</span>
                </div>
              ) : (
                <div className="media-preview-content">
                  <div className="media-preview-title">
                    <MediaTypeIcon item={previewItem} />
                    <span>
                      <strong>{previewItem.name}</strong>
                      <small>{previewItem.type}</small>
                    </span>
                  </div>
                  {previewItem.externalUrl && (
                    <a
                      className="media-external-link"
                      href={previewItem.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Link2 size={15} />
                      Abrir referencia
                    </a>
                  )}
                  {previewText && <pre>{previewText}</pre>}
                  {previewUrl && previewItem.type.startsWith("image/") && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt={previewItem.name} />
                  )}
                  {previewUrl && previewItem.type.startsWith("video/") && (
                    <video src={previewUrl} controls />
                  )}
                  {previewUrl && previewItem.type.startsWith("audio/") && (
                    <audio src={previewUrl} controls />
                  )}
                  {previewUrl && previewItem.type.includes("pdf") && (
                    <iframe src={previewUrl} title={previewItem.name} />
                  )}
                  {previewUrl &&
                    !previewItem.type.startsWith("image/") &&
                    !previewItem.type.startsWith("video/") &&
                    !previewItem.type.startsWith("audio/") &&
                    !previewItem.type.includes("pdf") && (
                      <a
                        className="media-external-link"
                        href={previewUrl}
                        download={previewItem.name}
                      >
                        <Save size={15} />
                        Descargar copia local
                      </a>
                    )}
                  <div className="media-preview-links">
                    <span>WORKFLOWS</span>
                    {previewItem.linkedWorkflowIds.map((workflowId) => (
                      <small key={workflowId}>
                        {workflows.find((entry) => entry.id === workflowId)
                          ?.title ?? workflowId}
                      </small>
                    ))}
                    {previewItem.linkedWorkflowIds.length === 0 && (
                      <small>Sin workflow vinculado.</small>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
          </>
          ) : (
            <KnowledgeNotebooks media={media} />
          )}
        </section>
      )}
    </>
  );
}
