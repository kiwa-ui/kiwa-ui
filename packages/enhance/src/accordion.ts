/**
 * Initialize accordion functionality for all [data-accordion] elements.
 *
 * Usage:
 * ```html
 * <div data-accordion data-accordion-type="single">
 *   <div data-accordion-item="item1">
 *     <button data-accordion-trigger>Header 1</button>
 *     <div data-accordion-content>Content 1</div>
 *   </div>
 *   <div data-accordion-item="item2">
 *     <button data-accordion-trigger>Header 2</button>
 *     <div data-accordion-content>Content 2</div>
 *   </div>
 * </div>
 * ```
 *
 * data-accordion-type="single" - Only one item open at a time
 * data-accordion-type="multiple" - Multiple items can be open
 */

import { generateId, linkAriaControls } from './utils/aria'

export function accordion() {
  const accordions = document.querySelectorAll<HTMLElement>('[data-accordion]')

  accordions.forEach((accordion) => {
    const type = accordion.dataset.accordionType || 'single'
    const items = Array.from(
      accordion.querySelectorAll<HTMLElement>('[data-accordion-item]')
    )

    const openItems = new Set<string>()

    items.forEach((item) => {
      const itemId = item.dataset.accordionItem
      if (!itemId) return

      const trigger = item.querySelector<HTMLElement>('[data-accordion-trigger]')
      const content = item.querySelector<HTMLElement>('[data-accordion-content]')

      if (!trigger || !content) return

      // Set up ARIA
      const triggerId = generateId('accordion-trigger')
      trigger.id = triggerId
      trigger.setAttribute('aria-expanded', 'false')
      linkAriaControls(trigger, content)

      content.setAttribute('role', 'region')
      content.setAttribute('aria-labelledby', triggerId)
      content.dataset.state = 'closed'

      const isOpen = () => openItems.has(itemId)

      const open = () => {
        if (type === 'single') {
          // Close all other items
          openItems.forEach((openId) => {
            if (openId !== itemId) {
              closeItem(openId)
            }
          })
        }

        openItems.add(itemId)
        trigger.setAttribute('aria-expanded', 'true')
        content.dataset.state = 'open'
        item.dataset.state = 'open'
      }

      const close = () => {
        openItems.delete(itemId)
        trigger.setAttribute('aria-expanded', 'false')
        content.dataset.state = 'closed'
        item.dataset.state = 'closed'
      }

      const closeItem = (id: string) => {
        const targetItem = items.find((i) => i.dataset.accordionItem === id)
        if (!targetItem) return

        const targetTrigger = targetItem.querySelector<HTMLElement>('[data-accordion-trigger]')
        const targetContent = targetItem.querySelector<HTMLElement>('[data-accordion-content]')

        if (targetTrigger && targetContent) {
          openItems.delete(id)
          targetTrigger.setAttribute('aria-expanded', 'false')
          targetContent.dataset.state = 'closed'
          targetItem.dataset.state = 'closed'
        }
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

      // Check for default open state
      if (item.dataset.state === 'open' || item.hasAttribute('data-default-open')) {
        open()
      }
    })

    // Arrow key navigation between triggers
    accordion.addEventListener('keydown', (e) => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return

      const triggers = items
        .map((item) => item.querySelector<HTMLElement>('[data-accordion-trigger]'))
        .filter((t): t is HTMLElement => t !== null)

      const currentIndex = triggers.findIndex((t) => t === document.activeElement)
      if (currentIndex === -1) return

      e.preventDefault()

      let nextIndex = currentIndex
      switch (e.key) {
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % triggers.length
          break
        case 'ArrowUp':
          nextIndex = (currentIndex - 1 + triggers.length) % triggers.length
          break
        case 'Home':
          nextIndex = 0
          break
        case 'End':
          nextIndex = triggers.length - 1
          break
      }

      triggers[nextIndex]?.focus()
    })
  })
}
