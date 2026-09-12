/* Preview only: no storage, analytics, lead submission, auto-send, or voice SDK. */
(() => {
  'use strict';
  const dialog = document.getElementById('webinar-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const examples = Object.freeze({
    leads: {
      label: 'CONVERSACIONES QUE EMPIEZAN CON VALOR',
      title: 'Abre una conversación, no un discurso de venta.',
      copy: '«¿Qué te está costando más de [tarea relacionada con tu producto]? Si te sirve, puedo compartirte una idea para empezar.»',
      review: 'Adáptalo a tu oferta y a una relación existente. No es una invitación a enviar mensajes masivos ni promete conseguir clientes.',
      draft: 'Me interesa el webinar de agentes BeGlobal. Quiero preparar un mensaje útil para conversar con posibles clientes. ¿Qué necesitas saber de mi negocio para ayudarme?'
    },
    atencion: {
      label: 'ATENCIÓN CON UN SIGUIENTE PASO',
      title: 'Aclara la duda. Facilita la siguiente decisión.',
      copy: '«Gracias por preguntar. Para recomendarte la opción adecuada, ¿qué necesitas resolver? Te explico las diferencias y tú eliges cómo continuar.»',
      review: 'Verifica precios, disponibilidad y políticas antes de responder. Si hace falta una excepción, la decisión es del equipo humano.',
      draft: 'Me interesa el webinar de agentes BeGlobal. Quiero mejorar las respuestas a las dudas frecuentes de mis clientes. Ayúdame a elegir una primera tarea concreta.'
    },
    contenido: {
      label: 'CONTENIDO QUE AYUDA ANTES DE VENDER',
      title: 'Tu próxima publicación puede empezar con una duda.',
      copy: 'Estructura: «¿Te pasa [problema]? Prueba [paso sencillo]. Comprueba [señal observable]. Si quieres ver un ejemplo, dime qué necesitas resolver.»',
      review: 'Usa un problema real y recomendaciones que puedas respaldar. Revisa el borrador antes de publicarlo; no promete alcance ni ventas.',
      draft: 'Me interesa el webinar de agentes BeGlobal. Quiero convertir una pregunta frecuente de mi audiencia en una publicación útil. ¿Cómo comenzamos?'
    }
  });

  const steps = {
    invite: { node: document.getElementById('invite-step'), title: 'modal-title', description: 'modal-description' },
    goal: { node: document.getElementById('goal-step'), title: 'goal-title', description: 'goal-description' },
    result: { node: document.getElementById('result-step'), title: 'result-title', description: 'result-description' }
  };
  const draft = document.getElementById('handoff-draft');
  const copyButton = document.getElementById('copy-draft');
  const copyStatus = document.getElementById('copy-status');
  let opener = null;
  let generation = 0;

  function showStep(name) {
    generation += 1;
    for (const [key, step] of Object.entries(steps)) step.node.hidden = key !== name;
    dialog.setAttribute('aria-labelledby', steps[name].title);
    dialog.setAttribute('aria-describedby', steps[name].description);
    dialog.scrollTop = 0;
    copyStatus.textContent = '';
    copyButton.disabled = false;
    document.getElementById(steps[name].title).focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-open="webinar"]').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      if (dialog.open) return;
      opener = button;
      dialog.showModal();
      document.body.classList.add('modal-open');
      showStep('invite');
    });
  });
  document.querySelectorAll('[data-close], #close-modal').forEach(button => button.addEventListener('click', () => dialog.close()));
  // Native <dialog> makes the background inert and handles Escape.
  // Cycle Tab explicitly, including on Macs whose browser skips buttons by default.
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || event.ctrlKey || event.metaKey || event.altKey) return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled), a[href], textarea:not(:disabled)')]
      .filter(control => control.getClientRects().length > 0);
    if (!controls.length) return;
    const index = controls.indexOf(document.activeElement);
    const next = index < 0
      ? (event.shiftKey ? controls.length - 1 : 0)
      : (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
    event.preventDefault();
    controls[next].focus();
  });
  dialog.addEventListener('close', () => {
    generation += 1;
    document.body.classList.remove('modal-open');
    draft.value = '';
    for (const id of ['result-label', 'sample-title', 'sample-copy', 'sample-review']) document.getElementById(id).textContent = '';
    copyStatus.textContent = '';
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  // Close only when the gesture both starts and ends on the backdrop.
  let backdropPointer = false;
  function isBackdrop(event) {
    const rect = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  }
  dialog.addEventListener('pointerdown', event => { backdropPointer = isBackdrop(event); });
  dialog.addEventListener('pointerup', event => {
    if (backdropPointer && isBackdrop(event)) dialog.close();
    backdropPointer = false;
  });
  dialog.addEventListener('pointercancel', () => { backdropPointer = false; });

  document.getElementById('start-preview').addEventListener('click', () => showStep('goal'));
  document.getElementById('back-invite').addEventListener('click', () => showStep('invite'));
  document.getElementById('change-goal').addEventListener('click', () => showStep('goal'));
  document.querySelectorAll('[data-goal]').forEach(button => button.addEventListener('click', () => {
    const example = examples[button.dataset.goal];
    if (!example) return;
    document.getElementById('result-label').textContent = example.label;
    document.getElementById('sample-title').textContent = example.title;
    document.getElementById('sample-copy').textContent = example.copy;
    document.getElementById('sample-review').textContent = example.review;
    draft.value = example.draft;
    showStep('result');
  }));

  copyButton.addEventListener('click', async () => {
    const currentGeneration = generation;
    const text = draft.value;
    copyButton.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if (generation === currentGeneration && dialog.open) copyStatus.textContent = 'Pregunta copiada. Pégala en el asesor cuando tú decidas enviarla.';
    } catch {
      if (generation === currentGeneration && dialog.open) {
        draft.focus();
        draft.select();
        copyStatus.textContent = 'No se pudo copiar automáticamente. El texto está seleccionado: usa Copiar en tu dispositivo.';
      }
    } finally {
      if (generation === currentGeneration) copyButton.disabled = false;
    }
  });
  document.getElementById('script-status').hidden = true;
})();
