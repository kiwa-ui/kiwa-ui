import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { getButtonClasses } from '@/components/ui/button'
import { DisplayCard } from '@/components/ui/display-card'

type Cta02Props = {
  eyebrow?: string
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
  eyebrow = 'Get started',
  title = 'Accelerate your development workflow',
  description = 'Start a 30-day free trial with full access to every feature. No credit card required, no setup fees, cancel anytime.',
  primaryCta = { label: 'Try it free', href: '#' },
  secondaryCta = { label: 'Learn more', href: '#' },
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <DisplayCard class="p-8 sm:p-10">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
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
          <div class="flex flex-col gap-6">
            <p class="text-base text-foreground-muted">
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
