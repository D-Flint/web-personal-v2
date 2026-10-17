// Shared catalog records feed the home selections, project browser, and details dialog.
// num is a stable identifier linking each record to its schematic; liveUrl is optional
// because the interface must not invent links for unpublished projects.
export interface Project {
  num: string;
  title: string;
  description: string;
  tags: string[];
  domain: string;
  domainLabel: string;
  features: string[];
  liveUrl?: string;
}
export const projects: Project[] = [
  {
    num: '01',
    title: 'Agentic AI Assistant',
    description:
      'A sandboxed, autonomous local AI assistant operating 24/7 with Docker container isolation, prompt injection defense, and automated task execution.',
    tags: ['Algorithm', 'CLI', 'API', 'Python'],
    domain: 'ai',
    domainLabel: 'AI & Machine Learning',
    features: [
      'Local sandboxed execution with Docker isolation',
      '24/7 autonomous task scheduling',
      'Prompt injection guard layer',
      'Real-time agent status dashboard',
    ],
  },
  {
    num: '02',
    title: 'Portfolio Website',
    description:
      'Personal developer portfolio built with Astro and Tailwind CSS, with interactive particles, a filterable project catalog, contact delivery, and an embedded AI assistant.',
    tags: ['Astro', 'Tailwind CSS', 'TypeScript', 'Vite'],
    domain: 'web',
    domainLabel: 'Frontend & Web',
    features: [
      'Custom responsive design system',
      'Interactive canvas and responsive layouts',
      'Embedded streaming AI assistant',
      'Filterable project catalog with real-time modal details',
    ],
    liveUrl: 'https://hoeurbvuthi.site/',
  },
  {
    num: '03',
    title: 'Task Automation Bot',
    description:
      'CLI daemon for automated file classification, scheduled system backups, and recurring background operations with SQLite rollback logs.',
    tags: ['Python', 'Typer', 'SQLite', 'CLI'],
    domain: 'tools',
    domainLabel: 'CLI & Automation',
    features: [
      'File watch & auto-organize by ruleset',
      'Cron-style email & backup scheduler',
      'Plugin system for custom automation modules',
      'SQLite audit log with rollback support',
    ],
  },
  {
    num: '04',
    title: 'AI Models Finder',
    description:
      'A website that helps nontechnical people understand, find, and choose AI models for their needs.',
    tags: ['React', 'TypeScript', 'Astro', 'API', 'Algorithm', 'Vite'],
    domain: 'web',
    domainLabel: 'Full-Stack & Web',
    features: [
      'Model rankings based on verified benchmark scores',
      'Verified benchmark scores from multiple sources',
      'Coverage of multiple metrics, use cases, and requirements',
      'Model recommendation algorithm based on user needs',
    ],
  },
];
