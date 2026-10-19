import type { Point, ProjectPreview, PreviewNode } from '../data/projectPreviews';
export const clamp = (value:number) => Math.max(0,Math.min(1,value));
const smooth = (t:number) => t*t*(3-2*t);
const NODE_SEQUENCE_START = .04;
const NODE_SEQUENCE_END = .72;
export const nodeStart = (index:number,count:number) => NODE_SEQUENCE_START+index*(NODE_SEQUENCE_END-NODE_SEQUENCE_START)/count;
export const nodeEnd = (index:number,count:number) => nodeStart(index+1,count);
// A box owns one exclusive scroll interval; the next waits for its exact landing.
export const nodeProgress = (p:number,index:number,count:number) => smooth(clamp((p-nodeStart(index,count))/(nodeEnd(index,count)-nodeStart(index,count))));
// A connection can launch only from a fully landed source. Allow late-source
// edges a final connecting interval before the complete-graph hold at 80%.
export const wireProgress = (p:number,sourceIndex:number,targetIndex:number,count:number) => {
  const start=nodeEnd(sourceIndex,count);
  const end=Math.max(start,nodeEnd(targetIndex,count))+.06;
  return clamp((p-start)/(end-start));
};
export const phase = (p:number) => p < .04 ? 'separated' : p < .72 ? 'assembling' : p < .8 ? 'connecting' : 'complete';
export const sceneBounds = (kind:'desktop'|'mobile') => kind==='desktop'?[0,0,960,400]:[0,0,330,365];
export const nodePosition = (node:PreviewNode,kind:'desktop'|'mobile',p:number,index:number,count:number) => {
  const n=node[kind],remaining=1-nodeProgress(p,index,count);
  const [, ,width,height]=sceneBounds(kind);
  // Keep arrivals inside the fixed frame now that the camera no longer zooms.
  const inset=8;
  const dx=Math.max(inset,Math.min(width-n.w-inset,n.x+n.dx))-n.x;
  const dy=Math.max(inset,Math.min(height-n.h-inset,n.y+n.dy))-n.y;
  return {x:n.x+dx*remaining,y:n.y+dy*remaining,dx:dx*remaining,dy:dy*remaining};
};
// Route between the live source port and an independently positioned head.
// Move whole constant-coordinate runs together to preserve orthogonal routing.
export function sourceAnchoredRoute(authored:Point[],from:{dx:number;dy:number},to={dx:0,dy:0}) {
  if(!from.dx&&!from.dy&&!to.dx&&!to.dy)return authored;
  const first=authored[0],last=authored.at(-1)!;
  const target={x:last.x+to.dx,y:last.y+to.dy};
  const source={x:first.x+from.dx,y:first.y+from.dy};
  if(authored.every(p=>p.y===first.y)) {
    const mid=(source.x+target.x)/2;
    return [source,{x:mid,y:source.y},{x:mid,y:target.y},target];
  }
  if(authored.every(p=>p.x===first.x)) {
    const mid=(source.y+target.y)/2;
    return [source,{x:source.x,y:mid},{x:target.x,y:mid},target];
  }
  const points=authored.map(point=>({...point}));
  for(const axis of ['x','y'] as const) {
    const sourceShift=axis==='x'?from.dx:from.dy,targetShift=axis==='x'?to.dx:to.dy;
    let start=0;
    for(let end=1;end<=points.length;end++) {
      if(end<points.length && authored[end][axis]===authored[end-1][axis])continue;
      const ratio=(start+end-1)/(2*(points.length-1));
      const shift=start===0?sourceShift:end===points.length?targetShift:sourceShift+(targetShift-sourceShift)*ratio;
      for(let i=start;i<end;i++)points[i][axis]=authored[i][axis]+shift;
      start=end;
    }
  }
  return points;
}
export const routePath = (points:Point[]) => points.map((point,i)=>`${i?'L':'M'}${point.x} ${point.y}`).join(' ');
// Every route ends at explicit semantic ports on node boundaries, in both compositions.
export function validatePreview(preview:ProjectPreview) {
  const ids=new Set(preview.nodes.map(node=>node.id));
  if(ids.size!==preview.nodes.length || !preview.nodes.length) throw Error('Invalid preview nodes');
  for(const kind of ['nodes','edges'] as const) {
    for(let group=0;group<4;group++) if(!preview[kind].some(item=>item.group===group)) throw Error('Missing assembly group');
    for(const item of preview[kind]) if(!Number.isInteger(item.group)||item.group<0||item.group>3) throw Error('Invalid group');
  }
  for(const node of preview.nodes) {
    if(!['module','browser','store'].includes(node.shape)) throw Error('Unsupported shape');
    for(const layout of ['desktop','mobile'] as const) if(!Object.values(node[layout]).every(Number.isFinite)) throw Error('Invalid placement');
  }
  const edgeIDs=new Set<string>();
  for(const edge of preview.edges) {
    if(edgeIDs.has(edge.id)||!ids.has(edge.from)||!ids.has(edge.to)) throw Error('Invalid edge association');
    edgeIDs.add(edge.id);
    for(const layout of ['desktop','mobile'] as const) {
      const points=edge[layout];
      if(points.length<2||points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y))) throw Error('Invalid route');
      for(let i=1;i<points.length;i++) if(points[i].x!==points[i-1].x && points[i].y!==points[i-1].y) throw Error('Nonorthogonal route');
      for(const [id,point] of [[edge.from,points[0]],[edge.to,points.at(-1)!]] as const) {
        const n=preview.nodes.find(n=>n.id===id)![layout];
        const onX=(point.x===n.x||point.x===n.x+n.w)&&point.y>=n.y&&point.y<=n.y+n.h;
        const onY=(point.y===n.y||point.y===n.y+n.h)&&point.x>=n.x&&point.x<=n.x+n.w;
        if(!onX&&!onY) throw Error('Port is not on node boundary');
      }
    }
  }
}

export function cacheRoute(points:Point[]) {
  let length=0;
  const segments=points.slice(1).flatMap((to,i)=>{
    const from=points[i], size=Math.hypot(to.x-from.x,to.y-from.y);
    if(size===0)return [];
    const segment={from,to,start:length,size,angle:Math.atan2(to.y-from.y,to.x-from.x)*180/Math.PI};
    length+=size;
    return [segment];
  });
  if(!Number.isFinite(length)||!length)throw Error('Empty wire route');
  return {length,segments};
}
export function routeTip(route:ReturnType<typeof cacheRoute>,t:number) {
  const distance=clamp(t)*route.length;
  // At a corner choose the outgoing segment; the direction stays deterministic.
  const segment=route.segments.find(s=>distance<s.start+s.size)||route.segments.at(-1)!;
  const f=clamp((distance-segment.start)/segment.size);
  return {x:segment.from.x+(segment.to.x-segment.from.x)*f,y:segment.from.y+(segment.to.y-segment.from.y)*f,angle:segment.angle};
}

