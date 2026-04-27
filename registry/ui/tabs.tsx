import type { FC, JSX, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'

type TabsProps = PropsWithChildren<{
  defaultValue?: string
  class?: string
}>

type TabsSize = 'default' | 'sm'
type TabsVariant = 'boxed' | 'underline'

type TabsListProps = JSX.IntrinsicElements['div'] & {
  size?: TabsSize
  variant?: TabsVariant
}

type TabsTriggerProps = JSX.IntrinsicElements['button'] & {
  value: string
  size?: TabsSize
  variant?: TabsVariant
}

type TabsContentProps = JSX.IntrinsicElements['div'] & {
  value: string
}

export const Tabs: FC<TabsProps> = ({
  defaultValue,
  class: className,
  children,
}) => (
  <div
    data-tabs
    data-tabs-default={defaultValue}
    class={cn('w-full', className)}
  >
    {children}
  </div>
)

const tabsListVariants = {
  variant: {
    boxed: 'inline-flex items-center justify-center rounded-lg bg-muted',
    underline: 'flex w-full gap-2 border-b border-border bg-transparent rounded-none',
  },
  size: {
    default: 'h-9 p-0.5',
    sm: 'h-8 p-0.5',
  },
  underlineSize: {
    default: 'h-9',
    sm: 'h-8',
  },
}

export const TabsList: FC<TabsListProps> = ({
  size = 'default',
  variant = 'boxed',
  class: className,
  children,
  ...props
}) => (
  <div
    data-tabs-list
    role="tablist"
    class={cn(
      'text-foreground-muted',
      tabsListVariants.variant[variant],
      variant === 'underline'
        ? tabsListVariants.underlineSize[size]
        : tabsListVariants.size[size],
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const tabsTriggerVariants = {
  variant: {
    boxed: [
      'rounded-md border border-transparent',
      'data-[state=active]:bg-card data-[state=active]:text-foreground',
      'data-[state=active]:shadow-xs',
    ].join(' '),
    underline: [
      'rounded-none border-b-2 border-transparent -mb-px',
      'hover:text-foreground hover:border-foreground',
      'data-[state=active]:border-foreground data-[state=active]:text-foreground',
      'data-[state=active]:shadow-none data-[state=active]:bg-transparent',
    ].join(' '),
  },
  size: {
    default: 'h-8 px-3 text-sm',
    sm: 'h-7 px-2.5 text-xs',
  },
  underlineSize: {
    default: 'px-2 pb-2.5 text-sm',
    sm: 'px-2 pb-2 text-sm',
  },
}

export const TabsTrigger: FC<TabsTriggerProps> = ({
  value,
  size = 'default',
  variant = 'boxed',
  class: className,
  children,
  ...props
}) => (
  <button
    data-tabs-trigger={value}
    data-state="inactive"
    role="tab"
    class={cn(
      'inline-flex items-center justify-center whitespace-nowrap',
      'font-medium transition-all',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20',
      'disabled:pointer-events-none disabled:opacity-50',
      tabsTriggerVariants.variant[variant],
      variant === 'underline'
        ? tabsTriggerVariants.underlineSize[size]
        : tabsTriggerVariants.size[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export const TabsContent: FC<TabsContentProps> = ({
  value,
  class: className,
  children,
  ...props
}) => (
  <div
    data-tabs-content={value}
    data-state="inactive"
    role="tabpanel"
    hidden
    class={cn(
      'mt-6',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20',
      'data-[state=inactive]:hidden',
      className
    )}
    {...props}
  >
    {children}
  </div>
)
