"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8654);
const hermesBaseUrl = (process.env.HERMES_BASE_URL || "http://127.0.0.1:8645").replace(/\/$/, "");
const hermesApiKey = process.env.API_SERVER_KEY || "";
const model = process.env.HERMES_MODEL || "beglobalasistente";
const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://chatbeglobal.softvibes.pro";
const sessionTtlMs = 30 * 60 * 1000;
const ipLimitMax = Number(process.env.IP_LIMIT_MAX || 30);
const sessions = new Map();
const ipLimits = new Map();
const publicDir = path.join(__dirname, "public");
const membershipCta = Object.freeze({
  type: "membership",
  title: "¿Quieres acompañamiento para ejecutar tu misión?",
  text: "Explora las opciones vigentes de Be Global Pro y elige con calma la que mejor corresponda a tu etapa.",
  label: "Ver membresías",
  url: "https://www.beglobalpro.org/membresias",
});

const assets = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/logo-beglobal.png", ["logo-beglobal.png", "image/png"]],
]);

const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors https://beglobal.softvibes.pro https://www.beglobal.softvibes.pro; form-action 'self'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cache-Control": "no-store",
};

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

function parseCookies(req) {
  const result = {};
  for (const item of String(req.headers.cookie || "").split(";")) {
    const index = item.indexOf("=");
    if (index > 0) result[item.slice(0, index).trim()] = item.slice(index + 1).trim();
  }
  return result;
}

function validOrigin(req) {
  return req.headers.origin === allowedOrigin;
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

function membershipCtaFor(session, message, answer) {
  const text = normalizedText(message);
  const answerText = normalizedText(answer);
  if (session.salesOptOut || session.membershipOffered || isSupportRequest(text)) return null;
  if (isDiagnosisRequest(text)) session.diagnosisActive = true;

  const explicitMembership = /\bmembresias?\b/.test(text)
    || /\b(comprar|adquirir|inscribirme|precio|cuesta)\b.{0,50}\b(be global|beglobal|membresia|membresias|plan|planes)\b/.test(text)
    || /\b(be global|beglobal|membresia|membresias|plan|planes)\b.{0,50}\b(comprar|adquirir|inscribirme|precio|cuesta)\b/.test(text);

  if (session.diagnosisActive) {
    if (!isDiagnosisDelivered(answerText)) return null;
    session.membershipOffered = true;
    session.diagnosisActive = false;
    return membershipCta;
  }

  if (!explicitMembership) return null;
  session.membershipOffered = true;
  return membershipCta;
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

function requireSession(req, res) {
  const session = sessionFor(req);
  if (!session) {
    json(res, 401, { error: "La sesión expiró. Inicia una conversación nueva." });
    return null;
  }
  if (!validOrigin(req) || req.headers["x-beglobal-csrf"] !== session.csrf) {
    json(res, 403, { error: "La solicitud no está autorizada." });
    return null;
  }
  return session;
}

async function askHermes(session, message) {
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

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) if (session.expiresAt < now) sessions.delete(id);
  for (const [ip, limit] of ipLimits) if (now - limit.startedAt > 10 * 60 * 1000) ipLimits.delete(ip);
}, 60_000).unref();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/healthz") {
    return json(res, 200, { status: "ok", service: "beglobalasistente-widget", profile: model });
  }

  if (req.method === "POST" && url.pathname === "/api/session") {
    if (!validOrigin(req) || !consumeIpLimit(clientIp(req))) return json(res, 403, { error: "No fue posible iniciar la sesión." });
    const id = crypto.randomBytes(32).toString("hex");
    const csrf = crypto.randomBytes(24).toString("base64url");
    sessions.set(id, { id, csrf, history: [], expiresAt: Date.now() + sessionTtlMs, busy: false, membershipOffered: false, salesOptOut: false, diagnosisActive: false });
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
      const cta = membershipCtaFor(session, message, answer);
      return json(res, 200, cta ? { message: answer, cta } : { message: answer });
    } catch (error) {
      if (error.status) return json(res, error.status, { error: "La solicitud no es válida." });
      console.error("chat request failed:", error.message);
      return json(res, 502, { error: "El asistente no está disponible en este momento. Inténtalo de nuevo." });
    } finally {
      session.busy = false;
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

server.listen(port, host, () => console.log(`beglobalasistente-widget listening on http://${host}:${port}`));
function shutdown() { server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 5000).unref(); }
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
