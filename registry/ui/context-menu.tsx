import type { FC, JSX, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'

type ContextMenuProps = PropsWithChildren<{
  id: string
  class?: string
}>

type ContextMenuTriggerProps = JSX.IntrinsicElements['div'] & {
  menuId: string
}

type ContextMenuContentProps = JSX.IntrinsicElements['div']
const contextMenuItemVariants = {
  variant: {
    default:
      'text-foreground hover:bg-secondary focus-visible:bg-secondary data-[highlighted=true]:bg-secondary',
    destructive:
      'text-destructive hover:bg-destructive-soft hover:text-destructive focus-visible:bg-destructive-soft focus-visible:text-destructive data-[highlighted=true]:bg-destructive-soft data-[highlighted=true]:text-destructive',
  },
}

type ContextMenuItemProps = JSX.IntrinsicElements['button'] & {
  variant?: keyof typeof contextMenuItemVariants.variant
}
type ContextMenuSeparatorProps = JSX.IntrinsicElements['div']
type ContextMenuLabelProps = JSX.IntrinsicElements['div']

export const ContextMenu: FC<ContextMenuProps> = ({
  id,
  class: className,
  children,
}) => (
  <div
    data-context-menu={id}
    data-state="closed"
    hidden
    class={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-xl bg-popover p-1 text-foreground shadow-md',
      'flex flex-col gap-1',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      className
    )}
  >
    {children}
  </div>
)

export const ContextMenuTrigger: FC<ContextMenuTriggerProps> = ({
  menuId,
  class: className,
  children,
  ...props
}) => (
  <div
    data-context-menu-trigger={menuId}
    class={cn('', className)}
    {...props}
  >
    {children}
  </div>
)

export const ContextMenuContent: FC<ContextMenuContentProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div class={cn('', className)} {...props}>
    {children}
  </div>
)

export const ContextMenuItem: FC<ContextMenuItemProps> = ({
  variant = 'default',
  class: className,
  children,
  ...props
}) => (
  <button
    data-context-menu-item
    role="menuitem"
    tabindex={-1}
    class={cn(
      'relative flex w-full cursor-default select-none items-center gap-2',
      'h-8 rounded-lg border border-transparent px-2 text-sm outline-none',
      'transition-colors',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      'disabled:pointer-events-none disabled:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      contextMenuItemVariants.variant[variant],
      className,
    )}
    {...props}
  >
    {children}
  </button>
)

export const ContextMenuSeparator: FC<ContextMenuSeparatorProps> = ({
  class: className,
  ...props
}) => (
  <div
    data-context-menu-separator
    role="separator"
    class={cn('-mx-1 my-1 h-px bg-border-subtle', className)}
    {...props}
  />
)

export const ContextMenuLabel: FC<ContextMenuLabelProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    class={cn('px-2 py-1.5 text-sm font-semibold text-foreground', className)}
    {...props}
  >
    {children}
  </div>
)
