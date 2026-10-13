// ──────────────────────────────────────────────────────────────────────────────
//  techDetails.ts — Grand Narukami Technology Decision & Rationale Matrix
// ──────────────────────────────────────────────────────────────────────────────
//  Provides curated architectural deep dives explaining *why* specific tools
//  and technologies were selected for each project.
// ──────────────────────────────────────────────────────────────────────────────

export interface TechDeepDive {
  name: string;
  category: string;
  whyChosen: string;
  integrationRole: string;
  keyAdvantage: string;
  ecosystemTier: string;
}

const TECH_DATABASE: Record<string, TechDeepDive> = {
  'Astro': {
    name: 'Astro 7',
    category: 'Meta-Framework & Static Islands',
    whyChosen: 'Selected for its zero-JavaScript by default architecture and Component Islands model. It compiles content into pure static HTML while hydrating only interactive components on demand, guaranteeing sub-50ms TTFB and near-perfect Lighthouse scores.',
    integrationRole: 'Orchestrates static page pre-rendering (`/`, `/projects`), asset optimization pipeline, and serverless edge API routing (`/api/chat`).',
    keyAdvantage: 'Sub-0.03 Cumulative Layout Shift (CLS) and minimal client-side JS bundle overhead.',
    ecosystemTier: 'Modern Jamstack & Islands Architecture',
  },
  'React': {
    name: 'React 19',
    category: 'Reactive UI & State Engine',
    whyChosen: 'Chosen for its declarative component hierarchy, predictable unidirectional data flow, and battle-tested Virtual DOM reconciliation for high-frequency interactive interfaces and state machines.',
    integrationRole: 'Drives interactive algorithm visualizations, real-time client state management, dynamic chart updates, and fine-grained UI reactivity.',
    keyAdvantage: 'Rich ecosystem, reusable hook abstractions, and efficient DOM patch scheduling.',
    ecosystemTier: 'Front-End UI Standard',
  },
  'TypeScript': {
    name: 'TypeScript',
    category: 'Type Safety & Static Analysis',
    whyChosen: 'Adopted to eliminate runtime type errors, ensure contract safety across client-server boundaries, and provide rich IDE intellisense with fearless refactoring across complex domain models.',
    integrationRole: 'Enforces strict types across project models, API payloads, state machines, and event bus payloads throughout the codebase.',
    keyAdvantage: 'Zero-runtime overhead static type checking preventing null/undefined edge cases.',
    ecosystemTier: 'Industry Standard Type System',
  },
  'Tailwind CSS': {
    name: 'Tailwind CSS v4',
    category: 'Design Systems & Utility Styling',
    whyChosen: 'Selected for its high-performance CSS-first engine (@tailwindcss/vite), dynamic JIT stylesheet generation, and seamless support for custom `@custom-variant` dark mode theming without runtime CSS-in-JS penalties.',
    integrationRole: 'Powers the entire Grand Narukami dark glassmorphism design system, specular bevels, responsive reflow, and fluid micro-interactions.',
    keyAdvantage: 'Zero specificity wars, tiny production bundle sizes, and rapid design system iteration.',
    ecosystemTier: 'Design System & Utility CSS Core',
  },
  'C++': {
    name: 'C++17 / C++20',
    category: 'Systems & High-Performance Compute',
    whyChosen: 'Chosen for bare-metal CPU execution speed, deterministic RAII memory management, and zero-cost abstractions needed for high-throughput CLI utilities and graph algorithms.',
    integrationRole: 'Implements core algorithms, DAG task scheduling, persistent SQLite wrappers, and high-efficiency mathematical computations.',
    keyAdvantage: 'Direct hardware and memory control with predictable microsecond-level latency.',
    ecosystemTier: 'High-Performance Systems Programming',
  },
  'CMake': {
    name: 'CMake',
    category: 'Systems Build Tooling',
    whyChosen: 'Selected as the industry standard cross-platform build system to standardize compiler flags, multi-target linking, and automated dependency fetching via `FetchContent`.',
    integrationRole: 'Orchestrates multi-file C++ compilation, test runners, and binary packaging across Windows, Linux, and macOS.',
    keyAdvantage: 'Hermetic, reproducible C++ build pipeline with clean modular target definitions.',
    ecosystemTier: 'Cross-Platform Build Standard',
  },
  'Python': {
    name: 'Python 3',
    category: 'AI, Data Science & Automation',
    whyChosen: 'Chosen for its expressive syntax, asynchronous I/O capabilities (`asyncio`), and unrivaled ecosystem for machine learning, agentic reasoning, and terminal scripting.',
    integrationRole: 'Powers agentic orchestration loops, data preprocessing pipelines, CLI automation bots, and model training routines.',
    keyAdvantage: 'Rapid development velocity paired with C-accelerated numeric backends (NumPy, scikit-learn).',
    ecosystemTier: 'AI & Data Science Standard',
  },
  'Docker': {
    name: 'Docker & Containers',
    category: 'Containerization & Sandboxing',
    whyChosen: 'Selected to enforce hermetic sandboxing for untrusted code execution and eliminate environment discrepancies across local development and production VMs.',
    integrationRole: 'Isolates Python interpreter runs, filesystem tools, and multi-container services via Docker Compose.',
    keyAdvantage: 'Airtight security isolation with cgroups resource boundaries and repeatable runtime images.',
    ecosystemTier: 'Cloud-Native Container Standard',
  },
  'FastAPI': {
    name: 'FastAPI',
    category: 'Asynchronous API Framework',
    whyChosen: 'Selected for its native Python `async`/`await` performance on Starlette, automatic Pydantic request validation, and self-generating OpenAPI Swagger documentation.',
    integrationRole: 'Serves low-latency REST endpoints for machine learning model inference and asynchronous batch processing.',
    keyAdvantage: 'Sub-15ms endpoint latency with automated type validation and schema serialization.',
    ecosystemTier: 'High-Performance Python Web API',
  },
  'scikit-learn': {
    name: 'scikit-learn',
    category: 'Machine Learning & Predictive Modeling',
    whyChosen: 'Adopted for its standardized estimator API, battle-tested preprocessing transformers, and rigorous statistical modeling implementations.',
    integrationRole: 'Drives feature scaling, one-hot encoding pipelines, cross-validation, and production inference estimators.',
    keyAdvantage: 'Clean composable `Pipeline` architecture with Cython-accelerated computation.',
    ecosystemTier: 'Classical Machine Learning Standard',
  },
  'TensorFlow.js': {
    name: 'TensorFlow.js',
    category: 'Client-Side AI & WebGL Acceleration',
    whyChosen: 'Selected to execute deep learning models directly in the user’s browser using WebGL/WebGPU shaders, eliminating server inference costs and preserving user privacy.',
    integrationRole: 'Runs real-time on-device computer vision classification and bounding-box detection.',
    keyAdvantage: '100% private client-side inference with zero server operational costs or network latency.',
    ecosystemTier: 'Edge AI & Browser Machine Learning',
  },
  'Node.js': {
    name: 'Node.js',
    category: 'Server Runtime & Network I/O',
    whyChosen: 'Chosen for its high-concurrency non-blocking event loop powered by Google V8, enabling unified JavaScript/TypeScript development across the entire full-stack pipeline.',
    integrationRole: 'Powers backend REST APIs, WebSocket gateways, and SSR application servers.',
    keyAdvantage: 'Massive asynchronous I/O scalability and access to the world\'s largest module registry.',
    ecosystemTier: 'Enterprise JavaScript Server Runtime',
  },
  'Express': {
    name: 'Express.js',
    category: 'Web Application Framework',
    whyChosen: 'Selected for its lightweight, unopinionated routing layer and modular middleware chaining architecture.',
    integrationRole: 'Coordinates HTTP routing, JWT authentication filters, and error-handling pipelines.',
    keyAdvantage: 'Minimalist core with maximum flexibility and battle-tested production stability.',
    ecosystemTier: 'Node.js Web Framework Standard',
  },
  'PostgreSQL': {
    name: 'PostgreSQL',
    category: 'Relational Database Management',
    whyChosen: 'Chosen for its rock-solid ACID guarantees, advanced relational indexing (B-tree, GIN), and native JSONB querying capabilities for hybrid structured/unstructured workloads.',
    integrationRole: 'Acts as the primary persistent data store for users, inventory, orders, and relational transaction records.',
    keyAdvantage: 'Enterprise reliability with strong referential integrity and zero data loss guarantees.',
    ecosystemTier: 'Enterprise Open Source RDBMS',
  },
  'SQLite': {
    name: 'SQLite3',
    category: 'Embedded Relational Database',
    whyChosen: 'Selected for zero-configuration, in-process ACID data storage requiring no external daemon or network socket management.',
    integrationRole: 'Stores local CLI task trees, high-score records, and persistent desktop audit logs.',
    keyAdvantage: 'Zero network latency, single-file simplicity, and crash-resilient WAL mode logging.',
    ecosystemTier: 'Embedded Storage Standard',
  },
  'Redis': {
    name: 'Redis',
    category: 'In-Memory Data Store & Cache',
    whyChosen: 'Selected for sub-millisecond in-memory data structures (strings, hashes, pub/sub channels) and built-in TTL key eviction.',
    integrationRole: 'Powers real-time chat broadcast channels, rate-limiting token buckets, and low-latency session caching.',
    keyAdvantage: 'Blazing throughput exceeding 100k+ operations per second with microsecond retrieval.',
    ecosystemTier: 'High-Speed In-Memory Standard',
  },
  'Socket.io': {
    name: 'Socket.io',
    category: 'Real-Time Bi-Directional WebSockets',
    whyChosen: 'Chosen for full-duplex real-time communication with automatic protocol fallback, room multiplexing, and reconnection heartbeats.',
    integrationRole: 'Drives live chat messaging, typing indicators, user presence detection, and instant telemetry streams.',
    keyAdvantage: 'Reliable fallback transport (polling to WebSockets) and seamless room broadcasting.',
    ecosystemTier: 'Real-Time WebSockets Standard',
  },
  'Stripe': {
    name: 'Stripe API & Checkout',
    category: 'Fintech & Payment Gateway',
    whyChosen: 'Selected for gold-standard PCI-DSS compliance, global currency support, and battle-tested webhook signature verification.',
    integrationRole: 'Processes hosted customer checkout sessions, payment intents, and automated order fulfillment events.',
    keyAdvantage: 'Frictionless, secure checkout experience with automated fraud protection.',
    ecosystemTier: 'Global Payment Infrastructure',
  },
  'GraphQL': {
    name: 'GraphQL',
    category: 'Declarative Query API Layer',
    whyChosen: 'Adopted to allow clients to request precisely the data fields needed in a single query, eliminating network over-fetching and multiple waterfall round-trips.',
    integrationRole: 'Aggregates multiple backend data entities into a unified, strongly typed query schema.',
    keyAdvantage: 'Contract-driven frontend autonomy with optimized network bandwidth usage.',
    ecosystemTier: 'Modern API Query Standard',
  },
  'Ethereum': {
    name: 'Ethereum & Web3',
    category: 'Decentralized Ledger & EVM',
    whyChosen: 'Chosen to interact with immutable decentralized smart contracts and verify cryptographic wallet signatures trustlessly.',
    integrationRole: 'Provides transaction ledger querying, gas estimation, and block event streaming.',
    keyAdvantage: 'Decentralized consensus with mathematically verifiable transaction history.',
    ecosystemTier: 'Decentralized Web3 Standard',
  },
  'Chart.js': {
    name: 'Chart.js',
    category: 'Data Visualization & Canvas Graphs',
    whyChosen: 'Selected for lightweight canvas-based data rendering with smooth transitions, responsive resizing, and high-DPR clarity.',
    integrationRole: 'Renders 7-day temperature trends, time-complexity comparison graphs, and sorting metric bar charts.',
    keyAdvantage: 'Crisp 60fps animations with minimal JavaScript bundle weight.',
    ecosystemTier: 'Interactive Canvas Charting',
  },
  'Typer': {
    name: 'Typer',
    category: 'Type-Driven CLI Builder',
    whyChosen: 'Selected to build ergonomic command-line tools leveraging Python 3.6+ type annotations for automatic flag generation and shell completion.',
    integrationRole: 'Structures CLI subcommands, parameters, and auto-generated terminal help menus.',
    keyAdvantage: 'Clean declarative code with zero manual argument parsing boilerplate.',
    ecosystemTier: 'Modern Python CLI Framework',
  },
  'Rich': {
    name: 'Rich',
    category: 'Terminal Graphics & Rich Formatting',
    whyChosen: 'Chosen to elevate console applications with truecolor ANSI styling, formatted tables, progress spinners, and syntax-highlighted code blocks.',
    integrationRole: 'Renders terminal markdown previews, agent status dashboards, and colorized logs.',
    keyAdvantage: 'Brings modern graphical UI aesthetics directly into standard terminal emulators.',
    ecosystemTier: 'Terminal UX & Styling Standard',
  },
  'Algorithm': {
    name: 'Algorithms & Discrete Math',
    category: 'Algorithmic Optimization',
    whyChosen: 'Engineered using rigorous data structure selection and mathematical optimization to minimize asymptotic time and space complexity.',
    integrationRole: 'Powers DAG topological sorting, binary search heuristics, and arithmetic precision engines.',
    keyAdvantage: 'Guaranteed polynomial/logarithmic performance under demanding computational loads.',
    ecosystemTier: 'Computer Science Core',
  },
  'Algorithms': {
    name: 'Algorithm Optimization',
    category: 'Algorithmic Optimization',
    whyChosen: 'Engineered using rigorous data structure selection and mathematical optimization to minimize asymptotic time and space complexity.',
    integrationRole: 'Powers sorting state machines, array partition animations, and comparison benchmarking.',
    keyAdvantage: 'Optimal runtime complexity with deterministic memory footprints.',
    ecosystemTier: 'Computer Science Core',
  },
  'CLI': {
    name: 'Command-Line Interface (CLI)',
    category: 'Developer Ergonomics & Scriptability',
    whyChosen: 'Adopted to provide instantaneous, headless developer workflows capable of seamless composition into UNIX pipes and remote SSH environments.',
    integrationRole: 'Exposes clean terminal commands, interactive flags, and stdout data streaming.',
    keyAdvantage: 'Zero UI latency, minimal memory overhead, and infinite scriptable automation.',
    ecosystemTier: 'Developer Ergonomics Standard',
  },
  'API': {
    name: 'REST & WebSocket APIs',
    category: 'Network Protocol & Interface Design',
    whyChosen: 'Designed with clean RESTful resource modeling and real-time streaming sockets to decouple client presentation from backend domain logic.',
    integrationRole: 'Provides robust JSON endpoints, error formatting, and bi-directional event communication.',
    keyAdvantage: 'High modularity and predictable integration contracts for third-party consumers.',
    ecosystemTier: 'Modern API Architecture',
  },
  'AWS': {
    name: 'Amazon Web Services (AWS)',
    category: 'Serverless Cloud Infrastructure',
    whyChosen: 'Selected for on-demand serverless scaling (Lambda, DynamoDB, S3) offering zero idle cost and high global availability.',
    integrationRole: 'Hosts serverless REST microservices, static assets on S3, and single-table DynamoDB storage.',
    keyAdvantage: 'Automatic elastic scaling with zero infrastructure management overhead.',
    ecosystemTier: 'Enterprise Cloud Infrastructure',
  },
};

export function getTechDeepDive(techName: string, projectTitle: string): TechDeepDive {
  const normalized = techName.trim();
  if (TECH_DATABASE[normalized]) {
    return TECH_DATABASE[normalized];
  }

  // Case-insensitive match check
  for (const [key, value] of Object.entries(TECH_DATABASE)) {
    if (key.toLowerCase() === normalized.toLowerCase()) {
      return value;
    }
  }

  // Contextual fallback based on domain keywords
  const lower = normalized.toLowerCase();
  let category = 'Core Engineering Tooling';
  let whyChosen = `Selected for its reliability, developer ergonomics, and seamless architectural fit within the ${projectTitle} stack.`;
  let integrationRole = `Coordinates critical domain workflows and data processing routines within ${projectTitle}.`;
  let keyAdvantage = 'Elevates developer productivity, type safety, and overall runtime dependability.';
  let ecosystemTier = 'Modern Software Engineering Ecosystem';

  if (lower.includes('css') || lower.includes('style') || lower.includes('sass')) {
    category = 'Front-End Styling & UI';
    whyChosen = `Chosen to deliver refined visual styling and responsive layouts for ${projectTitle}.`;
    integrationRole = 'Drives visual aesthetics, design tokens, and smooth UI transitions.';
    keyAdvantage = 'Pixel-perfect rendering with optimized CSS bundle overhead.';
  } else if (lower.includes('sql') || lower.includes('db') || lower.includes('mongo') || lower.includes('data')) {
    category = 'Database & Persistence';
    whyChosen = `Selected to provide robust data storage and query optimization for ${projectTitle}.`;
    integrationRole = 'Manages persistent storage, transactions, and relational data queries.';
    keyAdvantage = 'ACID reliability with high-throughput query performance.';
  } else if (lower.includes('api') || lower.includes('http') || lower.includes('rest')) {
    category = 'Network & API Protocols';
    whyChosen = `Adopted to provide predictable, contract-driven interfaces for ${projectTitle}.`;
    integrationRole = 'Connects decoupled client components with server services.';
    keyAdvantage = 'Standardized HTTP status conventions and structured payload validation.';
  }

  return {
    name: normalized,
    category,
    whyChosen,
    integrationRole,
    keyAdvantage,
    ecosystemTier,
  };
}
