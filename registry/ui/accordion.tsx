import type { FC, JSX, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from '@/components/ui/icon'

type AccordionProps = PropsWithChildren<{
  type?: 'single' | 'multiple'
  class?: string
}>

const accordionItemVariants = {
  default: 'border-b',
  card: 'rounded-xl bg-card px-6 shadow-md',
}

type AccordionItemProps = JSX.IntrinsicElements['div'] & {
  value: string
  variant?: keyof typeof accordionItemVariants
}

type AccordionTriggerProps = JSX.IntrinsicElements['button']
type AccordionContentProps = JSX.IntrinsicElements['div']

export const Accordion: FC<AccordionProps> = ({
  type = 'single',
  class: className,
  children,
}) => (
  <div
    data-accordion
    data-accordion-type={type}
    class={cn('w-full', className)}
  >
    {children}
  </div>
)

export const AccordionItem: FC<AccordionItemProps> = ({
  value,
  variant = 'default',
  class: className,
  children,
  ...props
}) => (
  <div
    data-accordion-item={value}
    data-state="closed"
    class={cn(accordionItemVariants[variant], className)}
    {...props}
  >
    {children}
  </div>
)

export const AccordionTrigger: FC<AccordionTriggerProps> = ({
  class: className,
  children,
  ...props
}) => (
  <h3 class="flex">
    <button
      data-accordion-trigger
      aria-expanded="false"
      class={cn(
        'flex flex-1 items-center justify-between rounded-md border border-transparent py-4 text-sm font-medium outline-none',
        'transition-all',
        'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
        '[&[aria-expanded=true]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon class="size-3.5 shrink-0 text-foreground transition-transform duration-200" />
    </button>
  </h3>
)

export const AccordionContent: FC<AccordionContentProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-accordion-content
    data-state="closed"
    class={cn(
      'grid text-sm transition-[grid-template-rows] duration-200 ease-out',
      'data-[state=closed]:grid-rows-[0fr]',
      'data-[state=open]:grid-rows-[1fr]',
      className
    )}
    {...props}
  >
    <div class="overflow-hidden">
      <div class="pt-2 pb-4">{children}</div>
    </div>
  </div>
)
