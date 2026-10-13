# Contact Textbox Gradient Rim Design

## Goal

Replace the message panel's heavy pink double border with a quieter edge that still belongs to the Sakura shrine visual system.

## Approved Direction

Use a single soft rose-to-gold gradient rim. Keep the existing gold corner brackets, but remove the inset pink border that currently makes the panel look boxed in and permanently focused.

## States

- At rest, the gradient rim remains low contrast against the plum writing surface.
- On hover, the rim gains modest clarity without adding a large glow.
- On `:focus-within`, the rose side brightens and a narrow accessible focus halo appears.
- On validation error, the semantic red edge replaces the decorative gradient and the gold corners recede.

## Implementation Boundary

- Modify only the message-panel border and its interaction states in `src/components/Contact.astro`.
- Preserve the textarea layout, footer, character counter, watermark, validation logic, and non-resizable behavior.
- Add no dependencies and do not alter the rest of the contact section.

## Verification

- Run `npm run build`.
- Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.
- Inspect the resting, hover, focus, and error states at desktop and mobile widths when browser tooling is available.
- Confirm the panel retains rounded corners and has no horizontal overflow.
