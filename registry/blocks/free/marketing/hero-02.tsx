import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { getButtonClasses } from '@/components/ui/button'
import { PlaceholderGradient } from '@/components/ui/placeholder-gradient'

type Hero02Props = {
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
  image?: {
    src: string
    alt: string
  }
  class?: string
}

export const Hero02: FC<Hero02Props> = ({
  title = 'Your workflow, supercharged with AI',
  description = 'Automate the repetitive. Focus on what matters. Our AI-powered platform handles the rest so your team can ship faster.',
  primaryCta = { label: 'Start free trial', href: '#' },
  secondaryCta = { label: 'Book a demo', href: '#' },
  image,
  class: className,
}) => (
  <section class={cn('py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 class="max-w-2xl text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p class="mt-6 max-w-lg text-lg text-foreground-muted">
            {description}
          </p>
          <div class="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href={primaryCta.href}
              class={cn(getButtonClasses('default'), 'w-full sm:w-auto')}
            >
              {primaryCta.label}
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                class={cn(getButtonClasses('ghost'), 'w-full sm:w-auto')}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>
        <div>
          {image ? (
            <img
              src={image.src}
              alt={image.alt}
              class="w-full rounded-2xl bg-card shadow-md"
            />
          ) : (
            <PlaceholderGradient variant={2} class="aspect-[4/3] w-full" />
          )}
        </div>
      </div>
    </div>
  </section>
)

export default Hero02
