/* Public settings only: never put a Vapi private API key in config.json. */
(() => {
  'use strict';
  const welcome = document.getElementById('welcome');
  const restore = document.getElementById('restore');
  const status = document.getElementById('status');
  const pending = document.getElementById('pending-actions');
  const errorBox = document.getElementById('connection-error');
  const chatPanel = document.getElementById('hermes-chat-panel');
  const chatFrame = document.getElementById('hermes-chat-frame');
  const chatLauncher = document.getElementById('hermes-chat-launcher');
  const chatBackdrop = document.getElementById('chat-backdrop');
  const closeChatButton = document.getElementById('close-hermes-chat');
  const chatFocusEnd = document.getElementById('chat-focus-end');
  const closeout = document.getElementById('diagnosis-closeout');
  const hermesOrigin = 'https://chatbeglobal.softvibes.pro';
  const backgroundElements = [
    document.querySelector('.topbar'),
    document.querySelector('main')
  ].filter(Boolean);
  let pendingPrompt = '';
  let previousFocus = null;
  let diagnosisStarted = false;

  const hideWelcome = () => { welcome.hidden = true; restore.hidden = false; };
  document.getElementById('minimize').addEventListener('click', () => {
    hideWelcome(); restore.focus();
  });
  restore.addEventListener('click', () => {
    welcome.hidden = false; restore.hidden = true;
    document.getElementById('minimize').focus();
  });

  function isDiagnosisPrompt(prompt) {
    return /diagn[oó]stico/i.test(prompt || '') || /por d[oó]nde comienzo/i.test(prompt || '');
  }

  function setCloseout(visible) {
    if (!closeout) return;
    closeout.hidden = !visible;
    chatPanel.classList.toggle('has-closeout', visible);
  }

  function sendPrefill(prompt) {
    if (!prompt || !chatFrame.contentWindow) return;
    chatFrame.contentWindow.postMessage({ type: 'beglobal-prefill', prompt }, hermesOrigin);
  }

  function openHermesChat(prompt = '') {
    previousFocus = document.activeElement;
    pendingPrompt = prompt;
    chatPanel.hidden = false;
    chatBackdrop.hidden = false;
    backgroundElements.forEach((element) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });
    document.body.classList.add('chat-open');
    chatLauncher.setAttribute('aria-expanded', 'true');
    hideWelcome();
    if (isDiagnosisPrompt(prompt)) diagnosisStarted = true;
    closeChatButton.focus();
    sendPrefill(prompt);
  }

  function closeHermesChat() {
    setCloseout(false);
    diagnosisStarted = false;
    chatPanel.hidden = true;
    chatBackdrop.hidden = true;
    backgroundElements.forEach((element) => {
      element.inert = false;
      element.removeAttribute('aria-hidden');
    });
    document.body.classList.remove('chat-open');
    chatLauncher.setAttribute('aria-expanded', 'false');
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  chatFrame.addEventListener('load', () => {
    if (pendingPrompt) sendPrefill(pendingPrompt);
    pendingPrompt = '';
  });

  function requestCloseChat() {
    if (diagnosisStarted && closeout && closeout.hidden) {
      setCloseout(true);
      closeout.querySelector('a')?.focus();
      return;
    }
    closeHermesChat();
  }

  chatLauncher.addEventListener('click', () => openHermesChat());
  document.getElementById('fallback-chat').addEventListener('click', () => openHermesChat());
  closeChatButton.addEventListener('click', requestCloseChat);
  chatBackdrop.addEventListener('click', requestCloseChat);
  chatFocusEnd.addEventListener('focus', () => closeChatButton.focus());
  document.addEventListener('keydown', (event) => {
    if (chatPanel.hidden) return;
    if (event.key === 'Escape') {
      requestCloseChat();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...chatPanel.querySelectorAll(
      'button, iframe, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]):not(.focus-sentinel)'
    )].filter((element) => !element.hidden && !element.hasAttribute('disabled'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) {
      event.preventDefault();
      closeChatButton.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!chatPanel.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  });

  document.querySelectorAll('[data-prompt]').forEach((button) => {
    button.addEventListener('click', () => openHermesChat(button.dataset.prompt || ''));
  });

  function unavailable(message) {
    status.textContent = `${message} Puedes continuar por chat escrito.`;
    pending.hidden = false;
  }

  function loadSDK() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.integrity = 'sha384-qOMta6rAiHeTfB+HUC1CtXCZsZySGpiDtRyrYe5YsplpMJlN2dblO4EQQ/vF8A6X';
      script.crossOrigin = 'anonymous';
      script.src = 'https://unpkg.com/@vapi-ai/client-sdk-react@0.1.1/dist/embed/widget.umd.js';
      script.async = true;
      const timeout = setTimeout(() => reject(new Error('SDK timeout')), 15000);
      script.onload = () => { clearTimeout(timeout); resolve(); };
      script.onerror = () => { clearTimeout(timeout); reject(new Error('SDK unavailable')); };
      document.head.appendChild(script);
    });
  }

  function enhanceVoiceLauncher() {
    const launcher = document.querySelector('.vapi-widget-wrapper > div > div');
    if (!(launcher instanceof HTMLElement)) return false;
    if (launcher.dataset.beglobalEnhanced === 'true') return true;
    launcher.dataset.beglobalEnhanced = 'true';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('tabindex', '0');
    launcher.setAttribute('aria-label', 'Hablar con el asesor de voz');
    launcher.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        launcher.click();
      }
    });
    return true;
  }

  async function initVoice() {
    try {
      const response = await fetch('./config.json', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Configuration unavailable');
      const config = await response.json();
      const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuid.test(config.assistantId || '') || config.assistantIdConfirmed !== true || typeof config.publicKey !== 'string' || !config.publicKey.trim()) {
        unavailable('El asesor por voz estará disponible próximamente.');
        return;
      }
      await loadSDK();
      if (typeof window.WidgetLoader !== 'function') throw new Error('Widget unavailable');
      window.beGlobalVoiceWidget = new window.WidgetLoader({
        container: '#vapi-widget-root',
        component: 'VapiWidget',
        props: {
          publicKey: config.publicKey.trim(),
          assistantId: config.assistantId,
          mode: 'voice',
          theme: 'light',
          position: 'bottom-right',
          size: 'tiny',
          borderRadius: 'large',
          baseBgColor: '#ffffff',
          accentColor: '#ffffff',
          ctaButtonColor: '#062f55',
          ctaButtonTextColor: '#ffffff',
          title: 'Be Global Asistente',
          ctaTitle: 'Habla con tu asesor',
          ctaSubtitle: 'Orientación inicial por voz',
          startButtonText: 'Hablar',
          endButtonText: 'Terminar llamada',
          voiceEmptyMessage: 'Inicia la llamada cuando quieras hablar.',
          voiceActiveEmptyMessage: 'Te escucho. ¿En qué puedo ayudarte?',
          voiceAutoReconnect: false,
          voiceShowTranscript: true,
          onVoiceStart: () => {
            if (!chatPanel.hidden) closeHermesChat();
            hideWelcome();
            status.textContent = 'Llamada en curso. Tu asesor te está escuchando.';
            errorBox.hidden = true;
          },
          onVoiceEnd: () => {
            status.textContent = 'Canal de voz listo. Inicia otra llamada cuando quieras.';
          },
          onError: () => {
            status.textContent = 'La voz no pudo conectarse.';
            errorBox.textContent = 'No pudimos conectar la voz. Revisa tu conexión y el permiso del micrófono; el chat escrito continúa disponible.';
            errorBox.hidden = false;
            pending.hidden = false;
          }
        }
      });
      const observer = new MutationObserver(enhanceVoiceLauncher);
      observer.observe(document.body, { childList: true, subtree: true });
      enhanceVoiceLauncher();
      status.textContent = 'Escribe al asesor o pulsa Hablar para voz. Tú decides cuándo empezar.';
    } catch {
      unavailable('No pudimos cargar el asesor por voz.');
    }
  }

  initVoice();
})();
