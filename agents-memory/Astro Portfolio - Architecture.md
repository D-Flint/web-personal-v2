# Astro Portfolio â€” Architecture

## Overview
**Project name:** `radiant-ring` (Astro 7 + Tailwind CSS v4)  
**Theme:** Light Sakura Neko â€” white/pastel pink glassmorphism with whisker hover effects, wiggle cat-ear SVGs, and a neko chatbot mascot.  
**Cline rules:** `.clinerules` enforces pink accents, dark text on white/pastel backgrounds, and `bg-white/60` translucency.

## Directory Structure

```
project-portfolio-website/
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ favicon.ico
â”‚   â”œâ”€â”€ favicon.svg
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ Navbar.astro        â€” Fixed top nav, dark mode toggle, sakura toggle
â”‚   â”‚   â”œâ”€â”€ Background.astro    â€” Fullscreen 5-layer drift: conic wash, 5 orbs, 8 glass floaters, vignette + mouse parallax
â”‚   â”‚   â”œâ”€â”€ SakuraCanvas.astro  â€” Canvas: 35 bezier-curve petals, wind drift
â”‚   â”‚   â”œâ”€â”€ ClickEffects.astro  â€” Pointer clicks â†’ paw-print + petal burst
â”‚   â”‚   â”œâ”€â”€ ProjectGrid.astro   â€” 3 featured project cards (homepage)
â”‚   â”‚   â”œâ”€â”€ ProjectModal.astro  â€” Reusable glassmorphism detail modal shell
â”‚   â”‚   â”œâ”€â”€ AboutMe.astro       â€” Biography + 10 skill pills
â”‚   â”‚   â”œâ”€â”€ Contact.astro       â€” Form (name, email, subject, message)
â”‚   â”‚   â”œâ”€â”€ Footer.astro        â€” Copyright, GitHub, Email links
â”‚   â”‚   â”œâ”€â”€ NekoGameModal.astro â€” Whack-a-Mole arcade game modal (3 screens, event bridge)
â”‚   â”‚   â”œâ”€â”€ TraceArt.astro     â€” Decorative cat silhouettes + contour lines (unused)
â”‚   â”‚   â””â”€â”€ NekoWidget.astro    â€” Fixed bottom-right chatbot mascot
â”‚   â”œâ”€â”€ layouts/
â”‚   â”‚   â””â”€â”€ BaseLayout.astro    â€” HTML shell, global components, <slot>
â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ index.astro         â€” SPA-style single page (hero, projects, about, contact)
â”‚   â”‚   â””â”€â”€ projects.astro      â€” Full project catalog with modal + tag filtering
â”‚   â””â”€â”€ styles/
â”‚       â””â”€â”€ global.css          â€” Tailwind import + dark mode vars, ear/whisker keyframes
â”œâ”€â”€ dist/                       â€” Static build output
â”œâ”€â”€ docs/                       â€” Project documentation files
â”œâ”€â”€ astro.config.mjs            â€” Astro config + @tailwindcss/vite plugin
â”œâ”€â”€ package.json
â”œâ”€â”€ tsconfig.json               â€” Extends astro/tsconfigs/strict
â”œâ”€â”€ .clinerules                 â€” Light Sakura Neko aesthetic rules
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
```

## Component Hierarchy

```
BaseLayout.astro
â”œâ”€â”€ Background.astro            (z-index: -1, fixed)
â”œâ”€â”€ SakuraCanvas.astro          (z-index: -1, fixed, canvas)
â”œâ”€â”€ ClickEffects.astro          (z-index: 9999, fixed overlay)
â”œâ”€â”€ NekoWidget.astro            (z-index: 50, fixed bottom-right)
â”œâ”€â”€ Navbar.astro                (z-index: 50, fixed top)
â”œâ”€â”€ <slot />                    (page content)
â”‚   â”œâ”€â”€ index.astro
â”‚   â”‚   â”œâ”€â”€ Hero Section        (inline â€” cat-ear SVGs + intro)
â”‚   â”‚   â”œâ”€â”€ ProjectGrid.astro
â”‚   â”‚   â”œâ”€â”€ AboutMe.astro
â”‚   â”‚   â””â”€â”€ Contact.astro
â”‚   â””â”€â”€ projects.astro
â”‚       â”œâ”€â”€ ProjectGrid (inline â€” 19 cards)
â”‚       â””â”€â”€ ProjectModal.astro  (z-index: 100, modal shell)
â””â”€â”€ Footer.astro                (conditional via `showFooter` prop)
```

## Routes

| Route | File | Content |
|-------|------|---------|
| `/` | `src/pages/index.astro` | Hero + 3 featured projects + About + Contact |
| `/projects` | `src/pages/projects.astro` | Full catalog (19), tag filters, detail modal |
| `/api/chat` | `src/pages/api/chat.ts` | Serverless DeepSeek proxy, rate-limited |

## Key Design Patterns

- **Glassmorphism:** `bg-white/70 backdrop-blur-md border-2 border-pink-200` on all cards
- **Cat-ear SVGs:** Animated wiggle keyframes on hover (4.8s loop, speeds up on hover)
- **Whiskers:** CSS `::before` / `::after` pseudo-elements with inline SVG; appear on hover
- **Dark mode:** CSS custom properties + `localStorage` persistence; `.dark` class on `<html>`
- **Sakura toggle:** Custom `sakura-toggle` event; canvas pauses via `.sakura-paused` class
- **Scroll reveal:** `IntersectionObserver` removes `opacity-0` classes (homepage opacity-only; projects page adds directional slide on exit)
- **FLIP animations:** Project cards on `/projects` slide-arrange on tag filter
- **Neko chatbot:** Predefined Q&A chips, keyword detection, idle cycle, form event listeners

## Client-Side Event Bus

The NekoWidget listens for custom events dispatched by `Contact.astro` to provide contextual mascot reactions (blur, focus, submit, success, error) on each form field.

