// Internal canvas helpers. Coordinates/velocities use CSS pixels and 60 Hz frames.
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
function limitVelocity(body) {
  const speed = Math.hypot(body.vx, body.vy);
  if (speed > 14) { body.vx *= 14 / speed; body.vy *= 14 / speed; }
  if ('spin' in body) body.spin = clamp(body.spin, -.18, .18);
}
export function clampToViewport(body, width, height, radius = body.radius) {
  body.x = clamp(body.x, Math.min(radius, width / 2), Math.max(width - radius, width / 2));
  body.y = clamp(body.y, Math.min(radius, height / 2), Math.max(height - radius, height / 2));
}
// Clearance is read-only: even a rectangle enclosing the entire scene cannot move it.
export function clearanceOpacity(body, rects, radius = body.radius, feather = 18) {
  let opacity = 1;
  for (const rect of rects) {
    const x = clamp(body.x, rect.x, rect.x + rect.width);
    const y = clamp(body.y, rect.y, rect.y + rect.height);
    const t = clamp((Math.hypot(body.x - x, body.y - y) - radius) / feather, 0, 1);
    opacity = Math.min(opacity, t * t * (3 - 2 * t));
  }
  return opacity;
}
export function easeOpacity(current, target, elapsed) {
  const next = current + (target - current) * (1 - Math.exp(-elapsed / 85));
  return Math.abs(next - target) < .002 ? target : next;
}
// Every input impulse has compact support; distant motion contributes exactly zero.
export function applyPointerImpulse(body, x, y, dx, dy, radius = 100) {
  const near = Math.max(0, 1 - Math.hypot(body.x - x, body.y - y) / radius);
  body.vx += clamp(dx * .003, -.6, .6) * near;
  body.vy += clamp(dy * .003, -.6, .6) * near;
  limitVelocity(body);
}
// A fast page scroll transfers a small signed impulse to every loose desk piece.
export function applyScrollImpulse(bodies, scrollDelta, elapsed) {
  if (!scrollDelta || !bodies.length) return;
  const impulse = clamp(scrollDelta / Math.max(8, elapsed) * 16.67 * .012, -1.8, 1.8);
  for (const body of bodies) {
    body.vy += impulse * (body.scrollWeight ?? 1);
    body.vx += impulse * (body.scrollSway ?? 0);
    body.spin += impulse * (body.scrollSpin ?? 0);
    limitVelocity(body);
  }
}
export function scatterParticle(p, x, y, radius, strength) {
  const dx = p.x - x, dy = p.y - y, distance = Math.hypot(dx, dy);
  if (distance >= radius) return;
  const force = (1 - distance / radius) * strength;
  p.vx += dx / (distance || 1) * force;
  p.vy += dy / (distance || 1) * force;
  limitVelocity(p);
}
export function stepParticle(p) {
  p.vx = (p.vx + (p.hx - p.x) * .009) * .9;
  p.vy = (p.vy + (p.hy - p.y) * .009) * .9;
  limitVelocity(p);
  p.x += p.vx; p.y += p.vy;
  if (Math.hypot(p.vx, p.vy) < .025 && Math.hypot(p.hx - p.x, p.hy - p.y) < .25) {
    p.x = p.hx; p.y = p.hy; p.vx = p.vy = 0; return false;
  }
  return true;
}
export function resolvePair(a, b, held) {
  const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy);
  const depth = a.radius + b.radius - distance;
  if (depth <= 0) return;
  const nx = distance > 1e-8 ? dx / distance : 1;
  const ny = distance > 1e-8 ? dy / distance : 0;
  const ia = a === held ? 0 : 1 / (a.radius * a.radius);
  const ib = b === held ? 0 : 1 / (b.radius * b.radius);
  const sum = ia + ib;
  if (!sum) return;
  a.x -= nx * (depth + .001) * ia / sum; a.y -= ny * (depth + .001) * ia / sum;
  b.x += nx * (depth + .001) * ib / sum; b.y += ny * (depth + .001) * ib / sum;
  const speed = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (speed >= 0) return;
  const impulse = -1.45 * speed / sum;
  a.vx -= impulse * nx * ia; a.vy -= impulse * ny * ia;
  b.vx += impulse * nx * ib; b.vy += impulse * ny * ib;
  if (ia) a.spin -= speed * .002;
  if (ib) b.spin += speed * .002;
}
function walls(body, width, height) {
  const r = body.radius;
  if (body.x < r) body.vx = Math.abs(body.vx) * .45;
  if (body.x > width - r) body.vx = -Math.abs(body.vx) * .45;
  if (body.y < r) body.vy = Math.abs(body.vy) * .45;
  if (body.y > height - r) body.vy = -Math.abs(body.vy) * .45;
  clampToViewport(body, width, height);
}
// Physical contacts only involve other pieces and viewport edges.
export function stepDesk(bodies, { width, height, held, dt = 1 }) {
  bodies.forEach(limitVelocity);
  const minRadius = Math.min(...bodies.map(body => body.radius), 12);
  const speed = Math.max(...bodies.map(body => Math.hypot(body.vx, body.vy)), 0);
  const steps = Math.max(1, Math.ceil(speed * dt / (minRadius * .4)));
  const step = dt / steps;
  for (let s = 0; s < steps; s++) {
    for (const body of bodies) {
      if (body === held) continue;
      body.x += body.vx * step; body.y += body.vy * step; body.angle += body.spin * step;
      const drag = Math.pow(.94, step); body.vx *= drag; body.vy *= drag; body.spin *= drag;
    }
    for (let pass = 0; pass < 4; pass++) {
      for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) resolvePair(bodies[i], bodies[j], held);
      for (const body of bodies) { walls(body, width, height); limitVelocity(body); }
    }
  }
  let moving = false;
  for (const body of bodies) {
    if (body === held) continue;
    if (Math.hypot(body.vx, body.vy) > .025 || Math.abs(body.spin) > .001) moving = true;
    else body.vx = body.vy = body.spin = 0;
  }
  return moving;
}
