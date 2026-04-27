// Shared placeholder data for registry blocks.
// All blocks reference this file so names, avatars, and roles stay consistent.

// Avatar base URL — update this once images are deployed.
// Leave empty string so blocks render AvatarFallback initials until then.
const avatarBase = '/public/avatars'

// ---------------------------------------------------------------------------
// Core cast of characters
// ---------------------------------------------------------------------------

export const people = [
  {
    id: 'usr-001',
    name: 'Sophie Reeves',
    email: 'sophie.r@honoui.com',
    avatar: avatarBase ? `${avatarBase}/sophie-reeves.jpg` : '',
    role: 'Engineering Lead',
    company: 'TechFlow',
    department: 'Engineering',
  },
  {
    id: 'usr-002',
    name: 'Marcus Foley',
    email: 'marcus.f@honoui.com',
    avatar: avatarBase ? `${avatarBase}/marcus-foley.jpg` : '',
    role: 'Product Manager',
    company: 'Innovate Labs',
    department: 'Product',
  },
  {
    id: 'usr-003',
    name: 'Rosa Kim',
    email: 'rosa.k@honoui.com',
    avatar: avatarBase ? `${avatarBase}/rosa-kim.jpg` : '',
    role: 'Head of Design',
    company: 'ScaleUp Inc',
    department: 'Design',
  },
  {
    id: 'usr-004',
    name: 'Theo Donovan',
    email: 'theo.d@honoui.com',
    avatar: avatarBase ? `${avatarBase}/theo-donovan.jpg` : '',
    role: 'Full Stack Developer',
    company: 'CloudBase',
    department: 'Engineering',
  },
  {
    id: 'usr-005',
    name: 'Zara Whitfield',
    email: 'zara.w@honoui.com',
    avatar: avatarBase ? `${avatarBase}/zara-whitfield.jpg` : '',
    role: 'UX Designer',
    company: 'PixelPerfect',
    department: 'Design',
  },
  {
    id: 'usr-006',
    name: 'Hugo Reyes',
    email: 'hugo.r@honoui.com',
    avatar: avatarBase ? `${avatarBase}/hugo-reyes.jpg` : '',
    role: 'DevOps Engineer',
    company: 'BuildFast',
    department: 'Engineering',
  },
  {
    id: 'usr-007',
    name: 'Jonah Alcott',
    email: 'jonah.a@honoui.com',
    avatar: avatarBase ? `${avatarBase}/jonah-alcott.jpg` : '',
    role: 'Marketing Director',
    company: 'LaunchPad',
    department: 'Marketing',
  },
  {
    id: 'usr-008',
    name: 'Camila Orellana',
    email: 'camila.o@honoui.com',
    avatar: avatarBase ? `${avatarBase}/camila-orellana.jpg` : '',
    role: 'Data Scientist',
    company: 'RapidDev',
    department: 'Data',
  },
  {
    id: 'usr-009',
    name: 'Nina Vergara',
    email: 'nina.v@honoui.com',
    avatar: avatarBase ? `${avatarBase}/nina-vergara.jpg` : '',
    role: 'Frontend Engineer',
    company: 'Craftwork',
    department: 'Engineering',
  },
  {
    id: 'usr-010',
    name: 'Nico Cardona',
    email: 'nico.c@honoui.com',
    avatar: avatarBase ? `${avatarBase}/nico-cardona.jpg` : '',
    role: 'Backend Engineer',
    company: 'Streamline',
    department: 'Engineering',
  },
  {
    id: 'usr-011',
    name: 'Nia Okonjo',
    email: 'nia.o@honoui.com',
    avatar: avatarBase ? `${avatarBase}/nia-okonjo.jpg` : '',
    role: 'QA Lead',
    company: 'ScaleOps',
    department: 'Quality',
  },
  {
    id: 'usr-012',
    name: 'Hana Tavares',
    email: 'hana.t@honoui.com',
    avatar: avatarBase ? `${avatarBase}/hana-tavares.jpg` : '',
    role: 'Solutions Architect',
    company: 'TechForward',
    department: 'Engineering',
  },
  {
    id: 'usr-013',
    name: 'Ryan Osei',
    email: 'ryan.o@honoui.com',
    avatar: avatarBase ? `${avatarBase}/ryan-osei.jpg` : '',
    role: 'Content Strategist',
    company: 'Momentum',
    department: 'Marketing',
  },
  {
    id: 'usr-014',
    name: 'Lena Mercer',
    email: 'lena.m@honoui.com',
    avatar: avatarBase ? `${avatarBase}/lena-mercer.jpg` : '',
    role: 'Security Engineer',
    company: 'IndieHacker',
    department: 'Security',
  },
  {
    id: 'usr-015',
    name: 'Kai Morita',
    email: 'kai.m@honoui.com',
    avatar: avatarBase ? `${avatarBase}/kai-morita.jpg` : '',
    role: 'Customer Success',
    company: 'DesignCo',
    department: 'Support',
  },
  {
    id: 'usr-016',
    name: 'Reid Lawson',
    email: 'reid.l@honoui.com',
    avatar: avatarBase ? `${avatarBase}/reid-lawson.jpg` : '',
    role: 'CTO',
    company: 'RapidBuild',
    department: 'Engineering',
  },
] as const

export type Person = (typeof people)[number]

// ---------------------------------------------------------------------------
// Convenience subsets
// ---------------------------------------------------------------------------

export const users = people.map((p) => ({
  id: p.id,
  name: p.name,
  email: p.email,
  avatar: p.avatar,
}))

export type User = (typeof users)[number]

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export const testimonials = [
  {
    quote:
      'This platform has completely transformed how we build products. The speed and quality improvements were immediate.',
    author: {
      name: people[0].name,
      title: 'VP of Engineering',
      company: people[0].company,
      avatar: people[0].avatar,
    },
  },
  {
    quote:
      'We evaluated dozens of solutions before choosing this one. Best decision we made all year.',
    author: {
      name: people[1].name,
      title: people[1].role,
      company: people[1].company,
      avatar: people[1].avatar,
    },
  },
  {
    quote:
      'The developer experience is unmatched. Our team was productive from day one with zero onboarding friction.',
    author: {
      name: people[2].name,
      title: people[2].role,
      company: people[2].company,
      avatar: people[2].avatar,
    },
  },
  {
    quote:
      'Documentation is excellent, the API is intuitive, and the community support has been incredibly helpful.',
    author: {
      name: people[5].name,
      title: 'Senior Developer',
      company: people[5].company,
      avatar: people[5].avatar,
    },
  },
  {
    quote:
      'Switching to this platform cut our development time in half. We ship features twice as fast now.',
    author: {
      name: people[8].name,
      title: people[8].role,
      company: people[8].company,
      avatar: people[8].avatar,
    },
  },
  {
    quote:
      "The component library is comprehensive and well-designed. It's become essential to our workflow.",
    author: {
      name: people[3].name,
      title: 'Frontend Lead',
      company: people[3].company,
      avatar: people[3].avatar,
    },
  },
  {
    quote:
      'Incredibly intuitive and powerful. We shipped our MVP in half the time we expected, and the code quality is outstanding.',
    author: {
      name: people[15].name,
      title: people[15].role,
      company: people[15].company,
      avatar: people[15].avatar,
    },
  },
  {
    quote: 'Support is phenomenal.',
    author: {
      name: people[6].name,
      title: people[6].role,
      company: people[6].company,
      avatar: people[6].avatar,
    },
  },
  {
    quote:
      'We evaluated over a dozen solutions before choosing this one. The attention to detail, the thoughtful API design, and the comprehensive documentation made it an easy choice.',
    author: {
      name: people[10].name,
      title: 'Engineering Manager',
      company: people[10].company,
      avatar: people[10].avatar,
    },
  },
  {
    quote: '10/10 would recommend.',
    author: {
      name: people[9].name,
      title: people[9].role,
      company: people[9].company,
      avatar: people[9].avatar,
    },
  },
  {
    quote:
      'The documentation is crystal clear and the API is a joy to work with. Makes my job easier every day.',
    author: {
      name: people[12].name,
      title: people[12].role,
      company: people[12].company,
      avatar: people[12].avatar,
    },
  },
  {
    quote:
      'This platform saved us months of development time. The component library is comprehensive, well-designed, and production-ready out of the box.',
    author: {
      name: people[11].name,
      title: people[11].role,
      company: people[11].company,
      avatar: people[11].avatar,
    },
  },
  {
    quote: 'Fast. Clean. Modern.',
    author: {
      name: people[4].name,
      title: people[4].role,
      company: people[4].company,
      avatar: people[4].avatar,
    },
  },
  {
    quote: "Best DX I've encountered. Worth every penny.",
    author: {
      name: people[13].name,
      title: people[13].role,
      company: people[13].company,
      avatar: people[13].avatar,
    },
  },
  {
    quote:
      "Our team's productivity skyrocketed. The components are accessible out of the box, the theming system is incredibly flexible, and the performance is outstanding.",
    author: {
      name: people[14].name,
      title: people[14].role,
      company: people[14].company,
      avatar: people[14].avatar,
    },
  },
  {
    quote: 'Finally!',
    author: {
      name: people[7].name,
      title: people[7].role,
      company: people[7].company,
      avatar: people[7].avatar,
    },
  },
] as const

export type Testimonial = {
  quote: string
  author: {
    name: string
    title: string
    company: string
    avatar: string
  }
}

// ---------------------------------------------------------------------------
// Team members (for marketing blocks)
// ---------------------------------------------------------------------------

export const teamMembers = [
  {
    name: people[0].name,
    role: 'Founder & CEO',
    avatar: people[0].avatar,
    bio: 'Previously founded two startups. Passionate about building products that matter.',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: people[1].name,
    role: 'CTO',
    avatar: people[1].avatar,
    bio: 'Former senior engineer at Stripe. Loves distributed systems and coffee.',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: people[2].name,
    role: people[2].role,
    avatar: people[2].avatar,
    bio: 'Design lead with 8 years experience crafting delightful user experiences.',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: people[5].name,
    role: 'Lead Engineer',
    avatar: people[5].avatar,
    bio: 'Full-stack developer who believes in clean code and continuous learning.',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: people[3].name,
    role: people[3].role,
    avatar: people[3].avatar,
    bio: 'Turning ideas into reality, one commit at a time. Open source enthusiast.',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: people[4].name,
    role: people[4].role,
    avatar: people[4].avatar,
    bio: 'Crafting intuitive interfaces with a focus on accessibility and delight.',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: people[15].name,
    role: 'DevOps Engineer',
    avatar: people[15].avatar,
    bio: 'Infrastructure nerd who automates everything. Kubernetes whisperer.',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: people[8].name,
    role: people[8].role,
    avatar: people[8].avatar,
    bio: 'Performance-obsessed engineer who loves building fast, beautiful UIs.',
    social: { twitter: '#', linkedin: '#' },
  },
] as const

export type TeamMember = {
  name: string
  role: string
  avatar: string
  bio?: string
  social?: {
    twitter?: string
    linkedin?: string
  }
}

// ---------------------------------------------------------------------------
// Recent orders (for dashboard overview)
// ---------------------------------------------------------------------------

export const recentOrders = [
  {
    id: 'ORD-1201',
    customer: people[6].name,
    email: people[6].email,
    status: 'completed' as const,
    amount: '$1,250.00',
    date: '2m ago',
    items: [
      { name: 'Product A', quantity: 2, price: '$500.00' },
      { name: 'Product B', quantity: 1, price: '$250.00' },
    ],
  },
  {
    id: 'ORD-1202',
    customer: people[9].name,
    email: people[9].email,
    status: 'completed' as const,
    amount: '$890.00',
    date: '12m ago',
    items: [
      { name: 'Product C', quantity: 3, price: '$890.00' },
    ],
  },
  {
    id: 'ORD-1203',
    customer: people[2].name,
    email: people[2].email,
    status: 'cancelled' as const,
    amount: '$2,100.00',
    date: '28m ago',
    items: [
      { name: 'Product D', quantity: 1, price: '$1,400.00' },
      { name: 'Product E', quantity: 2, price: '$350.00' },
    ],
  },
  {
    id: 'ORD-1204',
    customer: people[7].name,
    email: people[7].email,
    status: 'processing' as const,
    amount: '$450.00',
    date: '30m ago',
    items: [
      { name: 'Product F', quantity: 1, price: '$450.00' },
    ],
  },
  {
    id: 'ORD-1205',
    customer: people[4].name,
    email: people[4].email,
    status: 'completed' as const,
    amount: '$3,200.00',
    date: '1h ago',
    items: [
      { name: 'Product G', quantity: 2, price: '$1,600.00' },
    ],
  },
  {
    id: 'ORD-1206',
    customer: people[3].name,
    email: people[3].email,
    status: 'processing' as const,
    amount: '$675.00',
    date: '2h ago',
    items: [
      { name: 'Product H', quantity: 3, price: '$225.00' },
    ],
  },
  {
    id: 'ORD-1207',
    customer: people[10].name,
    email: people[10].email,
    status: 'completed' as const,
    amount: '$1,480.00',
    date: '3h ago',
    items: [
      { name: 'Product I', quantity: 2, price: '$740.00' },
    ],
  },
  {
    id: 'ORD-1208',
    customer: people[5].name,
    email: people[5].email,
    status: 'completed' as const,
    amount: '$2,350.00',
    date: '4h ago',
    items: [
      { name: 'Product J', quantity: 1, price: '$2,350.00' },
    ],
  },
] as const

export type RecentOrder = (typeof recentOrders)[number]

// ---------------------------------------------------------------------------
// Activities (for activity feeds)
// ---------------------------------------------------------------------------

export const activities = [
  {
    id: 'act-001',
    user: { name: people[0].name, avatar: people[0].avatar },
    action: 'commented on',
    target: 'Dashboard redesign',
    targetHref: '#',
    timestamp: '2m ago',
    type: 'comment' as const,
    description:
      'Great progress on the new layout! I think we should also consider adding a dark mode toggle.',
  },
  {
    id: 'act-002',
    user: { name: people[3].name, avatar: people[3].avatar },
    action: 'updated the status of',
    target: 'API integration',
    targetHref: '#',
    timestamp: '15m ago',
    type: 'update' as const,
    description: 'Changed status from In Progress to In Review.',
  },
  {
    id: 'act-003',
    user: { name: people[2].name, avatar: people[2].avatar },
    action: 'created a new project',
    target: 'Mobile App v2',
    targetHref: '#',
    timestamp: '1h ago',
    type: 'create' as const,
    description: 'Cross-platform mobile app with React Native and shared design tokens.',
  },
  {
    id: 'act-004',
    user: { name: people[5].name, avatar: people[5].avatar },
    action: 'was assigned to',
    target: 'Bug fixes',
    targetHref: '#',
    timestamp: '2h ago',
    type: 'assign' as const,
    description: 'Prioritized for next sprint with 3 open issues.',
  },
  {
    id: 'act-005',
    user: { name: people[4].name, avatar: people[4].avatar },
    action: 'completed',
    target: 'User authentication',
    targetHref: '#',
    timestamp: '3h ago',
    type: 'complete' as const,
    description: 'OAuth2 flow with Google and GitHub providers.',
  },
  {
    id: 'act-006',
    user: { name: people[6].name, avatar: people[6].avatar },
    action: 'deleted',
    target: 'Unused components',
    timestamp: '5h ago',
    type: 'delete' as const,
  },
  {
    id: 'act-007',
    user: { name: people[9].name, avatar: people[9].avatar },
    action: 'pushed 3 commits to',
    target: 'feature/auth',
    targetHref: '#',
    timestamp: '45m ago',
    type: 'update' as const,
  },
  {
    id: 'act-008',
    user: { name: people[7].name, avatar: people[7].avatar },
    action: 'merged pull request',
    target: '#42 Add user settings',
    targetHref: '#',
    timestamp: '10h ago',
    type: 'complete' as const,
  },
  {
    id: 'act-009',
    user: { name: people[8].name, avatar: people[8].avatar },
    action: 'created a new issue',
    target: 'Mobile responsiveness fixes',
    targetHref: '#',
    timestamp: '1h ago',
    type: 'create' as const,
  },
  {
    id: 'act-010',
    user: { name: people[10].name, avatar: people[10].avatar },
    action: 'completed milestone',
    target: 'Q1 Goals',
    targetHref: '#',
    timestamp: '18h ago',
    type: 'complete' as const,
    description:
      'All tasks for the quarterly milestone have been completed ahead of schedule.',
  },
] as const

export type Activity = (typeof activities)[number]

// ---------------------------------------------------------------------------
// Blog posts (for marketing blog blocks)
// ---------------------------------------------------------------------------

export const blogPosts = [
  {
    title: 'UX review presentations',
    excerpt:
      'How do you create compelling presentations that wow your colleagues and impress your managers? We break down the process step by step.',
    category: 'Design',
    date: 'Jan 20, 2026',
    readTime: '5 min read',
    href: '#',
    author: { name: people[6].name, avatar: people[6].avatar, role: people[6].role },
  },
  {
    title: 'Accessible components',
    excerpt:
      'Why accessibility should be baked into your component library from day one, and how to get your team on board with the practice.',
    category: 'Accessibility',
    date: 'Jan 8, 2026',
    readTime: '5 min read',
    href: '#',
    author: { name: people[3].name, avatar: people[3].avatar, role: people[3].role },
  },
  {
    title: 'TypeScript best practices',
    excerpt:
      'Tips and patterns for writing maintainable TypeScript at scale, from strict configs to advanced generics and type narrowing.',
    category: 'Engineering',
    date: 'Jan 5, 2026',
    readTime: '12 min read',
    href: '#',
    author: { name: people[0].name, avatar: people[0].avatar, role: people[0].role },
  },
  {
    title: 'Delightful micro-interactions',
    excerpt:
      'Small animations that make a big difference in user experience. Learn the principles behind motion that feels natural and intentional.',
    category: 'Design',
    date: 'Jan 3, 2026',
    readTime: '7 min read',
    href: '#',
    author: { name: people[5].name, avatar: people[5].avatar, role: people[5].role },
  },
  {
    title: 'Mastering CSS Grid',
    excerpt:
      'A practical deep-dive into CSS Grid with real-world layout patterns, responsive techniques, and common pitfalls to avoid.',
    category: 'CSS',
    date: 'Jan 1, 2026',
    readTime: '10 min read',
    href: '#',
    author: { name: people[4].name, avatar: people[4].avatar, role: people[4].role },
  },
  {
    title: 'Modern state management',
    excerpt:
      'Comparing different approaches to managing application state, from signals and stores to server-driven patterns and beyond.',
    category: 'Architecture',
    date: 'Dec 28, 2025',
    readTime: '8 min read',
    href: '#',
    author: { name: people[15].name, avatar: people[15].avatar, role: people[15].role },
  },
  {
    title: 'Designing for dark mode',
    excerpt:
      'Best practices for creating beautiful dark mode experiences, including color mapping strategies and contrast considerations.',
    category: 'Design',
    date: 'Dec 25, 2025',
    readTime: '6 min read',
    href: '#',
    author: { name: people[2].name, avatar: people[2].avatar, role: people[2].role },
  },
  {
    title: 'Performance at the edge',
    excerpt:
      'Practical tips for improving load times and runtime performance when deploying to edge runtimes and serverless platforms.',
    category: 'Performance',
    date: 'Dec 20, 2025',
    readTime: '9 min read',
    href: '#',
    author: { name: people[8].name, avatar: people[8].avatar, role: people[8].role },
  },
  {
    title: 'Design tokens at scale',
    excerpt:
      'How to structure and manage design tokens across platforms, from naming conventions to automated delivery pipelines.',
    category: 'Design',
    date: 'Dec 15, 2025',
    readTime: '8 min read',
    href: '#',
    author: { name: people[1].name, avatar: people[1].avatar, role: people[1].role },
  },
  {
    title: 'Building with edge functions',
    excerpt:
      'A hands-on guide to deploying serverless functions at the edge with practical patterns for auth, caching, and data access.',
    category: 'Engineering',
    date: 'Dec 10, 2025',
    readTime: '11 min read',
    href: '#',
    author: { name: people[7].name, avatar: people[7].avatar, role: people[7].role },
  },
] as const

export type BlogPost = (typeof blogPosts)[number]

// ---------------------------------------------------------------------------
// Messages (for topbar / notifications)
// ---------------------------------------------------------------------------

export const messages = [
  {
    name: people[10].name,
    avatar: people[10].avatar,
    preview: 'Can we pin the new prompt template?',
    time: '5m',
    status: 'unread' as const,
  },
  {
    name: people[7].name,
    avatar: people[7].avatar,
    preview: 'Shared logs for the timeout issue.',
    time: '4h',
    status: 'sent' as const,
  },
  {
    name: people[15].name,
    avatar: people[15].avatar,
    preview: 'Merged eval improvements into main.',
    time: '2d',
    status: 'read' as const,
  },
] as const

export type Message = (typeof messages)[number]

// ---------------------------------------------------------------------------
// Dashboard users (for users page tables)
// ---------------------------------------------------------------------------

export const dashboardUsers = [
  {
    ...people[0],
    role: 'Owner',
    department: 'Engineering',
    status: 'active' as const,
    lastActive: '2m ago',
    joinDate: 'Jan 12, 2025',
  },
  {
    ...people[1],
    role: 'Admin',
    department: 'Product',
    status: 'active' as const,
    lastActive: '18m ago',
    joinDate: 'Feb 3, 2025',
  },
  {
    ...people[2],
    role: 'Member',
    department: 'Design',
    status: 'active' as const,
    lastActive: '1h ago',
    joinDate: 'Mar 15, 2025',
  },
  {
    ...people[3],
    role: 'Member',
    department: 'Engineering',
    status: 'active' as const,
    lastActive: '5m ago',
    joinDate: 'Feb 18, 2025',
  },
  {
    ...people[4],
    role: 'Member',
    department: 'Design',
    status: 'pending' as const,
    lastActive: 'Never',
    joinDate: 'Jun 20, 2025',
  },
  {
    ...people[5],
    role: 'Admin',
    department: 'Engineering',
    status: 'active' as const,
    lastActive: '3h ago',
    joinDate: 'Apr 8, 2025',
  },
  {
    ...people[6],
    role: 'Member',
    department: 'Marketing',
    status: 'active' as const,
    lastActive: '20m ago',
    joinDate: 'Jan 30, 2025',
  },
  {
    ...people[7],
    role: 'Viewer',
    department: 'Data',
    status: 'active' as const,
    lastActive: '45m ago',
    joinDate: 'May 5, 2025',
  },
  {
    ...people[8],
    role: 'Member',
    department: 'Engineering',
    status: 'active' as const,
    lastActive: '20m ago',
    joinDate: 'Mar 22, 2025',
  },
  {
    ...people[9],
    role: 'Member',
    department: 'Engineering',
    status: 'inactive' as const,
    lastActive: '2w ago',
    joinDate: 'Jan 5, 2025',
  },
  {
    ...people[10],
    role: 'Admin',
    department: 'Quality',
    status: 'active' as const,
    lastActive: '1h ago',
    joinDate: 'Apr 14, 2025',
  },
  {
    ...people[11],
    role: 'Viewer',
    department: 'Engineering',
    status: 'pending' as const,
    lastActive: 'Never',
    joinDate: 'Jun 28, 2025',
  },
]

export type DashboardUser = (typeof dashboardUsers)[number]

// ---------------------------------------------------------------------------
// Tasks (for dashboard task list)
// ---------------------------------------------------------------------------

export const tasks = [
  {
    id: 'task-001',
    title: 'Update eval benchmarks',
    completed: true,
    dueDate: 'Mar 23',
    status: 'done' as const,
    assignee: {
      name: people[7].name,
      initial: people[7].name[0],
      avatar: people[7].avatar,
    },
  },
  {
    id: 'task-002',
    title: 'Fix prompt injection guard',
    completed: false,
    dueDate: 'Mar 24',
    status: 'urgent' as const,
    assignee: {
      name: people[1].name,
      initial: people[1].name[0],
      avatar: people[1].avatar,
    },
  },
  {
    id: 'task-003',
    title: 'Add streaming to chat API',
    completed: false,
    dueDate: 'Mar 25',
    status: 'in-progress' as const,
    assignee: {
      name: people[3].name,
      initial: people[3].name[0],
      avatar: people[3].avatar,
    },
  },
  {
    id: 'task-004',
    title: 'Review billing edge cases',
    completed: false,
    dueDate: 'Mar 14',
    status: 'urgent' as const,
    assignee: {
      name: people[6].name,
      initial: people[6].name[0],
      avatar: people[6].avatar,
    },
  },
  {
    id: 'task-005',
    title: 'Write onboarding guide',
    completed: false,
    dueDate: 'Mar 18',
    status: 'in-progress' as const,
    assignee: {
      name: people[12].name,
      initial: people[12].name[0],
      avatar: people[12].avatar,
    },
  },
] as const

export type Task = (typeof tasks)[number]

// ---------------------------------------------------------------------------
// Table users (for data-table-simple, selectable, filters blocks)
// ---------------------------------------------------------------------------

export const tableUsers = [
  {
    id: '1',
    name: people[0].name,
    email: people[0].email,
    avatar: people[0].avatar,
    role: 'Admin',
    department: 'Engineering',
    status: 'active' as const,
    lastActive: '2 min ago',
    joinDate: 'Jan 15, 2024',
  },
  {
    id: '2',
    name: people[3].name,
    email: people[3].email,
    avatar: people[3].avatar,
    role: 'Developer',
    department: 'Engineering',
    status: 'active' as const,
    lastActive: '5 min ago',
    joinDate: 'Feb 20, 2024',
  },
  {
    id: '3',
    name: people[2].name,
    email: people[2].email,
    avatar: people[2].avatar,
    role: 'Designer',
    department: 'Design',
    status: 'pending' as const,
    lastActive: '1 hour ago',
    joinDate: 'Mar 10, 2024',
  },
  {
    id: '4',
    name: people[5].name,
    email: people[5].email,
    avatar: people[5].avatar,
    role: 'Developer',
    department: 'Engineering',
    status: 'active' as const,
    lastActive: '3 hours ago',
    joinDate: 'Apr 5, 2024',
  },
  {
    id: '5',
    name: people[4].name,
    email: people[4].email,
    avatar: people[4].avatar,
    role: 'Marketing',
    department: 'Marketing',
    status: 'inactive' as const,
    lastActive: '2 days ago',
    joinDate: 'May 1, 2024',
  },
]

export type TableUser = (typeof tableUsers)[number]

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notifications = [
  {
    id: 'notif-001',
    title: 'New comment on your post',
    description: `${people[0].name} commented on "Dashboard redesign progress"`,
    timestamp: '2 min ago',
    read: false,
    type: 'mention' as const,
    user: { name: people[0].name, avatar: people[0].avatar },
    actionUrl: '#',
  },
  {
    id: 'notif-002',
    title: 'Deployment successful',
    description: 'Your latest changes have been deployed to production.',
    timestamp: '1 hour ago',
    read: false,
    type: 'success' as const,
  },
  {
    id: 'notif-003',
    title: 'Storage quota warning',
    description: 'You have used 80% of your storage quota.',
    timestamp: '3 hours ago',
    read: false,
    type: 'warning' as const,
  },
  {
    id: 'notif-004',
    title: 'Build failed',
    description: 'The build for commit abc123 failed. Check the logs for details.',
    timestamp: '5 hours ago',
    read: true,
    type: 'error' as const,
    actionUrl: '#',
  },
  {
    id: 'notif-005',
    title: 'New team member',
    description: `${people[3].name} has joined your team.`,
    timestamp: '1 day ago',
    read: true,
    type: 'info' as const,
    user: { name: people[3].name, avatar: people[3].avatar },
  },
]

export type Notification = (typeof notifications)[number]

// ---------------------------------------------------------------------------
// Companies (for transactions, testimonials, etc.)
// ---------------------------------------------------------------------------

export const companies = [
  'Northwind Labs',
  'Meridian Software',
  'Basecamp Digital',
  'Pinecone Analytics',
  'Silverline Tech',
  'Ridgeway Systems',
  'Larkspur Inc',
] as const

export type Company = (typeof companies)[number]

// ---------------------------------------------------------------------------
// Transactions (for revenue dashboard)
// ---------------------------------------------------------------------------

export const transactions = [
  {
    id: 'TXN-4201',
    customer: companies[0],
    amount: '$2,400.00',
    type: 'subscription' as const,
    status: 'completed' as const,
    date: 'Dec 15, 2025',
  },
  {
    id: 'TXN-4202',
    customer: companies[1],
    amount: '$1,800.00',
    type: 'subscription' as const,
    status: 'completed' as const,
    date: 'Dec 14, 2025',
  },
  {
    id: 'TXN-4203',
    customer: companies[2],
    amount: '$600.00',
    type: 'upgrade' as const,
    status: 'completed' as const,
    date: 'Dec 14, 2025',
  },
  {
    id: 'TXN-4204',
    customer: companies[3],
    amount: '$1,200.00',
    type: 'subscription' as const,
    status: 'pending' as const,
    date: 'Dec 13, 2025',
  },
  {
    id: 'TXN-4205',
    customer: companies[4],
    amount: '-$240.00',
    type: 'refund' as const,
    status: 'completed' as const,
    date: 'Dec 12, 2025',
  },
  {
    id: 'TXN-4206',
    customer: companies[5],
    amount: '$360.00',
    type: 'addon' as const,
    status: 'completed' as const,
    date: 'Dec 11, 2025',
  },
  {
    id: 'TXN-4207',
    customer: companies[6],
    amount: '$960.00',
    type: 'subscription' as const,
    status: 'failed' as const,
    date: 'Dec 10, 2025',
  },
] as const

export type Transaction = (typeof transactions)[number]

// ---------------------------------------------------------------------------
// Settings team members (for settings pages)
// ---------------------------------------------------------------------------

export const settingsTeamMembers = [
  {
    name: people[0].name,
    email: people[0].email,
    avatar: people[0].avatar,
    role: 'Owner' as const,
    department: people[0].department,
    status: 'active' as const,
    joined: 'Jan 12, 2025',
  },
  {
    name: people[1].name,
    email: people[1].email,
    avatar: people[1].avatar,
    role: 'Admin' as const,
    department: people[1].department,
    status: 'active' as const,
    joined: 'Feb 3, 2025',
  },
  {
    name: people[2].name,
    email: people[2].email,
    avatar: people[2].avatar,
    role: 'Member' as const,
    department: people[2].department,
    status: 'active' as const,
    joined: 'Mar 15, 2025',
  },
  {
    name: people[5].name,
    email: people[5].email,
    avatar: people[5].avatar,
    role: 'Member' as const,
    department: people[5].department,
    status: 'active' as const,
    joined: 'Apr 8, 2025',
  },
  {
    name: people[7].name,
    email: people[7].email,
    avatar: people[7].avatar,
    role: 'Viewer' as const,
    department: people[7].department,
    status: 'active' as const,
    joined: 'May 5, 2025',
  },
  {
    name: people[3].name,
    email: people[3].email,
    avatar: people[3].avatar,
    role: 'Member' as const,
    department: people[3].department,
    status: 'active' as const,
    joined: 'May 20, 2025',
  },
] as const

export type SettingsTeamMember = (typeof settingsTeamMembers)[number]

export const pendingInvitations = [
  { email: 'zara.w@honoui.com', role: 'Member' as const, sent: 'Jun 15, 2025' },
  { email: 'lena.m@honoui.com', role: 'Viewer' as const, sent: 'Jun 18, 2025' },
] as const

export type PendingInvitation = (typeof pendingInvitations)[number]
