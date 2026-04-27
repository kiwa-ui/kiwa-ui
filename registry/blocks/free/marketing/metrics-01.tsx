import type { Child, FC } from 'hono/jsx'
import { cn } from '@/lib/utils'

type Metric = {
  value: string
  label: string
  description: string
}

type Metrics01Props = {
  eyebrow?: string
  title?: Child
  description?: string
  metrics?: Metric[]
  showHeader?: boolean
  class?: string
}

const defaultMetrics: Metric[] = [
  { value: '10M+', label: 'Active users', description: 'Across 120+ countries worldwide' },
  { value: '99.9%', label: 'Uptime', description: 'Enterprise-grade reliability' },
  { value: '500+', label: 'Integrations', description: 'Connect your favorite tools' },
  { value: '4.9/5', label: 'Rating', description: 'From 3,000+ verified reviews' },
]

export const Metrics01: FC<Metrics01Props> = ({
  eyebrow = 'Results',
  title = 'Trusted by teams everywhere',
  description = 'Our platform delivers measurable results for teams of every size.',
  metrics = defaultMetrics,
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
      <div class={cn('grid grid-cols-2 gap-8 lg:grid-cols-4', showHeader && 'mt-16')}>
        {metrics.map((metric) => (
          <div key={metric.label} class="border-l border-border pl-6">
            <div class="text-4xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </div>
            <div class="mt-3 text-sm font-medium text-foreground">
              {metric.label}
            </div>
            <p class="mt-1 text-sm text-foreground-muted">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Metrics01
