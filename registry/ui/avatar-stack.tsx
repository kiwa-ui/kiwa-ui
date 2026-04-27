import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const sizeVariants = {
  xs: '-space-x-1.5',
  sm: '-space-x-2',
  default: '-space-x-2.5',
  lg: '-space-x-3',
  xl: '-space-x-4',
  '2xl': '-space-x-5',
}

type AvatarStackProps = JSX.IntrinsicElements['div'] & {
  avatars: { name: string; avatar?: string }[]
  size?: keyof typeof sizeVariants
  max?: number
}

export const AvatarStack: FC<AvatarStackProps> = ({
  avatars,
  size = 'default',
  max = 3,
  class: className,
  ...props
}) => {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div
      data-slot="avatar-stack"
      class={cn('flex overflow-visible', sizeVariants[size], className)}
      {...props}
    >
      {visible.map((avatar, i) => (
        <Avatar key={i} size={size}>
          {avatar.avatar ? (
            <AvatarImage src={avatar.avatar} alt={avatar.name} />
          ) : (
            <AvatarFallback>
              {avatar.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          )}
        </Avatar>
      ))}
      {overflow > 0 && (
        <Avatar size={size}>
          <AvatarFallback>+{overflow}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
