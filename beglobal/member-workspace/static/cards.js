// Only the notice subset is implemented in SP-001. Never render LLM HTML.
export function renderNotice(container, value) {
  container.replaceChildren();
  const allowed = ['type', 'version', 'severity', 'text'];
  const valid = value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === allowed.length
    && Object.keys(value).every(key => allowed.includes(key))
    && value.type === 'notice' && value.version === 1
    && ['info', 'warning', 'error'].includes(value.severity)
    && typeof value.text === 'string' && value.text.length > 0 && value.text.length <= 2000;
  const box = document.createElement('p');
  box.className = `notice ${valid ? value.severity : 'warning'}`;
  box.textContent = valid ? value.text : 'No pudimos mostrar esta tarjeta de forma segura. Tu acceso sigue protegido.';
  container.append(box);
  return Boolean(valid);
}
