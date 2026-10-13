// CSS pixels and seconds; one fixed clock drives both phase timing and physics.
export function advanceClock(clock, milliseconds, step) {
  const dt = 1 / 120;
  clock.accumulator += Math.min(50, Math.max(0, milliseconds)) / 1000;
  while (clock.accumulator + 1e-10 >= dt) {
    step(dt);
    clock.accumulator -= dt;
  }
}
export function stepLetterParticle(p, state, dt) {
  const { phase, elapsed, pointer, pointerWeight, limits, index } = state;
  if (phase === 'scatter') {
    p.vx *= Math.exp(-1.3 * dt); p.vy *= Math.exp(-1.3 * dt);
  } else {
    const progress = Math.min(1, elapsed / 350);
    const omega = phase === 'assemble' ? 6 + 3 * progress * progress * (3 - 2 * progress) : 8;
    p.vx += ((p.baseX - p.x) * omega * omega - 1.9 * omega * p.vx) * dt;
    p.vy += ((p.baseY - p.y) * omega * omega - 1.9 * omega * p.vy) * dt;
    const dx = p.x - pointer.x, dy = p.y - pointer.y, distance = Math.hypot(dx, dy);
    if (distance < 45 && pointerWeight) {
      const t = 1 - distance / 45, force = t * t * (3 - 2 * t) * 1600 * pointerWeight;
      const angle = index * 2.399963;
      p.vx += (distance > .001 ? dx / distance : Math.cos(angle)) * force * dt;
      p.vy += (distance > .001 ? dy / distance : Math.sin(angle)) * force * dt;
    }
    if (Math.hypot(p.x - p.baseX, p.y - p.baseY) < .1 && Math.hypot(p.vx, p.vy) < .3 && !pointerWeight) {
      p.x = p.baseX; p.y = p.baseY; p.vx = p.vy = 0;
    }
  }
  // Feather wall response before applying a non-bouncing containment guard.
  constrain(p, 'x', 'vx', limits.left, limits.right, dt);
  constrain(p, 'y', 'vy', limits.top, limits.bottom, dt);
}
function constrain(p, axis, velocity, low, high, dt) {
  const margin = Math.min(24, (high - low) * .1);
  if ((p[axis] < low + margin && p[velocity] < 0) || (p[axis] > high - margin && p[velocity] > 0)) p[velocity] *= Math.exp(-14 * dt);
  p[axis] += p[velocity] * dt;
  if (p[axis] < low || p[axis] > high) { p[axis] = Math.max(low, Math.min(high, p[axis])); p[velocity] = 0; }
}

// Match spatial neighborhoods instead of pairing unrelated raster rows.
// Independent bounds map the dispersed cloud onto the next word's proportions.
export function assignLetterTargets(particles, coordinates) {
  if (!particles.length || !coordinates.length) return;
  const destinations = Array.from({length: particles.length}, (_, i) => coordinates[Math.floor(i * coordinates.length / particles.length)]);
  const sources = spatialOrder(particles), targets = spatialOrder(destinations);
  sources.forEach((p, i) => { p.baseX = targets[i].x; p.baseY = targets[i].y; });
}
function spatialOrder(points) {
  let left=Infinity, top=Infinity, right=-Infinity, bottom=-Infinity;
  for (const p of points) { left=Math.min(left,p.x); right=Math.max(right,p.x); top=Math.min(top,p.y); bottom=Math.max(bottom,p.y); }
  const width=Math.max(1,right-left), height=Math.max(1,bottom-top);
  const spread = value => {
    let n=value;
    n=(n|(n<<4))&0x0f0f; n=(n|(n<<2))&0x3333; return (n|(n<<1))&0x5555;
  };
  return points.map(p=>({p,key:spread(Math.round((p.x-left)/width*255))|(spread(Math.round((p.y-top)/height*255))<<1)}))
    .sort((a,b)=>a.key-b.key).map(item=>item.p);
}
