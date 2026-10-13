# Mobile Projects List View Default

## Diagnosis / Context

The `/projects` archive currently initializes `currentViewMode` to the saved `projects_view_mode` value, or `grid` when no value exists. On a first visit from a mobile viewport, this makes the denser List presentation unavailable as the default even though the archive already has mobile-specific List styling.

## Approved Design

Initialize the archive to `list` whenever the viewport matches the existing mobile breakpoint (`max-width: 767px`, below Tailwind `md` / 768px), regardless of the existing global `projects_view_mode` value. This guarantees that mobile always starts in the compact List presentation, including browsers that previously stored `grid`.

At 768px and wider, preserve the existing behavior: use the saved `projects_view_mode` preference when available and otherwise default to `grid`. Selecting either toggle remains available during the current visit; desktop selections continue to update `projects_view_mode`, while mobile selections are session-only so they cannot overwrite the desktop preference.

## Implementation Scope

- Modify only the view-mode initialization in `src/pages/projects.astro`.
- Use `window.matchMedia('(max-width: 767px)')` to align the mobile override with the List card CSS breakpoint.
- Keep the existing `setViewMode()` call, toggle styling, persistence, filtering, card markup, and responsive layout unchanged.
- Do not add resize listeners: the initial mode is chosen at archive initialization, while an explicit toggle selection remains stable during the session.

## Verification

- Run `npm run build`.
- Verify `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x` after the build.
- Confirm the generated client script chooses List on every mobile initialization and preserves the saved preference on desktop initialization.

## Pending

None.
