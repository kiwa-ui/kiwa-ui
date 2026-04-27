/**
 * Initialize custom select functionality for all [data-select] elements.
 *
 * Content is portaled to <body> on open and uses `position: fixed`, so the
 * menu escapes any ancestor overflow container (e.g. a scrollable dialog,
 * table cell, or preview frame). On close, the content is returned to its
 * original DOM position so inline styles / position reset fresh for the
 * next open.
 *
 * Usage:
 * ```html
 * <div data-select data-select-value="apple">
 *   <input type="hidden" name="fruit" value="apple" data-select-hidden-input />
 *   <button data-select-trigger>
 *     <span data-select-value-display>Apple</span>
 *     <svg>...</svg>
 *   </button>
 *   <div data-select-content data-state="closed" data-select-side="bottom" data-select-align="start">
 *     <div data-select-item data-value="apple">Apple</div>
 *     <div data-select-item data-value="banana">Banana</div>
 *   </div>
 * </div>
 * ```
 */

import { calculatePosition, applyPosition, prepareForMeasurement, type Side, type Align } from './utils/position'
import { portalToBody, returnFromPortal } from './utils/portal'
import { handleArrowNavigation, createTypeahead } from './utils/keyboard'
import { linkAriaControls } from './utils/aria'

export function select() {
  const selects = document.querySelectorAll<HTMLElement>('[data-select]')

  const closeFunctions: (() => void)[] = []

  selects.forEach((root, selectIndex) => {
    const trigger = root.querySelector<HTMLElement>('[data-select-trigger]')
    const content = root.querySelector<HTMLElement>('[data-select-content]')
    const hiddenInput = root.querySelector<HTMLInputElement>('[data-select-hidden-input]')
    const valueDisplay = trigger?.querySelector<HTMLElement>('[data-select-value-display]')

    if (!trigger || !content) return

    // Set up ARIA
    trigger.setAttribute('aria-haspopup', 'listbox')
    trigger.setAttribute('aria-expanded', 'false')
    linkAriaControls(trigger, content)
    content.setAttribute('role', 'listbox')

    const items = Array.from(content.querySelectorAll<HTMLElement>('[data-select-item]'))
    items.forEach((item) => {
      item.setAttribute('role', 'option')
      item.setAttribute('tabindex', '-1')
      item.setAttribute('aria-selected', 'false')
    })

    let currentIndex = 0
    let cleanupScrollListener: (() => void) | null = null
    let cleanupResizeListener: (() => void) | null = null
    const typeahead = createTypeahead(items, (el) => el.textContent || '')

    // Initialize selected state from data attribute or hidden input
    const initialValue = root.dataset.selectValue || hiddenInput?.value
    if (initialValue) {
      const initialItem = items.find((item) => item.dataset.value === initialValue)
      if (initialItem) {
        initialItem.dataset.selected = 'true'
        initialItem.setAttribute('aria-selected', 'true')
      }
    }

    const isOpen = () => content.dataset.state === 'open'

    const closeOtherSelects = () => {
      closeFunctions.forEach((closeFn, index) => {
        if (index !== selectIndex) closeFn()
      })
    }

    const reposition = () => {
      if (!isOpen()) return
      const side = (content.dataset.selectSide || 'bottom') as Side
      const align = (content.dataset.selectAlign || 'start') as Align
      const position = calculatePosition(trigger, content, {
        side,
        align,
        sideOffset: 4,
      })
      applyPosition(content, position)
    }

    const open = () => {
      if (isOpen()) return
      closeOtherSelects()

      // Match content width to trigger, but never shrink below the element's
      // own CSS min-width (e.g. a `min-w-40` utility set on the content).
      // Read the CSS min-width by temporarily clearing the inline override,
      // then pick the larger of the two values.
      const prevInlineMinWidth = content.style.minWidth
      content.style.minWidth = ''
      const cssMinWidth = parseFloat(window.getComputedStyle(content).minWidth) || 0
      content.style.minWidth = prevInlineMinWidth
      content.style.minWidth = `${Math.max(trigger.offsetWidth, cssMinWidth)}px`

      // Portal the content to <body> so `position: fixed` always resolves
      // against the viewport, escaping any ancestor that establishes a
      // containing block (transform / translate / filter / overflow / etc.).
      portalToBody(content)

      const side = (content.dataset.selectSide || 'bottom') as Side
      const align = (content.dataset.selectAlign || 'start') as Align

      // Prepare content for measurement (proper layout before getBoundingClientRect)
      const cleanup = prepareForMeasurement(content)

      // Force a reflow to ensure dimensions are calculated
      void content.offsetHeight

      // Calculate position
      const position = calculatePosition(trigger, content, {
        side,
        align,
        sideOffset: 4,
      })

      // Restore and apply final position
      cleanup()
      content.hidden = false
      applyPosition(content, position)
      content.style.visibility = ''
      content.dataset.state = 'open'

      trigger.setAttribute('aria-expanded', 'true')

      // Focus the selected item, or first item
      const selectedItem = items.find((item) => item.dataset.selected === 'true')
      currentIndex = selectedItem ? items.indexOf(selectedItem) : 0

      if (items.length > 0) {
        items[currentIndex]?.focus()
        updateHighlight()
      }

      // Close on scroll (matches popover behavior) so the menu doesn't get
      // stuck pinned to stale viewport coords when the page scrolls.
      cleanupScrollListener = (() => {
        const handleScroll = (event: Event) => {
          const target = event.target as HTMLElement | null
          if (target && content.contains(target)) return
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

    const close = () => {
      if (!isOpen()) return

      content.dataset.state = 'closed'
      trigger.setAttribute('aria-expanded', 'false')
      content.hidden = true

      // Return content to its original DOM position so it resets cleanly
      // for the next open. Without this, the menu would stay portaled to
      // body with stale inline position styles.
      returnFromPortal(content)

      if (cleanupScrollListener) {
        cleanupScrollListener()
        cleanupScrollListener = null
      }
      if (cleanupResizeListener) {
        cleanupResizeListener()
        cleanupResizeListener = null
      }

      trigger.focus()
    }

    const toggle = () => {
      if (isOpen()) close()
      else open()
    }

    const updateHighlight = () => {
      items.forEach((item, index) => {
        item.dataset.highlighted = index === currentIndex ? 'true' : 'false'
      })
    }

    const selectItem = (item: HTMLElement) => {
      const value = item.dataset.value
      if (!value) return

      // Update selected state
      items.forEach((i) => {
        i.dataset.selected = 'false'
        i.setAttribute('aria-selected', 'false')
      })
      item.dataset.selected = 'true'
      item.setAttribute('aria-selected', 'true')

      // Update display text
      if (valueDisplay) {
        valueDisplay.textContent = item.textContent
      }

      // Update hidden input for form submission
      if (hiddenInput) {
        hiddenInput.value = value
      }

      // Update root data attribute
      root.dataset.selectValue = value

      // Dispatch change event
      root.dispatchEvent(
        new CustomEvent('select-change', {
          detail: { value, item },
          bubbles: true,
        })
      )

      close()
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
          onNavigate: () => updateHighlight(),
        })
        return
      }

      // Close on Escape
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }

      // Close on Tab
      if (e.key === 'Tab') {
        close()
        return
      }

      // Select on Enter or Space
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const focusedItem = items[currentIndex]
        if (focusedItem) selectItem(focusedItem)
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
            updateHighlight()
          }
        }
      }
    })

    // Item click
    items.forEach((item) => {
      item.addEventListener('click', () => {
        selectItem(item)
      })
    })

    // Close when clicking outside. Once content is portaled to body it's no
    // longer inside `root`, so we must check both.
    document.addEventListener('click', (e) => {
      if (!isOpen()) return
      const target = e.target as Node
      if (root.contains(target) || content.contains(target)) return
      close()
    })

    // Initialize closed state
    content.hidden = true
    content.dataset.state = 'closed'
    closeFunctions.push(close)
  })
}
