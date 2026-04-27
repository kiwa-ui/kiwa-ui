/**
 * Initialize theme toggle functionality.
 * 
 * Usage:
 * ```html
 * <button data-theme-toggle>Toggle theme</button>
 * ```
 * 
 * The theme is stored in localStorage and applied to the <html> element
 * as a class ('dark' or 'light').
 */

const STORAGE_KEY = 'hono-ui-theme'

type Theme = 'light' | 'dark' | 'system'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)
  localStorage.setItem(STORAGE_KEY, theme)
}

export function theme() {
  // Apply stored theme on init
  applyTheme(getStoredTheme())

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system')
    }
  })

  // Setup toggle buttons
  const toggles = document.querySelectorAll<HTMLElement>('[data-theme-toggle]')
  
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const current = getStoredTheme()
      const next: Theme = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
      applyTheme(next)
      toggle.dataset.theme = next
    })
  })
}
