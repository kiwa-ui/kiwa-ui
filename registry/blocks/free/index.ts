export type BlockMeta = {
  title: string
  description: string
  dependencies: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  category: 'marketing' | 'utility'
}

export const blockMeta: Record<string, BlockMeta> = {
  // Hero blocks
  'hero-01': {
    title: 'Hero 01',
    description: 'Centered hero with headline, description, and dual CTA buttons',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['button'],
    category: 'marketing',
  },
  'hero-02': {
    title: 'Hero 02',
    description: 'Split two-column hero with content left and image placeholder right',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['button'],
    category: 'marketing',
  },

  // Feature blocks
  'features-01': {
    title: 'Features 01',
    description: 'Centered heading with 3-column icon grid',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'icon'],
    category: 'marketing',
  },
  'features-02': {
    title: 'Features 02',
    description: 'Split header with 3-column icon grid and bordered icons',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'icon'],
    category: 'marketing',
  },

  // Bento blocks
  'bento-01': {
    title: 'Bento 01',
    description: 'Full-width card with mockup and 3-column icon feature grid',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'display-card', 'icon'],
    category: 'marketing',
  },
  'bento-02': {
    title: 'Bento 02',
    description: '2-column split with tall card and stacked cards',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'display-card'],
    category: 'marketing',
  },

  // CTA blocks
  'cta-01': {
    title: 'CTA 01',
    description: 'Centered text with dual CTA buttons and avatar stack',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'button', 'avatar-stack', 'placeholder-data'],
    category: 'marketing',
  },
  'cta-02': {
    title: 'CTA 02',
    description: 'Split card with text left and dual CTA buttons right',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'button', 'display-card'],
    category: 'marketing',
  },

  // Testimonial blocks
  'testimonials-01': {
    title: 'Testimonials 01',
    description: 'Single centered blockquote with avatar and star rating',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['avatar', 'icon'],
    category: 'marketing',
  },
  'testimonials-02': {
    title: 'Testimonials 02',
    description: '3-column equal-height grid of compact testimonial cards',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['avatar', 'display-card', 'badge', 'placeholder-data'],
    category: 'marketing',
  },

  // Social proof blocks
  'social-proof-01': {
    title: 'Social Proof 01',
    description: 'Simple logo grid with grayscale-to-color hover',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: [],
    category: 'marketing',
  },
  'social-proof-02': {
    title: 'Social Proof 02',
    description: 'Left-aligned heading with simple logo row',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: [],
    category: 'marketing',
  },

  // Pricing blocks
  'pricing-01': {
    title: 'Pricing 01',
    description: 'Centered header with 3-column pricing card grid',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'display-card', 'button', 'icon'],
    category: 'marketing',
  },
  'pricing-02': {
    title: 'Pricing 02',
    description: 'Simple 2-card side-by-side pricing choice',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'display-card', 'button', 'icon'],
    category: 'marketing',
  },

  // Metrics blocks
  'metrics-01': {
    title: 'Metrics 01',
    description: 'Centered header with bordered stat grid showing values, labels, and descriptions',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge'],
    category: 'marketing',
  },
  'metrics-02': {
    title: 'Metrics 02',
    description: 'Split layout with header and CTA left, bordered stat grid right',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'button'],
    category: 'marketing',
  },

  // FAQ blocks
  'faq-01': {
    title: 'FAQ 01',
    description: 'Centered single-column accordion with support section',
    dependencies: ['clsx', 'tailwind-merge', '@kiwa-ui/enhance'],
    registryDependencies: ['accordion', 'badge', 'display-card', 'button', 'avatar', 'icon'],
    category: 'marketing',
  },
  'faq-02': {
    title: 'FAQ 02',
    description: 'Centered header with two-column accordion grid',
    dependencies: ['clsx', 'tailwind-merge', '@kiwa-ui/enhance'],
    registryDependencies: ['accordion', 'badge', 'icon'],
    category: 'marketing',
  },

  // Footer blocks
  'footer-01': {
    title: 'Footer 01',
    description: 'Compact single-row footer with logo, nav links, and social icons',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['icon'],
    category: 'marketing',
  },
  'footer-02': {
    title: 'Footer 02',
    description: 'Multi-column footer with link groups, tagline, and social links',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['icon'],
    category: 'marketing',
  },

  // Blog blocks
  'blog-01': {
    title: 'Blog 01',
    description: 'Centered header with 3-column simple blog post cards',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'blog-post-card', 'placeholder-data'],
    category: 'marketing',
  },
  'blog-02': {
    title: 'Blog 02',
    description: 'Featured split post with 3-column grid below',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'avatar', 'placeholder-gradient', 'blog-post-card', 'placeholder-data'],
    category: 'marketing',
  },

  // Contact blocks
  'contact-01': {
    title: 'Contact 01',
    description: 'Centered form with contact info grid below',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['button', 'input', 'label', 'textarea'],
    category: 'marketing',
  },
  'contact-02': {
    title: 'Contact 02',
    description: 'Contact info cards grid with email, phone, and office details',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['button', 'display-card', 'icon'],
    category: 'marketing',
  },

  // Team blocks
  'team-01': {
    title: 'Team 01',
    description: 'Centered header with simple four-column avatar grid',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'avatar', 'placeholder-data'],
    category: 'marketing',
  },
  'team-02': {
    title: 'Team 02',
    description: 'Three-column image grid with shadow and left-aligned text',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'placeholder-data'],
    category: 'marketing',
  },

  // Content blocks
  'content-01': {
    title: 'Content 01',
    description: 'Two-column text and media split for about and story sections',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'placeholder-gradient'],
    category: 'marketing',
  },
  'content-02': {
    title: 'Content 02',
    description: 'Centered prose article with title, categories, featured image, and author byline',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: ['badge', 'avatar', 'placeholder-gradient', 'separator', 'placeholder-data'],
    category: 'marketing',
  },

  // Navigation blocks
  'nav-01': {
    title: 'Nav 01',
    description: 'Simple navbar with centered links and single CTA',
    dependencies: ['clsx', 'tailwind-merge', '@kiwa-ui/enhance'],
    registryDependencies: ['button', 'icon'],
    category: 'marketing',
  },
  'nav-02': {
    title: 'Nav 02',
    description: 'Navbar with login link, divider, and CTA button',
    dependencies: ['clsx', 'tailwind-merge', '@kiwa-ui/enhance'],
    registryDependencies: ['button', 'icon'],
    category: 'marketing',
  },
}
