
// ──────────────────────────────────────────────────────────────────────────────
//  decrypt.ts — Pure Scramble→Resolve String Function
// ──────────────────────────────────────────────────────────────────────────────
//  Pure functions powering ScrollReveal's decrypt effect. No DOM access.
//  3-stage per-char lifecycle (flicker → slow approach → settle) with a
//  left-to-right wave. Deterministic per (target, progress) via a seeded PRNG
//  so identical progress renders identical frames; the pattern advances with
//  progress, producing the flicker.
// ──────────────────────────────────────────────────────────────────────────────

export const DECRYPT_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~';

/** Fraction of total duration each char animates (shared left-to-right wave window). */
const CHAR_WINDOW = 0.55;

/** Deterministic PRNG (mulberry32) so identical progress renders identical frames. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cubic ease-out: decelerates toward the end for a smoother settle. */
function easeOut(p: number): number {
  return 1 - Math.pow(1 - p, 3);
}

/**
 * Returns the scramble→resolve state of `target` at `progress` (0..1) in a
 * single pass. Produces both the scrambled text and the decrypt frontier
 * (first unresolved index) so the caller doesn't loop twice.
 */
export function scrambleState(
  target: string,
  progress: number,
  charset: string = DECRYPT_CHARSET,
): { text: string; frontier: number } {
  const p = Math.min(1, Math.max(0, progress));
  const ep = easeOut(p);
  const len = target.length;
  if (len === 0) return { text: '', frontier: 0 };
  const step = Math.floor(ep * 60);
  const charLen = charset.length;
  let out = '';
  let frontier = len;
  for (let i = 0; i < len; i++) {
    const ch = target[i];
    if (ch === ' ' || ch === '\n' || ch === '\t') {
      out += ch;
      continue;
    }
    const offset = (i / len) * (1 - CHAR_WINDOW);
    const rawLocal = (ep - offset) / CHAR_WINDOW;
    if (frontier === len && rawLocal < 1) frontier = i;
    const local = rawLocal < 0 ? 0 : rawLocal > 1 ? 1 : rawLocal;
    if (local >= 1) {
      out += ch;
      continue;
    }
    const rand = mulberry32(((i + 1) * 2654435761) ^ ((step + 1) * 40503));
    if (local < 0.5) {
      out += charset[Math.floor(rand() * charLen)];
    } else if (local < 0.75) {
      out +=
        rand() < ((local - 0.5) / 0.25) * 0.6
          ? ch
          : charset[Math.floor(rand() * charLen)];
    } else {
      out += rand() < 0.9 ? ch : charset[Math.floor(rand() * charLen)];
    }
  }
  return { text: out, frontier };
}
