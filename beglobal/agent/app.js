'use strict';
(() => {
  const dialog = document.querySelector('#chat-dialog');
  const frame = document.querySelector('#chat-frame');
  const status = document.querySelector('#chat-status');
  const launcher = document.querySelector('#chat-launcher');
  let opener = launcher;
  let timer;

  frame.addEventListener('load', () => {
    if (!frame.getAttribute('src')) return;
    clearTimeout(timer);
    // Cross-origin load does not establish backend health or PRO authorization.
    status.textContent = 'Si el chat no aparece, ábrelo en otra pestaña.';
  });
  document.querySelectorAll('[data-open-chat]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      dialog.showModal();
      document.body.classList.add('chat-open');
      launcher.setAttribute('aria-expanded', 'true');
      if (!frame.getAttribute('src')) {
        status.textContent = 'Abriendo el chat…';
        frame.src = 'https://chatbeglobal.softvibes.pro/';
        timer = setTimeout(() => {
          status.textContent = 'El chat está tardando. Puedes abrirlo en otra pestaña.';
        }, 12000);
      }
    });
  });
  document.querySelector('#close-chat').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('chat-open');
    launcher.setAttribute('aria-expanded', 'false');
    opener.focus();
  });
  document.querySelector('#minimize').addEventListener('click', () => {
    document.querySelector('#welcome').hidden = true;
    launcher.focus();
  });
})();
