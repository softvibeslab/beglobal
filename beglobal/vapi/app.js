/* Public settings only: never put a Vapi private API key in config.json. */
(() => {
  'use strict';
  const welcome = document.getElementById('welcome');
  const restore = document.getElementById('restore');
  const status = document.getElementById('status');
  const pending = document.getElementById('pending-actions');
  const errorBox = document.getElementById('connection-error');
  const widgetRoot = document.getElementById('vapi-widget-root');
  const shortcuts = document.getElementById('chat-shortcuts');
  const chatInput = () => widgetRoot.querySelector('input[placeholder="Escribe tu duda…"]');
  let quickActionBusy = false;
  const hideWelcome = () => { welcome.hidden = true; restore.hidden = false; };
  document.getElementById('minimize').addEventListener('click', () => {
    hideWelcome(); restore.focus();
  });
  restore.addEventListener('click', () => {
    welcome.hidden = false; restore.hidden = true;
    document.getElementById('minimize').focus();
  });

  function unavailable(message) {
    status.textContent = message;
    pending.hidden = false;
  }

  function loadSDK() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@vapi-ai/client-sdk-react@0.1.1/dist/embed/widget.umd.js';
      script.async = true;
      const timeout = setTimeout(() => reject(new Error('SDK timeout')), 15000);
      script.onload = () => { clearTimeout(timeout); resolve(); };
      script.onerror = () => { clearTimeout(timeout); reject(new Error('SDK unavailable')); };
      document.head.appendChild(script);
    });
  }

  // Adapter for the pinned SDK: its public API does not expose draft/open methods.
  // Keep our shortcut toolbar outside React's DOM so rerenders cannot remove it.
  function positionShortcuts() {
    const input = chatInput();
    const visible = input && !input.disabled && input.getBoundingClientRect().width > 0;
    shortcuts.hidden = !visible;
    widgetRoot.classList.toggle('has-chat-shortcuts', Boolean(visible));
    if (!visible) return;
    const composer = input.parentElement.getBoundingClientRect();
    shortcuts.style.left = `${composer.left}px`;
    shortcuts.style.width = `${composer.width}px`;
    shortcuts.style.bottom = `${window.innerHeight - composer.top + 15}px`;
  }

  async function prepareMessage(message) {
    if (quickActionBusy) return;
    quickActionBusy = true;
    try {
      let input = chatInput();
      if (!input) {
        const launcher = Array.from(widgetRoot.querySelectorAll('*')).find(element =>
          element.childElementCount === 0 && element.textContent.trim() === 'Habla o escribe con tu asesor');
        if (!launcher) throw new Error('Widget is not ready');
        launcher.click();
        input = await new Promise((resolve, reject) => {
          const observer = new MutationObserver(() => {
            const field = chatInput();
            if (field) { observer.disconnect(); clearTimeout(timeout); resolve(field); }
          });
          const timeout = setTimeout(() => { observer.disconnect(); reject(new Error('Chat did not open')); }, 3000);
          observer.observe(widgetRoot, { childList: true, subtree: true });
          const field = chatInput();
          if (field) { observer.disconnect(); clearTimeout(timeout); resolve(field); }
        });
      }
      if (input.disabled) throw new Error('Finish voice call first');
      // Native setter + input event updates React state, including the send button.
      // Preserve any draft already written by the visitor; never send automatically.
      const draft = input.value.trim();
      const next = draft ? (draft.includes(message) ? draft : `${draft} ${message}`) : message;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, next);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      input.setSelectionRange(next.length, next.length);
      hideWelcome();
      errorBox.hidden = true;
      positionShortcuts();
    } catch {
      errorBox.textContent = 'Abre el chat para escribir tu pregunta. Si hay una llamada en curso, termínala antes de usar el chat.';
      errorBox.hidden = false;
    } finally {
      quickActionBusy = false;
    }
  }

  document.querySelectorAll('[data-prompt]').forEach(button => {
    button.addEventListener('click', () => prepareMessage(button.dataset.prompt));
  });

  async function init() {
    try {
      const response = await fetch('./config.json', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Configuration unavailable');
      const config = await response.json();
      const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuid.test(config.assistantId || '') || config.assistantIdConfirmed !== true || typeof config.publicKey !== 'string' || !config.publicKey.trim()) {
        unavailable('El asesor por voz y chat estará disponible próximamente. Mientras tanto, puedes explorar Be Global y sus membresías.');
        return;
      }
      await loadSDK();
      if (typeof window.WidgetLoader !== 'function') throw new Error('Widget unavailable');
      window.beGlobalWidget = new window.WidgetLoader({
        container: '#vapi-widget-root',
        component: 'VapiWidget',
        props: {
          publicKey: config.publicKey.trim(),
          assistantId: config.assistantId,
          mode: 'hybrid',
          theme: 'light',
          position: 'bottom-right',
          size: 'full',
          borderRadius: 'large',
          baseBgColor: '#ffffff',
          accentColor: '#062f55',
          ctaButtonColor: '#062f55',
          ctaButtonTextColor: '#ffffff',
          title: 'Be Global Asistente',
          ctaTitle: 'Habla o escribe con tu asesor',
          ctaSubtitle: 'Resuelve tus dudas · Diagnóstico gratis',
          startButtonText: 'Hablar',
          endButtonText: 'Terminar llamada',
          chatPlaceholder: 'Escribe tu duda…',
          chatFirstMessage: '¡Hola! Soy el asistente virtual de Be Global. Puedo resolver tus dudas y hacer contigo un diagnóstico gratuito. ¿Qué te gustaría resolver hoy?',
          chatEmptyMessage: 'Escribe tu duda para comenzar.',
          voiceEmptyMessage: 'Inicia la llamada cuando quieras hablar.',
          voiceActiveEmptyMessage: 'Te escucho. ¿En qué puedo ayudarte?',
          hybridEmptyMessage: 'Escribe un mensaje o toca el micrófono para hablar con tu asesor.',
          chatEndMessage: 'Gracias por conversar con Be Global. ¡Hasta pronto!',
          voiceAutoReconnect: false,
          voiceShowTranscript: true,
          onVoiceStart: () => { hideWelcome(); errorBox.hidden = true; },
          onMessage: () => { hideWelcome(); errorBox.hidden = true; },
          onError: () => {
            errorBox.textContent = 'No pudimos conectar con el asesor. Revisa tu conexión y, si estás usando voz, el permiso del micrófono. Puedes intentar escribir o volver a iniciar la conversación.';
            errorBox.hidden = false;
          }
        }
      });
      document.querySelectorAll('#welcome [data-prompt]').forEach(button => { button.disabled = false; });
      const observer = new MutationObserver(positionShortcuts);
      observer.observe(widgetRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
      new ResizeObserver(positionShortcuts).observe(widgetRoot);
      window.addEventListener('resize', positionShortcuts);
      if (window.visualViewport) window.visualViewport.addEventListener('resize', positionShortcuts);
      positionShortcuts();
      status.textContent = 'Elige una pregunta rápida para prepararla en el chat o abre el asesor para hablar. Tú decides cuándo enviar o activar el micrófono.';
      // Keep the website readable when the floating widget is opened.
      document.getElementById('vapi-widget-root').addEventListener('click', hideWelcome);
    } catch {
      unavailable('No pudimos cargar el asesor. Recarga la página para volver a intentarlo; el sitio de Be Global sigue disponible.');
    }
  }
  init();
})();
