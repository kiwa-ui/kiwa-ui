import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

const toggleVariants = {
  variant: {
    default: 'bg-transparent',
    outline: 'border border-input bg-transparent hover:bg-secondary hover:text-foreground',
  },
  size: {
    default: 'h-9 px-3 min-w-9',
    sm: 'h-8 px-2 min-w-8',
    lg: 'h-10 px-4 min-w-10',
  },
}

type ToggleProps = JSX.IntrinsicElements['button'] & {
  variant?: keyof typeof toggleVariants.variant
  size?: keyof typeof toggleVariants.size
  defaultPressed?: boolean
}

export const Toggle: FC<ToggleProps> = ({
  variant = 'default',
  size = 'default',
  defaultPressed = false,
  class: className,
  children,
  ...props
}) => (
  <button
    data-toggle
    data-state={defaultPressed ? 'on' : 'off'}
    data-default-pressed={defaultPressed ? '' : undefined}
    aria-pressed={defaultPressed}
    class={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg border border-transparent text-sm font-medium',
      'transition-colors',
      'hover:bg-secondary hover:text-foreground-muted',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=on]:bg-muted data-[state=on]:text-foreground',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      toggleVariants.variant[variant],
      toggleVariants.size[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
)
