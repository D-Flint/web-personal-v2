# Project Counter Pill No-Wrap Design

## Goal

Keep the Project Details modal counter, such as `02 / 03`, on one line at narrow viewport widths and align its height with the adjacent navigation buttons without changing its typography, dynamic width, navigation behavior, or surrounding header layout.

## Implementation

Add Tailwind's `whitespace-nowrap` and `shrink-0` utilities to `#modal-counter` in `src/components/ProjectModal.astro`. The first prevents wrapping at the spaces around the slash; the second prevents flexbox from compressing the pill when the header is crowded.

Replace the counter's vertical padding with `inline-flex h-8 items-center justify-center`. This gives it the same 32-pixel height as the previous, next, and close buttons while retaining content-driven width and centered text.

Give the header's two flex groups a guaranteed 8-pixel gutter with `gap-2`. Add `min-w-0` to the label-and-counter group so it can yield available width, and `shrink-0` to the navigation group so its controls retain their intended dimensions. The counter remains non-shrinking within the left group.

No JavaScript, counter formatting, modal navigation, or unrelated responsive styles will change.

## Verification

- Open a project modal at 390 x 844 and confirm the counter renders on one line at the same height as the adjacent controls.
- Confirm at least 8 pixels of visible space separates the counter pill from the previous-project button.
- Confirm the Project Details label and previous, next, and close controls remain usable without horizontal overflow.
- Check the modal header at 1440 x 900 for regressions.
- Run `npm run qc`.
