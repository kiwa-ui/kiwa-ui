/**
 * Initialize sheet (slide-in panel) functionality for all [data-sheet] elements.
 *
 * Usage:
 * ```html
 * <button data-sheet-trigger="my-sheet">Open Sheet</button>
 * <div data-sheet="my-sheet" data-sheet-side="right" data-state="closed">
 *   <div data-sheet-overlay></div>
 *   <div data-sheet-content>
 *     <button data-sheet-close>Close</button>
 *     Sheet content here
 *   </div>
 * </div>
 * ```
 *
 * Options:
 * - data-sheet-side: "top" | "right" | "bottom" | "left" (default: "right")
 */

import { createFocusTrap, type FocusTrap } from './utils/focus-trap'
import { linkAriaControls, setAriaHiddenSiblings } from './utils/aria'

interface SheetInstance {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
}

const sheetInstances = new Map<string, SheetInstance>()

export function sheet(): Map<string, SheetInstance> {
  const sheets = document.querySelectorAll<HTMLElement>('[data-sheet]')

  sheets.forEach((sheetEl) => {
    const id = sheetEl.dataset.sheet
    if (!id || sheetInstances.has(id)) return

    const triggers = document.querySelectorAll<HTMLElement>(`[data-sheet-trigger="${id}"]`)
    const closers = sheetEl.querySelectorAll<HTMLElement>('[data-sheet-close]')
    const overlay = sheetEl.querySelector<HTMLElement>('[data-sheet-overlay]')
    const content = sheetEl.querySelector<HTMLElement>('[data-sheet-content]')
    const isLocalPreviewScope = Boolean(sheetEl.closest('.preview-overlay-scope'))

    let focusTrap: FocusTrap | null = null

    // Set up ARIA
    sheetEl.setAttribute('role', 'dialog')
    sheetEl.setAttribute('aria-modal', 'true')
    triggers.forEach((trigger) => {
      linkAriaControls(trigger, sheetEl)
    })

    const isOpen = () => sheetEl.dataset.state === 'open'

    const open = () => {
      if (isOpen()) return

      sheetEl.dataset.state = 'open'
      if (!isLocalPreviewScope) {
        document.body.style.overflow = 'hidden'
      }

      // Hide siblings from screen readers
      if (!isLocalPreviewScope) {
        setAriaHiddenSiblings(sheetEl, true)
      }

      // Activate focus trap
      if (content) {
        focusTrap = createFocusTrap(content)
        focusTrap.activate()
      }

      // Update trigger state
      triggers.forEach((trigger) => {
        trigger.setAttribute('aria-expanded', 'true')
      })
    }

    const close = () => {
      if (!isOpen()) return

      sheetEl.dataset.state = 'closed'
      if (!isLocalPreviewScope) {
        document.body.style.overflow = ''
      }

      // Restore siblings
      if (!isLocalPreviewScope) {
        setAriaHiddenSiblings(sheetEl, false)
      }

      // Deactivate focus trap
      focusTrap?.deactivate()
      focusTrap = null

      // Update trigger state
      triggers.forEach((trigger) => {
        trigger.setAttribute('aria-expanded', 'false')
      })
    }

    const toggle = () => {
      if (isOpen()) {
        close()
      } else {
        open()
      }
    }

    // Event listeners
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false')
      trigger.addEventListener('click', open)
    })

    closers.forEach((closer) => {
      closer.addEventListener('click', close)
    })

    overlay?.addEventListener('click', close)

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen()) {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // Store instance
    const instance: SheetInstance = { open, close, toggle, isOpen }
    sheetInstances.set(id, instance)
  })

  return sheetInstances
}

// Export for programmatic access
export function getSheet(id: string): SheetInstance | undefined {
  return sheetInstances.get(id)
}
