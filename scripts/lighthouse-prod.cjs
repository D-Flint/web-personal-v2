const fs = require('fs');
const path = require('path');
const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const URL = 'https://hoeurbvuthi.site/';
const OUTPUT_DIR = path.join(__dirname, '..', '.lighthouse');

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'] });
  const result = await lighthouse(URL, {
    port: chrome.port,
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });

  const reportPath = path.join(OUTPUT_DIR, 'prod-report.html');
  fs.writeFileSync(reportPath, result.report);

  const summary = {
    url: URL,
    performance: result.lhr.categories.performance.score,
    accessibility: result.lhr.categories.accessibility.score,
    bestPractices: result.lhr.categories['best-practices'].score,
    seo: result.lhr.categories.seo.score,
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'prod-summary.json'), JSON.stringify(summary, null, 2));

  console.log('Lighthouse scores:');
  console.log(`  Performance:    ${Math.round(summary.performance * 100)}`);
  console.log(`  Accessibility:  ${Math.round(summary.accessibility * 100)}`);
  console.log(`  Best Practices: ${Math.round(summary.bestPractices * 100)}`);
  console.log(`  SEO:            ${Math.round(summary.seo * 100)}`);
  console.log(`Report written to ${reportPath}`);

  await chrome.kill().catch(() => {
    // chrome-launcher sometimes fails to clean up its temp dir on Windows;
    // the browser is already dead, so swallow the error.
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
