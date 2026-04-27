import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

export type PlaceholderLogoMark = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

type PlaceholderLogoIconProps = {
  mark?: PlaceholderLogoMark
  class?: string
}

export const PlaceholderLogoIcon: FC<PlaceholderLogoIconProps> = ({
  mark = 1,
  class: className,
}) => {
  const svgClass = cn('size-6 shrink-0', className)
  switch (mark) {
    case 1:
      // Nova — 4-point sparkle with concave petals
      return (
        <svg class={svgClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 1 Q 13 11 23 12 Q 13 13 12 23 Q 11 13 1 12 Q 11 11 12 1 Z" />
        </svg>
      )
    case 2:
      // Orbit — ring with offset satellite
      return (
        <svg class={svgClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="11" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="3" />
          <circle cx="20" cy="4" r="2.75" />
        </svg>
      )
    case 3:
      // Pulse — waveform / EKG line
      return (
        <svg
          class={svgClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2 12 L6 12 L8.5 6 L11.5 18 L14.5 3 L17 15 L19 12 L22 12" />
        </svg>
      )
    case 4:
      // Vertex — triangle with inner cutout (shield)
      return (
        <svg
          class={svgClass}
          viewBox="0 0 24 24"
          fill="currentColor"
          fill-rule="evenodd"
          aria-hidden="true"
        >
          <path d="M12 2 L22 20 L2 20 Z M12 9 L17 19 L7 19 Z" />
        </svg>
      )
    case 5:
      // Arc — crescent (right-opening moon shape)
      return (
        <svg
          class={svgClass}
          viewBox="0 0 24 24"
          fill="currentColor"
          fill-rule="evenodd"
          aria-hidden="true"
        >
          <path d="M 2 12 A 10 10 0 1 0 22 12 A 10 10 0 1 0 2 12 Z M 10 12 A 6 6 0 1 0 22 12 A 6 6 0 1 0 10 12 Z" />
        </svg>
      )
    case 6:
      // Prism — pointy-top hexagon ring
      return (
        <svg
          class={svgClass}
          viewBox="0 0 24 24"
          fill="currentColor"
          fill-rule="evenodd"
          aria-hidden="true"
        >
          <path d="M12 1 L22 6 L22 18 L12 23 L2 18 L2 6 Z M12 5 L18 8.5 L18 15.5 L12 19 L6 15.5 L6 8.5 Z" />
        </svg>
      )
    case 7:
      // Relay — lightning bolt
      return (
        <svg class={svgClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14 2 L4 13 L11 13 L10 22 L20 11 L13 11 Z" />
        </svg>
      )
    case 8:
      // Stack — triangular cluster of three dots
      return (
        <svg class={svgClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="6" r="3.5" />
          <circle cx="6" cy="17" r="3.5" />
          <circle cx="18" cy="17" r="3.5" />
        </svg>
      )
  }
}

type PlaceholderLogoProps = JSX.IntrinsicElements['div'] & {
  name: string
  mark?: PlaceholderLogoMark
}

export const PlaceholderLogo: FC<PlaceholderLogoProps> = ({
  name,
  mark = 1,
  class: className,
  ...props
}) => (
  <div
    class={cn('inline-flex items-center gap-2 text-foreground', className)}
    {...props}
  >
    <PlaceholderLogoIcon mark={mark} />
    <span class="text-lg font-semibold tracking-tight">{name}</span>
  </div>
)

export default PlaceholderLogo
