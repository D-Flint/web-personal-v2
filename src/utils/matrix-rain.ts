// ──────────────────────────────────────────────────────────────────────────────
//  matrix-rain.ts — Grand Narukami Sakura-Pink Matrix Rain Engine
// ──────────────────────────────────────────────────────────────────────────────
//  High-performance canvas rain engine blending iconic digital Matrix streams
//  with elegant Inazuma/Sakura aesthetics and falling Neko treats.
//  Features:
//  - VSync-synchronized 60fps/120fps+ smooth delta-time simulation
//  - Multi-depth parallax streams with dynamic glyph mutation/shimmer
//  - Batched 2-pass rendering (fast tail sweep + luminescent bloom heads)
//  - Rich bilingual glyph palette (Katakana, half-width matrix glyphs, digits, shrine kanji)
//  - High-DPI (Retina/2K) canvas scaling
//  - Adaptive performance scaling for mobile/coarse pointers & visibility pauses
// ──────────────────────────────────────────────────────────────────────────────

export interface MatrixRainOptions {
  /** Columns per 100px of canvas width (default: 8). Halved automatically on coarse pointers. */
  density?: number;
  /** Rain speed multiplier (default: 1). */
  speed?: number;
  /** Base glyph color (default: sakura pink #ff6fa5). */
  color?: string;
  /** Bright head-glyph color (default: #ffffff). */
  headColor?: string;
  /** Secondary highlight color right behind the head (default: #ffd6e8). */
  glowColor?: string;
  /** Glyph font size in px (default: 16). */
  fontSize?: number;
  /** Base trail length in glyphs per column (default: 12). */
  trailLength?: number;
  /** Character set for rain glyphs (default: Katakana + Matrix half-width + Shrine Kanji + digits). */
  charset?: string;
  /** Probability per frame for an active trail glyph to mutate/shimmer (default: 0.06). */
  mutateChance?: number;
  /** Neko glyph set drawn as rare falling treats. */
  nekoGlyphs?: string[];
  /** Max neko glyphs on screen at once (default: 3). */
  maxNeko?: number;
  /** Per-frame chance a neko glyph spawns (default: 0.02). */
  nekoChance?: number;
  /** Every Nth spawned glyph leaves a tiny glowing paw trail (default: 20). */
  pawTrailEvery?: number;
  /** Optional frame throttle in ms (default: 0 for native VSync 60fps/120fps+). Set > 0 only to cap FPS. */
  frameInterval?: number;
  /** Enable luminescent bloom glow on heads and neko treats (default: true). */
  shadows?: boolean;
  /** Pause the loop on document visibilitychange (default: true). */
  pauseWhenHidden?: boolean;
}

interface TrailGlyph {
  char: string;
  row: number;
}

interface Column {
  x: number;
  y: number;
  speed: number;
  trailLength: number;
  trail: TrailGlyph[];
  depth: number; // 0.65 (distant background) to 1.0 (crisp foreground)
}

interface NekoDrop {
  glyph: string;
  x: number;
  y: number;
  speed: number;
}

interface PawPrint {
  x: number;
  y: number;
  frames: number;
  maxFrames: number;
}

export const MATRIX_RAIN_CHARSET =
  '桜狐電神月夢鏡社猫ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789:・."=*+-<>¦｜ﾘ';

export const MATRIX_NEKO_GLYPHS = ['/\\_/\\', '=^∇^=', '>^_^<', '~(=^‥^)', '(=｀ェ´=)', 'ΦωΦ'];

export class MatrixRain {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected opts: Required<MatrixRainOptions>;
  protected columns: Column[] = [];
  protected nekos: NekoDrop[] = [];
  protected paws: PawPrint[] = [];
  protected running = false;
  protected frameId: number | null = null;
  protected lastTime = 0;
  protected glyphCounter = 0;
  protected resizeObserver: ResizeObserver | null = null;
  protected pausedByVisibility = false;
  /** External vertical offset in px for scroll parallax — set by host components. */
  scrollOffset = 0;

  constructor(canvas: HTMLCanvasElement, options: MatrixRainOptions = {}) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('MatrixRain: 2d canvas context unavailable');
    this.canvas = canvas;
    this.ctx = ctx;
    const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    this.opts = {
      density: (options.density ?? 8) * (coarse ? 0.6 : 1),
      speed: options.speed ?? 1,
      color: options.color ?? '#ff6fa5',
      headColor: options.headColor ?? '#ffffff',
      glowColor: options.glowColor ?? '#ffd6e8',
      fontSize: options.fontSize ?? 16,
      trailLength: options.trailLength ?? 12,
      charset: options.charset ?? MATRIX_RAIN_CHARSET,
      mutateChance: options.mutateChance ?? (coarse ? 0.03 : 0.06),
      nekoGlyphs: options.nekoGlyphs ?? MATRIX_NEKO_GLYPHS,
      maxNeko: options.maxNeko ?? (coarse ? 1 : 3),
      nekoChance: options.nekoChance ?? (coarse ? 0.01 : 0.02),
      pawTrailEvery: options.pawTrailEvery ?? 20,
      frameInterval: options.frameInterval ?? 0, // 0 = native refresh rate (60/120/144Hz)
      shadows: options.shadows ?? !coarse,
      pauseWhenHidden: options.pauseWhenHidden ?? true,
    };
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    if (this.opts.pauseWhenHidden && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /** Stop the loop and detach all listeners/observers. */
  destroy(): void {
    this.stop();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  protected onVisibilityChange = (): void => {
    if (document.hidden) {
      if (this.running) {
        this.stop();
        this.pausedByVisibility = true;
      }
    } else if (this.pausedByVisibility) {
      this.pausedByVisibility = false;
      this.start();
    }
  };

  protected resize(): void {
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const w = this.canvas.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 800);
    const h = this.canvas.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 600);
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(h * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.buildColumns(w, h);
  }

  protected buildColumns(w: number, h: number): void {
    const count = Math.max(1, Math.round((w / 100) * this.opts.density));
    const colWidth = w / count;
    const rows = Math.ceil(h / this.opts.fontSize);
    this.columns = [];
    for (let i = 0; i < count; i++) {
      const depth = 0.65 + Math.random() * 0.35; // 0.65 to 1.0 depth parallax
      const randomizedLength = Math.max(6, Math.round(this.opts.trailLength * (0.75 + Math.random() * 0.5)));
      this.columns.push({
        x: i * colWidth + colWidth / 2,
        y: Math.random() * rows,
        speed: (6 + Math.random() * 8) * depth,
        trailLength: randomizedLength,
        trail: [],
        depth,
      });
    }
  }

  protected randomChar(): string {
    const c = this.opts.charset;
    return c[Math.floor(Math.random() * c.length)];
  }

  /** Advance the simulation by `delta` ms (capped smoothly at 50ms). */
  update(delta: number): void {
    if (this.columns.length === 0) return;
    const { fontSize, nekoChance, maxNeko, pawTrailEvery, mutateChance } = this.opts;
    const h = this.canvas.clientHeight || window.innerHeight;
    const dt = (delta / 1000) * this.opts.speed;

    for (const col of this.columns) {
      const rows = Math.ceil(h / fontSize) + col.trailLength;
      const prevRow = Math.floor(col.y);
      col.y += col.speed * dt;
      const headRow = Math.floor(col.y);

      // Add new glyph at head step
      if (headRow > prevRow) {
        col.trail.unshift({ char: this.randomChar(), row: headRow });
        if (col.trail.length > col.trailLength) col.trail.pop();
        this.glyphCounter++;
        if (this.glyphCounter % pawTrailEvery === 0) {
          this.paws.push({ x: col.x, y: (headRow - 1) * fontSize, frames: 12, maxFrames: 12 });
        }
      }

      // Dynamic glyph mutation: subtle digital shimmer on trail characters
      if (mutateChance > 0 && col.trail.length > 1) {
        for (let i = 1; i < col.trail.length; i++) {
          if (Math.random() < mutateChance) {
            col.trail[i].char = this.randomChar();
          }
        }
      }

      // Reset column once trail leaves the viewport
      if (col.y - col.trailLength > rows) {
        col.y = -(2 + Math.random() * 6);
        col.depth = 0.65 + Math.random() * 0.35;
        col.speed = (6 + Math.random() * 8) * col.depth;
        col.trailLength = Math.max(6, Math.round(this.opts.trailLength * (0.75 + Math.random() * 0.5)));
        col.trail = [];
      }
    }

    // Rare falling Neko treats
    if (this.nekos.length < maxNeko && Math.random() < nekoChance) {
      const col = this.columns[Math.floor(Math.random() * this.columns.length)];
      const glyph = this.opts.nekoGlyphs[Math.floor(Math.random() * this.opts.nekoGlyphs.length)];
      this.nekos.push({ glyph, x: col.x, y: -fontSize, speed: 4 + Math.random() * 4 });
    }
    for (const n of this.nekos) n.y += n.speed * fontSize * dt;
    this.nekos = this.nekos.filter((n) => n.y < h + fontSize);

    // Paw trail decay
    for (const p of this.paws) p.frames--;
    this.paws = this.paws.filter((p) => p.frames > 0);
  }

  /** Draw the current frame with fast batched passes for buttery-smooth 60/120fps. */
  drawFrame(): void {
    const { ctx } = this;
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const { fontSize, color, headColor, glowColor, shadows } = this.opts;

    ctx.clearRect(0, 0, w, h);
    ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const oy = ((this.scrollOffset % fontSize) + fontSize) % fontSize;

    // ── PASS 1: Trail glyphs (no shadow state switches for maximum FPS) ────
    ctx.fillStyle = color;
    for (const col of this.columns) {
      const trailCount = col.trail.length;
      for (let i = trailCount - 1; i >= 1; i--) {
        const g = col.trail[i];
        const py = g.row * fontSize + oy;
        if (py < -fontSize || py > h + fontSize) continue;

        if (i === 1) {
          ctx.fillStyle = glowColor;
          ctx.globalAlpha = 0.95 * col.depth;
        } else {
          const normalizedPos = 1 - i / col.trailLength;
          ctx.fillStyle = color;
          ctx.globalAlpha = Math.max(0.06, Math.pow(normalizedPos, 1.35) * 0.85 * col.depth);
        }
        ctx.fillText(g.char, col.x, py);
      }
    }

    // ── PASS 2: Glowing Head Glyphs (Batched shadow setup) ───────────────
    ctx.fillStyle = headColor;
    ctx.globalAlpha = 1;
    if (shadows) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 6;
    }
    for (const col of this.columns) {
      if (col.trail.length > 0) {
        const g = col.trail[0];
        const py = g.row * fontSize + oy;
        if (py >= -fontSize && py <= h + fontSize) {
          ctx.fillText(g.char, col.x, py);
        }
      }
    }
    if (shadows) {
      ctx.shadowBlur = 0;
    }

    // ── PASS 3: Paw Prints ───────────────────────────────────────────────
    if (this.paws.length > 0) {
      ctx.fillStyle = glowColor;
      for (const p of this.paws) {
        ctx.globalAlpha = (p.frames / p.maxFrames) * 0.75;
        ctx.fillText('🐾', p.x, p.y + oy);
      }
    }

    // ── PASS 4: Falling Neko Treats ──────────────────────────────────────
    if (this.nekos.length > 0) {
      ctx.fillStyle = glowColor;
      ctx.globalAlpha = 1;
      if (shadows) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
      }
      for (const n of this.nekos) {
        ctx.fillText(n.glyph, n.x, n.y + oy);
      }
      if (shadows) {
        ctx.shadowBlur = 0;
      }
    }

    ctx.globalAlpha = 1;
  }

  protected loop = (time: number): void => {
    if (!this.running) return;
    if (this.opts.frameInterval > 0 && time - this.lastTime < this.opts.frameInterval) {
      this.frameId = requestAnimationFrame(this.loop);
      return;
    }
    const delta = this.lastTime > 0 ? Math.min(time - this.lastTime, 50) : 16.6;
    this.lastTime = time;
    this.update(delta);
    this.drawFrame();
    this.frameId = requestAnimationFrame(this.loop);
  };
}
