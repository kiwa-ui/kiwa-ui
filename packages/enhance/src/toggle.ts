/**
 * Initialize toggle functionality for [data-toggle] elements.
 *
 * Usage:
 * ```html
 * <button data-toggle>Toggle me</button>
 * ```
 *
 * Toggle Group:
 * ```html
 * <div data-toggle-group data-toggle-type="single">
 *   <button data-toggle-item="a">A</button>
 *   <button data-toggle-item="b">B</button>
 *   <button data-toggle-item="c">C</button>
 * </div>
 * ```
 *
 * data-toggle-type="single" - Only one can be pressed (default)
 * data-toggle-type="multiple" - Multiple can be pressed
 */

import { handleArrowNavigation } from './utils/keyboard'

export function toggle() {
  // Initialize toggle groups first
  toggleGroup()
  
  // Single toggles
  const toggles = document.querySelectorAll<HTMLElement>('[data-toggle]:not([data-toggle-item])')

  toggles.forEach((toggle) => {
    const isPressed = () => toggle.dataset.state === 'on'

    toggle.setAttribute('aria-pressed', 'false')

    const press = () => {
      toggle.dataset.state = 'on'
      toggle.setAttribute('aria-pressed', 'true')
    }

    const unpress = () => {
      toggle.dataset.state = 'off'
      toggle.setAttribute('aria-pressed', 'false')
    }

    const toggleState = () => {
      if (isPressed()) {
        unpress()
      } else {
        press()
      }
    }

    toggle.addEventListener('click', toggleState)

    // Initialize state
    if (toggle.dataset.state === 'on' || toggle.hasAttribute('data-default-pressed')) {
      press()
    } else {
      unpress()
    }
  })
}

export function toggleGroup() {
  const groups = document.querySelectorAll<HTMLElement>('[data-toggle-group]')

  groups.forEach((group) => {
    const type = group.dataset.toggleType || 'single'
    const items = Array.from(group.querySelectorAll<HTMLElement>('[data-toggle-item]'))

    if (items.length === 0) return

    group.setAttribute('role', 'group')

    const pressedItems = new Set<string>()
    let currentIndex = 0

    const updateItem = (item: HTMLElement, pressed: boolean) => {
      const itemId = item.dataset.toggleItem
      if (!itemId) return

      if (pressed) {
        pressedItems.add(itemId)
        item.dataset.state = 'on'
        item.setAttribute('aria-pressed', 'true')
      } else {
        pressedItems.delete(itemId)
        item.dataset.state = 'off'
        item.setAttribute('aria-pressed', 'false')
      }
    }

    items.forEach((item, index) => {
      const itemId = item.dataset.toggleItem
      if (!itemId) return

      item.setAttribute('aria-pressed', 'false')
      item.setAttribute('tabindex', index === 0 ? '0' : '-1')

      item.addEventListener('click', () => {
        const isPressed = pressedItems.has(itemId)

        if (type === 'single') {
          // Unpress all others
          items.forEach((i) => {
            const id = i.dataset.toggleItem
            if (id && id !== itemId) {
              updateItem(i, false)
            }
          })
          // Toggle this one (in single mode, allow unpress)
          updateItem(item, !isPressed)
        } else {
          // Multiple mode - just toggle
          updateItem(item, !isPressed)
        }
      })

      // Initialize state
      if (item.dataset.state === 'on' || item.hasAttribute('data-default-pressed')) {
        updateItem(item, true)
      }
    })

    // Keyboard navigation
    group.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return

      const focusedIndex = items.findIndex((item) => item === document.activeElement)
      if (focusedIndex === -1) return

      currentIndex = handleArrowNavigation(e, {
        items,
        currentIndex: focusedIndex,
        orientation: 'horizontal',
        onNavigate: (index) => {
          items.forEach((item, i) => {
            item.setAttribute('tabindex', i === index ? '0' : '-1')
          })
        },
      })
    })
  })
}
