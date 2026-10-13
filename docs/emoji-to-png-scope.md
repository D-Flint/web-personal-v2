# Emoji → PNG sweep (web-personal) — SCOPE DECISION — COMPLETED

> **Status:** DONE — executed 2026-08-14.
> **Decision:** Option ① + ② (interface icons AND game sprites). Chat/persona emoji (③) intentionally left as inline text.
> - Icon set generated via a zero-dependency Node PNG encoder (hand-rolled palette/hit-test icons; tool kept at `Desktop/dashboard/generate-icons.cjs`). PNGs live in `src/assets/images/icons/`.
> - Rendered via Astro `<Image>` for template markup (sakura ×6, paw, gamepad, close ×2, sparkles, wrench); game sprites use inline SVG to match the existing `good`-type paw sprite.
> - Verified: `npm run build` passes; residual glyph scan shows only inline-text emoji (chatbot replies, game instructions, comments).

## Background / rule
Darwin (here "Darling") directed: **"The site currently uses emoji as icon. Change it — use a PNG instead of emoji, and never use emoji as icon ever again."**
This has already been **codified** as an immediate, binding correction in the vault:
- `second-brain/_meta/miko-learning/correction-ledger.md` → "Never use emoji as icons … image assets (PNG/SVG), never emoji pictograms"
- `second-brain/_meta/miko-learning/topics/preferences.md` → corresponding raw entry.

**Already DONE (dashboard):** replaced 🌅/🌙 skincare icons in `Desktop/dashboard/index.html` with generated theme-matched PNGs (`assets/icon-sun.png`, `assets/icon-moon.png`). **This dashboard change is NOT yet committed** to its git repo (plus the `health_tracker_implementation_plan.md` plan is also uncommitted).

## Codebase
Project lives at **`C:\Users\ASUS Rog\Desktop\web-personal`** (Astro + React + Tailwind). Emoji-as-icon work is confined to `src/components/`. The project *already* uses inline `<svg>` for real icons (sun/moon toggle, GitHub, close, external-link), so emoji are the exception, not the norm.

## Inventory — emoji use falls into THREE buckets

### ① Interface icons → REPLACE with PNG (unambiguous)
- `Navbar.astro` — 🌸 sakura toggle button icon, **6 occurrences** (lines 37, 38, 85, 86, 151, 152): desktop/mobile/drawer, each with an on + off variant (`off` uses `opacity-30 grayscale`).
- `NekoWidget.astro` — 🐾 restore-button icon (line 22), inside `<span aria-hidden>`.
- `NekoWidget.astro` — 🎮 "Whack-a-Mole" chip button icon (line 135).
- `ProjectModal.astro` — ✨ (line 120) and 🛠 (line 130) decorative heading icons (`<span aria-hidden>` in `<h3>`).
- `NekoGameModal.astro` — 🐾 title decoration "🐾 Neko's Whack-a-Mole" (line 74).

### ② Game sprites → the Whack-a-Mole game renders its targets AS emoji
- `NekoGameModal.astro`: `target.textContent = '🌸'` (line 428), `'💣'` (line 430), plus paw 🐾; instructions mention 🐾🌸💣 (line 77); "Start Whacking 🐾" (line 123); 🏆 in results (lines 514, ~1100).
- These are **game assets/sprites**, not interface icons, but the same spirit → likely want PNGs.

### ③ Persona/chat text → content, NOT icons (default: leave alone)
- `NekoWidget.astro`: the entire `knowledge`/reply dictionary (~lines 552–622: 🐱☕😸🎨🖥️⚡🔥❤️✍️🧑🏫💼⚛️☁️🗄️🔒📱✏️🧘📚🎧🌍🚀🔌🐱🌀🔤🌈🤝🧹📦📝…) and speech-bubble strings (lines ~1156–1249: "Pouncing your mail! 🧶✨", "Let's chat! 💬").
- Rewriting these changes **Neko's voice/content** — a content change, not an icon swap.

## PENDING — scope decision (Darwin to choose on resume)
The exact question asked (with options) was:
1. **① only** — interface icons (sakura toggle, paw widget button, game chip, heading icons).
2. **① + ②** — interface icons AND whack-a-mole game sprites (paws/sakura/bomb).
3. **① + ② + ③** — everything, including Neko's chat/persona emoji (large content rewrite).
4. **① + ②** + also clean 🏆/decorative emoji in result/status messages.

**Recommended default:** **① + ②** (options 2/4) — kill every actual icon/sprite, keep the chatbot's inline-text voice.

## Resume path (once scope is chosen)
1. Generate theme-matched palettes of PNG icons (same technique used on the dashboard: a small Node `zlib` PNG encoder — signature + IHDR + IDAT + IEND + CRC32 — writes 64×64 RGBA transparent PNGs). Icons needed: sakura 🌸, paw 🐾, game-controller 🎮, sparkles ✨, wrench 🛠 and, if ②, paw/sakura/bomb sprites.
2. Place PNGs under `src/assets/` (or `public/`) and reference via `<img>` / Astro `Image` (note: `NekoWidget.astro` already imports `astro:assets`).
3. Swap each ① icon: for the sakura toggle, keep the on/off state by applying `opacity-30 grayscale` to the `<img>` instead of the span; preserve `aria-hidden`/`aria-label` semantics.
4. If ②: replace `target.textContent='🌸'/'💣'` with `<img>` nodes (or a sprite set), keeping hit-testing consistent.
5. If ③: rewrite the reply/bubble strings without emoji (or with a few chosen PNGs) — only if Darwin picks it; otherwise note as intentionally left.
6. Verify: `npm run build` (Astro), check each page renders, re-run the no-emoji scan on `src/`, commit separately from the dashboard commit.

## Notes / gotchas
- `NekoWidget.astro` is ~1318 lines and **not fully read** during this session — re-scan before/after edits.
- `chat.ts` ⚠ (line context) is a server console warning string, NOT a UI icon — out of scope.
- Docs/README markdown emoji (🌸🌿⚠🎨 etc.) are decorative text, not site icons — out of scope for this task.
