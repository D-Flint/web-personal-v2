# Astro Portfolio — Setup

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `astro` | ^7.0.6 | SSG with hybrid output + `.astro` component framework |
| `@astrojs/vercel` | ^11.0.2 | Vercel serverless adapter |
| `@vercel/speed-insights` | ^2.0.0 | Vercel real-user performance metrics |
| `tailwindcss` | ^4.3.0 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4.3.0 | Vite plugin for Tailwind v4 |

**Runtime:** Node.js >= 22.12.0

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start dev server at `http://localhost:4321` (HMR enabled) |
| `npm run build` | Static build to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro` | Run the Astro CLI directly |

## Configuration File

**`astro.config.mjs`** — Config with Vercel adapter:
```js
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});
```
A postbuild script in `package.json` patches `.vc-config.json` to force `nodejs22.x` runtime for Vercel compatibility.

## TypeScript

**`tsconfig.json`** — Extends `astro/tsconfigs/strict`, includes all project files, excludes `dist/`.

## Global Styles

**`src/styles/global.css`** — Entry point:
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Plus custom additions:
- CSS custom properties for light & dark mode (background, glass, border, text, whisker colors)
- Cat ear animation keyframes (cardEarWiggleLeft, cardEarWiggleRight, stackEarWiggleLeft, stackEarWiggleRight)
- Cat whisker pseudo-elements with inline SVG data URIs
- `.reveal` scroll-triggered fade-in transitions
- `.sakura-paused` rule to hide canvas when sakura is toggled off
- Dark mode variable overrides via `!important` on Tailwind utility classes

## Build Output

Hybrid build: 2 static HTML pages (`/`, `/projects`) + 1 serverless API endpoint (`/api/chat`) via `@astrojs/vercel` adapter output to `./dist/`.

## Project Metadata

- **Name:** `radiant-ring`
- **Version:** `0.0.1`
- **Module type:** ESM (`"type": "module"` in package.json)
