# Service — Tailwind Styling

**File:** `src/styles/global.css` · `tailwindcss` (npm)  
**Links to:** [[architecture]] §7 (Design Token System), [[service - Astro Build Pipeline]]

---

## Purpose

Provides the utility-first CSS engine and design token layer. All visual styling (glassmorphism, cat-ear animations, dark mode, whisker pseudo-elements) flows through this service.

## Entry Point

```css
/* src/styles/global.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

## Custom Additions

1. **CSS Custom Properties** for light/dark theming:
   - `--bg-page` — page background (`#fdf2f8` light / `#0f172a` dark)
   - `--bg-glass` — glass card translucency
   - `--border-pink` — all component borders
   - `--text-primary` / `--text-secondary` — text colors
   - `--whisker-color` — cat whisker SVG stroke

2. **Cat-ear keyframes** (cardEarWiggleLeft, cardEarWiggleRight, stackEarWiggleLeft, stackEarWiggleRight) — shared across ProjectGrid, AboutMe, Contact, Hero

3. **Whisker pseudo-elements** — `.whisker-group::before` / `::after` with inline SVG data URIs, used by all interactive cards

4. **Scroll reveal** — `.reveal` class for `IntersectionObserver`-driven fade-in

5. **Sakura pause** — `.sakura-paused #sakura-canvas { display: none !important; }`

## Dark Mode Configuration

Two layers work together:

1. **CSS Custom Properties** on `:root` and `.dark` — for colors that can't be expressed via Tailwind utilities alone (glass translucency, whisker SVG strokes).

2. **Tailwind v4 class-based `dark:` variant** — configured via:
   ```css
   @custom-variant dark (&:where(.dark, .dark *));
   ```
   Without this line, Tailwind v4 defaults to `@media (prefers-color-scheme: dark)`, which ignores the `.dark` class toggled by the navbar button. With it, all `dark:` utility classes (e.g., `dark:bg-slate-900/90`, `dark:text-pink-50`) activate when `.dark` is present on an ancestor element.

## Dark Mode Override Pattern

Tailwind classes are overridden with `!important` to respect CSS variables:
```css
.bg-white\/70 { background-color: var(--bg-glass) !important; }
.border-pink-200 { border-color: var(--border-pink) !important; }
```

## Depends On

- [[service - Astro Build Pipeline]] — provides the `@tailwindcss/vite` plugin

## Consumed By

- Every `.astro` component in the project
