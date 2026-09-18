import { renderNotice } from './cards.js';

const $ = id => document.getElementById(id);
const planNames = { pro_agente: 'PRO Agente', pro_creador: 'PRO Creador', pro_negocio: 'PRO Negocio', none: 'Sin plan' };
const membershipNames = { active: 'Vigente', expired: 'Vencida', suspended: 'Suspendida', revoked: 'Revocada', unknown: 'Por verificar' };
const initDataCodes = new Set(['INITDATA_BAD_SIGNATURE', 'INITDATA_STALE', 'INITDATA_REPLAY', 'INITDATA_UNSIGNED', 'INITDATA_INVALID', 'MEMBER_LINK_REQUIRED']);
let workspace = null;
let requestVersion = 0;
let configReady = false;
let mutationBusy = false;
let ttlTimer = 0;

async function api(path, body) {
  let response;
  try {
    response = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json', 'X-Workspace-Intent': 'fixture-demo' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    throw { status: 0, code: 'NETWORK_ERROR', message: 'No pudimos conectar con la demo local. Revisa que el servidor esté abierto y vuelve a intentar.' };
  }
  let payload;
  try { payload = await response.json(); }
  catch { throw { status: response.status, code: 'INVALID_RESPONSE', message: 'La respuesta no pudo leerse. No se mostrará información anterior como si estuviera actualizada.' }; }
  if (!response.ok) throw { ...payload, status: response.status };
  return payload.data;
}

function announce(text) { $('live-status').textContent = text; }
function stopTtl() {
  if (ttlTimer) window.clearInterval(ttlTimer);
  ttlTimer = 0;
  $('session-ttl').hidden = true;
  $('session-ttl').textContent = '';
}
function paintTtl(expiresAt) {
  const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = String(remaining % 60).padStart(2, '0');
  $('session-ttl').hidden = false;
  $('session-ttl').textContent = remaining === 0
    ? 'Sesión caducada · 15 min en servidor'
    : `Caduca en ${minutes}:${seconds} · 15 min`;
}
function startTtl(expiresAt) {
  stopTtl();
  if (!expiresAt) return;
  paintTtl(expiresAt);
  ttlTimer = window.setInterval(() => {
    if (!workspace?.context?.sessionExpiresAt) { stopTtl(); return; }
    paintTtl(workspace.context.sessionExpiresAt);
  }, 1000);
}
function hidePrivate() {
  workspace = null;
  stopTtl();
  $('member-content').hidden = true;
  $('logout').hidden = true;
  $('logout-all').hidden = true;
  $('probe-result').hidden = true;
  $('probe-result').textContent = '';
  $('link-result').hidden = true;
  $('link-result').textContent = '';
  $('challenge-id').value = '';
  $('link-status').textContent = '';
  for (const id of ['member-name', 'member-goal', 'business-name', 'membership-value', 'verification-value', 'plan-value', 'person-id', 'business-id', 'capabilities', 'decision-reason', 'checked-at', 'membership-copy', 'verification-copy']) $(id).textContent = '';
  $('notice-holder').replaceChildren();
}
function setEntry(title, copy, retry = false) {
  $('entry-state').hidden = false;
  $('entry-title').textContent = title;
  $('entry-copy').textContent = copy;
  $('retry').hidden = !retry;
  announce(title);
}
function failure(error) {
  hidePrivate();
  if (initDataCodes.has(error.code)) {
    setEntry('La prueba de Telegram no es válida.', error.message || 'Firma, caducidad o replay rechazados. No se abrió sesión.');
  } else if (error.status === 401) {
    setEntry('Tu sesión de prueba no está abierta.', 'Elige una persona y abre su espacio. Esto no significa que su membresía esté vencida.');
  } else if (error.status === 403) {
    setEntry('Tu sesión está abierta. Este negocio no.', 'El permiso de negocio fue retirado en el escenario de prueba. Elige otro escenario para continuar; un plan superior no concede ese permiso.');
  } else {
    setEntry(error.status === 0 ? 'No hay conexión con la demo.' : 'No pudimos consultar tu espacio.', error.message || 'Intenta nuevamente. No mostramos datos anteriores como actuales.', true);
  }
}
function fillOptions(select, options, preferred) {
  select.replaceChildren();
  for (const item of options) {
    const option = document.createElement('option'); option.value = item.id; option.textContent = item.label;
    select.append(option);
  }
  select.value = preferred;
}
function setDemoEnabled(enabled) {
  $('persona').disabled = !enabled;
  $('scenario').disabled = !enabled;
  $('open-demo').disabled = !enabled;
  $('telegram-id').disabled = !enabled;
  $('init-data').disabled = !enabled;
  $('mint-initdata').disabled = !enabled;
  $('open-telegram').disabled = !enabled;
}

function render(value) {
  if (!value?.profile || !value?.access || value?.context?.syntheticOnly !== true) throw { code: 'INVALID_RESPONSE', message: 'Falta una respuesta de perfil válida y marcada como simulación.' };
  workspace = value;
  const { profile, access, context } = value;
  $('persona').value = context.personaKey;
  $('scenario').value = context.scenarioKey;
  $('entry-state').hidden = true; $('member-content').hidden = false; $('logout').hidden = false; $('logout-all').hidden = false;
  startTtl(context.sessionExpiresAt);
  $('member-name').textContent = `Hola, ${profile.displayName}`;
  $('member-goal').textContent = profile.goal;
  $('business-name').textContent = context.businessName;
  $('member-role').textContent = 'Rol: miembro';
  $('membership-value').textContent = membershipNames[access.membershipStatus] || 'Por verificar';
  $('membership-value').dataset.state = access.membershipStatus === 'active' ? 'good' : 'attention';
  $('membership-copy').textContent = access.membershipStatus === 'active' ? 'La vigencia académica del escenario está confirmada. El recurso siempre vuelve a comprobarla.' : 'El plan del agente no sustituye una membresía académica vigente.';
  $('verification-value').textContent = access.verificationStatus === 'verified' ? 'Comprobada en demo' : 'No disponible';
  $('verification-value').dataset.state = access.verificationStatus === 'verified' ? 'good' : 'attention';
  $('verification-copy').textContent = access.verificationStatus === 'verified' ? 'El puente validó el sujeto, el estado y las fechas del escenario sintético.' : 'No pudimos verificar la membresía. Tu sesión sigue abierta y el acceso PRO se bloquea.';
  $('checked-at').textContent = `Consulta local: ${new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(access.checkedAt))}`;
  $('plan-value').textContent = planNames[access.agentPlan] || 'Sin plan';
  $('person-id').textContent = profile.personId; $('business-id').textContent = profile.businessId;
  $('capabilities').textContent = access.capabilities.join(' · ');
  $('decision-reason').textContent = access.reason;
  renderNotice($('notice-holder'), access.verificationStatus === 'verified' ? value.notice : { type: 'notice', version: 1, severity: 'warning', text: 'No pudimos verificar tu membresía. No necesitas iniciar sesión otra vez ni comprar otro plan para consultar tu perfil.' });
  document.querySelectorAll('[data-plan]').forEach(card => {
    const selected = card.dataset.plan === access.agentPlan;
    card.classList.toggle('selected', selected);
    card.querySelector('.plan-flag').textContent = selected ? 'TU PLAN DE PRUEBA' : 'PLAN DE REFERENCIA';
  });
  const authLabel = context.auth === 'telegram-fixture' ? 'Sesión por initData fixture.' : 'Sesión por selector de prueba.';
  const link = value.link || {};
  $('link-status').textContent = link.linked
    ? `Vínculo único auditado · Telegram ${link.telegramId} · sujeto ${profile.personId}`
    : (link.challengePending ? 'Hay un desafío vigente de 5 min. Aún no hay vínculo.' : 'Sin vínculo HMAC en esta sesión ficticia.');
  announce(`Perfil de ${profile.displayName}. ${authLabel} Membresía ${membershipNames[access.membershipStatus]}. ${planNames[access.agentPlan]}.`);
}

function showLinkResult(text, kind) {
  $('link-result').hidden = false;
  $('link-result').className = 'probe-result' + (kind === 'good' ? ' good' : kind === 'attention' ? ' attention' : '');
  $('link-result').textContent = text;
}

async function createChallenge() {
  if (!workspace || mutationBusy) return;
  mutationBusy = true;
  try {
    const minted = await api('/demo/v1/link-intent', {});
    $('challenge-id').value = minted.challengeId;
    showLinkResult('Desafío de un solo uso creado. Caduca en 5 minutos. No se guardó en el perfil JSON.', 'good');
    announce('Desafío de vinculación listo.');
  } catch (error) {
    if (error.status === 401) failure(error);
    else showLinkResult(`${error.code || error.status || 'Red'} · ${error.message}`, 'attention');
  } finally { mutationBusy = false; }
}

async function confirmLink(event) {
  event.preventDefault();
  if (!workspace || mutationBusy) return;
  const challengeId = $('challenge-id').value.trim();
  const initData = $('init-data').value.trim();
  if (!challengeId) { showLinkResult('Crea primero un desafío de 5 minutos.', 'attention'); return; }
  if (!initData) { showLinkResult('Genera o pega initData fixture del mismo sujeto.', 'attention'); return; }
  mutationBusy = true;
  try {
    const result = await api('/demo/v1/link', { challengeId, initData });
    $('challenge-id').value = '';
    $('init-data').value = '';
    showLinkResult(result.alreadyLinked ? 'El vínculo único ya existía. No se fusionó historial.' : `Vínculo único auditado con Telegram ${result.telegramId}.`, 'good');
    const value = await api('/demo/v1/workspace');
    render(value);
  } catch (error) {
    $('challenge-id').value = '';
    if (error.status === 401 && !initDataCodes.has(error.code)) failure(error);
    else showLinkResult(`${error.code || error.status || 'Red'} · ${error.message}`, 'attention');
  } finally { mutationBusy = false; }
}

async function unlinkTelegram() {
  if (!workspace || mutationBusy) return;
  const initData = $('init-data').value.trim();
  if (!initData) { showLinkResult('Genera un initData fresco del mismo sujeto antes de desvincular.', 'attention'); return; }
  mutationBusy = true;
  try {
    const result = await api('/demo/v1/unlink', { initData });
    $('init-data').value = '';
    showLinkResult(`Telegram ${result.telegramId} desvinculado. La sesión web sigue abierta.`, 'good');
    const value = await api('/demo/v1/workspace');
    render(value);
  } catch (error) {
    if (error.status === 401 && !initDataCodes.has(error.code)) failure(error);
    else showLinkResult(`${error.code || error.status || 'Red'} · ${error.message}`, 'attention');
  } finally { mutationBusy = false; }
}

async function recoverByName() {
  if (!workspace || mutationBusy) return;
  mutationBusy = true;
  try {
    await api('/demo/v1/recover', { displayName: workspace.profile.displayName });
    showLinkResult('Resultado inesperado: la recuperación debía denegarse.', 'attention');
  } catch (error) {
    if (error.status === 401) failure(error);
    else showLinkResult(`${error.code || error.status || 'Red'} · ${error.message}`, error.code === 'IDENTITY_RECOVERY_DENIED' ? 'good' : 'attention');
  } finally { mutationBusy = false; }
}

async function loadWorkspace() {
  const restoreRefreshFocus = document.activeElement === $('refresh');
  const version = ++requestVersion;
  hidePrivate(); setEntry('Consultando tu espacio…', 'Verificamos la sesión, el negocio y el estado de acceso en el servidor.');
  $('refresh').disabled = true;
  try {
    const value = await api('/demo/v1/workspace');
    if (version === requestVersion) render(value);
  } catch (error) { if (version === requestVersion) failure(error); }
  finally {
    if (version === requestVersion) {
      $('refresh').disabled = false;
      if (restoreRefreshFocus && workspace) $('refresh').focus();
    }
  }
}

async function startDemo(event) {
  event.preventDefault();
  if (!configReady || mutationBusy) return;
  mutationBusy = true; ++requestVersion; hidePrivate();
  setDemoEnabled(false);
  setEntry('Abriendo sesión de prueba…', 'Sólo se usan identidades ficticias en esta computadora.');
  try { await api('/demo/v1/session', { persona: $('persona').value, scenario: $('scenario').value }); await loadWorkspace(); }
  catch (error) { failure(error); }
  finally { mutationBusy = false; setDemoEnabled(true); $('open-demo').focus(); }
}

async function mintInitData() {
  if (!configReady || mutationBusy) return;
  mutationBusy = true;
  try {
    const minted = await api('/demo/v1/telegram-fixture', { telegramId: Number($('telegram-id').value) });
    $('init-data').value = minted.initData;
    announce('initData fixture generado en el servidor. Aún no abre sesión hasta que lo intercambies.');
  } catch (error) { failure(error); }
  finally { mutationBusy = false; }
}

async function startTelegram(event) {
  event.preventDefault();
  if (!configReady || mutationBusy) return;
  const initData = $('init-data').value.trim();
  if (!initData) { setEntry('Falta la prueba HMAC.', 'Genera o pega initData fixture. Un userId en el cliente no elige al miembro.'); return; }
  mutationBusy = true; ++requestVersion; hidePrivate();
  setDemoEnabled(false);
  setEntry('Intercambiando prueba de Telegram…', 'El servidor verifica HMAC, caducidad y mapeo. No hay bot real.');
  try { await api('/demo/v1/telegram-session', { initData }); await loadWorkspace(); }
  catch (error) { failure(error); }
  finally { mutationBusy = false; setDemoEnabled(true); $('open-telegram').focus(); }
}

async function probe(kind) {
  if (!workspace) return;
  const version = requestVersion;
  const { profile, context } = workspace;
  $('probe-pro').disabled = true; $('probe-isolation').disabled = true;
  $('probe-result').hidden = false; $('probe-result').className = 'probe-result'; $('probe-result').textContent = 'Consultando al servidor local…';
  try {
    const path = kind === 'pro' ? `/api/v1/businesses/${encodeURIComponent(profile.businessId)}/resources/demo-pro` : `/api/v1/businesses/${encodeURIComponent(context.otherBusinessId)}/profile`;
    const result = await api(path);
    if (version !== requestVersion) return;
    $('probe-result').textContent = kind === 'pro' ? result.text : 'Resultado inesperado: la comprobación debe denegar el recurso ajeno.';
  } catch (error) {
    if (version !== requestVersion) return;
    if (error.status === 401) { failure(error); return; }
    $('probe-result').className = 'probe-result ' + (kind === 'isolation' && error.status === 404 ? 'good' : 'attention');
    $('probe-result').textContent = kind === 'isolation' && error.status === 404 ? 'Aislamiento comprobado: el servidor denegó el perfil del otro negocio (404), sin devolver sus datos.' : `${error.status || 'Red'} · ${error.message}`;
  } finally { $('probe-pro').disabled = false; $('probe-isolation').disabled = false; }
}

$('demo-form').addEventListener('submit', startDemo);
$('telegram-form').addEventListener('submit', startTelegram);
$('mint-initdata').addEventListener('click', mintInitData);
$('link-form').addEventListener('submit', confirmLink);
$('create-challenge').addEventListener('click', createChallenge);
$('recover-name').addEventListener('click', recoverByName);
$('unlink-telegram').addEventListener('click', unlinkTelegram);
$('refresh').addEventListener('click', loadWorkspace);
$('probe-pro').addEventListener('click', () => probe('pro'));
$('probe-isolation').addEventListener('click', () => probe('isolation'));
$('retry').addEventListener('click', () => configReady ? loadWorkspace() : init());
$('logout').addEventListener('click', async () => {
  if (mutationBusy) return;
  ++requestVersion; hidePrivate(); mutationBusy = true;
  try { await api('/demo/v1/logout', {}); setEntry('Sesión de prueba cerrada.', 'Puedes abrir otra persona, escenario o prueba HMAC. No se ha borrado información de ninguna cuenta real.'); }
  catch (error) { failure(error); }
  finally { mutationBusy = false; }
});
$('logout-all').addEventListener('click', async () => {
  if (mutationBusy) return;
  ++requestVersion; hidePrivate(); mutationBusy = true;
  try { await api('/demo/v1/logout-all', {}); setEntry('Todas las sesiones de esta persona se cerraron.', 'Una cookie anterior de Lucía o Diego ya no abre el espacio. El historial sintético no se borra porque esta demo no guarda entregables.'); }
  catch (error) { failure(error); }
  finally { mutationBusy = false; }
});
$('persona').addEventListener('change', () => { ++requestVersion; hidePrivate(); setEntry('Abre el espacio de la persona elegida.', 'El cambio se aplicará al pulsar Abrir mi espacio.'); });
$('scenario').addEventListener('change', () => { ++requestVersion; hidePrivate(); setEntry('Prueba el nuevo escenario.', 'Pulsa Abrir mi espacio para aplicarlo en una sesión ficticia.'); });

async function init() {
  try {
    const config = await api('/demo/v1/config');
    if (!config.syntheticOnly || !config.fixturesEnabled) { setEntry('Las sesiones de prueba están deshabilitadas.', 'Inicia el servidor local con --fixtures para explorar. No hay acceso de miembros reales en este prototipo.'); return; }
    fillOptions($('persona'), config.personas, 'lucia'); fillOptions($('scenario'), config.scenarios, 'active_creador');
    configReady = true; setDemoEnabled(true);
    const value = await api('/demo/v1/workspace'); render(value);
  } catch (error) {
    if (error.status === 401 && configReady) return;
    failure(error);
  }
}
init();
