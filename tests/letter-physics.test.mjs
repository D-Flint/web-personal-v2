import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceClock, stepLetterParticle, assignLetterTargets } from '../src/utils/letterPhysics.mjs';
const limits={left:-500,right:500,top:-500,bottom:500};
function simulate(hz) {
 const p={x:0,y:0,vx:180,vy:40,baseX:100,baseY:20},clock={accumulator:0};
 let elapsed=0,phase='scatter';
 for(let i=0;i<hz*4;i++)advanceClock(clock,1000/hz,dt=>{
  elapsed+=dt*1000;
  if(phase==='scatter'&&elapsed>=900){phase='assemble';elapsed=0;}
  if(phase==='assemble'&&elapsed>=1800){phase='hold';elapsed=0;}
  stepLetterParticle(p,{phase,elapsed,pointer:{x:1000,y:1000},pointerWeight:0,limits,index:0},dt);
 });
 return {p};
}
test('equal elapsed time gives identical scatter/reassembly at 30, 60 and 120 Hz',()=>{
 const reference=simulate(120);
 for(const hz of [30,60])assert.deepEqual(simulate(hz),reference);
 assert.ok(Math.hypot(reference.p.x-100,reference.p.y-20)<.1);
});
test('assembly boundary preserves position and velocity remains bounded',()=>{
 const p={x:95,y:18,vx:4,vy:2,baseX:100,baseY:20};
 const before={...p};
 stepLetterParticle(p,{phase:'hold',elapsed:0,pointer:{x:1000,y:1000},pointerWeight:0,limits,index:0},1/120);
 assert.ok(Math.hypot(p.x-before.x,p.y-before.y)<.1);
 assert.ok(Math.hypot(p.vx,p.vy)<8);
});
test('pointer coincidence remains finite and scatter stays contained',()=>{
 const p={x:0,y:0,vx:0,vy:0,baseX:0,baseY:0};
 stepLetterParticle(p,{phase:'hold',elapsed:0,pointer:{x:0,y:0},pointerWeight:1,limits,index:3},1/120);
 assert.ok(Number.isFinite(p.x)&&Math.hypot(p.vx,p.vy)>0);
 p.vx=10000;p.vy=-10000;
 for(let i=0;i<120;i++)stepLetterParticle(p,{phase:'scatter',elapsed:i*1000/120,pointer:{x:0,y:0},pointerWeight:0,limits,index:0},1/120);
 assert.ok(p.x<=500&&p.y>=-500);
});

test('spatial assignment preserves all target cells and avoids crossing distant neighborhoods',()=>{
 const coords=[{x:0,y:0},{x:100,y:0},{x:0,y:100},{x:100,y:100}];
 const particles=[{x:102,y:101},{x:-2,y:99},{x:101,y:1},{x:-1,y:-1}];
 const naive=particles.reduce((sum,p,i)=>sum+Math.hypot(p.x-coords[i].x,p.y-coords[i].y),0);
 assignLetterTargets(particles,coords);
 const distance=particles.reduce((sum,p)=>sum+Math.hypot(p.x-p.baseX,p.y-p.baseY),0);
 assert.ok(distance<naive*.1);
 assert.deepEqual(particles.map(p=>`${p.baseX},${p.baseY}`).sort(),coords.map(p=>`${p.x},${p.y}`).sort());
});
