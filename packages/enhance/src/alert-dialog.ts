/**
 * Initialize alert dialog functionality for all [data-alert-dialog] elements.
 * Alert dialogs require user interaction and cannot be dismissed by clicking outside.
 *
 * Usage:
 * ```html
 * <button data-alert-dialog-trigger="my-alert">Delete Item</button>
 * <div data-alert-dialog="my-alert" data-state="closed">
 *   <div data-alert-dialog-overlay></div>
 *   <div data-alert-dialog-content role="alertdialog">
 *     <h2>Are you sure?</h2>
 *     <p>This action cannot be undone.</p>
 *     <button data-alert-dialog-cancel>Cancel</button>
 *     <button data-alert-dialog-action>Delete</button>
 *   </div>
 * </div>
 * ```
 */

import { createFocusTrap, type FocusTrap } from './utils/focus-trap'
import { linkAriaControls, setAriaHiddenSiblings } from './utils/aria'

interface AlertDialogInstance {
  open: () => void
  close: () => void
  isOpen: () => boolean
}

const alertDialogInstances = new Map<string, AlertDialogInstance>()
const alertDialogElements = new Map<string, HTMLElement>()

export function alertDialog(): Map<string, AlertDialogInstance> {
  const dialogs = document.querySelectorAll<HTMLElement>('[data-alert-dialog]')

  dialogs.forEach((dialog) => {
    const id = dialog.dataset.alertDialog
    if (!id) return

    const existingElement = alertDialogElements.get(id)
    if (existingElement?.isConnected) return
    if (existingElement && !existingElement.isConnected) {
      alertDialogElements.delete(id)
      alertDialogInstances.delete(id)
    }

    const triggers = document.querySelectorAll<HTMLElement>(`[data-alert-dialog-trigger="${id}"]`)
    const content = dialog.querySelector<HTMLElement>('[data-alert-dialog-content]')
    const cancelButtons = dialog.querySelectorAll<HTMLElement>('[data-alert-dialog-cancel]')
    const actionButtons = dialog.querySelectorAll<HTMLElement>('[data-alert-dialog-action]')

    let focusTrap: FocusTrap | null = null

    // Set up ARIA
    dialog.setAttribute('role', 'alertdialog')
    dialog.setAttribute('aria-modal', 'true')
    if (content) {
      content.setAttribute('role', 'alertdialog')
    }
    triggers.forEach((trigger) => {
      linkAriaControls(trigger, dialog)
    })

    const isOpen = () => dialog.dataset.state === 'open'

    const open = () => {
      if (isOpen()) return

      dialog.dataset.state = 'open'
      document.body.style.overflow = 'hidden'

      // Hide siblings from screen readers
      setAriaHiddenSiblings(dialog, true)

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
      document.body.style.overflow = ''

      // Restore siblings
      setAriaHiddenSiblings(dialog, false)

      // Deactivate focus trap
      focusTrap?.deactivate()
      focusTrap = null

      // Update trigger state
      triggers.forEach((trigger) => {
        trigger.setAttribute('aria-expanded', 'false')
      })
    }

    // Event listeners
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false')
      trigger.addEventListener('click', open)
    })

    // Cancel closes the dialog
    cancelButtons.forEach((button) => {
      button.addEventListener('click', close)
    })

    // Action buttons close after their action
    actionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        // Dispatch custom event before closing
        dialog.dispatchEvent(
          new CustomEvent('alert-dialog-action', {
            bubbles: true,
          })
        )
        close()
      })
    })

    // NOTE: Alert dialogs do NOT close on overlay click or Escape
    // This is intentional - they require explicit user action

    // Store instance
    const instance: AlertDialogInstance = { open, close, isOpen }
    alertDialogInstances.set(id, instance)
    alertDialogElements.set(id, dialog)
  })

  return alertDialogInstances
}

// Export for programmatic access
export function getAlertDialog(id: string): AlertDialogInstance | undefined {
  return alertDialogInstances.get(id)
}
