/**
 * Initialize popover-submenu functionality for all [data-popover-submenu] elements.
 *
 * Cascading panels:
 *   1. Main popover (trigger items list)
 *   2. Sub-panel (options for the hovered trigger, positioned right of popover)
 *   3. Optional date-picker panel (positioned right of sub-panel, triggered by
 *      a "Custom range" item) — opt-in for consumers that need a date range.
 *
 * All panels are fixed-position siblings outside the popover to avoid
 * stacking-context issues with sidebars and other layout elements.
 */

import { portalToBody, returnFromPortal } from './utils/portal'

const PANEL_GAP = 4

type SubmenuTriggerState = {
  triggerEl: HTMLElement
  panelId: string
  panel: HTMLElement | null
  panelSearch: HTMLInputElement | null
  panelSearchWrap: HTMLElement | null
  optionEls: HTMLElement[]
  dateTrigger: HTMLElement | null
  dateDivider: HTMLElement | null
}

export function popoverSubmenu() {
  const menus = document.querySelectorAll<HTMLElement>('[data-popover-submenu]')

  const STYLE_ID = 'hono-ui-popover-submenu-safezone'
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = [
      '[data-popover-submenu-trigger][data-active="true"]{z-index:1}',
      '[data-popover-submenu-trigger][data-active="true"]::after{' +
        'content:"";position:absolute;top:0;' +
        'left:var(--safe-l,0px);' +
        'width:var(--safe-w,0px);height:var(--safe-h,0px);' +
        'clip-path:var(--safe-clip);pointer-events:inherit}',
    ].join('\n')
    document.head.appendChild(style)
  }

  menus.forEach((menu) => {
    const menuId = menu.dataset.popoverSubmenu
    if (!menuId) return

    const popover = menu.querySelector<HTMLElement>(`[data-popover="${menuId}"]`)
    if (!popover) return

    const triggers = popover.querySelectorAll<HTMLElement>('[data-popover-submenu-trigger]')
    const panels = menu.querySelectorAll<HTMLElement>('[data-popover-submenu-panel]')
    const datePanels = menu.querySelectorAll<HTMLElement>('[data-popover-submenu-date-panel]')
    const mainSearch = popover.querySelector<HTMLInputElement>('[data-popover-submenu-search]')
    const triggerStates: SubmenuTriggerState[] = Array.from(triggers)
      .map((triggerEl) => {
        const panelId = triggerEl.dataset.popoverSubmenuTrigger
        if (!panelId) return null

        const panel = menu.querySelector<HTMLElement>(`[data-popover-submenu-panel="${panelId}"]`)
        return {
          triggerEl,
          panelId,
          panel,
          panelSearch:
            panel?.querySelector<HTMLInputElement>('[data-popover-submenu-panel-search]') ?? null,
          panelSearchWrap:
            panel?.querySelector<HTMLElement>('[data-popover-submenu-panel-search-wrap]') ?? null,
          optionEls: panel
            ? Array.from(panel.querySelectorAll<HTMLElement>('[data-popover-submenu-option]'))
            : [],
          dateTrigger:
            panel?.querySelector<HTMLElement>('[data-popover-submenu-date-trigger]') ?? null,
          dateDivider:
            panel?.querySelector<HTMLElement>('[data-popover-submenu-date-divider]') ?? null,
        }
      })
      .filter((state): state is SubmenuTriggerState => state !== null)
    const triggerStateById = new Map(triggerStates.map((state) => [state.panelId, state]))

    // Cache custom-date triggers at init so hideDatePanel() still finds them
    // after sub-panels have been portaled out of the `menu` container.
    const dateTriggers = Array.from(
      menu.querySelectorAll<HTMLElement>('[data-popover-submenu-date-trigger]'),
    )

    let activePanel: HTMLElement | null = null
    let activeDatePanel: HTMLElement | null = null
    let hoverTimeout: ReturnType<typeof setTimeout> | null = null

    const clearHoverTimeout = () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        hoverTimeout = null
      }
    }
    const normalize = (value: string | null | undefined) => value?.toLowerCase().trim() || ''
    const setVisible = (element: HTMLElement, visible: boolean) => {
      element.style.display = visible ? '' : 'none'
    }

    const setSafeZone = (triggerEl: HTMLElement, panel: HTMLElement) => {
      const popoverRect = popover.getBoundingClientRect()
      const catRect = triggerEl.getBoundingClientRect()
      const panelRect = panel.getBoundingClientRect()

      const opensRight = panelRect.left >= popoverRect.right - 1
      const gapToPanel = opensRight
        ? panelRect.left - catRect.right
        : catRect.left - panelRect.right
      const safeW = catRect.width + gapToPanel + 8
      const safeH = popoverRect.bottom - catRect.top

      if (opensRight) {
        triggerEl.style.setProperty('--safe-l', '0px')
        triggerEl.style.setProperty('--safe-clip', 'polygon(0 0, 100% 0, 100% 100%)')
      } else {
        triggerEl.style.setProperty('--safe-l', `${-(gapToPanel + 8)}px`)
        triggerEl.style.setProperty('--safe-clip', 'polygon(0 0, 100% 0, 0 100%)')
      }

      triggerEl.style.setProperty('--safe-w', `${Math.max(0, safeW)}px`)
      triggerEl.style.setProperty('--safe-h', `${Math.max(0, safeH)}px`)
    }

    const clearSafeZone = (triggerEl: HTMLElement) => {
      triggerEl.style.removeProperty('--safe-w')
      triggerEl.style.removeProperty('--safe-h')
      triggerEl.style.removeProperty('--safe-l')
      triggerEl.style.removeProperty('--safe-clip')
    }

    const positionPanelRight = (
      panel: HTMLElement,
      anchorEl: HTMLElement,
      alignEl: HTMLElement,
      verticalAlign: 'top' | 'center' = 'top',
    ) => {
      // Portal the panel to <body> so `position: fixed` always resolves
      // against the viewport, escaping any ancestor that establishes a
      // containing block (transform / translate / filter / etc.).
      portalToBody(panel)

      const anchorRect = anchorEl.getBoundingClientRect()
      const alignRect = alignEl.getBoundingClientRect()

      panel.style.position = 'fixed'
      panel.style.visibility = 'hidden'
      panel.hidden = false
      const panelRect = panel.getBoundingClientRect()

      // Horizontal: to the right of the anchor (or left if no room)
      let left = anchorRect.right + PANEL_GAP
      if (left + panelRect.width > window.innerWidth - 8) {
        left = anchorRect.left - panelRect.width - PANEL_GAP
      }

      // Vertical: align top or center on the alignment element
      let top: number
      if (verticalAlign === 'center') {
        const alignCenter = alignRect.top + alignRect.height / 2
        top = alignCenter - panelRect.height / 2
      } else {
        top = alignRect.top
      }
      top = Math.max(8, Math.min(top, window.innerHeight - panelRect.height - 8))

      panel.style.top = `${top}px`
      panel.style.left = `${left}px`
      panel.style.visibility = ''
    }

    const hideDatePanel = () => {
      if (activeDatePanel) {
        activeDatePanel.hidden = true
        returnFromPortal(activeDatePanel)
        activeDatePanel = null
      }
      // Remove active state from date triggers (cached at init — the
      // triggers live inside sub-panels which get portaled out of `menu`).
      dateTriggers.forEach((t) => {
        t.dataset.active = 'false'
      })
    }

    const showPanel = (panelId: string, triggerEl: HTMLElement) => {
      // Use cached reference — sub-panels are portaled to <body> on first
      // show, so `menu.querySelector()` would miss them on subsequent calls.
      const panel = triggerStateById.get(panelId)?.panel ?? null
      if (!panel) return

      if (panel === activePanel) {
        positionPanelRight(panel, popover, triggerEl)
        triggers.forEach((c) => {
          c.dataset.active = 'false'
          clearSafeZone(c)
        })
        triggerEl.dataset.active = 'true'
        setSafeZone(triggerEl, panel)
        return
      }

      hideActivePanel()
      positionPanelRight(panel, popover, triggerEl)
      activePanel = panel

      triggers.forEach((c) => {
        c.dataset.active = 'false'
        clearSafeZone(c)
      })
      triggerEl.dataset.active = 'true'
      setSafeZone(triggerEl, panel)
    }

    const hideActivePanel = () => {
      hideDatePanel()
      if (activePanel) {
        activePanel.hidden = true
        returnFromPortal(activePanel)
        activePanel = null
      }
      triggers.forEach((c) => {
        c.dataset.active = 'false'
        clearSafeZone(c)
      })
    }

    const applyPanelFilters = (state: SubmenuTriggerState, mainQuery: string) => {
      const isMainSearching = Boolean(mainQuery)
      if (state.panelSearchWrap) setVisible(state.panelSearchWrap, !isMainSearching)

      const panelQuery = isMainSearching ? '' : normalize(state.panelSearch?.value)
      const queries = [mainQuery, panelQuery].filter(Boolean)
      let visibleCount = 0

      state.optionEls.forEach((optionEl) => {
        const label = normalize(
          optionEl.dataset.popoverSubmenuOptionLabel || optionEl.textContent,
        )
        const visible = queries.every((query) => label.includes(query))
        setVisible(optionEl, visible)
        if (visible) visibleCount += 1
      })

      if (state.dateTrigger) {
        const label = normalize(state.dateTrigger.textContent)
        const visible = queries.every((query) => label.includes(query))
        setVisible(state.dateTrigger, visible)
        if (state.dateDivider) setVisible(state.dateDivider, visible)
        if (visible) visibleCount += 1
      }

      return visibleCount
    }

    const applySearchFilters = () => {
      const mainQuery = normalize(mainSearch?.value)
      let firstTriggerWithOptionMatchId: string | null = null
      let firstVisibleTriggerId: string | null = null

      triggerStates.forEach((state) => {
        const optionMatches = applyPanelFilters(state, mainQuery)
        const triggerLabel = normalize(state.triggerEl.textContent)
        const visible = !mainQuery || triggerLabel.includes(mainQuery) || optionMatches > 0
        const triggerId = state.triggerEl.dataset.popoverSubmenuTrigger

        setVisible(state.triggerEl, visible)
        if (visible && triggerId && !firstVisibleTriggerId) firstVisibleTriggerId = triggerId
        if (optionMatches > 0 && triggerId && !firstTriggerWithOptionMatchId) {
          firstTriggerWithOptionMatchId = triggerId
        }
      })

      if (activeDatePanel) {
        const activeDatePanelId = activeDatePanel.dataset.popoverSubmenuDatePanel
        if (activeDatePanelId) {
          const activeState = triggerStateById.get(activeDatePanelId)
          if (activeState?.dateTrigger && activeState.dateTrigger.style.display === 'none') {
            hideDatePanel()
          }
        }
      }

      return { mainQuery, firstTriggerWithOptionMatchId, firstVisibleTriggerId }
    }

    const resetSearchFilters = () => {
      if (mainSearch) mainSearch.value = ''

      triggerStates.forEach((state) => {
        setVisible(state.triggerEl, true)
        if (state.panelSearchWrap) setVisible(state.panelSearchWrap, true)
        if (state.panelSearch) state.panelSearch.value = ''
        state.optionEls.forEach((optionEl) => setVisible(optionEl, true))
        if (state.dateTrigger) setVisible(state.dateTrigger, true)
        if (state.dateDivider) setVisible(state.dateDivider, true)
      })
    }

    const hideAllPanels = () => {
      clearHoverTimeout()
      hideDatePanel()
      panels.forEach((p) => { p.hidden = true; returnFromPortal(p) })
      activePanel = null
      triggers.forEach((c) => {
        c.dataset.active = 'false'
        clearSafeZone(c)
      })
    }

    const scheduleHide = () => {
      clearHoverTimeout()
      hoverTimeout = setTimeout(() => hideActivePanel(), 150)
    }

    // Trigger hover → show sub-panel
    triggers.forEach((cat) => {
      const panelId = cat.dataset.popoverSubmenuTrigger
      if (!panelId) return

      cat.addEventListener('mouseenter', () => {
        clearHoverTimeout()
        showPanel(panelId, cat)
      })

      cat.addEventListener('mouseleave', (e) => {
        const related = e.relatedTarget as HTMLElement | null
        if (related) {
          if (
            related.closest('[data-popover-submenu-panel]') ||
            related.closest('[data-popover-submenu-trigger]')
          ) return
        }
        scheduleHide()
      })
    })

    // Keep panels open when hovering over them
    panels.forEach((panel) => {
      panel.addEventListener('mouseenter', () => {
        clearHoverTimeout()
        // Cursor reached the panel — clear the safe zone triangle so
        // sibling triggers become accessible again for intentional switching
        triggers.forEach((c) => clearSafeZone(c))
      })

      panel.addEventListener('mouseleave', (e) => {
        const related = e.relatedTarget as HTMLElement | null
        if (related) {
          if (
            related.closest('[data-popover-submenu-trigger]') ||
            related.closest('[data-popover-submenu-panel]') ||
            related.closest('[data-popover-submenu-date-panel]')
          ) return
        }
        scheduleHide()
      })
    })

    // Keep date panels open when hovering
    datePanels.forEach((dp) => {
      dp.addEventListener('mouseenter', () => clearHoverTimeout())

      dp.addEventListener('mouseleave', (e) => {
        const related = e.relatedTarget as HTMLElement | null
        if (related) {
          if (
            related.closest('[data-popover-submenu-panel]') ||
            related.closest('[data-popover-submenu-date-panel]')
          ) return
        }
        scheduleHide()
      })
    })

    // "Custom range" trigger → show date-picker panel to the right of the sub-panel
    menu
      .querySelectorAll<HTMLElement>('[data-popover-submenu-date-trigger]')
      .forEach((trigger) => {
        const panelId = trigger.dataset.popoverSubmenuDateTrigger
        if (!panelId) return

        const datePanel = menu.querySelector<HTMLElement>(
          `[data-popover-submenu-date-panel="${panelId}"]`,
        )
        const subPanel = trigger.closest<HTMLElement>('[data-popover-submenu-panel]')
        if (!datePanel || !subPanel) return

        const showDatePanel = () => {
          if (activeDatePanel === datePanel) return
          hideDatePanel()
          positionPanelRight(datePanel, subPanel, trigger, 'center')
          activeDatePanel = datePanel
          trigger.dataset.active = 'true'
        }

        trigger.addEventListener('mouseenter', () => {
          clearHoverTimeout()
          showDatePanel()
        })

        trigger.addEventListener('click', () => showDatePanel())
      })

    // Apply button in date panel
    datePanels.forEach((dp) => {
      const applyBtn = dp.querySelector<HTMLElement>('[data-popover-submenu-date-apply]')
      const clearBtn = dp.querySelector<HTMLElement>('[data-popover-submenu-date-panel-clear]')

      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          const startInput = dp.querySelector<HTMLInputElement>('[data-date-picker-input]')
          const endInput = dp.querySelector<HTMLInputElement>('[data-date-picker-input-end]')
          const start = startInput?.value || ''
          const end = endInput?.value || ''

          if (start && end) {
            menu.dispatchEvent(
              new CustomEvent('popover-submenu-change', {
                detail: {
                  category: 'date-joined',
                  value: 'custom',
                  customRange: { start, end },
                  checked: true,
                },
                bubbles: true,
              })
            )
          }
        })
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          const startInput = dp.querySelector<HTMLInputElement>('[data-date-picker-input]')
          const endInput = dp.querySelector<HTMLInputElement>('[data-date-picker-input-end]')
          if (startInput) startInput.value = ''
          if (endInput) endInput.value = ''
          // Trigger a re-render of the date picker grid
          dp.querySelector<HTMLElement>('[data-date-picker]')?.dispatchEvent(
            new CustomEvent('date-change', { detail: { value: '', valueEnd: '' } })
          )
        })
      }
    })

    // Main search: filter trigger items
    if (mainSearch) {
      mainSearch.addEventListener('input', () => {
        const { mainQuery, firstTriggerWithOptionMatchId, firstVisibleTriggerId } =
          applySearchFilters()

        if (!mainQuery) {
          hideActivePanel()
          return
        }

        const panelId = firstTriggerWithOptionMatchId ?? firstVisibleTriggerId
        if (!panelId) {
          hideActivePanel()
          return
        }

        const targetState = triggerStateById.get(panelId)
        if (!targetState) {
          hideActivePanel()
          return
        }

        clearHoverTimeout()
        showPanel(panelId, targetState.triggerEl)
      })
    }

    // Sub-panel search: filter options within each submenu
    triggerStates.forEach((state) => {
      if (!state.panelSearch) return

      state.panelSearch.addEventListener('input', () => {
        const mainQuery = normalize(mainSearch?.value)
        applyPanelFilters(state, mainQuery)
      })
    })

    // Checkbox changes
    const checkboxes = menu.querySelectorAll<HTMLInputElement>(
      '[data-popover-submenu-option] input[type="checkbox"]'
    )
    checkboxes.forEach((cb) => {
      cb.addEventListener('change', () => {
        const option = cb.closest<HTMLElement>('[data-popover-submenu-option]')
        const panel = cb.closest<HTMLElement>('[data-popover-submenu-panel]')
        if (!option || !panel) return

        const panelKey = panel.dataset.popoverSubmenuPanel || ''
        const categoryId = panelKey.includes('--') ? panelKey.split('--')[1] : panelKey

        menu.dispatchEvent(
          new CustomEvent('popover-submenu-change', {
            detail: {
              category: categoryId,
              value: option.dataset.popoverSubmenuOption,
              checked: cb.checked,
            },
            bubbles: true,
          })
        )
      })
    })

    // Popover close → hide everything
    const observer = new MutationObserver(() => {
      if (popover.dataset.state === 'closed' || popover.hidden) {
        hideAllPanels()
        resetSearchFilters()
      }
    })

    observer.observe(popover, {
      attributes: true,
      attributeFilter: ['data-state', 'hidden'],
    })

    hideAllPanels()
    resetSearchFilters()
  })
}
