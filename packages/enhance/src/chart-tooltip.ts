/**
 * Enhance chart tooltips with touch/tap support and styled donut tooltips.
 *
 * CSS hover tooltips work as the baseline for desktop.
 * This module adds:
 * - Touch/tap support (CSS :hover doesn't work on mobile)
 * - Styled tooltips for donut chart segments (replacing native <title>)
 *
 * Usage:
 * ```html
 * <script type="module">
 *   import { chartTooltip } from '@kiwa-ui/enhance'
 *   chartTooltip()
 * </script>
 * ```
 *
 * Data attributes (set by SSR components):
 * - data-chart-tooltip: trigger container
 * - data-chart-tooltip-content: tooltip content element
 * - data-chart-donut: SVG donut chart with <title> elements on segments
 */

import {
  calculatePosition,
  applyPosition,
  prepareForMeasurement,
} from './utils/position'

export function chartTooltip() {
  addTouchSupport()
  enhanceDonutTooltips()
}

/**
 * Add touch/tap support for CSS hover tooltips.
 * On tap, shows the tooltip content; on tap elsewhere, hides it.
 */
function addTouchSupport() {
  const triggers = document.querySelectorAll<HTMLElement>('[data-chart-tooltip]')
  if (!triggers.length) return

  let active: HTMLElement | null = null

  const deactivate = () => {
    if (active) {
      active.removeAttribute('data-chart-tooltip-active')
      active = null
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault()
        if (active === trigger) {
          deactivate()
        } else {
          deactivate()
          trigger.setAttribute('data-chart-tooltip-active', '')
          active = trigger
        }
      },
      { passive: false },
    )
  })

  document.addEventListener('touchstart', (e) => {
    if (active && !active.contains(e.target as Node)) {
      deactivate()
    }
  })

  // Inject CSS that shows tooltip content and indicators on touch
  const style = document.createElement('style')
  style.textContent = `
    [data-chart-tooltip-active] > [data-chart-tooltip-content] {
      display: block !important;
      opacity: 1 !important;
    }
    [data-chart-tooltip-active] > .opacity-0 {
      opacity: 1 !important;
    }
  `
  document.head.appendChild(style)
}

/**
 * Replace native <title> tooltips on donut chart segments
 * with styled, positioned HTML tooltips.
 */
function enhanceDonutTooltips() {
  const donuts = document.querySelectorAll<SVGSVGElement>('[data-chart-donut]')

  donuts.forEach((svg) => {
    const circles = svg.querySelectorAll<SVGCircleElement>('circle')
    const container = svg.closest('.relative') as HTMLElement
    if (!container) return

    circles.forEach((circle) => {
      const titleEl = circle.querySelector('title')
      if (!titleEl) return

      const titleText = titleEl.textContent || ''
      titleEl.remove()

      const tooltip = document.createElement('div')
      tooltip.className =
        'fixed z-50 rounded-md border border-[var(--border)] bg-[var(--popover)] px-2 py-1 text-xs text-[var(--foreground)] shadow-xs whitespace-nowrap'
      tooltip.textContent = titleText
      tooltip.hidden = true
      tooltip.style.display = 'none'
      document.body.appendChild(tooltip)

      const show = (clientX: number, clientY: number) => {
        const cleanup = prepareForMeasurement(tooltip)
        void tooltip.offsetHeight

        const virtualTrigger = {
          getBoundingClientRect: () => ({
            top: clientY,
            left: clientX,
            bottom: clientY,
            right: clientX,
            width: 0,
            height: 0,
            x: clientX,
            y: clientY,
            toJSON: () => {},
          }),
        } as HTMLElement

        const position = calculatePosition(virtualTrigger, tooltip, {
          side: 'top',
          sideOffset: 8,
        })

        cleanup()
        tooltip.hidden = false
        tooltip.style.display = ''
        applyPosition(tooltip, position)
      }

      const hide = () => {
        tooltip.hidden = true
        tooltip.style.display = 'none'
      }

      circle.addEventListener('mouseenter', (e) => show(e.clientX, e.clientY))
      circle.addEventListener('mousemove', (e) => show(e.clientX, e.clientY))
      circle.addEventListener('mouseleave', hide)

      circle.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault()
          const touch = e.touches[0]
          if (touch) {
            show(touch.clientX, touch.clientY)
            setTimeout(hide, 2000)
          }
        },
        { passive: false },
      )
    })
  })
}
