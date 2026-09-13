// Local review checkpoint adapted from playwright-pro; no /pw plugin assumed.
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const test = fs.readFileSync(path.join(root, 'tests/profile.spec.cjs'), 'utf8');
const checks = {
  noFixedSleeps: !/waitForTimeout\s*\(/.test(test),
  noOwnApiMocking: !/\.(?:route|fulfill)\s*\(/.test(test),
  noXpath: !/xpath=/.test(test),
  noSwallowedFailures: !/\.catch\(\s*\(\)\s*=>\s*\{\s*\}\s*\)/.test(test),
  baseUrlInConfig: !/https?:\/\//.test(test),
  semanticLocators: /getByRole\(/.test(test) && /getByLabel\(/.test(test),
  noSharedAuthenticatedState: !/beforeAll|storageState/.test(test),
  webFirstAssertions: /await expect\(/.test(test),
};
const report = { status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL', checks,
  manualReviewRequired: true,
  exceptions: ['DOM evaluation only for real card component input, layout dimensions, CSP instrumentation and execution detection; not an own-API mock.', 'CSS locator only to prove no injected image exists in the notice container.'],
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.status === 'PASS' ? 0 : 1;
