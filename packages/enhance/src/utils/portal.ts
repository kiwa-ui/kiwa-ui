/**
 * Move a floating element to <body> so its `position: fixed` coordinates
 * always resolve against the viewport, escaping any ancestor that
 * establishes a containing block (transform / translate / filter /
 * perspective / will-change / contain).
 *
 * Idempotent — safe to call on every open. Only reparents the first time.
 * Stores the original parent and insertion point so `returnFromPortal`
 * can move it back on close.
 */

type PortalOrigin = { parent: HTMLElement; next: ChildNode | null }

const portalOrigins = new WeakMap<HTMLElement, PortalOrigin>()

export function portalToBody(element: HTMLElement) {
  if (element.parentElement !== document.body) {
    portalOrigins.set(element, {
      parent: element.parentElement!,
      next: element.nextSibling,
    })
    document.body.appendChild(element)
  }
}

/**
 * Move a portaled element back to its original parent.
 * If the original parent has been disconnected (e.g. SPA navigation
 * removed it), the element is removed from the DOM entirely to prevent
 * orphaned copies from stacking up.
 */
export function returnFromPortal(element: HTMLElement) {
  const origin = portalOrigins.get(element)
  if (!origin) return

  portalOrigins.delete(element)

  if (origin.parent.isConnected) {
    origin.parent.insertBefore(element, origin.next)
  } else {
    element.remove()
  }
}
