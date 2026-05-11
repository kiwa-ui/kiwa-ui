/**
 * Initialize combobox / multi-select functionality for all [data-combobox] elements.
 *
 * Supports two modes via `data-combobox-multiple`:
 *   - single (default): one value, popover closes on select
 *   - multiple ("true"): array of values, popover stays open, toggle on click
 *
 * Content is portaled to <body> on open (matches select.ts), so the menu
 * escapes any ancestor overflow container.
 *
 * Usage (single):
 * ```html
 * <div data-combobox data-combobox-value="next">
 *   <input type="hidden" name="framework" value="next" data-combobox-hidden-input />
 *   <button data-combobox-trigger>
 *     <span data-combobox-value-display>Next.js</span>
 *   </button>
 *   <div data-combobox-content data-state="closed">
 *     <input data-combobox-input placeholder="Search..." />
 *     <div data-combobox-list>
 *       <div data-combobox-empty>No results.</div>
 *       <button data-combobox-item data-value="next">Next.js</button>
 *       <button data-combobox-item data-value="hono">Hono</button>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * Multi mode renders hidden inputs at the root (one per value, same name).
 */

import { calculatePosition, applyPosition, prepareForMeasurement, type Side, type Align } from './utils/position'
import { portalToBody, returnFromPortal } from './utils/portal'
import { linkAriaControls } from './utils/aria'

export function combobox() {
  const roots = document.querySelectorAll<HTMLElement>('[data-combobox]')

  const closeFunctions: (() => void)[] = []

  roots.forEach((root, rootIndex) => {
    const trigger = root.querySelector<HTMLElement>('[data-combobox-trigger]')
    const content = root.querySelector<HTMLElement>('[data-combobox-content]')
    const input = root.querySelector<HTMLInputElement>('[data-combobox-input]')
    const list = root.querySelector<HTMLElement>('[data-combobox-list]')
    const empty = root.querySelector<HTMLElement>('[data-combobox-empty]')
    const valueDisplay = trigger?.querySelector<HTMLElement>('[data-combobox-value-display]')
    const clearBtn = trigger?.querySelector<HTMLElement>('[data-combobox-clear]')

    if (!trigger || !content || !list) return

    const multiple = root.dataset.comboboxMultiple === 'true'
    const placeholder = root.dataset.comboboxPlaceholder || ''
    const name = root.dataset.comboboxName || ''

    // Set up ARIA
    trigger.setAttribute('aria-haspopup', 'listbox')
    trigger.setAttribute('aria-expanded', 'false')
    linkAriaControls(trigger, content)
    list.setAttribute('role', 'listbox')
    if (multiple) list.setAttribute('aria-multiselectable', 'true')
    if (input) {
      input.setAttribute('role', 'combobox')
      input.setAttribute('aria-autocomplete', 'list')
      input.setAttribute('aria-controls', list.id || linkAriaControls(input, list))
    }

    const items = Array.from(content.querySelectorAll<HTMLElement>('[data-combobox-item]'))
    const groups = Array.from(content.querySelectorAll<HTMLElement>('[data-combobox-group]'))

    items.forEach((item) => {
      item.setAttribute('role', 'option')
      item.setAttribute('tabindex', '-1')
      item.setAttribute('aria-selected', item.dataset.selected === 'true' ? 'true' : 'false')
    })

    let highlightIndex = 0
    let visibleItems: HTMLElement[] = [...items]
    let cleanupScrollListener: (() => void) | null = null
    let cleanupResizeListener: (() => void) | null = null

    // Selection state
    const getSelected = (): string[] => {
      const raw = root.dataset.comboboxValue || ''
      if (!raw) return []
      return multiple ? raw.split(',').filter(Boolean) : [raw]
    }

    const setSelected = (values: string[]) => {
      root.dataset.comboboxValue = multiple ? values.join(',') : (values[0] || '')

      items.forEach((item) => {
        const v = item.dataset.value || ''
        const isSel = values.includes(v)
        item.dataset.selected = isSel ? 'true' : 'false'
        item.setAttribute('aria-selected', String(isSel))
      })

      syncHiddenInputs(values)
      renderDisplay(values)
      updateClearButton(values)
    }

    const syncHiddenInputs = (values: string[]) => {
      // Remove all existing hidden inputs we manage
      root.querySelectorAll('[data-combobox-hidden-input]').forEach((el) => el.remove())

      if (!name) return

      if (multiple) {
        values.forEach((v) => {
          const hidden = document.createElement('input')
          hidden.type = 'hidden'
          hidden.name = name
          hidden.value = v
          hidden.setAttribute('data-combobox-hidden-input', '')
          root.appendChild(hidden)
        })
      } else {
        const hidden = document.createElement('input')
        hidden.type = 'hidden'
        hidden.name = name
        hidden.value = values[0] || ''
        hidden.setAttribute('data-combobox-hidden-input', '')
        root.appendChild(hidden)
      }
    }

    const getItemLabel = (item: HTMLElement): string => {
      const labelEl = item.querySelector<HTMLElement>('[data-combobox-item-label]')
      return (labelEl?.textContent || item.textContent || '').trim()
    }

    const renderDisplay = (values: string[]) => {
      if (!valueDisplay) return

      if (!multiple) {
        const value = values[0]
        if (!value) {
          valueDisplay.innerHTML = ''
          valueDisplay.appendChild(buildPlaceholder())
          return
        }
        const match = items.find((i) => i.dataset.value === value)
        valueDisplay.textContent = match ? getItemLabel(match) : value
        return
      }

      // Multi: render badge chips + overflow + placeholder fallback
      valueDisplay.innerHTML = ''

      if (values.length === 0) {
        valueDisplay.appendChild(buildPlaceholder())
        return
      }

      const maxDisplay = parseInt(root.dataset.comboboxMaxDisplay || '3', 10)
      const shown = values.slice(0, maxDisplay)
      const overflow = values.length - shown.length

      shown.forEach((v) => {
        const match = items.find((i) => i.dataset.value === v)
        valueDisplay.appendChild(buildBadge(v, match ? getItemLabel(match) : v))
      })

      if (overflow > 0) {
        const more = document.createElement('span')
        more.setAttribute('data-combobox-overflow', '')
        more.className =
          'inline-flex items-center justify-center rounded-sm border border-subtle bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium shrink-0'
        more.textContent = `+${overflow}`
        valueDisplay.appendChild(more)
      }
    }

    const buildPlaceholder = (): HTMLElement => {
      const span = document.createElement('span')
      span.className = 'text-foreground-muted'
      span.textContent = placeholder
      return span
    }

    const buildBadge = (value: string, label: string): HTMLElement => {
      const span = document.createElement('span')
      span.setAttribute('data-combobox-chip', '')
      span.dataset.value = value
      span.className =
        'inline-flex items-center gap-1 rounded-sm border border-subtle bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium shrink-0 whitespace-nowrap'

      const labelEl = document.createElement('span')
      labelEl.textContent = label
      span.appendChild(labelEl)

      const removeBtn = document.createElement('span')
      removeBtn.setAttribute('role', 'button')
      removeBtn.setAttribute('data-combobox-chip-remove', '')
      removeBtn.setAttribute('aria-label', `Remove ${label}`)
      removeBtn.tabIndex = -1
      removeBtn.className =
        'inline-flex size-3.5 items-center justify-center rounded -mr-1 cursor-pointer hover:bg-background-subtle text-foreground-muted hover:text-foreground transition-colors'
      removeBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3 pointer-events-none"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'

      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
        const current = getSelected()
        setSelected(current.filter((v) => v !== value))
        dispatchChange()
      })

      span.appendChild(removeBtn)
      return span
    }

    const updateClearButton = (values: string[]) => {
      if (!clearBtn) return
      const hasValue = multiple ? values.length > 0 : Boolean(values[0])
      clearBtn.toggleAttribute('hidden', !hasValue)
    }

    // Filtering
    const getVisibleItems = (): HTMLElement[] => items.filter((item) => !item.hidden)

    const updateHighlight = () => {
      visibleItems = getVisibleItems()
      if (highlightIndex >= visibleItems.length) highlightIndex = Math.max(0, visibleItems.length - 1)

      items.forEach((item) => {
        item.dataset.highlighted = item === visibleItems[highlightIndex] ? 'true' : 'false'
      })

      const active = visibleItems[highlightIndex]
      if (active) active.scrollIntoView({ block: 'nearest' })
    }

    const filter = (query: string) => {
      const q = query.toLowerCase().trim()

      let hasVisible = false
      items.forEach((item) => {
        const label = getItemLabel(item).toLowerCase()
        const keywords = (item.dataset.comboboxKeywords || '').toLowerCase()
        const matches = q === '' || label.includes(q) || keywords.includes(q)
        item.hidden = !matches
        if (matches) hasVisible = true
      })

      // Hide groups with no visible items
      groups.forEach((group) => {
        const groupItems = Array.from(group.querySelectorAll<HTMLElement>('[data-combobox-item]'))
        const groupHasVisible = groupItems.some((item) => !item.hidden)
        group.hidden = !groupHasVisible
      })

      if (empty) empty.hidden = hasVisible

      highlightIndex = 0
      updateHighlight()
    }

    // Open / close
    const isOpen = () => content.dataset.state === 'open'

    const closeOthers = () => {
      closeFunctions.forEach((fn, i) => {
        if (i !== rootIndex) fn()
      })
    }

    const reposition = () => {
      if (!isOpen()) return
      const side = (content.dataset.comboboxSide || 'bottom') as Side
      const align = (content.dataset.comboboxAlign || 'start') as Align
      const position = calculatePosition(trigger, content, { side, align, sideOffset: 4 })
      applyPosition(content, position)
    }

    const open = () => {
      if (isOpen()) return
      closeOthers()

      // Match content width to trigger, respecting any CSS min-width on content
      const prevMin = content.style.minWidth
      content.style.minWidth = ''
      const cssMin = parseFloat(window.getComputedStyle(content).minWidth) || 0
      content.style.minWidth = prevMin
      content.style.minWidth = `${Math.max(trigger.offsetWidth, cssMin)}px`

      portalToBody(content)

      const side = (content.dataset.comboboxSide || 'bottom') as Side
      const align = (content.dataset.comboboxAlign || 'start') as Align

      const cleanup = prepareForMeasurement(content)
      void content.offsetHeight
      const position = calculatePosition(trigger, content, { side, align, sideOffset: 4 })
      cleanup()
      content.hidden = false
      applyPosition(content, position)
      content.style.visibility = ''
      content.dataset.state = 'open'
      trigger.setAttribute('aria-expanded', 'true')

      // Reset filter + focus input
      if (input) {
        input.value = ''
        filter('')
        // Defer focus so the click that opened doesn't immediately blur
        requestAnimationFrame(() => input.focus())
      } else {
        filter('')
      }

      // Highlight first selected item if any, otherwise first visible
      const selected = getSelected()
      if (selected.length > 0) {
        const firstSel = visibleItems.findIndex((i) => selected.includes(i.dataset.value || ''))
        highlightIndex = firstSel >= 0 ? firstSel : 0
      } else {
        highlightIndex = 0
      }
      updateHighlight()

      cleanupScrollListener = (() => {
        const onScroll = (e: Event) => {
          const t = e.target as HTMLElement | null
          if (t && content.contains(t)) return
          close()
        }
        window.addEventListener('scroll', onScroll, true)
        return () => window.removeEventListener('scroll', onScroll, true)
      })()

      cleanupResizeListener = (() => {
        let frame: number | null = null
        const onResize = () => {
          if (frame !== null) cancelAnimationFrame(frame)
          frame = requestAnimationFrame(() => {
            frame = null
            reposition()
          })
        }
        window.addEventListener('resize', onResize)
        return () => {
          if (frame !== null) cancelAnimationFrame(frame)
          window.removeEventListener('resize', onResize)
        }
      })()
    }

    const close = () => {
      if (!isOpen()) return
      content.dataset.state = 'closed'
      trigger.setAttribute('aria-expanded', 'false')
      content.hidden = true
      returnFromPortal(content)

      if (cleanupScrollListener) {
        cleanupScrollListener()
        cleanupScrollListener = null
      }
      if (cleanupResizeListener) {
        cleanupResizeListener()
        cleanupResizeListener = null
      }

      trigger.focus()
    }

    const toggle = () => {
      if (isOpen()) close()
      else open()
    }

    // Selection
    const dispatchChange = () => {
      root.dispatchEvent(
        new CustomEvent('combobox-change', {
          detail: { value: multiple ? getSelected() : getSelected()[0] || '' },
          bubbles: true,
        })
      )
    }

    const selectItem = (item: HTMLElement) => {
      const value = item.dataset.value
      if (!value) return

      const current = getSelected()

      if (multiple) {
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]
        setSelected(next)
        dispatchChange()
        // Keep popover open; refocus input for continued search
        input?.focus()
      } else {
        setSelected([value])
        dispatchChange()
        close()
      }
    }

    // Events
    trigger.addEventListener('click', (e) => {
      // Don't toggle when clicking on a chip remove or the clear button
      const target = e.target as HTMLElement
      if (target.closest('[data-combobox-chip-remove]')) return
      if (target.closest('[data-combobox-clear]')) return
      e.stopPropagation()
      toggle()
    })

    trigger.addEventListener('keydown', (e) => {
      if (isOpen()) return
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        open()
      }
    })

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
        setSelected([])
        dispatchChange()
      })
    }

    if (input) {
      input.addEventListener('input', () => filter(input.value))

      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (visibleItems.length === 0) return
          highlightIndex = Math.min(highlightIndex + 1, visibleItems.length - 1)
          updateHighlight()
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (visibleItems.length === 0) return
          highlightIndex = Math.max(highlightIndex - 1, 0)
          updateHighlight()
          return
        }
        if (e.key === 'Home') {
          e.preventDefault()
          highlightIndex = 0
          updateHighlight()
          return
        }
        if (e.key === 'End') {
          e.preventDefault()
          highlightIndex = visibleItems.length - 1
          updateHighlight()
          return
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          const active = visibleItems[highlightIndex]
          if (active) selectItem(active)
          return
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          close()
          return
        }
        if (e.key === 'Tab') {
          close()
        }
      })
    }

    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        selectItem(item)
      })
      item.addEventListener('mousemove', () => {
        const idx = visibleItems.indexOf(item)
        if (idx >= 0 && idx !== highlightIndex) {
          highlightIndex = idx
          updateHighlight()
        }
      })
    })

    // Close on outside click. Content is portaled to body so we must check both.
    document.addEventListener('click', (e) => {
      if (!isOpen()) return
      const target = e.target as Node
      if (root.contains(target) || content.contains(target)) return
      close()
    })

    // Initialize
    content.hidden = true
    content.dataset.state = 'closed'

    // Wire up any SSR-rendered chip remove buttons + clear button to match dynamic ones
    root.querySelectorAll<HTMLElement>('[data-combobox-chip]').forEach((chip) => {
      const removeBtn = chip.querySelector<HTMLButtonElement>('[data-combobox-chip-remove]')
      if (!removeBtn) return
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
        const value = chip.dataset.value || ''
        const current = getSelected()
        setSelected(current.filter((v) => v !== value))
        dispatchChange()
      })
    })

    // Initial state sync from data-combobox-value or pre-rendered selected items
    const initialFromAttr = root.dataset.comboboxValue
      ? (multiple ? root.dataset.comboboxValue.split(',').filter(Boolean) : [root.dataset.comboboxValue])
      : items.filter((i) => i.dataset.selected === 'true').map((i) => i.dataset.value || '').filter(Boolean)

    if (initialFromAttr.length > 0) {
      setSelected(initialFromAttr)
    } else {
      // Make sure placeholder/display + clear visibility are correct on init
      renderDisplay([])
      updateClearButton([])
    }

    closeFunctions.push(close)
  })
}
