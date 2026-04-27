import type { FC, JSX, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'

type Side = 'top' | 'right' | 'bottom' | 'left'

type TooltipProps = PropsWithChildren<{
  class?: string
}>

type TooltipTriggerProps = JSX.IntrinsicElements['div']

type TooltipContentProps = JSX.IntrinsicElements['div'] & {
  side?: Side
}

// Tooltip wrapper - contains trigger and content
export const Tooltip: FC<TooltipProps> = ({
  class: className,
  children,
}) => (
  <div
    data-slot="tooltip"
    class={cn('group/tooltip relative inline-flex', className)}
  >
    {children}
  </div>
)

// TooltipTrigger - the element that triggers the tooltip
export const TooltipTrigger: FC<TooltipTriggerProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-tooltip-trigger
    class={cn('inline-flex', className)}
    {...props}
  >
    {children}
  </div>
)

// TooltipContent - the tooltip popup content
export const TooltipContent: FC<TooltipContentProps> = ({
  side = 'top',
  class: className,
  children,
  ...props
}) => (
  <div
    data-tooltip-content
    data-side={side}
    data-state="closed"
    role="tooltip"
    class={cn(
      'absolute z-50 hidden overflow-hidden rounded-md bg-popover px-3 py-1.5 text-xs text-foreground shadow',
      'whitespace-nowrap',
      side === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
      side === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
      side === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2',
      'group-hover/tooltip:block',
      className
    )}
    {...props}
  >
    {children}
  </div>
)
