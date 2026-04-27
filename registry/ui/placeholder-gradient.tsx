import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type PlaceholderGradientProps = JSX.IntrinsicElements['div'] & {
  variant?: 1 | 2 | 3 | 4
}

export const PlaceholderGradient: FC<PlaceholderGradientProps> = ({
  variant = 1,
  class: className,
  children,
  ...props
}) => (
  <div
    class={cn('bg-muted rounded-2xl shadow-md', className)}
    style={`background-image: var(--swirl-${variant}); background-size: cover; background-position: center; background-repeat: no-repeat`}
    {...props}
  >
    {children}
  </div>
)
