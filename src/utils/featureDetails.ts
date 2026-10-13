// ──────────────────────────────────────────────────────────────────────────────
//  featureDetails.ts — Grand Narukami Technical Deep Dive Specifications
// ──────────────────────────────────────────────────────────────────────────────
//  Provides curated architectural deep dives and implementation notes for each
//  project feature. If a feature isn't explicitly defined in the catalog, a
//  smart contextual fallback is automatically synthesized.
// ──────────────────────────────────────────────────────────────────────────────

export interface FeatureDeepDive {
  title: string;
  category: string;
  description: string;
  techStack: string;
  benefit: string;
  complexity: string;
}

const FEATURE_DATABASE: Record<string, Record<string, Partial<FeatureDeepDive>>> = {
  'Agentic AI Assistant': {
    'Local sandboxed execution with Docker isolation': {
      category: 'Security & Virtualization',
      description: 'Executes Python code interpreter commands, filesystem edits, and bash utilities strictly inside isolated, ephemeral Docker container environments with restricted cgroups, drop-all capabilities, and no host network access.',
      techStack: 'Docker Engine, Alpine Linux, POSIX cgroups, Unix Sockets',
      benefit: 'Airtight isolation preventing accidental file corruption or host system compromise.',
      complexity: 'High (Container Lifecycle & IPC Bridge)',
    },
    '24/7 autonomous task scheduling': {
      category: 'System Daemon & Cron Engine',
      description: 'Runs continuous background background workers with cron and interval triggers, maintaining asynchronous heartbeat checks, job queue persistence, and fault-tolerant retry loops.',
      techStack: 'Python asyncio, SQLite WAL mode, Systemd, Daemon worker threads',
      benefit: 'Reliable uninterrupted background execution without manual supervision.',
      complexity: 'Medium (Concurrent Task Queuing)',
    },
    'Prompt injection guard layer': {
      category: 'AI Security & Alignment',
      description: 'Pre-flight sanitization and validation pipeline that screens incoming external inputs and tool outputs against adversarial prompt injection, privilege escalation, and unintended tool chaining.',
      techStack: 'Regex heuristics, Context boundary tokens, AST policy verification',
      benefit: 'Guarantees the model operates strictly within user-authorized tool boundaries.',
      complexity: 'High (Adversarial Defense)',
    },
    'Real-time agent status dashboard': {
      category: 'Telemetry & Observability',
      description: 'Live console and websocket telemetry streaming agent thinking states, token throughput, tool execution latency, and error logs with sub-second feedback.',
      techStack: 'Rich CLI UI, WebSocket streaming, Structured JSON logging',
      benefit: 'Complete visibility into reasoning loops and tool execution traces.',
      complexity: 'Medium (Streaming IPC)',
    },
  },

  'Portfolio Web App': {
    'Bespoke Grand Narukami dark glassmorphism system': {
      category: 'Design Systems & UI Engineering',
      description: 'Engineered with tailored Tailwind v4 custom variants, multi-layer specular bevels (inset 0 1px 1px), obsidian-amethyst translucent glass, and dynamic CSS transforms tuned with Emil Kowalski spring physics.',
      techStack: 'Astro 7, Tailwind CSS v4, CSS Custom Properties, GPU Compositing',
      benefit: 'Ultra-refined aesthetic with luminous contrast and sub-0.03 CLS.',
      complexity: 'Medium (Multi-layered Glass Optics)',
    },
    'Responsive 9:16 mobile scenery & particle physics': {
      category: 'Canvas & Graphics Programming',
      description: 'Dedicated DPR-scaled HTML5 Canvas rendering 35 bezier-curve sakura petals drifting with sinusoidal wind currents, angular rotation physics, and viewport boundary auto-wrapping.',
      techStack: 'HTML5 Canvas 2D API, DevicePixelRatio scaling, requestAnimationFrame',
      benefit: 'Smooth 60fps ambient drift that responds dynamically to viewport resizing.',
      complexity: 'Medium (Vector Physics & DPR)',
    },
    'Streaming portfolio assistant': {
      category: 'Server-side streaming',
      description: 'A compact assistant panel streams portfolio answers through a server-side provider proxy, with explicit loading, retry and configuration errors.',
      techStack: 'Astro API routes, DeepSeek API, Fetch streams, vanilla JavaScript',
      benefit: 'Visitors can ask about the portfolio without exposing provider credentials.',
      complexity: 'Medium (Streaming and recovery)',
    },
    'Tag catalog with dynamic FLIP slide animations': {
      category: 'Layout & Transition Physics',
      description: 'GPU-accelerated FLIP (First-Last-Invert-Play) layout animation engine computing exact bounding box translation deltas to animate grid reflow smoothly without browser layout thrashing.',
      techStack: 'Vanilla JS DOM Measurements, CSS transforms, cubic-bezier easing',
      benefit: 'Fluid 240ms card repositioning when filtering across 20+ technologies.',
      complexity: 'Medium (FLIP Animation Math)',
    },
  },

  'AI Models Finder': {
    'Models ranking base on Verify benchmark score': {
      category: '',
      description: '',
      techStack: '',
      benefit: '',
      complexity: '',
    },
    'Verify and Reliable benchmark score from multiple source': {
      category: '',
      description: '',
      techStack: '',
      benefit: '',
      complexity: '',
    },
    'Cover multiple metric, use casese and requirment': {
      category: '',
      description: '',
      techStack: '',
      benefit: '',
      complexity: '',
    },
    'Models recommendation algorithm base on the user needs': {
      category: '',
      description: '',
      techStack: '',
      benefit: '',
      complexity: '',
    },
  },

  'Sorting Visualizer': {
    'Real-time bar chart animations with step-through controls': {
      category: 'Data Structures & Algorithms',
      description: 'Visualizes algorithm execution states step-by-step using custom async generators, allowing pausing, single-step execution, and visual highlights for comparison vs swap passes.',
      techStack: 'React, TypeScript, Async Generators, CSS Transitions',
      benefit: 'Deep intuitive comprehension of sorting mechanics and time complexity.',
      complexity: 'Medium (State Machine Animation)',
    },
    'Adjustable speed & data size sliders': {
      category: 'Interactive Performance',
      description: 'Dynamic throttle control adjusting animation interval frames from 1ms up to 1000ms, handling arrays up to 200 elements without frame drops.',
      techStack: 'React State, Debounced event handlers, Custom Hooks',
      benefit: 'Seamless scalability from high-speed benchmarks to slow-motion debugging.',
      complexity: 'Low (State Throttling)',
    },
    'Algorithm comparison (time & swaps)': {
      category: 'Benchmarking & Telemetry',
      description: 'Real-time counters tracking comparison count, array index swaps, and elapsed wall-clock microseconds for Quick Sort, Merge Sort, Heap Sort, and Bubble Sort.',
      techStack: 'Performance.now(), Metric Accumulators, Pure TypeScript',
      benefit: 'Empirical verification of O(n log n) vs O(n²) theoretical bounds.',
      complexity: 'Medium (Telemetry Metrics)',
    },
    'Dark mode visualization theme': {
      category: 'Visual Design & Accessibility',
      description: 'High-contrast neon color palettes engineered for optimal legibility of active pivots, sorted partitions, and unsorted sub-arrays.',
      techStack: 'CSS Variables, Color Palettes, WCAG AAA Contrast',
      benefit: 'Eye-friendly debugging with instant visual distinction of active states.',
      complexity: 'Low (Theme Architecture)',
    },
  },

  'C++ Task Organizer': {
    'DAG-based task dependency resolution': {
      category: 'Graph Algorithms & Systems',
      description: 'Implements Kahn\'s topological sorting algorithm over directed acyclic graphs (DAG) to resolve prerequisite dependencies and detect cyclic deadlocks at compile-time/runtime.',
      techStack: 'C++17, std::unordered_map, std::vector, Topological Sort Algorithm',
      benefit: 'Guarantees valid task execution order and prevents circular dependencies.',
      complexity: 'High (Graph Theory & Deadlock Detection)',
    },
    'SQLite persistent storage with migrations': {
      category: 'Database & Embedded Storage',
      description: 'Lightweight SQLite C/C++ interface with prepared statements, ACID transactions, and an automatic schema migration runner.',
      techStack: 'SQLite3 C API, RAII Wrapper Classes, Transaction Guards',
      benefit: 'Crash-resilient local persistence with zero external service dependencies.',
      complexity: 'Medium (C++ RAII DB Wrappers)',
    },
    'Priority queue with deadline scheduling': {
      category: 'Data Structures & Scheduling',
      description: 'Min-heap priority queue combining task urgency scores with Unix timestamp deadlines for optimal task dispatching.',
      techStack: 'std::priority_queue, std::chrono, Custom Comparator Structs',
      benefit: 'O(log n) task insertion and O(1) retrieval of highest priority work.',
      complexity: 'Medium (Heap Scheduling)',
    },
    'Colorized terminal output via FTXUI': {
      category: 'Terminal User Interface (TUI)',
      description: 'Modern terminal user interface utilizing FTXUI component tree architecture with responsive flex layouts and ANSI truecolor support.',
      techStack: 'FTXUI Library, ANSI Escape Sequences, Terminal Buffer Rendering',
      benefit: 'Ergonomic terminal interface that feels like a native desktop tool.',
      complexity: 'Medium (TUI Component Architecture)',
    },
  },

  'Machine Learning Pipeline': {
    'Automated data preprocessing & feature engineering': {
      category: 'Machine Learning & ETL',
      description: 'Production-grade data pipeline handling imputation of missing values, categorical one-hot encoding, outlier clipping, and standard scaling with persistent column transformers.',
      techStack: 'Python, scikit-learn Pipeline, Pandas, NumPy',
      benefit: 'Reproducible feature transformations preventing data leakage during training and inference.',
      complexity: 'Medium (Pipeline Serialization)',
    },
    'Model versioning with MLflow tracking': {
      category: 'MLOps & Experiment Tracking',
      description: 'Logs hyperparameter configurations, validation ROC-AUC metrics, confusion matrices, and serialized model artifacts with deterministic lineage.',
      techStack: 'MLflow Tracking Server, Artifact Registry, SQLite Backend',
      benefit: 'Full traceability and instant rollback to previous best-performing model checkpoints.',
      complexity: 'Medium (Experiment Lineage)',
    },
    'REST inference API with FastAPI': {
      category: 'Backend & High-Throughput Serving',
      description: 'Asynchronous REST endpoint utilizing Pydantic request models with automated input schema validation and batched model predictions.',
      techStack: 'FastAPI, Uvicorn, Pydantic v2, Gunicorn Worker Pool',
      benefit: 'Sub-15ms inference latency with auto-generated OpenAPI documentation.',
      complexity: 'Medium (Async Inference API)',
    },
    'Docker Compose deployment with GPU support': {
      category: 'Containerization & Infrastructure',
      description: 'Multi-stage Docker build separating build dependencies from runtime binaries, with NVIDIA container toolkit integration for accelerated compute.',
      techStack: 'Docker Compose, Multi-stage Builds, NVIDIA Runtime, CUDA',
      benefit: 'One-command deployment reproducibility across local development and production cloud VMs.',
      complexity: 'High (Containerized Hardware Acceleration)',
    },
  },

  'E-Commerce Backend': {
    'JWT-based role authentication (admin/customer)': {
      category: 'Security & Identity',
      description: 'Stateless JSON Web Token authentication with asymmetric signature verification, role-based access control (RBAC) middleware, and bcrypt password hashing.',
      techStack: 'Node.js, Express, jsonwebtoken, bcrypt, HTTP-only Cookies',
      benefit: 'Secure multi-tenant authentication protecting sensitive customer data.',
      complexity: 'Medium (RBAC Security)',
    },
    'RESTful CRUD for products & inventory': {
      category: 'API Architecture & Data Layer',
      description: 'Layered service architecture with controller, service, and repository layers managing relational product catalogs, categories, and inventory atomic decrements.',
      techStack: 'PostgreSQL, Prisma ORM, Express Router, Input Validation',
      benefit: 'Clean separation of concerns with atomic stock inventory transactions.',
      complexity: 'Medium (Atomic Transactions)',
    },
    'Stripe checkout session integration': {
      category: 'Fintech & Payment Gateway',
      description: 'End-to-end payment processing supporting hosted Stripe Checkout sessions, webhook verification with replay defense, and automated order fulfillment status transitions.',
      techStack: 'Stripe Node SDK, Webhook Signature Verification, Idempotency Keys',
      benefit: 'PCI-compliant frictionless checkout with resilient webhook processing.',
      complexity: 'High (Webhook Idempotency & Financial Safety)',
    },
    'PostgreSQL with Prisma ORM & migrations': {
      category: 'Relational Database Engineering',
      description: 'Normalized relational schema with foreign key constraints, composite indexes, and version-controlled migration scripts for reliable zero-downtime upgrades.',
      techStack: 'PostgreSQL 16, Prisma Schema, Migration Engine',
      benefit: 'Type-safe database queries with comprehensive relation mapping.',
      complexity: 'Medium (Relational Data Modeling)',
    },
  },
};

export function getFeatureDeepDive(projectTitle: string, featureTitle: string, featureIndex: number): FeatureDeepDive {
  const projectDb = FEATURE_DATABASE[projectTitle];
  if (projectDb && projectDb[featureTitle]) {
    const data = projectDb[featureTitle];
    return {
      title: featureTitle,
      category: data.category || 'Architecture & Implementation',
      description: data.description || `Architectural implementation and internal mechanics of ${featureTitle} designed for high dependability and speed.`,
      techStack: data.techStack || 'Modern System Architecture',
      benefit: data.benefit || 'Engineered for seamless developer experience and reliable runtime performance.',
      complexity: data.complexity || 'Intermediate / Production Ready',
    };
  }

  // Contextual fallback based on keywords
  const lower = featureTitle.toLowerCase();
  let category = 'Engineering Architecture';
  let benefit = 'Elevates overall system resilience, operational clarity, and runtime performance.';
  let techStack = 'Modern Engineering & Design Patterns';
  let complexity = 'Production Ready';

  if (lower.includes('docker') || lower.includes('container') || lower.includes('linux')) {
    category = 'DevOps & Systems Infrastructure';
    benefit = 'Ensures hermetic isolation and zero-drift environment reproducibility.';
    techStack = 'Docker, Linux Kernel APIs, Container Virtualization';
    complexity = 'High';
  } else if (lower.includes('api') || lower.includes('rest') || lower.includes('graphql') || lower.includes('socket')) {
    category = 'Network & API Protocols';
    benefit = 'Delivers predictable contract-driven communication with minimal overhead.';
    techStack = 'RESTful APIs, WebSockets, Schema Validation';
    complexity = 'Medium';
  } else if (lower.includes('algorithm') || lower.includes('comput') || lower.includes('graph') || lower.includes('tree')) {
    category = 'Algorithms & Optimization';
    benefit = 'Optimizes algorithmic time and space complexity for demanding workloads.';
    techStack = 'Data Structures, Graph Theory, C++ / TypeScript';
    complexity = 'High';
  } else if (lower.includes('ui') || lower.includes('theme') || lower.includes('animation') || lower.includes('glass')) {
    category = 'UI / UX & Front-End Physics';
    benefit = 'Delivers responsive tactile feedback and smooth 60fps micro-interactions.';
    techStack = 'CSS3 GPU Transitions, FLIP Engine, Glassmorphism';
    complexity = 'Medium';
  } else if (lower.includes('auth') || lower.includes('security') || lower.includes('guard') || lower.includes('password')) {
    category = 'Security & Access Control';
    benefit = 'Prevents unauthorized access and protects user state integrity.';
    techStack = 'Cryptography, Identity Policies, Token Guardrails';
    complexity = 'High';
  }

  return {
    title: featureTitle,
    category,
    description: `Detailed engineering breakdown of ${featureTitle}. Designed to deliver maximum efficiency, modular maintainability, and clean architectural separation of concerns within the ${projectTitle} codebase.`,
    techStack,
    benefit,
    complexity,
  };
}
