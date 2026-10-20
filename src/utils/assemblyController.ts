import type { ProjectPreview } from '../data/projectPreviews';
import { cacheRoute, clamp, createAssemblyTimeline, intervalProgress, nodePosition, nodeProgress, phase, routePath, routeTip, sceneBounds, validatePreview } from './projectAssembly';

type Wire = { path:SVGPathElement; head:SVGPathElement; targetIndex:number; authored:ProjectPreview['edges'][number]['desktop']; route:ReturnType<typeof cacheRoute>; label:SVGTextElement|null };
type Layout = { svg:SVGSVGElement; nodes:SVGGElement[]; wires:Wire[]; packets:SVGPathElement[]; animations:Animation[]; kind:'desktop'|'mobile' };
type Study = { article:HTMLElement; stage:HTMLElement; cta:HTMLAnchorElement; completion:HTMLElement;
  visible:boolean;
  preview:ProjectPreview; timeline:ReturnType<typeof createAssemblyTimeline>; layouts:Layout[]; enabled:boolean; failed:boolean; top:number; distance:number; inset:number; last:number };
const FLOW_TRAVEL_MS=900;
const FLOW_GAP_MS=180;
const FLOW_REST_MS=900;
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
  function syncFlow(study:Study) {
    const complete=study.enabled&&study.last>=.8&&!reduced.matches;
    study.article.toggleAttribute('data-assembly-flow',complete);
    for(const layout of study.layouts) {
      const running=complete&&study.visible&&!document.hidden&&
        (layout.kind==='mobile')===(innerWidth<=700);
      // Browser-owned dash animations leave the scroll geometry untouched and
      // pause without per-frame JS work when the stage is hidden or offscreen.
      if(running&&!layout.animations.length) {
        const order=study.timeline.wires.map((interval,index)=>({start:interval.start,index})).sort((a,b)=>a.start-b.start);
        const duration=order.length*(FLOW_TRAVEL_MS+FLOW_GAP_MS)+FLOW_REST_MS;
        for(const [slot,{index}] of order.entries()) {
          const start=slot*(FLOW_TRAVEL_MS+FLOW_GAP_MS)/duration;
          const end=start+FLOW_TRAVEL_MS/duration;
          const animation=layout.packets[index].animate([
            {offset:0,strokeDashoffset:'.06',opacity:0},
            {offset:start,strokeDashoffset:'.06',opacity:0},
            {offset:start+.008,strokeDashoffset:'0',opacity:1},
            {offset:end-.008,strokeDashoffset:'-.94',opacity:1},
            {offset:end,strokeDashoffset:'-1',opacity:0},
            {offset:1,strokeDashoffset:'-1',opacity:0},
          ],{duration,iterations:Infinity,easing:'linear'});
          animation.currentTime=0;
          layout.animations.push(animation);
        }
      }
      for(const animation of layout.animations) {
        if(running&&animation.playState!=='running')animation.play();
        else if(!running&&animation.playState!=='paused')animation.pause();
        if(!complete)animation.currentTime=0;
      }
    }
  }
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
    // restored for static mode. Each arrival and connector has an exclusive interval.
    for(const layout of study.layouts) {
      if(study.enabled && !force && (layout.kind==='mobile')!==(innerWidth<=700)) continue;
      const current=study.enabled?p:1;
      layout.svg.setAttribute('viewBox',sceneBounds(layout.kind).join(' '));
      const positions=new Map(study.preview.nodes.map((node,index)=>[node.id,nodePosition(node,layout.kind,current,study.timeline.nodes[index])]));
      const activeWire=study.enabled?study.timeline.wires.findIndex(interval=>p>interval.start&&p<interval.end):-1;
      layout.nodes.forEach((element,i)=>{
        const point=positions.get(study.preview.nodes[i].id)!;
        element.setAttribute('transform',`translate(${point.x} ${point.y})`);
        const progress=nodeProgress(current,study.timeline.nodes[i]);
        element.style.opacity=String(progress);
        const focused=study.enabled&&((progress>0&&progress<1)||(activeWire>=0&&layout.wires[activeWire].targetIndex===i));
        element.toggleAttribute('data-assembly-focus',focused);
      });
      for(const [index,wire] of layout.wires.entries()) {
        const t=study.enabled?intervalProgress(p,study.timeline.wires[index]):1;
        // Both endpoints are settled throughout this exclusive connection interval.
        const points=wire.authored;
        const route=wire.route;
        wire.path.parentElement!.toggleAttribute('data-assembly-active',study.enabled&&t>0&&t<1);
        const tip=routeTip(route,t);
        const distance=t*route.length;
        const trail=t>=1?points:[points[0],...route.segments
          .filter(segment=>segment.start>0&&segment.start<distance)
          .map(segment=>segment.from),{x:tip.x,y:tip.y}];
        wire.path.setAttribute('d',routePath(trail));
        wire.path.dataset.assemblyWireProgress=String(t);
        wire.path.style.visibility=t<=0?'hidden':'visible';
        wire.head.style.visibility=t<=0?'hidden':'visible';
        if(wire.label)wire.label.style.visibility=t>=1?'visible':'hidden';
        wire.head.setAttribute('transform',`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`);
      }
    }
    const complete=!study.enabled||p>=.8;
    study.completion.style.visibility=complete?'visible':'hidden';
    if(complete) {study.cta.removeAttribute('tabindex');study.cta.removeAttribute('aria-hidden');}
    else {study.cta.tabIndex=-1;study.cta.setAttribute('aria-hidden','true');}
    syncFlow(study);
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
        const packets=Array.from(svg.querySelectorAll<SVGPathElement>('[data-assembly-packet]'));
        if(nodes.length!==preview.nodes.length||paths.length!==preview.edges.length||heads.length!==paths.length||packets.length!==paths.length) throw Error('Incomplete drawing');
        const wires=paths.map((path,i)=>{
          const edge=preview.edges[i];
          const kind=svg.dataset.assemblyLayout as Layout['kind'];
          const route=cacheRoute(edge[kind]);
          const length=route.length;
          if(!Number.isFinite(length)||length<=0) throw Error('Invalid route length');
          const targetIndex=preview.nodes.findIndex(n=>n.id===edge.to);
          return {path,head:heads[i],targetIndex,authored:edge[svg.dataset.assemblyLayout as Layout['kind']],route,label:path.parentElement!.querySelector<SVGTextElement>('[data-assembly-relationship]')};
        });
        return {svg,nodes,wires,packets,animations:[],kind:svg.dataset.assemblyLayout as Layout['kind']};
      });
      const study:Study={article,preview,timeline:createAssemblyTimeline(preview),layouts,stage:article.querySelector('[data-assembly-stage]')!,cta:article.querySelector('[data-assembly-cta]')!,completion:article.querySelector('[data-assembly-completion]')!,visible:false,enabled:false,failed:false,top:0,distance:0,inset:0,last:-1};
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
      const rect=svg.getBoundingClientRect(), bounds=sceneBounds(innerWidth<=700?'mobile':'desktop');
      // Check label readability at the fixed finished-graph scale.
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
  on(window,'pageshow',()=>{
    for(const study of studies) {
      const rect=study.stage.getBoundingClientRect();
      study.visible=rect.bottom>0&&rect.top<innerHeight;
    }
    invalidate();
  });
  on(document,'visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(frame);frame=0;}
    else invalidate();
    for(const study of studies)syncFlow(study);
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
  const visibility=new IntersectionObserver(entries=>{
    for(const entry of entries) {
      const study=studies.find(study=>study.stage===entry.target);
      if(study){study.visible=entry.isIntersecting;syncFlow(study);}
    }
  });
  for(const study of studies)visibility.observe(study.stage);
  dispose=()=>{
    abort.abort();observer.disconnect();visibility.disconnect();cancelAnimationFrame(frame);
    for(const study of studies)for(const layout of study.layouts)for(const animation of layout.animations)animation.cancel();
  };
  on(window,'pagehide',()=>{
    cancelAnimationFrame(frame);frame=0;
    for(const study of studies){study.visible=false;syncFlow(study);}
  });
  update();
}
