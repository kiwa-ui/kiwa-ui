import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import {
  ChartIcon,
  CodeIcon,
  LayersIcon,
  FeatureIcon,
  ShieldIcon,
  SparklesIcon,
} from '@/components/ui/icon'

type Feature = {
  icon: FC<{ class?: string }>
  title: string
  description: string
}

const defaultFeatures: Feature[] = [
  {
    icon: FeatureIcon,
    title: 'Lightning fast',
    description: 'Built for speed with edge-first architecture and instant loading.',
  },
  {
    icon: CodeIcon,
    title: 'SSR first',
    description: 'Server-side rendering by default with zero client JavaScript.',
  },
  {
    icon: ShieldIcon,
    title: 'Fully accessible',
    description: 'WCAG compliant with keyboard navigation and screen readers.',
  },
  {
    icon: SparklesIcon,
    title: 'Dark mode',
    description: 'Beautiful dark mode support out of the box via CSS variables.',
  },
  {
    icon: LayersIcon,
    title: 'Customizable',
    description: 'Tailwind CSS powered. Every component is customizable to your brand.',
  },
  {
    icon: ChartIcon,
    title: 'Type safe',
    description: 'Written in TypeScript with full type definitions for great developer experience.',
  },
]

type Features01Props = {
  eyebrow?: string
  title?: string
  description?: string
  features?: Feature[]
  showHeader?: boolean
  class?: string
}

export const Features01: FC<Features01Props> = ({
  eyebrow = 'Features',
  title = 'Everything you need to build faster',
  description = 'A comprehensive toolkit for modern web development.',
  features = defaultFeatures,
  showHeader = true,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {showHeader && (
        <div class="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <div class="flex flex-col gap-3">
            {eyebrow && (
              <p class="text-xs font-medium uppercase tracking-wide text-primary">
                {eyebrow}
              </p>
            )}
            <h2 class="text-3xl tracking-tight sm:text-4xl">
              {title}
            </h2>
          </div>
          {description && (
            <p class="max-w-lg text-base text-foreground-muted">
              {description}
            </p>
          )}
        </div>
      )}
      <div class={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', showHeader && 'mt-16')}>
        {features.map((feature) => (
          <div key={feature.title} class="rounded-xl bg-card p-6 shadow-sm">
            <feature.icon class="size-5 text-foreground" />
            <h3 class="mt-4 tracking-tight">
              {feature.title}
            </h3>
            <p class="mt-2 text-sm text-foreground-muted">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Features01
