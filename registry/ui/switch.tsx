import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

const switchVariants = {
  size: {
    default:
      'h-5 w-9 before:size-4 before:translate-x-0.5 checked:before:translate-x-4.5',
    sm: 'h-4 w-7 before:size-3 before:translate-x-0.5 checked:before:translate-x-3.5',
  },
}

type SwitchProps = Omit<JSX.IntrinsicElements['input'], 'type' | 'size'> & {
  size?: keyof typeof switchVariants.size
}

export const Switch: FC<SwitchProps> = ({
  size = 'default',
  class: className,
  ...props
}) => (
  <input
    type="checkbox"
    role="switch"
    data-slot="switch"
    class={cn(
      'appearance-none inline-flex shrink-0 items-center rounded-full cursor-pointer',
      'bg-input checked:bg-primary',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all',
      'before:content-[""] before:block before:rounded-full before:bg-background before:shadow-sm',
      'before:transition-transform',
      switchVariants.size[size],
      className
    )}
    {...props}
  />
)
