import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { DisplayCard } from '@/components/ui/display-card'
import { PlaceholderGradient } from '@/components/ui/placeholder-gradient'

const defaultMainCard = {
  title: 'Unified dashboard',
  description: 'Manage everything from one place.',
}

const defaultCards = [
  { title: 'App integrations', description: 'Connect with your favorite tools and services.' },
  { title: 'Revenue tracking', description: 'Monitor your earnings in real-time.' },
]

type Bento02Props = {
  eyebrow?: string
  title?: string
  description?: string
  mainCard?: {
    title: string
    description: string
  }
  cards?: {
    title: string
    description: string
  }[]
  showHeader?: boolean
  class?: string
}

export const Bento02: FC<Bento02Props> = ({
  eyebrow = 'Platform',
  title = 'Built for teams that ship fast',
  description = 'Powerful tools and integrations to supercharge your workflow.',
  mainCard = defaultMainCard,
  cards = defaultCards,
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
      <div class={cn('grid gap-3 lg:grid-cols-2', showHeader && 'mt-16')}>
        <DisplayCard>
          <div>
            <h3 class="tracking-tight">{mainCard.title}</h3>
            <p class="mt-1 text-sm text-foreground-muted">
              {mainCard.description}
            </p>
          </div>
          <PlaceholderGradient variant={3} class="mt-4 min-h-64 flex-1 rounded-lg" />
        </DisplayCard>
        <div class="flex flex-col gap-3">
          {cards.map((card) => (
            <DisplayCard key={card.title} class="flex-1">
              <div>
                <h3 class="tracking-tight">{card.title}</h3>
                <p class="mt-1 text-sm text-foreground-muted">
                  {card.description}
                </p>
              </div>
              <PlaceholderGradient variant={1} class="mt-4 min-h-24 flex-1 rounded-lg" />
            </DisplayCard>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default Bento02
