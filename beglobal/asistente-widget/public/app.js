"use strict";
const form = document.querySelector("#chat-form");
const input = document.querySelector("#message");
const send = document.querySelector("#send");
const messages = document.querySelector("#messages");
const status = document.querySelector("#status");
const reset = document.querySelector("#reset");
const membershipUrl = "https://www.beglobalpro.org/membresias";
let csrf = "";

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

function appendCta(cta) {
  if (!cta || cta.type !== "membership" || cta.url !== membershipUrl) return;
  const card = document.createElement("aside");
  card.className = "membership-cta";
  card.setAttribute("aria-label", "Invitación a membresías Be Global Pro");
  const title = document.createElement("strong");
  title.textContent = cta.title;
  const text = document.createElement("p");
  text.textContent = cta.text;
  const link = document.createElement("a");
  link.href = membershipUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = cta.label;
  card.append(title, text, link);
  messages.append(card);
  messages.scrollTop = messages.scrollHeight;
}

async function startSession() {
  input.disabled = true;
  send.disabled = true;
  setStatus("Iniciando sesión segura…", "thinking");
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
    appendCta(payload.cta);
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
function showStartupError() {
  setStatus("El chat no está disponible en este momento. Inténtalo más tarde.", "error");
}
startSession().catch(showStartupError);
