import type { FC, JSX, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'

type CollapsibleProps = PropsWithChildren<{
  defaultOpen?: boolean
  class?: string
}>

type CollapsibleTriggerProps = JSX.IntrinsicElements['button']
type CollapsibleContentProps = JSX.IntrinsicElements['div'] & {
  defaultOpen?: boolean
}
type CollapsibleItemProps = JSX.IntrinsicElements['div']

export const Collapsible: FC<CollapsibleProps> = ({
  defaultOpen = false,
  class: className,
  children,
}) => (
  <div
    data-collapsible
    data-state={defaultOpen ? 'open' : 'closed'}
    data-default-open={defaultOpen ? '' : undefined}
    class={cn(
      'w-full rounded-xl bg-card p-3 shadow-sm',
      className
    )}
  >
    {children}
  </div>
)

export const CollapsibleTrigger: FC<CollapsibleTriggerProps> = ({
  class: className,
  children,
  ...props
}) => (
  <button
    data-collapsible-trigger
    aria-expanded="false"
    class={cn(
      'flex w-full items-center justify-between rounded-md border border-transparent',
      'text-sm font-medium text-foreground outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      '[&[aria-expanded=true]>svg]:rotate-180 [&[data-state=open]>svg]:rotate-180',
      '[&>svg]:transition-transform [&>svg]:duration-200',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export const CollapsibleContent: FC<CollapsibleContentProps> = ({
  defaultOpen = false,
  class: className,
  children,
  ...props
}) => (
  <div
    data-collapsible-content
    data-state={defaultOpen ? 'open' : 'closed'}
    hidden={!defaultOpen}
    class={cn(
      'mt-2 space-y-2 overflow-hidden p-1',
      'data-[state=closed]:hidden',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export const CollapsibleItem: FC<CollapsibleItemProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="collapsible-item"
    class={cn(
      'rounded-lg bg-background px-3 py-2 text-sm text-foreground shadow-sm',
      className
    )}
    {...props}
  >
    {children}
  </div>
)
