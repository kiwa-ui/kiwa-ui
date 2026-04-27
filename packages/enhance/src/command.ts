/**
 * Initialize command palette functionality for all [data-command] elements.
 *
 * Usage:
 * ```html
 * <div data-command>
 *   <input data-command-input placeholder="Type a command..." />
 *   <div data-command-list>
 *     <div data-command-empty>No results found</div>
 *     <div data-command-group data-command-group-heading="Actions">
 *       <button data-command-item data-command-value="new">New File</button>
 *       <button data-command-item data-command-value="open">Open File</button>
 *     </div>
 *     <div data-command-group data-command-group-heading="Settings">
 *       <button data-command-item data-command-value="settings">Settings</button>
 *     </div>
 *   </div>
 * </div>
 * ```
 */

export function command() {
  const commands = document.querySelectorAll<HTMLElement>('[data-command]')

  commands.forEach((command) => {
    const input = command.querySelector<HTMLInputElement>('[data-command-input]')
    const list = command.querySelector<HTMLElement>('[data-command-list]')
    const empty = command.querySelector<HTMLElement>('[data-command-empty]')

    if (!input || !list) return

    const clearBtn = command.querySelector<HTMLButtonElement>('[data-command-clear]')

    const items = Array.from(command.querySelectorAll<HTMLElement>('[data-command-item]'))
    const groups = Array.from(command.querySelectorAll<HTMLElement>('[data-command-group]'))

    let currentIndex = 0
    let visibleItems: HTMLElement[] = [...items]

    // Set up ARIA
    command.setAttribute('role', 'combobox')
    command.setAttribute('aria-haspopup', 'listbox')
    command.setAttribute('aria-expanded', 'true')
    input.setAttribute('role', 'searchbox')
    input.setAttribute('aria-autocomplete', 'list')
    list.setAttribute('role', 'listbox')

    items.forEach((item) => {
      item.setAttribute('role', 'option')
      item.setAttribute('tabindex', '-1')
    })

    const getVisibleItems = (): HTMLElement[] => {
      return items.filter((item) => !item.hidden && item.offsetParent !== null)
    }

    const updateActive = () => {
      visibleItems = getVisibleItems()

      items.forEach((item) => {
        const isActive = visibleItems[currentIndex] === item
        item.dataset.active = isActive ? 'true' : 'false'
        item.setAttribute('aria-selected', String(isActive))
      })

      const active = visibleItems[currentIndex]
      if (active) {
        active.scrollIntoView({ block: 'nearest' })
      }
    }

    const filter = (query: string) => {
      const searchTerm = query.toLowerCase().trim()

      let hasVisibleItems = false

      items.forEach((item) => {
        const value = (item.dataset.commandValue || item.textContent || '').toLowerCase()
        const matches = searchTerm === '' || value.includes(searchTerm)

        item.hidden = !matches
        if (matches) hasVisibleItems = true
      })

      // Show/hide groups based on visible items
      let firstVisibleGroup = true
      groups.forEach((group) => {
        const groupItems = Array.from(group.querySelectorAll<HTMLElement>('[data-command-item]'))
        const hasVisible = groupItems.some((item) => !item.hidden)
        group.hidden = !hasVisible

        // Hide separator on first visible group to avoid leading divider
        const sep = group.querySelector<HTMLElement>('[data-command-group-separator]')
        if (sep) {
          sep.hidden = !hasVisible || firstVisibleGroup
        }
        if (hasVisible) firstVisibleGroup = false
      })

      // Show/hide empty state
      if (empty) {
        empty.hidden = hasVisibleItems
      }

      // Reset to first visible item
      currentIndex = 0
      updateActive()
    }

    const selectItem = (item: HTMLElement) => {
      const value = item.dataset.commandValue

      // Dispatch custom event
      command.dispatchEvent(
        new CustomEvent('command-select', {
          detail: { value, item },
          bubbles: true,
        })
      )
    }

    const updateClearButton = () => {
      if (clearBtn) {
        clearBtn.classList.toggle('hidden', input.value.length === 0)
      }
    }

    // Input events
    input.addEventListener('input', () => {
      filter(input.value)
      updateClearButton()
    })

    // Keyboard navigation — focus stays on input, listened on
    // command container so it fires regardless of focus target
    command.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        visibleItems = getVisibleItems()
        const len = visibleItems.length
        if (len === 0) return
        if (e.key === 'ArrowDown') {
          currentIndex = Math.min(currentIndex + 1, len - 1)
        } else {
          currentIndex = Math.max(currentIndex - 1, 0)
        }
        updateActive()
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const active = visibleItems[currentIndex]
        if (active) {
          selectItem(active)
          active.click()
        }
        return
      }

      if (e.key === 'Home') {
        e.preventDefault()
        currentIndex = 0
        updateActive()
        return
      }

      if (e.key === 'End') {
        e.preventDefault()
        visibleItems = getVisibleItems()
        currentIndex = visibleItems.length - 1
        updateActive()
        return
      }
    })

    // Item click
    items.forEach((item) => {
      item.addEventListener('click', () => {
        selectItem(item)
      })
    })

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = ''
        filter('')
        updateClearButton()
        input.focus()
      })
    }

    // Initialize
    filter('')
  })
}
