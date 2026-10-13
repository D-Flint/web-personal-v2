const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const PORT = 54321;
const TARGET_URL = `http://127.0.0.1:${PORT}/`;
const OUTPUT_DIR = path.join(__dirname, '..', '.lighthouse');
const STATIC_ROOT = path.join(__dirname, '..', '.vercel', 'output', 'static');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function createStaticServer(rootDir) {
  return http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    let filePath = path.join(rootDir, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const rawContent = fs.readFileSync(filePath);

    if (/\b(text\/|application\/javascript|application\/json|image\/svg\+xml)\b/.test(contentType) && acceptEncoding.includes('gzip')) {
      zlib.gzip(rawContent, (err, compressed) => {
        if (err) {
          res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': rawContent.length });
          res.end(rawContent);
        } else {
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Encoding': 'gzip',
            'Content-Length': compressed.length,
            'Cache-Control': 'public, max-age=31536000, immutable',
          });
          res.end(compressed);
        }
      });
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': rawContent.length,
        'Cache-Control': ext === '.html' ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable',
      });
      res.end(rawContent);
    }
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const server = createStaticServer(STATIC_ROOT);
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`In-process static server ready at ${TARGET_URL}`);

  let chrome;
  try {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'] });
    const result = await lighthouse(TARGET_URL, {
      port: chrome.port,
      output: 'html',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });

    const reportPath = path.join(OUTPUT_DIR, 'local-report.html');
    fs.writeFileSync(reportPath, result.report);

    const summary = {
      url: TARGET_URL,
      performance: result.lhr.categories.performance.score,
      accessibility: result.lhr.categories.accessibility.score,
      bestPractices: result.lhr.categories['best-practices'].score,
      seo: result.lhr.categories.seo.score,
    };
    fs.writeFileSync(path.join(OUTPUT_DIR, 'local-summary.json'), JSON.stringify(summary, null, 2));

    console.log('Lighthouse scores:');
    console.log(`  Performance:    ${Math.round(summary.performance * 100)}`);
    console.log(`  Accessibility:  ${Math.round(summary.accessibility * 100)}`);
    console.log(`  Best Practices: ${Math.round(summary.bestPractices * 100)}`);
    console.log(`  SEO:            ${Math.round(summary.seo * 100)}`);

    console.log('\nKey Performance Metrics:');
    const metricKeys = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index', 'interactive'];
    for (const m of metricKeys) {
      const a = result.lhr.audits[m];
      if (a) console.log(' ', m, ':', a.displayValue, '(score:', a.score, ', numericValue:', Math.round(a.numericValue), ')');
    }

    console.log(`\nReport written to ${reportPath}`);
  } catch (err) {
    console.error('Audit Error:', err.message);
    process.exitCode = 1;
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch (e) {}
    }
    server.close();
  }
}

main();

