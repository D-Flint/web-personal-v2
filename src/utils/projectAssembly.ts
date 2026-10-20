import type { Point, ProjectPreview, PreviewNode } from '../data/projectPreviews';
export const clamp = (value:number) => Math.max(0,Math.min(1,value));
const smooth = (t:number) => t*t*(3-2*t);
export type AssemblyInterval = { start:number; end:number };
export type AssemblyTimeline = { nodes:AssemblyInterval[]; wires:AssemblyInterval[] };
const SEQUENCE_START = .04;
const SEQUENCE_END = .78;
const ARRIVAL_WEIGHT = 1;
const CONNECTION_WEIGHT = .9;
const READING_PAUSE_WEIGHT = .18;

// One visual event owns the stage: land a block, trace its available inputs one
// at a time, then hand attention to the next block. The full graph holds at 80%.
export function createAssemblyTimeline(preview:ProjectPreview):AssemblyTimeline {
  const total=preview.nodes.length*(ARRIVAL_WEIGHT+READING_PAUSE_WEIGHT)+preview.edges.length*CONNECTION_WEIGHT;
  const unit=(SEQUENCE_END-SEQUENCE_START)/total;
  const nodes:AssemblyInterval[]=[],wires:AssemblyInterval[]=[];
  let cursor=SEQUENCE_START;
  preview.nodes.forEach((_,index)=>{
    nodes.push({start:cursor,end:cursor+ARRIVAL_WEIGHT*unit});
    cursor+=ARRIVAL_WEIGHT*unit;
    preview.edges.forEach((edge,edgeIndex)=>{
      const source=preview.nodes.findIndex(node=>node.id===edge.from);
      const target=preview.nodes.findIndex(node=>node.id===edge.to);
      if(Math.max(source,target)!==index)return;
      wires[edgeIndex]={start:cursor,end:cursor+CONNECTION_WEIGHT*unit};
      cursor+=CONNECTION_WEIGHT*unit;
    });
    cursor+=READING_PAUSE_WEIGHT*unit;
  });
  return {nodes,wires};
}
export const intervalProgress = (p:number,interval:AssemblyInterval) => clamp((p-interval.start)/(interval.end-interval.start));
export const nodeProgress = (p:number,interval:AssemblyInterval) => smooth(intervalProgress(p,interval));
export const phase = (p:number) => p < SEQUENCE_START ? 'separated' : p < SEQUENCE_END ? 'assembling' : p < .8 ? 'connecting' : 'complete';
export const sceneBounds = (kind:'desktop'|'mobile') => kind==='desktop'?[0,0,960,400]:[0,0,330,365];
export const nodePosition = (node:PreviewNode,kind:'desktop'|'mobile',p:number,interval:AssemblyInterval) => {
  const n=node[kind],remaining=1-nodeProgress(p,interval);
  const [, ,width,height]=sceneBounds(kind);
  // Keep arrivals inside the fixed frame now that the camera no longer zooms.
  const inset=8;
  const dx=Math.max(inset,Math.min(width-n.w-inset,n.x+n.dx))-n.x;
  const dy=Math.max(inset,Math.min(height-n.h-inset,n.y+n.dy))-n.y;
  return {x:n.x+dx*remaining,y:n.y+dy*remaining,dx:dx*remaining,dy:dy*remaining};
};
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

