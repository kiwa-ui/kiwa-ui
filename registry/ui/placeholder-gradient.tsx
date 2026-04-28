import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type PlaceholderGradientProps = JSX.IntrinsicElements['div'] & {
  variant?: 1 | 2 | 3 | 4
  position?: string
}

export const PlaceholderGradient: FC<PlaceholderGradientProps> = ({
  variant = 1,
  position = 'center',
  class: className,
  children,
  ...props
}) => (
  <div
    class={cn('bg-muted rounded-2xl shadow-md', className)}
    style={`background-image: var(--swirl-${variant}); background-size: cover; background-position: ${position}; background-repeat: no-repeat`}
    {...props}
  >
    {children}
  </div>
)
