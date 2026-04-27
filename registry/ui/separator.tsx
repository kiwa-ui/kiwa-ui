import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type SeparatorProps = JSX.IntrinsicElements['div'] & {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export const Separator: FC<SeparatorProps> = ({
  orientation = 'horizontal',
  decorative = true,
  class: className,
  ...props
}) => (
  <div
    data-slot="separator"
    role={decorative ? 'none' : 'separator'}
    aria-orientation={decorative ? undefined : orientation}
    data-orientation={orientation}
    class={cn(
      'bg-border shrink-0',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className
    )}
    {...props}
  />
)
