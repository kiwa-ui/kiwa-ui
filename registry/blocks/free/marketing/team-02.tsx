import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { teamMembers } from '@/lib/placeholder-data'

type Member = {
  name: string
  role: string
  avatar?: string
}

export type Team02Props = {
  eyebrow?: string
  title?: string
  description?: string
  members?: Member[]
  showHeader?: boolean
  class?: string
}

const defaultMembers: Member[] = teamMembers.slice(0, 6).map((m) => ({
  name: m.name,
  role: m.role,
  avatar: m.avatar,
}))

export const Team02: FC<Team02Props> = ({
  eyebrow = 'Team',
  title = 'The team behind it all',
  description = 'We bring together diverse perspectives to build something meaningful.',
  members = defaultMembers,
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
            <p class="text-base text-foreground-muted">{description}</p>
          )}
        </div>
      )}

      <div class={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3', showHeader && 'mt-12')}>
        {members.map((member, index) => (
          <div key={index}>
            <div class="overflow-hidden rounded-xl shadow">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  class="aspect-square w-full object-cover"
                />
              ) : (
                <div class="aspect-square w-full bg-muted" />
              )}
            </div>
            <div class="mt-3">
              <h3 class="text-sm tracking-tight">
                {member.name}
              </h3>
              <p class="mt-0.5 text-sm text-foreground-soft">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Team02
