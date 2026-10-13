import { launch } from 'chrome-launcher';
import { spawn } from 'child_process';

const STATIC = '.vercel/output/static';
const PORT = 4321;
const URL = `http://localhost:${PORT}/`;

async function waitFor(url, timeout = 25000, interval = 250) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try { await fetch(url); return; } catch {}
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error('timeout waiting for ' + url);
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const server = spawn(npx, ['--yes', 'http-server', STATIC, '-p', String(PORT), '--silent'], {
  cwd: process.cwd(), shell: true, stdio: 'ignore',
});
server.on('error', (e) => console.error('server err', e.message));

try {
  await waitFor(URL);

  const chrome = await launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  const list = await fetch(`http://localhost:${chrome.port}/json/list`).then((r) => r.json());
  const page = list.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });

  let id = 0; const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(typeof e.data === 'string' ? e.data : e.data.toString());
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const send = (method, params = {}) => new Promise((res) => {
    const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params }));
  });

  await send('Page.enable'); await send('Runtime.enable');
  // Mobile emulation to match the Speed Insights mobile reports
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
  await send('Page.navigate', { url: URL });
  await new Promise((r) => setTimeout(r, 1500));

  const probe = `(() => {
    const desc = (n) => {
      if (!n) return null;
      if (n.nodeType !== 1) return {tag: '#' + n.nodeName + ' node', txt: String(n.textContent || '').slice(0,30)};
      const cn = (typeof n.className === 'string') ? n.className : (n.className && n.className.baseVal ? n.className.baseVal : '');
      return {
        tag: n.tagName.toLowerCase(),
        cls: String(cn).slice(0, 100),
        id: n.id || '',
        txt: (n.textContent || '').trim().replace(/\\s+/g,' ').slice(0, 40)
      };
    };
    const shifts = [];
    window.__shifts = shifts;
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.hadRecentInput) continue;
          const srcs = (e.sources || []).map((s) => ({ el: desc(s.node), prev: s.previousRect, cur: s.currentRect }));
          shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), srcs });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (err) { window.__obsErr = String(err); }
    'ok';
  })()`;
  await send('Runtime.evaluate', { expression: probe, returnByValue: true });

  // Splash lasts ~2.5s, reveal finishes ~2.5s; observe enough to catch them all.
  await new Promise((r) => setTimeout(r, 9000));

  const res = await send('Runtime.evaluate', { expression: 'window.__shifts', returnByValue: true });
  const shifts = res.result && res.result.result ? res.result.result.value : null;
  console.log('=== LAYOUT SHIFTS ===');
  console.log(JSON.stringify(shifts, null, 1));

  const obsErr = await send('Runtime.evaluate', { expression: 'window.__obsErr', returnByValue: true });
  if (obsErr.result && obsErr.result.result && obsErr.result.result.value) {
    console.log('OBSERVER ERROR:', obsErr.result.result.value);
  }

  ws.close();
  await chrome.kill().catch(() => {});
} catch (err) {
  console.error('PROBE ERROR:', err.message);
} finally {
  server.kill();
}
process.exit(0);