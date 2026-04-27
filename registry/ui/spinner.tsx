import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { RefreshIcon } from '@/components/ui/icon'

type SpinnerProps = {
  class?: string
}

export const Spinner: FC<SpinnerProps> = ({
  class: className,
}) => (
  <RefreshIcon
    data-slot="spinner"
    role="status"
    aria-label="Loading"
    class={cn('size-4 animate-spin', className)}
  />
)
