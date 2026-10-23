import fs from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { launch } from 'chrome-launcher';

// Run against a production build to avoid development-server layout/timing noise.
const [target = 'http://127.0.0.1:4323/projects/', output = '.impeccable/review/agentic/desktop', device = 'desktop'] = process.argv.slice(2);
if (!['desktop', 'mobile'].includes(device)) throw new Error('Device must be desktop or mobile.');
const url = new URL(target);
if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Target must be an HTTP(S) URL.');

const desktop = device === 'desktop';
const chrome = await launch({
  chromePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
});
try {
  const result = await lighthouse(url.href, {
    ...(desktop ? desktopConfig.settings : {}),
    port: chrome.port,
    output: ['json', 'html'],
    onlyCategories: ['accessibility', 'best-practices', 'seo', 'agentic-browsing'],
    formFactor: device,
    screenEmulation: {
      mobile: !desktop,
      width: desktop ? 1440 : 390,
      height: desktop ? 900 : 844,
      deviceScaleFactor: 1,
      disabled: false,
    },
  });
  if (!result) throw new Error('Lighthouse did not produce a result.');
  const { lhr, report } = result;
  const checks = lhr.categories['agentic-browsing'].auditRefs
    .filter(reference => reference.weight > 0)
    .map(({ id }) => lhr.audits[id])
    .filter(audit => !['notApplicable', 'manual', 'informative'].includes(audit.scoreDisplayMode));
  const summary = {
    url: lhr.finalDisplayedUrl,
    device,
    lighthouseVersion: lhr.lighthouseVersion,
    browser: lhr.environment.hostUserAgent,
    scores: Object.fromEntries(Object.entries(lhr.categories).map(([id, category]) => [id, category.score])),
    agenticPassed: checks.filter(audit => audit.score === 1).length,
    agenticTotal: checks.length,
    checks: checks.map(({ id, score, scoreDisplayMode, displayValue, explanation }) => ({
      id, score, scoreDisplayMode, displayValue, explanation,
    })),
    warnings: lhr.runWarnings,
  };
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(path.join(output, 'report.json'), report[0]);
  await fs.writeFile(path.join(output, 'report.html'), report[1]);
  await fs.writeFile(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
  if (lhr.runtimeError || checks.some(audit => audit.score !== 1)) process.exitCode = 1;
} finally {
  await chrome.kill();
}
