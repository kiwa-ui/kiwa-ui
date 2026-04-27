/**
 * Toast notification system.
 * 
 * Usage:
 * ```html
 * <div data-toast-container></div>
 * ```
 * 
 * ```ts
 * import { toast } from '@hono-ui/enhance'
 * 
 * toast.init()
 * toast.show({ message: 'Hello!', type: 'success' })
 * ```
 */

export interface ToastOptions {
  message: string
  type?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

let container: HTMLElement | null = null

function init() {
  container = document.querySelector('[data-toast-container]')
  if (!container) {
    container = document.createElement('div')
    container.setAttribute('data-toast-container', '')
    document.body.appendChild(container)
  }
}

function show(options: ToastOptions) {
  if (!container) init()
  if (!container) return

  const { message, type = 'default', duration = 4000 } = options

  const toastEl = document.createElement('div')
  toastEl.setAttribute('data-toast', '')
  toastEl.setAttribute('data-toast-type', type)
  toastEl.textContent = message

  container.appendChild(toastEl)

  // Auto-dismiss after duration
  const dismissTimer = setTimeout(() => {
    dismiss(toastEl)
  }, duration)

  // Allow manual dismiss on click
  toastEl.addEventListener('click', () => {
    clearTimeout(dismissTimer)
    dismiss(toastEl)
  })
}

function dismiss(toastEl: HTMLElement) {
  // Add hiding class for exit animation
  toastEl.classList.add('toast-hiding')
  
  // Remove after animation completes
  toastEl.addEventListener('animationend', () => {
    toastEl.remove()
  }, { once: true })

  // Fallback removal if animation doesn't fire
  setTimeout(() => {
    if (toastEl.parentNode) {
      toastEl.remove()
    }
  }, 300)
}

export const toast = { init, show, dismiss }
