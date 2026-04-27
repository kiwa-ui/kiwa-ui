import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type SliderProps = Omit<JSX.IntrinsicElements['div'], 'children'> & {
  min?: number
  max?: number
  step?: number
  value?: number
  orientation?: 'horizontal' | 'vertical'
}

export const Slider: FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  orientation = 'horizontal',
  class: className,
  ...props
}) => (
  <div
    data-slider
    data-slider-min={min}
    data-slider-max={max}
    data-slider-step={step}
    data-slider-value={value}
    data-slider-orientation={orientation}
    role="slider"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    aria-orientation={orientation}
    class={cn(
      'relative flex w-full touch-none select-none items-center',
      orientation === 'vertical' && 'h-full w-auto flex-col',
      className
    )}
    {...props}
  >
    <div
      data-slider-track
      class={cn(
        'relative grow overflow-hidden rounded-full bg-primary/20',
        orientation === 'horizontal' ? 'h-1.5 w-full' : 'h-full w-1.5'
      )}
    >
      <div
        data-slider-range
        class={cn(
          'absolute bg-primary',
          orientation === 'horizontal' ? 'h-full' : 'w-full'
        )}
        style={{
          width: orientation === 'horizontal' ? `${((value - min) / (max - min)) * 100}%` : undefined,
          height: orientation === 'vertical' ? `${((value - min) / (max - min)) * 100}%` : undefined,
        }}
      />
    </div>
    <div
      data-slider-thumb
      tabindex={0}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      class={cn(
        'block h-4 w-4 rounded-full border border-primary/50 bg-background shadow',
        'transition-colors',
        'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
        'disabled:pointer-events-none disabled:opacity-50',
        'absolute',
        orientation === 'horizontal' && 'top-1/2 -translate-y-1/2 -translate-x-1/2',
        orientation === 'vertical' && 'left-1/2 -translate-x-1/2 translate-y-1/2'
      )}
      style={{
        left: orientation === 'horizontal' ? `${((value - min) / (max - min)) * 100}%` : undefined,
        bottom: orientation === 'vertical' ? `${((value - min) / (max - min)) * 100}%` : undefined,
      }}
    />
  </div>
)
