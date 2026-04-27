import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type TextareaProps = JSX.IntrinsicElements['textarea']

export const Textarea: FC<TextareaProps> = ({
  class: className,
  ...props
}) => (
  <textarea
    data-slot="textarea"
    class={cn(
      'border-input placeholder:text-foreground-soft bg-background-raised',
      'flex field-sizing-content min-h-16 w-full rounded-lg border px-3 py-2 text-base',
      'transition-[color,box-shadow] outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'md:text-sm',
      className
    )}
    {...props}
  />
)
