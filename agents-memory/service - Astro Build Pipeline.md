# Service — Astro Build Pipeline

**File:** `astro.config.mjs` · `package.json` · `tsconfig.json`  
**Links to:** [[architecture]] §1 (Rendering Strategy), [[service - Tailwind Styling]]

---

## Purpose

Compiles `.astro` components into static HTML + CSS + JS at build time, plus a serverless API endpoint for Vercel. Uses `output: 'server'` with `@astrojs/vercel` adapter.

## Configuration

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: { plugins: [tailwindcss()] }
});
```

**Key settings:**
- `output: 'server'` — required for Vercel serverless API routes
- `adapter: vercel()` — @astrojs/vercel adapter
- Postbuild script patches `.vc-config.json` to force `nodejs22.x` runtime (Vercel doesn't support `nodejs24.x` yet)
- No `site` or `base` — relative paths assumed
- Single Vite plugin: `@tailwindcss/vite`

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at `localhost:4321` with HMR |
| `npm run build` | Build + postbuild patch to force nodejs22.x runtime in `.vc-config.json` |
| `npm run preview` | Serve `./dist/` locally |

## Dependencies

| Package | Version | Role |
|---------|---------|------|
| `astro` | ^7.0.6 | SSG framework, `.astro` compiler, hybrid output |
| `@astrojs/vercel` | ^11.0.2 | Vercel serverless adapter |
| `@vercel/speed-insights` | ^2.0.0 | Vercel RUM performance metrics |
| `tailwindcss` | ^4.3.0 | Utility CSS engine |
| `@tailwindcss/vite` | ^4.3.0 | Tailwind v4 Vite integration |

## Output

- 2 static HTML pages: `index.html` (`/`) and `projects/index.html` (`/projects`)
- 1 serverless API function: `/api/chat` deployed as a Vercel function
- Bundled `<script type="module">` per page (vanilla JS extracted from `<script>` tags)
- CSS bundle from `global.css` + Tailwind utilities
- Static assets from `public/` copied verbatim

## Depends On

- [[service - Tailwind Styling]] — consumed via the Vite plugin

## Consumed By

- All components are compiled through this pipeline
