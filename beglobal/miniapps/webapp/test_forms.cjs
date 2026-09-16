// Run: node beglobal/miniapps/webapp/test_forms.cjs (Node 18+).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, file), 'utf8');

async function check(file, start, end, invoke, fields, expectedPath) {
  const source = read(file);
  const from = source.indexOf(start);
  assert.notEqual(from, -1, `Missing handler: ${start}`);
  const to = source.indexOf(end, from);
  assert.notEqual(to, -1, `Missing handler end: ${end}`);
  const requests = [];
  let callback;
  const element = { value: 'Buen trabajo', addEventListener: (_, fn) => { callback = fn; } };
  const context = vm.createContext({
    window: {}, FormData, console,
    document: { getElementById: () => element },
    btnStartJourney: element,
    responses: { experience: 'beginner', product: 'physical' },
    currentLesson: { id: 3 }, missionId: 42, selectedScore: 4,
    selectedMissions: new Set([42, 51]),
    modal: { remove() {} }, celebrate() {}, loadMissionsQueue() {},
    toast: (message, error) => { if (error) throw new Error(message); },
    fetch: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, status: 200, json: async () => ({ ok: false, approved: 1 }) };
    },
  });
  vm.runInContext(read('shared/app.js'), context);
  context.toast = (message, error) => { if (error) throw new Error(message); };
  vm.runInContext(source.slice(from, to + end.length), context);
  if (invoke) await vm.runInContext(invoke, context);
  else await callback();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, expectedPath);
  assert.equal(requests[0].options.method, 'POST');
  assert.ok(requests[0].options.body instanceof FormData);
  assert.deepEqual(Object.fromEntries(requests[0].options.body), fields);
  console.log(`PASS ${file}: ${expectedPath}`);
}

(async () => {
  // Compile complete changed scripts too; handler tests exercise native FormData,
  // the real apiForm/api helpers, and fetch payloads without a DOM dependency.
  for (const file of ['member/diagnosis.html', 'member/lessons.html', 'team/index.html']) {
    for (const [, script] of read(file).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      new vm.Script(script, { filename: file });
    }
  }
  new vm.Script(read('team/team-module.js'));
  await check('member/diagnosis.html', 'btnStartJourney.addEventListener', '\n    });', null,
    { responses: JSON.stringify({ experience: 'beginner', product: 'physical' }) },
    '/api/onboarding/diagnosis/submit');
  await check('member/lessons.html', 'document.getElementById("btn-complete-lesson").addEventListener', '\n    });', null,
    { quiz_score: '95' }, '/api/lessons/3/complete');
  await check('team/index.html', 'document.getElementById("btn-approve").addEventListener', '\n      });', null,
    { score: '4', feedback: 'Buen trabajo' }, '/api/team/mission/42/approve');
  await check('team/index.html', 'document.getElementById("btn-reject").addEventListener', '\n      });', null,
    { feedback: 'Buen trabajo' }, '/api/team/mission/42/reject');
  await check('team/index.html', 'async function approveSelected()', '\n    }', 'approveSelected()',
    { mission_ids: '42,51' }, '/api/team/missions/approve-bulk');
})().catch(error => { console.error(error); process.exitCode = 1; });
