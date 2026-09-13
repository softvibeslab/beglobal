"use strict";

const STATUSES = ["nuevo", "contactado", "inscrito", "socio", "baja"];
const loginScreen = document.querySelector("#login-screen");
const app = document.querySelector("#app");
const view = document.querySelector("#view");
const loginStatus = document.querySelector("#login-status");
let bearer = "";
let allLeads = [];
let catalogCtas = [];
let loadError = "";
const leadFilters = { q: "", status: "", cta: "", stage: "", phone: "", from: "", to: "" };

function mountPrefix() {
  const path = location.pathname;
  const index = path.indexOf("/equipo");
  return index > 0 ? path.slice(0, index) : "";
}

function pathURL(route) {
  return `${mountPrefix()}${route}`;
}

function apiURL(path) {
  return `${mountPrefix()}${path}`;
}

function currentRoute() {
  let rest = location.pathname.slice(mountPrefix().length) || "/";
  if (rest.length > 1 && rest.endsWith("/")) rest = rest.slice(0, -1);
  return rest || "/";
}

function parseRoute() {
  const parts = currentRoute().split("/").filter(Boolean);
  if (parts[0] !== "equipo") return { module: "leads", leadId: "" };
  const second = parts[1] || "resumen";
  if (second === "leads") return { module: "leads", leadId: parts[2] || "" };
  if (second === "pro") return { module: "pro", leadId: "" };
  if (second === "avances") return { module: "avances", leadId: "" };
  if (second === "kpis") return { module: "kpis", leadId: "" };
  if (second === "ajustes") return { module: "ajustes", leadId: "" };
  return { module: "resumen", leadId: "" };
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (bearer) headers.Authorization = `Bearer ${bearer}`;
  const response = await fetch(apiURL(path), { credentials: "include", ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    showLogin(options.announceAuth === false ? "" : (payload.error || "No autorizado."));
    throw new Error(payload.error || "No autorizado.");
  }
  if (!response.ok) throw new Error(payload.error || "El módulo no responde.");
  return payload;
}

function showLogin(message) {
  app.hidden = true;
  loginScreen.hidden = false;
  if (message) loginStatus.textContent = message;
}

function showApp() {
  loginScreen.hidden = true;
  app.hidden = false;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char]));
}

function formatDate(value) {
  if (!value) return "—";
  return String(value).slice(0, 16).replace("T", " ");
}

function ctaLabel(id) {
  const found = catalogCtas.find((item) => item.id === id);
  return found ? found.title : id || "—";
}

function wireNav() {
  document.querySelectorAll("[data-route]").forEach((link) => {
    link.setAttribute("href", pathURL(link.dataset.route));
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      go(link.dataset.route);
    });
  });
}

function markNav(module) {
  const key = module === "leads" ? "leads" : module;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === key);
  });
}

function go(route, replace = false) {
  const url = pathURL(route);
  if (replace) history.replaceState({}, "", url);
  else history.pushState({}, "", url);
  render().catch((error) => { view.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`; });
}

function skeleton() {
  view.innerHTML = `<div class="skeleton" aria-busy="true"><i></i><i></i><i></i></div>`;
}

async function refreshLeads() {
  loadError = "";
  try {
    const payload = await api("/api/equipo/leads", { announceAuth: false });
    allLeads = payload.leads || [];
  } catch (error) {
    loadError = error.message;
    allLeads = [];
  }
}

function applyLeadFilters(leads) {
  const q = leadFilters.q.trim().toLowerCase();
  return leads.filter((lead) => {
    if (leadFilters.status && lead.status !== leadFilters.status) return false;
    if (leadFilters.cta && lead.cta_id !== leadFilters.cta) return false;
    if (leadFilters.stage && lead.stage !== leadFilters.stage) return false;
    if (leadFilters.phone === "yes" && !lead.phone) return false;
    if (leadFilters.phone === "no" && lead.phone) return false;
    if (leadFilters.from && lead.created_at.slice(0, 10) < leadFilters.from) return false;
    if (leadFilters.to && lead.created_at.slice(0, 10) > leadFilters.to) return false;
    if (q) {
      const hay = `${lead.name} ${lead.email} ${lead.phone} ${lead.cta_id}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function daysAgo(iso, days) {
  return Date.now() - new Date(iso).getTime() <= days * 86400000;
}

function renderResumen() {
  const byStatus = Object.fromEntries(STATUSES.map((status) => [status, allLeads.filter((lead) => lead.status === status).length]));
  const week = allLeads.filter((lead) => daysAgo(lead.created_at, 7)).length;
  const queue = allLeads.filter((lead) => lead.status === "nuevo");
  view.innerHTML = `
    <div class="page-head">
      <h1>Resumen</h1>
      <p>Solo cifras con fuente en el store de leads. PRO, avances y KPIs de miembro aún no están instrumentados.</p>
    </div>
    ${loadError ? `<p class="empty">${escapeHtml(loadError)}</p>` : ""}
    <div class="stats">
      <div class="stat"><strong>${week}</strong><span>Leads nuevos 7 días</span></div>
      <div class="stat"><strong>${allLeads.length}</strong><span>Leads activos</span></div>
      <div class="stat"><strong>${byStatus.nuevo}</strong><span>Nuevos por atender</span></div>
      <div class="stat"><strong>${byStatus.contactado}</strong><span>Contactados</span></div>
    </div>
    <section class="card">
      <h2>Cola de hoy</h2>
      ${queue.length ? `<ul>${queue.map((lead) => `<li><a data-lead="${escapeHtml(lead.id)}" href="${pathURL(`/equipo/leads/${lead.id}`)}">${escapeHtml(lead.name || "Sin nombre")} · ${escapeHtml(lead.cta_id)}</a></li>`).join("")}</ul>` : `<p class="empty">No hay leads en estado nuevo.</p>`}
    </section>
    <p class="module-note">Sesiones PRO 24 h: sin fuente. Mini Apps F0 no alimenta este panel.</p>`;
}

function uniqueStages() {
  return [...new Set(allLeads.map((lead) => lead.stage).filter(Boolean))].sort();
}

function uniqueCtas() {
  return [...new Set(allLeads.map((lead) => lead.cta_id).filter(Boolean))];
}

function fillLeadRows() {
  const rows = applyLeadFilters(allLeads);
  const tbody = document.querySelector("#rows");
  const cards = document.querySelector("#cards");
  const empty = document.querySelector("#empty");
  if (!tbody || !cards || !empty) return;
  tbody.replaceChildren();
  cards.replaceChildren();
  empty.hidden = rows.length > 0;
  for (const lead of rows) {
    const href = pathURL(`/equipo/leads/${lead.id}`);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(formatDate(lead.created_at))}</td>
      <td>${escapeHtml(lead.name)}</td>
      <td>${escapeHtml(lead.email)}</td>
      <td>${escapeHtml(lead.phone)}</td>
      <td>${escapeHtml(ctaLabel(lead.cta_id))}</td>
      <td>${escapeHtml(lead.stage)}</td>
      <td><span class="pill ${escapeHtml(lead.status)}">${escapeHtml(lead.status)}</span></td>`;
    tr.addEventListener("click", () => go(`/equipo/leads/${lead.id}`));
    tr.addEventListener("keydown", (event) => {
      if (event.key === "Enter") go(`/equipo/leads/${lead.id}`);
    });
    tr.tabIndex = 0;
    tbody.append(tr);
    const item = document.createElement("a");
    item.className = "lead-item";
    item.href = href;
    item.innerHTML = `<strong>${escapeHtml(lead.name || "Sin nombre")}</strong>
      <span>${escapeHtml(lead.email)}</span>
      <span class="pill ${escapeHtml(lead.status)}">${escapeHtml(lead.status)}</span>`;
    item.addEventListener("click", (event) => {
      event.preventDefault();
      go(`/equipo/leads/${lead.id}`);
    });
    cards.append(item);
  }
}

function renderLeadsTable() {
  const stageOptions = uniqueStages().map((stage) => `<option value="${escapeHtml(stage)}">${escapeHtml(stage)}</option>`).join("");
  const ctaOptions = uniqueCtas().map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(ctaLabel(id))}</option>`).join("");
  view.innerHTML = `
    <div class="page-head">
      <h1>Leads</h1>
      <p>Alta con consentimiento en el chat público. Click en la fila abre la ficha.</p>
    </div>
    ${loadError ? `<p class="empty">${escapeHtml(loadError)}</p>` : ""}
    <div class="toolbar">
      <input id="q" type="search" placeholder="Buscar nombre, correo, teléfono o CTA" value="${escapeHtml(leadFilters.q)}">
      <select id="status" aria-label="Estado">
        <option value="">Todos los estados</option>
        ${STATUSES.map((status) => `<option value="${status}"${leadFilters.status === status ? " selected" : ""}>${status}</option>`).join("")}
      </select>
      <select id="cta" aria-label="CTA">
        <option value="">Todos los CTA</option>
        ${ctaOptions}
      </select>
      <select id="stage" aria-label="Etapa">
        <option value="">Todas las etapas</option>
        ${stageOptions}
      </select>
      <select id="phone" aria-label="Teléfono">
        <option value="">Teléfono: todos</option>
        <option value="yes"${leadFilters.phone === "yes" ? " selected" : ""}>Con teléfono</option>
        <option value="no"${leadFilters.phone === "no" ? " selected" : ""}>Sin teléfono</option>
      </select>
      <input id="from" type="date" aria-label="Desde" value="${escapeHtml(leadFilters.from)}">
      <input id="to" type="date" aria-label="Hasta" value="${escapeHtml(leadFilters.to)}">
      <button id="reload" class="btn-secondary" type="button">Actualizar</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Alta</th>
            <th scope="col">Nombre</th>
            <th scope="col">Correo</th>
            <th scope="col">Teléfono</th>
            <th scope="col">CTA</th>
            <th scope="col">Etapa</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody id="rows"></tbody>
      </table>
    </div>
    <div id="cards" class="lead-list"></div>
    <p id="empty" class="empty" hidden>Aún no hay leads con este filtro. El alta ocurre en el chat público con consentimiento.</p>`;
  const ctaEl = document.querySelector("#cta");
  if (leadFilters.cta) ctaEl.value = leadFilters.cta;
  const stageEl = document.querySelector("#stage");
  if (leadFilters.stage) stageEl.value = leadFilters.stage;
  ["q", "status", "cta", "stage", "phone", "from", "to"].forEach((id) => {
    const el = document.querySelector(`#${id}`);
    const eventName = id === "q" ? "input" : "change";
    el.addEventListener(eventName, () => {
      leadFilters[id] = el.value;
      fillLeadRows();
    });
  });
  document.querySelector("#reload").addEventListener("click", async () => {
    await refreshLeads();
    fillLeadRows();
  });
  fillLeadRows();
}

function blockedModule(title, body) {
  view.innerHTML = `
    <div class="page-head">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(body)}</p>
    </div>
    <div class="card">
      <p class="module-note">Sin fuente. No se muestran ceros de demostración. Este módulo se activa en P2–P4 del SPEC.</p>
    </div>`;
}

async function renderFicha(id) {
  skeleton();
  let lead;
  try {
    lead = (await api(`/api/equipo/leads/${id}`)).lead;
  } catch (error) {
    view.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p><p><a href="${pathURL("/equipo/leads")}">Volver a leads</a></p>`;
    return;
  }
  const cta = catalogCtas.find((item) => item.id === lead.cta_id);
  const dest = cta?.url
    ? `<a href="${escapeHtml(cta.url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(cta.url)}</a>`
    : "Lista de espera, sin fecha.";
  view.innerHTML = `
    <p><button class="btn-ghost" type="button" id="back">← Leads</button></p>
    <article class="ficha">
      <div class="page-head">
        <h1>${escapeHtml(lead.name || "Sin nombre")}</h1>
        <p><span class="pill ${escapeHtml(lead.status)}">${escapeHtml(lead.status)}</span> · ${escapeHtml(ctaLabel(lead.cta_id))} · ${escapeHtml(lead.stage || "sin etapa")}</p>
      </div>
      <div class="actions">
        ${STATUSES.map((status) => `<button class="btn-secondary" type="button" data-status="${status}" ${status === lead.status ? "disabled" : ""}>${status}</button>`).join("")}
      </div>
      <section class="card">
        <h2>Consentimiento</h2>
        <dl class="dl">
          <dt>Términos</dt><dd>${escapeHtml(lead.terms_version)}</dd>
          <dt>Aviso</dt><dd>${escapeHtml(lead.privacy_version)}</dd>
          <dt>Finalidades</dt><dd>${escapeHtml((lead.purposes || []).join(", ") || "—")}</dd>
          <dt>Retención</dt><dd>${escapeHtml(lead.retention_until)}</dd>
        </dl>
      </section>
      <section class="card">
        <h2>Contexto del agente</h2>
        <p>${escapeHtml(lead.mission_summary) || "Sin resumen de misión."}</p>
      </section>
      <section class="card">
        <h2>CTA destino</h2>
        <p>${dest}</p>
      </section>
      <section class="card">
        <h2>Notas internas</h2>
        <label class="muted" for="notes">Máximo 500 caracteres. No es el historial del chat.</label>
        <textarea id="notes" maxlength="500"></textarea>
        <p class="actions">
          <button id="save-notes" class="btn-primary" type="button">Guardar nota</button>
          ${lead.email ? `<a class="btn-secondary" style="display:inline-flex;align-items:center;text-decoration:none" href="mailto:${escapeHtml(lead.email)}">Correo local</a>` : ""}
          <button id="erase" class="btn-danger" type="button">Anonimizar</button>
        </p>
        <p id="ficha-status" class="muted" role="status"></p>
      </section>
      <p class="muted">Alta ${escapeHtml(formatDate(lead.created_at))} · Actualizado ${escapeHtml(formatDate(lead.updated_at))}</p>
    </article>`;
  document.querySelector("#notes").value = lead.notes_internal || "";
  document.querySelector("#back").addEventListener("click", () => go("/equipo/leads"));
  view.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/equipo/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status: button.dataset.status }) });
      await refreshLeads();
      await renderFicha(id);
    });
  });
  document.querySelector("#save-notes").addEventListener("click", async () => {
    await api(`/api/equipo/leads/${id}`, { method: "PATCH", body: JSON.stringify({ notes_internal: document.querySelector("#notes").value }) });
    document.querySelector("#ficha-status").textContent = "Nota guardada.";
    await refreshLeads();
  });
  document.querySelector("#erase").addEventListener("click", async () => {
    if (!window.confirm("¿Anonimizar este lead?")) return;
    await api(`/api/equipo/leads/${id}`, { method: "DELETE" });
    go("/equipo/leads");
  });
}

async function render() {
  const route = parseRoute();
  if (currentRoute() === "/equipo") {
    go("/equipo/leads", true);
    return;
  }
  markNav(route.leadId ? "leads" : route.module);
  if (route.module === "leads" && route.leadId) {
    await renderFicha(route.leadId);
    return;
  }
  skeleton();
  if (!allLeads.length && !loadError) await refreshLeads();
  if (route.module === "resumen") renderResumen();
  else if (route.module === "leads") renderLeadsTable();
  else if (route.module === "pro") blockedModule("Monitor del agente PRO", "El chat premium está en otro runtime. Falta instrumentar eventos (P2).");
  else if (route.module === "avances") blockedModule("Avances e insights", "Mini Apps sigue en F0. No hay progreso de miembro en este store.");
  else if (route.module === "kpis") blockedModule("KPIs", "El tablero de dos embudos entra en P4. Aquí no se pintan métricas inventadas.");
  else if (route.module === "ajustes") blockedModule("Ajustes", "Catálogo CTA, retención y accesos: solo Corporate. En P0 el token de equipo no abre este gobierno.");
}

document.querySelector("#login").addEventListener("submit", async (event) => {
  event.preventDefault();
  bearer = document.querySelector("#token").value.trim();
  loginStatus.textContent = "";
  try {
    await api("/api/equipo/login", { method: "POST", body: JSON.stringify({ token: bearer }) });
    showApp();
    await refreshLeads();
    if (currentRoute() === "/equipo" || currentRoute() === "/equipo.html") go("/equipo/leads", true);
    else await render();
  } catch (error) {
    loginStatus.textContent = error.message;
  }
});

document.querySelector("#logout").addEventListener("click", async () => {
  try { await api("/api/equipo/logout", { method: "POST", body: "{}" }); } catch { /* ignore */ }
  bearer = "";
  allLeads = [];
  showLogin("");
  document.querySelector("#token").value = "";
});

window.addEventListener("popstate", () => {
  if (!app.hidden) render().catch(() => {});
});

wireNav();

(async function boot() {
  try {
    catalogCtas = (await fetch(apiURL("/api/catalog"), { credentials: "include" }).then((res) => res.json())).ctas || [];
  } catch {
    catalogCtas = [];
  }
  try {
    await refreshLeads();
    if (!loadError) {
      showApp();
      if (currentRoute() === "/equipo" || currentRoute() === "/equipo.html") go("/equipo/leads", true);
      else await render();
    }
  } catch {
    showLogin("");
  }
})();
