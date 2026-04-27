import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { getButtonClasses } from '@/components/ui/button'
import { DisplayCard } from '@/components/ui/display-card'

type Cta02Props = {
  title?: string
  description?: string
  primaryCta?: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
  class?: string
}

export const Cta02: FC<Cta02Props> = ({
  title = 'Accelerate your development workflow',
  description = '30-day free trial with full access. No credit card required.',
  primaryCta = { label: 'Try it free', href: '#' },
  secondaryCta = { label: 'Learn more', href: '#' },
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <DisplayCard class="p-8 sm:p-10">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex flex-col gap-4">
            <h2 class="max-w-md text-3xl tracking-tight sm:text-4xl">
              {title}
            </h2>
          </div>
          <div class="flex shrink-0 flex-col gap-6">
            <p class="max-w-xs text-base text-foreground-muted">
              {description}
            </p>
            <div class="flex gap-3">
              <a href={primaryCta.href} class={getButtonClasses('default')}>
                {primaryCta.label}
              </a>
              {secondaryCta && (
                <a href={secondaryCta.href} class={getButtonClasses('outline')}>
                  {secondaryCta.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </DisplayCard>
    </div>
  </section>
)

export default Cta02
