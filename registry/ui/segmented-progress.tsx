import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

const statusColors = {
  default: 'bg-primary',
  warning: 'bg-warning',
  danger: 'bg-destructive',
}

const statusTrackColors = {
  default: 'bg-primary/20',
  warning: 'bg-warning-soft',
  danger: 'bg-destructive/20',
}

type SegmentedProgressProps = Omit<JSX.IntrinsicElements['div'], 'role'> & {
  segments?: number
  filled?: number
  status?: keyof typeof statusColors
}

export const SegmentedProgress: FC<SegmentedProgressProps> = ({
  segments = 40,
  filled = 0,
  status = 'default',
  class: className,
  ...props
}) => {
  const clamped = Math.min(segments, Math.max(0, filled))

  return (
    <div
      data-slot="segmented-progress"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={segments}
      class={cn('flex w-full items-end gap-0.5', className)}
      {...props}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          class={cn(
            'h-4 flex-1 rounded-full',
            i < clamped ? statusColors[status] : statusTrackColors[status],
          )}
        />
      ))}
    </div>
  )
}
