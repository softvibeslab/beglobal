"use strict";
const form = document.querySelector("#chat-form");
const input = document.querySelector("#message");
const send = document.querySelector("#send");
const messages = document.querySelector("#messages");
const status = document.querySelector("#status");
const reset = document.querySelector("#reset");
const overlay = document.querySelector("#lead-overlay");
const leadForm = document.querySelector("#lead-form");
const membershipUrl = "https://www.beglobalpro.org/membresias";
let csrf = "";
let catalog = { ctas: [], privacy_version: "", terms_version: "" };
let activeCtaId = "";

function setStatus(text, state) {
  status.textContent = text;
  status.dataset.state = state;
}

function append(text, role) {
  const article = document.createElement("article");
  article.className = `message ${role}`;
  article.textContent = text;
  messages.append(article);
  messages.scrollTop = messages.scrollHeight;
}

function appendCtas(list) {
  const seen = new Set();
  for (const cta of list || []) {
    if (!cta || seen.has(cta.id)) continue;
    seen.add(cta.id);
    const card = document.createElement("aside");
    card.className = cta.type === "membership" ? "membership-cta" : "lead-cta";
    const title = document.createElement("strong");
    title.textContent = cta.title;
    const text = document.createElement("p");
    text.textContent = cta.text;
    card.append(title, text);
    if (cta.type === "membership" && cta.url === membershipUrl) {
      const link = document.createElement("a");
      link.href = membershipUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = cta.label;
      card.append(link);
    } else if (cta.requires_lead) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = cta.label;
      button.addEventListener("click", () => openLeadForm(cta.id));
      card.append(button);
    }
    messages.append(card);
    messages.scrollTop = messages.scrollHeight;
  }
}

function openLeadForm(ctaId) {
  activeCtaId = ctaId;
  const cta = catalog.ctas.find((item) => item.id === ctaId);
  document.querySelector("#lead-cta-label").textContent = cta ? cta.title : "Registro";
  overlay.hidden = false;
  document.querySelector("#lead-name").focus();
}

function closeLeadForm() {
  overlay.hidden = true;
  leadForm.reset();
}

async function startSession() {
  input.disabled = true;
  send.disabled = true;
  setStatus("Iniciando sesión segura…", "thinking");
  const catalogResponse = await fetch("./api/catalog");
  if (catalogResponse.ok) catalog = await catalogResponse.json();
  const response = await fetch("./api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  if (!response.ok) throw new Error("session");
  csrf = (await response.json()).csrf;
  input.disabled = false;
  send.disabled = false;
  setStatus("Listo para ayudarte.", "ready");
  input.focus();
}

async function submitMessage(message) {
  const text = message.trim();
  if (!text || send.disabled) return;
  append(text, "user");
  input.value = "";
  input.disabled = true;
  send.disabled = true;
  setStatus("Pensando…", "thinking");
  try {
    const response = await fetch("./api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-BeGlobal-CSRF": csrf },
      body: JSON.stringify({ message: text }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "No fue posible responder.");
    append(payload.message, "agent");
    appendCtas(payload.ctas || (payload.cta ? [payload.cta] : []));
    setStatus("Respuesta lista.", "ready");
  } catch (error) {
    append(error.message || "No fue posible conectar con el asistente.", "error");
    setStatus("Puedes volver a intentarlo.", "error");
  } finally {
    input.disabled = false;
    send.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (event) => { event.preventDefault(); submitMessage(input.value); });
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
});
document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => {
  input.value = button.dataset.prompt;
  input.focus();
}));
reset.addEventListener("click", async () => {
  if (csrf) await fetch("./api/session/reset", { method: "POST", headers: { "X-BeGlobal-CSRF": csrf } }).catch(() => {});
  messages.replaceChildren();
  append("Hola, soy el asistente virtual de Be Global. ¿Qué te gustaría resolver hoy?", "agent");
  await startSession().catch(showStartupError);
});
window.addEventListener("message", (event) => {
  if (!["https://beglobal.softvibes.pro", "https://www.beglobal.softvibes.pro"].includes(event.origin)) return;
  if (event.data?.type === "beglobal-prefill" && typeof event.data.prompt === "string") {
    input.value = event.data.prompt.slice(0, 2000);
    input.focus();
  }
});
document.querySelector("#lead-cancel").addEventListener("click", closeLeadForm);
leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const purposes = [...leadForm.querySelectorAll("[name=purpose]:checked")].map((item) => item.value);
  const body = {
    cta_id: activeCtaId,
    name: document.querySelector("#lead-name").value,
    email: document.querySelector("#lead-email").value,
    phone: document.querySelector("#lead-phone").value,
    purposes,
    privacy_accepted: document.querySelector("#lead-privacy").checked,
    terms_accepted: document.querySelector("#lead-terms").checked,
    privacy_version: catalog.privacy_version,
    terms_version: catalog.terms_version,
  };
  try {
    const response = await fetch("./api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-BeGlobal-CSRF": csrf },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "No fue posible guardar.");
    closeLeadForm();
    append("Registro guardado con tu consentimiento. Conserva el token si quieres borrar tus datos.", "agent");
    const card = document.createElement("aside");
    card.className = "lead-cta";
    card.innerHTML = "";
    const title = document.createElement("strong");
    title.textContent = payload.cta.title;
    const text = document.createElement("p");
    text.textContent = payload.cta.url
      ? payload.cta.text
      : `${payload.cta.text} Identificador: ${payload.lead_id}. Token de borrado: ${payload.erase_token}`;
    card.append(title, text);
    if (payload.cta.url) {
      const link = document.createElement("a");
      link.href = payload.cta.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = payload.cta.label;
      card.append(link);
    }
    const erase = document.createElement("button");
    erase.type = "button";
    erase.textContent = "Borrar mis datos";
    erase.addEventListener("click", async () => {
      await fetch("./api/leads/erase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: payload.lead_id, erase_token: payload.erase_token }),
      });
      append("Tus datos de contacto fueron anonimizados.", "agent");
    });
    card.append(erase);
    messages.append(card);
    messages.scrollTop = messages.scrollHeight;
    setStatus("Registro listo.", "ready");
  } catch (error) {
    document.querySelector("#lead-error").textContent = error.message;
  }
});
function showStartupError() {
  setStatus("El chat no está disponible en este momento. Inténtalo más tarde.", "error");
}
startSession().catch(showStartupError);
