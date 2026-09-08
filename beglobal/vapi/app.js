/* Public settings only: never put a Vapi private API key in config.json. */
(() => {
  'use strict';
  const welcome = document.getElementById('welcome');
  const restore = document.getElementById('restore');
  const status = document.getElementById('status');
  const pending = document.getElementById('pending-actions');
  const errorBox = document.getElementById('connection-error');
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
          accentColor: '#218265',
          ctaButtonColor: '#123e33',
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
      status.textContent = 'Abre el botón del asesor para escribir o iniciar una llamada. El micrófono solo se activa cuando tú lo eliges.';
      // Keep the website readable when the floating widget is opened.
      document.getElementById('vapi-widget-root').addEventListener('click', hideWelcome);
    } catch {
      unavailable('No pudimos cargar el asesor. Recarga la página para volver a intentarlo; el sitio de Be Global sigue disponible.');
    }
  }
  init();
})();
