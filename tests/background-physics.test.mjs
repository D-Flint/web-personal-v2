import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePair, stepDesk, clearanceOpacity, easeOpacity, applyPointerImpulse, applyScrollImpulse, scatterParticle, stepParticle, clampToViewport } from '../src/utils/backgroundPhysics.mjs';
const disk=(extra={})=>({x:60,y:60,radius:10,vx:0,vy:0,angle:0,spin:0,...extra});
test('changing clearance geometry fades without changing position or momentum, including while held',()=>{
  for(const held of [false,true]){
    const body=disk();const before={...body};
    assert.equal(clearanceOpacity(body,[]),1);
    assert.equal(clearanceOpacity(body,[{x:0,y:0,width:200,height:200}]),0);
    assert.deepEqual(body,before);
    // No content rectangles can enter the physical step.
    stepDesk([body],{width:200,height:200,held:held?body:undefined});
    assert.deepEqual(body,before);
  }
});
test('clearance feathers continuously at corners and fades back in without popping',()=>{
  const rect={x:100,y:100,width:50,height:50};
  const alphas=[70,75,80,85,90].map(x=>clearanceOpacity(disk({x,y:110}),[rect]));
  assert.equal(alphas[0],1);assert.equal(alphas.at(-1),0);
  assert.ok(alphas[1]>alphas[2]&&alphas[2]>alphas[3]);
  assert.ok(clearanceOpacity(disk({x:85,y:85}),[rect])>clearanceOpacity(disk({x:85,y:100}),[rect]));
  let alpha=1;for(let i=0;i<30;i++){const next=easeOpacity(alpha,0,1000/60);assert.ok(alpha-next<.18);alpha=next;}
  assert.ok(alpha<.01);for(let i=0;i<35;i++)alpha=easeOpacity(alpha,1,1000/60);assert.equal(alpha,1);
});
test('distant pointer events cannot accelerate pieces or particles; nearby input does',()=>{
  const body=disk(),particle={x:60,y:60,hx:60,hy:60,vx:0,vy:0};
  for(let i=0;i<1000;i++){
    applyPointerImpulse(body,1000,1000,500,-500);
    scatterParticle(particle,1000,1000,130,.3);
  }
  assert.equal(body.vx,0);assert.equal(body.vy,0);assert.equal(particle.vx,0);assert.equal(particle.vy,0);
  applyPointerImpulse(body,80,60,30,0);scatterParticle(particle,80,60,130,.3);
  assert.ok(body.vx>0);assert.ok(particle.vx<0);
});
test('scroll velocity gives pieces a bounded, directional physical nudge',()=>{
  const down=disk({scrollWeight:1,scrollSway:.1,scrollSpin:.01});
  const up=disk({scrollWeight:.8,scrollSway:-.1,scrollSpin:-.01});
  applyScrollImpulse([down,up],120,16.67);
  assert.ok(down.vy>0&&up.vy>0);assert.ok(down.vx>0&&up.vx<0);
  const downSpeed=down.vy,upSpin=up.spin;
  applyScrollImpulse([down,up],-120,16.67);
  assert.ok(down.vy<downSpeed);assert.ok(up.spin>upSpin);
  applyScrollImpulse([down,up],100000,1);
  assert.ok(Math.hypot(down.vx,down.vy)<=14);assert.ok(Math.abs(down.spin)<=.18);
});
test('coincident disks separate; held body transfers full penetration correction',()=>{
  const a=disk(),b=disk();resolvePair(a,b);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=20);
  const held=disk(),other=disk({x:65});resolvePair(held,other,held);
  assert.equal(held.x,60);assert.ok(other.x>=80);
});
test('separating contacts receive no artificial bounce energy',()=>{
  const a=disk({vx:-2}),b=disk({x:75,vx:2});resolvePair(a,b);
  assert.equal(a.vx,-2);assert.equal(b.vx,2);
});
test('a fast throw is bounded, cannot tunnel through a piece or viewport edge',()=>{
  const a=disk({x:40,vx:800}),b=disk({x:65});
  stepDesk([a,b],{width:200,height:120});
  assert.ok(a.x<b.x);assert.ok(b.vx>0);assert.ok(Math.hypot(a.vx,a.vy)<=14);
  const wall=disk({x:185,vx:800});stepDesk([wall],{width:200,height:120});
  assert.ok(wall.x<=190);assert.ok(wall.vx<0);
});
test('maximum throws and tap impulses settle in under six seconds and remain still',()=>{
  const bodies=[disk({vx:14,vy:-14,spin:1}),disk({x:90,vx:-14,vy:14,spin:-1})];
  const particle={x:60,y:60,hx:60,hy:60,vx:0,vy:0};scatterParticle(particle,61,61,230,7);
  let moving=true,frames=0;
  while(moving&&frames++<360){moving=stepDesk(bodies,{width:300,height:200});moving=stepParticle(particle)||moving;}
  assert.ok(frames<360);const before=structuredClone(bodies);
  for(let i=0;i<60;i++)stepDesk(bodies,{width:300,height:200});assert.deepEqual(bodies,before);
  assert.equal(particle.x,particle.hx);assert.equal(particle.y,particle.hy);
});
test('resizing preserves interior coordinates and clamps only out-of-bounds positions',()=>{
  const interior=disk(),edge=disk({x:480,y:380});
  const before={...interior};clampToViewport(interior,300,200);assert.deepEqual(interior,before);
  clampToViewport(edge,300,200);assert.equal(edge.x,290);assert.equal(edge.y,190);
  clampToViewport(edge,600,500);assert.equal(edge.x,290);assert.equal(edge.y,190);
});
