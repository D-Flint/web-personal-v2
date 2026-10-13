# Architecture Analysis — Astro Portfolio

> [!abstract]
> This note analyzes the internal architecture of `radiant-ring`, a static portfolio built with [[Astro]] 7 + [[Tailwind CSS]] v4. It examines component roles, data flow, rendering strategy, and cross-cutting concerns.
> Related: [[Astro Portfolio - Architecture]] · [[Astro Portfolio - Setup]] · [[Project MOC - Astro Portfolio]]

---

## 0. Service Registry

The project decomposes into 11 client-side services. Each is documented in its own note with dependency links:

| #   | Service                            | File(s)                                                     | Role                                       |
| --- | ---------------------------------- | ----------------------------------------------------------- | ------------------------------------------ |
| 1   | [[service - Astro Build Pipeline]] | `astro.config.mjs`, `package.json`                          | SSG compilation, Vite bundling             |
| 2   | [[service - Tailwind Styling]]     | `src/styles/global.css`                                     | CSS engine, design tokens, keyframes       |
| 3   | [[service - Theme Toggle]]         | `Navbar.astro` (JS)                                         | Dark mode + sakura on/off, localStorage    |
| 4   | [[service - Sakura Canvas]]        | `SakuraCanvas.astro`                                        | Canvas petal animation (35 petals)         |
| 5   | [[service - Click Effects]]        | `ClickEffects.astro`                                        | Paw-print + petal DOM particles on click   |
| 6   | [[service - Ambient Background]]   | `Background.astro`                                          | 5-layer ethereal drift (conic wash, orbs, glass floaters, vignette) + mouse parallax |
| 7   | [[service - Scroll Reveal]]        | `index.astro` (JS), `projects.astro` (JS)                   | IntersectionObserver fade-in + directional exit slide |
| 8   | [[service - Neko Chatbot]]         | `NekoWidget.astro` + `api/chat.ts`                          | Interactive mascot, LLM-first chat panel, DeepSeek proxy, rate limits |
| 9   | [[service - Contact Form]]         | `Contact.astro`                                             | 4-field form, validation, event bridge     |
| 10  | [[service - Project Catalog]]      | `projects.astro`, `ProjectGrid.astro`, `ProjectModal.astro` | Project cards, tag filter, detail modal    |
| 11  | [[service - Neko Game Modal]]      | `NekoGameModal.astro`                                       | Whack-a-Mole arcade game, event bridge     |

**Dependency graph:** See the inter-service links in each note. Key edges:
- Theme Toggle → Sakura Canvas (via CustomEvent)
- Contact Form → Neko Chatbot (via CustomEvent)
- Neko Chatbot → Neko Game Modal (via `neko-open-game` CustomEvent)
- Neko Game Modal → Neko Chatbot (via `neko-game-result` CustomEvent)
- All services → Tailwind Styling (CSS consumed by every component)
- All `.astro` files → Astro Build Pipeline (compilation)

---

## 1. Rendering Strategy

Uses **[[Hybrid Rendering]]** with `output: 'server'` and `@astrojs/vercel` adapter — 2 static pages at build time, 1 serverless API endpoint at request time.

| Route | File | Type |
|-------|------|------|
| `/` | `index.astro` | Static SSG |
| `/projects` | `projects.astro` | Static SSG |
| `/api/chat` | `src/pages/api/chat.ts` | Serverless (Vercel) — `prerender = false` |

The API route proxies to DeepSeek V4 Flash with streaming, rate limiting (8/min per IP), input validation, and a 5,000 req/day global budget. All client dynamic behavior (chatbot, sakura canvas, click effects, form feedback) is vanilla JS.

---

## 2. Component Classification

Every `.astro` file fits one of five architectural roles.

### 2.1 Layout Shell

**[[BaseLayout.astro]]** — Single layout wrapping every page. Owns `<html>`, `<head>`, `<body>`, global keyframes, the z-index stack of atmospheric widgets, a `<slot />` for page content, and a conditional `<Footer />` via `showFooter`.

### 2.2 Page Components

| Component | Route | Children |
|-----------|-------|----------|
| `index.astro` | `/` | Hero (inline SVGs), [[ProjectGrid]], [[AboutMe]], [[Contact]] |
| `projects.astro` | `/projects` | 19 inline project cards + [[ProjectModal]] |

Both import [[BaseLayout]]. The index page also runs a client [[IntersectionObserver]] for scroll-reveal.

### 2.3 Atmosphere & Decoration

Purely visual — reinforce the **Light Sakura Neko** theme:

| Component | Technique | Cost |
|-----------|-----------|------|
| [[Background.astro]] | CSS 5-layer drift (conic wash, 5 orbs, 8 glass floaters, vignette) + mouse parallax JS | GPU-composited + rAF |
| [[SakuraCanvas.astro]] | HTML5 [[Canvas API]] — 35 petals, wind sim | ~1-2ms/frame rAF |
| [[ClickEffects.astro]] | DOM particles — paw print + petal burst | Max 50 nodes, auto-cleanup |

**Concept link:** All three use [[GPU-Composited Layers]] — `fixed`, `will-change`, `pointer-events: none`.

### 2.4 Content Components

| Component | Data Source | Interactivity |
|-----------|-------------|---------------|
| **Navbar.astro** | Static inline links | Dark/sakura toggle, hamburger (UI) |
| **ProjectGrid.astro** | 3 inline objects | Cat-ear hover animation |
| **ProjectModal.astro** | `data-*` attrs at runtime | `.is-open` toggle, focus trap, Escape/backdrop |
| **AboutMe.astro** | 10 inline skills | Cat-ear hover animation |
| **Contact.astro** | Form fields | Validation, success sim, dispatches custom events |
| **Footer.astro** | Links + dynamic year | None |

### 2.5 Interactive Agents

**[[NekoWidget.astro]]** (~1300 lines) — Fixed bottom-right chatbot mascot. LLM-first response flow: sends user text to `POST /api/chat` (DeepSeek V4 Flash proxy), falls back to keyword matching on error/timeout. Streams tokens incrementally into bot bubbles. Idle message cycle (20-30s), chat panel with Q&A chips. Listens on [[CustomEvent]] bus from Contact.astro, observes sections via [[IntersectionObserver]]. Persists hide/mute state in [[localStorage]]. This is a [[Singleton]] mounted in BaseLayout.


---

## 3. Component Dependency Graph

```text
                   ┌──────────────────────────────────┐
                   │         astro.config.mjs         │
                   └──────────────┬───────────────────┘
                                  │
                   ┌──────────────▼───────────────────┐
                   │       src/styles/global.css      │
                   │  @import "tailwindcss"           │
                   │  CSS vars (light/dark), keyframes│
                   └──────────────┬───────────────────┘
                                  │
                   ┌──────────────▼───────────────────┐
                   │        BaseLayout.astro          │
                   │  <html> <head> <body> <slot />   │
                   └──┬──┬──┬──┬──┬──┬──┬────────-────┘
                      │  │  │  │  │  │  │
            ┌─────────┘  │  │  │  │  │  └──────────┐
           ▼            ▼  ▼  ▼  ▼  ▼              ▼
    [Background] [SakuraCanvas] [ClickEffects] [NekoWidget] [Navbar] [Footer?] [NekoGameModal]
     (z:-1)        (z:-1)       (z:9999)       (z:50)      (z:50)   (cond.)    (z:110)
                                 ┌─────<slot>───--──┐
                                 │                  │
                           ┌─────▼──-─-─┐      ┌────▼─────┐
                           │index.astro │      │projects. │
                           │            │      │  astro   │
                           │ Hero (SVG) │      │14 cards  │
                           │ ProjectGrid│      │Tag filter│
                           │ AboutMe    │      │Modal     │
                           │ Contact    │      │          │
                           └─-───┬──────┘      └────┬─────┘
                                 │ dispatch         │ populate
                                 ▼                  ▼
                            [NekoWidget]       [ProjectModal]
                            (CustomEvent       (.is-open toggle,
                              listener)        data-* populate)
                                  | CustomEvent
                                  v
                           [NekoGameModal]
                           (neko-open-game /
                            neko-game-result)
```

---

## 4. Data Flow & Event Bus

### 4.1 Build-Time Data Flow

```text
.astro file ──[Astro compiler]──> static HTML + CSS
                                   + <script type="module"> (Vite-bundled)
```

### 4.2 Runtime Event Channels

**Channel A — Sakura Toggle** (one-way):
```text
Navbar click → setSakura()
  → localStorage("sakura")
  → .sakura-paused on <html>
  → CustomEvent("sakura-toggle", { detail: { active } })
    → SakuraCanvas → start() / stop()
```

**Channel B — Neko-Contact Bridge** (two-way):
```text
Contact.astro form events
  → dispatchEvent(new CustomEvent("neko-form-event", { detail: { field, action } }))
    → NekoWidget → showBubble(contextualReply)
```

CustomEvent action mapping:

| Action | NekoWidget Reaction |
|--------|---------------------|
| `blur` / `done` | Hide bubble |
| `focus` on name/email | "I'm listening closely! 🐾" |
| `focus` on message | "Writing a scroll for me? Purr..." + wiggle |
| `focus` on subject | "Ooh, what is the gossip? Nya~" |
| `sending` submit | "Pouncing your mail! 🧶✨" |
| `success` submit | "Mail pounced successfully! 🐾" + bounce |
| `error` submit | "Mew! Something went wrong..." |

**Channel C — Neko Game Bridge** (two-way):
```text
NekoWidget chip click ("Whack-a-Mole")
  → dispatchEvent(new CustomEvent("neko-open-game"))
    → NekoGameModal → openModal()
      → Player finishes round
        → dispatchEvent(new CustomEvent("neko-game-result", { detail: { score, duration, isNewHigh, bestScore } }))
          → NekoWidget → showBubble(gameReaction)
```

### 4.3 State Persistence

| State | Key | Values |
|-------|-----|--------|
| Dark mode | `theme` | `"dark"` \| `"light"` |
| Sakura | `sakura` | `"on"` \| `"off"` |
| Neko visible | `neko-hidden` | `"true"` \| `"false"` |
| Neko mute | `neko-muted` | `"true"` \| `"false"` |
| Game high score | `neko-game-highscore-<duration>` | number string |

All reads at DOMContentLoaded. No cross-tab sync.


---

## 5. Z-Index Stacking Context

```text
z-index   Component           Pointer Events
─────────────────────────────────────────────────
 9999     ClickEffects        none (pass-through)
  110     NekoGameModal       auto (only when .is-open)
  100     ProjectModal        auto (only when .is-open)
   50     NekoWidget          auto
   50     Navbar              auto
    0     Page content        auto
   -1     SakuraCanvas        none (pass-through)
   -1     Background          none (pass-through)
```

ClickEffects at 9999 never intercepts clicks. ProjectModal blocks interaction only when .is-open.

---

## 6. Theming Architecture

Three independent binary toggles compose freely.

### Light / Dark Mode
[[CSS Custom Properties]] on `:root` and `.dark`:
```css
:root { --bg-page: #fdf2f8; --bg-glass: rgba(255,255,255,0.7); }
.dark { --bg-page: #0f172a; --bg-glass: rgba(30,41,59,0.75); }
```
Tailwind utilities overridden via `!important`:
```css
.bg-white\/70 { background: var(--bg-glass) !important; }
```


**2. Tailwind v4 class-based `dark:` variant** — configured in `global.css`:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
Tailwind v4 defaults to `@media (prefers-color-scheme: dark)` for its `dark:` variant. This directive switches it to class-based (`.dark` on `<html>`), so the navbar toggle button controls all `dark:` utility classes (e.g., `dark:bg-slate-900/90`, `dark:text-pink-50`) across every component including the project modal.

### Sakura On/Off
Button in [[Navbar]] → `.sakura-paused` on `<html>` → CSS hides canvas + JS stops rAF loop.

### Neko Visible/Hidden
Close button hides widget, shows paw restore button. `localStorage("neko-hidden")`.

---

## 7. Design Token System

No formal file — an [[Emergent Design System]] from repeated Tailwind patterns:

| Token | Value | Uses |
|-------|-------|------|
| Glass background | `rgba(255,255,255,0.7)` | All glass cards |
| Border color | `#fbcfe8` / `#334155` (dark) | Component borders |
| Accent color | `#f472b6` (pink-400) | Buttons, hover glows |
| Text primary | `#0f172a` (slate-900) | Headings |
| Text secondary | `#475569` (slate-600) | Body |
| Border radius | `2xl` / `rounded-full` | Cards / pills |
| Backdrop blur | `md` (12px) / `sm` (8px) | Glass effect |
| Ear animation | `4.8s` ease-in-out infinite | Cat-ear SVGs |

---

## 8. Key Architectural Invariants

1. **[[One Server Dependency]]** — `POST /api/chat` is the only serverless endpoint; proxies to DeepSeek with rate limiting and input validation.
2. **[[Single Responsibility Components]]** — Each `.astro` does one thing. NekoWidget (~1300 lines) is the sole exception.
3. **[[CSS Locality via Astro]]** — Scoped by default; `<style is:global>` only for keyframes and dark mode overrides.
4. **[[Progressive Enhancement]]** — Fully readable without JS. Interactivity is additive.
5. **[[No Framework Lock-In]]** — All client JS is vanilla. Zero framework overhead.

---

## 9. Performance Profile

| Metric | Value |
|--------|-------|
| Pages | 2 static HTML + 1 serverless API endpoint |
| Client JS bundle | ~15 KB (gzip) |
| Canvas render cost | 35 petals at ~1-2ms/frame |
| DOM particle cap | 50 nodes (auto-pruned) |
| Image assets | 4 files, no lazy loading |
| CSS output | ~25 KB (gzip) |

---

## 10. Architectural Risks & Technical Debt

| Risk | Impact | Mitigation |
|------|--------|------------|
| No lazy image loading | Slower initial paint | Added `loading="lazy"`/`loading="eager"` to Astro `<Image />` components |
| NekoWidget at 891 lines | Hard to maintain | Split into model/view/controller |
| `!important` in global.css | Tailwind upgrades may break | Migrate fully to CSS custom properties |
| No component tests | Regression on refactors | Add Playwright or Vitest |
| Hardcoded asset paths | Breaks on directory reorg | Migrated to `src/assets/images/` with Astro `<Image />` imports |
| Contact form submits to Web3Forms | Relies on 3rd-party service | Add serverless fallback |