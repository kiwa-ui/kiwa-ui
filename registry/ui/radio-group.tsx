import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type RadioGroupProps = JSX.IntrinsicElements['div']

export const RadioGroup: FC<RadioGroupProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="radio-group"
    role="radiogroup"
    class={cn('grid gap-3', className)}
    {...props}
  >
    {children}
  </div>
)

type RadioGroupItemProps = Omit<JSX.IntrinsicElements['input'], 'type'>

export const RadioGroupItem: FC<RadioGroupItemProps> = ({
  class: className,
  ...props
}) => (
  <input
    type="radio"
    data-slot="radio-group-item"
    class={cn(
      'size-4 shrink-0 appearance-none rounded-full border border-input bg-background cursor-pointer',
      'checked:border-primary checked:border-[5px]',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-colors',
      className
    )}
    {...props}
  />
)
