# Service — Neko Chatbot

**File:** `src/components/NekoWidget.astro` (~1300 lines)  
**Server route:** `src/pages/api/chat.ts` — proxies to DeepSeek API  
**Links to:** [[architecture]] §2.5 (Interactive Agents), [[service - Contact Form]], [[service - Scroll Reveal]], [[service - Theme Toggle]]

---

## Purpose

Interactive fixed bottom-right chatbot mascot. Displays an animated avatar (`/yae-mico-maid.png`), cycles idle speech bubbles, and opens a full chat panel with Q&A chips and LLM-first text input. Reacts to Contact form field activity and page section visibility.

## Architecture

### UI Shell (fixed bottom-right, z-50)
- **Avatar button** — 64-80px circle with glowing pink radial gradient + wiggle animation
- **Speech bubble** — Arrow-pointed glass card, auto-hides after configurable ms
- **Chat panel** — 700×360px modal with scrollable message area, input, reset/close buttons (mobile: 70vh max 525px, calc(100vw - 2rem) wide)
- **Restore button** — Small paw-print button shown when widget is hidden

### Chat Logic (LLM-First)

**Response hierarchy (3 tiers):**

1. **Tier 1 — DeepSeek LLM** (always attempted first): `fetchLLMResponse()` sends `conversationHistory` to `POST /api/chat`, which proxies to DeepSeek V4 Flash (`deepseek-v4-flash`) with `stream: true`. Tokens are rendered incrementally into a bot bubble via SSE reader.

2. **Tier 2 — Keyword matching** (`replyFor()`): 60+ PREPARED_CATEGORIES with weighted scoring, word-boundary tokenization, typo tolerance (Levenshtein-1), and follow-up detection. Used as fallback when LLM fails.

3. **Tier 3 — Cat phrases** (`fallbackReplies[]`): ~48 random neko phrases only shown if both LLM and keyword matching fail.

**Timeout:** `AbortController` with 60s timeout on the fetch to `/api/chat` (handles serverless cold starts).

**History:** Last 10 exchanges stored in `conversationHistory[]`. Sent as context to DeepSeek (capped at 6 most recent by the API route).

### API Route (`/api/chat`)

- `prerender = false` — serverless function via `@astrojs/vercel`
- Input validation: rejects messages >500 chars (400)
- Rate limiting per IP: 8 req/min, 40 req/hr, 150 req/day
- Global daily budget: 5,000 requests/day kill-switch
- `max_tokens: 200`
- Streams DeepSeek response as raw text deltas

### Q&A Chips
About, Skills, Projects, Contact, Fun, GitHub, Design, Neko, 🎮 Whack-a-Mole — chip clicks are **free-typed into `respond()`** like any message, so they also go through the LLM (no special shortcut for chips).

### Idle Cycle
- 20-30 second intervals
- Rotates through a pool of ~10 messages (e.g., *"Nya~ you're still here?"*, *"I like your cursor..."*)
- Resets on any user activity (click, input)

### Event Listeners

| Source | Mechanism | Reaction |
|--------|-----------|----------|
| Contact form fields | `CustomEvent("neko-form-event")` | Contextual bubble per field/action |
| Page sections | `IntersectionObserver` (threshold 0.35) | Project → *"Check out my cool code!"*, About → *"I can talk about my stack!"*, Contact → *"Let's chat!"* |
| Nav links mouseenter | Direct DOM listener | Contextual hint per link text |

### State Persistence
- `localStorage("neko-hidden")` — widget visibility
- `localStorage("neko-muted")` — meow sound toggle

## Depends On

- `src/pages/api/chat.ts` — DeepSeek proxy endpoint
- `import.meta.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY` — API key
- [[service - Contact Form]] — receives CustomEvents from form field focus/blur/submit
- [[service - Scroll Reveal]] — shares IntersectionObserver pattern on the same sections
- [[service - Theme Toggle]] — respects dark mode via Tailwind dark: classes
