/**
 * Initialize clipboard functionality for all [data-clipboard] elements.
 * 
 * Usage:
 * ```html
 * <button data-clipboard data-clipboard-text="Text to copy">
 *   Copy
 * </button>
 * ```
 * 
 * Or copy from another element:
 * ```html
 * <code id="code-block">const x = 1</code>
 * <button data-clipboard data-clipboard-target="#code-block">
 *   Copy
 * </button>
 * ```
 */
export function clipboard() {
  const buttons = document.querySelectorAll<HTMLElement>('[data-clipboard]')

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      let text = button.dataset.clipboardText

      if (!text) {
        const targetSelector = button.dataset.clipboardTarget
        if (targetSelector) {
          const target = document.querySelector(targetSelector)
          text = target?.textContent || ''
        }
      }

      if (!text) return

      try {
        await navigator.clipboard.writeText(text)
        button.dataset.clipboardCopied = 'true'

        // Show feedback element if present (sibling with data-clipboard-feedback)
        const feedback = button.parentElement?.querySelector('[data-clipboard-feedback]') as HTMLElement | null
        if (feedback) {
          feedback.style.opacity = '1'
        }

        setTimeout(() => {
          button.dataset.clipboardCopied = 'false'
          if (feedback) {
            feedback.style.opacity = '0'
          }
        }, 2000)
      } catch (err) {
        console.error('Failed to copy to clipboard:', err)
      }
    })
  })
}
