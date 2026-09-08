// Usage: NODE_PATH=/path/to/node_modules node scripts/test_beglobal_agent.cjs [--live]
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const live = process.argv.includes('--live');
  const browser = await chromium.launch({ headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {}) });
  try {
    for (const viewport of [{width:1440,height:1000},{width:390,height:844},{width:320,height:568}]) {
      const page = await browser.newPage({viewport});
      let chatRequests = 0;
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (request.url() === 'https://chatbeglobal.softvibes.pro/') chatRequests++; });
      if (!live) await page.route('https://beglobal.softvibes.pro/agent/**', route => {
        const name = new URL(route.request().url()).pathname.split('/').pop() || 'index.html';
        const file = path.resolve(__dirname, '../beglobal/agent', name);
        return fs.existsSync(file) ? route.fulfill({path:file}) : route.abort();
      });
      await page.goto('https://beglobal.softvibes.pro/agent/', {waitUntil:'domcontentloaded'});
      assert.equal(chatRequests, 0, 'Chat must load only after a click');
      assert.equal(await page.locator('#chat-frame').getAttribute('src'), null);
      await page.screenshot({path:`/tmp/beglobal-agent-${viewport.width}${live?'-live':''}.png`, animations:'disabled'});
      const launcher = page.locator('#chat-launcher');
      await launcher.click();
      await page.locator('#chat-dialog[open]').waitFor();
      await page.frameLocator('#chat-frame').locator('#chat-input').waitFor({timeout:20000});
      assert.equal(await launcher.getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator('#chat-access').isVisible(), true);
      const bounds = await page.locator('#chat-dialog').boundingBox();
      assert(bounds.x >= 0 && bounds.x+bounds.width <= viewport.width);
      assert(bounds.y >= 0 && bounds.y+bounds.height <= viewport.height);
      await page.screenshot({path:`/tmp/beglobal-agent-popup-${viewport.width}${live?'-live':''}.png`});
      await page.locator('#close-chat').focus();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#chat-dialog').evaluate(x=>x.open), false);
      assert.equal(await launcher.evaluate(x=>x===document.activeElement), true);
      await launcher.click();
      assert.equal(chatRequests, 1, 'Reopening must preserve the existing iframe');
      await page.locator('#close-chat').click();
      await page.locator('#minimize').click();
      assert.equal(await page.locator('#welcome').isVisible(), false);
      assert.equal(await launcher.isVisible(), true);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(errors, []);
      console.log(`PASS ${viewport.width}: real chat embedded, PRO notice, mobile bounds, close/focus, single load; no messages sent`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
