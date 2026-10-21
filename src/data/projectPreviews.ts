// Shared schematic data. Illustrative studies are marked individually; record 04 is source-based.
export type Point = { x: number; y: number };
export type Placement = Point & { w: number; h: number; dx: number; dy: number };
export type PreviewNode = {
  id: string; label: string; details: string[]; group: number;
  shape: 'module' | 'store' | 'browser'; desktop: Placement; mobile: Placement;
  emphasis?: 'primary';
};
export type PreviewEdge = {
  id: string; from: string; to: string; group: number; label?: string; labelAt?: { desktop: Point; mobile: Point };
  desktop: Point[]; mobile: Point[];
};
export type ProjectPreview = {
  id: string; summary: string; caption: string; illustrative: boolean;
  cta: { href: string; label: string }; nodes: PreviewNode[]; edges: PreviewEdge[];
};
const box = (x:number,y:number,w:number,h:number,dx:number,dy:number): Placement => ({x,y,w,h,dx,dy});
const points = (...xy:number[]): Point[] => Array.from({length:xy.length/2},(_,i)=>({x:xy[i*2],y:xy[i*2+1]}));
const node = (id:string,label:string,group:number,desktop:Placement,mobile:Placement,details:string[],shape:PreviewNode['shape']='module'): PreviewNode => ({id,label,group,desktop,mobile,details,shape});
const edge = (id:string,from:string,to:string,group:number,desktop:Point[],mobile:Point[],label?:string): PreviewEdge => ({id,from,to,group,desktop,mobile,label});
const meta = (id:string,title:string,summary:string) => ({id,summary,caption:'Architecture schematic',illustrative:true,cta:{href:`/projects#project-${id}`,label:`View ${title}`}});
export const projectPreviews: Record<string, ProjectPreview> = {
  '01': {
    ...meta('01','Agentic AI Assistant','A request passes through the prompt injection guard to a task runner. Recurring tasks enter through the scheduler. The runner dispatches work into a Docker sandbox; captured output and exit state feed the status dashboard. Internal stages and fields are illustrative.'),
    nodes:[
      node('request','Request input',0,box(25,50,180,94,-20,0),box(12,12,138,60,0,-10),['Task / context','Execution scope']),
      node('guard','Prompt guard',0,box(260,50,180,94,-20,0),box(180,12,138,60,-10,0),['Screen task input','Prompt injection defense']),
      node('scheduler','Scheduler',1,box(260,255,180,100,0,-18),box(180,102,138,60,0,-10),['Recurring tasks','24/7 scheduling']),
      { ...node('runner','Task runner',1,box(495,50,190,94,-20,0),box(12,102,150,60,0,-10),['Dispatch guarded tasks','Scheduled + on-demand']), emphasis: 'primary' },
      { ...node('sandbox','Docker sandbox',2,box(750,50,180,94,-20,0),box(12,192,150,62,0,-10),['Isolated local execution','Run task / capture result']), emphasis: 'primary' },
      node('output','Run output',2,box(750,255,180,100,0,-18),box(180,192,138,62,-8,0),['Output / exit state','Execution result']),
      node('dashboard','Status dashboard',3,box(495,255,190,100,20,0),box(79,292,172,62,0,-10),['Live task state','Result / activity history']),
    ],
    edges:[
      edge('request-guard','request','guard',0,points(205,97,260,97),points(150,42,180,42)),
      edge('guard-runner','guard','runner',1,points(440,97,455,97,455,81,495,81),points(249,72,249,87,87,87,87,102)),
      edge('schedule-runner','scheduler','runner',1,points(440,305,470,305,470,113,495,113),points(180,132,162,132)),
      edge('runner-sandbox','runner','sandbox',2,points(685,97,750,97),points(87,162,87,192)),
      edge('sandbox-output','sandbox','output',2,points(840,144,840,255),points(162,223,180,223)),
      edge('output-status','output','dashboard',3,points(750,305,685,305),points(249,254,249,275,165,275,165,292)),
    ],
  },
  '02': {
    ...meta('02','Portfolio Website','Astro delivers pages to the browser. Browser interactions update the project view. Browser requests go to the chat API, whose response returns to the assistant view. Modules and fields are illustrative.'),
    nodes:[
      node('pages','Astro pages',0,box(24,148,180,94,-20,0),box(79,12,172,54,0,-10),['HTML / assets']),
      { ...node('browser','Browser shell',0,box(250,148,220,94,-20,0),box(79,94,172,62,0,-10),['Navigation / document'], 'browser'), emphasis: 'primary' },
      node('projects','Project view',1,box(510,38,190,94,-20,0),box(12,198,138,62,0,-10),['Search / categories','Gallery / list']),
      node('interactions','Interactions',1,box(800,38,150,94,-20,0),box(12,302,138,54,0,-10),['Filter / select']),
      node('assistant','Assistant view',2,box(510,258,190,94,-20,0),box(180,198,138,62,0,-10),['Conversation','Message composer']),
      { ...node('api','Chat API',3,box(800,258,150,94,0,-20),box(180,302,138,54,0,-10),['/api/chat']), emphasis: 'primary' },
    ],
    edges:[
      edge('page-delivery','pages','browser',0,points(204,195,250,195),points(165,66,165,94)),
      edge('browser-projects','browser','projects',1,points(360,148,360,85,510,85),points(110,156,110,177,81,177,81,198)),
      edge('project-controls','projects','interactions',1,points(700,85,800,85),points(81,260,81,302)),
      edge('browser-assistant','browser','assistant',2,points(360,242,360,305,510,305),points(220,156,220,177,249,177,249,198)),
      { ...edge('api-request','browser','api',3,points(470,195,958,195,958,305,950,305),points(251,125,327,125,327,329,318,329), 'Request'), labelAt: { desktop: { x:819, y:183 }, mobile: { x:276, y:286 } } },
      { ...edge('api-response','api','assistant',3,points(800,305,700,305),points(249,302,249,260), 'Response'), labelAt: { desktop: { x:719, y:291 }, mobile: { x:198, y:283 } } },
    ],
  },
  '04': {
    ...meta('04','AI Models Finder','Synapse ingests reviewed provider facts and prices, local LiveBench and BFCL snapshots, and OpenRouter, LMArena and SWE-bench feeds. A Node pipeline normalizes evidence, scores and validates records, then writes the reviewed JSON catalog; optional PostgreSQL persistence archives ingestion data. Catalog loading validates and enriches records, selects eligible LiveBench models and publishes verified entries only. Astro builds pages with React islands and prepared comparison JSON. Cloudflare serves static assets and a Worker for on-demand comparison pairs and crawler routes. In the browser, use cases, priorities, requirements and budget drive deterministic Finder recommendations; workload cost estimates also run locally over prepared catalog data. Browsing does not query PostgreSQL or call a model inference API. This schematic summarizes the inspected source, not deployment verification.'),
    caption: 'Source-based architecture · Synapse',
    illustrative: false,
    nodes:[
      node('sources','Source evidence',0,box(25,30,180,94,-20,0),box(12,12,138,54,0,-8),['Provider facts / prices','LiveBench / BFCL + feeds']),
      { ...node('pipeline','Data pipeline',0,box(260,30,200,94,-20,0),box(180,12,138,54,-8,0),['Normalize / score / validate','Write reviewed JSON']), emphasis: 'primary' },
      node('archive','Optional archive',1,box(25,160,180,94,0,-18),box(12,84,138,54,0,-8),['PostgreSQL / Drizzle','Ingestion history only'],'store'),
      { ...node('catalog','Public catalog',1,box(515,30,190,94,-20,0),box(180,84,138,54,0,-8),['Validated / verified only','LiveBench-selected models']), emphasis: 'primary' },
      node('build','Astro build',2,box(750,30,185,94,-20,0),box(12,156,138,54,0,-8),['HTML + React islands','Prepared comparison JSON']),
      node('delivery','Cloudflare',2,box(750,160,185,94,0,-18),box(180,156,138,54,-8,0),['Static assets + Worker','On-demand pair pages']),
      node('browser','Browser',2,box(515,160,190,94,20,0),box(180,228,138,54,0,-8),['Explore / rank / compare','Hydrated React islands'],'browser'),
      node('needs','User needs',3,box(260,280,200,94,-20,0),box(12,228,138,54,0,-8),['Use cases / priorities','Requirements / budget']),
      { ...node('decisions','Local decisions',3,box(515,280,190,94,0,-18),box(79,300,172,54,0,-8),['Finder + cost estimates','Catalog-based calculations']), emphasis: 'primary' },
    ],
    edges:[
      edge('source-pipeline','sources','pipeline',0,points(205,77,260,77),points(150,39,180,39)),
      edge('pipeline-archive','pipeline','archive',1,points(360,124,360,142,115,142,115,160),points(224,66,224,75,81,75,81,84)),
      edge('pipeline-catalog','pipeline','catalog',1,points(460,77,515,77),points(274,66,274,75,249,75,249,84)),
      edge('catalog-build','catalog','build',2,points(705,77,750,77),points(249,138,249,147,81,147,81,156)),
      edge('build-delivery','build','delivery',2,points(842.5,124,842.5,160),points(150,183,180,183)),
      edge('delivery-browser','delivery','browser',2,points(750,207,705,207),points(249,210,249,228)),
      edge('browser-decisions','browser','decisions',3,points(610,254,610,280),points(249,282,249,291,205,291,205,300)),
      edge('needs-decisions','needs','decisions',3,points(460,327,515,327),points(81,282,81,291,125,291,125,300)),
    ],
  },
  '03': {
    ...meta('03','Task Automation Bot','A file watcher feeds classification rules, while a cron-style schedule supplies recurring jobs to the Typer CLI worker. Custom plugins extend the worker. File organization, backups and email jobs produce SQLite rollback records and audit output. Internal stages and storage relationships are illustrative.'),
    nodes:[
      node('watcher','File watcher',0,box(25,40,180,94,-20,0),box(12,12,138,54,0,-8),['Watch file changes','Discover incoming files']),
      node('rules','File rules',0,box(260,40,180,94,-20,0),box(180,12,138,54,-8,0),['Match / classify','Example: *.pdf → docs']),
      node('schedule','Schedule',1,box(25,255,180,100,0,-18),box(12,84,138,54,0,-8),['Cron-style jobs','Recurring backups / email']),
      node('plugins','Custom plugins',2,box(260,255,180,100,0,-18),box(180,84,138,54,0,-8),['Automation modules','Extend task behavior']),
      { ...node('worker','CLI worker',1,box(495,40,190,94,-20,0),box(79,156,172,54,0,-8),['Typer command entry','Plan / dispatch tasks']), emphasis: 'primary' },
      { ...node('jobs','Job execution',2,box(750,40,180,94,-20,0),box(79,228,172,54,0,-8),['Organize / backup / email','Run selected operation']), emphasis: 'primary' },
      node('sqlite','SQLite log',3,box(750,255,180,100,0,-18),box(12,300,138,54,0,-8),['Task / change records','Rollback support'],'store'),
      node('audit','Audit output',3,box(495,255,190,100,20,0),box(180,300,138,54,0,-8),['Time / task / result','Review run history']),
    ],
    edges:[
      edge('watcher-rules','watcher','rules',0,points(205,87,260,87),points(150,39,180,39)),
      edge('rules-worker','rules','worker',1,points(440,87,495,87),points(249,66,249,75,165,75,165,156)),
      edge('schedule-worker','schedule','worker',1,points(115,255,115,195,545,195,545,134),points(81,138,81,147,115,147,115,156)),
      edge('plugins-worker','plugins','worker',2,points(350,255,350,220,635,220,635,134),points(249,138,249,147,215,147,215,156)),
      edge('worker-jobs','worker','jobs',2,points(685,87,750,87),points(165,210,165,228)),
      edge('jobs-sqlite','jobs','sqlite',3,points(885,134,885,195,840,195,840,255),points(125,282,125,291,81,291,81,300)),
      edge('jobs-audit','jobs','audit',3,points(795,134,795,195,715,195,715,305,685,305),points(205,282,205,291,249,291,249,300)),
    ],
  },
};
