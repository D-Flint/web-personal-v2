import type { ProjectPreview } from '../data/projectPreviews';
import { cacheRoute, clamp, movingRoute, nodePosition, phase, routePath, routeTip, sceneBounds, validatePreview, wireProgress } from './projectAssembly';

type Wire = { path:SVGPathElement; head:SVGPathElement; group:number; lastNodeGroup:number; from:string; to:string; authored:ProjectPreview['edges'][number]['desktop']; length:number; route:ReturnType<typeof cacheRoute>; label:SVGTextElement|null };
type Layout = { svg:SVGSVGElement; nodes:SVGGElement[]; wires:Wire[]; kind:'desktop'|'mobile' };
type Study = { article:HTMLElement; stage:HTMLElement; cta:HTMLAnchorElement; completion:HTMLElement;
  preview:ProjectPreview; layouts:Layout[]; enabled:boolean; failed:boolean; top:number; distance:number; inset:number; last:number };
let dispose: (()=>void) | undefined;
export function initProjectAssemblies() {
  dispose?.();
  const abort = new AbortController();
  const signal = abort.signal;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const studies:Study[]=[];
  let frame=0, dirty=true, measuring=false;
  let width=innerWidth, height=innerHeight;
  const on=(target:EventTarget,event:string,handler:EventListenerOrEventListenerObject) => target.addEventListener(event,handler,{signal,passive:true});
  function restore(study:Study, reason:string) {
    study.enabled=false;
    study.article.removeAttribute('data-assembly-enhanced');
    study.article.dataset.assemblyFallback=reason;
    study.cta.removeAttribute('tabindex');
    study.cta.removeAttribute('aria-hidden');
    study.completion.style.visibility='';
    render(study,1,true);
  }
  function render(study:Study,p:number,force=false) {
    if(!force&&Math.abs(study.last-p)<.000001) return;
    study.last=p;
    study.article.dataset.assemblyProgress=p.toFixed(6);
    study.article.dataset.assemblyPhase=phase(p);
    // Only the current responsive composition is written during scrolling. Both are
    // restored for static mode. Moving ports and routes share the same positions.
    for(const layout of study.layouts) {
      if(study.enabled && !force && (layout.kind==='mobile')!==(innerWidth<=700)) continue;
      const current=study.enabled?p:1;
      layout.svg.setAttribute('viewBox',sceneBounds(layout.kind,current).join(' '));
      const positions=new Map(study.preview.nodes.map(node=>[node.id,nodePosition(node,layout.kind,current)]));
      layout.nodes.forEach((element,i)=>{
        const point=positions.get(study.preview.nodes[i].id)!;
        element.setAttribute('transform',`translate(${point.x} ${point.y})`);
      });
      for(const wire of layout.wires) {
        const t=study.enabled?wireProgress(p,wire.group,wire.lastNodeGroup):1;
        const points=movingRoute(wire.authored,positions.get(wire.from)!,positions.get(wire.to)!);
        const route=points===wire.authored?wire.route:cacheRoute(points);
        wire.path.setAttribute('d',routePath(points));
        const length=route.length;
        wire.path.style.strokeDasharray=`${length} ${length}`;
        wire.path.style.strokeDashoffset=String(length*(1-t));
        wire.head.style.visibility=t<=0?'hidden':'visible';
        if(wire.label)wire.label.style.visibility=t>=1?'visible':'hidden';
        if(t>0) {
          const tip=routeTip(route,t);
          wire.head.setAttribute('transform',`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`);
        }
      }
    }
    const complete=!study.enabled||p>=.8;
    study.completion.style.visibility=complete?'visible':'hidden';
    if(complete) {study.cta.removeAttribute('tabindex');study.cta.removeAttribute('aria-hidden');}
    else {study.cta.tabIndex=-1;study.cta.setAttribute('aria-hidden','true');}
  }
  for(const article of document.querySelectorAll<HTMLElement>('[data-project-assembly]')) {
    try {
      const preview=JSON.parse(article.querySelector('[data-assembly-config]')!.textContent!) as ProjectPreview;
      validatePreview(preview);
      if(preview.id!==article.dataset.projectAssembly) throw Error('Mismatched project');
      const layouts=Array.from(article.querySelectorAll<SVGSVGElement>('[data-assembly-layout]')).map(svg=>{
        const nodes=Array.from(svg.querySelectorAll<SVGGElement>('[data-assembly-node]'));
        const paths=Array.from(svg.querySelectorAll<SVGPathElement>('[data-assembly-wire]'));
        const heads=Array.from(svg.querySelectorAll<SVGPathElement>('[data-assembly-head]'));
        if(nodes.length!==preview.nodes.length||paths.length!==preview.edges.length||heads.length!==paths.length) throw Error('Incomplete drawing');
        const wires=paths.map((path,i)=>{
          const route=cacheRoute(preview.edges[i][svg.dataset.assemblyLayout as Layout['kind']]);
          const length=route.length;
          if(!Number.isFinite(length)||length<=0) throw Error('Invalid route length');
          const edge=preview.edges[i];
          const lastNodeGroup=Math.max(...preview.nodes.filter(n=>n.id===edge.from||n.id===edge.to).map(n=>n.group));
          return {path,head:heads[i],group:edge.group,lastNodeGroup,from:edge.from,to:edge.to,authored:edge[svg.dataset.assemblyLayout as Layout['kind']],length,route,label:path.parentElement!.querySelector<SVGTextElement>('[data-assembly-relationship]')};
        });
        return {svg,nodes,wires,kind:svg.dataset.assemblyLayout as Layout['kind']};
      });
      const study:Study={article,preview,layouts,stage:article.querySelector('[data-assembly-stage]')!,cta:article.querySelector('[data-assembly-cta]')!,completion:article.querySelector('[data-assembly-completion]')!,enabled:false,failed:false,top:0,distance:0,inset:0,last:-1};
      studies.push(study);
      const finish=()=>{
        if(!study.enabled)return;
        scrollTo({top:study.top-study.inset+study.distance*.9,behavior:'instant'});
        render(study,.9,true);
        schedule();
      };
      on(article.querySelector('.assembly-end')!,'focus',finish);
      on(study.cta,'focus',finish);
      article.querySelector('.assembly-end')!.addEventListener('keydown',event=>{
        const key=event as KeyboardEvent;
        if(key.key==='Tab'&&!key.shiftKey&&study.enabled) {
          key.preventDefault();
          study.cta.focus({preventScroll:true});
        }
      },{signal});
      // The keyboard accommodation is invisible until focused; its anchor retains
      // native no-JS behavior, then focus reconciles the complete pinned view.
      article.querySelector('.assembly-completion-link')!.addEventListener('click',event=>{
        if(!study.enabled)return;
        event.preventDefault();
        (article.querySelector('.assembly-end') as HTMLElement).focus({preventScroll:true});
      },{signal});
    } catch {
      // Validation precedes any mutations: this article remains server-rendered.
      article.dataset.assemblyFallback='initialization';
    }
  }
  function measure() {
    measuring=true;
    // Enable candidates as a batch, then read the resulting layout. Tracks use svh;
    // visual-viewport changes only check fit, never rewrite the selected duration.
    for(const study of studies) {
      if(reduced.matches||study.failed) restore(study,reduced.matches?'reduced-motion':'initialization');
      else {study.article.dataset.assemblyEnhanced='true';study.enabled=true;}
    }
    const fits=studies.map(study=>{
      if(!study.enabled)return false;
      const svg=study.layouts.find(l=>(l.kind==='mobile')===(innerWidth<=700))!.svg;
      const rect=svg.getBoundingClientRect(), bounds=sceneBounds(innerWidth<=700?'mobile':'desktop',0);
      // Fit the widest/deepest opening as well as the finished graph.
      const scale=Math.min(rect.width/bounds[2],rect.height/bounds[3]);
      const label=svg.querySelector('.assembly-primary')!;
      const font=parseFloat(getComputedStyle(label).fontSize)*scale;
      const stage=study.stage.getBoundingClientRect();
      const inset=parseFloat(getComputedStyle(study.stage).top)||0;
      const available=Math.min(innerHeight,visualViewport?.height||innerHeight);
      return font>=11.95 && study.stage.scrollHeight<=study.stage.clientHeight+1 && stage.height+inset<=available+1 && study.article.offsetHeight>stage.height;
    });
    studies.forEach((study,i)=>{if(study.enabled&&!fits[i])restore(study,'fit');});
    // Read unpinned article geometry after every fit decision has finished reflow.
    const geometry=studies.map(study=>({top:study.article.getBoundingClientRect().top+scrollY,height:study.article.getBoundingClientRect().height,stage:study.stage.getBoundingClientRect().height,inset:parseFloat(getComputedStyle(study.stage).top)||0}));
    studies.forEach((study,i)=>{
      Object.assign(study,{top:geometry[i].top,distance:geometry[i].height-geometry[i].stage,inset:geometry[i].inset,last:-1});
      if(study.enabled) delete study.article.dataset.assemblyFallback;
    });
    const focused=studies.find(study=>study.enabled&&(document.activeElement===study.cta||document.activeElement===study.article.querySelector('.assembly-end')));
    if(focused) scrollTo({top:focused.top-focused.inset+focused.distance*.9,behavior:'instant'});
    measuring=false;
  }
  function update() {
    frame=0;
    if(document.hidden)return;
    if(dirty){dirty=false;measure();}
    const y=scrollY;
    for(const study of studies) {
      if(!study.enabled)continue;
      try {
        // Endpoint reconciliation also handles jumps across multiple articles. Once
        // clamped, distant studies incur no per-node writes on subsequent scrolls.
        render(study,clamp((y-(study.top-study.inset))/study.distance));
      } catch {study.failed=true;restore(study,'initialization');dirty=true;schedule();}
    }
  }
  function schedule() {if(!frame&&!document.hidden)frame=requestAnimationFrame(update);}
  function invalidate() {dirty=true;schedule();}
  on(window,'scroll',schedule);
  on(window,'resize',()=>{
    // Ignore chrome-only height changes on mobile. Width/orientation and desktop
    // resizing invalidate real geometry; svh keeps the scroll budget stable.
    if(innerWidth!==width || (innerWidth>700&&innerHeight!==height)) {width=innerWidth;height=innerHeight;invalidate();}
    else schedule();
  });
  on(window,'orientationchange',invalidate);
  on(window,'pageshow',invalidate);
  on(document,'visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(frame);frame=0;}
    else invalidate();
  });
  on(reduced,'change',invalidate);
  on(visualViewport||window,'resize',()=>{
    // A keyboard/toolbar may reduce available room. Only downgrade for genuine
    // obstruction; ordinary browser chrome movement does not rebuild the track.
    const obstructed=studies.some(s=>s.enabled&&s.stage.clientHeight+s.inset>(visualViewport?.height||innerHeight)+1);
    if(obstructed)invalidate();
  });
  const sizes=new WeakMap<Element,string>();
  const observer=new ResizeObserver(entries=>{
    if(measuring)return;
    let changed=false;
    for(const entry of entries){const size=`${entry.contentRect.width}:${entry.contentRect.height}`;if(sizes.has(entry.target)&&sizes.get(entry.target)!==size)changed=true;sizes.set(entry.target,size);}
    if(changed)invalidate();
  });
  for(const study of studies) {
    observer.observe(study.article.querySelector('.assembly-introduction')!);
    observer.observe(study.article.querySelector('.assembly-caption')!);
  }
  document.fonts.ready.then(()=>{if(!signal.aborted)invalidate();});
  on(document.fonts,'loadingdone',invalidate);
  dispose=()=>{abort.abort();observer.disconnect();cancelAnimationFrame(frame);};
  on(window,'pagehide',()=>{cancelAnimationFrame(frame);frame=0;});
  update();
}
