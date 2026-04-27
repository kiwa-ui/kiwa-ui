/**
 * Initialize context menu functionality for all [data-context-menu] elements.
 *
 * Usage:
 * ```html
 * <div data-context-menu-trigger="my-menu">
 *   Right-click me
 * </div>
 * <div data-context-menu="my-menu" data-state="closed">
 *   <button data-context-menu-item>Cut</button>
 *   <button data-context-menu-item>Copy</button>
 *   <button data-context-menu-item>Paste</button>
 *   <div data-context-menu-separator></div>
 *   <button data-context-menu-item>Delete</button>
 * </div>
 * ```
 */

import { handleArrowNavigation, createTypeahead } from './utils/keyboard'
import { portalToBody, returnFromPortal } from './utils/portal'
import { lockScroll, unlockScroll } from './utils/scroll-lock'

export function contextMenu() {
  const menus = document.querySelectorAll<HTMLElement>('[data-context-menu]')

  menus.forEach((menu) => {
    const id = menu.dataset.contextMenu
    if (!id) return

    const triggers = document.querySelectorAll<HTMLElement>(`[data-context-menu-trigger="${id}"]`)
    const items = Array.from(menu.querySelectorAll<HTMLElement>('[data-context-menu-item]'))

    let currentIndex = 0
    const typeahead = createTypeahead(items, (el) => el.textContent || '')

    // Set up ARIA
    menu.setAttribute('role', 'menu')
    items.forEach((item, index) => {
      item.setAttribute('role', 'menuitem')
      item.setAttribute('tabindex', index === 0 ? '0' : '-1')
    })

    const isOpen = () => menu.dataset.state === 'open'

    const open = (x: number, y: number) => {
      // Portal the menu to <body> so `position: fixed` always resolves
      // against the viewport, escaping any ancestor that establishes a
      // containing block (transform / translate / filter / etc.).
      portalToBody(menu)

      // Position at cursor
      menu.style.position = 'fixed'
      menu.style.left = `${x}px`
      menu.style.top = `${y}px`

      // Adjust if off-screen
      menu.hidden = false
      const rect = menu.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (rect.right > viewportWidth) {
        menu.style.left = `${viewportWidth - rect.width - 8}px`
      }
      if (rect.bottom > viewportHeight) {
        menu.style.top = `${viewportHeight - rect.height - 8}px`
      }

      lockScroll()
      menu.dataset.state = 'open'

      currentIndex = -1
      menu.tabIndex = -1
      menu.focus()
      updateTabindex()
    }

    const close = () => {
      unlockScroll()
      menu.dataset.state = 'closed'
      menu.hidden = true
      returnFromPortal(menu)
    }

    const updateTabindex = () => {
      items.forEach((item, index) => {
        item.setAttribute('tabindex', index === currentIndex ? '0' : '-1')
      })
    }

    // Context menu trigger
    triggers.forEach((trigger) => {
      trigger.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        open(e.clientX, e.clientY)
      })
    })

    // Keyboard navigation
    menu.addEventListener('keydown', (e) => {
      if (!isOpen()) return

      // First keypress when no item is focused — land on first or last
      if (currentIndex === -1 && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault()
        currentIndex = e.key === 'ArrowUp' || e.key === 'End' ? items.length - 1 : 0
        items[currentIndex]?.focus()
        updateTabindex()
        return
      }

      // Arrow navigation
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        currentIndex = handleArrowNavigation(e, {
          items,
          currentIndex,
          orientation: 'vertical',
          onNavigate: () => updateTabindex(),
        })
        return
      }

      // Close on Escape
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }

      // Select on Enter
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const focusedItem = items[currentIndex]
        focusedItem?.click()
        close()
        return
      }

      // Typeahead
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        const match = typeahead(e.key)
        if (match) {
          const index = items.indexOf(match)
          if (index !== -1) {
            currentIndex = index
            match.focus()
            updateTabindex()
          }
        }
      }
    })

    // Item click
    items.forEach((item) => {
      item.addEventListener('click', () => {
        close()
      })
    })

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen() && !menu.contains(e.target as Node)) {
        close()
      }
    })

    // Close on scroll
    document.addEventListener('scroll', () => {
      if (isOpen()) {
        close()
      }
    }, true)

    // Initialize closed state
    menu.hidden = true
    menu.dataset.state = 'closed'
  })
}
