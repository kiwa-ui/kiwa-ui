import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { getButtonClasses } from '@/components/ui/button'
import { PlaceholderGradient } from '@/components/ui/placeholder-gradient'

type Hero01Props = {
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

export const Hero01: FC<Hero01Props> = ({
  title = 'Build, ship, and scale your next big idea',
  description = 'The modern platform for teams who want to move fast. Powerful tools, seamless workflows, and insights that drive real results.',
  primaryCta = { label: 'Get started', href: '#' },
  secondaryCta = { label: 'Learn more', href: '#' },
  image,
  class: className,
}) => (
  <section class={cn('py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto flex flex-col items-center gap-6 text-center">
        <h1 class="max-w-2xl text-4xl tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p class="max-w-lg text-lg text-foreground-muted">
          {description}
        </p>
        <div class="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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
    </div>
    <div class="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:mt-20 lg:px-8">
      {image ? (
        <img
          src={image.src}
          alt={image.alt}
          class="w-full rounded-2xl bg-card shadow-md"
        />
      ) : (
        <PlaceholderGradient variant={1} class="aspect-[16/9] w-full" />
      )}
    </div>
  </section>
)

export default Hero01
