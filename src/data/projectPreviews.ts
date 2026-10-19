// Illustrative preview content only. Replace with owner-reviewed architecture later.
export type Point = { x: number; y: number };
export type Placement = Point & { w: number; h: number; dx: number; dy: number };
export type PreviewNode = {
  id: string; label: string; details: string[]; group: number;
  shape: 'module' | 'store' | 'browser'; desktop: Placement; mobile: Placement;
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
    ...meta('01','Agentic AI Assistant','Requests pass through a prompt guard into a Docker sandbox. A scheduler also feeds the sandbox; execution status flows to a dashboard. Internal fields are illustrative.'),
    nodes:[
      node('request','Request input',0,box(35,155,155,94,-120,-170),box(12,16,138,65,-12,-55),['Task / context','Execution scope']),
      node('guard','Prompt guard',1,box(245,155,170,94,-70,125),box(180,16,138,65,12,-25),['Validate input','Check permissions']),
      node('sandbox','Docker sandbox',2,box(485,155,200,94,50,-145),box(12,145,160,74,-12,55),['Isolated execution','Run / capture / exit']),
      node('scheduler','Scheduler',2,box(495,305,180,66,90,60),box(200,151,118,62,12,80),['Queued tasks']),
      node('dashboard','Status dashboard',3,box(750,155,180,94,160,145),box(12,278,210,65,5,110),['Run state / output','Activity history']),
    ],
    edges:[
      edge('request-guard','request','guard',0,points(190,202,245,202),points(150,48,180,48)),
      edge('guard-sandbox','guard','sandbox',1,points(415,202,485,202),points(249,81,249,111,92,111,92,145)),
      edge('schedule-sandbox','scheduler','sandbox',2,points(585,305,585,249),points(200,182,172,182)),
      edge('sandbox-status','sandbox','dashboard',3,points(685,202,750,202),points(92,219,92,278)),
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
  '03': {
    ...meta('03','Task Automation Bot','File rules and a schedule feed a CLI worker. The worker writes SQLite rollback records and an audit output. Storage and audit are illustrative outputs, not a verified separate service boundary.'),
    nodes:[
      node('rules','File rules',0,box(40,65,210,94,-125,-100),box(12,18,138,68,-12,-50),['Match / classify','Example: *.pdf → docs']),
      node('schedule','Schedule',1,box(40,265,210,80,-130,130),box(180,18,138,68,12,-15),['Backup / recurring jobs']),
      node('worker','CLI worker',2,box(370,155,220,100,35,-90),box(79,145,172,76,0,40),['Read → plan → execute','Task / result / rollback']),
      node('sqlite','SQLite log',3,box(720,65,200,94,160,-100),box(12,280,138,62,-12,95),['Rollback records','Local persistence'],'store'),
      node('audit','Audit output',3,box(720,265,200,80,150,135),box(180,280,138,62,12,110),['Time / task / result']),
    ],
    edges:[
      edge('rules-worker','rules','worker',0,points(250,112,310,112,310,185,370,185),points(81,86,81,116,125,116,125,145)),
      edge('schedule-worker','schedule','worker',1,points(250,305,330,305,330,225,370,225),points(249,86,249,116,205,116,205,145)),
      edge('worker-sqlite','worker','sqlite',2,points(590,185,640,185,640,112,720,112),points(125,221,125,249,81,249,81,280)),
      edge('worker-audit','worker','audit',3,points(590,225,660,225,660,305,720,305),points(205,221,205,249,249,249,249,280)),
    ],
  },
};
