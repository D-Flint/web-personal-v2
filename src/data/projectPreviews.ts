// Shared schematic data. Illustrative and source-based studies are marked individually.
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
    ...meta('01','Agentic AI Assistant','Aether is a local, single-user workbench. The browser uses same-origin FastAPI routes with passcode sessions and CSRF checks. The chat service persists transcripts, sources and receipts in PostgreSQL and starts persistent, read-only Codex threads with retrieval-only memory MCP. Separately, exact-task passcode grants authorize a durable queue; a local manager polls eligible tasks and launches one Codex child at a time. Task Codex uses coordination and memory MCP, may delegate scoped workers, and saves reviewed results and events. Bounded Ollama vault actions form a third execution path. Vault Markdown remains canonical; ingestion indexes allowed notes in the shared Docker-hosted PostgreSQL/pgvector store using hybrid keyword and deterministic hash-vector retrieval. Task and Ollama writes are scoped. Store connections summarize service persistence and retrieval, not a direct browser database connection. The optional, separately gated remote-access overlay is omitted. This schematic summarizes inspected source, not deployment verification.'),
    caption: 'Source-based architecture · Aether',
    illustrative: false,
    nodes:[
      node('browser','Aether browser',0,box(25,30,180,94,-20,0),box(12,12,138,60,0,-10),['Chat / tasks / memory','Same-origin API'],'browser'),
      { ...node('api','FastAPI',0,box(260,30,200,94,-20,0),box(180,12,138,60,-10,0),['Passcode / session / CSRF','Single local web worker']), emphasis: 'primary' },
      node('chat','Chat service',1,box(515,30,190,94,-20,0),box(12,102,138,60,0,-10),['Persistent Codex threads','Read-only memory MCP']),
      node('manager','Task manager',1,box(260,160,200,94,0,-18),box(180,102,138,60,0,-10),['Authorized task queue','One Codex child at a time']),
      node('ollama','Local Ollama',2,box(25,280,180,94,0,-18),box(12,192,138,60,10,0),['Separate bounded runs','Local model / vault actions']),
      { ...node('tasks','Codex tasks',2,box(515,160,190,94,-20,0),box(180,192,138,60,0,-10),['Task + memory MCP','Review / optional workers']), emphasis: 'primary' },
      node('vault','Canonical vault',3,box(260,280,200,94,-20,0),box(12,292,138,62,0,-10),['Canonical Markdown files','Scoped writes / ingestion'],'store'),
      node('database','PostgreSQL',3,box(750,160,185,94,0,-18),box(180,292,138,62,-10,0),['Docker + pgvector','Chat / tasks / memories'],'store'),
    ],
    edges:[
      edge('browser-api','browser','api',0,points(205,77,260,77),points(150,42,180,42)),
      edge('api-chat','api','chat',1,points(460,77,515,77),points(249,72,249,87,81,87,81,102)),
      edge('api-manager','api','manager',1,points(360,124,360,160),points(249,72,249,102)),
      edge('api-ollama','api','ollama',2,points(360,30,360,12,12,12,12,327,25,327),points(249,12,249,3,3,3,3,222,12,222)),
      edge('manager-tasks','manager','tasks',2,points(460,207,515,207),points(249,162,249,192)),
      edge('ollama-vault','ollama','vault',3,points(205,327,260,327),points(81,252,81,262,59,262,59,292)),
      edge('tasks-vault','tasks','vault',3,points(610,254,610,270,360,270,360,280),points(224,252,224,272,103,272,103,292)),
      edge('chat-database','chat','database',3,points(705,77,842.5,77,842.5,160),points(81,162,81,177,168,177,168,311,180,311)),
      edge('tasks-database','tasks','database',3,points(705,207,750,207),points(274,252,274,272,249,272,249,292)),
      edge('vault-database','vault','database',3,points(460,327,842.5,327,842.5,254),points(150,323,162,323,162,335,180,335)),
    ],
  },
  '02': {
    ...meta('02','Portfolio Website','Project records, schematic graphs, Astro templates and theme CSS feed an Astro 7 build. The Vercel adapter emits prerendered home, projects, resume standby and 404 pages with static assets, plus a serverless POST /api/chat function. Static delivery opens the browser shell. Vanilla JavaScript handles project search, category and technology filters, Gallery/List views, detail dialogs, canvas particles and schematic motion locally. The assistant keeps completed conversation history in page memory and sends bounded messages to the chat API. The API validates input, enforces per-instance request budgets and calls DeepSeek using a server-only key. DeepSeek SSE is decoded into plain text chunks for the browser; failures are explicit and retryable, with no keyword fallback. The separate contact form validates in the browser and posts directly to Web3Forms, retaining its draft on failure. UI/API and contact/provider links summarize request and result exchange; the two DeepSeek arrows distinguish inference requests from streamed replies. Theme and catalog view preferences use localStorage; there is no application database. This schematic summarizes inspected source, not production deployment or external delivery verification.'),
    caption: 'Source-based architecture · Portfolio',
    illustrative: false,
    nodes:[
      node('source','Project source',0,box(50,20,180,94,-20,0),box(12,12,138,54,0,-8),['Records / graphs','Templates / CSS / assets']),
      { ...node('build','Astro build',0,box(390,20,200,94,-20,0),box(180,12,138,54,-8,0),['Astro 7 / Tailwind v4','Prerender + Vercel adapter']), emphasis: 'primary' },
      node('delivery','Static delivery',1,box(730,20,180,94,-20,0),box(12,84,138,54,0,-8),['Vercel HTML / assets','Home / projects / resume']),
      { ...node('browser','Browser shell',1,box(390,153,200,94,0,-18),box(180,84,138,54,-8,0),['Navigation / theme','Vanilla JavaScript'], 'browser'), emphasis: 'primary' },
      node('interactions','Interactive UI',2,box(50,153,180,94,20,0),box(12,156,138,54,0,-8),['Projects / chat / canvas','Filters / dialogs / drawings']),
      node('contact','Contact form',2,box(730,153,180,94,0,-18),box(180,156,138,54,0,-8),['Validate / retain draft','Direct browser submission']),
      { ...node('api','Chat API',3,box(390,286,200,94,0,-18),box(12,228,138,54,0,-8),['/api/chat / serverless','Validate / limit / stream']), emphasis: 'primary' },
      node('web3forms','Web3Forms',3,box(730,286,180,94,0,-18),box(180,228,138,54,0,-8),['External form provider','Delivery result / retry']),
      node('deepseek','DeepSeek',3,box(50,286,180,94,20,0),box(79,300,172,54,0,-8),['External inference API','Server-only key / SSE']),
    ],
    edges:[
      edge('source-build','source','build',0,points(230,67,390,67),points(150,39,180,39)),
      edge('build-delivery','build','delivery',1,points(590,67,730,67),points(249,66,249,75,81,75,81,84)),
      edge('page-delivery','delivery','browser',1,points(820,114,820,134,490,134,490,153),points(150,111,180,111)),
      edge('browser-ui','browser','interactions',2,points(390,200,230,200),points(224,138,224,147,81,147,81,156)),
      edge('browser-contact','browser','contact',2,points(590,200,730,200),points(274,138,274,147,249,147,249,156)),
      edge('ui-api','interactions','api',3,points(140,247,140,266,490,266,490,286),points(81,210,81,228)),
      edge('contact-provider','contact','web3forms',3,points(820,247,820,286),points(249,210,249,228)),
      edge('inference-request','api','deepseek',3,points(390,313,230,313),points(59,282,59,327,79,327)),
      edge('inference-stream','deepseek','api',3,points(230,353,390,353),points(165,300,165,291,103,291,103,282)),
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
