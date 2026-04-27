/**
 * Positioning utilities for popovers, tooltips, and dropdowns.
 */

export type Side = 'top' | 'right' | 'bottom' | 'left'
export type Align = 'start' | 'center' | 'end'

export interface PositionOptions {
  side?: Side
  align?: Align
  sideOffset?: number
  alignOffset?: number
}

export interface Position {
  top: number
  left: number
  side: Side
}

const VIEWPORT_PADDING = 8

/**
 * Prepare a floating element for measurement.
 * This ensures the element has proper layout before getBoundingClientRect() is called.
 * Returns a cleanup function to restore original styles.
 */
export function prepareForMeasurement(element: HTMLElement): () => void {
  const originalStyles = {
    position: element.style.position,
    top: element.style.top,
    left: element.style.left,
    visibility: element.style.visibility,
    display: element.style.display,
  }

  // Apply styles needed for accurate measurement. We intentionally do NOT
  // override `width` — the element's CSS determines its rendered width,
  // and overriding with `max-content` here would give a smaller measurement
  // than the final rendered size whenever the popover has a fixed width
  // class (e.g. `w-80`), causing the viewport clamp in calculatePosition()
  // to miss a right-edge clip.
  element.style.position = 'fixed'
  element.style.top = '0'
  element.style.left = '0'
  element.style.visibility = 'hidden'
  element.style.display = 'block'

  // Remove hidden attribute temporarily
  const wasHidden = element.hidden
  element.hidden = false

  return () => {
    element.style.position = originalStyles.position
    element.style.top = originalStyles.top
    element.style.left = originalStyles.left
    element.style.visibility = originalStyles.visibility
    element.style.display = originalStyles.display
    element.hidden = wasHidden
  }
}

/**
 * Calculate position for a floating element relative to a trigger.
 * Automatically flips if there's not enough space.
 */
export function calculatePosition(
  trigger: HTMLElement,
  content: HTMLElement,
  options: PositionOptions = {}
): Position {
  const { side = 'bottom', align = 'center', sideOffset = 4, alignOffset = 0 } = options

  const triggerRect = trigger.getBoundingClientRect()
  const contentRect = content.getBoundingClientRect()
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  let finalSide = side
  let top = 0
  let left = 0

  // Calculate initial position based on side
  const positions: Record<Side, { top: number; left: number }> = {
    top: {
      top: triggerRect.top - contentRect.height - sideOffset,
      left: triggerRect.left,
    },
    bottom: {
      top: triggerRect.bottom + sideOffset,
      left: triggerRect.left,
    },
    left: {
      top: triggerRect.top,
      left: triggerRect.left - contentRect.width - sideOffset,
    },
    right: {
      top: triggerRect.top,
      left: triggerRect.right + sideOffset,
    },
  }

  // Check if position fits, flip if needed
  const fits: Record<Side, boolean> = {
    top: positions.top.top >= VIEWPORT_PADDING,
    bottom: positions.bottom.top + contentRect.height <= viewport.height - VIEWPORT_PADDING,
    left: positions.left.left >= VIEWPORT_PADDING,
    right: positions.right.left + contentRect.width <= viewport.width - VIEWPORT_PADDING,
  }

  // Flip logic
  const flipMap: Record<Side, Side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }

  if (!fits[side] && fits[flipMap[side]]) {
    finalSide = flipMap[side]
  }

  const pos = positions[finalSide]
  top = pos.top
  left = pos.left

  // Apply alignment
  if (finalSide === 'top' || finalSide === 'bottom') {
    switch (align) {
      case 'start':
        left = triggerRect.left + alignOffset
        break
      case 'center':
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2 + alignOffset
        break
      case 'end':
        left = triggerRect.right - contentRect.width + alignOffset
        break
    }
  } else {
    switch (align) {
      case 'start':
        top = triggerRect.top + alignOffset
        break
      case 'center':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2 + alignOffset
        break
      case 'end':
        top = triggerRect.bottom - contentRect.height + alignOffset
        break
    }
  }

  // Clamp to viewport
  left = Math.max(VIEWPORT_PADDING, Math.min(left, viewport.width - contentRect.width - VIEWPORT_PADDING))
  top = Math.max(VIEWPORT_PADDING, Math.min(top, viewport.height - contentRect.height - VIEWPORT_PADDING))

  return { top, left, side: finalSide }
}

/**
 * Apply position to an element using fixed positioning
 */
export function applyPosition(element: HTMLElement, position: Position) {
  element.style.position = 'fixed'
  element.style.top = `${position.top}px`
  element.style.left = `${position.left}px`
  element.dataset.side = position.side
}

/**
 * Create a scroll/resize listener that calls onUpdate when scroll or resize happens.
 * Returns a cleanup function.
 */
export function createPositionUpdater(
  trigger: HTMLElement,
  content: HTMLElement,
  options: PositionOptions,
  onClose: () => void
): () => void {
  // Close on scroll (most common pattern for tooltips/popovers)
  const handleScroll = () => {
    onClose()
  }

  // Close on resize
  const handleResize = () => {
    onClose()
  }

  // Listen on window and all scrollable ancestors
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('scroll', handleScroll, true)
    window.removeEventListener('resize', handleResize)
  }
}
