/**
 * Initialize hover card functionality for all [data-hover-card] elements.
 *
 * Usage:
 * ```html
 * <a href="#" data-hover-card-trigger="user-card">@username</a>
 * <div data-hover-card="user-card" data-hover-card-side="bottom" data-state="closed">
 *   <div data-hover-card-content>
 *     <img src="avatar.jpg" />
 *     <p>User bio here...</p>
 *   </div>
 * </div>
 * ```
 *
 * Options:
 * - data-hover-card-side: "top" | "right" | "bottom" | "left" (default: "bottom")
 * - data-hover-card-align: "start" | "center" | "end" (default: "center")
 * - data-hover-card-open-delay: number in ms (default: 500)
 * - data-hover-card-close-delay: number in ms (default: 300)
 */

import { calculatePosition, applyPosition, prepareForMeasurement, type Side, type Align } from './utils/position'
import { portalToBody, returnFromPortal } from './utils/portal'
import { lockScroll, unlockScroll } from './utils/scroll-lock'

export function hoverCard() {
  const cards = document.querySelectorAll<HTMLElement>('[data-hover-card]')

  cards.forEach((card) => {
    const id = card.dataset.hoverCard
    if (!id) return

    const triggers = document.querySelectorAll<HTMLElement>(`[data-hover-card-trigger="${id}"]`)

    let openTimeout: ReturnType<typeof setTimeout> | null = null
    let closeTimeout: ReturnType<typeof setTimeout> | null = null
    let cleanupScrollListener: (() => void) | null = null

    const isOpen = () => card.dataset.state === 'open'

    const close = () => {
      if (openTimeout) {
        clearTimeout(openTimeout)
        openTimeout = null
      }
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }

      // Remove scroll listener
      if (cleanupScrollListener) {
        cleanupScrollListener()
        cleanupScrollListener = null
      }

      unlockScroll()
      card.dataset.state = 'closed'
      card.hidden = true
      returnFromPortal(card)
    }

    const open = (trigger: HTMLElement) => {
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }

      const openDelay = Number(card.dataset.hoverCardOpenDelay) || 500

      openTimeout = setTimeout(() => {
        // Portal the card to <body> so `position: fixed` always resolves
        // against the viewport, escaping any ancestor that establishes a
        // containing block (transform / translate / filter / etc.).
        portalToBody(card)

        const side = (card.dataset.hoverCardSide || 'bottom') as Side
        const align = (card.dataset.hoverCardAlign || 'center') as Align
        const sideOffset = Number(card.dataset.hoverCardSideOffset) || 8

        // Prepare card for measurement (proper layout before getBoundingClientRect)
        const cleanup = prepareForMeasurement(card)

        // Force a reflow to ensure dimensions are calculated
        void card.offsetHeight

        // Calculate position
        const position = calculatePosition(trigger, card, {
          side,
          align,
          sideOffset,
        })

        // Restore and apply final position
        cleanup()
        card.hidden = false
        applyPosition(card, position)
        card.style.visibility = ''
        lockScroll()
        card.dataset.state = 'open'

        // Close on scroll
        cleanupScrollListener = (() => {
          const handleScroll = () => close()
          window.addEventListener('scroll', handleScroll, true)
          return () => window.removeEventListener('scroll', handleScroll, true)
        })()
      }, openDelay)
    }

    const delayedClose = () => {
      if (openTimeout) {
        clearTimeout(openTimeout)
        openTimeout = null
      }

      const closeDelay = Number(card.dataset.hoverCardCloseDelay) || 300

      closeTimeout = setTimeout(() => {
        close()
      }, closeDelay)
    }

    const cancelClose = () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }
    }

    // Trigger events
    triggers.forEach((trigger) => {
      trigger.addEventListener('mouseenter', () => open(trigger))
      trigger.addEventListener('mouseleave', delayedClose)
      trigger.addEventListener('focus', () => open(trigger))
      trigger.addEventListener('blur', delayedClose)
    })

    // Allow hovering over card itself
    card.addEventListener('mouseenter', cancelClose)
    card.addEventListener('mouseleave', delayedClose)

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        close()
      }
    })

    // Initialize hidden state
    card.hidden = true
    card.dataset.state = 'closed'
  })
}
