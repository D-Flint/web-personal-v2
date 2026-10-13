// Test-only observation of real canvas draw calls; no runtime/debug API is added.
export function installMotionProbe() {
  const frames = [];
  window.__deskFrames = frames;
  let current;
  const proto = CanvasRenderingContext2D.prototype;
  const clear = proto.clearRect, translate = proto.translate, rotate = proto.rotate, arc = proto.arc;
  proto.clearRect = function (...args) {
    if (this.canvas.id === 'drafting-canvas') {
      current = { time: performance.now(), scroll: scrollY, bodies: [], particles: [] };
      frames.push(current); if (frames.length > 4000) frames.shift();
    }
    return clear.apply(this, args);
  };
  proto.translate = function (x, y) {
    if (this.canvas.id === 'drafting-canvas' && current) current.bodies.push({ x, y, alpha: this.globalAlpha, angle: 0 });
    return translate.call(this, x, y);
  };
  proto.rotate = function (angle) {
    if (this.canvas.id === 'drafting-canvas' && current?.bodies.length) current.bodies.at(-1).angle = angle;
    return rotate.call(this, angle);
  };
  proto.arc = function (x, y, radius, ...args) {
    if (this.canvas.id === 'drafting-canvas' && current && !current.bodies.length && radius <= 2) current.particles.push({ x, y, alpha: this.globalAlpha });
    return arc.call(this, x, y, radius, ...args);
  };
}
export async function scene(page) {
  return page.evaluate(() => window.__deskFrames.at(-1));
}
export async function settled(page) {
  await page.waitForFunction(() => window.__deskFrames?.length > 0);
  if (await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    await page.locator('#drafting-canvas[data-animating="false"]').waitFor();
  } else {
    // Let interaction impulses decay; ambient motion intentionally never settles.
    await page.waitForTimeout(1400);
  }
}
