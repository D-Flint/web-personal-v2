---
project: web-personal
status: approved
updated: 2026-08-23
---

# Sakura Petal Streaks — Design

## Goal

Keep the fullscreen sakura canvas rendering bounded, consistently shaped petals over time, including after viewport or device-pixel-ratio changes.

## Diagnosis

`SakuraCanvas.astro` uses the canvas backing-store dimensions (`canvas.width` and `canvas.height`) for simulation coordinates while also applying a device-pixel-ratio transform. That mixes physical bitmap pixels with CSS viewport pixels and can leave recycled particles outside the intended coordinate space after a resize.

## Design

- Store CSS viewport width and height separately from the backing-store dimensions.
- Use CSS dimensions for petal creation, movement bounds, recycling, and clearing.
- Reapply the DPR transform during every resize and clear using CSS coordinates.
- Keep the canvas explicitly fullscreen so its display size and simulation space remain aligned.

## Alternatives

- Disable sakura animation on high-DPR screens: safer but removes the feature for affected users.
- Replace the canvas with DOM particles: easier to inspect but more expensive and broader in scope.

The CSS/backing-dimension separation is the smallest fix that preserves the current visual and performance design.

## Validation

- Run a 30-second Playwright smoke probe at 1900×968 with high sakura density.
- Confirm the canvas remains fullscreen and no particle layer produces streak artifacts.
- Run `npm run build` and verify the Vercel runtime patch remains `nodejs22.x`.
