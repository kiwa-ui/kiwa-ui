/**
 * Initialize collapsible functionality for all [data-collapsible] elements.
 *
 * Usage:
 * ```html
 * <div data-collapsible>
 *   <button data-collapsible-trigger>Toggle</button>
 *   <div data-collapsible-content>
 *     Content here
 *   </div>
 * </div>
 * ```
 *
 * Optional: data-default-open to start expanded
 * 
 * CSS: Add these styles for smooth animation:
 * [data-collapsible-content] {
 *   overflow: hidden;
 *   transition: max-height 0.2s ease-out;
 * }
 * [data-collapsible-content][data-state="closed"] {
 *   max-height: 0;
 * }
 */

import { linkAriaControls } from './utils/aria'

const collapsibleElements = new WeakSet<HTMLElement>()

export function collapsible() {
  const collapsibles = document.querySelectorAll<HTMLElement>('[data-collapsible]')

  collapsibles.forEach((collapsible) => {
    if (collapsibleElements.has(collapsible)) return
    collapsibleElements.add(collapsible)

    const trigger = collapsible.querySelector<HTMLElement>('[data-collapsible-trigger]')
    const content = collapsible.querySelector<HTMLElement>('[data-collapsible-content]')

    if (!trigger || !content) return

    // Set up ARIA
    linkAriaControls(trigger, content)
    trigger.setAttribute('aria-expanded', 'false')
    const transitionValue = 'max-height 0.2s ease-out'

    const isOpen = () => collapsible.dataset.state === 'open'

    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== content || e.propertyName !== 'max-height') return
      if (collapsible.dataset.state === 'open') {
        content.style.maxHeight = 'none'
      } else {
        content.hidden = true
      }
    }
    content.addEventListener('transitionend', onTransitionEnd)

    const open = () => {
      collapsible.dataset.state = 'open'
      trigger.dataset.state = 'open'
      trigger.setAttribute('aria-expanded', 'true')
      content.dataset.state = 'open'
      content.hidden = false
      // Animate to natural height
      const height = content.scrollHeight
      content.style.maxHeight = `${height}px`
    }

    const close = () => {
      collapsible.dataset.state = 'closed'
      trigger.dataset.state = 'closed'
      trigger.setAttribute('aria-expanded', 'false')
      content.dataset.state = 'closed'
      // Set explicit height first to enable transition
      const height = content.scrollHeight
      content.style.maxHeight = `${height}px`
      // Force reflow
      content.offsetHeight
      // Then animate to 0
      content.style.maxHeight = '0px'
    }

    const toggle = () => {
      if (isOpen()) {
        close()
      } else {
        open()
      }
    }

    trigger.addEventListener('click', toggle)

    // Keyboard support
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    })

    // Set up CSS for animation
    content.style.transition = 'none'

    // Initialize state
    if (collapsible.hasAttribute('data-default-open') || collapsible.dataset.state === 'open') {
      collapsible.dataset.state = 'open'
      trigger.dataset.state = 'open'
      trigger.setAttribute('aria-expanded', 'true')
      content.dataset.state = 'open'
      content.hidden = false
      content.style.maxHeight = 'none'
    } else {
      collapsible.dataset.state = 'closed'
      trigger.dataset.state = 'closed'
      trigger.setAttribute('aria-expanded', 'false')
      content.dataset.state = 'closed'
      content.hidden = true
      content.style.maxHeight = '0px'
    }

    requestAnimationFrame(() => {
      content.style.transition = transitionValue
    })
  })
}
