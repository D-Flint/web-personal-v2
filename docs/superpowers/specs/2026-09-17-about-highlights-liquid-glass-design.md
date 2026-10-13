# About Highlights Liquid Glass

## Context

The About section highlights strip contains Location, Studies, and Interests over the Sakura scenery. Its surface must use the shared liquid-glass treatment while keeping small labels and values readable over changing artwork.

## Design

- Keep `about-highlights-panel` on the existing strip container and build a rose-crystal variation of the shared liquid-glass surface.
- Layer a restrained rose-to-violet refraction gradient over the shared plum fill. Add a single diagonal specular rim and deeper ambient shadow for visible material depth.
- Give each highlight a small floating glass tile. Keep pink separators and add a quiet lift on hover.
- Use uppercase pale-rose labels and near-white values with text shadows for contrast over bright Sakura details.
- Preserve current layout, content, radius, spacing, and responsive behavior.
- Disable decorative sheen and use a solid panel when reduced transparency is requested.

## Verification

Run `npm run build`. Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.
