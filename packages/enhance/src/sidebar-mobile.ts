/**
 * Initialize mobile sidebar slide-in functionality for [data-sidebar-mobile] elements.
 *
 * Usage:
 * ```html
 * <div class="relative flex h-full" data-sidebar-mobile>
 *   <div data-sidebar-mobile-overlay class="absolute inset-0 z-40 bg-overlay-scrim hidden md:hidden"></div>
 *   <aside data-sidebar-mobile-content class="absolute inset-y-0 left-0 z-50 w-64 opacity-0 -translate-x-full md:opacity-100 md:relative md:z-auto md:translate-x-0 transition-all duration-300 ease-in-out ...">
 *     Sidebar content
 *   </aside>
 *   <main>
 *     <button data-sidebar-mobile-trigger class="md:hidden">Toggle</button>
 *     Main content
 *   </main>
 * </div>
 * ```
 *
 * The sidebar slides in from the left on mobile/tablet when triggered.
 * Uses class toggling to work with Tailwind responsive utilities.
 */

export function sidebarMobile() {
  const containers = document.querySelectorAll<HTMLElement>('[data-sidebar-mobile]')

  containers.forEach((container) => {
    if (container.dataset.sidebarMobileInitialized === 'true') {
      return
    }

    const isOwnedByContainer = (element: HTMLElement) =>
      element.closest<HTMLElement>('[data-sidebar-mobile]') === container

    const triggers = Array.from(
      container.querySelectorAll<HTMLElement>('[data-sidebar-mobile-trigger]'),
    ).filter(isOwnedByContainer)
    const overlay = Array.from(
      container.querySelectorAll<HTMLElement>('[data-sidebar-mobile-overlay]'),
    ).find(isOwnedByContainer)
    const content = Array.from(
      container.querySelectorAll<HTMLElement>('[data-sidebar-mobile-content]'),
    ).find(isOwnedByContainer)

    if (!content || triggers.length === 0) return
    const breakpointPx =
      Number.parseFloat(container.dataset.sidebarMobileBreakpoint || '') || 768
    const isDesktop = () => window.matchMedia(`(min-width: ${breakpointPx}px)`).matches
    let wasDesktop = isDesktop()
    const resolveDesktopOpenWidth = () => {
      const explicitDesktopWidth =
        content.dataset.sidebarMobileDesktopWidth ||
        container.dataset.sidebarMobileDesktopWidth

      if (explicitDesktopWidth) {
        return explicitDesktopWidth
      }

      const prevInlineWidth = content.style.width
      content.style.width = ''
      const measuredWidth = window.getComputedStyle(content).width
      content.style.width = prevInlineWidth

      const numericWidth = Number.parseFloat(measuredWidth)
      if (Number.isFinite(numericWidth) && numericWidth > 0) {
        return `${numericWidth}px`
      }

      return '16rem'
    }
    let desktopOpenWidth = resolveDesktopOpenWidth()

    const isOpen = () => container.dataset.sidebarMobileState === 'open'

    const setState = (openState: boolean, animate = true) => {
      const prevContentTransition = content.style.transition
      const prevOverlayTransition = overlay?.style.transition

      if (!animate) {
        content.style.transition = 'none'
        if (overlay) {
          overlay.style.transition = 'none'
        }
      }

      container.dataset.sidebarMobileState = openState ? 'open' : 'closed'

      if (isDesktop()) {
        if (openState) {
          desktopOpenWidth = resolveDesktopOpenWidth()
        }

        // On desktop, drive state with inline styles so nested sidebar containers
        // are not affected by ancestor [data-sidebar-mobile-state] selectors.
        content.style.transform = openState ? 'translateX(0)' : 'translateX(-100%)'
        content.style.width = openState ? desktopOpenWidth : '0px'
        content.style.pointerEvents = openState ? 'auto' : 'none'

        if (overlay) {
          overlay.style.opacity = '0'
          overlay.classList.add('hidden')
        }

        if (!animate) {
          void content.offsetHeight
          content.style.transition = prevContentTransition
          if (overlay) {
            overlay.style.transition = prevOverlayTransition || 'opacity 0.3s ease-in-out'
          }
        }

        return
      }

      content.style.transform = ''
      content.style.width = ''
      content.style.pointerEvents = ''

      if (openState) {
        content.classList.remove('-translate-x-full', 'pointer-events-none')
        content.classList.add('translate-x-0', 'pointer-events-auto')

        if (overlay) {
          overlay.classList.remove('hidden')
          requestAnimationFrame(() => {
            overlay.style.opacity = '1'
          })
        }
      } else {
        content.classList.remove('translate-x-0', 'pointer-events-auto')
        content.classList.add('-translate-x-full', 'pointer-events-none')

        if (overlay) {
          overlay.style.opacity = '0'
          if (animate) {
            setTimeout(() => {
              if (!isOpen()) {
                overlay.classList.add('hidden')
              }
            }, 300)
          } else {
            overlay.classList.add('hidden')
          }
        }
      }

      if (!animate) {
        void content.offsetHeight
        content.style.transition = prevContentTransition
        if (overlay) {
          overlay.style.transition = prevOverlayTransition || 'opacity 0.3s ease-in-out'
        }
      }
    }

    const toggle = () => {
      if (isOpen()) {
        setState(false)
      } else {
        setState(true)
      }
    }

    // Set overlay transition
    if (overlay) {
      overlay.style.transition = 'opacity 0.3s ease-in-out'
      overlay.style.opacity = '0'
    }

    // Bind triggers
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault()
        toggle()
      })
    })

    // Close on overlay click
    overlay?.addEventListener('click', () => setState(false))

    // Opt-in: close the sheet on any link click inside the content (mobile only)
    if (container.dataset.sidebarMobileAutoClose !== undefined) {
      content.addEventListener('click', (event) => {
        if (isDesktop()) return
        const target = event.target as HTMLElement | null
        if (target?.closest('a')) setState(false)
      })
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen() && !isDesktop()) {
        setState(false)
      }
    })

    // Initialize from explicit state, otherwise responsive default.
    if (container.dataset.sidebarMobileState === 'open') {
      setState(true, false)
    } else if (container.dataset.sidebarMobileState === 'closed') {
      setState(false, false)
    } else if (wasDesktop) {
      setState(true, false)
    } else {
      setState(false, false)
    }

    window.addEventListener('resize', () => {
      const desktop = isDesktop()
      if (desktop === wasDesktop) return

      wasDesktop = desktop
      if (desktop) {
        desktopOpenWidth = resolveDesktopOpenWidth()
      }
      setState(desktop, false)
    })

    container.dataset.sidebarMobileInitialized = 'true'
  })
}
