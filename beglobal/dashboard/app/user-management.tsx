"use client";

import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Plus,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./user-management.module.css";
import {
  AccessRole,
  canManageUsers,
  ManagedUser,
  roleLabels,
  rolePolicies,
  routeLabels,
  seedUsers,
  SpecialistRoute,
  UserStatus,
  visibleUsers,
} from "./user-access-data";

const storageKey = "beglobal-orchestrator-users-v1";
const viewerIds: Record<AccessRole, string> = {
  owner: "owner-5791501756",
  observer: "observer-01",
  member: "member-pilot-01",
};
const statusLabels: Record<UserStatus, string> = {
  active: "Activo",
  invited: "Invitado",
  paused: "Pausado",
};

function makeId() {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function formatActivity(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function UserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>(seedUsers);
  const [viewerRole, setViewerRole] = useState<AccessRole>("owner");
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("Vista Propietario activa.");
  const [draft, setDraft] = useState({
    name: "",
    contact: "",
    role: "member" as AccessRole,
    route: "member" as SpecialistRoute,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed)) setUsers(parsed as ManagedUser[]);
      }
    } catch {
      setNotice("No se pudo leer el registro local; se restauró la base segura.");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify(users));
  }, [hydrated, users]);

  const viewerId = viewerIds[viewerRole];
  const canManage = canManageUsers(viewerRole);
  const scopedUsers = useMemo(
    () => visibleUsers(users, viewerRole, viewerId),
    [users, viewerId, viewerRole],
  );
  const activeCount = users.filter((user) => user.status === "active").length;
  const memberCount = users.filter((user) => user.role === "member").length;

  const changeView = (role: AccessRole) => {
    setViewerRole(role);
    setNotice(`Vista ${roleLabels[role]} activa. ${role === "owner" ? "Edición habilitada." : "Modo de solo lectura."}`);
  };

  const addUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage || !draft.name.trim()) return;
    const nextUser: ManagedUser = {
      id: makeId(),
      name: draft.name.trim(),
      contact: draft.contact.trim() || "Contacto pendiente",
      role: draft.role,
      route: draft.role === "member" ? "member" : draft.route,
      status: "invited",
      lastActivity: nowIso(),
    };
    setUsers((current) => [...current, nextUser]);
    setDraft({ name: "", contact: "", role: "member", route: "member" });
    setNotice(`${nextUser.name} fue agregado como ${roleLabels[nextUser.role]}.`);
  };

  const updateUser = (id: string, changes: Partial<ManagedUser>) => {
    if (!canManage) return;
    if (id === viewerIds.owner && (changes.role || changes.status === "paused")) {
      setNotice("Protección activa: el propietario principal no puede degradarse ni pausarse.");
      return;
    }
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, ...changes, lastActivity: nowIso() } : user,
      ),
    );
    setNotice("Usuario actualizado. El cambio quedó registrado localmente.");
  };

  return (
    <section className={styles.module} aria-labelledby="user-management-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>BE GLOBAL ORCHESTRATOR · CONTROL DE ACCESO</p>
          <h1 id="user-management-title">Personas visibles. Autoridad explícita.</h1>
          <p>
            Gestiona quién entra al ecosistema, qué ruta especialista recibe y qué puede ver.
            El miembro conserva un espacio aislado; el administrador observa sin modificar.
          </p>
        </div>
        <div className={styles.securityState}>
          <ShieldCheck size={18} />
          <div>
            <span>BASELINE RBAC</span>
            <strong>3 roles protegidos</strong>
            <small>Persistencia local · autenticación productiva pendiente</small>
          </div>
        </div>
      </div>

      <div className={styles.prototypeNotice} role="note">
        <LockKeyhole size={17} />
        <span>
          Esta versión demuestra permisos y gestión local. Antes de publicar debe conectarse a
          autenticación Telegram <code>initData</code> y almacenamiento del servidor.
        </span>
      </div>

      <div className={styles.viewBar}>
        <div>
          <span>SIMULAR ACCESO</span>
          <strong>Ver el dashboard como:</strong>
        </div>
        <div className={styles.segmented} aria-label="Seleccionar vista de acceso">
          {(Object.keys(roleLabels) as AccessRole[]).map((role) => (
            <button
              type="button"
              key={role}
              className={viewerRole === role ? styles.selected : ""}
              onClick={() => changeView(role)}
              aria-pressed={viewerRole === role}
            >
              {role === "owner" ? <UserCog size={16} /> : role === "observer" ? <Eye size={16} /> : <Users size={16} />}
              {roleLabels[role]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.metrics} aria-label="Resumen de usuarios">
        <article>
          <span>Usuarios registrados</span>
          <strong>{users.length}</strong>
          <small>Base local del orquestador</small>
        </article>
        <article>
          <span>Activos</span>
          <strong>{activeCount}</strong>
          <small>Acceso habilitado</small>
        </article>
        <article>
          <span>Miembros</span>
          <strong>{memberCount}</strong>
          <small>Aislamiento individual</small>
        </article>
        <article className={canManage ? styles.metricOpen : styles.metricLocked}>
          <span>Capacidad actual</span>
          <strong>{canManage ? "Editar" : "Lectura"}</strong>
          <small>{canManage ? "Propietario verificado en la simulación" : "Mutaciones bloqueadas"}</small>
        </article>
      </div>

      <div className={styles.layout}>
        <div className={styles.registry}>
          <div className={styles.sectionHead}>
            <div>
              <span>REGISTRO DE ACCESO</span>
              <h2>{viewerRole === "member" ? "Mi espacio" : "Usuarios del orquestador"}</h2>
            </div>
            <div className={styles.scopeBadge}>
              {viewerRole === "member" ? <EyeOff size={14} /> : <Eye size={14} />}
              {viewerRole === "member" ? "Solo datos propios" : "Visibilidad global"}
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Rol</th>
                  <th>Ruta</th>
                  <th>Estado</th>
                  <th>Actividad</th>
                </tr>
              </thead>
              <tbody>
                {scopedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                      <small>{user.contact}</small>
                    </td>
                    <td>
                      {canManage && user.id !== viewerIds.owner ? (
                        <select
                          aria-label={`Rol de ${user.name}`}
                          value={user.role}
                          onChange={(event) =>
                            updateUser(user.id, { role: event.target.value as AccessRole })
                          }
                        >
                          {(Object.keys(roleLabels) as AccessRole[]).map((role) => (
                            <option key={role} value={role}>{roleLabels[role]}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`${styles.rolePill} ${styles[user.role]}`}>{roleLabels[user.role]}</span>
                      )}
                    </td>
                    <td>
                      {canManage ? (
                        <select
                          aria-label={`Ruta de ${user.name}`}
                          value={user.route}
                          onChange={(event) =>
                            updateUser(user.id, { route: event.target.value as SpecialistRoute })
                          }
                        >
                          {(Object.keys(routeLabels) as SpecialistRoute[]).map((route) => (
                            <option key={route} value={route}>{routeLabels[route]}</option>
                          ))}
                        </select>
                      ) : (
                        <span>{routeLabels[user.route]}</span>
                      )}
                    </td>
                    <td>
                      {canManage && user.id !== viewerIds.owner ? (
                        <select
                          aria-label={`Estado de ${user.name}`}
                          value={user.status}
                          onChange={(event) =>
                            updateUser(user.id, { status: event.target.value as UserStatus })
                          }
                        >
                          {(Object.keys(statusLabels) as UserStatus[]).map((status) => (
                            <option key={status} value={status}>{statusLabels[status]}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={styles.status}><i data-status={user.status} />{statusLabels[user.status]}</span>
                      )}
                    </td>
                    <td><span className={styles.date}>{formatActivity(user.lastActivity)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {scopedUsers.length === 0 && (
            <div className={styles.empty}>No hay usuarios visibles dentro de este alcance.</div>
          )}
        </div>

        <aside className={styles.sidePanel}>
          {canManage ? (
            <form onSubmit={addUser} className={styles.form}>
              <div className={styles.formHead}>
                <Plus size={18} />
                <div><span>ACCIÓN DEL PROPIETARIO</span><h2>Agregar usuario</h2></div>
              </div>
              <label>
                Nombre
                <input
                  name="name"
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Ej. Responsable de operaciones…"
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Contacto o referencia
                <input
                  name="contact"
                  value={draft.contact}
                  onChange={(event) => setDraft((current) => ({ ...current, contact: event.target.value }))}
                  placeholder="Correo, Telegram o pendiente…"
                  autoComplete="off"
                />
              </label>
              <label>
                Rol de acceso
                <select
                  name="role"
                  value={draft.role}
                  onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value as AccessRole }))}
                >
                  {(Object.keys(roleLabels) as AccessRole[]).map((role) => (
                    <option key={role} value={role}>{roleLabels[role]}</option>
                  ))}
                </select>
              </label>
              <label>
                Ruta especialista
                <select
                  name="route"
                  value={draft.role === "member" ? "member" : draft.route}
                  disabled={draft.role === "member"}
                  onChange={(event) => setDraft((current) => ({ ...current, route: event.target.value as SpecialistRoute }))}
                >
                  {(Object.keys(routeLabels) as SpecialistRoute[]).map((route) => (
                    <option key={route} value={route}>{routeLabels[route]}</option>
                  ))}
                </select>
              </label>
              <button type="submit"><Plus size={16} /> Crear invitación local</button>
            </form>
          ) : (
            <div className={styles.readOnlyCard}>
              <LockKeyhole size={22} />
              <span>MODO PROTEGIDO</span>
              <h2>Solo lectura</h2>
              <p>
                Esta vista puede consultar su alcance, pero no crear usuarios ni cambiar roles,
                rutas o estados.
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className={styles.policySection}>
        <div className={styles.sectionHead}>
          <div><span>MATRIZ DE AUTORIDAD</span><h2>El perfil recomendado para cada persona</h2></div>
        </div>
        <div className={styles.policyGrid}>
          {rolePolicies.map((policy) => (
            <article key={policy.role} className={viewerRole === policy.role ? styles.policyActive : ""}>
              <div className={styles.policyIcon}>
                {policy.role === "owner" ? <UserCog size={20} /> : policy.role === "observer" ? <Eye size={20} /> : <Users size={20} />}
              </div>
              <span>{policy.title}</span>
              <h3>{policy.summary}</h3>
              <ul>
                {policy.permissions.map((permission) => (
                  <li key={permission}><Check size={13} />{permission}</li>
                ))}
              </ul>
              {policy.role === "member" && (
                <p className={styles.recommendation}>
                  Recomendación: “Miembro guiado” porque prioriza autonomía, privacidad y una misión tangible por vez.
                </p>
              )}
            </article>
          ))}
        </div>
      </div>

      <p className={styles.liveNotice} aria-live="polite">{notice}</p>
    </section>
  );
}
