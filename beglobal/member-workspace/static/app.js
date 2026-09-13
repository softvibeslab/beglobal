import { renderNotice } from './cards.js';

const $ = id => document.getElementById(id);
const planNames = { pro_agente: 'PRO Agente', pro_creador: 'PRO Creador', pro_negocio: 'PRO Negocio', none: 'Sin plan' };
const membershipNames = { active: 'Vigente', expired: 'Vencida', suspended: 'Suspendida', revoked: 'Revocada', unknown: 'Por verificar' };
let workspace = null;
let requestVersion = 0;
let configReady = false;
let mutationBusy = false;

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
function hidePrivate() {
  workspace = null;
  $('member-content').hidden = true;
  $('probe-result').hidden = true;
  $('probe-result').textContent = '';
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
  if (error.status === 401) {
    $('logout').hidden = true;
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

function render(value) {
  if (!value?.profile || !value?.access || value?.context?.syntheticOnly !== true) throw { code: 'INVALID_RESPONSE', message: 'Falta una respuesta de perfil válida y marcada como simulación.' };
  workspace = value;
  const { profile, access, context } = value;
  $('persona').value = context.personaKey;
  $('scenario').value = context.scenarioKey;
  $('entry-state').hidden = true; $('member-content').hidden = false; $('logout').hidden = false;
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
  announce(`Perfil de ${profile.displayName}. Membresía ${membershipNames[access.membershipStatus]}. ${planNames[access.agentPlan]}.`);
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
  $('open-demo').disabled = true; $('persona').disabled = true; $('scenario').disabled = true;
  setEntry('Abriendo sesión de prueba…', 'Sólo se usan identidades ficticias en esta computadora.');
  try { await api('/demo/v1/session', { persona: $('persona').value, scenario: $('scenario').value }); await loadWorkspace(); }
  catch (error) { failure(error); }
  finally { mutationBusy = false; $('open-demo').disabled = false; $('persona').disabled = false; $('scenario').disabled = false; $('open-demo').focus(); }
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
$('refresh').addEventListener('click', loadWorkspace);
$('probe-pro').addEventListener('click', () => probe('pro'));
$('probe-isolation').addEventListener('click', () => probe('isolation'));
$('retry').addEventListener('click', () => configReady ? loadWorkspace() : init());
$('logout').addEventListener('click', async () => {
  if (mutationBusy) return;
  ++requestVersion; hidePrivate(); mutationBusy = true;
  try { await api('/demo/v1/logout', {}); $('logout').hidden = true; setEntry('Sesión de prueba cerrada.', 'Puedes abrir otra persona o escenario. No se ha borrado información de ninguna cuenta real.'); }
  catch (error) { failure(error); }
  finally { mutationBusy = false; }
});
// Clear stale person data immediately when preparing a different synthetic login.
$('persona').addEventListener('change', () => { ++requestVersion; hidePrivate(); setEntry('Abre el espacio de la persona elegida.', 'El cambio se aplicará al pulsar Abrir mi espacio.'); });
$('scenario').addEventListener('change', () => { ++requestVersion; hidePrivate(); setEntry('Prueba el nuevo escenario.', 'Pulsa Abrir mi espacio para aplicarlo en una sesión ficticia.'); });

async function init() {
  try {
    const config = await api('/demo/v1/config');
    if (!config.syntheticOnly || !config.fixturesEnabled) { setEntry('Las sesiones de prueba están deshabilitadas.', 'Inicia el servidor local con --fixtures para explorar. No hay acceso de miembros reales en este prototipo.'); return; }
    fillOptions($('persona'), config.personas, 'lucia'); fillOptions($('scenario'), config.scenarios, 'active_creador');
    configReady = true; $('persona').disabled = false; $('scenario').disabled = false; $('open-demo').disabled = false;
    // HttpOnly session is checked in the backend; JS never reads or stores it.
    const value = await api('/demo/v1/workspace'); render(value);
  } catch (error) {
    if (error.status === 401 && configReady) return;
    failure(error);
  }
}
init();
