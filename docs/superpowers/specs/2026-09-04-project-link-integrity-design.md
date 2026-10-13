# Project Link Integrity Design

## Goal

Make every project action truthful and useful. A visitor should never click a control labelled as a demo or source-code destination and arrive at a generic profile page.

## Verified Source Inventory

The public `D-Flint` repository inventory currently exposes four repositories: `Documentations`, `Project-Yae-Miko`, `SETEC`, and `Guide-On-Self-Hosting-n8n`. Their public metadata and file trees do not provide a sufficiently exact match for any catalogue entry. The current site's Git remote is `D-Flint/web-personal`, which is not exposed by the public repository inventory, so it must be treated as private.

The only confirmed external project destination is the deployed Portfolio Website at `https://hoeurbvuthi.site/`.

## Chosen Approach

Use optional project links and render an action only when its destination is verified and project-specific.

- `liveUrl` and `sourceUrl` become optional project fields.
- Remove the generic `https://github.com/D-Flint` fallback from every project entry.
- Preserve the Portfolio Website's verified live destination.
- Do not infer a mapping from a vaguely related repository name or folder.
- Keep the internal `View Details` interaction for every project.

## Card Behavior

Project cards retain their current shrine-glass composition and domain palette.

- A verified demo renders a compact `Demo` action.
- A verified public repository renders a compact `Code` action.
- When neither exists, the external-action group is omitted and `View Details` remains the sole call to action.
- The footer layout must close the empty space gracefully rather than displaying disabled or placeholder buttons.

This keeps the visual language intact while removing misleading affordances.

## Modal Behavior

The project modal must derive availability from the selected card instead of assuming every project is live or open source.

- Show `Live Demo` only when a verified `liveUrl` exists.
- Show `Source Code` only when a verified `sourceUrl` exists.
- Keep `Share` available; when no external URL exists, it shares the current portfolio page.
- Status badge states:
  - verified demo: `Live Demo Ready`;
  - verified source only: `Source Available`;
  - no external destination: `Portfolio Overview`.
- Access metadata states:
  - verified public source: `Public Repository`;
  - verified demo only: `Live Experience`;
  - no external destination: `Details Available`.

## Catalogue Summary

Replace the unsupported `100% Open Source / Live` statistic with a truthful derived live-destination count. With the currently verified data, this displays `1 Live Experience`.

## Files in Scope

- `src/pages/projects.astro`
- `src/components/ProjectGrid.astro`
- `src/components/ProjectCard.astro`
- `src/components/ProjectModal.astro`
- `docs/build-log.md`

No unrelated layout, filter, splash, accessibility, or typography work belongs in this implementation.

## Verification

- Run `npm run build` after edits.
- Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.
- In Playwright, inspect both `/` and `/projects` at desktop and mobile widths.
- Confirm no card or modal links to the generic GitHub profile.
- Confirm the Portfolio Website still opens its verified live destination.
- Confirm unmatched projects show no empty or disabled action containers.
- Confirm project details, modal navigation, filtering, and sharing still work.

## Acceptance Criteria

1. Every rendered Demo or Code action has a project-specific URL.
2. No project action uses the generic GitHub profile as a fallback.
3. Projects without verified destinations remain fully readable through `View Details`.
4. The catalogue summary no longer claims all projects are open source or live.
5. Desktop and mobile layouts remain visually balanced.
