# Contact Night Dispatch Redesign

## Purpose

Rework the home-page contact section so it feels like a memorable communication scene rather than a centered utility form. The visual target is the supplied night-shrine reference: a luminous framed panel, an ornamental communication row, a split form altar, and a ceremonial send action.

## Design

- Keep the existing scenic `contact-bg` crossfader layer as the environmental backdrop.
- Replace the single centered form stack with a wide responsive contact shrine panel.
- Use a compact header area with the existing torii/contact eyebrow, a large serif title, and a short invitation copy.
- Add three evenly weighted communication tiles for GitHub, LinkedIn, and X. GitHub remains functional; the other cards are visual treatments only so no unverified destination is presented as live.
- Arrange the form as a two-column desktop altar: name, email, and subject on the left; message on the right. Collapse to one column on mobile.
- Give the submit action a centered ornamental presentation with a sakura mark, message label, and send icon, while preserving the existing submit IDs and validation flow.
- Keep the success state and reset flow intact, but tune its framing so it belongs to the redesigned panel.

## Visual system

- Palette: deep ink `#09061b`, violet-black glass `#120c2a`, shrine magenta `#ec6aa9`, soft sakura `#f8c4df`, and readable moon-white `#f8f6ff`.
- Use the existing serif/mixed type system and restrained monospace labels for the shrine metadata and tile captions.
- The signature detail is a thin, ornamental frame with corner notches, three shrine channel cards, and a small flower seal centered over its top edge.
- Motion is limited to panel reveal, tile lift/glow on hover, and the existing button/form interactions. Respect reduced motion.

## Component and data behavior

All markup changes stay in `src/components/Contact.astro`. Existing form field IDs, `data-access-key`, validation messages, Web3Forms submission, success state, and reset button remain unchanged. New tiles are presentational except for email and GitHub. No new API or state is introduced.

## Responsive and accessibility behavior

- The panel uses a wide max width on desktop and comfortable horizontal padding on mobile.
- Tile labels and supporting copy remain readable against the scenic background through layered glass and contrast overlays.
- Inputs retain visible focus rings, labels, required indicators, and existing alert semantics.
- Decorative imagery and SVGs remain hidden from assistive technology where appropriate.
- At reduced motion, reveal and hover transforms are disabled while color/focus feedback remains available.

## Verification

- Run `npm run build` after implementation.
- Verify the Vercel runtime patch contains `nodejs22.x`.
- Run `git diff --check`.
- Use the local app with a headless browser at desktop and mobile widths to confirm the new composition renders, the form remains usable, and the success/reset DOM is preserved.

## Scope

Only the home-page contact composition and its component-local styling are in scope. Existing scenic backgrounds, navigation, API behavior, and unrelated working-tree changes remain untouched.
