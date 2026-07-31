export type WorkflowProfile = "corporate" | "team" | "member";
export type MediaProfile = WorkflowProfile | "shared";
export type MediaCategory =
  | "source"
  | "template"
  | "example"
  | "evidence"
  | "training";
export type MediaSource = "device" | "camera" | "link" | "library";
export type KnowledgeStatus = "inbox" | "reviewed" | "approved" | "archived";
export type WorkflowStatus = "draft" | "testing" | "approved";
export type WorkflowStepStatus =
  | "pending"
  | "ready"
  | "active"
  | "review"
  | "done"
  | "blocked";

export type MediaMetadata = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  profile: MediaProfile;
  category: MediaCategory;
  source?: MediaSource;
  knowledgeStatus?: KnowledgeStatus;
  tags?: string[];
  contentExcerpt?: string;
  notes: string;
  externalUrl?: string;
  linkedWorkflowIds: string[];
  linkedTaskIds: string[];
  linkedSubtaskIds?: string[];
};

export type MediaNotebook = {
  id: string;
  title: string;
  profile: MediaProfile;
  objective: string;
  instructions: string;
  summary: string;
  questions: string;
  sourceIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  owner: string;
  duration: string;
  status: WorkflowStepStatus;
  inputs: string;
  outputs: string;
  evidenceIds: string[];
};

export type AgentWorkflow = {
  id: string;
  title: string;
  profile: WorkflowProfile;
  goal: string;
  trainer: string;
  learner: string;
  maturity: string;
  status: WorkflowStatus;
  version: string;
  steps: WorkflowStep[];
};

export const MEDIA_STORAGE_KEY = "bg-media-hub-v1";
export const WORKFLOW_STORAGE_KEY = "bg-workflow-studio-v1";
export const NOTEBOOK_STORAGE_KEY = "bg-knowledge-notebooks-v1";
const MEDIA_DATABASE_NAME = "beglobal-pilot-media";
const MEDIA_STORE_NAME = "files";
const MAX_LOCAL_FILE_SIZE = 100 * 1024 * 1024;

export const profileWorkflowLabels: Record<WorkflowProfile, string> = {
  corporate: "Corporativo",
  team: "Equipo interno",
  member: "Miembro piloto",
};

export const mediaCategoryLabels: Record<MediaCategory, string> = {
  source: "Fuente",
  template: "Plantilla",
  example: "Ejemplo",
  evidence: "Evidencia",
  training: "Capacitación",
};

export const mediaSourceLabels: Record<MediaSource, string> = {
  device: "Dispositivo",
  camera: "Cámara",
  link: "Enlace",
  library: "Biblioteca",
};

export const knowledgeStatusLabels: Record<KnowledgeStatus, string> = {
  inbox: "Por clasificar",
  reviewed: "Revisada",
  approved: "Aprobada",
  archived: "Archivada",
};

export function createDefaultNotebooks(): MediaNotebook[] {
  const createdAt = new Date().toISOString();
  return [
    {
      id: "notebook-corporate-method",
      title: "Método y gobierno Be Global",
      profile: "corporate",
      objective:
        "Concentrar metodología, políticas, decisiones, templates y versiones aprobadas.",
      instructions:
        "Distingue hechos, supuestos y decisiones. Prioriza fuentes aprobadas y señala contradicciones.",
      summary: "",
      questions:
        "¿Cuál es la versión vigente del método?\n¿Qué decisiones siguen abiertas?\n¿Qué puede entrenar Corporate al equipo?",
      sourceIds: [],
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "notebook-team-training",
      title: "Capacitación y QA del equipo",
      profile: "team",
      objective:
        "Reunir materiales, casos, defectos y evidencia para entrenar al equipo interno.",
      instructions:
        "Relaciona cada hallazgo con un caso de prueba, owner y criterio de aceptación.",
      summary: "",
      questions:
        "¿Qué debe aprender el equipo antes del release?\n¿Qué defectos se repiten?\n¿Qué material debe actualizar Corporate?",
      sourceIds: [],
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: "notebook-member-missions",
      title: "Misiones y aprendizaje del socio",
      profile: "member",
      objective:
        "Agrupar referencias, ejemplos y evidencia de las misiones de contenido y tienda.",
      instructions:
        "Usa lenguaje simple, máximo tres acciones y evidencia verificable de primer valor.",
      summary: "",
      questions:
        "¿Qué bloqueo tiene el socio?\n¿Qué ejemplo le corresponde?\n¿Qué evidencia demuestra que completó la misión?",
      sourceIds: [],
      createdAt,
      updatedAt: createdAt,
    },
  ];
}

export const workflowStatusLabels: Record<WorkflowStatus, string> = {
  draft: "Borrador",
  testing: "En prueba",
  approved: "Aprobado",
};

export const stepStatusLabels: Record<WorkflowStepStatus, string> = {
  pending: "Pendiente",
  ready: "Listo",
  active: "En curso",
  review: "Revisión",
  done: "Terminado",
  blocked: "Bloqueado",
};

function workflowStep(
  id: string,
  title: string,
  description: string,
  owner: string,
  duration: string,
  inputs: string,
  outputs: string,
): WorkflowStep {
  return {
    id,
    title,
    description,
    owner,
    duration,
    status: "pending",
    inputs,
    outputs,
    evidenceIds: [],
  };
}

export function createDefaultWorkflows(): AgentWorkflow[] {
  return [
    {
      id: "corp-knowledge-training",
      title: "Entrenar método y conocimiento",
      profile: "corporate",
      goal:
        "Convertir la metodología Be Global en un paquete versionado que el equipo pueda operar y enseñar.",
      trainer: "Sponsor + responsable de metodología",
      learner: "Equipo interno",
      maturity: "Nivel 3–4 · gobierno y orquestación",
      status: "draft",
      version: "0.1",
      steps: [
        workflowStep(
          "corp-capture",
          "Reunir fuentes oficiales",
          "Clasificar cursos, videos, plantillas, FAQs, políticas y ejemplos aprobados.",
          "Curador corporativo",
          "45 min",
          "Videos, documentos, enlaces y templates",
          "Inventario de fuentes con owner y vigencia",
        ),
        workflowStep(
          "corp-model",
          "Modelar el método",
          "Transformar el contenido en fases, decisiones, reglas, entradas y resultados esperados.",
          "Product owner",
          "60 min",
          "Inventario de fuentes",
          "Mapa de método y criterios por fase",
        ),
        workflowStep(
          "corp-templates",
          "Aprobar plantillas",
          "Definir los formatos oficiales de contenido, tienda, diagnóstico y escalamiento.",
          "Responsable de metodología",
          "45 min",
          "Plantillas candidatas y casos exitosos",
          "Templates aprobados y versionados",
        ),
        workflowStep(
          "corp-permissions",
          "Definir autoridad",
          "Separar lo que cada perfil puede leer, proponer, aprobar o ejecutar.",
          "Sponsor + técnico",
          "30 min",
          "Matriz de perfiles y riesgos",
          "Permisos y checkpoints humanos",
        ),
        workflowStep(
          "corp-train-team",
          "Entrenar al equipo",
          "Entregar el paquete, explicar decisiones y ejecutar un caso en vivo.",
          "Corporate trainer",
          "60 min",
          "Paquete versionado",
          "Equipo habilitado para QA",
        ),
        workflowStep(
          "corp-release",
          "Liberar versión",
          "Revisar evidencia de QA y aprobar, ajustar o revertir la versión.",
          "Decisor go/no-go",
          "30 min",
          "Reporte de QA, defectos y riesgos",
          "Versión aprobada y registro de decisión",
        ),
      ],
    },
    {
      id: "corp-release-governance",
      title: "Gobierno de cambios y releases",
      profile: "corporate",
      goal:
        "Evitar que una mejora, integración o nuevo medio llegue al socio sin evidencia y aprobación.",
      trainer: "Responsable corporativo",
      learner: "Equipo interno",
      maturity: "Nivel 3–4 · control de cambios",
      status: "draft",
      version: "0.1",
      steps: [
        workflowStep(
          "release-request",
          "Registrar solicitud",
          "Documentar problema, fuente, impacto y responsable de la propuesta.",
          "Solicitante",
          "15 min",
          "Feedback, defecto o nueva fuente",
          "Solicitud trazable",
        ),
        workflowStep(
          "release-impact",
          "Analizar impacto",
          "Revisar perfiles afectados, permisos, costos, datos y reversibilidad.",
          "Corporate",
          "30 min",
          "Solicitud y evidencia",
          "Análisis de impacto",
        ),
        workflowStep(
          "release-test",
          "Solicitar prueba",
          "Definir casos y enviar la propuesta al equipo interno para QA.",
          "Corporate + Team",
          "45 min",
          "Versión candidata",
          "Dataset y criterios de aceptación",
        ),
        workflowStep(
          "release-decision",
          "Decidir",
          "Aprobar, ajustar, rechazar o extender la prueba con responsable.",
          "Decisor corporativo",
          "20 min",
          "Resultados de QA",
          "Decisión versionada",
        ),
        workflowStep(
          "release-communicate",
          "Comunicar y capacitar",
          "Actualizar guía, video, minuta y paquete de entrenamiento.",
          "Corporate trainer",
          "45 min",
          "Release aprobado",
          "Materiales vigentes para Team",
        ),
      ],
    },
    {
      id: "team-qa-training",
      title: "QA interno y entrenamiento",
      profile: "team",
      goal:
        "Convertir una versión corporativa en una operación segura antes de invitar al socio.",
      trainer: "Corporate",
      learner: "Operador interno",
      maturity: "Nivel 3 controlado · operación y QA",
      status: "draft",
      version: "0.1",
      steps: [
        workflowStep(
          "team-receive",
          "Recibir paquete",
          "Confirmar versión, cambios, permisos, templates y casos esperados.",
          "Líder de QA",
          "20 min",
          "Release corporativo",
          "Checklist de recepción",
        ),
        workflowStep(
          "team-run-cases",
          "Ejecutar casos",
          "Probar miembro desde cero, contenido, tienda, datos faltantes y acción sensible.",
          "Operador QA",
          "90 min",
          "Dataset y perfiles limpios",
          "Resultados por escenario",
        ),
        workflowStep(
          "team-log-defects",
          "Registrar defectos",
          "Capturar respuesta, evidencia, severidad, causa y corrección propuesta.",
          "Operador QA",
          "30 min",
          "Resultados de pruebas",
          "Backlog de defectos",
        ),
        workflowStep(
          "team-fix-verify",
          "Corregir y verificar",
          "Aplicar ajustes reversibles y repetir el caso afectado.",
          "Técnico + QA",
          "60 min",
          "Defectos priorizados",
          "Pruebas corregidas",
        ),
        workflowStep(
          "team-train-member",
          "Preparar onboarding",
          "Crear guía escrita, video corto y sesión en vivo con mejores prácticas.",
          "Coach interno",
          "60 min",
          "Versión estable",
          "Kit de onboarding",
        ),
        workflowStep(
          "team-escalate",
          "Entregar evidencia",
          "Enviar patrones, riesgos y recomendación a Corporate sin datos innecesarios.",
          "Líder de QA",
          "20 min",
          "Reporte y evidencias",
          "Recomendación de activación",
        ),
      ],
    },
    {
      id: "team-content-production",
      title: "Contenido desde video plantilla",
      profile: "team",
      goal:
        "Convertir una referencia validada en un guion y plan de grabación útil para el socio.",
      trainer: "Corporate + experto de contenido",
      learner: "Coach de contenido",
      maturity: "Nivel 3 controlado · producción asistida",
      status: "draft",
      version: "0.1",
      steps: [
        workflowStep(
          "content-intake",
          "Capturar objetivo",
          "Registrar producto, audiencia, canal, oferta, CTA y restricción.",
          "Coach",
          "10 min",
          "Brief del miembro",
          "Objetivo validado",
        ),
        workflowStep(
          "content-reference",
          "Ingestar referencia",
          "Subir video o enlace y confirmar que puede usarse como template.",
          "Coach",
          "10 min",
          "Video, link o campaña exitosa",
          "Referencia disponible en Media Hub",
        ),
        workflowStep(
          "content-reverse",
          "Hacer ingeniería inversa",
          "Extraer gancho, problema, estructura, emoción, beneficio, CTA y ritmo.",
          "Agente + coach",
          "20 min",
          "Referencia aprobada",
          "Anatomía del contenido",
        ),
        workflowStep(
          "content-adapt",
          "Adaptar al producto",
          "Crear guion, texto en pantalla, copy y CTA con el método Be Global.",
          "Agente",
          "15 min",
          "Anatomía + brief",
          "Guion candidato",
        ),
        workflowStep(
          "content-shotlist",
          "Definir tomas",
          "Indicar escenas, producto en mano, demostración, B-roll y recursos.",
          "Agente + coach",
          "10 min",
          "Guion candidato",
          "Shot list y checklist",
        ),
        workflowStep(
          "content-review",
          "Revisar y entregar",
          "Validar promesa, marca, derechos, claridad y máximo una ronda de ajuste.",
          "Coach + miembro",
          "20 min",
          "Guion y tomas",
          "Contenido listo y evidencia",
        ),
      ],
    },
    {
      id: "team-store-setup",
      title: "Tienda o catálogo guiado",
      profile: "team",
      goal:
        "Convertir datos del miembro y una plantilla aprobada en un brief o configuración revisable.",
      trainer: "Corporate + experto ecommerce",
      learner: "Operador de tienda",
      maturity: "Nivel 3 controlado · setup asistido",
      status: "draft",
      version: "0.1",
      steps: [
        workflowStep(
          "store-template",
          "Elegir plantilla",
          "Seleccionar template aprobado según producto, canal y etapa.",
          "Operador",
          "10 min",
          "Catálogo y objetivo",
          "Plantilla seleccionada",
        ),
        workflowStep(
          "store-intake",
          "Completar formulario",
          "Capturar marca, paleta, productos, proveedor, costos, precio, entrega y confianza.",
          "Miembro + operador",
          "25 min",
          "Fotos, inventario y datos comerciales",
          "Brief completo",
        ),
        workflowStep(
          "store-assets",
          "Organizar medios",
          "Clasificar logos, fotos, fichas, políticas y referencias en Media Hub.",
          "Operador",
          "20 min",
          "Archivos del miembro",
          "Biblioteca vinculada",
        ),
        workflowStep(
          "store-draft",
          "Generar borrador",
          "Preparar arquitectura, páginas, copy, catálogo y configuración propuesta.",
          "Agente",
          "30 min",
          "Plantilla + brief + medios",
          "Borrador revisable",
        ),
        workflowStep(
          "store-qa",
          "Validar negocio",
          "Revisar precio, margen, stock, envíos, políticas y datos faltantes.",
          "Operador + aprobador",
          "30 min",
          "Borrador y evidencia comercial",
          "Checklist de QA",
        ),
        workflowStep(
          "store-handoff",
          "Aprobar o escalar",
          "Entregar brief utilizable o solicitar autorización antes de publicar.",
          "Aprobador humano",
          "15 min",
          "QA terminado",
          "Entrega o escalamiento",
        ),
      ],
    },
    {
      id: "member-onboarding",
      title: "Diagnóstico y primera misión",
      profile: "member",
      goal:
        "Dar al socio un siguiente paso correcto sin exponer arquitectura ni herramientas avanzadas.",
      trainer: "Equipo interno",
      learner: "Miembro piloto",
      maturity: "Nivel 2 · asistente personalizado",
      status: "draft",
      version: "0.1",
      steps: [
        workflowStep(
          "member-welcome",
          "Dar bienvenida",
          "Explicar el objetivo, el uso de datos y el contacto humano.",
          "Smart Agent",
          "2 min",
          "Chat autorizado",
          "Consentimiento y contexto inicial",
        ),
        workflowStep(
          "member-diagnose",
          "Diagnosticar fase",
          "Preguntar experiencia, producto, proveedor, canal, bloqueo y objetivo.",
          "Smart Agent",
          "8 min",
          "Respuestas del miembro",
          "Fase y bloqueo principal",
        ),
        workflowStep(
          "member-route",
          "Elegir misión",
          "Seleccionar contenido o tienda; nunca entregar todo el programa.",
          "Smart Agent",
          "3 min",
          "Diagnóstico",
          "Una misión recomendada",
        ),
        workflowStep(
          "member-actions",
          "Asignar acciones",
          "Dar máximo tres acciones, un recurso y la evidencia esperada.",
          "Smart Agent",
          "5 min",
          "Misión elegida",
          "Plan breve y comprensible",
        ),
        workflowStep(
          "member-first-value",
          "Producir primer valor",
          "Completar un guion o brief utilizable en menos de 30 minutos.",
          "Miembro + Smart Agent",
          "15 min",
          "Datos y medios mínimos",
          "Primer entregable",
        ),
        workflowStep(
          "member-feedback",
          "Enviar evidencia",
          "Registrar resultado, tiempo, bloqueo, satisfacción y necesidad de soporte.",
          "Miembro",
          "5 min",
          "Entregable",
          "Evidencia para Team",
        ),
      ],
    },
    {
      id: "member-content-mission",
      title: "Misión de contenido",
      profile: "member",
      goal:
        "Terminar un guion publicable y un plan de tomas a partir de un producto o referencia.",
      trainer: "Coach de contenido",
      learner: "Miembro",
      maturity: "Nivel 2 · misión guiada",
      status: "draft",
      version: "0.1",
      steps: [
        workflowStep(
          "member-content-product",
          "Compartir producto",
          "Enviar producto, foto, cliente ideal y canal.",
          "Miembro",
          "5 min",
          "Foto o ficha del producto",
          "Brief mínimo",
        ),
        workflowStep(
          "member-content-reference",
          "Compartir referencia",
          "Agregar un video o enlace si existe un formato que quiera replicar.",
          "Miembro",
          "5 min",
          "Video o link opcional",
          "Referencia vinculada",
        ),
        workflowStep(
          "member-content-script",
          "Recibir guion",
          "Obtener gancho, problema, beneficio, CTA, copy y tomas.",
          "Smart Agent",
          "8 min",
          "Brief y referencia",
          "Guion completo",
        ),
        workflowStep(
          "member-content-adjust",
          "Ajustar una vez",
          "Confirmar que el mensaje, tono y oferta sí representan al miembro.",
          "Miembro + Smart Agent",
          "5 min",
          "Guion candidato",
          "Versión final",
        ),
        workflowStep(
          "member-content-evidence",
          "Grabar o preparar",
          "Subir captura, video, link o checklist como evidencia.",
          "Miembro",
          "10 min",
          "Versión final",
          "Evidencia de primer valor",
        ),
      ],
    },
    {
      id: "member-store-mission",
      title: "Misión de tienda o catálogo",
      profile: "member",
      goal:
        "Completar el brief mínimo para que el equipo prepare una tienda o catálogo sin inventar datos.",
      trainer: "Operador de tienda",
      learner: "Miembro",
      maturity: "Nivel 2 · formulario guiado",
      status: "draft",
      version: "0.1",
      steps: [
        workflowStep(
          "member-store-product",
          "Definir producto y cliente",
          "Registrar qué vende, a quién y qué problema resuelve.",
          "Miembro",
          "5 min",
          "Idea, producto o catálogo",
          "Propuesta básica",
        ),
        workflowStep(
          "member-store-economics",
          "Registrar operación",
          "Capturar proveedor, costo, precio, margen, entrega y stock conocido.",
          "Miembro",
          "8 min",
          "Datos comerciales",
          "Economía visible sin supuestos",
        ),
        workflowStep(
          "member-store-brand",
          "Definir identidad",
          "Elegir nombre, paleta, estilo, logo y referencias.",
          "Miembro + Smart Agent",
          "7 min",
          "Referencias visuales",
          "Dirección de marca",
        ),
        workflowStep(
          "member-store-channel",
          "Elegir canal",
          "Seleccionar tienda, redes o marketplace según fase y recursos.",
          "Smart Agent",
          "5 min",
          "Objetivo y capacidad",
          "Canal recomendado",
        ),
        workflowStep(
          "member-store-handoff",
          "Entregar brief",
          "Enviar medios, formulario y preguntas abiertas al equipo para QA.",
          "Miembro",
          "5 min",
          "Brief y archivos",
          "Paquete listo para Team",
        ),
      ],
    },
  ];
}

export function loadWorkflows(): AgentWorkflow[] {
  if (typeof window === "undefined") return createDefaultWorkflows();
  try {
    const stored = localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (!stored) return createDefaultWorkflows();
    const parsed = JSON.parse(stored) as AgentWorkflow[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : createDefaultWorkflows();
  } catch {
    return createDefaultWorkflows();
  }
}

export function saveWorkflows(workflows: AgentWorkflow[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(workflows));
  window.dispatchEvent(new CustomEvent("bg-workflows-updated"));
}

export function loadMediaMetadata(): MediaMetadata[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as MediaMetadata[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadNotebooks(): MediaNotebook[] {
  if (typeof window === "undefined") return createDefaultNotebooks();
  try {
    const stored = localStorage.getItem(NOTEBOOK_STORAGE_KEY);
    if (!stored) return createDefaultNotebooks();
    const parsed = JSON.parse(stored) as MediaNotebook[];
    const defaults = createDefaultNotebooks();
    if (!Array.isArray(parsed) || parsed.length === 0) return defaults;
    return [
      ...parsed,
      ...defaults.filter(
        (defaultNotebook) =>
          !parsed.some((notebook) => notebook.id === defaultNotebook.id),
      ),
    ];
  } catch {
    return createDefaultNotebooks();
  }
}

export function saveNotebooks(notebooks: MediaNotebook[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTEBOOK_STORAGE_KEY, JSON.stringify(notebooks));
  window.dispatchEvent(new CustomEvent("bg-notebooks-updated"));
}

function saveMediaMetadata(items: MediaMetadata[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("bg-media-updated"));
}

function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(MEDIA_DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(MEDIA_STORE_NAME)) {
        database.createObjectStore(MEDIA_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveMediaBlob(id: string, file: Blob) {
  const database = await openMediaDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(MEDIA_STORE_NAME, "readwrite");
    transaction.objectStore(MEDIA_STORE_NAME).put(file, id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export async function getMediaBlob(id: string): Promise<Blob | null> {
  const database = await openMediaDatabase();
  const result = await new Promise<Blob | null>((resolve, reject) => {
    const transaction = database.transaction(MEDIA_STORE_NAME, "readonly");
    const request = transaction.objectStore(MEDIA_STORE_NAME).get(id);
    request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return result;
}

async function deleteMediaBlob(id: string) {
  const database = await openMediaDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(MEDIA_STORE_NAME, "readwrite");
    transaction.objectStore(MEDIA_STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function extractTextExcerpt(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const readableExtensions = new Set([
    "txt",
    "md",
    "csv",
    "json",
    "xml",
    "html",
    "css",
    "js",
    "ts",
    "tsx",
    "jsx",
    "yaml",
    "yml",
  ]);
  if (
    file.size > 2 * 1024 * 1024 ||
    (!file.type.startsWith("text/") &&
      !file.type.includes("json") &&
      !readableExtensions.has(extension))
  ) {
    return "";
  }
  try {
    return (await file.text()).slice(0, 20000);
  } catch {
    return "";
  }
}

export async function storeMediaFiles(
  files: File[],
  options: {
    profile: MediaProfile;
    category: MediaCategory;
    linkedWorkflowIds?: string[];
    linkedTaskIds?: string[];
    linkedSubtaskIds?: string[];
    source?: MediaSource;
  },
): Promise<{
  items: MediaMetadata[];
  rejected: { name: string; reason: string }[];
}> {
  const items: MediaMetadata[] = [];
  const rejected: { name: string; reason: string }[] = [];

  for (const file of files) {
    if (file.size > MAX_LOCAL_FILE_SIZE) {
      rejected.push({
        name: file.name,
        reason: "Supera el límite local de 100 MB; agrega un enlace.",
      });
      continue;
    }
    const id = `media-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    try {
      await saveMediaBlob(id, file);
      const contentExcerpt = await extractTextExcerpt(file);
      items.push({
        id,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        uploadedAt: new Date().toISOString(),
        profile: options.profile,
        category: options.category,
        source: options.source ?? "device",
        knowledgeStatus: "inbox",
        tags: [],
        contentExcerpt,
        notes: "",
        linkedWorkflowIds: options.linkedWorkflowIds ?? [],
        linkedTaskIds: options.linkedTaskIds ?? [],
        linkedSubtaskIds: options.linkedSubtaskIds ?? [],
      });
    } catch {
      rejected.push({
        name: file.name,
        reason: "El navegador no pudo guardar el archivo.",
      });
    }
  }

  if (items.length > 0) {
    saveMediaMetadata([...loadMediaMetadata(), ...items]);
  }
  return { items, rejected };
}

export function addExternalMedia(
  name: string,
  externalUrl: string,
  options: {
    profile: MediaProfile;
    category: MediaCategory;
    linkedWorkflowIds?: string[];
    linkedTaskIds?: string[];
    linkedSubtaskIds?: string[];
  },
): MediaMetadata {
  const entry: MediaMetadata = {
    id: `media-link-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    type: "text/uri-list",
    size: 0,
    uploadedAt: new Date().toISOString(),
    profile: options.profile,
    category: options.category,
    source: "link",
    knowledgeStatus: "inbox",
    tags: [],
    contentExcerpt: "",
    notes: "",
    externalUrl,
    linkedWorkflowIds: options.linkedWorkflowIds ?? [],
    linkedTaskIds: options.linkedTaskIds ?? [],
    linkedSubtaskIds: options.linkedSubtaskIds ?? [],
  };
  saveMediaMetadata([...loadMediaMetadata(), entry]);
  return entry;
}

export function updateMediaMetadata(entry: MediaMetadata) {
  saveMediaMetadata(
    loadMediaMetadata().map((item) => (item.id === entry.id ? entry : item)),
  );
}

export function linkMediaToContext(
  entry: MediaMetadata,
  options: {
    linkedWorkflowIds?: string[];
    linkedTaskIds?: string[];
    linkedSubtaskIds?: string[];
  },
): MediaMetadata {
  const updated: MediaMetadata = {
    ...entry,
    linkedWorkflowIds: Array.from(
      new Set([
        ...entry.linkedWorkflowIds,
        ...(options.linkedWorkflowIds ?? []),
      ]),
    ),
    linkedTaskIds: Array.from(
      new Set([...entry.linkedTaskIds, ...(options.linkedTaskIds ?? [])]),
    ),
    linkedSubtaskIds: Array.from(
      new Set([
        ...(entry.linkedSubtaskIds ?? []),
        ...(options.linkedSubtaskIds ?? []),
      ]),
    ),
  };
  updateMediaMetadata(updated);
  return updated;
}

export async function removeMedia(entry: MediaMetadata) {
  if (!entry.externalUrl) {
    try {
      await deleteMediaBlob(entry.id);
    } catch {
      // Metadata can still be removed if the local blob is already unavailable.
    }
  }
  saveMediaMetadata(
    loadMediaMetadata().filter((item) => item.id !== entry.id),
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "Enlace";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
