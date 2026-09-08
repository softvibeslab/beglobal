const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const fs = require('fs');
const { execFileSync } = require('child_process');

const ENV_PATH = process.env.MINIAPPS_ENV_PATH || '/srv/beglobal/miniapps/api/.env';
const DB_PATH = process.env.MINIAPPS_DB_PATH || '/srv/beglobal/miniapps/beglobal.db';
const USER_ID = Number(process.env.E2E_TG_ID || '5791501756');

function readEnv(path) {
  const out = {};
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
    const [key, ...rest] = line.split('=');
    out[key.trim()] = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
  }
  return out;
}

function createInitData(profile = 'member') {
  const env = readEnv(ENV_PATH);
  const token = env[`${profile.toUpperCase()}_BOT_TOKEN`];
  if (!token) throw new Error(`${profile} bot token not configured in ${ENV_PATH}`);
  const user = { id: USER_ID, first_name: 'Softvibes', username: 'softvibes_e2e' };
  const pairs = {
    auth_date: String(Math.floor(Date.now() / 1000)),
    query_id: `e2e-${profile}-${Date.now()}`,
    user: JSON.stringify(user),
  };
  const dataCheck = Object.keys(pairs).sort().map(k => `${k}=${pairs[k]}`).join('\n');
  const secret = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
  pairs.hash = crypto.createHmac('sha256', secret).update(dataCheck).digest('hex');
  return new URLSearchParams(pairs).toString();
}

async function mockTelegram(page, initData = createInitData('member')) {
  await page.route('https://telegram.org/js/telegram-web-app.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: `window.Telegram = { WebApp: {
      initData: ${JSON.stringify(initData)},
      ready(){ window.__tgReady = true; },
      expand(){ window.__tgExpand = true; },
      close(){ window.__tgClosed = true; },
      sendData(payload){ window.__tgSentData = payload; window.__tgClosed = true; }
    }};`,
  }));
}

test.afterAll(() => {
  try {
    execFileSync('python3', ['-c', `
import sqlite3
con=sqlite3.connect(${JSON.stringify(DB_PATH)})
cur=con.execute("DELETE FROM training_comments WHERE comment LIKE 'E2E:%'")
print('deleted', cur.rowcount)
con.commit(); con.close()
`], { stdio: 'inherit' });
  } catch (err) {
    console.warn('cleanup failed', err.message);
  }
});

test('public pages are reachable and unauthenticated API is blocked', async ({ page, baseURL }) => {
  const staticRes = await page.request.get(`${baseURL}/app/training/`);
  expect(staticRes.status()).toBe(200);
  const html = await staticRes.text();
  expect(html).toContain('Training de casos');
  expect(html).toContain('Playbook del video');

  await page.goto(`${baseURL}/app/training/`);
  await expect(page.getByText('Acceso no autorizado')).toBeVisible();

  const res = await page.request.get(`${baseURL}/api/training/cases`);
  expect(res.status()).toBe(401);
});

test('guided member page loads with Telegram initData and prompt handoff works', async ({ page, baseURL, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });
  await mockTelegram(page);
  await page.goto(`${baseURL}/app/member/legacy-guide.html`);

  await expect(page.getByRole('heading', { name: /Mi Guía/i })).toBeVisible();
  await expect(page.getByText(/Hola, Softvibes/i)).toBeVisible();
  await expect(page.getByText(/Méritos y siguiente acción/i)).toBeVisible();
  await expect(page.getByText(/Misiones gamificadas MVP/i)).toBeVisible();

  await page.getByRole('button', { name: /Copiar prompt para mi Guía/i }).click();
  const sent = await page.evaluate(() => window.__tgSentData || '');
  expect(sent).toContain('beglobal_mission_prompt');
  expect(sent).toContain('member');
  await expect.poll(() => page.evaluate(() => Boolean(window.__tgClosed))).toBe(true);
});

test('training mini app lists video cases, filters, comments and prompt base handoff', async ({ page, baseURL, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });
  await mockTelegram(page);
  await page.goto(`${baseURL}/app/training/`);

  await expect(page.getByRole('heading', { name: /Training de casos/i })).toBeVisible();
  await expect(page.getByText('Playbook del video')).toBeVisible();
  await expect(page.getByText('Presentación 75–85%')).toBeVisible();

  await page.getByRole('button', { name: /contenido orgánico \/ ciclo de ventas/i }).click();
  await expect(page.getByText('Tiene tienda, logo y producto, pero no vende')).toBeVisible();
  await expect(page.getByText('Plan semanal realista con celular')).toBeVisible();

  await page.getByRole('button', { name: /Ver caso y comentar/i }).first().click();
  await expect(page.getByText('Cómo debería contestar el agente')).toBeVisible();
  await expect(page.locator('#case-guardrail')).toContainText(/No prometer ventas/i);

  const comment = `E2E: comentario ${Date.now()} debe pedir evidencia y no prometer ventas.`;
  await page.locator('#comment-label').selectOption('guardrail');
  await page.locator('#comment-text').fill(comment);
  await page.getByRole('button', { name: /Guardar comentario/i }).click();
  await expect(page.locator('#comments').getByText(comment)).toBeVisible();
  const qaItem = page.locator('[data-comment-id]').filter({ hasText: comment }).first();
  await expect(qaItem).toBeVisible();
  await qaItem.getByRole('button', { name: 'Aceptar' }).click();
  await expect(qaItem.getByText('aceptado')).toBeVisible();
  await expect(page.locator('#comments').getByText('aceptado')).toBeVisible();

  await page.locator('#copy-video-agent-prompt').scrollIntoViewIfNeeded();
  await page.locator('#copy-video-agent-prompt').click();
  await expect.poll(() => page.evaluate(() => window.__tgSentData || '')).toContain('estratega de contenido orgánico');
  const sent = await page.evaluate(() => window.__tgSentData || '');
  expect(sent).toContain('beglobal_mission_prompt');
});
