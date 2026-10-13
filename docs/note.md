# Project Portfolio Website

**Stack:** Astro 7 + Tailwind CSS v4 (via @tailwindcss/vite)
**Theme:** Light Sakura Neko — white/pastel pink glassmorphism
**Node requirement:** >=22.12.0
**Images:** All images in `src/assets/images/`, optimized via Astro `<Image />` (auto WebP).

## File Index (quick reference)

| What | Where |
|------|-------|
| Homepage | `src/pages/index.astro` |
| Projects page | `src/pages/projects.astro` |
| Shared layout | `src/layouts/BaseLayout.astro` |
| Navigation bar | `src/components/Navbar.astro` | Fixed top, name logo with pink glow hover, nav links with 25% scale, sakura toggle, dark mode toggle, mobile hamburger with slide-in drawer panel |
| Animated background | `src/components/Background.astro` | 5 layers: conic wash + 3 primary orbs + 2 accent orbs + 8 glass floaters + vignette + mouse parallax |
| Sakura petals canvas | `src/components/SakuraCanvas.astro` | 35 bezier-curve petals, pauses on tab hide |
| Click feedback effects | `src/components/ClickEffects.astro` |
| Featured project cards | `src/components/ProjectGrid.astro` |
| Bio + skills section | `src/components/AboutMe.astro` |
| Contact card | `src/components/Contact.astro` |
| Chat API | `src/pages/api/chat.ts` | Serverless, proxies DeepSeek with rate limiting, validates API key |
| Footer | `src/components/Footer.astro` |
| Chatbot mascot | `src/components/NekoWidget.astro` | Fixed bottom-right, speech bubble, 700×360px chat panel, 9 Q&A chips, Whack-a-Mole game chip, hide/restore |
| Project detail modal | `src/components/ProjectModal.astro` | Populated from data-* attrs, SSR crawlable hrefs, focus trap, scroll lock |
| Trace art (decoration) | `src/components/TraceArt.astro` | 4 cat silhouettes + contour lines + paper grain (currently unused) |
| Whack-a-Mole game | `src/components/NekoGameModal.astro` | 3 screens, 3×3 grid, SVG paws, bonuses, bombs, event bridge |
| Global styles + dark mode | `src/styles/global.css` | Includes content-visibility: auto for off-screen sections |
| Astro config | `astro.config.mjs` |
| Design rules | `.clinerules` |
| Obsidian vault | `agents-memory/` (17 notes) |

## Obsidian Vault (`agents-memory/`)

System architecture fully documented in 15 interconnected notes:

| Note | Role |
|------|------|
| `architecture.md` | Master architecture analysis — 10 sections (SSG strategy, component roles, dependency graph, event bus, z-index, theming, tokens, invariants, performance, risks) |
| `service - *.md` (10 notes) | One per service: Astro Build Pipeline, Tailwind Styling, Theme Toggle, Sakura Canvas, Click Effects, Ambient Background, Scroll Reveal, Neko Chatbot, Contact Form, Project Catalog |
| `Project MOC - Astro Portfolio.md` | Map of Content — central hub linking all project notes |
| `Astro Portfolio - Architecture.md` | Folder structure, hierarchy, routes, design patterns |
| `Astro Portfolio - Setup.md` | Dependencies, commands, config |
| `Astro Portfolio - Tasks.md` | Build queue, polish, future features |

Key dependency edges documented:
- Theme Toggle → Sakura Canvas (via CustomEvent)
- Contact Form → Neko Chatbot (via CustomEvent)
- All services → Tailwind Styling (CSS consumed by every component)

## Feature Breakdown

### Visual & Theme
- **Hero Section** — Animated pop-in title, subtitle, intro, two CTA buttons, decorative code-preview card, cat-ear SVGs (wiggle at 4.5s, speed up on hover), bouncing scroll arrow
- **Animated Background** — 5 layers: conic gradient wash (60s rotation), 3 primary drifting orbs, 2 accent orbs, 8 glass geometric floaters, vignette; mouse-responsive parallax
- **Falling Sakura Petals** — 35 bezier-curve petals on HTML5 Canvas, 3 pink color variants, wind drift + rotation + seamless recycling, toggleable via navbar button + localStorage
- **Click Feedback Effects** — Global pointer click burst with one translucent neko paw ripple and 4-6 sakura petals, CSS-variable animation, automatic DOM cleanup, reduced-motion and coarse-pointer safeguards
- **Glassmorphism Cards** — bg-white/70 backdrop-blur-md border-2 border-pink-200 rounded-2xl with cat-ear SVGs on hover
- **Cat Whiskers** — CSS ::before/::after pseudo-elements with inline SVG, 3 whisker lines + dot per side, opacity 1 + translateX on hover
- **Cat-Ear SVGs** — Decorative ears with gradient fills on hero, project cards, skill stack, and contact; independent left/right wiggle keyframes
- **Dark Mode** — CSS custom properties on :root/.dark, toggle in navbar (sun/moon SVGs), localStorage persistence, respects prefers-color-scheme: dark
- **Scroll Reveal** — IntersectionObserver unidirectional fade-in on .reveal elements (opacity only, 1s transition)

### Project Showcase
- **Homepage** — 3 featured cards (Sorting Visualizer, C++ Task Organizer, Portfolio Web App), "View All Projects" button → /projects
- **Projects Page** — 19 project cards in responsive grid, each with title, description, tag pills
- **Detail Modal** — Single reusable glassmorphism modal (ProjectModal.astro), ARIA role="dialog", focus trap, scroll lock, populated from card data-* attrs

### Tag Filtering
- Multi-select OR logic via Set: click to toggle, active tags highlight pink-500
- FLIP animation: record rects → apply changes → calculate delta → translate teleport → CSS transition animates to final position (1.2s cubic-bezier)
- 28 unique tags across 19 projects
- Keyboard navigation: Enter/Space to select *(ArrowLeft/ArrowRight is commented-out dead code)*

### Neko Chatbot Widget
- Fixed bottom-right mascot (imported from src/assets/images/yae-mico-maid.png)
- Speech bubble: idle messages cycling every 20-30s, contextual messages on navbar hover or section scroll
- Chat panel: 700×360px, 9 Q&A chips (About, Skills, Projects, Contact, Fun, GitHub, Design, Neko, Whack-a-Mole), keyword-aware text input
- Hide/restore via localStorage, reset chat, typing indicator
- Listens on CustomEvent bus from Contact form (neko-form-event)

### Responsive
- Mobile: single-column layouts, smaller neko widget (280px wide, 80vh height)
- Desktop: 2-column (md) and 3-column (lg) grids, larger text
- Navbar: hamburger button opens slide-in drawer panel (glassmorphism, backdrop overlay, close on X/backdrop/link click, body scroll lock)

## Dependencies
- astro ^7.0.6
- @astrojs/vercel ^11.0.2
- @vercel/speed-insights ^2.0.0
- tailwindcss ^4.3.0
- @tailwindcss/vite ^4.3.0

## Astro Config
`output: 'server'` with `@astrojs/vercel` adapter plus `tailwindcss()` Vite plugin. Postbuild step patches `.vc-config.json` to force `nodejs22.x` runtime on Vercel.

## Commands
- `npm run dev` — dev server at localhost:4321
- `npm run build` — static build to dist/
- `npm run preview` — preview production build

## Build Output
2 static HTML pages (`/`, `/projects`) + 1 serverless API endpoint (`/api/chat`) deployed on Vercel

