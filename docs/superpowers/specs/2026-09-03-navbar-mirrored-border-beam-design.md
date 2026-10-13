# Navbar Mirrored Border Beam Design

## Diagnosis / Context

The desktop navbar currently runs a continuous one-way border sweep. It keeps the frame visually busy even when the user is not interacting with it, and the single moving beam lacks the symmetry of the navbar's wide rounded silhouette.

## Approved Design

Replace the always-active desktop sweep with a mirrored twin-beam interaction:

- Keep the existing gradient border calm, with dim beams continuing to move slowly at rest.
- On navbar hover, reveal two matching beams positioned 180 degrees apart.
- Animate the beams around the same rounded perimeter with a 50% phase offset so their movement remains symmetrical.
- Give each beam a white-hot core, a short lavender-pink trail, and a soft bloom.
- Increase brightness and animation speed on hover, then return smoothly to the dim slow idle state when hover ends. The beams never disappear or stop animating outside reduced-motion mode.
- Preserve the mobile chamfered SVG contour, navigation hit targets, active-link motif, and existing navbar entrance/elevation behavior.

## Implementation and Accessibility

The existing SVG perimeter remains the rendering surface. The orbit classes will use a low-opacity 14-second idle animation and smoothly adjust their Web Animation playback rate to the equivalent of a 4.8-second hover animation. The SVG is already pointer-transparent, so hover state will be owned by the interactive navbar wrapper without blocking links. Reduced-motion users will receive only the calm static border and no beam animation.

## Verification

- Run `npm run build` after the implementation.
- Confirm `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- Run `git diff --check`.
- Confirm only the desktop orbit styles change; mobile contour markup and navigation behavior remain intact.

## Pending

None.
