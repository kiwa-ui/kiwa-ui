/**
 * Initialize sidebar collapsible functionality for [data-sidebar-collapsible] elements.
 *
 * Usage:
 * ```html
 * <aside data-sidebar-collapsible data-collapsed="false">
 *   <button data-collapsible-trigger>Toggle</button>
 *   <!-- Sidebar content -->
 * </aside>
 * ```
 *
 * The sidebar uses data-collapsed="true/false" to control its state.
 * CSS should handle width transitions based on this attribute.
 */

export function sidebar() {
  const sidebars = document.querySelectorAll<HTMLElement>('[data-sidebar-collapsible]')

  sidebars.forEach((sidebar) => {
    const triggers = sidebar.querySelectorAll<HTMLElement>('[data-collapsible-trigger]')

    if (triggers.length === 0) return

    const isCollapsed = () => sidebar.dataset.collapsed === 'true'

    const toggle = () => {
      const collapsed = isCollapsed()
      sidebar.dataset.collapsed = collapsed ? 'false' : 'true'
      
      // Update all triggers' aria-expanded
      triggers.forEach((trigger) => {
        trigger.setAttribute('aria-expanded', collapsed ? 'true' : 'false')
      })
    }

    triggers.forEach((trigger) => {
      // Set initial ARIA state
      trigger.setAttribute('aria-expanded', isCollapsed() ? 'false' : 'true')

      trigger.addEventListener('click', (e) => {
        e.preventDefault()
        toggle()
      })

      // Keyboard support
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      })
    })
  })
}

export function getSidebar(element: HTMLElement) {
  const sidebar = element.closest<HTMLElement>('[data-sidebar-collapsible]')
  if (!sidebar) return null

  return {
    collapse: () => {
      sidebar.dataset.collapsed = 'true'
    },
    expand: () => {
      sidebar.dataset.collapsed = 'false'
    },
    toggle: () => {
      sidebar.dataset.collapsed = sidebar.dataset.collapsed === 'true' ? 'false' : 'true'
    },
    isCollapsed: () => sidebar.dataset.collapsed === 'true',
  }
}
