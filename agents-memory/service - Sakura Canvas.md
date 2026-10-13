# Service — Sakura Canvas

**File:** `src/components/SakuraCanvas.astro` (121 lines)  
**Links to:** [[architecture]] §2.3 (Atmosphere & Decoration), [[service - Theme Toggle]], [[service - Click Effects]]

---

## Purpose

Renders 35 animated sakura (cherry blossom) petals on an HTML5 Canvas element. Petals fall with wind drift, rotation, and seamless recycling — creating the signature atmospheric effect of the Light Sakura Neko theme.

## Lifecycle

```
DOMContentLoaded
  → SakuraSimulation(canvas)
    → resize handler (window resize)
    → sakura-toggle listener
    → if localStorage("sakura") !== "off" → start()
```

## Render Loop

```js
loop = (time) => {
  const delta = Math.min(time - lastTime, 50);  // cap at 50ms
  update(delta);   // physics: position, wind, rotation
  draw();          // clear canvas, draw all 35 petals
  requestAnimationFrame(loop);
};
```

## Petal Physics

Each petal has 9 parameters:
| Param | Range | Role |
|-------|-------|------|
| `x, y` | Full viewport | Position |
| `size` | 6-14 px | Scale |
| `speedY` | 0.4-1.0 | Fall speed |
| `speedX` | 0.2-0.6 | Horizontal oscillation |
| `windDrift` | -0.3–0.3 | Lateral wind force |
| `rotation`, `rotSpeed` | Full circle | Spinning |
| `opacity` | 0.3–0.7 | Translucency |

Petal shape is drawn as a bezier-curve teardrop with a cleft top and center vein line.

## Performance

- **Cost:** ~1-2ms per frame at 60fps
- **Technique:** `requestAnimationFrame`, single canvas, delta-time capped at 50ms
- **Canvas:** `fixed inset-0 pointer-events-none z-[-1]`

## Depends On

- [[service - Theme Toggle]] — listens for `sakura-toggle` CustomEvent to start/stop

## Related

- [[service - Click Effects]] — also spawns petal particles (DOM-based, not canvas)
- [[service - Ambient Background]] — shares the same z-index layer
