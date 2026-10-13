# Contact Button Reference Design

## Intent

Apply the supplied sakura-night ribbon treatment to the contact section's form submit button while preserving the existing form behavior and loading state.

## Design

- Keep `#contact-submit` as the only interactive control and preserve its existing IDs used by the vanilla submission script.
- Replace the current pill treatment with a compact clipped plum ribbon that echoes the reference image without becoming a second section banner.
- Treat the reference's proportions as hard constraints: approximately 42rem maximum width, 4.5rem maximum height on desktop, and a smaller 3.75rem mobile height.
- Use the existing `sakuraIcon` Astro image as a circular left seal and retain an inline SVG paper-plane mark on the right.
- Keep the label centered independently of the two decorative marks so the composition remains balanced at desktop and mobile widths.
- Use CSS pseudo-elements and component-local styles for the irregular ribbon silhouette, nested borders, edge glints, radial glow, hover lift, and the inner seal treatment.
- Remove the button's dependency on the navbar background artwork; no new image asset is needed.

### Reference correction

The initial implementation drifted from the supplied image by using an oversized `max-w-4xl` plaque with a tall banner-like height and a generic hexagonal silhouette. The corrected implementation keeps the ornament concentrated at the edges and lets the label remain the visual focus.

## Interaction and accessibility

- Preserve the existing `contact-submit-text` and `contact-submit-spinner` state hooks.
- Keep hover and active feedback subtle, provide a visible keyboard focus ring, and disable decorative motion when `prefers-reduced-motion` is enabled.
- The decorative seal and paper plane remain `aria-hidden`; the button's accessible name remains `Send Message` or the existing loading text.

## Verification

- Run `npm run build` after the component and documentation edits.
- Confirm `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- Run `git diff --check`.

## Scope

Only `src/components/Contact.astro`, this design specification, and the required `docs/build-log.md` session entry are changed. Navbar contact links, form logic, API behavior, and public assets are untouched.
