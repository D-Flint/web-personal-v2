# Project File Structure

Full directory tree with descriptions for every file.

```
project-portfolio-website/
│
├─── public/                          # Static assets (served as-is at /)
│   ├─── favicon.ico                  # 655 B — Browser tab icon (fallback)
│   └─── favicon.svg                  # 749 B — Browser tab icon (modern SVG)
│
├─── src/                             # Source code
│   ├─── assets/                      # Optimized assets (processed by Astro at build)
│   │   └─── images/                  # Image files imported via Astro <Image />
│   │       ├─── mascot.png           # 82 KB — Legacy mascot for AboutMe bio card
│   │       ├─── yae-mico-maid.png    # 465 KB — Primary mascot for NekoWidget chatbot
│   │       ├─── yae-miko-chibi.jpg   # Chibi avatar for hero code card
│   │       └─── yae-miko-tiny.png    # Tiny mascot for Contact success state
│   ├─── components/                   # Reusable Astro components
│   │   ├─── Navbar.astro              # Fixed top nav bar. Logo left with pink glow + 25% scale on hover, nav links right with 25% scale on hover, dark toggle, sakura toggle, mobile hamburger with slide-in drawer panel
│   │   ├─── Background.astro          # Fullscreen animated background: 5 layers (conic wash, 3+2 orbs, 8 glass floaters, vignette) + mouse parallax
│   │   ├─── SakuraCanvas.astro        # HTML5 Canvas: 35 falling sakura petals, 3 colors, wind/rotation, toggleable
│   │   ├─── ClickEffects.astro        # Global pointer click feedback: neko paw ripple + sakura petal burst
│   │   ├─── ProjectGrid.astro         # 3 featured project cards + View All button (homepage only)
│   │   ├─── AboutMe.astro             # Bio text + 10 skill pills in glass card, mascot image
│   │   ├─── Contact.astro             # Glassmorphism contact form (4 fields) with validation, submit spinner, success state showing imported yae-miko-tiny.png at 1.5x with bounce
│   │   ├─── Footer.astro              # Copyright year, GitHub link, Email vuthihoeurb@gmail.com
│   │   ├─── NekoWidget.astro          # Fixed bottom-right chatbot mascot: speech bubble, chat panel, Q&A, typing indicator, hide/restore, Whack-a-Mole game chip
│   │   ├─── NekoGameModal.astro       # Standalone Whack-a-Mole arcade game modal (3 screens, 3×3 grid, SVG paws, sakura bonuses, bombs), event bridge to NekoWidget
│   │   ├─── ProjectModal.astro        # Reusable glassmorphism detail modal, populated from data-* attrs, SSR crawlable hrefs, focus trap, scroll lock
│   │   └─── TraceArt.astro            # Decorative SVG cat silhouettes + contour lines + paper grain (not imported anywhere)
│   │
│   ├─── layouts/                      # Page layout wrappers
│   │   └─── BaseLayout.astro          # Shared shell: global.css, Background, SakuraCanvas, ClickEffects, Navbar, NekoWidget, <slot>, Footer
│   │
│   ├─── pages/                        # Route pages (each .astro file = one route)
│   │   ├─── index.astro               # Route / — Hero, ProjectGrid, AboutMe, Contact (all via BaseLayout)
│   │   └─── projects.astro             # Route /projects — 19 project cards with multi-select tag filtering + FLIP animation
│   │
│   └─── styles/                       # Stylesheets
│       └─── global.css                 # @import tailwindcss + dark mode CSS vars + whiskers SVG + ear keyframes + scroll reveal
│
├─── docs/                            # Project documentation
│   ├─── about.md                     # Complete reference — read this first when returning to the project
│   ├─── build-log.md                 # Development session history (features added, bugs fixed)
│   ├─── change.md                     # Per-file change log by date
│   ├─── note.md                       # Condensed feature overview + file index
│   ├─── structure.md                 # This file — directory tree with annotations
│   ├─── tracker.md                   # Session-by-session conversation and task log
│   └─── unchanged.md                 # Files that have never been modified + new/removed files
│
├─── dist/                            # Build output (gitignored)
│
├─── astro.config.mjs               # Astro config: server output + vercel adapter + tailwindcss() Vite plugin
├─── package.json                    # Dependencies: astro ^7.0.3, tailwindcss ^4.3.0, @tailwindcss/vite ^4.3.0
├─── tsconfig.json                   # TypeScript config (basic, for Astro)
├─── .clinerules                     # Design rules: Light Sakura Neko aesthetic, glassmorphism, sakura pink accents
├─── .gitignore                      # Git ignore rules
└─── README.md                        # Project readme (GitHub-facing)
```

## Key Architecture

- **Framework**: Astro 7 (static site generator, zero JS by default)
- **CSS**: Tailwind CSS v4 via @tailwindcss/vite (no tailwind.config needed)
- **Routes**: 2 static pages (`/`, `/projects`) + 1 serverless API endpoint (`/api/chat`)
- **Components**: 12 Astro components in `src/components/` (11 actively used, 1 unused)
- **Layout**: 1 shared `BaseLayout.astro` wrapping all pages
- **Styling**: Single `global.css` with @import tailwindcss + custom CSS variables
- **Build output**: `dist/` with 2 HTML pages (index.html, projects/index.html)

## Rendering Model

Pages are **server-rendered** by Astro at build time. The `/api/chat` endpoint runs serverless on Vercel (`prerender = false`). The only client-side JS is in `<script>` blocks:
- `Navbar.astro` — dark mode toggle, sakura toggle, mobile menu open/close
- `SakuraCanvas.astro` — canvas animation loop (SakuraSimulation class)
- `ClickEffects.astro` — pointerdown listener for paw ripple + sakura burst particles
- `NekoWidget.astro` — chatbot UI logic (runs via standard <script>, no is:inline directive)
- `index.astro` — IntersectionObserver for scroll reveal (inline script, runs on DOMContentLoaded)
- `projects.astro` — tag filtering with FLIP animation (inline script, runs on DOMContentLoaded)
