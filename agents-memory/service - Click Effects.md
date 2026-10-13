# Service — Click Effects

**File:** `src/components/ClickEffects.astro` (304 lines)  
**Links to:** [[architecture]] §2.3 (Atmosphere & Decoration), [[service - Sakura Canvas]]

---

## Purpose

Spawns ephemeral DOM particles on every mouse click: one neko paw-print (radial-gradient ripple) plus 4-6 sakura petals that burst outward. Auto-cleans particles after their animation completes and caps total at 50.

## Particle Types

### Paw Print (`click-paw`)
- 38×34px translucent pink pad with 4 toe beans (CSS `::before`, `::after`, and 3 `<span>` children)
- Scale animates 0.4→1.1 over 600ms
- Random rotation (-16° to 16°)
- Filter drop-shadow for glow

### Sakura Petal (`click-petal`)
- 3 pink shades (randomly selected): light, medium, dark
- Bezier-shaped teardrops with center vein
- Burst outward from click point in a circle (randomized distance 34-82px, lift 8-26px)
- Spin animation (-260° to 260°) over 760-1080ms
- CSS `--*` custom properties drive animation via keyframes

## Lifecycle Management

```js
const maxParticles = 50;

function pruneParticles() {
  while (layer.children.length > maxParticles) {
    layer.firstElementChild?.remove();   // remove oldest
  }
}

function removeAfterAnimation(node, fallbackMs) {
  node.addEventListener("animationend", cleanup, { once: true });
  setTimeout(cleanup, fallbackMs);        // fallback if animationend doesn't fire
}
```

## Constraints

- Skips on `prefers-reduced-motion: reduce`
- Skips on coarse/touch pointers (mobile/tablet)
- Skips non-primary mouse buttons
- Uses `DocumentFragment` for batched DOM insertion
- Layer is `fixed inset-0 pointer-events-none z-9999` — never intercepts clicks

## Depends On

- [[service - Tailwind Styling]] — CSS keyframes (`clickPawRipple`, `clickPetalBurst`) defined in component

## Related

- [[service - Sakura Canvas]] — also renders sakura petals (canvas-based, continuous; this service is DOM-based, burst-on-click)
