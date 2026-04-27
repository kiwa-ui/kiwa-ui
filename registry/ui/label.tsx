import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type LabelProps = JSX.IntrinsicElements['label']

export const Label: FC<LabelProps> = ({
  class: className,
  children,
  ...props
}) => (
  <label
    data-slot="label"
    class={cn(
      'flex items-center gap-2 text-sm leading-none font-medium select-none',
      'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </label>
)
