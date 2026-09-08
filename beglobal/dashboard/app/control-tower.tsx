"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CirclePlus,
  ClipboardList,
  KanbanSquare,
  Link as LinkIcon,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ProfileContributionIntelligence from "./profile-contribution-intelligence";

type ProjectStatus =
  | "Idea"
  | "Priorizado"
  | "Planificación"
  | "Ejecución"
  | "Bloqueado"
  | "Revisión"
  | "Completado";
type TaskStatus = "Backlog" | "Ready" | "In Progress" | "Blocked" | "Review" | "Done";
type Priority = "Alta" | "Media" | "Baja";
type RiskLevel = "Verde" | "Amarillo" | "Rojo";

type Project = {
  id: string;
  name: string;
  objective: string;
  owner: string;
  status: ProjectStatus;
  priority: Priority;
  risk: RiskLevel;
  targetDate: string;
  nextAction: string;
  updatedAt: string;
  source?: string;
  href?: string;
  type?: string;
  stack?: string;
  catalogStatus?: string;
};

type Task = {
  id: string;
  projectId: string;
  title: string;
  owner: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  evidence: string;
  blockedReason: string;
  updatedAt: string;
  source?: string;
  href?: string;
  type?: string;
  stack?: string;
  catalogStatus?: string;
};

type ActivityItem = {
  id: string;
  message: string;
  createdAt: string;
};

const projectStatuses: ProjectStatus[] = [
  "Idea",
  "Priorizado",
  "Planificación",
  "Ejecución",
  "Bloqueado",
  "Revisión",
  "Completado",
];
const taskStatuses: TaskStatus[] = ["Backlog", "Ready", "In Progress", "Blocked", "Review", "Done"];
const priorities: Priority[] = ["Alta", "Media", "Baja"];
const riskLevels: RiskLevel[] = ["Verde", "Amarillo", "Rojo"];

const initialProjects: Project[] = [
  {
    id: "p-control-tower",
    name: "Torre de Control Operativa",
    objective: "Centralizar proyectos, tareas, riesgos y evidencia en tiempo real.",
    owner: "Softvibes / PM",
    status: "Ejecución",
    priority: "Alta",
    risk: "Amarillo",
    targetDate: "2026-08-18",
    nextAction: "Validar MVP y conectar persistencia real.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p-beglobal-pilot",
    name: "Be Global Pilot Control",
    objective: "Dar seguimiento al piloto, perfiles, onboarding y riesgos.",
    owner: "Equipo Be Global",
    status: "Planificación",
    priority: "Alta",
    risk: "Rojo",
    targetDate: "2026-08-25",
    nextAction: "Cerrar decisiones críticas del piloto.",
    updatedAt: new Date().toISOString(),
  },
];


const softvibesKnowledge = {
  repo: "https://github.com/softvibeslab/SoftvibesSites.git",
  commit: "5bd33841",
  catalogProjects: 37,
  graphNodes: 2167,
  graphEdges: 3427,
  graphCommunities: 325,
  knowledgePath:
    "/root/.hermes/profiles/project-manager-vibes/workspace/knowledge/softvibes-sites",
};

const softvibesProjects: Project[] = [
  {
    "id": "sv-beervibes",
    "name": "BeerVibes",
    "objective": "Concepto de producto para experiencias y operación cervecera.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "BeerVibes/README.md",
    "type": "producto",
    "stack": "concepto",
    "catalogStatus": "idea"
  },
  {
    "id": "sv-menuvibes",
    "name": "MenuVibes",
    "objective": "Plataforma whitelabel para menús QR, pedidos, lealtad y NPS.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Completado",
    "priority": "Alta",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Proteger producción, revisar cambios locales y definir checklist de release.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "MenuVibes/index.html",
    "type": "producto",
    "stack": "HTML · JavaScript · Supabase",
    "catalogStatus": "producción"
  },
  {
    "id": "sv-menuvibes-private",
    "name": "MenuVibes Private",
    "objective": "Extensiones privadas y operación interna de MenuVibes.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "MenuVibes-private/",
    "type": "producto",
    "stack": "web",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-moneyprinterv2",
    "name": "MoneyPrinterV2",
    "objective": "Automatización de publicación, afiliados y generación de ingresos.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "MoneyPrinterV2/README.md",
    "type": "herramienta",
    "stack": "Python",
    "catalogStatus": "referencia"
  },
  {
    "id": "sv-musicsites",
    "name": "MusicSites",
    "objective": "Colección de experiencias web para proyectos musicales.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "MusicSites/",
    "type": "cliente",
    "stack": "web · media",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-agency-agents",
    "name": "Agency Agents",
    "objective": "Biblioteca externa de perfiles y procesos para agentes.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "agency-agents/README.md",
    "type": "herramienta",
    "stack": "Markdown",
    "catalogStatus": "referencia"
  },
  {
    "id": "sv-anlisis-atelier-noisette",
    "name": "Análisis Atelier Noisette",
    "objective": "Diagnóstico público y landing de conversión para una propuesta de repostería artesanal.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Convertir diagnóstico en propuesta o backlog accionable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "atelier-noisette/site/analisis/index.html",
    "type": "análisis",
    "stack": "HTML · CSS",
    "catalogStatus": "análisis"
  },
  {
    "id": "sv-anlisis-colegios-875",
    "name": "Análisis Colegios 875",
    "objective": "Diagnóstico y oportunidades digitales para Colegios 875.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Convertir diagnóstico en propuesta o backlog accionable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "analisis-colegios875/index.html",
    "type": "análisis",
    "stack": "HTML",
    "catalogStatus": "análisis"
  },
  {
    "id": "sv-anlisis-fabiola",
    "name": "Análisis Fabiola",
    "objective": "Investigación de la oferta Mujer Puente → Mujer Montaña.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Convertir diagnóstico en propuesta o backlog accionable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "analisis-fabiola/index.html",
    "type": "análisis",
    "stack": "HTML",
    "catalogStatus": "análisis"
  },
  {
    "id": "sv-anlisis-vivemar",
    "name": "Análisis Vivemar",
    "objective": "Diagnóstico comercial y digital de Vivemar.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Convertir diagnóstico en propuesta o backlog accionable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "analisis-vivemar/index.html",
    "type": "análisis",
    "stack": "HTML",
    "catalogStatus": "análisis"
  },
  {
    "id": "sv-awesome-cursor-rules",
    "name": "Awesome Cursor Rules",
    "objective": "Reglas externas para asistentes de código.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "awesome-cursorrules/README.md",
    "type": "herramienta",
    "stack": "Markdown · Node.js",
    "catalogStatus": "referencia"
  },
  {
    "id": "sv-codex-design-skill",
    "name": "Codex Design Skill",
    "objective": "Habilidad externa para flujos de diseño asistido.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "codex-design-skill/README.md",
    "type": "herramienta",
    "stack": "Markdown",
    "catalogStatus": "referencia"
  },
  {
    "id": "sv-colegios-875",
    "name": "Colegios 875",
    "objective": "Sitio comercial, conocimiento y agente de voz para el colegio.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Alta",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Validar datos, terminar sitio y revisar agente Vapi con evidencia.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "colegios-875/index.html",
    "type": "cliente",
    "stack": "HTML · JavaScript · Vapi",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-contenido-fabiola",
    "name": "Contenido Fabiola",
    "objective": "Mensajes, materiales y activos de la oferta de Fabiola.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "contenido-fabiola/",
    "type": "contenido",
    "stack": "Markdown · media",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-diana-yoga-life",
    "name": "Diana Yoga Life",
    "objective": "Landing y contenido audiovisual para Diana Yoga Life.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "diana-yoga-life/index.html",
    "type": "cliente",
    "stack": "HTML · media",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-diana-velas-love",
    "name": "Diana Velas Love",
    "objective": "Análisis público, catálogo artesanal, pedidos por WhatsApp y CMS seguro.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "diana-velas-love/",
    "type": "cliente",
    "stack": "Astro · PHP · CMS",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-emir24-fit",
    "name": "Emir24 Fit",
    "objective": "Análisis público, landing de coaching y CMS seguro para Emir Morales.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "emir24-fit/",
    "type": "cliente",
    "stack": "Astro · PHP · CMS",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-fabiola-mvp",
    "name": "Fabiola MVP",
    "objective": "MVP web y administrativo de Mujer Puente → Mujer Montaña.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Alta",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Coordinar análisis, contenido y MVP con captación opt-in.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "fabiola-mvp/index.html",
    "type": "cliente",
    "stack": "HTML · PHP",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-hopepaoo",
    "name": "Hopepaoo",
    "objective": "Análisis público de Instagram, landing artística y editor local para Paola Elizabeth.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "hopepaoo/index.html",
    "type": "cliente",
    "stack": "HTML · JavaScript · CMS local",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-karla-duarte-cirujana",
    "name": "Karla Duarte Cirujana",
    "objective": "Sitio médico, CMS, enlaces y materiales comerciales.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "karla-duarte-cirujana/",
    "type": "cliente",
    "stack": "HTML · PHP · media",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-klh-hub-de-rentas",
    "name": "KLH · Hub de rentas",
    "objective": "Análisis digital, inventario bilingüe con filtros, fichas permanentes y WhatsApp contextual.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "klh-hub-rentas/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-laura-luna-broker-landing-personal",
    "name": "Laura Luna Broker · Landing personal",
    "objective": "Análisis de presencia y landing bilingüe con acreditación SEDETUS, respaldo de Grupo 28 y WhatsApp atribuible.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "laura-luna-broker/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-media-vivemar",
    "name": "Media Vivemar",
    "objective": "Archivo de recursos audiovisuales de Vivemar.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "media-archivo-vivemar/",
    "type": "archivo",
    "stack": "imágenes · video",
    "catalogStatus": "archivo"
  },
  {
    "id": "sv-mnica-arteaga-dk-del-karibe",
    "name": "Mónica Arteaga × DK del Karibe",
    "objective": "Marca personal bilingüe en sinergia con DK del Karibe, con DK44 como campaña destacada y WhatsApp atribuible.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "monica-arteaga-dkdelkaribe/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-ocean-caribbean-mexico-playacar",
    "name": "Ocean Caribbean Mexico · Playacar",
    "objective": "Análisis digital y landing bilingüe individual para una residencia premium en Playacar.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "ocean-caribbean-playacar/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-output",
    "name": "Output",
    "objective": "Salidas y entregables generados por procesos locales.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "output/",
    "type": "archivo",
    "stack": "entregables",
    "catalogStatus": "archivo"
  },
  {
    "id": "sv-outputs",
    "name": "Outputs",
    "objective": "Segunda carpeta histórica de resultados generados.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "outputs/",
    "type": "archivo",
    "stack": "entregables",
    "catalogStatus": "archivo"
  },
  {
    "id": "sv-playbook-mvp",
    "name": "Playbook MVP",
    "objective": "Guía para diseñar y lanzar MVP de Softvibes.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "playbook-mvp/README.md",
    "type": "documentación",
    "stack": "Markdown",
    "catalogStatus": "referencia"
  },
  {
    "id": "sv-propuesta-colegios-875",
    "name": "Propuesta Colegios 875",
    "objective": "Propuesta comercial navegable para Colegios 875.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Convertir diagnóstico en propuesta o backlog accionable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "propuesta-colegios875/index.html",
    "type": "análisis",
    "stack": "HTML",
    "catalogStatus": "análisis"
  },
  {
    "id": "sv-redirect-vivemar",
    "name": "Redirect Vivemar",
    "objective": "Redirección ligera del dominio o rutas de Vivemar.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Completado",
    "priority": "Alta",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Mantener estable; revisar solo con checklist y evidencia.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "redirect-vivemar/index.html",
    "type": "infraestructura",
    "stack": "HTML",
    "catalogStatus": "producción"
  },
  {
    "id": "sv-skills",
    "name": "Skills",
    "objective": "Colección externa de habilidades reutilizables para agentes.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Idea",
    "priority": "Baja",
    "risk": "Verde",
    "targetDate": "",
    "nextAction": "Clasificar prioridad y confirmar si sigue activo.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "skills/README.md",
    "type": "herramienta",
    "stack": "Markdown · scripts",
    "catalogStatus": "referencia"
  },
  {
    "id": "sv-smooth-group",
    "name": "Smooth Group",
    "objective": "Sitio web de Smooth Group.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "smooth-group/index.html",
    "type": "cliente",
    "stack": "HTML",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-softvibes-agentes",
    "name": "Softvibes Agentes",
    "objective": "Identidad SER y arquitectura padre-hijo de agentes Softvibes.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Alta",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Usar softvibes-ser.md como identidad padre para agentes derivados.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "softvibes-agentes/softvibes-ser.md",
    "type": "agente",
    "stack": "Markdown · Hermes",
    "catalogStatus": "activo"
  },
  {
    "id": "sv-softvibes-funnel",
    "name": "Softvibes Funnel",
    "objective": "Activos y experimentos del embudo comercial de Softvibes.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "softvibes-funnel/",
    "type": "producto",
    "stack": "web",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-tania-g-o-inventario-bilinge",
    "name": "Tania G.O. · Inventario bilingüe",
    "objective": "Micrositio personal con 16 publicaciones, filtros bilingües y WhatsApp contextual por propiedad.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Media",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar README/estado y definir siguiente entrega verificable.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "tania-go-inventario/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-vivemar",
    "name": "Vivemar",
    "objective": "Sitio inmobiliario con propiedades, zonas SEO, blog y contacto.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ejecución",
    "priority": "Alta",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Comparar con Vivemar Alt y proponer versión canónica sin borrar ninguna.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "vivemar/README.md",
    "type": "cliente",
    "stack": "Astro · TypeScript · PHP",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "sv-vivemar-alt",
    "name": "Vivemar Alt",
    "objective": "Implementación alternativa; falta decidir cuál versión será canónica.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Revisión",
    "priority": "Alta",
    "risk": "Amarillo",
    "targetDate": "",
    "nextAction": "Revisar diferencias contra Vivemar y documentar decisión pendiente.",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "vivemar-alt/README.md",
    "type": "cliente",
    "stack": "Astro · TypeScript",
    "catalogStatus": "revisión"
  }
];

const softvibesTasks: Task[] = [
  {
    "id": "svt-beervibes",
    "projectId": "sv-beervibes",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → BeerVibes/README.md; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "BeerVibes/README.md",
    "type": "producto",
    "stack": "concepto",
    "catalogStatus": "idea"
  },
  {
    "id": "svt-menuvibes",
    "projectId": "sv-menuvibes",
    "title": "Proteger producción, revisar cambios locales y definir checklist de release.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Done",
    "priority": "Alta",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → MenuVibes/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "MenuVibes/index.html",
    "type": "producto",
    "stack": "HTML · JavaScript · Supabase",
    "catalogStatus": "producción"
  },
  {
    "id": "svt-menuvibes-private",
    "projectId": "sv-menuvibes-private",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → MenuVibes-private/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "MenuVibes-private/",
    "type": "producto",
    "stack": "web",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-moneyprinterv2",
    "projectId": "sv-moneyprinterv2",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → MoneyPrinterV2/README.md; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "MoneyPrinterV2/README.md",
    "type": "herramienta",
    "stack": "Python",
    "catalogStatus": "referencia"
  },
  {
    "id": "svt-musicsites",
    "projectId": "sv-musicsites",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → MusicSites/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "MusicSites/",
    "type": "cliente",
    "stack": "web · media",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-agency-agents",
    "projectId": "sv-agency-agents",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → agency-agents/README.md; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "agency-agents/README.md",
    "type": "herramienta",
    "stack": "Markdown",
    "catalogStatus": "referencia"
  },
  {
    "id": "svt-anlisis-atelier-noisette",
    "projectId": "sv-anlisis-atelier-noisette",
    "title": "Convertir diagnóstico en propuesta o backlog accionable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ready",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → atelier-noisette/site/analisis/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "atelier-noisette/site/analisis/index.html",
    "type": "análisis",
    "stack": "HTML · CSS",
    "catalogStatus": "análisis"
  },
  {
    "id": "svt-anlisis-colegios-875",
    "projectId": "sv-anlisis-colegios-875",
    "title": "Convertir diagnóstico en propuesta o backlog accionable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ready",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → analisis-colegios875/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "analisis-colegios875/index.html",
    "type": "análisis",
    "stack": "HTML",
    "catalogStatus": "análisis"
  },
  {
    "id": "svt-anlisis-fabiola",
    "projectId": "sv-anlisis-fabiola",
    "title": "Convertir diagnóstico en propuesta o backlog accionable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ready",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → analisis-fabiola/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "analisis-fabiola/index.html",
    "type": "análisis",
    "stack": "HTML",
    "catalogStatus": "análisis"
  },
  {
    "id": "svt-anlisis-vivemar",
    "projectId": "sv-anlisis-vivemar",
    "title": "Convertir diagnóstico en propuesta o backlog accionable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ready",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → analisis-vivemar/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "analisis-vivemar/index.html",
    "type": "análisis",
    "stack": "HTML",
    "catalogStatus": "análisis"
  },
  {
    "id": "svt-awesome-cursor-rules",
    "projectId": "sv-awesome-cursor-rules",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → awesome-cursorrules/README.md; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "awesome-cursorrules/README.md",
    "type": "herramienta",
    "stack": "Markdown · Node.js",
    "catalogStatus": "referencia"
  },
  {
    "id": "svt-codex-design-skill",
    "projectId": "sv-codex-design-skill",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → codex-design-skill/README.md; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "codex-design-skill/README.md",
    "type": "herramienta",
    "stack": "Markdown",
    "catalogStatus": "referencia"
  },
  {
    "id": "svt-colegios-875",
    "projectId": "sv-colegios-875",
    "title": "Validar datos, terminar sitio y revisar agente Vapi con evidencia.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Alta",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → colegios-875/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "colegios-875/index.html",
    "type": "cliente",
    "stack": "HTML · JavaScript · Vapi",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-contenido-fabiola",
    "projectId": "sv-contenido-fabiola",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → contenido-fabiola/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "contenido-fabiola/",
    "type": "contenido",
    "stack": "Markdown · media",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-diana-yoga-life",
    "projectId": "sv-diana-yoga-life",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → diana-yoga-life/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "diana-yoga-life/index.html",
    "type": "cliente",
    "stack": "HTML · media",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-diana-velas-love",
    "projectId": "sv-diana-velas-love",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → diana-velas-love/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "diana-velas-love/",
    "type": "cliente",
    "stack": "Astro · PHP · CMS",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-emir24-fit",
    "projectId": "sv-emir24-fit",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → emir24-fit/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "emir24-fit/",
    "type": "cliente",
    "stack": "Astro · PHP · CMS",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-fabiola-mvp",
    "projectId": "sv-fabiola-mvp",
    "title": "Coordinar análisis, contenido y MVP con captación opt-in.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Alta",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → fabiola-mvp/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "fabiola-mvp/index.html",
    "type": "cliente",
    "stack": "HTML · PHP",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-hopepaoo",
    "projectId": "sv-hopepaoo",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → hopepaoo/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "hopepaoo/index.html",
    "type": "cliente",
    "stack": "HTML · JavaScript · CMS local",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-karla-duarte-cirujana",
    "projectId": "sv-karla-duarte-cirujana",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → karla-duarte-cirujana/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "karla-duarte-cirujana/",
    "type": "cliente",
    "stack": "HTML · PHP · media",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-klh-hub-de-rentas",
    "projectId": "sv-klh-hub-de-rentas",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → klh-hub-rentas/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "klh-hub-rentas/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-laura-luna-broker-landing-personal",
    "projectId": "sv-laura-luna-broker-landing-personal",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → laura-luna-broker/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "laura-luna-broker/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-media-vivemar",
    "projectId": "sv-media-vivemar",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → media-archivo-vivemar/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "media-archivo-vivemar/",
    "type": "archivo",
    "stack": "imágenes · video",
    "catalogStatus": "archivo"
  },
  {
    "id": "svt-mnica-arteaga-dk-del-karibe",
    "projectId": "sv-mnica-arteaga-dk-del-karibe",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → monica-arteaga-dkdelkaribe/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "monica-arteaga-dkdelkaribe/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-ocean-caribbean-mexico-playacar",
    "projectId": "sv-ocean-caribbean-mexico-playacar",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → ocean-caribbean-playacar/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "ocean-caribbean-playacar/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-output",
    "projectId": "sv-output",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → output/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "output/",
    "type": "archivo",
    "stack": "entregables",
    "catalogStatus": "archivo"
  },
  {
    "id": "svt-outputs",
    "projectId": "sv-outputs",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → outputs/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "outputs/",
    "type": "archivo",
    "stack": "entregables",
    "catalogStatus": "archivo"
  },
  {
    "id": "svt-playbook-mvp",
    "projectId": "sv-playbook-mvp",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → playbook-mvp/README.md; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "playbook-mvp/README.md",
    "type": "documentación",
    "stack": "Markdown",
    "catalogStatus": "referencia"
  },
  {
    "id": "svt-propuesta-colegios-875",
    "projectId": "sv-propuesta-colegios-875",
    "title": "Convertir diagnóstico en propuesta o backlog accionable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Ready",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → propuesta-colegios875/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "propuesta-colegios875/index.html",
    "type": "análisis",
    "stack": "HTML",
    "catalogStatus": "análisis"
  },
  {
    "id": "svt-redirect-vivemar",
    "projectId": "sv-redirect-vivemar",
    "title": "Mantener estable; revisar solo con checklist y evidencia.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Done",
    "priority": "Alta",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → redirect-vivemar/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "redirect-vivemar/index.html",
    "type": "infraestructura",
    "stack": "HTML",
    "catalogStatus": "producción"
  },
  {
    "id": "svt-skills",
    "projectId": "sv-skills",
    "title": "Clasificar prioridad y confirmar si sigue activo.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Backlog",
    "priority": "Baja",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → skills/README.md; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "skills/README.md",
    "type": "herramienta",
    "stack": "Markdown · scripts",
    "catalogStatus": "referencia"
  },
  {
    "id": "svt-smooth-group",
    "projectId": "sv-smooth-group",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → smooth-group/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "smooth-group/index.html",
    "type": "cliente",
    "stack": "HTML",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-softvibes-agentes",
    "projectId": "sv-softvibes-agentes",
    "title": "Usar softvibes-ser.md como identidad padre para agentes derivados.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Alta",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → softvibes-agentes/softvibes-ser.md; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "softvibes-agentes/softvibes-ser.md",
    "type": "agente",
    "stack": "Markdown · Hermes",
    "catalogStatus": "activo"
  },
  {
    "id": "svt-softvibes-funnel",
    "projectId": "sv-softvibes-funnel",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → softvibes-funnel/; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "softvibes-funnel/",
    "type": "producto",
    "stack": "web",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-tania-g-o-inventario-bilinge",
    "projectId": "sv-tania-g-o-inventario-bilinge",
    "title": "Revisar README/estado y definir siguiente entrega verificable.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Media",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → tania-go-inventario/index.html; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "tania-go-inventario/index.html",
    "type": "cliente",
    "stack": "HTML · CSS · JavaScript",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-vivemar",
    "projectId": "sv-vivemar",
    "title": "Comparar con Vivemar Alt y proponer versión canónica sin borrar ninguna.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "In Progress",
    "priority": "Alta",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → vivemar/README.md; Graphify commit 5bd33841",
    "blockedReason": "",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "vivemar/README.md",
    "type": "cliente",
    "stack": "Astro · TypeScript · PHP",
    "catalogStatus": "desarrollo"
  },
  {
    "id": "svt-vivemar-alt",
    "projectId": "sv-vivemar-alt",
    "title": "Revisar diferencias contra Vivemar y documentar decisión pendiente.",
    "owner": "Softvibes / [owner: unassigned]",
    "status": "Review",
    "priority": "Alta",
    "dueDate": "",
    "evidence": "SoftvibesSites index.html → vivemar-alt/README.md; Graphify commit 5bd33841",
    "blockedReason": "Pendiente decisión canónica",
    "updatedAt": "2026-08-12T00:00:00.000Z",
    "source": "SoftvibesSites",
    "href": "vivemar-alt/README.md",
    "type": "cliente",
    "stack": "Astro · TypeScript",
    "catalogStatus": "revisión"
  }
];

const initialTasks: Task[] = [
  ...softvibesTasks,
  {
    id: "t-model",
    projectId: "p-control-tower",
    title: "Definir modelo de datos v1",
    owner: "PM / Tech",
    status: "Done",
    priority: "Alta",
    dueDate: "2026-08-12",
    evidence: "Modelo inicial incluido en dashboard.",
    blockedReason: "",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t-crud",
    projectId: "p-control-tower",
    title: "Crear CRUD local de proyectos y tareas",
    owner: "Tech",
    status: "Review",
    priority: "Alta",
    dueDate: "2026-08-13",
    evidence: "Pendiente de QA visual.",
    blockedReason: "",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t-kanban",
    projectId: "p-control-tower",
    title: "Implementar Kanban drag-and-drop",
    owner: "Tech",
    status: "In Progress",
    priority: "Alta",
    dueDate: "2026-08-14",
    evidence: "",
    blockedReason: "",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t-evidence-policy",
    projectId: "p-control-tower",
    title: "Bloquear Done sin evidencia",
    owner: "PM",
    status: "Ready",
    priority: "Media",
    dueDate: "2026-08-15",
    evidence: "",
    blockedReason: "",
    updatedAt: new Date().toISOString(),
  },
];

const seededProjects: Project[] = [...softvibesProjects, ...initialProjects];
const seededTasks: Task[] = [...softvibesTasks, ...initialTasks];

const emptyProject: Omit<Project, "id" | "updatedAt"> = {
  name: "",
  objective: "",
  owner: "[owner: unassigned]",
  status: "Idea",
  priority: "Media",
  risk: "Verde",
  targetDate: "",
  nextAction: "",
};

const emptyTask: Omit<Task, "id" | "updatedAt"> = {
  projectId: "p-control-tower",
  title: "",
  owner: "[owner: unassigned]",
  status: "Backlog",
  priority: "Media",
  dueDate: "",
  evidence: "",
  blockedReason: "",
};

const storageKey = "bg-control-tower-v2-softvibes";

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function formatDate(value: string) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short" }).format(
    new Date(value),
  );
}

function minutesAgo(value: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return "ahora";
  if (minutes === 1) return "hace 1 min";
  return `hace ${minutes} min`;
}

export default function ControlTower() {
  const [projects, setProjects] = useState<Project[]>(seededProjects);
  const [tasks, setTasks] = useState<Task[]>(seededTasks);
  const [activity, setActivity] = useState<ActivityItem[]>([
    { id: "a-1", message: "Torre de Control inicializada con datos semilla", createdAt: nowIso() },
  ]);
  const [projectDraft, setProjectDraft] = useState(emptyProject);
  const [taskDraft, setTaskDraft] = useState(emptyTask);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          projects: Project[];
          tasks: Task[];
          activity: ActivityItem[];
        };
        setProjects(parsed.projects);
        setTasks(parsed.tasks);
        setActivity(parsed.activity);
      }
    } catch {
      // Keep seed data if local storage is unavailable or corrupted.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify({ projects, tasks, activity }));
  }, [activity, hydrated, projects, tasks]);

  const activeProjects = projects.filter((project) => project.status !== "Completado").length;
  const blockedTasks = tasks.filter((task) => task.status === "Blocked").length;
  const doneTasks = tasks.filter((task) => task.status === "Done").length;
  const evidenceMissing = tasks.filter((task) => task.status === "Done" && !task.evidence.trim()).length;
  const overdueTasks = tasks.filter(
    (task) => task.dueDate && task.status !== "Done" && new Date(task.dueDate) < new Date(),
  ).length;
  const progress = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const softvibesControlTasks = tasks.filter((task) => task.source === "SoftvibesSites");
  const softvibesPriorityTasks = softvibesControlTasks.filter((task) => task.priority === "Alta");
  const softvibesByStatus = taskStatuses.map((status) => ({
    status,
    items: softvibesControlTasks.filter((task) => task.status === status),
  }));

  const tasksByStatus = useMemo(
    () => taskStatuses.map((status) => ({ status, items: tasks.filter((task) => task.status === status) })),
    [tasks],
  );

  const log = (message: string) => {
    setActivity((current) => [{ id: makeId("a"), message, createdAt: nowIso() }, ...current].slice(0, 12));
  };

  const saveProject = (event: FormEvent) => {
    event.preventDefault();
    if (!projectDraft.name.trim()) return;
    if (editingProjectId) {
      setProjects((current) =>
        current.map((project) =>
          project.id === editingProjectId ? { ...project, ...projectDraft, updatedAt: nowIso() } : project,
        ),
      );
      log(`Proyecto actualizado: ${projectDraft.name}`);
      setEditingProjectId(null);
    } else {
      const project = { ...projectDraft, id: makeId("p"), updatedAt: nowIso() };
      setProjects((current) => [project, ...current]);
      setTaskDraft((current) => ({ ...current, projectId: project.id }));
      log(`Proyecto creado: ${project.name}`);
    }
    setProjectDraft(emptyProject);
  };

  const editProject = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectDraft({
      name: project.name,
      objective: project.objective,
      owner: project.owner,
      status: project.status,
      priority: project.priority,
      risk: project.risk,
      targetDate: project.targetDate,
      nextAction: project.nextAction,
    });
  };

  const removeProject = (project: Project) => {
    setProjects((current) => current.filter((item) => item.id !== project.id));
    setTasks((current) => current.filter((task) => task.projectId !== project.id));
    log(`Proyecto eliminado: ${project.name}`);
  };

  const saveTask = (event: FormEvent) => {
    event.preventDefault();
    if (!taskDraft.title.trim()) return;
    if (taskDraft.status === "Done" && !taskDraft.evidence.trim()) {
      log(`Intento bloqueado: ${taskDraft.title} necesita evidencia para pasar a Done`);
      return;
    }
    if (editingTaskId) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTaskId ? { ...task, ...taskDraft, updatedAt: nowIso() } : task,
        ),
      );
      log(`Tarea actualizada: ${taskDraft.title}`);
      setEditingTaskId(null);
    } else {
      setTasks((current) => [{ ...taskDraft, id: makeId("t"), updatedAt: nowIso() }, ...current]);
      log(`Tarea creada: ${taskDraft.title}`);
    }
    setTaskDraft({ ...emptyTask, projectId: projects[0]?.id ?? "" });
  };

  const editTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskDraft({
      projectId: task.projectId,
      title: task.title,
      owner: task.owner,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      evidence: task.evidence,
      blockedReason: task.blockedReason,
    });
  };

  const removeTask = (task: Task) => {
    setTasks((current) => current.filter((item) => item.id !== task.id));
    log(`Tarea eliminada: ${task.title}`);
  };

  const moveTask = (taskId: string, status: TaskStatus) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    if (status === "Done" && !task.evidence.trim()) {
      log(`Movimiento bloqueado: ${task.title} requiere evidencia antes de Done`);
      return;
    }
    setTasks((current) =>
      current.map((item) => (item.id === taskId ? { ...item, status, updatedAt: nowIso() } : item)),
    );
    log(`Tarea movida a ${status}: ${task.title}`);
  };

  const projectName = (projectId: string) =>
    projects.find((project) => project.id === projectId)?.name ?? "Sin proyecto";

  return (
    <>
      <div className="tower-hero">
        <div>
          <p className="eyebrow">TORRE DE CONTROL</p>
          <h1>Control operativo con CRUD, Kanban y evidencia</h1>
          <p>
            Gestiona proyectos, tareas, responsables, bloqueos y entregables verificables desde una sola vista.
            Los datos persisten en este navegador vía localStorage; la siguiente fase es conectar API y base de datos.
          </p>
        </div>
        <div className="tower-live">
          <span className="live-dot" />
          Tiempo real local · {minutesAgo(activity[0]?.createdAt ?? nowIso())}
        </div>
      </div>

      <section className="tower-grid tower-kpis">
        <KpiCard icon={ClipboardList} label="Proyectos activos" value={activeProjects} detail={`${projects.length} totales`} />
        <KpiCard icon={KanbanSquare} label="Avance global" value={`${progress}%`} detail={`${doneTasks}/${tasks.length} tareas done`} />
        <KpiCard icon={AlertTriangle} label="Bloqueos" value={blockedTasks} detail={`${overdueTasks} vencidas`} tone="warning" />
        <KpiCard icon={CheckCircle2} label="Evidencia faltante" value={evidenceMissing} detail="Done sin prueba" tone={evidenceMissing ? "danger" : "success"} />
      </section>

      <ProfileContributionIntelligence />

      <section className="tower-panel softvibes-control-panel">
        <PanelTitle icon={KanbanSquare} title="Softvibes Sites · Kanban de 37 proyectos" />
        <div className="softvibes-summary-grid">
          <div><span>Catálogo</span><strong>{softvibesControlTasks.length}</strong><small>proyectos cargados</small></div>
          <div><span>Graphify</span><strong>{softvibesKnowledge.graphNodes}</strong><small>{softvibesKnowledge.graphEdges} conexiones</small></div>
          <div><span>Comunidades</span><strong>{softvibesKnowledge.graphCommunities}</strong><small>commit {softvibesKnowledge.commit}</small></div>
          <div><span>Alta prioridad</span><strong>{softvibesPriorityTasks.length}</strong><small>acciones sugeridas</small></div>
        </div>
        <div className="softvibes-priority-strip">
          {softvibesPriorityTasks.slice(0, 6).map((task) => (
            <article key={task.id}>
              <span>{task.catalogStatus} · {task.type}</span>
              <strong>{projectName(task.projectId)}</strong>
              <p>{task.title}</p>
            </article>
          ))}
        </div>
        <div className="softvibes-kanban">
          {softvibesByStatus.map((column) => (
            <div className="softvibes-column" key={column.status}>
              <div className="kanban-column-head"><strong>{column.status}</strong><span>{column.items.length}</span></div>
              {column.items.map((task) => (
                <article className="softvibes-card" key={task.id}>
                  <div className="card-row"><strong>{projectName(task.projectId)}</strong><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div>
                  <p>{task.title}</p>
                  <div className="card-meta"><span>{task.type}</span><span>{task.catalogStatus}</span></div>
                  <div className="softvibes-path">{task.href}</div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="tower-grid two-cols">
        <form className="tower-panel" onSubmit={saveProject}>
          <PanelTitle icon={CirclePlus} title={editingProjectId ? "Editar proyecto" : "Crear proyecto"} />
          <div className="tower-form-grid">
            <label>
              Nombre
              <input value={projectDraft.name} onChange={(event) => setProjectDraft({ ...projectDraft, name: event.target.value })} placeholder="Ej. Lanzamiento MVP" />
            </label>
            <label>
              Owner
              <input value={projectDraft.owner} onChange={(event) => setProjectDraft({ ...projectDraft, owner: event.target.value })} />
            </label>
            <label className="span-2">
              Objetivo
              <input value={projectDraft.objective} onChange={(event) => setProjectDraft({ ...projectDraft, objective: event.target.value })} placeholder="Resultado esperado" />
            </label>
            <SelectField label="Estado" value={projectDraft.status} options={projectStatuses} onChange={(value) => setProjectDraft({ ...projectDraft, status: value as ProjectStatus })} />
            <SelectField label="Prioridad" value={projectDraft.priority} options={priorities} onChange={(value) => setProjectDraft({ ...projectDraft, priority: value as Priority })} />
            <SelectField label="Riesgo" value={projectDraft.risk} options={riskLevels} onChange={(value) => setProjectDraft({ ...projectDraft, risk: value as RiskLevel })} />
            <label>
              Fecha objetivo
              <input type="date" value={projectDraft.targetDate} onChange={(event) => setProjectDraft({ ...projectDraft, targetDate: event.target.value })} />
            </label>
            <label className="span-2">
              Próxima acción
              <input value={projectDraft.nextAction} onChange={(event) => setProjectDraft({ ...projectDraft, nextAction: event.target.value })} placeholder="Siguiente paso concreto" />
            </label>
          </div>
          <div className="tower-actions">
            {editingProjectId && (
              <button type="button" className="ghost-button" onClick={() => { setEditingProjectId(null); setProjectDraft(emptyProject); }}>
                <X size={15} /> Cancelar
              </button>
            )}
            <button className="primary-button" type="submit"><Save size={15} /> Guardar proyecto</button>
          </div>
        </form>

        <form className="tower-panel" onSubmit={saveTask}>
          <PanelTitle icon={CirclePlus} title={editingTaskId ? "Editar tarea" : "Crear tarea"} />
          <div className="tower-form-grid">
            <label className="span-2">
              Título
              <input value={taskDraft.title} onChange={(event) => setTaskDraft({ ...taskDraft, title: event.target.value })} placeholder="Tarea accionable" />
            </label>
            <label>
              Proyecto
              <select value={taskDraft.projectId} onChange={(event) => setTaskDraft({ ...taskDraft, projectId: event.target.value })}>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </label>
            <label>
              Owner
              <input value={taskDraft.owner} onChange={(event) => setTaskDraft({ ...taskDraft, owner: event.target.value })} />
            </label>
            <SelectField label="Estado" value={taskDraft.status} options={taskStatuses} onChange={(value) => setTaskDraft({ ...taskDraft, status: value as TaskStatus })} />
            <SelectField label="Prioridad" value={taskDraft.priority} options={priorities} onChange={(value) => setTaskDraft({ ...taskDraft, priority: value as Priority })} />
            <label>
              Due date
              <input type="date" value={taskDraft.dueDate} onChange={(event) => setTaskDraft({ ...taskDraft, dueDate: event.target.value })} />
            </label>
            <label>
              Bloqueo
              <input value={taskDraft.blockedReason} onChange={(event) => setTaskDraft({ ...taskDraft, blockedReason: event.target.value })} placeholder="Si aplica" />
            </label>
            <label className="span-2">
              Evidencia
              <input value={taskDraft.evidence} onChange={(event) => setTaskDraft({ ...taskDraft, evidence: event.target.value })} placeholder="Link, captura, métrica o aprobación" />
            </label>
          </div>
          <div className="tower-actions">
            {editingTaskId && (
              <button type="button" className="ghost-button" onClick={() => { setEditingTaskId(null); setTaskDraft({ ...emptyTask, projectId: projects[0]?.id ?? "" }); }}>
                <X size={15} /> Cancelar
              </button>
            )}
            <button className="primary-button" type="submit"><Save size={15} /> Guardar tarea</button>
          </div>
        </form>
      </section>

      <section className="tower-panel">
        <PanelTitle icon={KanbanSquare} title="Pipeline / Kanban" />
        <div className="kanban-board">
          {tasksByStatus.map((column) => (
            <div
              className="kanban-column"
              key={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggingTaskId) moveTask(draggingTaskId, column.status);
                setDraggingTaskId(null);
              }}
            >
              <div className="kanban-column-head"><strong>{column.status}</strong><span>{column.items.length}</span></div>
              {column.items.map((task) => (
                <article className="kanban-card" draggable key={task.id} onDragStart={() => setDraggingTaskId(task.id)}>
                  <div className="card-row"><strong>{task.title}</strong><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div>
                  <p>{projectName(task.projectId)}</p>
                  <div className="card-meta"><span>{task.owner}</span><span>{formatDate(task.dueDate)}</span></div>
                  {task.blockedReason && <div className="blocked-note"><AlertTriangle size={13} />{task.blockedReason}</div>}
                  {task.evidence ? <div className="evidence-note"><LinkIcon size={13} />{task.evidence}</div> : <div className="missing-note">Evidencia pendiente</div>}
                  <div className="mini-actions">
                    <button type="button" onClick={() => editTask(task)}><Pencil size={13} />Editar</button>
                    <button type="button" onClick={() => removeTask(task)}><Trash2 size={13} />Eliminar</button>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="tower-grid two-cols">
        <div className="tower-panel">
          <PanelTitle icon={ClipboardList} title="CRUD de proyectos" />
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.id}>
                <div>
                  <div className="card-row"><strong>{project.name}</strong><span className={`risk ${project.risk.toLowerCase()}`}>{project.risk}</span></div>
                  <p>{project.objective}</p>
                  <small>{project.owner} · {project.status} · {formatDate(project.targetDate)} · {minutesAgo(project.updatedAt)}</small>
                  <em>Siguiente: {project.nextAction || "Sin próxima acción"}</em>
                  {project.source && <em>Fuente: {project.source} · {project.href}</em>}
                </div>
                <div className="row-actions">
                  <button type="button" onClick={() => editProject(project)}><Pencil size={14} /></button>
                  <button type="button" onClick={() => removeProject(project)}><Trash2 size={14} /></button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="tower-panel">
          <PanelTitle icon={Activity} title="Actividad en tiempo real" />
          <div className="activity-feed">
            {activity.map((item) => (
              <div className="activity-row" key={item.id}>
                <span />
                <div><strong>{item.message}</strong><small>{minutesAgo(item.createdAt)}</small></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "neutral",
}: {
  icon: typeof ClipboardList;
  label: string;
  value: string | number;
  detail: string;
  tone?: "neutral" | "warning" | "danger" | "success";
}) {
  return (
    <article className={`tower-kpi ${tone}`}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function PanelTitle({ icon: Icon, title }: { icon: typeof ClipboardList; title: string }) {
  return (
    <div className="tower-panel-title">
      <Icon size={18} />
      <h2>{title}</h2>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
