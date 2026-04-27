import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type EmptyProps = JSX.IntrinsicElements['div']

export const Empty: FC<EmptyProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="empty"
    class={cn(
      'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-border bg-background p-6 text-center text-balance md:p-12',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

type EmptyHeaderProps = JSX.IntrinsicElements['div']

export const EmptyHeader: FC<EmptyHeaderProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="empty-header"
    class={cn(
      'flex max-w-sm flex-col items-center gap-1 text-center',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const emptyMediaVariants = {
  variant: {
    default: 'bg-transparent',
    icon: 'bg-card text-foreground flex size-9 shrink-0 items-center justify-center rounded-[10px] shadow [&_svg:not([class*="size-"])]:size-4',
  },
}

type EmptyMediaProps = JSX.IntrinsicElements['div'] & {
  variant?: keyof typeof emptyMediaVariants.variant
}

export const EmptyMedia: FC<EmptyMediaProps> = ({
  class: className,
  variant = 'default',
  children,
  ...props
}) => (
  <div
    data-slot="empty-media"
    data-variant={variant}
    class={cn(
      'flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      emptyMediaVariants.variant[variant],
      className
    )}
    {...props}
  >
    {children}
  </div>
)

type EmptyTitleProps = JSX.IntrinsicElements['div']

export const EmptyTitle: FC<EmptyTitleProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="empty-title"
    class={cn('text-lg font-medium tracking-tight', className)}
    {...props}
  >
    {children}
  </div>
)

type EmptyDescriptionProps = JSX.IntrinsicElements['p']

export const EmptyDescription: FC<EmptyDescriptionProps> = ({
  class: className,
  children,
  ...props
}) => (
  <p
    data-slot="empty-description"
    class={cn(
      'text-foreground-muted [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
      className
    )}
    {...props}
  >
    {children}
  </p>
)

type EmptyContentProps = JSX.IntrinsicElements['div']

export const EmptyContent: FC<EmptyContentProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="empty-content"
    class={cn(
      'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance',
      className
    )}
    {...props}
  >
    {children}
  </div>
)
