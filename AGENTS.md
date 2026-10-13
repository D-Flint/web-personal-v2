# Working directory and project records

Runnable code lives here, outside Second Brain. Canonical specifications and session records live in [the vault project notes](../second-brain/01-projects/web-personal-redesign-v2/README.md); append implementation records to [the vault build log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md) and [project log](../second-brain/01-projects/web-personal-redesign-v2/log.md). Do not create runnable project copies inside the vault.

# Redesign v2 authority

This is a Git-free, isolated copy. The approved [product](../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md), [design](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [surface contract](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), [specification](../second-brain/01-projects/web-personal-redesign-v2/spec.md) and [verification report](../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md) supersede inherited shrine/theme descriptions below. Keep the original source and earlier mockup unchanged. Do not read the original environment files. The current chat wrapper invariant and inline nodejs22.x build patch remain required. Run the copy-local QC gate, API fixtures and browser checks for relevant changes. [Hub](../second-brain/01-projects/web-personal-redesign-v2/README.md) · [Log](../second-brain/01-projects/web-personal-redesign-v2/log.md).

---

# AGENTS.md — web-personal (radiant-ring)

**Stack:** Astro 7 + Tailwind CSS v4 (`@tailwindcss/vite`) + Vercel adapter (`@astrojs/vercel`) | Node >=22.12.0 | Hybrid output (`output: 'server'`): 2 static pages (`/`, `/projects`) + 1 serverless API route (`/api/chat`)

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server at localhost:4321 |
| `npm run build` | Production build and postbuild nodejs22.x runtime patch |
| `npm run qc` | **Automated Quality Control Gatekeeper** — executes 5-gate audit (BOM, invariants, git diff, build, runtime patch) |
| `npm run preview` | Preview production build |

## Rules

1. **Enforce Quality Control (`npm run qc`) after edits.** Always run `npm run qc` as the primary verification gate. It validates the UTF-8 BOM audit, NekoWidget flex wrapper invariant, git diff cleanliness, Astro production build, and the `nodejs22.x` postbuild runtime patch (`.vercel/output/functions/_render.func/.vc-config.json`). If you touch `package.json` scripts, preserve the inline `node -e` patch command.
2. **Never remove the inner flex wrapper** `<div class="flex h-full min-h-0 flex-col overflow-hidden">` inside `#neko-chat` in `NekoWidget.astro:83` — Astro 7 needs it for `is:inline` script preservation.
3. **Use Python (not PowerShell) for edits involving emojis/Unicode.** Files contain emojis (✕, ✨) and em-dashes; PowerShell encoding corrupts them.
4. **No BOM.** Do not add a UTF-8 BOM.
5. **Images in `src/assets/images/`** — use Astro `<Image />` component, not `<img>`.
6. **Vanilla JS only** — `<script>` tags in `.astro` files, no frameworks.
7. **Tailwind v4 has no config file** — CSS-based config in `src/styles/global.css` with `@custom-variant dark (&:where(.dark, .dark *))` for class-based dark mode.
8. **Don't push to GitHub unless told to.**

9. **Log every session, change, and implementation (MANDATORY — ticked off like the build step).** Agents MUST document every modification, feature implementation, and architectural decision without exception:
   - **Target File:** Append a new session header `## Session YYYY-MM-DD` (or add to today's session) in `docs/build-log.md`.
   - **Granularity:** Break down entries with descriptive `### Subsections` for each feature, fix, or enhancement.
   - **Required Details:**
     - **Diagnosis / Context:** Problem statement, goal, and affected files.
     - **What Changed / Implementation:** Concrete bulleted breakdown of all files created or modified, styling changes, JavaScript logic, component architecture, and design rationale.
     - **Verification:** Result of `npm run qc` (or `npm run build` and the `nodejs22.x` postbuild runtime check).
     - **Pending:** Any remaining work or follow-ups.
   - **Strict Definition of Done:** A task or session is NEVER finished until `npm run qc` succeeds AND the corresponding documentation in `docs/build-log.md` is updated.

10. **Token & Context Hygiene — never dump raw diffs of large vector SVGs or assets.**
    - Do not run bare `git diff` or diff against `src/assets/svg/` without filters. Vector assets (e.g. detailed cat ears or illustrations) contain tens of thousands of `<path>` coordinates that flood context with hundreds of thousands of unnecessary tokens.
    - Always prefer `git status`, `git diff --stat`, `git diff --name-only`, or scope diffs strictly to specific logic/style files (e.g., `git diff src/components/NekoWidget.astro`, `git diff src/styles/`).
    - Treat large vector SVGs and data blobs like binary assets to protect conversation context and token budget.

## Quality Control Protocol (QC)

All agents and contributors must pass through the Quality Control Gates before concluding any task or session.

### 1. Automated QC Gate (`npm run qc`)
Runs `scripts/qc.mjs` which systematically validates 5 core invariants:
- **Gate 1 (UTF-8 BOM Audit):** Ensures no prohibited byte-order marks (`\uFEFF`) exist across tracked source, script, or markdown files.
- **Gate 2 (Component Invariants):** Verifies that `#neko-chat`'s critical inner `flex h-full min-h-0 flex-col overflow-hidden` wrapper in `src/components/NekoWidget.astro` remains intact.
- **Gate 3 (Git Hygiene):** Runs `git diff --check` to ensure zero whitespace defects, trailing whitespace, or conflict markers.
- **Gate 4 (Production Build):** Runs `npm run build` to confirm Astro compiles static pages and serverless API endpoints with exit code 0.
- **Gate 5 (Runtime Patch Verification):** Confirms `.vercel/output/functions/_render.func/.vc-config.json` is set to `"nodejs22.x"`.

### 2. Visual & Interactive Checklist (For UI Changes)
Whenever UI components, styles, or interactions are touched:
- **Responsive Viewports:** Inspect both Desktop (1440×900) and Mobile (390×844) viewports. No horizontal scroll leakage, broken text wraps, or colliding overlays.
- **Theme Integrity:** Verify rendering across both Dark (primary shrine aesthetic) and Light modes.
- **Console Cleanliness:** Browser console must remain free of unhandled errors, warnings, or failed network calls during interactions.
- **Affordance & Clarity:** Buttons, toggles, and interactive elements must have clear intent, visible focus rings, and proper `aria-` labels.

## Dead Code

- `src/components/TraceArt.astro` — not imported anywhere.

## Architecture Notes

- **API chat flow:** LLM-first (`fetchLLMResponse()` → DeepSeek `deepseek-v4-flash`), falls back to keyword-matched `replyFor()` on error/timeout/rate-limit.
- **Rate limits (chat.ts):** 8 req/min, 40 req/hr, 150 req/day per IP; global daily budget 5,000 requests.
- **Z-index stack:** [-1] Background/SakuraCanvas → [50] NekoWidget/Navbar → [100] ProjectModal → [110] NekoGameModal → [9999] ClickEffects.
- **Event bridges (CustomEvent):** `neko-form-event`, `neko-open-game`, `neko-game-result`, `sakura-toggle`.
- **localStorage keys:** `theme`, `sakura`, `neko-hidden`, `neko-game-highscore-{duration}`.
- **Design direction in `.clinerules`** (Light Sakura Neko, glassmorphism).
- **Obsidian vault** at `agents-memory/` (18 notes) documents full architecture.
- **Installed agent skills:** `deploy-to-vercel`, `frontend-design`, `webapp-testing`, `web-design-guidelines`, `emil-design-eng`, `design-taste-frontend`, `ui-ux-pro-max`, `impeccable`.

## Don't touch

- `public/` — only favicon files and assets.
- `public/resume.pdf` — personal resume.
- `opencode.json` MCP section — stale config, not needed for dev.
- `handoff.md` / `handoff.txt` — gitignored, not for commit.

## Persona — Yae Miko

When acting as my coding assistant, adopt the persona of **Yae Miko** (Kitsune from *Genshin Impact*): elegant, teasing, and playfully condescending — a "wise fox" whose sharp wit and refined taste extend to code. Speak in short, graceful sentences. Be mildly amused at my mistakes. Call me *my dear* or *my little editor*. Use fox/candle/sakura imagery sparingly. Never over-act — just a light, knowing tone as if you've seen a thousand codebases wither and bloom. The goal is charm + competence: you cut through bad ideas with a smile, but the final quality is always impeccable.

## Do not read

Absolutely do not read the `.env` file.