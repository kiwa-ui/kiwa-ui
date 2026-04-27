/**
 * Initialize popover functionality for all [data-popover] elements.
 *
 * Usage:
 * ```html
 * <button data-popover-trigger="my-popover">Open Popover</button>
 * <div data-popover="my-popover" data-popover-side="bottom" data-popover-align="start">
 *   <div data-popover-content>
 *     Popover content here
 *   </div>
 * </div>
 * ```
 *
 * Options:
 * - data-popover-side: "top" | "right" | "bottom" | "left" (default: "bottom")
 * - data-popover-align: "start" | "center" | "end" (default: "center")
 * - data-popover-side-offset: number (default: 4)
 */

import { calculatePosition, applyPosition, prepareForMeasurement, type Side, type Align } from './utils/position'
import { portalToBody, returnFromPortal } from './utils/portal'
import { linkAriaControls } from './utils/aria'
import { createFocusTrap, type FocusTrap } from './utils/focus-trap'
import { lockScroll, unlockScroll } from './utils/scroll-lock'

export function popover() {
  const popovers = document.querySelectorAll<HTMLElement>('[data-popover]')

  popovers.forEach((popover) => {
    const id = popover.dataset.popover
    if (!id) return

    const triggers = document.querySelectorAll<HTMLElement>(`[data-popover-trigger="${id}"]`)
    const content = popover.querySelector<HTMLElement>('[data-popover-content]') || popover

    let focusTrap: FocusTrap | null = null
    let activeTrigger: HTMLElement | null = null
    let cleanupScrollListener: (() => void) | null = null
    let cleanupResizeListener: (() => void) | null = null

    // Set up ARIA
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-haspopup', 'dialog')
      trigger.setAttribute('aria-expanded', 'false')
      linkAriaControls(trigger, popover)
    })

    const isOpen = () => popover.dataset.state === 'open'

    const close = () => {
      if (!isOpen()) return

      unlockScroll()
      popover.dataset.state = 'closed'
      popover.hidden = true
      returnFromPortal(popover)

      if (activeTrigger) {
        activeTrigger.setAttribute('aria-expanded', 'false')
      }

      focusTrap?.deactivate()
      focusTrap = null
      activeTrigger = null

      // Remove scroll listener
      if (cleanupScrollListener) {
        cleanupScrollListener()
        cleanupScrollListener = null
      }

      // Remove resize listener
      if (cleanupResizeListener) {
        cleanupResizeListener()
        cleanupResizeListener = null
      }
    }

    const reposition = () => {
      if (!isOpen() || !activeTrigger) return

      const side = (popover.dataset.popoverSide || 'bottom') as Side
      const align = (popover.dataset.popoverAlign || 'center') as Align
      const sideOffset = Number(popover.dataset.popoverSideOffset) || 4

      const position = calculatePosition(activeTrigger, popover, {
        side,
        align,
        sideOffset,
      })
      applyPosition(popover, position)
    }

    const open = (trigger: HTMLElement) => {
      if (isOpen()) return

      lockScroll()
      activeTrigger = trigger

      // Portal the popover to <body> so `position: fixed` always resolves
      // against the viewport, escaping any ancestor that establishes a
      // containing block (transform / translate / filter / etc.).
      portalToBody(popover)

      // Get positioning options
      const side = (popover.dataset.popoverSide || 'bottom') as Side
      const align = (popover.dataset.popoverAlign || 'center') as Align
      const sideOffset = Number(popover.dataset.popoverSideOffset) || 4

      // Prepare popover for measurement (proper layout before getBoundingClientRect)
      const cleanup = prepareForMeasurement(popover)

      // Force a reflow to ensure dimensions are calculated
      void popover.offsetHeight

      // Calculate position
      const position = calculatePosition(trigger, popover, {
        side,
        align,
        sideOffset,
      })

      // Restore and apply final position
      cleanup()
      popover.hidden = false
      applyPosition(popover, position)
      popover.style.visibility = ''
      popover.dataset.state = 'open'

      trigger.setAttribute('aria-expanded', 'true')

      // Activate focus trap
      focusTrap = createFocusTrap(content)
      focusTrap.activate()

      // Close on scroll
      cleanupScrollListener = (() => {
        const handleScroll = (event: Event) => {
          const target = event.target as HTMLElement | null
          if (target) {
            if (popover.contains(target)) return
            if (
              target.closest('[data-popover-submenu-panel]') ||
              target.closest('[data-popover-submenu-date-panel]')
            ) {
              return
            }
          }

          close()
        }
        window.addEventListener('scroll', handleScroll, true)
        return () => window.removeEventListener('scroll', handleScroll, true)
      })()

      // Reposition on resize
      cleanupResizeListener = (() => {
        let frame: number | null = null
        const handleResize = () => {
          if (frame !== null) cancelAnimationFrame(frame)
          frame = requestAnimationFrame(() => {
            frame = null
            reposition()
          })
        }
        window.addEventListener('resize', handleResize)
        return () => {
          if (frame !== null) cancelAnimationFrame(frame)
          window.removeEventListener('resize', handleResize)
        }
      })()
    }

    const toggle = (trigger: HTMLElement) => {
      if (isOpen()) {
        close()
      } else {
        open(trigger)
      }
    }

    // Trigger events
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation()
        toggle(trigger)
      })
    })

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        e.preventDefault()
        close()
      }
    })

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen() && !popover.contains(e.target as Node)) {
        const clickedTrigger = Array.from(triggers).some((t) => t.contains(e.target as Node))
        if (clickedTrigger) return

        // Don't close if click is inside a sibling submenu panel or date panel
        const target = e.target as HTMLElement
        if (
          target.closest('[data-popover-submenu-panel]') ||
          target.closest('[data-popover-submenu-date-panel]')
        ) return

        close()
      }
    })

    // Initialize closed state
    popover.hidden = true
    popover.dataset.state = 'closed'
  })
}
