/**
 * ARIA utilities for accessibility.
 */

let idCounter = 0

/**
 * Generate a unique ID for ARIA relationships.
 */
export function generateId(prefix = 'kiwa-ui'): string {
  return `${prefix}-${++idCounter}`
}

/**
 * Set up ARIA relationship between trigger and content.
 */
export function linkAriaControls(trigger: HTMLElement, content: HTMLElement): string {
  let contentId = content.id
  if (!contentId) {
    contentId = generateId('content')
    content.id = contentId
  }
  trigger.setAttribute('aria-controls', contentId)
  return contentId
}

/**
 * Set up ARIA describedby relationship.
 */
export function linkAriaDescribedby(element: HTMLElement, description: HTMLElement): string {
  let descId = description.id
  if (!descId) {
    descId = generateId('desc')
    description.id = descId
  }
  element.setAttribute('aria-describedby', descId)
  return descId
}

/**
 * Set up ARIA labelledby relationship.
 */
export function linkAriaLabelledby(element: HTMLElement, label: HTMLElement): string {
  let labelId = label.id
  if (!labelId) {
    labelId = generateId('label')
    label.id = labelId
  }
  element.setAttribute('aria-labelledby', labelId)
  return labelId
}

/**
 * Update expanded state on trigger and content.
 */
export function setExpanded(trigger: HTMLElement, content: HTMLElement, expanded: boolean) {
  trigger.setAttribute('aria-expanded', String(expanded))
  content.setAttribute('data-state', expanded ? 'open' : 'closed')
  content.hidden = !expanded
}

/**
 * Set hidden state on sibling elements for modal dialogs.
 */
export function setAriaHiddenSiblings(container: HTMLElement, hidden: boolean) {
  const siblings = Array.from(document.body.children).filter(
    (el) => el !== container && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'
  )

  siblings.forEach((sibling) => {
    if (hidden) {
      const currentHidden = sibling.getAttribute('aria-hidden')
      if (currentHidden !== 'true') {
        sibling.setAttribute('data-aria-hidden-by-modal', currentHidden || '')
        sibling.setAttribute('aria-hidden', 'true')
      }
    } else {
      const previousValue = sibling.getAttribute('data-aria-hidden-by-modal')
      sibling.removeAttribute('data-aria-hidden-by-modal')
      if (previousValue) {
        sibling.setAttribute('aria-hidden', previousValue)
      } else {
        sibling.removeAttribute('aria-hidden')
      }
    }
  })
}
