import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const ROOT = process.cwd();

function logPass(msg) {
  console.log(`\x1b[32m✔ [PASS]\x1b[0m ${msg}`);
}

function logFail(msg) {
  console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${msg}`);
}

function logInfo(msg) {
  console.log(`\x1b[36mℹ [INFO]\x1b[0m ${msg}`);
}

let hasError = false;

console.log('\n🌸 Engineering Field Journal — Quality Control Gatekeeper 🌸\n');

// Gate 1: UTF-8 BOM Audit
logInfo('Gate 1: Checking for prohibited UTF-8 BOM characters...');
function scanBOM(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.vercel', 'dist', '.agents', '.astro'].includes(entry.name)) continue;
      scanBOM(fullPath);
    } else if (/\.(astro|ts|js|mjs|cjs|css|json|md)$/i.test(entry.name)) {
      const buffer = Buffer.alloc(3);
      const fd = fs.openSync(fullPath, 'r');
      fs.readSync(fd, buffer, 0, 3, 0);
      fs.closeSync(fd);
      if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
        logFail(`BOM detected in ${path.relative(ROOT, fullPath)}`);
        hasError = true;
      }
    }
  }
}
try {
  scanBOM(ROOT);
  if (!hasError) {
    logPass('No UTF-8 BOM found across project files.');
  }
} catch (err) {
  logFail(`BOM audit encountered an error: ${err.message}`);
  hasError = true;
}

// Gate 2: Invariant Check for NekoWidget.astro
logInfo('Gate 2: Verifying NekoWidget inner flex wrapper invariant (Rule 2)...');
const nekoPath = path.join(ROOT, 'src', 'components', 'NekoWidget.astro');
if (fs.existsSync(nekoPath)) {
  const nekoContent = fs.readFileSync(nekoPath, 'utf8');
  if (nekoContent.includes('flex h-full min-h-0 flex-col overflow-hidden')) {
    logPass('NekoWidget inner flex wrapper invariant is intact.');
  } else {
    logFail('Rule 2 violation: Missing `flex h-full min-h-0 flex-col overflow-hidden` in NekoWidget.astro.');
    hasError = true;
  }
} else {
  logFail('NekoWidget.astro does not exist at expected location.');
  hasError = true;
}

// Gate 3: Source hygiene for an intentionally Git-free copy.
logInfo('Gate 3: Auditing source whitespace and conflict markers...');
const snapshot = JSON.parse(fs.readFileSync(path.join(ROOT, 'source-snapshot.json'), 'utf8'));
function scanSource(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { scanSource(file); continue; }
    if (!/\.(astro|ts|js|css|mjs)$/.test(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const changed = snapshot[path.relative(ROOT, file)] !== createHash('sha256').update(content).digest('hex');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (/^(<{7}|={7}|>{7})( |$)/.test(line)) { logFail(`${file}:${i + 1}: conflict marker`); hasError = true; }
      if (changed && /[ \t]+$/.test(line)) { logFail(`${file}:${i + 1}: trailing whitespace`); hasError = true; }
    });
  }
}
scanSource(path.join(ROOT, 'src'));
if (!hasError) logPass('Source conflict and changed-file whitespace checks passed (Git-free copy).');

// Gate 4: Production Build & Postbuild Patch Execution
logInfo('Gate 4: Executing production build (npm run build)...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: ROOT });
  logPass('Astro production build succeeded.');
} catch (err) {
  logFail('Production build failed.');
  hasError = true;
}

// Gate 5: Vercel Function Runtime Verification (Rule 1)
logInfo('Gate 5: Verifying Vercel serverless function nodejs22.x runtime patch...');
const vcConfigPath = path.join(ROOT, '.vercel', 'output', 'functions', '_render.func', '.vc-config.json');
if (fs.existsSync(vcConfigPath)) {
  try {
    const vcConfig = JSON.parse(fs.readFileSync(vcConfigPath, 'utf8'));
    if (vcConfig.runtime === 'nodejs22.x') {
      logPass(`Vercel runtime confirmed: "${vcConfig.runtime}".`);
    } else {
      logFail(`Unexpected Vercel runtime: "${vcConfig.runtime}". Expected "nodejs22.x".`);
      hasError = true;
    }
  } catch (err) {
    logFail(`Failed to parse .vc-config.json: ${err.message}`);
    hasError = true;
  }
} else {
  logFail(`.vc-config.json not found at ${vcConfigPath}`);
  hasError = true;
}

// Final Summary
console.log('');
if (hasError) {
  console.error('\x1b[31m❌ Quality Control Gate FAILED. Please resolve errors before completing the session.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32m✨ All Quality Control Gates PASSED with all checks complete. ✨\x1b[0m\n');
  process.exit(0);
}
