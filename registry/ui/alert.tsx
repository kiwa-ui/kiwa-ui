import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

const alertVariants = {
  variant: {
    default: [
      'bg-card text-foreground shadow',
      '[&>svg]:text-foreground-muted',
      '*:data-[slot=alert-close]:text-foreground-muted *:data-[slot=alert-close]:hover:bg-secondary',
    ],
    destructive: [
      'bg-destructive-soft text-destructive shadow ring-1 ring-destructive/10',
      '[&>svg]:text-destructive',
      '*:data-[slot=alert-close]:text-destructive *:data-[slot=alert-close]:hover:bg-destructive/10',
    ],
    success: [
      'bg-success-soft text-success-foreground shadow ring-1 ring-success/10',
      '[&>svg]:text-success',
      '*:data-[slot=alert-close]:text-success-foreground *:data-[slot=alert-close]:hover:bg-success/10',
    ],
  },
}

type AlertProps = JSX.IntrinsicElements['div'] & {
  variant?: keyof typeof alertVariants.variant
}

export const Alert: FC<AlertProps> = ({
  variant = 'default',
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="alert"
    role="alert"
    class={cn(
      'relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm',
      '[&>svg]:size-4 [&>svg]:shrink-0',
      alertVariants.variant[variant],
      className
    )}
    {...props}
  >
    {children}
  </div>
)

type AlertContentProps = JSX.IntrinsicElements['div']

export const AlertContent: FC<AlertContentProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="alert-content"
    class={cn('flex-1', className)}
    {...props}
  >
    {children}
  </div>
)

type AlertTitleProps = JSX.IntrinsicElements['div']

export const AlertTitle: FC<AlertTitleProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="alert-title"
    class={cn('font-medium leading-5 tracking-tight', className)}
    {...props}
  >
    {children}
  </div>
)

type AlertDescriptionProps = JSX.IntrinsicElements['div']

export const AlertDescription: FC<AlertDescriptionProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="alert-description"
    class={cn('text-sm opacity-80 [&_p]:leading-relaxed', className)}
    {...props}
  >
    {children}
  </div>
)

type AlertCloseProps = JSX.IntrinsicElements['button']

export const AlertClose: FC<AlertCloseProps> = ({
  class: className,
  children,
  ...props
}) => (
  <button
    data-slot="alert-close"
    class={cn(
      'inline-flex size-5 shrink-0 items-center justify-center rounded',
      'transition-colors outline-none',
      'focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      className
    )}
    {...props}
  >
    {children}
  </button>
)
