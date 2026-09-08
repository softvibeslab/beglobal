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
const sessions = new Map();
const ipLimits = new Map();
const publicDir = path.join(__dirname, "public");

const assets = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
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
  return current.count <= 30;
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
    sessions.set(id, { id, csrf, history: [], expiresAt: Date.now() + sessionTtlMs, busy: false });
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
      session.busy = true;
      const answer = await askHermes(session, message);
      return json(res, 200, { message: answer });
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
