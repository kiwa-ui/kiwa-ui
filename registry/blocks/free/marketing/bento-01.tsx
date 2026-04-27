import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { DisplayCard } from '@/components/ui/display-card'
import { PlaceholderGradient } from '@/components/ui/placeholder-gradient'
import {
  ChartIcon,
  CodeIcon,
  FeatureIcon,
  ShieldIcon,
  SparklesIcon,
} from '@/components/ui/icon'

type BentoFeature = {
  icon: FC<{ class?: string }>
  title: string
  description: string
}

const defaultTopCards: Bento01Props['topCards'] = [
  {
    icon: FeatureIcon,
    title: 'Lightning fast',
    description: 'Built for speed with edge-first architecture.',
  },
  {
    icon: ShieldIcon,
    title: 'Secure by default',
    description: 'Built-in security best practices throughout.',
  },
]

const defaultFeatures: BentoFeature[] = [
  {
    icon: CodeIcon,
    title: 'Developer first',
    description: 'TypeScript native with full type safety.',
  },
  {
    icon: ChartIcon,
    title: 'Real-time analytics',
    description: 'Monitor performance and usage in real time.',
  },
  {
    icon: SparklesIcon,
    title: 'Smart automation',
    description: 'Automate repetitive tasks with ease.',
  },
]

type Bento01Props = {
  eyebrow?: string
  title?: string
  description?: string
  topCards?: {
    icon: FC<{ class?: string }>
    title: string
    description: string
  }[]
  features?: BentoFeature[]
  showHeader?: boolean
  class?: string
}

export const Bento01: FC<Bento01Props> = ({
  eyebrow = 'Platform',
  title = 'Everything you need to build faster',
  description = 'A comprehensive toolkit for modern web development.',
  topCards = defaultTopCards,
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
      <div class={cn('space-y-3', showHeader && 'mt-16')}>
        <div class="grid gap-3 md:grid-cols-2">
          {topCards.map((card) => (
            <DisplayCard key={card.title}>
              <PlaceholderGradient variant={2} class="min-h-40 flex-1 rounded-lg" />
              <card.icon class="mt-4 size-4 text-foreground" />
              <h3 class="mt-3 tracking-tight">
                {card.title}
              </h3>
              <p class="mt-1 text-sm text-foreground-muted">
                {card.description}
              </p>
            </DisplayCard>
          ))}
        </div>
        <div class="grid gap-3 md:grid-cols-3">
          {features.map((feature) => (
            <DisplayCard key={feature.title}>
              <feature.icon class="size-4 text-foreground" />
              <h3 class="mt-3 tracking-tight">
                {feature.title}
              </h3>
              <p class="mt-1 text-sm text-foreground-muted">
                {feature.description}
              </p>
            </DisplayCard>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default Bento01
