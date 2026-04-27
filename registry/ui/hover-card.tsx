import type { FC, JSX, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'

type Side = 'top' | 'right' | 'bottom' | 'left'
type Align = 'start' | 'center' | 'end'

type HoverCardProps = PropsWithChildren<{
  id: string
  side?: Side
  align?: Align
  openDelay?: number
  closeDelay?: number
  class?: string
}>

type HoverCardTriggerProps = JSX.IntrinsicElements['a'] & {
  cardId: string
}

type HoverCardContentProps = JSX.IntrinsicElements['div']

export const HoverCard: FC<HoverCardProps> = ({
  id,
  side = 'bottom',
  align = 'center',
  openDelay = 500,
  closeDelay = 300,
  class: className,
  children,
}) => (
  <div
    data-hover-card={id}
    data-hover-card-side={side}
    data-hover-card-align={align}
    data-hover-card-open-delay={openDelay}
    data-hover-card-close-delay={closeDelay}
    data-state="closed"
    hidden
    class={cn(
      'z-50 w-64 rounded-xl bg-popover p-4 text-foreground shadow-md outline-none',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className
    )}
  >
    {children}
  </div>
)

export const HoverCardTrigger: FC<HoverCardTriggerProps> = ({
  cardId,
  class: className,
  children,
  ...props
}) => (
  <a
    data-hover-card-trigger={cardId}
    class={cn(
      'inline-flex cursor-pointer',
      className
    )}
    {...props}
  >
    {children}
  </a>
)

export const HoverCardContent: FC<HoverCardContentProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-hover-card-content
    class={cn('', className)}
    {...props}
  >
    {children}
  </div>
)
