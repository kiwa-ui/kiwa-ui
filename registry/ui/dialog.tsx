import type { FC, JSX, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'

type DialogProps = PropsWithChildren<{
  id: string
  open?: boolean
  shortcut?: string
  class?: string
}>

type DialogTriggerProps = JSX.IntrinsicElements['button'] & {
  dialogId: string
}

type DialogContentProps = JSX.IntrinsicElements['div']
type DialogHeaderProps = JSX.IntrinsicElements['div']
type DialogFooterProps = JSX.IntrinsicElements['div']
type DialogTitleProps = JSX.IntrinsicElements['h2']
type DialogDescriptionProps = JSX.IntrinsicElements['p']
type DialogCloseProps = JSX.IntrinsicElements['button']

export const Dialog: FC<DialogProps> = ({
  id,
  open = false,
  shortcut,
  class: className,
  children,
}) => (
  <div
    data-dialog={id}
    data-state={open ? 'open' : 'closed'}
    data-dialog-shortcut={shortcut}
    class={cn(
      'fixed inset-0 z-50 hidden',
      'data-[state=open]:block',
      className
    )}
  >
    {children}
  </div>
)

export const DialogTrigger: FC<DialogTriggerProps> = ({
  dialogId,
  class: className,
  children,
  ...props
}) => (
  <button
    data-dialog-trigger={dialogId}
    aria-expanded="false"
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

export const DialogOverlay: FC<JSX.IntrinsicElements['div']> = ({
  class: className,
  ...props
}) => (
  <div
    data-dialog-overlay
    class={cn(
      'fixed inset-0 z-50 bg-overlay-scrim',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className
    )}
    {...props}
  />
)

export const DialogContent: FC<DialogContentProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-dialog-content
    class={cn(
      'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
      'grid w-full max-w-lg max-h-[calc(100dvh-4rem)] overflow-y-auto gap-4 bg-card p-6 shadow-lg',
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

export const DialogHeader: FC<DialogHeaderProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="dialog-header"
    class={cn('flex flex-col gap-2 text-center sm:text-left', className)}
    {...props}
  >
    {children}
  </div>
)

export const DialogFooter: FC<DialogFooterProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="dialog-footer"
    class={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  >
    {children}
  </div>
)

export const DialogTitle: FC<DialogTitleProps> = ({
  class: className,
  children,
  ...props
}) => (
  <h2
    data-slot="dialog-title"
    class={cn('text-lg leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h2>
)

export const DialogDescription: FC<DialogDescriptionProps> = ({
  class: className,
  children,
  ...props
}) => (
  <p
    data-slot="dialog-description"
    class={cn('text-sm text-foreground-muted', className)}
    {...props}
  >
    {children}
  </p>
)

export const DialogClose: FC<DialogCloseProps> = ({
  class: className,
  children,
  ...props
}) => (
  <button
    data-dialog-close
    class={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium',
      'h-9 px-4 py-2',
      'border bg-background hover:bg-secondary hover:text-foreground',
      'transition-all outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children || 'Close'}
  </button>
)
