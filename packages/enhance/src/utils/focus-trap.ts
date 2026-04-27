/**
 * Focus trap utility for modals and dialogs.
 * Keeps focus within a container element.
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
  'audio[controls]',
  'video[controls]',
  'details>summary:first-of-type',
].join(',')

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  return Array.from(elements).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  )
}

export interface FocusTrap {
  activate: () => void
  deactivate: () => void
}

export function createFocusTrap(container: HTMLElement): FocusTrap {
  let previouslyFocused: HTMLElement | null = null

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusable = getFocusableElements(container)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  return {
    activate() {
      previouslyFocused = document.activeElement as HTMLElement

      document.addEventListener('keydown', handleKeyDown)

      // Focus first focusable element or container itself
      const focusable = getFocusableElements(container)
      const initialFocus = container.querySelector<HTMLElement>('[data-initial-focus]')

      if (initialFocus) {
        initialFocus.focus()
      } else if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        container.setAttribute('tabindex', '-1')
        container.focus()
      }
    },

    deactivate() {
      document.removeEventListener('keydown', handleKeyDown)

      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus()
      }
    },
  }
}
