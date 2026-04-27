/**
 * Initialize dialog functionality for all [data-dialog] elements.
 * 
 * Usage:
 * ```html
 * <button data-dialog-trigger="my-dialog">Open</button>
 * <div data-dialog="my-dialog" data-dialog-shortcut="cmd+k" data-state="closed">
 *   <div data-dialog-overlay></div>
 *   <div data-dialog-content>
 *     <button data-dialog-close>Close</button>
 *     <input data-initial-focus />
 *     Dialog content here
 *   </div>
 * </div>
 * ```
 *
 * The optional `data-dialog-shortcut` attribute registers a global keyboard
 * shortcut to toggle the dialog. Format: "cmd+k", "ctrl+j", etc.
 * "cmd" matches both Meta (Mac) and Ctrl (Windows/Linux).
 */

import { createFocusTrap, type FocusTrap } from './utils/focus-trap'
import { linkAriaControls, setAriaHiddenSiblings } from './utils/aria'

interface DialogInstance {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
}

const dialogInstances = new Map<string, DialogInstance>()
const dialogElements = new Map<string, HTMLElement>()

export function dialog(): Map<string, DialogInstance> {
  const dialogs = document.querySelectorAll<HTMLElement>('[data-dialog]')

  dialogs.forEach((dialog) => {
    const id = dialog.dataset.dialog
    if (!id) return

    const existingElement = dialogElements.get(id)
    if (existingElement?.isConnected) return
    if (existingElement && !existingElement.isConnected) {
      dialogElements.delete(id)
      dialogInstances.delete(id)
    }

    const triggers = document.querySelectorAll<HTMLElement>(`[data-dialog-trigger="${id}"]`)
    const closers = dialog.querySelectorAll<HTMLElement>('[data-dialog-close]')
    const overlay = dialog.querySelector<HTMLElement>('[data-dialog-overlay]')
    const content = dialog.querySelector<HTMLElement>('[data-dialog-content]')
    const isLocalPreviewScope = Boolean(dialog.closest('.preview-overlay-scope'))

    let focusTrap: FocusTrap | null = null

    // Set up ARIA
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', 'true')
    triggers.forEach((trigger) => {
      linkAriaControls(trigger, dialog)
    })

    const isOpen = () => dialog.dataset.state === 'open'

    const open = () => {
      if (isOpen()) return

      dialog.dataset.state = 'open'
      if (!isLocalPreviewScope) {
        document.body.style.overflow = 'hidden'
      }
      
      // Hide siblings from screen readers
      if (!isLocalPreviewScope) {
        setAriaHiddenSiblings(dialog, true)
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

      dialog.dataset.state = 'closed'
      if (!isLocalPreviewScope) {
        document.body.style.overflow = ''
      }

      // Restore siblings
      if (!isLocalPreviewScope) {
        setAriaHiddenSiblings(dialog, false)
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

    // Close on Escape key, open on shortcut
    const shortcut = dialog.dataset.dialogShortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen()) {
        e.preventDefault()
        close()
      }

      if (shortcut) {
        const parts = shortcut.toLowerCase().split('+')
        const key = parts[parts.length - 1]
        const needsMod = parts.includes('cmd') || parts.includes('ctrl')

        if (
          e.key.toLowerCase() === key &&
          (!needsMod || e.metaKey || e.ctrlKey)
        ) {
          e.preventDefault()
          toggle()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // Store instance
    const instance: DialogInstance = { open, close, toggle, isOpen }
    dialogInstances.set(id, instance)
    dialogElements.set(id, dialog)
  })

  return dialogInstances
}

// Export for programmatic access
export function getDialog(id: string): DialogInstance | undefined {
  return dialogInstances.get(id)
}
