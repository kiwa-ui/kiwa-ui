/**
 * Initialize tabs functionality for all [data-tabs] elements.
 *
 * Usage:
 * ```html
 * <div data-tabs data-tabs-default="tab1">
 *   <div data-tabs-list>
 *     <button data-tabs-trigger="tab1">Tab 1</button>
 *     <button data-tabs-trigger="tab2">Tab 2</button>
 *   </div>
 *   <div data-tabs-content="tab1">Content 1</div>
 *   <div data-tabs-content="tab2">Content 2</div>
 * </div>
 * ```
 */

import { handleArrowNavigation } from './utils/keyboard'
import { generateId } from './utils/aria'

export function tabs() {
  const tabsContainers = document.querySelectorAll<HTMLElement>('[data-tabs]')

  tabsContainers.forEach((container) => {
    // Scope to direct children only — a nested [data-tabs] inside this
    // container owns its own triggers/contents.
    const ownedBy = (el: HTMLElement) => el.closest('[data-tabs]') === container

    const tabsList =
      Array.from(container.querySelectorAll<HTMLElement>('[data-tabs-list]'))
        .find(ownedBy) ?? null
    const triggers = Array.from(
      container.querySelectorAll<HTMLElement>('[data-tabs-trigger]')
    ).filter(ownedBy)
    const contents = Array.from(
      container.querySelectorAll<HTMLElement>('[data-tabs-content]')
    ).filter(ownedBy)

    if (!tabsList || triggers.length === 0) return

    const defaultTab = container.dataset.tabsDefault || triggers[0]?.dataset.tabsTrigger
    let currentIndex = 0

    // Set up ARIA
    tabsList.setAttribute('role', 'tablist')

    triggers.forEach((trigger, index) => {
      const tabId = trigger.dataset.tabsTrigger
      if (!tabId) return

      const panelId = generateId('tabpanel')
      const triggerId = generateId('tab')

      trigger.id = triggerId
      trigger.setAttribute('role', 'tab')
      trigger.setAttribute('tabindex', index === 0 ? '0' : '-1')

      const content = contents.find((c) => c.dataset.tabsContent === tabId)
      if (content) {
        content.id = panelId
        content.setAttribute('role', 'tabpanel')
        content.setAttribute('aria-labelledby', triggerId)
        trigger.setAttribute('aria-controls', panelId)
      }
    })

    const activateTab = (tabId: string) => {
      triggers.forEach((trigger, index) => {
        const isActive = trigger.dataset.tabsTrigger === tabId
        trigger.setAttribute('aria-selected', String(isActive))
        trigger.setAttribute('tabindex', isActive ? '0' : '-1')
        trigger.dataset.state = isActive ? 'active' : 'inactive'

        if (isActive) {
          currentIndex = index
        }
      })

      contents.forEach((content) => {
        const isActive = content.dataset.tabsContent === tabId
        content.hidden = !isActive
        content.dataset.state = isActive ? 'active' : 'inactive'
      })
    }

    // Click handlers
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const tabId = trigger.dataset.tabsTrigger
        if (tabId) {
          activateTab(tabId)
          trigger.focus()
        }
      })
    })

    // Keyboard navigation
    tabsList.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        currentIndex = handleArrowNavigation(e, {
          items: triggers,
          currentIndex,
          orientation: 'horizontal',
          onNavigate: (index) => {
            const tabId = triggers[index]?.dataset.tabsTrigger
            if (tabId) {
              activateTab(tabId)
            }
          },
        })
      }
    })

    // Initialize default tab
    if (defaultTab) {
      activateTab(defaultTab)
    }
  })
}
