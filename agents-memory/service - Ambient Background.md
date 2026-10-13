# Service — Ambient Background

**File:** `src/components/Background.astro` (350 lines)  
**Links to:** [[architecture]] §2.3 (Atmosphere & Decoration)

---

## Purpose

Renders a full-screen fixed background with 5 layers of depth: a slow-rotating conic gradient color wash, five glowing ethereal orbs (3 primary + 2 accent), eight floating glass geometric shapes, and a subtle vignette. Also features mouse-responsive parallax.

---

## Visual Layers

### Layer 1 — Color Wash
- Conic gradient spanning orb colors (pink/rose/fuchsia)
- 60s linear rotation, `blur(120px)`, `mix-blend-mode`
- Opacity: 0.06 (light) / 0.04 (dark)

### Layer 2 — Primary Orbs (3)
| Orb | Pos     | Color | Drift | Morph | Delay |
|-----|---------|-------|-------|-------|-------|
| A   | TL -8%  | Orb 1 | 35s   | 24s   | 0s    |
| B   | R +30%  | Orb 2 | 42s   | 28s   | -7s   |
| C   | BL -10% | Orb 3 | 38s   | 30s   | -14s  |

- 50vw/500px size, `blur(80-90px)`, `mix-blend-mode`
- Organic border-radius morphing via `orb-morph-*` keyframes
- Mouse parallax applied via `transform: translate(calc(var(--px,0)*1px), ...)`

### Layer 3 — Accent Orbs (2, hidden on mobile)
| Orb | Pos    | Color | Drift | Morph | Delay |
|-----|--------|-------|-------|-------|-------|
| D   | TR +5% | Orb 4 | 22s   | 18s   | -5s   |
| E   | BL 40% | Orb 5 | 18s   | 14s   | -11s  |

- 30vw/320px size, `blur(50-55px)`

### Layer 4 — Glass Floaters (8 shapes, hidden on mobile)
- 2 hexagons, 2 circles, 2 diamonds, 2 petals
- `clip-path` for hex/diamond shapes, border-radius for petal
- Glassmorphism: `border: 1px solid var(--shape-border)`, `backdrop-filter: blur(4px)`
- Float animations (`shape-float-1/2/3`) + glow pulse (`shape-glow`)

### Layer 5 — Vignette
- `radial-gradient(ellipse at center, transparent 50%, var(--bg-page) 100%)`
- Subtle dark edge framing

---

## Mouse Parallax

- `pointermove` listener normalizes cursor position to [-18, 18] range
- Updates `--px`/`--py` CSS vars via `requestAnimationFrame`
- Each orb applies different sensitivity multipliers (e.g., `-0.7x`, `1.2x`)
- Disabled on `prefers-reduced-motion: reduce` and on mobile

## Performance

- **Cost:** GPU-composited CSS + 1 rAF for parallax (near-zero when mouse idle)
- **Container:** `fixed inset-0 z-[-1] overflow-hidden pointer-events-none`
- **Mobile:** Accent orbs + floaters hidden; primary orbs shrink to 70vw

## Dependencies

- JS for parallax pointer tracking + rAF loop

## Related

- [[service - Sakura Canvas]] — shares the same z-index layer (-1)
- [[service - Tailwind Styling]] — uses CSS variables for orb colors, blend mode, shape borders
