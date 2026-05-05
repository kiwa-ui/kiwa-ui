import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { getButtonClasses } from '@/components/ui/button'
import { AvatarStack } from '@/components/ui/avatar-stack'
import { people } from '@/lib/placeholder-data'

const defaultAvatars = people.slice(0, 5).map((p) => ({
  name: p.name,
  avatar: p.avatar,
}))

type Cta01Props = {
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
  avatars?: { name: string; avatar?: string }[]
  avatarText?: string
  class?: string
}

export const Cta01: FC<Cta01Props> = ({
  title = 'Ship your next project in hours, not weeks',
  description = 'Everything you need to go from zero to production. Free tier included, no credit card required.',
  primaryCta = { label: 'Start building', href: '#' },
  secondaryCta = { label: 'View pricing', href: '#' },
  avatars = defaultAvatars,
  avatarText = 'Joined by 2,000+ developers',
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        <h2 class="text-3xl tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p class="max-w-lg text-base text-foreground-muted">
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
              class={cn(getButtonClasses('outline'), 'w-full sm:w-auto')}
            >
              {secondaryCta.label}
            </a>
          )}
        </div>
        {avatars && avatars.length > 0 && (
          <div class="mt-4 flex items-center gap-3">
            <AvatarStack avatars={avatars} size="default" />
            {avatarText && (
              <p class="text-sm text-foreground-muted">{avatarText}</p>
            )}
          </div>
        )}
      </div>
    </div>
  </section>
)

export default Cta01
