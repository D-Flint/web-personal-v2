// ──────────────────────────────────────────────────────────────────────────────
//  tags.ts — Grand Narukami Kitsune Tag & Spark Domain Categorization
// ──────────────────────────────────────────────────────────────────────────────

export type TagCategory = 'systems' | 'web' | 'ai';

export function getTagCategory(tag: string): TagCategory {
  const t = tag.toLowerCase().trim();
  if (['c++', 'cmake', 'sqlite', 'linux', 'algorithm', 'algorithms'].includes(t)) {
    return 'systems';
  }
  if (['react', 'astro', 'typescript', 'tailwind css', 'node.js', 'express', 'socket.io', 'chart.js'].includes(t)) {
    return 'web';
  }
  return 'ai';
}

export function getTagSparkClass(tag: string): string {
  const cat = getTagCategory(tag);
  if (cat === 'systems') return 'spark-systems';
  if (cat === 'web') return 'spark-web';
  return 'spark-ai';
}

export function renderTagPillHtml(tag: string, extraClasses = 'px-2.5 py-1 text-xs'): string {
  const sparkClass = getTagSparkClass(tag);
  return `<span class="tag-pill ${extraClasses}">` +
    `<span class="tag-bracket tag-bracket-left" aria-hidden="true">「</span>` +
    `<svg class="tag-spark ${sparkClass}" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M6 1C5.2 3 3.5 5 3.5 7.5a2.5 2.5 0 0 0 5 0C8.5 5 6.8 3 6 1Z"/></svg>` +
    `<span>${tag}</span>` +
    `<span class="tag-bracket tag-bracket-right" aria-hidden="true">」</span>` +
    `</span>`;
}
