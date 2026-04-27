import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type KbdProps = JSX.IntrinsicElements['kbd']

export const Kbd: FC<KbdProps> = ({
  class: className,
  children,
  ...props
}) => (
  <kbd
    data-slot="kbd"
    class={cn(
      'bg-muted text-foreground-muted pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none shadow-xs',
      "[&_svg:not([class*='size-'])]:size-3",
      '[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10',
      className
    )}
    {...props}
  >
    {children}
  </kbd>
)

type KbdGroupProps = JSX.IntrinsicElements['div']

export const KbdGroup: FC<KbdGroupProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="kbd-group"
    class={cn('inline-flex items-center gap-1', className)}
    {...props}
  >
    {children}
  </div>
)
