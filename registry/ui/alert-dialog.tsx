import type { FC, JSX, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'

type AlertDialogProps = PropsWithChildren<{
  id: string
  class?: string
}>

type AlertDialogTriggerProps = JSX.IntrinsicElements['button'] & {
  dialogId: string
}

type AlertDialogContentProps = JSX.IntrinsicElements['div']
type AlertDialogHeaderProps = JSX.IntrinsicElements['div']
type AlertDialogFooterProps = JSX.IntrinsicElements['div']
type AlertDialogTitleProps = JSX.IntrinsicElements['h2']
type AlertDialogDescriptionProps = JSX.IntrinsicElements['p']
type AlertDialogActionProps = JSX.IntrinsicElements['button']
type AlertDialogCancelProps = JSX.IntrinsicElements['button']

export const AlertDialog: FC<AlertDialogProps> = ({
  id,
  class: className,
  children,
}) => (
  <div
    data-alert-dialog={id}
    data-state="closed"
    class={cn(
      'fixed inset-0 z-50',
      'data-[state=closed]:hidden data-[state=open]:block',
      className
    )}
  >
    {children}
  </div>
)

export const AlertDialogTrigger: FC<AlertDialogTriggerProps> = ({
  dialogId,
  class: className,
  children,
  ...props
}) => (
  <button
    data-alert-dialog-trigger={dialogId}
    aria-expanded="false"
    class={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent text-sm font-medium',
      'h-9 px-4 py-2',
      'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
      'transition-all outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export const AlertDialogOverlay: FC<JSX.IntrinsicElements['div']> = ({
  class: className,
  ...props
}) => (
  <div
    data-alert-dialog-overlay
    class={cn(
      'fixed inset-0 z-50 bg-overlay-scrim',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className
    )}
    {...props}
  />
)

export const AlertDialogContent: FC<AlertDialogContentProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-alert-dialog-content
    role="alertdialog"
    class={cn(
      'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
      'grid w-full max-w-lg gap-4 bg-card p-6 shadow-lg',
      'rounded-xl sm:rounded-xl',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export const AlertDialogHeader: FC<AlertDialogHeaderProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="alert-dialog-header"
    class={cn('flex flex-col gap-2 text-center sm:text-left', className)}
    {...props}
  >
    {children}
  </div>
)

export const AlertDialogFooter: FC<AlertDialogFooterProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="alert-dialog-footer"
    class={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  >
    {children}
  </div>
)

export const AlertDialogTitle: FC<AlertDialogTitleProps> = ({
  class: className,
  children,
  ...props
}) => (
  <h2
    data-slot="alert-dialog-title"
    class={cn('text-lg', className)}
    {...props}
  >
    {children}
  </h2>
)

export const AlertDialogDescription: FC<AlertDialogDescriptionProps> = ({
  class: className,
  children,
  ...props
}) => (
  <p
    data-slot="alert-dialog-description"
    class={cn('text-sm text-foreground-muted', className)}
    {...props}
  >
    {children}
  </p>
)

export const AlertDialogAction: FC<AlertDialogActionProps> = ({
  class: className,
  children,
  ...props
}) => (
  <button
    data-alert-dialog-action
    class={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent text-sm font-medium',
      'h-9 px-4 py-2',
      'bg-primary text-primary-foreground hover:bg-primary/90',
      'transition-all outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export const AlertDialogCancel: FC<AlertDialogCancelProps> = ({
  class: className,
  children,
  ...props
}) => (
  <button
    data-alert-dialog-cancel
    class={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent text-sm font-medium',
      'h-9 px-4 py-2',
      'border bg-background hover:bg-secondary hover:text-foreground',
      'transition-all outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children || 'Cancel'}
  </button>
)
