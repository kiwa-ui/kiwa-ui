import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { ArrowLeftIcon, ArrowRightIcon, MoreHorizontalIcon } from '@/components/ui/icon'

type PaginationProps = JSX.IntrinsicElements['nav']

export const Pagination: FC<PaginationProps> = ({
  class: className,
  children,
  ...props
}) => (
  <nav
    role="navigation"
    aria-label="pagination"
    data-slot="pagination"
    class={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  >
    {children}
  </nav>
)

type PaginationContentProps = JSX.IntrinsicElements['ul']

export const PaginationContent: FC<PaginationContentProps> = ({
  class: className,
  children,
  ...props
}) => (
  <ul
    data-slot="pagination-content"
    class={cn('flex flex-row items-center gap-1', className)}
    {...props}
  >
    {children}
  </ul>
)

type PaginationItemProps = JSX.IntrinsicElements['li']

export const PaginationItem: FC<PaginationItemProps> = ({ children, ...props }) => (
  <li data-slot='pagination-item' {...props}>
    {children}
  </li>
)

type PaginationLinkProps = JSX.IntrinsicElements['a'] & {
  isActive?: boolean
  size?: 'default' | 'icon'
}

export const PaginationLink: FC<PaginationLinkProps> = ({
  class: className,
  isActive,
  size = 'icon',
  children,
  ...props
}) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    data-slot="pagination-link"
    data-active={isActive}
    class={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent text-sm font-medium transition-all outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      'disabled:pointer-events-none disabled:opacity-50',
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
      isActive
        ? 'border bg-background shadow-sm hover:bg-secondary hover:text-foreground'
        : 'hover:bg-secondary hover:text-foreground',
      size === 'icon' ? 'size-9' : 'h-9 px-4 py-2 has-[>svg]:px-3',
      className
    )}
    {...props}
  >
    {children}
  </a>
)

type PaginationPreviousProps = JSX.IntrinsicElements['a']

export const PaginationPrevious: FC<PaginationPreviousProps> = ({
  class: className,
  children,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    class={cn('gap-1 px-2.5 sm:pl-2.5', className)}
    {...props}
  >
    <ArrowLeftIcon class="size-4" />
    <span class="hidden sm:block">{children ?? 'Previous'}</span>
  </PaginationLink>
)

type PaginationNextProps = JSX.IntrinsicElements['a']

export const PaginationNext: FC<PaginationNextProps> = ({
  class: className,
  children,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    class={cn('gap-1 px-2.5 sm:pr-2.5', className)}
    {...props}
  >
    <span class="hidden sm:block">{children ?? 'Next'}</span>
    <ArrowRightIcon class="size-4" />
  </PaginationLink>
)

type PaginationEllipsisProps = JSX.IntrinsicElements['span']

export const PaginationEllipsis: FC<PaginationEllipsisProps> = ({
  class: className,
  ...props
}) => (
  <span
    aria-hidden
    data-slot="pagination-ellipsis"
    class={cn('flex size-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontalIcon class="size-4" />
    <span class="sr-only">More pages</span>
  </span>
)
