import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

const displayCardVariants = {
  default: 'bg-card shadow-md',
  primary: 'bg-primary-mesh shadow-primary',
}

const displayCardPadding = {
  xs: 'p-1.5',
  sm: 'p-3',
  md: 'p-5 sm:p-6',
  lg: 'p-8',
}

type DisplayCardProps = JSX.IntrinsicElements['div'] & {
  title?: string
  description?: string
  tall?: boolean
  variant?: keyof typeof displayCardVariants
  padding?: keyof typeof displayCardPadding
}

export const DisplayCard: FC<DisplayCardProps> = ({
  title,
  description,
  tall = false,
  variant = 'default',
  padding = 'md',
  class: className,
  children,
  ...props
}) => (
  <div
    class={cn(
      'flex flex-col rounded-2xl',
      displayCardPadding[padding],
      displayCardVariants[variant],
      tall && 'h-[320px]',
      className
    )}
    {...props}
  >
    {(title || description) && (
      <div>
        {title && <h3 class="tracking-tight text-foreground">{title}</h3>}
        {description && <p class="mt-1 text-sm text-foreground-muted">{description}</p>}
      </div>
    )}
    {children}
  </div>
)
