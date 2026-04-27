import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { teamMembers } from '@/lib/placeholder-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Member = {
  name: string
  role: string
  avatar?: string
}

export type Team01Props = {
  eyebrow?: string
  title?: string
  description?: string
  members?: Member[]
  showHeader?: boolean
  class?: string
}

const defaultMembers: Member[] = teamMembers.map((m) => ({
  name: m.name,
  role: m.role,
  avatar: m.avatar,
}))

export const Team01: FC<Team01Props> = ({
  eyebrow = 'Team',
  title = 'Meet the people behind the product',
  description = 'A small but mighty team dedicated to building tools that help you ship faster.',
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

      <div class={cn('grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4', showHeader && 'mt-12')}>
        {members.map((member, index) => (
          <div key={index} class="flex flex-col items-center gap-3 text-center">
            <Avatar class="size-20">
              {member.avatar ? (
                <AvatarImage src={member.avatar} alt={member.name} />
              ) : null}
              <AvatarFallback class="text-xl">
                {member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 class="text-sm tracking-tight">
                {member.name}
              </h3>
              <p class="mt-1 text-sm text-foreground-soft">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Team01
