/**
 * Initialize tooltip functionality for all [data-tooltip-trigger] elements.
 *
 * Usage:
 * ```html
 * <button data-tooltip-trigger="tip1">Hover me</button>
 * <div data-tooltip="tip1" data-tooltip-side="top">
 *   Tooltip content
 * </div>
 * ```
 *
 * Options:
 * - data-tooltip-side: "top" | "right" | "bottom" | "left" (default: "top")
 * - data-tooltip-align: "start" | "center" | "end" (default: "center")
 * - data-tooltip-delay: number in ms (default: 300)
 */

import { calculatePosition, applyPosition, prepareForMeasurement, type Side, type Align } from './utils/position'
import { portalToBody, returnFromPortal } from './utils/portal'
import { linkAriaDescribedby } from './utils/aria'

export function tooltip() {
  const tooltips = document.querySelectorAll<HTMLElement>('[data-tooltip]')

  tooltips.forEach((tooltip) => {
    const id = tooltip.dataset.tooltip
    if (!id) return

    const triggers = document.querySelectorAll<HTMLElement>(`[data-tooltip-trigger="${id}"]`)

    let showTimeout: ReturnType<typeof setTimeout> | null = null
    let hideTimeout: ReturnType<typeof setTimeout> | null = null
    let cleanupScrollListener: (() => void) | null = null

    // Set up ARIA
    tooltip.setAttribute('role', 'tooltip')
    triggers.forEach((trigger) => {
      linkAriaDescribedby(trigger, tooltip)
    })

    const isVisible = () => tooltip.dataset.state === 'open'

    const hide = () => {
      if (showTimeout) {
        clearTimeout(showTimeout)
        showTimeout = null
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
      }

      // Remove scroll listener
      if (cleanupScrollListener) {
        cleanupScrollListener()
        cleanupScrollListener = null
      }

      tooltip.dataset.state = 'closed'
      tooltip.hidden = true
      returnFromPortal(tooltip)
    }

    const show = (trigger: HTMLElement) => {
      if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
      }

      const delay = Number(tooltip.dataset.tooltipDelay) || 300

      showTimeout = setTimeout(() => {
        // Portal the tooltip to <body> so `position: fixed` always resolves
        // against the viewport, escaping any ancestor that establishes a
        // containing block (transform / translate / filter / etc.).
        portalToBody(tooltip)

        const side = (tooltip.dataset.tooltipSide || 'top') as Side
        const align = (tooltip.dataset.tooltipAlign || 'center') as Align
        const sideOffset = Number(tooltip.dataset.tooltipSideOffset) || 4

        // Prepare tooltip for measurement (proper layout before getBoundingClientRect)
        const cleanup = prepareForMeasurement(tooltip)

        // Force a reflow to ensure dimensions are calculated
        void tooltip.offsetHeight

        // Calculate position
        const position = calculatePosition(trigger, tooltip, {
          side,
          align,
          sideOffset,
        })

        // Restore and apply final position
        cleanup()
        tooltip.hidden = false
        applyPosition(tooltip, position)
        tooltip.style.visibility = ''
        tooltip.dataset.state = 'open'

        // Close on scroll
        cleanupScrollListener = (() => {
          const handleScroll = () => hide()
          window.addEventListener('scroll', handleScroll, true)
          return () => window.removeEventListener('scroll', handleScroll, true)
        })()
      }, delay)
    }

    const delayedHide = () => {
      if (showTimeout) {
        clearTimeout(showTimeout)
        showTimeout = null
      }

      // Small delay before hiding to allow moving to tooltip
      hideTimeout = setTimeout(() => {
        hide()
      }, 100)
    }

    const cancelHide = () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
      }
    }

    // Trigger events
    triggers.forEach((trigger) => {
      trigger.addEventListener('mouseenter', () => show(trigger))
      trigger.addEventListener('mouseleave', delayedHide)
      trigger.addEventListener('focus', () => show(trigger))
      trigger.addEventListener('blur', delayedHide)
    })

    // Allow hovering over tooltip itself
    tooltip.addEventListener('mouseenter', cancelHide)
    tooltip.addEventListener('mouseleave', delayedHide)

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isVisible()) {
        hide()
      }
    })

    // Initialize hidden state
    tooltip.hidden = true
    tooltip.dataset.state = 'closed'
  })
}
