// Illustrative preview content only. Replace with owner-reviewed architecture later.
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
      edge('guard-runner','guard','runner',1,points(440,97,495,97),points(249,72,249,87,87,87,87,102)),
      edge('schedule-runner','scheduler','runner',1,points(440,305,470,305,470,122,495,122),points(180,132,162,132)),
      edge('runner-sandbox','runner','sandbox',2,points(685,97,750,97),points(87,162,87,192)),
      edge('sandbox-output','sandbox','output',2,points(840,144,840,255),points(162,223,180,223)),
      edge('output-status','output','dashboard',3,points(750,305,685,305),points(249,254,249,275,165,275,165,292)),
    ],
  },
  '02': {
    ...meta('02','Portfolio Website','Astro delivers pages to the browser. Browser interactions update the project view. Browser requests go to the chat API, whose response returns to the assistant view. Modules and fields are illustrative.'),
    nodes:[
      node('browser','Browser shell',0,box(370,35,220,82,0,-120),box(79,12,172,62,0,-65),['Navigation / document'], 'browser'),
      node('projects','Project view',1,box(40,170,230,94,-130,10),box(12,121,142,68,-12,12),['Search / categories','Gallery / list']),
      node('assistant','Assistant view',2,box(690,170,230,94,140,20),box(176,121,142,68,12,50),['Conversation','Message composer']),
      node('pages','Astro pages',3,box(60,305,200,66,-100,115),box(12,267,138,65,-12,95),['HTML / assets']),
      node('interactions','Interactions',3,box(370,305,220,66,10,110),box(176,225,142,48,12,65),['Filter / select']),
      node('api','Chat API',3,box(700,305,200,66,160,105),box(176,306,142,44,12,100),['/api/chat']),
    ],
    edges:[
      edge('page-delivery','pages','browser',0,points(60,338,18,338,18,76,370,76),points(12,300,3,300,3,43,79,43)),
      edge('browser-projects','browser','projects',1,points(400,117,400,140,155,140,155,170),points(110,74,110,98,83,98,83,121)),
      edge('browser-assistant','browser','assistant',1,points(560,117,560,140,805,140,805,170),points(220,74,220,98,247,98,247,121)),
      edge('project-controls','projects','interactions',1,points(270,217,480,217,480,305),points(154,170,165,170,165,249,176,249)),
      edge('api-request','browser','api',2,points(590,76,945,76,945,338,900,338),points(251,43,324,43,324,328,318,328)),
      { ...edge('api-response','api','assistant',3,points(805,305,805,264),points(176,328,160,328,160,205,247,205,247,189), 'Response'), labelAt: { desktop: { x:817, y:287 }, mobile: { x:185, y:218 } } },
    ],
  },
  '04': {
    ...meta('04','AI Models Finder','Multiple benchmark sources provide verified scores across several metrics. A recommendation algorithm matches those metrics to user needs and requirements, producing model rankings for comparison and selection. This feature-based architecture is illustrative.'),
    nodes:[
      node('sources','Benchmarks',0,box(25,50,180,94,-20,0),box(12,12,138,60,0,-10),['Multiple sources','Model benchmark results']),
      node('scores','Verified scores',0,box(260,50,180,94,-20,0),box(180,12,138,60,-10,0),['Verified benchmarks','Model / score / source']),
      node('metrics','Metric coverage',1,box(495,50,190,94,-20,0),box(12,102,138,60,0,-10),['Multiple measures','Use-case relevance']),
      node('needs','User needs',1,box(260,255,180,100,0,-18),box(180,102,138,60,0,-10),['Use cases / requirements']),
      node('recommend','Recommendation',2,box(495,255,190,100,0,-18),box(12,192,150,62,0,-10),['Matching algorithm','Needs + benchmark scores']),
      node('rankings','Model rankings',2,box(750,145,180,94,-20,0),box(180,192,138,62,-8,0),['Ranked model matches','Benchmark-based scores']),
      node('compare','Compare models',3,box(750,285,180,94,0,-18),box(79,292,172,62,0,-10),['Review metrics / fit','Choose a model']),
    ],
    edges:[
      edge('source-scores','sources','scores',0,points(205,97,260,97),points(150,42,180,42)),
      edge('scores-metrics','scores','metrics',1,points(440,97,495,97),points(249,72,249,87,81,87,81,102)),
      edge('metrics-recommend','metrics','recommend',2,points(590,144,590,255),points(81,162,81,192)),
      edge('needs-recommend','needs','recommend',2,points(440,305,495,305),points(180,132,168,132,168,177,132,177,132,192)),
      edge('recommend-rankings','recommend','rankings',3,points(685,305,715,305,715,192,750,192),points(162,223,180,223)),
      edge('rankings-compare','rankings','compare',3,points(840,239,840,285),points(249,254,249,275,165,275,165,292)),
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
      edge('schedule-worker','schedule','worker',1,points(115,255,115,195,535,195,535,134),points(81,138,81,147,115,147,115,156)),
      edge('plugins-worker','plugins','worker',2,points(350,255,350,220,625,220,625,134),points(249,138,249,147,215,147,215,156)),
      edge('worker-jobs','worker','jobs',2,points(685,87,750,87),points(165,210,165,228)),
      edge('jobs-sqlite','jobs','sqlite',3,points(840,134,840,255),points(125,282,125,291,81,291,81,300)),
      edge('jobs-audit','jobs','audit',3,points(750,112,715,112,715,305,685,305),points(205,282,205,291,249,291,249,300)),
    ],
  },
};
