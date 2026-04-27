/**
 * Keyboard navigation utilities for menus, tabs, and lists.
 */

export interface KeyboardNavigationOptions {
  /** Elements to navigate between */
  items: HTMLElement[]
  /** Current focused index */
  currentIndex: number
  /** Whether navigation wraps around */
  loop?: boolean
  /** Orientation for arrow key handling */
  orientation?: 'horizontal' | 'vertical' | 'both'
  /** Callback when selection changes */
  onNavigate?: (index: number, element: HTMLElement) => void
}

export function handleArrowNavigation(
  e: KeyboardEvent,
  options: KeyboardNavigationOptions
): number {
  const { items, currentIndex, loop = true, orientation = 'both', onNavigate } = options

  if (items.length === 0) return currentIndex

  const isVertical = orientation === 'vertical' || orientation === 'both'
  const isHorizontal = orientation === 'horizontal' || orientation === 'both'

  let nextIndex = currentIndex

  switch (e.key) {
    case 'ArrowDown':
      if (isVertical) {
        e.preventDefault()
        nextIndex = loop
          ? (currentIndex + 1) % items.length
          : Math.min(currentIndex + 1, items.length - 1)
      }
      break
    case 'ArrowUp':
      if (isVertical) {
        e.preventDefault()
        nextIndex = loop
          ? (currentIndex - 1 + items.length) % items.length
          : Math.max(currentIndex - 1, 0)
      }
      break
    case 'ArrowRight':
      if (isHorizontal) {
        e.preventDefault()
        nextIndex = loop
          ? (currentIndex + 1) % items.length
          : Math.min(currentIndex + 1, items.length - 1)
      }
      break
    case 'ArrowLeft':
      if (isHorizontal) {
        e.preventDefault()
        nextIndex = loop
          ? (currentIndex - 1 + items.length) % items.length
          : Math.max(currentIndex - 1, 0)
      }
      break
    case 'Home':
      e.preventDefault()
      nextIndex = 0
      break
    case 'End':
      e.preventDefault()
      nextIndex = items.length - 1
      break
  }

  if (nextIndex !== currentIndex && items[nextIndex]) {
    items[nextIndex].focus()
    onNavigate?.(nextIndex, items[nextIndex])
  }

  return nextIndex
}

/**
 * Typeahead search for menus
 */
export function createTypeahead(
  items: HTMLElement[],
  getLabel: (el: HTMLElement) => string
): (char: string) => HTMLElement | null {
  let searchString = ''
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  return (char: string) => {
    if (searchTimeout) clearTimeout(searchTimeout)

    searchString += char.toLowerCase()

    searchTimeout = setTimeout(() => {
      searchString = ''
    }, 500)

    const match = items.find((item) =>
      getLabel(item).toLowerCase().startsWith(searchString)
    )

    return match || null
  }
}
