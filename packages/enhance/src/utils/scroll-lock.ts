let lockCount = 0
const savedOverflows = new Map<HTMLElement, string>()

function getScrollableElements(): HTMLElement[] {
  const elements: HTMLElement[] = [document.body]
  const main = document.querySelector<HTMLElement>('.docs-browser-main-scroll')
  if (main) elements.push(main)
  return elements
}

export function lockScroll() {
  if (lockCount === 0) {
    for (const el of getScrollableElements()) {
      savedOverflows.set(el, el.style.overflow)
      el.style.overflow = 'hidden'
    }
  }
  lockCount++
}

export function unlockScroll() {
  lockCount--
  if (lockCount <= 0) {
    lockCount = 0
    for (const [el, saved] of savedOverflows) {
      el.style.overflow = saved
    }
    savedOverflows.clear()
  }
}
