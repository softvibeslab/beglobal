/* Cliente compartido de las Mini Apps Be Global. */
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) { tg.ready(); tg.expand(); }

const API_BASE = ""; // mismo origen: la API sirve las apps bajo /app/

async function api(path, opts = {}) {
  const headers = Object.assign(
    { "X-Tg-Init-Data": tg ? tg.initData : "" },
    opts.headers || {}
  );
  const res = await fetch(API_BASE + path, Object.assign({}, opts, { headers }));
  if (res.status === 401) {
    const detail = (await res.json().catch(() => ({}))).detail || "No autorizado";
    showAuthError(detail);
    throw new Error(detail);
  }
  if (!res.ok) {
    const detail = (await res.json().catch(() => ({}))).detail || res.statusText;
    toast(detail, true);
    throw new Error(detail);
  }
  return res.json();
}

function apiForm(path, fields) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return api(path, { method: "POST", body: fd });
}

function showAuthError(detail) {
  document.body.innerHTML =
    '<div class="auth-error"><div class="big">🔒</div>' +
    "<h2>Acceso no autorizado</h2>" +
    '<p style="color:var(--muted);margin-top:.6rem;font-size:.9rem;">' +
    esc(detail) + "</p>" +
    '<p style="color:var(--muted-2);margin-top:.8rem;font-size:.8rem;">' +
    "Abre esta Mini App desde el bot de tu perfil. Si crees que es un error, avisa a tu contacto Be Global.</p></div>";
}

let toastTimer;
function toast(msg, isError) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.toggle("err", !!isError);
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function timeAgo(ts) {
  if (!ts) return "—";
  const d = Math.floor(Date.now() / 1000) - ts;
  if (d < 3600) return Math.max(1, Math.floor(d / 60)) + " min";
  if (d < 86400) return Math.floor(d / 3600) + " h";
  return Math.floor(d / 86400) + " d";
}

function backToChat() {
  if (tg) tg.close();
}

function statTile(n, label, suffix = "") {
  const value = (n == null || n === "") ? "sin datos" : esc(n) + suffix;
  const cls = (n == null || n === "") ? "n nodata" : "n";
  return `<div class="stat"><div class="${cls}">${value}</div><div class="l">${esc(label)}</div></div>`;
}

const DEFAULT_BOT_BY_PROFILE = {
  team: "beglobal_team_bot",
  member: "Beglobalmember_bot",
  corporate: "beglobal_corp_bot",
};

function botForProfile(profile) {
  const qs = new URLSearchParams(location.search);
  return (qs.get("bot") || DEFAULT_BOT_BY_PROFILE[profile] || DEFAULT_BOT_BY_PROFILE.corporate).replace(/^@/, "");
}

async function sendPromptToTelegram(prompt, profile = "team") {
  const text = String(prompt || "").trim();
  if (!text) return toast("No hay prompt para enviar", true);
  if (navigator.clipboard) await navigator.clipboard.writeText(text).catch(() => {});

  // Telegram no permite que una Mini App pegue texto de forma silenciosa en el
  // input del chat. La ruta más cercana y segura es: copiar al portapapeles,
  // intentar enviar el payload al bot cuando Telegram lo permite y cerrar la
  // ventana para que el usuario quede de nuevo en el chat.
  if (tg && typeof tg.sendData === "function") {
    try {
      tg.sendData(JSON.stringify({ type: "beglobal_mission_prompt", profile, prompt: text }));
      return; // sendData cierra la Mini App cuando Telegram acepta el envío.
    } catch (_) {}
  }

  toast("Prompt copiado. Vuelvo al chat para pegarlo.");
  if (tg && typeof tg.close === "function") {
    setTimeout(() => tg.close(), 450);
    return;
  }

  const bot = botForProfile(profile);
  const url = `https://t.me/${bot}`;
  window.open(url, "_blank", "noopener");
}
