"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { loadCatalog, publicCtas, ctaById, defaultCatalogPath } = require("./lib/catalog");
const { createStore } = require("./lib/leads-store");
const security = require("./lib/security");

const publicDir = path.join(__dirname, "public");

const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors https://beglobal.softvibes.pro https://www.beglobal.softvibes.pro; form-action 'self'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cache-Control": "no-store",
};

const assets = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/logo-beglobal.png", ["logo-beglobal.png", "image/png"]],
  ["/privacidad", ["privacidad.html", "text/html; charset=utf-8"]],
  ["/privacidad.html", ["privacidad.html", "text/html; charset=utf-8"]],
  ["/terminos", ["terminos.html", "text/html; charset=utf-8"]],
  ["/terminos.html", ["terminos.html", "text/html; charset=utf-8"]],
  ["/equipo.html", ["admin.html", "text/html; charset=utf-8"]],
  ["/admin.js", ["admin.js", "text/javascript; charset=utf-8"]],
  ["/admin.css", ["admin.css", "text/css; charset=utf-8"]],
]);

function nestedEquipoAsset(pathname) {
  if (pathname.endsWith("/admin.css")) return ["admin.css", "text/css; charset=utf-8"];
  if (pathname.endsWith("/admin.js")) return ["admin.js", "text/javascript; charset=utf-8"];
  if (pathname.endsWith("/logo-beglobal.png")) return ["logo-beglobal.png", "image/png"];
  return null;
}

function send(res, status, headers, body) {
  res.writeHead(status, { ...securityHeaders, ...headers });
  res.end(body);
}

function json(res, status, value, extra = {}) {
  send(res, status, { "Content-Type": "application/json; charset=utf-8", ...extra }, JSON.stringify(value));
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress || "unknown").trim();
}

function parseCookies(req) {
  const result = {};
  for (const item of String(req.headers.cookie || "").split(";")) {
    const index = item.indexOf("=");
    if (index > 0) result[item.slice(0, index).trim()] = item.slice(index + 1).trim();
  }
  return result;
}

function normalizedText(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function rejectsMembershipOffer(text) {
  return /\b(no quiero|no deseo|no me interesa|no vuelvas a|no mas|deja de|dejame de)\b.{0,40}\b(comprar|membresia|membresias|oferta|ofertas|promocion|promociones|ofrecer|ofrecerme|venderme)\b/.test(text)
    || /\bprefiero no\b.{0,40}\b(recibir|comprar|adquirir|ver)\b.{0,24}\b(oferta|ofertas|promocion|promociones|membresia|membresias)\b/.test(text)
    || /\bno estoy interesad[oa]\b.{0,40}\b(oferta|ofertas|promocion|promociones|membresia|membresias|comprar|adquirir)\b/.test(text)
    || /\bsin (oferta|ofertas|promocion|promociones|membresia|membresias)\b/.test(text)
    || /\bno me (ofrezcas|vendas)\b.{0,30}\b(membresia|membresias|oferta|ofertas|promocion|promociones)\b/.test(text)
    || /\bdecidi no (comprar|adquirir|inscribirme)\b/.test(text)
    || /\bsolo (quiero )?informacion\b/.test(text)
    || /\bno puedo (pagar|comprar)\b/.test(text)
    || /\bno tengo (dinero|presupuesto)\b/.test(text);
}

function rememberSalesPreference(session, message) {
  if (rejectsMembershipOffer(normalizedText(message))) session.salesOptOut = true;
}

function isSupportRequest(text) {
  return /\b(soporte|reembolso|devolucion|cancelar|cancelacion|recuperar mi cuenta|problema con mi cuenta|ya soy (miembro|socio))\b/.test(text)
    || /\b(problema|error|incorrecto|duplicado|no reconozco|fallo)\b.{0,40}\b(pago|cobro|membresia|cuenta)\b/.test(text)
    || /\b(pago|cobro)\b.{0,40}\b(problema|error|incorrecto|duplicado|no reconocido|fallo)\b/.test(text)
    || /\bcobraron\b.{0,24}\b(mal|de mas|doble|dos veces|otra vez|incorrectamente|sin autorizacion|por error)\b/.test(text)
    || /\b(no autorice|no reconozco)\b.{0,40}\b(cargo|cobro|pago)\b/.test(text)
    || /\b(cargo|cobro|pago)\b.{0,40}\b(no autorizado|sin autorizacion|no reconozco)\b/.test(text)
    || /\bme descontaron\b.{0,30}\b(de mas|doble|dos veces|sin autorizacion|por error)\b/.test(text)
    || /\bfactura\b.{0,40}\b(problema|error|incorrecta|duplicada|no llego|no recibi|corregir)\b/.test(text)
    || /\bayuda con (un |el |mi )?(pago|cobro|cuenta)\b/.test(text);
}

function isDiagnosisRequest(text) {
  return /\bdiagnostico\b/.test(text)
    || /\bpor donde comienzo\b/.test(text)
    || /\bquiero empezar\b/.test(text);
}

function isDiagnosisQuestion(answerText) {
  return /\bprimera pregunta\b/.test(answerText)
    || /\bya has vendido\b/.test(answerText)
    || /\btienes un producto\b/.test(answerText)
    || /\bdonde vendes\b/.test(answerText)
    || /\btienes proveedor\b/.test(answerText)
    || /\bmayor bloqueo\b/.test(answerText)
    || /\bcuanto tiempo puedes\b/.test(answerText)
    || /\bproximos treinta dias\b/.test(answerText);
}

function isDiagnosisDelivered(answerText) {
  if (isDiagnosisQuestion(answerText) && !/\btu (siguiente )?mision\b/.test(answerText)) return false;
  const hasCloseout = /\bacompaniamento para ejecutar tu mision\b/.test(answerText);
  const hasStage = /\bestas en\b/.test(answerText);
  const hasMission = /\btu (siguiente )?mision\b/.test(answerText) || /\bmision (esta semana|inicial|es)\b/.test(answerText);
  return hasCloseout || (hasStage && hasMission);
}

function wantsFollowUp(text) {
  return /\b(avisame|avisenme|lista de espera|webinar|evento|dejar mis datos|registr(ame|arme)|quiero que me contacten|canal|comunidad|sigueme)\b/.test(text);
}

function ctasFor(session, message, answer, catalog) {
  const text = normalizedText(message);
  const answerText = normalizedText(answer);
  if (session.salesOptOut || isSupportRequest(text)) return [];
  if (isDiagnosisRequest(text)) session.diagnosisActive = true;

  const explicitMembership = /\bmembresias?\b/.test(text)
    || /\b(comprar|adquirir|inscribirme|precio|cuesta)\b.{0,50}\b(be global|beglobal|membresia|membresias|plan|planes)\b/.test(text)
    || /\b(be global|beglobal|membresia|membresias|plan|planes)\b.{0,50}\b(comprar|adquirir|inscribirme|precio|cuesta)\b/.test(text);

  const membership = catalog.ctas.find((cta) => cta.type === "membership");
  const capture = catalog.ctas.filter((cta) => cta.requires_lead);
  const out = [];

  if (session.diagnosisActive) {
    if (!isDiagnosisDelivered(answerText)) return [];
    session.membershipOffered = true;
    session.diagnosisActive = false;
    session.stage = security.extractStage(answer);
    session.mission_summary = String(answer).slice(0, 280);
    if (membership && !session.salesOptOut) out.push(membership);
    out.push(...capture);
    session.leadOffered = true;
    return out;
  }

  if (explicitMembership && membership) {
    session.membershipOffered = true;
    out.push(membership);
  }
  if ((wantsFollowUp(text) || session.leadOffered) && !session.leadCaptured) {
    out.push(...capture);
  }
  return out;
}

function createServer(options = {}) {
  const host = options.host || process.env.HOST || "127.0.0.1";
  const port = Number(options.port || process.env.PORT || 8654);
  const hermesBaseUrl = (options.hermesBaseUrl || process.env.HERMES_BASE_URL || "http://127.0.0.1:8645").replace(/\/$/, "");
  const hermesApiKey = options.hermesApiKey || process.env.API_SERVER_KEY || "";
  const model = options.model || process.env.HERMES_MODEL || "beglobalasistente";
  const allowedOrigin = options.allowedOrigin || process.env.ALLOWED_ORIGIN || "https://chatbeglobal.softvibes.pro";
  const sessionTtlMs = options.sessionTtlMs || 30 * 60 * 1000;
  const ipLimitMax = Number(options.ipLimitMax || process.env.IP_LIMIT_MAX || 30);
  const adminToken = options.adminToken || process.env.LEADS_ADMIN_TOKEN || "";
  const hashSecret = options.hashSecret || process.env.LEADS_HASH_SALT || "dev-only-change";
  const catalog = options.catalog || loadCatalog(defaultCatalogPath());
  const store = options.store || createStore(
    path.join(options.dataDir || process.env.LEADS_DATA_DIR || path.join(__dirname, "data"), "leads.json"),
    { secret: hashSecret },
  );
  const askHermesImpl = options.askHermes;
  const sessions = new Map();
  const ipLimits = new Map();
  const adminSessions = new Map();

  function consumeIpLimit(ip) {
    const now = Date.now();
    const current = ipLimits.get(ip);
    if (!current || now - current.startedAt > 10 * 60 * 1000) {
      ipLimits.set(ip, { startedAt: now, count: 1 });
      return true;
    }
    current.count += 1;
    return current.count <= ipLimitMax;
  }

  function validOrigin(req) {
    if (!req.headers.origin) return req.method === "GET" || req.method === "HEAD";
    return req.headers.origin === allowedOrigin;
  }

  function sessionFor(req) {
    const id = parseCookies(req).bgas_session;
    const session = id && sessions.get(id);
    if (!session || session.expiresAt < Date.now()) {
      if (id) sessions.delete(id);
      return null;
    }
    session.expiresAt = Date.now() + sessionTtlMs;
    return session;
  }

  function requireSession(req, res) {
    const session = sessionFor(req);
    if (!session) {
      json(res, 401, { error: "La sesión expiró. Inicia una conversación nueva." });
      return null;
    }
    if (req.headers.origin && req.headers.origin !== allowedOrigin) {
      json(res, 403, { error: "La solicitud no está autorizada." });
      return null;
    }
    if (req.headers["x-beglobal-csrf"] !== session.csrf) {
      json(res, 403, { error: "La solicitud no está autorizada." });
      return null;
    }
    return session;
  }

  function requireAdmin(req, res) {
    if (!adminToken || adminToken.length < 16) {
      json(res, 503, { error: "El CRUD está desactivado hasta configurar LEADS_ADMIN_TOKEN." });
      return false;
    }
    const bearer = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    const cookie = parseCookies(req).bgas_admin;
    const presented = bearer || cookie || "";
    if (!security.timingEqual(presented, adminToken) && !adminSessions.has(presented)) {
      json(res, 401, { error: "No autorizado." });
      return false;
    }
    return true;
  }

  async function readJson(req) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 8192) throw Object.assign(new Error("too-large"), { status: 413 });
      chunks.push(chunk);
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    } catch {
      throw Object.assign(new Error("invalid-json"), { status: 400 });
    }
  }

  async function askHermes(session, message) {
    if (askHermesImpl) return askHermesImpl(session, message);
    if (hermesApiKey.length < 16) throw new Error("missing-api-key");
    const messages = [...session.history, { role: "user", content: message }];
    const response = await fetch(`${hermesBaseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hermesApiKey}`,
        "Content-Type": "application/json",
        "X-Hermes-Session-Key": `web:${session.id}`,
      },
      body: JSON.stringify({ model, messages, stream: false }),
      signal: AbortSignal.timeout(120000),
    });
    if (!response.ok) throw new Error(`upstream-${response.status}`);
    const payload = await response.json();
    const answer = payload?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) throw new Error("invalid-upstream");
    const cleanAnswer = answer.trim().slice(0, 12000);
    session.history = [...messages, { role: "assistant", content: cleanAnswer }].slice(-12);
    return cleanAnswer;
  }

  const janitor = setInterval(() => {
    const now = Date.now();
    for (const [id, session] of sessions) if (session.expiresAt < now) sessions.delete(id);
    for (const [ip, limit] of ipLimits) if (now - limit.startedAt > 10 * 60 * 1000) ipLimits.delete(ip);
    store.expireDue();
  }, 60_000);
  janitor.unref();

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/healthz") {
      return json(res, 200, { status: "ok", service: "beglobalasistente-widget", profile: model, leads: Boolean(adminToken) });
    }

    if (req.method === "GET" && url.pathname === "/api/catalog") {
      return json(res, 200, {
        privacy_version: catalog.privacy_version,
        terms_version: catalog.terms_version,
        retention_days: catalog.retention_days,
        ctas: publicCtas(catalog),
      });
    }

    if (req.method === "POST" && url.pathname === "/api/session") {
      if (!validOrigin(req) || !consumeIpLimit(clientIp(req))) return json(res, 403, { error: "No fue posible iniciar la sesión." });
      const id = crypto.randomBytes(32).toString("hex");
      const csrf = crypto.randomBytes(24).toString("base64url");
      sessions.set(id, {
        id, csrf, history: [], expiresAt: Date.now() + sessionTtlMs, busy: false,
        membershipOffered: false, salesOptOut: false, diagnosisActive: false,
        leadOffered: false, leadCaptured: false, stage: "", mission_summary: "",
      });
      return json(res, 201, { csrf, expiresIn: sessionTtlMs / 1000 }, {
        "Set-Cookie": `bgas_session=${id}; Path=/asistente/; HttpOnly; Secure; SameSite=Lax; Max-Age=${sessionTtlMs / 1000}`,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/session/reset") {
      const session = requireSession(req, res);
      if (!session) return;
      sessions.delete(session.id);
      return json(res, 204, {}, { "Set-Cookie": "bgas_session=; Path=/asistente/; HttpOnly; Secure; SameSite=Lax; Max-Age=0" });
    }

    if (req.method === "POST" && url.pathname === "/api/chat") {
      const session = requireSession(req, res);
      if (!session) return;
      if (!consumeIpLimit(clientIp(req))) return json(res, 429, { error: "Alcanzaste el límite temporal. Espera unos minutos." });
      if (session.busy) return json(res, 409, { error: "Espera a que termine la respuesta anterior." });
      try {
        const body = await readJson(req);
        if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some((key) => key !== "message")) {
          return json(res, 400, { error: "La solicitud contiene campos no permitidos." });
        }
        const message = typeof body.message === "string" ? body.message.trim() : "";
        if (!message) return json(res, 400, { error: "Escribe un mensaje antes de enviarlo." });
        if (message.length > 2000) return json(res, 413, { error: "El mensaje supera el límite de 2000 caracteres." });
        rememberSalesPreference(session, message);
        session.busy = true;
        const answer = await askHermes(session, message);
        const ctas = ctasFor(session, message, answer, catalog);
        const membership = ctas.find((cta) => cta.type === "membership");
        const payload = { message: answer, ctas };
        if (membership) payload.cta = membership;
        return json(res, 200, payload);
      } catch (error) {
        if (error.status) return json(res, error.status, { error: "La solicitud no es válida." });
        console.error("chat request failed:", error.message);
        return json(res, 502, { error: "El asistente no está disponible en este momento. Inténtalo de nuevo." });
      } finally {
        session.busy = false;
      }
    }

    if (req.method === "POST" && url.pathname === "/api/leads") {
      const session = requireSession(req, res);
      if (!session) return;
      if (!consumeIpLimit(clientIp(req))) return json(res, 429, { error: "Alcanzaste el límite temporal. Espera unos minutos." });
      try {
        const body = await readJson(req);
        const cta = ctaById(catalog, body.cta_id);
        if (!cta || !cta.requires_lead) return json(res, 400, { error: "Ese aviso no está disponible." });
        if (body.privacy_version !== catalog.privacy_version || body.terms_version !== catalog.terms_version) {
          return json(res, 409, { error: "Los términos cambiaron. Revísalos otra vez." });
        }
        if (body.privacy_accepted !== true || body.terms_accepted !== true) {
          return json(res, 400, { error: "Necesitas aceptar aviso de privacidad y términos." });
        }
        const name = security.normalizeName(body.name);
        const email = security.normalizeEmail(body.email);
        const phone = security.normalizePhone(body.phone);
        if (!security.validName(name) || !security.validEmail(email) || !security.validPhone(phone)) {
          return json(res, 400, { error: "Revisa nombre, correo y teléfono." });
        }
        const parsed = security.parsePurposes(body.purposes, cta.purposes);
        if (parsed.error) return json(res, 400, { error: parsed.error });
        const retention = new Date();
        retention.setUTCDate(retention.getUTCDate() + Number(catalog.retention_days || 548));
        const created = store.createLead({
          name,
          email,
          phone,
          stage: session.stage || "",
          mission_summary: session.mission_summary || "",
          cta_id: cta.id,
          cta_type: cta.type,
          purposes: parsed.purposes,
          consent_version: `${catalog.privacy_version}|${catalog.terms_version}`,
          terms_version: catalog.terms_version,
          privacy_version: catalog.privacy_version,
          session_ref: security.hashValue(hashSecret, session.id),
          ip_hash: security.hashValue(hashSecret, clientIp(req)),
          retention_until: retention.toISOString(),
        });
        session.leadCaptured = true;
        return json(res, 201, {
          ok: true,
          lead_id: created.lead.id,
          erase_token: created.erase_token,
          cta: {
            id: cta.id,
            type: cta.type,
            title: cta.title,
            text: cta.text,
            label: cta.label,
            url: cta.url,
          },
          retention_until: created.lead.retention_until,
        });
      } catch (error) {
        if (error.status) return json(res, error.status, { error: "La solicitud no es válida." });
        console.error("lead create failed");
        return json(res, 500, { error: "No fue posible guardar el registro." });
      }
    }

    if (req.method === "POST" && url.pathname === "/api/leads/erase") {
      try {
        const body = await readJson(req);
        const ok = store.erase(String(body.lead_id || ""), String(body.erase_token || ""));
        if (!ok) return json(res, 404, { error: "No encontramos ese registro." });
        return json(res, 200, { ok: true });
      } catch (error) {
        if (error.status) return json(res, error.status, { error: "La solicitud no es válida." });
        return json(res, 400, { error: "No fue posible borrar." });
      }
    }

    if (req.method === "POST" && url.pathname === "/api/equipo/login") {
      if (!adminToken || adminToken.length < 16) return json(res, 503, { error: "El CRUD está desactivado hasta configurar LEADS_ADMIN_TOKEN." });
      try {
        const body = await readJson(req);
        if (!security.timingEqual(body.token, adminToken)) return json(res, 401, { error: "No autorizado." });
        const ticket = crypto.randomBytes(32).toString("hex");
        adminSessions.set(ticket, Date.now() + 8 * 60 * 60 * 1000);
        return json(res, 200, { ok: true }, {
          "Set-Cookie": `bgas_admin=${ticket}; Path=/asistente/; HttpOnly; Secure; SameSite=Lax; Max-Age=${8 * 60 * 60}`,
        });
      } catch (error) {
        return json(res, 400, { error: "No autorizado." });
      }
    }

    if (req.method === "POST" && url.pathname === "/api/equipo/logout") {
      const cookie = parseCookies(req).bgas_admin;
      if (cookie) adminSessions.delete(cookie);
      return json(res, 200, { ok: true }, {
        "Set-Cookie": "bgas_admin=; Path=/asistente/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
      });
    }

    const leadIdMatch = url.pathname.match(/^\/api\/equipo\/leads\/([^/]+)$/);
    if (req.method === "GET" && url.pathname === "/api/equipo/leads") {
      if (!requireAdmin(req, res)) return;
      return json(res, 200, { leads: store.list({ status: url.searchParams.get("status") || "", q: url.searchParams.get("q") || "" }) });
    }

    if (req.method === "GET" && leadIdMatch) {
      if (!requireAdmin(req, res)) return;
      const row = store.get(leadIdMatch[1]);
      if (!row || row.status === "borrado") return json(res, 404, { error: "No encontrado." });
      return json(res, 200, { lead: store.publicLead(row) });
    }

    if (req.method === "PATCH" && leadIdMatch) {
      if (!requireAdmin(req, res)) return;
      try {
        const body = await readJson(req);
        const updated = store.update(leadIdMatch[1], body);
        if (!updated) return json(res, 404, { error: "No encontrado." });
        return json(res, 200, { lead: updated });
      } catch (error) {
        return json(res, 400, { error: "No fue posible actualizar." });
      }
    }

    if (req.method === "DELETE" && leadIdMatch) {
      if (!requireAdmin(req, res)) return;
      const ok = store.erase(leadIdMatch[1]);
      if (!ok) return json(res, 404, { error: "No encontrado." });
      return json(res, 200, { ok: true });
    }

    if (req.method === "GET" && (url.pathname === "/equipo" || url.pathname.startsWith("/equipo/"))) {
      const nested = nestedEquipoAsset(url.pathname);
      if (nested) {
        try {
          return send(res, 200, { "Content-Type": nested[1] }, fs.readFileSync(path.join(publicDir, nested[0])));
        } catch {
          return send(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "No fue posible cargar el panel.");
        }
      }
      try {
        return send(res, 200, { "Content-Type": "text/html; charset=utf-8" }, fs.readFileSync(path.join(publicDir, "admin.html")));
      } catch {
        return send(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "No fue posible cargar el panel.");
      }
    }

    const asset = req.method === "GET" ? assets.get(url.pathname) : null;
    if (asset) {
      try {
        const [filename, contentType] = asset;
        return send(res, 200, { "Content-Type": contentType }, fs.readFileSync(path.join(publicDir, filename)));
      } catch {
        return send(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "No fue posible cargar el chat.");
      }
    }
    return send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "No encontrado");
  });

  server.createSession = (overrides = {}) => {
    const id = crypto.randomBytes(32).toString("hex");
    const csrf = crypto.randomBytes(24).toString("base64url");
    const session = {
      id, csrf, history: [], expiresAt: Date.now() + sessionTtlMs, busy: false,
      membershipOffered: false, salesOptOut: false, diagnosisActive: false,
      leadOffered: false, leadCaptured: false, stage: "", mission_summary: "",
      ...overrides,
    };
    sessions.set(id, session);
    return session;
  };
  server.store = store;
  server.catalog = catalog;
  return { server, host, port, janitor };
}

if (require.main === module) {
  const { server, host, port } = createServer();
  server.listen(port, host, () => console.log(`beglobalasistente-widget listening on http://${host}:${port}`));
  function shutdown() { server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 5000).unref(); }
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

module.exports = { createServer, ctasFor };
