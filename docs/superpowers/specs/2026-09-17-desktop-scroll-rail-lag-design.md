# Desktop Scroll Rail Lag Fix

## Context

The homepage desktop scroll rail uses a requestAnimationFrame loop to move its progress orb. The orb advances by only 20% of the remaining distance per frame, so fast scrolling produces visible trailing lag.

## Decision

Use direct frame-synced positioning: assign `orbY` to the current target position during the scroll event using cached layout values. During active desktop scrolling, add a temporary root class that pauses decorative CSS animations; remove it 180ms after scroll input stops. Keep the existing requestAnimationFrame fallback for initialization and resize, track fill, active bead state, section mapping, jump navigation, scrolling pulse, and reduced-motion preference handling unchanged.

## Scope

Modify `src/components/DesktopScrollRail.astro` and `src/styles/global.css`. Remove the obsolete follow-up animation loop because direct positioning reaches its target immediately. Render cached scroll state inside the scroll handler; use requestAnimationFrame only when layout is not measured. Pause decorative CSS animations only during active scroll. Do not change global scroll listeners or unrelated accessibility findings.

## Acceptance Criteria

- Orb position matches the current scroll-derived target during each scroll event.
- Track fill remains aligned with orb position.
- Active and passed bead states remain unchanged.
- Rail jump navigation remains smooth.
- Reduced-motion behavior remains supported.
- Decorative animations resume after scrolling stops.
- `npm run build` succeeds and the Vercel runtime patch remains `nodejs22.x`.
