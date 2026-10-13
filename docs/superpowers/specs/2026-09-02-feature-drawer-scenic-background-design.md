# Feature Drawer Scenic Background Design

## Goal

Replace the flat dark background of the architectural deep-dive drawer with the supplied `contact-bg-9x16.png` shrine scene, while keeping the drawer content readable and the existing responsive behavior intact.

## Scope

- Modify `src/components/ProjectModal.astro` only.
- Use the existing `src/assets/images/contact-bg-9x16.png` asset through Astro's `<Image />` component.
- Keep the drawer's content, controls, open/close behavior, scroll behavior, and responsive sizing unchanged.

## Visual design

- Add a full-bleed scenic artwork layer behind the drawer content.
- Use a dark top-to-bottom overlay to protect the header, title, and footer areas.
- Use a dark side gradient to improve text contrast while allowing the flowers, fox mask, torii gate, water, and lantern light to remain visible.
- Keep the narrative and specification cards translucent so the artwork contributes atmosphere without overpowering the information.
- Place header, content, and footer above the artwork with explicit stacking order.

## Accessibility and performance

- Mark the artwork decorative with an empty alt attribute.
- Preserve the existing lazy loading, responsive widths, WebP conversion, and asynchronous decoding pattern.
- Do not introduce animation or motion into the background.
- Preserve existing keyboard and focus behavior for drawer controls.

## Verification

- Run `npm run build`.
- Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.
- Check the drawer at mobile, tablet, and desktop widths for artwork visibility and text contrast.

## Pending

- None after implementation and build verification.
