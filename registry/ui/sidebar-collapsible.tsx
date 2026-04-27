import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { sidebarItemVariants } from '@/components/ui/sidebar-item'
import { ChevronDownIcon } from '@/components/ui/icon'

type SidebarCollapsibleProps = JSX.IntrinsicElements['div']

export const SidebarCollapsible: FC<SidebarCollapsibleProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-collapsible
    data-state="closed"
    class={className}
    {...props}
  >
    {children}
  </div>
)

type SidebarCollapsibleTriggerProps = JSX.IntrinsicElements['button']

export const SidebarCollapsibleTrigger: FC<SidebarCollapsibleTriggerProps> = ({
  class: className,
  type = 'button',
  children,
  ...props
}) => (
  <button
    type={type}
    data-collapsible-trigger
    data-state="closed"
    class={cn(
      'flex w-full items-center rounded-lg border border-transparent text-sm font-medium transition-colors outline-none',
      '[&_svg]:size-4 [&_svg]:shrink-0',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      sidebarItemVariants.size.default,
      sidebarItemVariants.base,
      '[&[data-state=open]>svg:last-child]:rotate-180',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDownIcon class="ml-auto text-foreground-soft transition-transform duration-200" />
  </button>
)

type SidebarCollapsibleContentProps = JSX.IntrinsicElements['div']

export const SidebarCollapsibleContent: FC<SidebarCollapsibleContentProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-collapsible-content
    data-state="closed"
    hidden
    style="max-height: 0px"
    class="overflow-hidden"
    {...props}
  >
    <div class={cn('ml-4 flex flex-col gap-1 border-l pl-4 pt-1', className)}>
      {children}
    </div>
  </div>
)
