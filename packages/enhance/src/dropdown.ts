/**
 * Initialize dropdown menu functionality for all [data-dropdown] elements.
 * 
 * Usage:
 * ```html
 * <div data-dropdown>
 *   <button data-dropdown-trigger>Toggle</button>
 *   <div data-dropdown-content data-state="closed">
 *     <button data-dropdown-item>Item 1</button>
 *     <button data-dropdown-item>Item 2</button>
 *     <div data-dropdown-separator></div>
 *     <button data-dropdown-item>Item 3</button>
 *   </div>
 * </div>
 * ```
 */

import { handleArrowNavigation, createTypeahead } from './utils/keyboard'
import { linkAriaControls } from './utils/aria'
import { portalToBody, returnFromPortal } from './utils/portal'
import { lockScroll, unlockScroll } from './utils/scroll-lock'

export function dropdown() {
  const dropdowns = document.querySelectorAll<HTMLElement>('[data-dropdown]')
  
  // Store all close functions to allow closing other dropdowns
  const closeFunctions: (() => void)[] = []

  dropdowns.forEach((dropdown, dropdownIndex) => {
    const trigger = dropdown.querySelector<HTMLElement>('[data-dropdown-trigger]')
    const content = dropdown.querySelector<HTMLElement>('[data-dropdown-content]')

    if (!trigger || !content) return

    // Set up ARIA
    trigger.setAttribute('aria-haspopup', 'menu')
    trigger.setAttribute('aria-expanded', 'false')
    linkAriaControls(trigger, content)
    content.setAttribute('role', 'menu')

    const items = Array.from(content.querySelectorAll<HTMLElement>('[data-dropdown-item]'))
    items.forEach((item, index) => {
      item.setAttribute('role', 'menuitem')
      item.setAttribute('tabindex', index === 0 ? '0' : '-1')
    })

    let currentIndex = 0
    let cleanupResizeListener: (() => void) | null = null
    const typeahead = createTypeahead(items, (el) => el.textContent || '')

    const isOpen = () => content.dataset.state === 'open'
    
    const closeOtherDropdowns = () => {
      closeFunctions.forEach((closeFn, index) => {
        if (index !== dropdownIndex) {
          closeFn()
        }
      })
    }

    const positionContent = () => {
      const triggerRect = trigger.getBoundingClientRect()
      const side = content.dataset.side || 'bottom'
      const align = content.dataset.align || 'start'

      content.style.position = 'fixed'
      content.style.zIndex = '100'

      if (align === 'end') {
        content.style.right = `${window.innerWidth - triggerRect.right}px`
        content.style.left = 'auto'
      } else {
        content.style.left = `${triggerRect.left}px`
        content.style.right = 'auto'
      }

      if (side === 'top') {
        content.style.bottom = `${window.innerHeight - triggerRect.top + 4}px`
        content.style.top = 'auto'
      } else {
        content.style.top = `${triggerRect.bottom + 4}px`
        content.style.bottom = 'auto'
      }
    }

    const open = () => {
      // Close any other open dropdowns first
      closeOtherDropdowns()

      // Portal the content to <body> so `position: fixed` always resolves
      // against the viewport, escaping any ancestor that establishes a
      // containing block (transform / translate / filter / perspective /
      // will-change / contain). Without this, dropdowns inside elements like
      // a sidebar with an inline transform would render at the wrong
      // coordinates.
      portalToBody(content)

      lockScroll()
      content.dataset.state = 'open'
      trigger.setAttribute('aria-expanded', 'true')
      content.hidden = false
      positionContent()

      // Reposition on resize
      cleanupResizeListener = (() => {
        let frame: number | null = null
        const handleResize = () => {
          if (frame !== null) cancelAnimationFrame(frame)
          frame = requestAnimationFrame(() => {
            frame = null
            if (isOpen()) positionContent()
          })
        }
        window.addEventListener('resize', handleResize)
        return () => {
          if (frame !== null) cancelAnimationFrame(frame)
          window.removeEventListener('resize', handleResize)
        }
      })()

      // Focus first item if there are items
      if (items.length > 0) {
        currentIndex = 0
        items[0].focus()
        updateTabindex()
      }
    }

    const close = () => {
      unlockScroll()
      content.dataset.state = 'closed'
      trigger.setAttribute('aria-expanded', 'false')
      content.hidden = true
      returnFromPortal(content)
      trigger.focus()

      if (cleanupResizeListener) {
        cleanupResizeListener()
        cleanupResizeListener = null
      }
    }

    const toggle = () => {
      if (isOpen()) {
        close()
      } else {
        open()
      }
    }

    const updateTabindex = () => {
      items.forEach((item, index) => {
        item.setAttribute('tabindex', index === currentIndex ? '0' : '-1')
      })
    }

    // Trigger events
    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      toggle()
    })

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        open()
      }
    })

    // Content keyboard navigation
    content.addEventListener('keydown', (e) => {
      if (!isOpen()) return

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

      // Close on Escape or Tab
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }

      if (e.key === 'Tab') {
        close()
        return
      }

      // Select on Enter or Space
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
    // After portaling, `content` is no longer inside `dropdown`, so we have
    // to check both the original container AND the portaled content.
    document.addEventListener('click', (e) => {
      const target = e.target as Node
      if (isOpen() && !dropdown.contains(target) && !content.contains(target)) {
        close()
      }
    })

    // Initialize closed state
    content.hidden = true
    content.dataset.state = 'closed'
    
    // Register the close function for this dropdown
    closeFunctions.push(close)
  })
}
