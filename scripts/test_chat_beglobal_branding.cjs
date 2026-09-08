// NODE_PATH=/path/to/node_modules node scripts/test_chat_beglobal_branding.cjs [--live]
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const origin='https://chatbeglobal.softvibes.pro';
const live=process.argv.includes('--live');
async function setup(page) {
  if(!live) await page.route(origin+'/**', route=>{
    const name=new URL(route.request().url()).pathname.slice(1)||'index.html';
    if(!['index.html','branding.css','theme.js','logo-beglobal.png'].includes(name)) return route.continue();
    return route.fulfill({path:path.join(__dirname,'../beglobal/chat-branding',name)});
  });
  // UI fixture: no user message or paid request reaches the production service.
  await page.route(origin+'/chat', route=>route.fulfill({json:{message:'Respuesta de prueba visual.',artifacts:[
    {type:'checklist',title:'Mi próxima acción',items:['Elegir un objetivo','Practicar una lección']},
    {type:'action',title:'Practicar',body:'Completa una acción pequeña.',actionLabel:'Elegir práctica',actionPrompt:'Prueba'},
  ]}}));
}
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM?{executablePath:process.env.PLAYWRIGHT_CHROMIUM}:{})});
 try {
  for(const width of [1440,390,320]) {
   const context=await browser.newContext({viewport:{width,height:width===320?568:900},colorScheme:'light'});
   const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message)); await setup(page);
   await page.goto(origin,{waitUntil:'domcontentloaded'});
   await page.locator('.brand-logo img').evaluate(x=>x.decode());
   assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
   await page.emulateMedia({colorScheme:'dark'});
   await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
   await page.locator('[data-theme-choice="light"]').click();
   await page.locator('#chat-input').fill('Mensaje de prueba local'); await page.locator('#send-button').click();
   await page.locator('.artifact-action').waitFor();
   await page.locator('.checklist-label').first().click();
   await page.locator('#chat-input').fill('Borrador conservado');
   for(const theme of ['light','dark']) {
    await page.locator(`[data-theme-choice="${theme}"]`).click();
    assert.equal(await page.locator(`[data-theme-choice="${theme}"]`).getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#chat-input').inputValue(),'Borrador conservado');
    assert.equal(await page.locator('.checklist input').first().isChecked(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    for(const selector of ['.theme-switch','#chat-input','#send-button']) {
     const box=await page.locator(selector).boundingBox(); assert(box.x>=0 && box.x+box.width<=width);
     assert(box.y>=0 && box.y+box.height<=page.viewportSize().height);
    }
    await page.screenshot({path:`/tmp/beglobal-chat-${theme}-${width}${live?'-live':''}.png`,animations:'disabled'});
   }
   await page.reload({waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
   await page.emulateMedia({colorScheme:'light'});
   assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
   const other=await context.newPage(); await setup(other); await other.goto(origin,{waitUntil:'domcontentloaded'});
   await other.locator('[data-theme-choice="light"]').click();
   await page.waitForFunction(()=>document.documentElement.dataset.theme==='light');
   assert.deepEqual(errors,[]);
   await context.close(); console.log(`PASS ${width}: theme, system, persistence, tab sync, draft, checklist, mobile; mocked chat`);
  }
  const context=await browser.newContext({colorScheme:'dark'}); const page=await context.newPage(); await setup(page);
  await page.addInitScript(()=>{
   Storage.prototype.getItem=function(){throw new DOMException('Blocked','SecurityError')};
   Storage.prototype.setItem=function(){throw new DOMException('Blocked','SecurityError')};
  });
  await page.goto(origin,{waitUntil:'domcontentloaded'}); await page.locator('[data-theme-choice="light"]').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light'); await context.close();
  console.log('PASS storage unavailable: manual theme still works');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
