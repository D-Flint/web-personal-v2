# Portfolio Website — Complete Reference

This document is the single source of truth for the project. When you return after weeks or months, read this file first to understand every file, dependency, animation, and interaction without digging through source code.

---

## Quick Facts

| Property | Value |
|----------|-------|
| **Stack** | Astro 7 + Tailwind CSS v4 (via `@tailwindcss/vite`) |
| **Theme** | Light Sakura Neko — white/pastel pink glassmorphism |
| **Primary Mascot** | `src/assets/images/yae-mico-maid.png` (used in NekoWidget) |
| **Legacy Mascot** | `src/assets/images/mascot.png` (used in AboutMe bio card) |
| **Contact Success Mascot** | `src/assets/images/yae-miko-tiny.png` (used in Contact.astro success state) |
| **Layout strategy** | Single shared `BaseLayout.astro` wrapping all pages |
| **Global click effect** | Neko paw ripple + sakura petal burst (`ClickEffects.astro`) |
| **Output mode** | Hybrid — 2 static pages + 1 serverless API route (output: server for Vercel adapter) |
| **Dev** | `npm run dev` → `localhost:4321` |
| **Build** | `npm run build` → `dist/` |
| **Node requirement** | `>=22.12.0` |

---

## Pages

### `/` — `src/pages/index.astro`
The homepage. Contains:
- **Hero section** (`#home`): animated pop-in title "Hi, I'm Hoeurb Vuthi", subtitle "Full-Stack Developer & Computer Science Student", intro paragraph, two CTA buttons (View Projects → `#projects`, Contact Me → `#contact`), a decorative code-preview placeholder card on the right, animated cat-ear SVGs at the top that wiggle continuously and speed up on group hover, and a bouncing scroll-down arrow at the bottom.
- **Featured Projects** (`#projects`): rendered by `ProjectGrid.astro` — 3 cards in a 3-column grid.
- **About Me** (`#about`): rendered by `AboutMe.astro` — two columns (bio + skill pills).
- **Contact** (`#contact`): rendered by `Contact.astro` — full-width glass card.
- **Footer**: rendered by `Footer.astro`.
- **Scroll reveal**: a `<script>` block creates an IntersectionObserver that watches all `.reveal` elements. When an element enters the viewport (threshold 0.15), it fades in (opacity 0→1). Homepage sections are unidirectional and opacity-only (no translateY to avoid CLS). The projects page additionally uses directional slide (`translate-y-16`/`-translate-y-16`) on exit for cards.
- **Cat-ear wiggle keyframes**: `earWiggleLeft` / `earWiggleRight` at 4.5s intervals, slow to 5s on `.group:hover` (hero section). Card and stack ears use independent keyframes (`cardEarWiggle*`, `stackEarWiggle*`) at 4.8s that speed up to 1.6s on hover.

### `/projects` — `src/pages/projects.astro`
The full project catalog page. Contains:
- **Title** and subtitle.
- **Filter bar** (`#filter-bar`): dynamically populated from the project data. An "All" button (default active, pink solid) + one button per unique tag (glassmorphism when inactive).
- **Project grid** (`#project-grid`): 19 project cards in a responsive grid (1-col mobile, 2-col md, 3-col lg).
- **Project data** is stored in a hidden `<div id="pjdata">` as JSON (`data-projects` and `data-tags` attributes), parsed by the client-side script.
- **Cat-ear SVGs** on each card: hidden by default (`opacity-0`), appear on card hover (`group-hover:opacity-100`), wiggle continuously.
- **Filtering logic**: multi-select OR. Click a tag to toggle it on/off. "All" clears all selections. Cards matching ANY selected tag remain visible. Uses FLIP animation for smooth reflow.
- **Keyboard navigation**: Enter/Space to activate filter buttons *(ArrowLeft/ArrowRight focus navigation is currently inactive — commented-out dead code)*.
- **Detail modal** (`#project-modal`): glassmorphism dialog opened by clicking any project card. Populated from card `data-*` attributes (title, description, features, tags, live/source URLs). Closes on X/Escape/backdrop click. Body scroll lock with scrollbar compensation, focus trap, focus recovery.

---

## Components (`src/components/`)

### `src/components/Navbar.astro`
```
Path: src/components/Navbar.astro
Used in: BaseLayout.astro (every page)
Position: fixed top, z-50
```
- **Left**: `<a href="/">` with text "Hoeurb Vuthi" — bold, tracking-tight.
- **Right** (`hidden md:flex`): Home (`/`), Projects (`/#projects`), About (`/#about`), Contact (pink rounded-full button with `.whisker-group`).
- **Controls** (always visible):
  - **Sakura toggle** (`#sakura-toggle`): 🌸 button. Toggles `.sakura-paused` class on `<html>`, sets `localStorage.sakura = "on"|"off"`, dispatches a `CustomEvent('sakura-toggle', { detail: { active } })` that SakuraCanvas listens to.
  - **Dark mode toggle** (`#dark-toggle`): sun/moon SVG icons. Toggles `.dark` class on `<html>`, sets `localStorage.theme = "dark"|"light"`. On first visit, respects `prefers-color-scheme: dark`.
  - **Mobile hamburger** (`md:hidden`): three-line SVG icon opens glassmorphism slide-in drawer with backdrop overlay, nav links, and utility toggles. Body scroll lock while open.
- **Accepts optional `filterTags` prop**: when provided (from projects.astro), adds a filter dropdown with tag categories to both desktop nav and mobile drawer.
- **Script block** (inline, runs on load): initializes dark mode from localStorage, sets up click handlers for both toggles.
- **Animation**: `.animate-drop-in` — slides down from `-100%` to `0` over 0.8s on page load.

### `src/components/Background.astro`
```
Path: src/components/Background.astro
Used in: BaseLayout.astro (every page)
Position: fixed inset-0, z-[-1], pointer-events-none
Base color: bg-pink-50
```
- **5 layers**:
  1. **Color wash**: slow-rotating (60s) conic gradient spanning pink/rose/fuchsia, `blur(120px)`, `mix-blend-mode`
  2. **Primary orbs**: 3 large ethereal blobs with organic morphing border-radius and drift paths (`blur(80-90px)`, `mix-blend-mode`)
  3. **Accent orbs**: 2 smaller orbs with independent drift (hidden on mobile)
  4. **Glass floaters**: 8 geometric shapes (hexagon, circle, diamond, petal) with glassmorphism styling and float/glow animations (hidden on mobile)
  5. **Vignette**: radial gradient overlay for depth framing
- **Mouse parallax**: JS `pointermove` listener updates `--px`/`--py` CSS custom properties via `requestAnimationFrame`, applied to orb transforms
- **Dark/light mode**: orb colors, blend mode (`multiply`/`screen`), shape borders via CSS variables
- **Reduced motion**: all animations disabled at `prefers-reduced-motion: reduce`

### `src/components/SakuraCanvas.astro`
```
Path: src/components/SakuraCanvas.astro
Used in: BaseLayout.astro (every page)
Position: fixed inset-0, z-[-1], pointer-events-none
```
- **Canvas element**: `<canvas id="sakura-canvas">`.
- **Class `SakuraSimulation`**:
  - `constructor(canvas)`: initializes canvas context, binds `resize` event, listens for `sakura-toggle` custom event, auto-starts if `localStorage.sakura !== "off"`.
  - `resize()`: sets canvas width/height to `window.innerWidth/innerHeight`.
  - `start()`: creates 35 petals, begins animation loop.
  - `stop()`: cancels animation frame, clears canvas.
  - `createPetal(randomY)`: returns a petal object with randomized `x, y, size (6-14px), speedY (0.4-1.0), speedX (0.2-0.6), windDrift (-0.3 to 0.3), rotation (random), rotSpeed (-0.015 to 0.015), opacity (0.3-0.7), petalType (0, 1, or 2)`.
  - `drawPetal(p)`: draws a sakura-teardrop shape using `bezierCurveTo` with a subtle center line stroke.
  - `update(delta)`: moves each petal by `speedY * delta * 0.06` downward, oscillates horizontally with `sin`, applies wind drift, rotates. Recycles petals that go off-screen.
  - `draw()`: clears canvas and draws all petals.
  - `loop(time)`: `requestAnimationFrame` loop capped at 50ms delta.
- **3 color variants**: `rgba(251,207,232,0.6)` (light pink), `rgba(244,114,182,0.4)` (medium pink), `rgba(249,168,212,0.5)` (warm pink).

### `src/components/ProjectModal.astro`
```
Path: src/components/ProjectModal.astro
Used in: projects.astro (project catalog page)
Render: Static HTML shell; JS populates at runtime
```
- **Static shell**: single `<div id="project-modal">` in the DOM. Hidden by default (`opacity-0 pointer-events-none`). JS toggles `.is-open` class to reveal.
- **ARIA**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`, `aria-describedby="modal-desc"`, `aria-hidden="true"`.
- **Card sections**: close button (X), title, description, features bullet list, tech stack tags, Live Demo + Source Code action buttons.
- **Populated from card `data-*` attrs**: `data-title`, `data-description`, `data-tags` (JSON), `data-features` (JSON), `data-live-url`, `data-source-url`.
- **Animations**: overlay fades + backdrop-blurs in; card scales from 0.95→1.0 with translateY(0).
- **Scrollbar**: thin pink-tinted WebKit scrollbar for overflow content.
- **Dark mode**: full `dark:` prefixed variants on all elements.
- **SSR props**: accepts `initialLiveUrl`/`initialSourceUrl` for crawlable `<a>` href fallbacks (passed from index.astro and projects.astro).

### `src/components/TraceArt.astro`
```
Path: src/components/TraceArt.astro
Used in: Not imported in any layout/page (present but unused)
```
- **Decorative SVG layer**: 4 inline cat silhouettes (sitting, walking, curled, stretching), 3 cubic-bezier contour line clusters, and an SVG paper grain texture via `feTurbulence` filter
- **Adaptive styling**: pink-tinted strokes via CSS variables, dark/light mode awareness
- **Status**: currently present in source tree but **not imported** by `BaseLayout.astro` or any page

### `src/components/ClickEffects.astro`
```
Path: src/components/ClickEffects.astro
Used in: BaseLayout.astro (every page)
Position: fixed inset-0, z-[9999], pointer-events-none
```
- **Purpose**: Decorative global pointer feedback matching the Light Sakura Neko theme.
- **Overlay element**: `<div id="click-effects-layer" aria-hidden="true">`, fixed to the viewport with `contain: layout paint style`.
- **Event hook**: Inline script listens for `window.pointerdown` with `{ passive: true }`.
- **Effect per click**:
  - 1 translucent neko paw ripple centered at `clientX/clientY`.
  - 4-6 tiny sakura petals bursting radially from the click origin.
- **Motion implementation**:
  - CSS keyframes driven by per-particle custom properties (`--x`, `--y`, `--dx`, `--dy`, `--spin`, `--scale`, `--duration`).
  - Paw ripple scales `0.4 → 1.2` and fades over 600ms using `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Petals use randomized distance, drift, lift, rotation, scale, color, and duration.
- **Performance**:
  - Particles are batched in a `DocumentFragment`.
  - Each node removes itself on `animationend`, with a timeout fallback.
  - Hard cap of 50 active particles; oldest nodes are pruned first.
- **Accessibility / device handling**:
  - Container and particles use `aria-hidden="true"`.
  - No effect is spawned for `prefers-reduced-motion: reduce`.
  - Disabled on coarse/touch pointers to avoid unnecessary CPU work and tap-scroll interference.

### `src/components/ProjectGrid.astro`
```
Path: src/components/ProjectGrid.astro
Used in: index.astro (homepage only)
Render: Server-side (Astro component)
```
- **Data**: an array of 3 hardcoded project objects, each with `{ title, description, tags[] }`.
  - Sorting Visualizer (React, TypeScript, Algorithms)
  - C++ Task Organizer (C++, CMake, SQLite)
  - Portfolio Web App (Astro, Tailwind CSS, TypeScript)
- **Layout**: responsive grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- **Each card**:
  - Wrapper `<div>` with `.project-card-hover .group` for hover state.
  - **Cat-ear SVGs** (`.card-ear`): absolutely positioned above the card, hidden by default, appear on group hover via `opacity-0`→`opacity-100`. Wiggle at 4.8s intervals, speed up to 1.6s on hover.
  - Glass card body: `rounded-2xl border-2 border-pink-200 bg-white/70 backdrop-blur-md p-6`.
  - Title (`h3`), description (`p`), tag pills (`span` with `rounded-full bg-pink-100 text-pink-700`).
  - Hover effects: `group-hover:shadow-xl group-hover:shadow-pink-300/30`, no translate/scale on the card itself (unlike `/projects` page).
- **"View All Projects" button**: `<a href="/projects">` with `.whisker-group`, pink pill style, arrow SVG icon.
- **Section wrapper**: `class="reveal opacity-0 translate-y-8 transition-all duration-1000 ease-out"` with `id="projects"`.

### `src/components/AboutMe.astro`
```
Path: src/components/AboutMe.astro
Used in: index.astro (homepage only)
```
- **Two-column layout** (`grid grid-cols-1 lg:grid-cols-2`).
- **Left column**:
  - Mascot image (`/mascot.png`) in a `w-32 h-32 rounded-full p-1 bg-pink-500` wrapper with `animate-pulse` and a `shadow-[0_0_30px_rgba(236,72,153,0.4)]` glow.
  - "About Me" heading (`h2`).
  - Two biography paragraphs:
    - P1: "I'm a developer with a strong foundation in computer science and technical mathematics..."
    - P2: "Currently exploring modern web ecosystems — from static site generation with Astro to real-time systems in Node.js..."
- **Right column**:
  - A glass card with `.whisker-group` class and cat-ear SVGs (`.stack-ear`) that wiggle.
  - "Technical Stack" heading.
  - 10 skill pills in a flex-wrap container: `C++`, `Node.js`, `Astro`, `Tailwind`, `Git`, `Linux`, `TypeScript`, `Python`, `PostgreSQL`, `Docker`.
  - Each pill: `bg-pink-100 text-pink-700 rounded-full px-4 py-2 text-sm border border-pink-200`.
  - Hover effects on the card: `group-hover:shadow-xl group-hover:shadow-pink-300/30`, slight scale up.
- **Cat-ear keyframes**: `stackEarWiggleLeft` / `stackEarWiggleRight` at 4.8s, speed up to 1.8s on hover.
- **Section wrapper**: `.reveal` class for scroll animation.

### `src/components/Contact.astro`
```
Path: src/components/Contact.astro
Used in: index.astro (homepage only)
```
- **Glass card**: `bg-white/70 backdrop-blur-md border-2 border-pink-200 rounded-2xl` with cat-ear SVGs on hover (`hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl hover:shadow-pink-300/30`).
- **Contact form** (`<form id="contact-form">`): 4 inputs (Name, Email, Subject, Message) with glassmorphism styling, left-aligned decoration SVGs, and semi-transparent paw-print ornaments inside the right corners.
- **Playful labels**: "Your Human Name", "Return Mailbox", "Topic of Gossip", "Your Scroll of Text".
- **Validation**: Name ≥2 chars, email regex, message 10–2000 chars. Error messages appear below fields. Character counter on message field.
- **Custom events**: Dispatches `CustomEvent('neko-mascot-watch', { detail: { field, action } })` on focus/blur to trigger Neko chatbot contextual responses.
- **Submit button**: Gradient pink with paw-drift sparkle overlay animation. Shows spinner ("Pouncing mail... 🧶") during submission. Mock 2s async submission.
- **Success state** (`#contact-success`): Hides form, shows imported `yae-miko-tiny.png` (from `src/assets/images/`) at 1.5x scale with `animate-bounce`, congratulatory message, and "Send Another Mail" reset button.

### `src/components/Footer.astro`
```
Path: src/components/Footer.astro
Used in: BaseLayout.astro (controlled by `showFooter` prop, defaults to true)
```
- **Layout**: `flex flex-col sm:flex-row items-center justify-between`.
- **Left**: copyright line with dynamic year via `new Date().getFullYear()`.
- **Right**: GitHub link (`https://github.com`, opens in new tab), Email link (`mailto:vuthihoeurb@gmail.com`).
- **Styling**: `border-t border-pink-200 mt-24 py-8`, links are `text-slate-500 text-sm hover:text-pink-500`.

### `src/components/NekoWidget.astro`
```
Path: src/components/NekoWidget.astro
Used in: BaseLayout.astro (every page)
Position: fixed bottom-8 right-8, z-50
```

This is the most complex component. Here's every detail:

#### Visible States

| State | Trigger | What shows |
|-------|---------|------------|
| **Idle (speech bubble)** | Default | Mascot button + speech bubble with idle message. Bubble auto-hides after 4s on first load, then cycles every 20-30s. |
| **Chat open** | Click mascot | Mascot button + 700×360px chat panel. Speech bubble hidden. |
| **Hidden** | Click ✕ close button | Nothing visible. Paw restore button (`#neko-restore`) appears bottom-right. |
| **Restored** | Click 🐾 paw | Widget returns, shows "Welcome back! Nya~" bubble. |

#### DOM Structure

```
neko-restore (hidden button, appears when widget is hidden)
neko-widget (main container)
  └── neko-anchor
       ├── neko-bubble (speech bubble, hidden by default)
       │    ├── neko-bubble-text
       │    └── (tail arrow)
       └── neko-shell
            ├── (glow background div)
            ├── neko-btn (mascot image button)
            └── neko-chat (chat panel, hidden by default)
                 ├── header (shrink-0)
                 │    ├── avatar + name + status
                 │    ├── Reset chat button
                 │    └── Close (×) button (#neko-chat-close)
                 ├── neko-messages (flex-1 min-h-0 overflow-y-auto)
                 │    └── initial bot message
                 ├── quick prompts (shrink-0)
                 │                    └── 9 chat-chip buttons: About, Skills, Projects, Contact, Fun, GitHub, Design, Neko, 🎮 Whack-a-Mole
                 ├── neko-typing (hidden, shrink-0)
                 │    └── 3 bouncing dots
                 └── neko-form (shrink-0)
                      ├── neko-input (text input)
                      └── neko-send (submit button)
```

#### Script Behavior (`<script is:inline>`)

Runs immediately, not deferred. Key behaviors:

1. **LocalStorage keys**:
   - `neko-mascot-hidden` — `"true"` when widget is hidden
   - `neko-mascot-muted` — `"true"` when meow sound is off (sound not implemented, only toggle state stored)

2. **Speech bubble**:
   - **Idle messages** (8 items): "Did you know? Cats sleep for 70% of their lives...", "Meow~ I smell fresh code!", etc. Randomly picked every 20-30s via `queueIdleBubble()`.
   - **Contextual messages**: uses IntersectionObserver on `section, #contact, #projects, #project-grid, #about` — when a section scrolls into view (threshold 0.35), shows related message (e.g., "Check out my cool code!" for projects).
   - **Navbar hover**: `mouseenter` listener on all nav links — if link text includes "project"/"contact"/"about", shows the same contextual messages.
   - Bubble auto-hides after `duration` ms (typically 2500-5000).

3. **Chat panel**:
   - Opening: `openChat()` — sets `isOpen = true`, shows chat, hides bubble, focuses input, scrolls to bottom.
   - Closing: `closeChat()` — sets `isOpen = false`, hides chat, hides close button.
   - `renderMessage(text, role)`: creates a message bubble (`div.flex.justify-start|end` > `span`). User messages: right-aligned, `bg-pink-500 text-white`. Bot messages: left-aligned, `bg-white text-slate-800 border border-pink-100`.
   - `seedConversation()`: clears messages, adds initial bot greeting.
   - `resetConversation()`: same as seed, focuses input.

4. **Typing indicator**:
   - `showTyping()`: removes `.hidden` from `#neko-typing`.
   - `hideTyping()`: adds `.hidden` back.
   - On user input: typing shows → 600ms delay → bot reply renders → typing hides.

5. **Q&A system**:
   - `answers` object maps to keywords:
     - `who` → "I'm the Neko mascot for this portfolio..."
     - `skills` → "I code in JavaScript, CSS, and Astro! Nya~"
     - `hire` → "Send an email! Let's build something fun."
     - `joke` → "Why did the cat sit on the computer? To keep an eye on the mouse!"
   - `replyFor(text)`: lowercases input, checks for substrings `who/skills|code|stack/hire|work|contact/joke/hello|hi|hey`. Falls back to random `fallbackReplies`.
   - Chips trigger `respond(chip.textContent)`. Form submit triggers `respond(input.value)`.

6. **Hide/Restore**:
   - `hideWidget()`: sets `localStorage.neko-mascot-hidden = 'true'`, hides widget, shows restore button.
   - `restoreWidget()`: sets `localStorage.neko-mascot-hidden = 'false'`, shows widget, hides restore button, shows welcome-back bubble.
   - On page load: checks localStorage — if hidden, widget starts hidden and restore button visible.

7. **Auto-scroll**:
   - Two `MutationObserver` instances watch `#neko-messages` — one on `childList + subtree` for new bubbles, another (duplicate) with the same config.
   - `scrollMessagesToBottom(behavior)`: sets `scrollTop = scrollHeight`, optionally uses `scrollTo({ behavior: 'smooth' })`.

8. **Meow toggle button**:
   - A small button added dynamically after the mascot button: "Meow on" / "Muted". Toggles `localStorage.neko-mascot-muted`. Sound playback not actually implemented.

#### Styling

- **Chat scrollbar**: custom WebKit scrollbar (6px wide, pink thumb (`rgba(244,114,182,0.6)`), transparent track). Firefox fallback: `scrollbar-color: rgba(244,114,182,0.6) transparent; scrollbar-width: thin`.
- **Animations**:
  - `animate-bounce` on typing indicator dots (staggered `animation-delay` at 0ms, 150ms, 300ms)
  - Hover scale on mascot button (`hover:scale-110 hover:-rotate-3`)
  - Glow div background expands on hover (`group-hover:scale-110`)

#### Dark Mode Support

Nearly everything has `.dark:` variants:
- Chat panel: `dark:bg-slate-950/80 dark:text-pink-100`
- Borders: `dark:border-pink-900/60`
- Input: `dark:bg-slate-900/80 dark:text-pink-100`
- Mascot glow: `dark:shadow-[0_0_20px_rgba(244,114,182,0.35)] dark:drop-shadow-[0_0_12px_rgba(244,114,182,0.5)]`

---

## Layout (`src/layouts/BaseLayout.astro`)

```
Path: src/layouts/BaseLayout.astro
Used by: index.astro, projects.astro
```

- **Imports**: `global.css`, `Background`, `Footer`, `Navbar`, `NekoWidget`, `SakuraCanvas`, `ClickEffects`.
- **Props**: `title` (default `'Portfolio'`), `showFooter` (default `true`).
- **HTML structure**:
  ```html
  <html lang="en" class="scroll-smooth">
    <head>...meta, title, popIn/dropIn keyframes...</head>
    <body class="min-h-screen bg-pink-50 text-slate-900">
      <Background />
      <SakuraCanvas />
      <ClickEffects />
      <NekoWidget />
      <Navbar />
      <slot />  <!-- page content goes here -->
      {showFooter && <Footer />}
    </body>
  </html>
  ```
- **Global keyframes defined in `<style>`**:
  - `popIn`: 0.6s cubic-bezier(0.16, 1, 0.3, 1) — opacity 0→1, scale 0.95→1, translateY 10→0.
  - `dropIn`: 0.8s cubic-bezier(0.16, 1, 0.3, 1) — opacity 0→1, translateY -100%→0.

---

## Styling (`src/styles/global.css`)

```
Path: src/styles/global.css
```

### Base
```css
@import "tailwindcss";
```

### Dark Mode Variables

| Variable | `:root` (light) | `.dark` |
|----------|----------------|--------|
| `--bg-page` | `#fdf2f8` | `#0f172a` |
| `--bg-glass` | `rgba(255,255,255,0.7)` | `rgba(30,41,59,0.75)` |
| `--bg-glass-2` | `rgba(255,255,255,0.8)` | `rgba(30,41,59,0.85)` |
| `--border-pink` | `#fbcfe8` | `#334155` |
| `--text-primary` | `#0f172a` | `#f1f5f9` |
| `--text-secondary` | `#475569` | `#94a3b8` |
| `--whisker-color` | `#f9a8d4` | `#f472b6` |

These variables are applied via `!important` overrides on Tailwind utility classes (e.g., `.bg-pink-50 { background-color: var(--bg-page) !important; }`).

### Cat Whiskers

- **Selector**: `.whisker-group::before` and `.whisker-group::after`.
- **Position**: `absolute`, `top: 50%`, `transform: translateY(-50%)`.
- **Default state**: `opacity: 0`.
- **Hover state**: `opacity: 1`, translateX(-2px/+2px), scale(1.03), glowing drop-shadow.
- **Before (left whiskers)**: `right: 100%; margin-right: -6px`. SVG data URI with 3 curved lines + 1 dot.
- **After (right whiskers)**: `left: 100%; margin-left: -6px`. SVG data URI (mirrored).
- **Dimensions**: 60px × 28px each.
- **Z-index**: 80 (default), 60 (hover) — ensures whiskers render above parent.

### Scroll Reveal

- `.reveal` class: `transition: opacity 1s ease-out, transform 1s ease-out !important`.
- Initial state (set inline in HTML): `opacity-0 translate-y-8`.
- Visible state (set by JS): `opacity-100 translate-y-0`.

### Sakura Pause

```css
.sakura-paused #sakura-canvas { display: none !important; }
```

### Card/Stack Ear Keyframes

All defined globally, shared across components:
- `cardEarWiggleLeft` / `cardEarWiggleRight` (4.8s, speed up to 1.6s on `.project-card-hover:hover`)
- `stackEarWiggleLeft` / `stackEarWiggleRight` (4.8s, speed up to 1.8s on `.group:hover`)

---

## Tag Filtering — Detailed Mechanics

Located in `src/pages/projects.astro` `<script>` block.

### Data Flow
1. Projects are defined as a JS array in the frontmatter (`---` block) with `{ title, description, tags[] }`.
2. On build, Astro serializes the data into a hidden `<div id="pjdata">` via `data-projects` and `data-tags` JSON attributes.
3. On the client, the script parses the JSON and dynamically creates filter buttons for each unique tag (26 tags total).

### Filter Logic
```javascript
let activeTags = new Set();

function filterProjects(tag) {
  if (tag === 'all') {
    activeTags.clear();
  } else if (activeTags.has(tag)) {
    activeTags.delete(tag);  // toggle off
  } else {
    activeTags.add(tag);     // toggle on
  }
  // "All" is active only when activeTags is empty
  // Each tag button is active if it's in the set
  // Cards are visible if activeTags is empty OR any active tag matches
}
```

### FLIP Animation
```
1. Record bounding rects of all visible cards BEFORE DOM change
2. Apply visibility changes (display: none for filtered-out cards)
3. On next animation frame, record new rects
4. Calculate delta (dx, dy) for each card
5. Apply translate(dx, dy) to teleport to old position
6. On next animation frame, remove translate — CSS transition animates the movement
7. After 1.2s (matching CSS transition duration), clear inline style
```

### CSS Transition
```css
.project-card {
  transition: opacity 0.3s ease, transform 0.3s ease, translate 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
```

The `cubic-bezier(0.16, 1, 0.3, 1)` creates a "pop-out" easing — starts fast, overshoots slightly, settles smoothly.

---

## Source Assets (`src/assets/images/`)

All images moved from `public/` to `src/assets/images/` for Astro `<Image />` optimization (automatic WebP conversion, responsive sizing).

| File | Size | Purpose | Used by |
|------|------|---------|---------|
| `mascot.png` | 82 KB | Legacy kitsune/neko mascot | `AboutMe.astro` (bio card, `loading="lazy"`) |
| `yae-mico-maid.png` | 465 KB | Primary maid neko mascot | `NekoWidget.astro` (button avatar `loading="eager"`, chat header `loading="lazy"`) |
| `yae-miko-chibi.jpg` | — | Chibi avatar | `index.astro` (hero code card, `loading="eager"`) |
| `yae-miko-tiny.png` | — | Tiny happy mascot | `Contact.astro` (success state, `loading="lazy"`) |

---

## Public Assets (`public/`)

| File | Size | Purpose | Used by |
|------|------|---------|---------|
| `favicon.ico` | 655 B | Browser tab icon (fallback) | All pages |
| `favicon.svg` | 749 B | Browser tab icon (modern) | All pages (`<link rel="icon" type="image/svg+xml">`) |

---

## Dependencies (`package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `astro` | `^7.0.6` | SSG with hybrid output, `.astro` component system |
| `@astrojs/vercel` | `^11.0.2` | Vercel serverless adapter |
| `@vercel/speed-insights` | `^2.0.0` | Vercel real-user performance metrics |
| `tailwindcss` | `^4.3.0` | Utility-first CSS framework (v4, no config file needed) |
| `@tailwindcss/vite` | `^4.3.0` | Tailwind v4 Vite plugin (imported in `astro.config.mjs`) |

### `astro.config.mjs`
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
Uses `output: 'server'` with `@astrojs/vercel` adapter for hybrid rendering (static pages + serverless API). A postbuild script patches `.vc-config.json` to force `nodejs22.x` runtime for Vercel compatibility.

---

## Project Rules (`.clinerules`)

```
Strictly use a Light Sakura Neko aesthetic. The background must be clean white or very soft pastel pink.
Glassmorphism should use milky white translucency (e.g., bg-white/60).
Accents and buttons should be bright Sakura pink.
Text must be dark (e.g., text-slate-900) for readability.
```

---

## Common Questions

**Q: Why are there two mascot images?**
A: `mascot.png` is the original (used in the About Me bio card with a pulsing glow border). `yae-mico-maid.png` is the newer, higher-detail maid outfit version used in the Neko chatbot widget.

**Q: How do I add a new project?**
A: Add an object `{ title, description, tags[] }` to the `allProjects` array in `src/pages/projects.astro`. The tags and filter buttons auto-generate. Also add to the `projects` array in `src/components/ProjectGrid.astro` if you want it featured on the homepage (max 3 recommended).

**Q: How do I change the email?**
A: Two places: `src/components/Contact.astro` (Web3Forms API endpoint, no hardcoded display email) and `src/components/Footer.astro` (mailto link `vuthihoeurb@gmail.com`).

**Q: How do I disable sakura petals by default?**
A: Set `localStorage.sakura = "off"` default in `SakuraCanvas.astro` constructor or `Navbar.astro` script.

**Q: Why does the chat not scroll?**
A: The fix was to use `flex-1 min-h-0 overflow-y-auto` on the messages container and ensure no ancestor has `overflow: hidden` or `overflow: visible !important`. See `global.css` — the global `div { overflow: visible !important }` was removed.

**Q: How do the cat ears wiggle?**
A: SVG elements with class `.hero-ear` / `.card-ear` / `.stack-ear` have CSS `animation: earWiggleLeft/Right 4.5-4.8s ease-in-out infinite`. On hover (`.group:hover` or `.project-card-hover:hover`), `animation-duration` reduces to ~1.6-1.7s, making them wiggle faster.
