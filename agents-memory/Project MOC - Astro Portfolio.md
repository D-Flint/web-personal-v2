# Project MOC — Astro Portfolio

**Project:** `radiant-ring` — Personal portfolio website  
**Stack:** [[Astro]] 7 + [[Tailwind CSS]] v4  
**Theme:** Light Sakura Neko — pastel pink glassmorphism with cat-ear decorations, whisker hover effects, and an interactive neko chatbot mascot.

---

## Project Nodes

| Note | Description |
|------|-------------|
| [[Astro Portfolio - Architecture]] | Folder structure, component hierarchy, routes, design patterns, client-side event bus |
| [[Astro Portfolio - Setup]] | Dependencies, dev commands, config files, global styles, build output |
| [[Astro Portfolio - Tasks]] | Build queue, polish items, and future feature roadmap |

---

## Quick Reference

- **Dev server:** `npm run dev` → `http://localhost:4321`
- **Build:** `npm run build` → outputs to `./dist/`
- **Pages:** `/` (single-page hero) and `/projects` (full catalog)
- **Components:** 12 Astro components under `src/components/` (11 actively used, 1 unused)
- **Layout:** 1 base layout (`BaseLayout.astro`) with glassmorphism shell + global widgets
- **Design system:** `bg-white/70 backdrop-blur-md border-2 border-pink-200` (glass cards), `bg-pink-500` (accent buttons)

---

## Key Architectural Decisions

1. **Static site** — No SSR or on-demand rendering; two static HTML pages
2. **Single modal instance** — `ProjectModal.astro` is a static shell re-populated at runtime via `data-*` attributes; avoids DOM duplication
3. **Event-driven mascot** — NekoWidget reacts to custom DOM events dispatched by Contact form (focus/blur/submit)
4. **Canvas-based sakura** — HTML5 Canvas with 35 procedural petals; toggled via navbar button + `localStorage`
5. **CSS-only decorations** — Cat ears (SVG), whiskers (`::before`/`::after` pseudo-elements), background (5-layer drift + mouse parallax) — minimal JS overhead
