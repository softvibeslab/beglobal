const { defineConfig } = require('@playwright/test');
const path = require('node:path');
const port = Number(process.env.BEGLOBAL_TEST_PORT || 18766);
const baseURL = `http://127.0.0.1:${port}`;
module.exports = defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1,
  retries: process.env.CI ? 2 : 0, timeout: 25000,
  expect: { timeout: 5000 },
  outputDir: './test-results',
  reporter: [['list'], ['json', { outputFile: './qa/latest/ui-report.json' }]],
  use: { baseURL, browserName: 'chromium', channel: 'chrome', viewport: { width: 1440, height: 1050 }, trace: 'on-first-retry', screenshot: 'only-on-failure', reducedMotion: 'reduce' },
  webServer: {
    command: `${JSON.stringify(path.resolve('.venv/bin/python'))} workspace.py --fixtures --port ${port}`,
    url: `${baseURL}/healthz`, reuseExistingServer: false, timeout: 15000,
    env: { BEGLOBAL_ENV: 'development' },
  },
});
