import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from '@/components/ui/icon'

const selectVariants = {
  size: {
    default: 'h-9 py-2',
    sm: 'h-8 py-1',
  },
}

type SelectProps = Omit<JSX.IntrinsicElements['select'], 'size'> & {
  size?: keyof typeof selectVariants.size
  fullWidth?: boolean
}

export const Select: FC<SelectProps> = ({
  size = 'default',
  fullWidth = false,
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="select-wrapper"
    class={cn(
      "group/select relative has-[select:disabled]:opacity-50",
      fullWidth ? "w-full" : "w-fit",
    )}
  >
    <select
      data-slot='select'
      data-size={size}
      class={cn(
        'w-full min-w-0 appearance-none rounded-lg border border-input bg-card px-3 text-sm text-foreground',
        size === 'sm' ? 'pr-7' : 'pr-8',
        'placeholder:text-foreground-muted',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20',
        'disabled:pointer-events-none disabled:cursor-not-allowed',
        'transition-[color,box-shadow]',
        selectVariants.size[size],
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDownIcon
      class={cn(
        'pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-foreground-muted opacity-50',
        size === 'sm' ? 'size-3.5' : 'size-4',
      )}
      aria-hidden='true'
      data-slot='select-icon'
    />
  </div>
)

type SelectOptionProps = JSX.IntrinsicElements['option']

export const SelectOption: FC<SelectOptionProps> = ({ children, ...props }) => (
  <option data-slot='select-option' {...props}>
    {children}
  </option>
)

type SelectOptGroupProps = JSX.IntrinsicElements['optgroup']

export const SelectOptGroup: FC<SelectOptGroupProps> = ({
  class: className,
  children,
  ...props
}) => (
  <optgroup data-slot='select-optgroup' class={cn(className)} {...props}>
    {children}
  </optgroup>
)
