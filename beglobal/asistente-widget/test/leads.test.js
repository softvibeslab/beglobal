"use strict";

const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("../server");
const { createStore } = require("../lib/leads-store");
const { loadCatalog, defaultCatalogPath } = require("../lib/catalog");

const origin = "https://chatbeglobal.softvibes.pro";
const catalog = loadCatalog(defaultCatalogPath());

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

function request(port, method, urlPath, { body, headers } = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: "127.0.0.1",
      port,
      path: urlPath,
      method,
      headers: {
        Origin: origin,
        ...(payload ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) } : {}),
        ...headers,
      },
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        let json = null;
        try { json = raw ? JSON.parse(raw) : null; } catch { json = null; }
        resolve({ status: res.statusCode, headers: res.headers, json, raw });
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function cookieFrom(response, name) {
  const set = response.headers["set-cookie"] || [];
  const line = set.find((item) => item.startsWith(`${name}=`));
  return line ? line.split(";")[0] : "";
}

async function withServer(t, extras = {}) {
  const dataDir = path.join(os.tmpdir(), `beglobal-leads-${process.pid}-${Date.now()}`);
  const { server, janitor } = createServer({
    allowedOrigin: origin,
    adminToken: "team-token-16chars",
    hashSecret: "salt-for-tests",
    dataDir,
    catalog,
    askHermes: async (_session, _message) => "Estás en principiante. Tu misión esta semana es publicar una oferta. ¿Quieres acompañamiento para ejecutar tu misión?",
    ...extras,
  });
  const port = await listen(server);
  t.after(() => new Promise((resolve) => {
    clearInterval(janitor);
    server.close(resolve);
  }));
  return { server, port };
}

test("catálogo público no inventa fecha de webinar", async () => {
  const waitlist = catalog.ctas.find((cta) => cta.id === "webinar-lista");
  assert.equal(waitlist.url, null);
  assert.equal(waitlist.type, "waitlist");
  assert.match(waitlist.text, /no hay fecha/i);
});

test("rechaza lead sin consentimiento ni sesión", async (t) => {
  const { port } = await withServer(t);
  const denied = await request(port, "POST", "/api/leads", { body: { name: "Ada" } });
  assert.equal(denied.status, 401);
});

test("crea lead con consentimiento, CSRF y finalidad", async (t) => {
  const { port } = await withServer(t);
  const session = await request(port, "POST", "/api/session", { body: {} });
  assert.equal(session.status, 201);
  const cookie = cookieFrom(session, "bgas_session");
  const chat = await request(port, "POST", "/api/chat", {
    body: { message: "Quiero hacer mi diagnóstico gratuito." },
    headers: { Cookie: cookie, "X-BeGlobal-CSRF": session.json.csrf },
  });
  assert.equal(chat.status, 200);
  assert.ok(chat.json.ctas.some((cta) => cta.id === "webinar-lista"));
  assert.ok(chat.json.cta.url.includes("/membresias"));

  const bad = await request(port, "POST", "/api/leads", {
    body: {
      cta_id: "webinar-lista",
      name: "Ada Lovelace",
      email: "ada@example.com",
      purposes: ["contacto_evento"],
      privacy_accepted: false,
      terms_accepted: true,
      privacy_version: catalog.privacy_version,
      terms_version: catalog.terms_version,
    },
    headers: { Cookie: cookie, "X-BeGlobal-CSRF": session.json.csrf },
  });
  assert.equal(bad.status, 400);

  const created = await request(port, "POST", "/api/leads", {
    body: {
      cta_id: "webinar-lista",
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "5512345678",
      purposes: ["contacto_evento"],
      privacy_accepted: true,
      terms_accepted: true,
      privacy_version: catalog.privacy_version,
      terms_version: catalog.terms_version,
    },
    headers: { Cookie: cookie, "X-BeGlobal-CSRF": session.json.csrf },
  });
  assert.equal(created.status, 201);
  assert.equal(created.json.ok, true);
  assert.ok(created.json.erase_token);
  assert.equal(created.json.cta.url, null);
});

test("CRUD equipo exige token y permite actualizar y borrar", async (t) => {
  const { port, server } = await withServer(t);
  const closed = await request(port, "GET", "/api/equipo/leads");
  assert.equal(closed.status, 401);
  server.store.createLead({
    name: "Grace",
    email: "grace@example.com",
    phone: "",
    cta_id: "webinar-lista",
    cta_type: "waitlist",
    purposes: ["contacto_evento"],
    consent_version: "x",
    terms_version: catalog.terms_version,
    privacy_version: catalog.privacy_version,
    session_ref: "abc",
    ip_hash: "def",
    retention_until: "2099-01-01T00:00:00.000Z",
  });
  const list = await request(port, "GET", "/api/equipo/leads", {
    headers: { Authorization: "Bearer team-token-16chars" },
  });
  assert.equal(list.status, 200);
  assert.equal(list.json.leads[0].email, "grace@example.com");
  const id = list.json.leads[0].id;
  const patched = await request(port, "PATCH", `/api/equipo/leads/${id}`, {
    body: { status: "contactado" },
    headers: { Authorization: "Bearer team-token-16chars" },
  });
  assert.equal(patched.json.lead.status, "contactado");
  const erased = await request(port, "DELETE", `/api/equipo/leads/${id}`, {
    headers: { Authorization: "Bearer team-token-16chars" },
  });
  assert.equal(erased.status, 200);
});

test("panel de equipo sirve el shell CRM y la ficha por id", async (t) => {
  const { port, server } = await withServer(t);
  const home = await request(port, "GET", "/");
  assert.equal(home.status, 200);
  assert.match(home.raw, /Chat · Be Global Asistente/);
  const shell = await request(port, "GET", "/equipo/leads");
  assert.equal(shell.status, 200);
  assert.match(shell.headers["content-type"], /text\/html/);
  assert.match(shell.raw, /data-nav="leads"/);
  assert.match(shell.raw, /Solo personas designadas/);
  const created = server.store.createLead({
    name: "Inés",
    email: "ines@example.com",
    phone: "5511111111",
    stage: "atorado",
    mission_summary: "Publicar una oferta esta semana",
    cta_id: "webinar-lista",
    cta_type: "waitlist",
    purposes: ["contacto_evento"],
    consent_version: "x",
    terms_version: catalog.terms_version,
    privacy_version: catalog.privacy_version,
    session_ref: "abc",
    ip_hash: "def",
    retention_until: "2099-01-01T00:00:00.000Z",
  });
  const closed = await request(port, "GET", `/api/equipo/leads/${created.lead.id}`);
  assert.equal(closed.status, 401);
  const detail = await request(port, "GET", `/api/equipo/leads/${created.lead.id}`, {
    headers: { Authorization: "Bearer team-token-16chars" },
  });
  assert.equal(detail.status, 200);
  assert.equal(detail.json.lead.email, "ines@example.com");
  assert.equal(detail.json.lead.mission_summary, "Publicar una oferta esta semana");
  const nestedCss = await request(port, "GET", "/equipo/leads/admin.css");
  assert.equal(nestedCss.status, 200);
  assert.match(nestedCss.headers["content-type"], /text\/css/);
});

test("ARCO borra con token y retención vence el registro", async (t) => {
  const file = path.join(os.tmpdir(), `lead-store-${Date.now()}.json`);
  const store = createStore(file, { secret: "salt-for-tests" });
  const created = store.createLead({
    name: "Ana",
    email: "ana@example.com",
    phone: "5500000000",
    cta_id: "webinar-lista",
    cta_type: "waitlist",
    purposes: ["contacto_evento"],
    consent_version: "x",
    terms_version: "t",
    privacy_version: "p",
    session_ref: "s",
    ip_hash: "i",
    retention_until: "2000-01-01T00:00:00.000Z",
  });
  assert.equal(store.erase(created.lead.id, "token-falso"), false);
  assert.equal(store.erase(created.lead.id, created.erase_token), true);
  assert.equal(store.get(created.lead.id).status, "borrado");
  assert.equal(store.get(created.lead.id).email, "");

  const second = store.createLead({
    name: "Beto",
    email: "beto@example.com",
    phone: "",
    cta_id: "sitio-oficial",
    cta_type: "channel",
    purposes: ["comunidad"],
    consent_version: "x",
    terms_version: "t",
    privacy_version: "p",
    session_ref: "s",
    ip_hash: "i",
    retention_until: "2000-01-01T00:00:00.000Z",
  });
  store.expireDue(new Date("2026-09-13T00:00:00.000Z"));
  assert.equal(store.get(second.lead.id).status, "borrado");
});

test("soporte no dispara CTA comercial", async (t) => {
  const { port } = await withServer(t);
  const session = await request(port, "POST", "/api/session", { body: {} });
  const cookie = cookieFrom(session, "bgas_session");
  const chat = await request(port, "POST", "/api/chat", {
    body: { message: "Tengo un problema con mi cuenta y un reembolso" },
    headers: { Cookie: cookie, "X-BeGlobal-CSRF": session.json.csrf },
  });
  assert.equal(chat.json.ctas.length, 0);
});
