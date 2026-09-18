const { test, expect } = require('@playwright/test');
const path = require('node:path');
const fs = require('node:fs');

// Fresh browser context per test; actual local server, no mocked own endpoints.
async function openProfile(page, scenario = 'active_creador', persona = 'lucia') {
  await page.goto('/');
  await expect(page.getByLabel('Persona de prueba')).toBeEnabled();
  await page.getByLabel('Persona de prueba').selectOption(persona);
  await page.getByLabel('Escenario', { exact: true }).selectOption(scenario);
  await page.getByRole('button', { name: 'Abrir mi espacio' }).click();
  if (scenario !== 'no_grant') await expect(page.getByRole('heading', { name: /Hola,/ })).toBeVisible();
}

test('initial state is unmistakably synthetic and does not show fabricated progress', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('DEMO · DATOS FICTICIOS', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Conoce cómo se verá tu espacio.' })).toBeVisible();
  await expect(page.getByLabel('Persona de prueba')).toBeEnabled();
  await expect(page.getByRole('heading', { name: /Hola,/ })).toBeHidden();
});

test('profile renders actual server identity, independent access states and empty history', async ({ page }) => {
  await openProfile(page);
  await expect(page.getByRole('heading', { name: 'Hola, Lucía · demo' })).toBeVisible();
  await expect(page.getByText('Estudio Nube', { exact: true })).toBeVisible();
  await expect(page.getByText('Rol: miembro', { exact: true })).toBeVisible();
  await expect(page.getByText('Comprobada en demo', { exact: true })).toBeVisible();
  await expect(page.getByText('Aún no hay avance que calcular.', { exact: true })).toBeVisible();
  await expect(page.getByText('0 misiones asignadas · 0 revisadas', { exact: true })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveCount(0);
  await expect(page.getByText('TU PLAN DE PRUEBA', { exact: true })).toHaveCount(1);
  await expect(page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'PRO Creador', exact: true }) })).toContainText('TU PLAN DE PRUEBA');
});

test('expired membership preserves profile and Negocio without granting PRO or internal roles', async ({ page }) => {
  await openProfile(page, 'expired_negocio');
  await expect(page.getByText('Vencida', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Probar acceso PRO', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '403' })).toContainText('membresía académica de prueba');
  await expect(page.getByRole('heading', { name: 'Hola, Lucía · demo' })).toBeVisible();
  await expect(page.getByText('Rol: miembro', { exact: true })).toBeVisible();
});

test('reload restores the real synthetic session and matching scenario controls', async ({ page }) => {
  await openProfile(page, 'expired_negocio', 'diego');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Hola, Diego · demo' })).toBeVisible();
  await expect(page.getByLabel('Persona de prueba')).toHaveValue('diego');
  await expect(page.getByLabel('Escenario', { exact: true })).toHaveValue('expired_negocio');
});

test('keyboard refresh keeps a visible focus after updating the profile', async ({ page }) => {
  await openProfile(page);
  const refresh = page.getByRole('button', { name: 'Actualizar estado' });
  await refresh.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Hola, Lucía · demo' })).toBeVisible();
  await expect(refresh).toBeFocused();
  await expect(refresh).toHaveCSS('outline-width', '3px');
});

test('unavailable verification is not login absence and protects the resource', async ({ page }) => {
  await openProfile(page, 'unavailable_creador');
  await expect(page.getByText('No disponible', { exact: true })).toBeVisible();
  await expect(page.getByText(/No necesitas iniciar sesión otra vez ni comprar otro plan/)).toBeVisible();
  await page.getByRole('button', { name: 'Probar acceso PRO', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '503' })).toContainText('permanece bloqueado');
});

test('actual cross-business request is denied without returning the other profile', async ({ page }) => {
  await openProfile(page);
  const denied = page.waitForResponse(response => response.url().endsWith('/api/v1/businesses/demo_brisa/profile'));
  await page.getByRole('button', { name: 'Probar aislamiento' }).click();
  const response = await denied;
  expect(response.status()).toBe(404);
  expect(await response.text()).not.toContain('Diego');
  await expect(page.getByRole('status').filter({ hasText: 'Aislamiento comprobado' })).toBeVisible();
});

test('a valid resource probe returns only an explicitly synthetic message', async ({ page }) => {
  await openProfile(page, 'active_agente');
  await page.getByRole('button', { name: 'Probar acceso PRO', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Acceso de prueba permitido' })).toContainText('no contiene material de la Academia PRO');
});

test('server-side revocation is honored even when the browser previously displayed valid access', async ({ page, baseURL }) => {
  await openProfile(page, 'active_negocio');
  await page.request.post('/demo/v1/scenario', { data: { scenario: 'revoked_agente' }, headers: { Origin: baseURL, 'X-Workspace-Intent': 'fixture-demo' } });
  await page.getByRole('button', { name: 'Probar acceso PRO', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '403' })).toBeVisible();
  await page.getByRole('button', { name: 'Actualizar estado' }).click();
  await expect(page.getByText('Revocada', { exact: true })).toBeVisible();
});

test('logout from the header clears the profile without treating it as expired membership', async ({ page }) => {
  await openProfile(page);
  await expect(page.locator('#session-ttl')).toContainText('Caduca en');
  await page.getByRole('button', { name: 'Cerrar sesión de prueba' }).click();
  await expect(page.getByRole('heading', { name: 'Sesión de prueba cerrada.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Hola,/ })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Cerrar sesión de prueba' })).toBeHidden();
  await expect(page.locator('#session-ttl')).toBeHidden();
});

test('closing all sessions of this persona is a session error not a membership lapse', async ({ page }) => {
  await openProfile(page);
  await page.getByRole('button', { name: 'Cerrar todas las de esta persona' }).click();
  await expect(page.getByRole('heading', { name: 'Todas las sesiones de esta persona se cerraron.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Hola,/ })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Cerrar todas las de esta persona' })).toBeHidden();
});

test('telegram fixture HMAC opens the mapped member from generated initData', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Sujeto de prueba HMAC')).toBeEnabled();
  await page.getByLabel('Sujeto de prueba HMAC').selectOption('900002');
  await page.getByRole('button', { name: 'Generar initData fixture' }).click();
  await expect(page.getByLabel('initData sintético')).not.toHaveValue('');
  await page.getByRole('button', { name: 'Abrir con prueba Telegram' }).click();
  await expect(page.getByRole('heading', { name: 'Hola, Diego · demo' })).toBeVisible();
  await expect(page.locator('#session-ttl')).toContainText('15 min');
});

test('lost session clears private content and offers a distinct 401 state', async ({ page, baseURL }) => {
  await openProfile(page);
  await page.request.post('/demo/v1/logout', { data: {}, headers: { Origin: baseURL, 'X-Workspace-Intent': 'fixture-demo' } });
  await page.getByRole('button', { name: 'Actualizar estado' }).click();
  await expect(page.getByRole('heading', { name: 'Tu sesión de prueba no está abierta.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Hola,/ })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Cerrar sesión de prueba' })).toBeHidden();
});

test('missing business grant shows 403 distinct from authentication and membership', async ({ page }) => {
  await openProfile(page, 'no_grant');
  await expect(page.getByRole('heading', { name: 'Tu sesión está abierta. Este negocio no.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Hola,/ })).toBeHidden();
});

test('real network failure removes stale profile and can recover', async ({ page, context }) => {
  await openProfile(page);
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Actualizar estado' }).click();
  await expect(page.getByRole('heading', { name: 'No hay conexión con la demo.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Hola,/ })).toBeHidden();
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Reintentar consulta' }).click();
  await expect(page.getByRole('heading', { name: 'Hola, Lucía · demo' })).toBeVisible();
});

test('switching personas clears old information immediately and loads only the next context', async ({ page }) => {
  await openProfile(page);
  await page.getByLabel('Persona de prueba').selectOption('diego');
  await expect(page.getByRole('heading', { name: /Hola,/ })).toBeHidden();
  await page.getByRole('button', { name: 'Abrir mi espacio' }).click();
  await expect(page.getByRole('heading', { name: 'Hola, Diego · demo' })).toBeVisible();
  await expect(page.getByText('Tienda Brisa', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Lucía/ })).toHaveCount(0);
});

test('notice component renders hostile text literally and rejects unknown types or extra fields', async ({ page }) => {
  await openProfile(page);
  // Component-level input test against the actual module/DOM, not an API mock.
  await page.evaluate(async () => {
    const { renderNotice } = await import('/assets/cards.js');
    renderNotice(document.getElementById('notice-holder'), { type: 'notice', version: 1, severity: 'info', text: '<img src=x onerror="window.injected=true">Texto de prueba' });
  });
  await expect(page.getByText('<img src=x onerror="window.injected=true">Texto de prueba', { exact: true })).toBeVisible();
  await expect(page.locator('#notice-holder img')).toHaveCount(0);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
  for (const card of [{ type: 'html', version: 1, html: '<script>1</script>' }, { type: 'notice', version: 1, severity: 'info', text: 'safe', html: 'extra' }]) {
    await page.evaluate(async card => { const { renderNotice } = await import('/assets/cards.js'); renderNotice(document.getElementById('notice-holder'), card); }, card);
    await expect(page.getByText('No pudimos mostrar esta tarjeta de forma segura. Tu acceso sigue protegido.', { exact: true })).toBeVisible();
  }
});

test('keyboard skip link, visible focus and all form controls work without a mouse', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByLabel('Persona de prueba')).toBeEnabled();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Persona de prueba')).toBeFocused();
  await expect(page.getByLabel('Persona de prueba')).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Escenario', { exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Abrir mi espacio' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Hola, Lucía · demo' })).toBeVisible();
});

for (const width of [320, 390, 768, 1440]) {
  test(`profile and controls fit ${width}px without horizontal blocking`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 1050 : 844 });
    await openProfile(page);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Probar aislamiento' })).toBeVisible();
    await page.getByRole('button', { name: 'Probar aislamiento' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Aislamiento comprobado' })).toBeVisible();
    // Capture the overview at scroll origin; sticky/fixed chrome must not appear
    // halfway down a full-page screenshot after probing controls near the footer.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    const target = path.resolve(`qa/latest/profile-${width}.png`); fs.mkdirSync(path.dirname(target), { recursive: true });
    await page.screenshot({ path: target, fullPage: true });
  });
}

test('lucia web session links matching HMAC fixture as a unique audited bind', async ({ page }) => {
  await openProfile(page);
  await page.getByLabel('Sujeto de prueba HMAC').selectOption('900001');
  await page.getByRole('button', { name: 'Generar initData fixture' }).click();
  await expect(page.getByLabel('initData sintético')).not.toHaveValue('');
  await page.getByRole('button', { name: 'Crear desafío de 5 min' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Desafío de un solo uso creado' })).toBeVisible();
  await page.getByRole('button', { name: 'Vincular initData al espacio' }).click();
  await expect(page.getByText(/Vínculo único auditado · Telegram 900001/)).toBeVisible();
  await expect(page.getByText('No hay conversaciones ni entregas en esta sesión ficticia.')).toBeVisible();
});

test('lucia web session unlinks matching HMAC and keeps the web cookie', async ({ page }) => {
  await openProfile(page);
  await page.getByLabel('Sujeto de prueba HMAC').selectOption('900001');
  await page.getByRole('button', { name: 'Generar initData fixture' }).click();
  await page.getByRole('button', { name: 'Crear desafío de 5 min' }).click();
  await page.getByRole('button', { name: 'Vincular initData al espacio' }).click();
  await expect(page.getByText(/Vínculo único auditado · Telegram 900001/)).toBeVisible();
  const usedProof = await page.getByLabel('initData sintético').inputValue();
  await page.getByRole('button', { name: 'Generar initData fixture' }).click();
  await expect(page.getByLabel('initData sintético')).not.toHaveValue(usedProof);
  await expect(page.getByLabel('initData sintético')).not.toHaveValue('');
  await page.getByRole('button', { name: 'Desvincular con HMAC fresco' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'desvinculado' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hola, Lucía · demo' })).toBeVisible();
  await expect(page.getByText('Sin vínculo HMAC en esta sesión ficticia.')).toBeVisible();
});

test('diego HMAC cannot merge into lucia and name recovery is denied', async ({ page }) => {
  await openProfile(page);
  await page.getByLabel('Sujeto de prueba HMAC').selectOption('900001');
  await page.getByRole('button', { name: 'Generar initData fixture' }).click();
  await page.getByRole('button', { name: 'Crear desafío de 5 min' }).click();
  await page.getByRole('button', { name: 'Vincular initData al espacio' }).click();
  await expect(page.getByText(/Vínculo único auditado · Telegram 900001/)).toBeVisible();
  await page.getByLabel('Sujeto de prueba HMAC').selectOption('900002');
  await page.getByRole('button', { name: 'Generar initData fixture' }).click();
  await page.getByRole('button', { name: 'Crear desafío de 5 min' }).click();
  await page.getByRole('button', { name: 'Vincular initData al espacio' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'LINK_CONFLICT' })).toBeVisible();
  await expect(page.getByText(/Vínculo único auditado · Telegram 900001/)).toBeVisible();
  await page.getByRole('button', { name: 'Intentar recuperar por nombre' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'IDENTITY_RECOVERY_DENIED' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hola, Lucía · demo' })).toBeVisible();
});

test('no app exception, CSP violation or external network request during the happy path', async ({ page, baseURL }) => {
  const errors = [], external = [], csp = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(baseURL + '/')) external.push(request.url()); });
  await page.exposeFunction('captureViolation', value => csp.push(value));
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', event => window.captureViolation(event.violatedDirective)));
  await openProfile(page);
  await page.getByRole('button', { name: 'Probar acceso PRO', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Acceso de prueba permitido' })).toBeVisible();
  expect(errors).toEqual([]); expect(external).toEqual([]); expect(csp).toEqual([]);
});
