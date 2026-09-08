export type AccessRole = "owner" | "observer" | "member";
export type SpecialistRoute = "corporate" | "team" | "member";
export type UserStatus = "active" | "invited" | "paused";

export type ManagedUser = {
  id: string;
  name: string;
  contact: string;
  role: AccessRole;
  route: SpecialistRoute;
  status: UserStatus;
  lastActivity: string;
};

export const roleLabels: Record<AccessRole, string> = {
  owner: "Propietario",
  observer: "Administrador observador",
  member: "Miembro guiado",
};

export const routeLabels: Record<SpecialistRoute, string> = {
  corporate: "Corporate",
  team: "Team",
  member: "Member",
};

export const rolePolicies = [
  {
    role: "owner" as const,
    title: "Propietario",
    summary: "Control total del dashboard y sus usuarios.",
    permissions: ["Ver todo", "Gestionar usuarios", "Asignar rutas", "Aprobar configuración"],
  },
  {
    role: "observer" as const,
    title: "Administrador observador",
    summary: "Visibilidad global con cero capacidad de modificación.",
    permissions: ["Ver todos los usuarios", "Ver métricas", "Ver fuentes", "Exportar cortes"],
  },
  {
    role: "member" as const,
    title: "Miembro guiado",
    summary: "Espacio aislado para avanzar una misión por vez.",
    permissions: ["Ver su perfil", "Ver sus tareas", "Subir su evidencia", "Usar recursos aprobados"],
  },
];

export const seedUsers: ManagedUser[] = [
  {
    id: "owner-5791501756",
    name: "Propietario Be Global",
    contact: "Telegram · 5791501756",
    role: "owner",
    route: "corporate",
    status: "active",
    lastActivity: "2026-09-01T09:00:00.000Z",
  },
  {
    id: "observer-01",
    name: "Administrador por asignar",
    contact: "Invitación pendiente",
    role: "observer",
    route: "corporate",
    status: "invited",
    lastActivity: "2026-09-01T09:00:00.000Z",
  },
  {
    id: "member-pilot-01",
    name: "Miembro piloto 01",
    contact: "Onboarding pendiente",
    role: "member",
    route: "member",
    status: "invited",
    lastActivity: "2026-09-01T09:00:00.000Z",
  },
];

export function canManageUsers(role: AccessRole) {
  return role === "owner";
}

export function visibleUsers(users: ManagedUser[], role: AccessRole, viewerId: string) {
  if (role === "member") return users.filter((user) => user.id === viewerId);
  return users;
}
