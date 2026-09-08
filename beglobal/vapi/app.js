/* Public settings only: never put a Vapi private API key in config.json. */
(() => {
  "use strict";
  const welcome = document.getElementById("welcome");
  const restore = document.getElementById("restore");
  const status = document.getElementById("status");
  const pending = document.getElementById("pending-actions");
  const errorBox = document.getElementById("connection-error");
  const chatPanel = document.getElementById("hermes-chat-panel");
  const chatFrame = document.getElementById("hermes-chat-frame");
  const chatLauncher = document.getElementById("hermes-chat-launcher");
  let pendingPrompt = "";

  const hideWelcome = () => { welcome.hidden = true; restore.hidden = false; };
  document.getElementById("minimize").addEventListener("click", () => { hideWelcome(); restore.focus(); });
  restore.addEventListener("click", () => { welcome.hidden = false; restore.hidden = true; document.getElementById("minimize").focus(); });

  function openHermesChat(prompt = "") {
    pendingPrompt = prompt;
    hideWelcome();
    chatPanel.hidden = false;
    chatLauncher.hidden = true;
    chatFrame.focus();
    if (prompt) chatFrame.contentWindow?.postMessage({ type: "beglobal-prefill", prompt }, "https://chatbeglobal.softvibes.pro");
  }
  function closeHermesChat() {
    chatPanel.hidden = true;
    chatLauncher.hidden = false;
    chatLauncher.focus();
  }
  chatFrame.addEventListener("load", () => {
    if (pendingPrompt) chatFrame.contentWindow?.postMessage({ type: "beglobal-prefill", prompt: pendingPrompt }, "https://chatbeglobal.softvibes.pro");
    pendingPrompt = "";
  });
  chatLauncher.addEventListener("click", () => openHermesChat());
  document.getElementById("close-hermes-chat").addEventListener("click", closeHermesChat);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !chatPanel.hidden) closeHermesChat(); });
  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.disabled = false;
    button.addEventListener("click", () => openHermesChat(button.dataset.prompt || ""));
  });

  function unavailable(message) {
    status.textContent = `${message} El chat escrito sigue disponible.`;
    pending.hidden = false;
  }
  function loadSDK() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@vapi-ai/client-sdk-react@0.1.1/dist/embed/widget.umd.js";
      script.async = true;
      const timeout = setTimeout(() => reject(new Error("SDK timeout")), 15000);
      script.onload = () => { clearTimeout(timeout); resolve(); };
      script.onerror = () => { clearTimeout(timeout); reject(new Error("SDK unavailable")); };
      document.head.appendChild(script);
    });
  }

  async function initVoice() {
    try {
      const response = await fetch("./config.json", { cache: "no-store", signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error("Configuration unavailable");
      const config = await response.json();
      const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuid.test(config.assistantId || "") || config.assistantIdConfirmed !== true || typeof config.publicKey !== "string" || !config.publicKey.trim()) {
        unavailable("El asesor por voz estará disponible próximamente.");
        return;
      }
      await loadSDK();
      if (typeof window.WidgetLoader !== "function") throw new Error("Widget unavailable");
      window.beGlobalVoiceWidget = new window.WidgetLoader({
        container: "#vapi-widget-root",
        component: "VapiWidget",
        props: {
          publicKey: config.publicKey.trim(),
          assistantId: config.assistantId,
          mode: "voice",
          theme: "light",
          position: "bottom-right",
          size: "full",
          borderRadius: "large",
          baseBgColor: "#ffffff",
          accentColor: "#062f55",
          ctaButtonColor: "#062f55",
          ctaButtonTextColor: "#ffffff",
          title: "Be Global Asistente",
          ctaTitle: "Habla con tu asesor",
          ctaSubtitle: "Diagnóstico gratis por voz",
          startButtonText: "Hablar",
          endButtonText: "Terminar llamada",
          voiceEmptyMessage: "Inicia la llamada cuando quieras hablar.",
          voiceActiveEmptyMessage: "Te escucho. ¿En qué puedo ayudarte?",
          voiceAutoReconnect: false,
          voiceShowTranscript: true,
          onVoiceStart: () => { hideWelcome(); errorBox.hidden = true; },
          onError: () => {
            errorBox.textContent = "No pudimos conectar la voz. Revisa tu conexión y el permiso del micrófono; el chat escrito continúa disponible.";
            errorBox.hidden = false;
          },
        },
      });
      status.textContent = "Escribe con el nuevo asistente Hermes o abre el asesor de voz. Cada canal mantiene una conversación separada.";
      document.getElementById("vapi-widget-root").addEventListener("click", hideWelcome);
    } catch {
      unavailable("No pudimos cargar el asesor por voz.");
    }
  }
  initVoice();
})();
