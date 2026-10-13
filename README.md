
# web-personal-v2

Project workspace: `/home/flint/web-personal-redesign-v2`. Canonical project information: [Second Brain notes](../second-brain/01-projects/web-personal-redesign-v2/README.md).

# Hoeurb Vuthi — Engineering Field Journal

A complete, isolated Astro redesign copied from the current portfolio source. The original at `/home/flint/Documents/web-personal` and the [earlier mockup](../second-brain/01-projects/web-personal-redesign-mockup/README.md) are preserved. All **20 current project records** remain; the old source incorrectly labelled them as 19.

Review at [localhost:4322](http://localhost:4322). Public deployment is outside this request.

## Run

```sh
npm ci
npm run dev:review
```

The review command keeps Astro in the foreground on 127.0.0.1:4322. Astro 7 detects agent sessions and otherwise starts a background process automatically; a reported startup message alone is insufficient. Verify the actual HTTP response and process before sharing the preview.

## Configuration

Copy [.env.example](.env.example) to a **new** local environment file and configure your own `DEEPSEEK_API_KEY`. Never read or copy the original portfolio’s environment files. No private key is included. `DEEPSEEK_MODEL` defaults to the source’s `deepseek-v4-flash`; model availability must be confirmed with your provider account. Restart the development server after configuring it.

`PUBLIC_WEB3FORMS_ACCESS_KEY` preserves the source’s public form identifier by default. A provider success response is required before displaying success; validation, pending, timeout, network and service failures retain the visitor’s message. Actual inbox delivery is not established by a mocked successful provider response.

## Verification

```sh
npm run qc
npm run test:api
npm run test:physics
npm run test:browser
npm run review:capture
node scripts/capture-motion.mjs
```

Motion recording uses the installed FFmpeg CLI to encode timestamped Chromium screencast frames. Browser checks use Chromium at `/usr/bin/chromium`. Adjust the executable path in [Playwright configuration](playwright.config.ts) on other systems. Browser tests require the development server at port 4322. QC includes the production build and the preserved inline `nodejs22.x` Vercel function patch. The Git-free copy uses a source conflict/changed-file whitespace audit instead of an unrelated parent-vault Git diff.

## Project navigation

- [Product brief](../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md), [design system](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [surface contract](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), [specification](../second-brain/01-projects/web-personal-redesign-v2/spec.md), and [session log](../second-brain/01-projects/web-personal-redesign-v2/log.md).
- [Verification report](../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md), [background motion review](../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/background-motion-review.md), [implementation log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md), and [source/asset index](../second-brain/01-projects/web-personal-redesign-v2/FILE-MAP.md).
- [Original-source hash snapshot](source-snapshot.json), [copy-specific agent instructions](../second-brain/01-projects/web-personal-redesign-v2/AGENTS.md), and [environment template](.env.example).
- [Home](src/pages/index.astro), [journal catalog](src/pages/projects.astro), [404](src/pages/404.astro), and [server chat API](src/pages/api/chat.ts).
- [Project records](src/data/projects.ts), [particle/workbench background](src/components/DraftingField.astro), [hero particles](src/components/HeroParticles.astro), [collision solver](src/utils/backgroundPhysics.mjs), [scroll choreography](src/components/ScrollDrafting.astro), [schematics](src/components/ProjectFigure.astro), [wire geometry](src/utils/draftingGeometry.ts), [contact](src/components/Contact.astro), [assistant](src/components/NekoWidget.astro), and [project details](src/components/ProjectModal.astro).
- [Physics regressions](tests/background-physics.test.mjs), [motion browser regressions](tests/background-motion.spec.ts), [test-only canvas probe](tests/motion-probe.mjs), [motion recording script](scripts/capture-motion.mjs), [desktop motion](.impeccable/review/motion-desktop.webm), [touch motion](.impeccable/review/motion-touch.webm), [browser scenarios](tests/portfolio.spec.ts), [provider stream fixtures](tests/chat-api.test.mjs), [capture script](scripts/capture-review.mjs), and [QC gate](scripts/qc.mjs).

Legacy source components and inherited documentation are retained in this copy as reference, with their historical context clearly separated by the [file map](../second-brain/01-projects/web-personal-redesign-v2/FILE-MAP.md). They do not define the redesigned routes. The separate arcade component was removed, and neither the rendered app nor the current assistant prompt contains arcade triggers or knowledge.

