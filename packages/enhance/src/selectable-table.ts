/**
 * Initialize selectable table rows for all [data-selectable-table] elements.
 *
 * Listens for checkbox changes inside table rows and toggles
 * data-state="selected" on the parent <tr>. Also handles
 * "select all" checkbox in the table header.
 */

export function selectableTable() {
  const tables = document.querySelectorAll<HTMLElement>('[data-selectable-table]')

  tables.forEach((table) => {
    const headerCheckbox = table.querySelector<HTMLInputElement>(
      '[data-slot="table-header"] input[type="checkbox"]'
    )
    const getBodyCheckboxes = () =>
      Array.from(
        table.querySelectorAll<HTMLInputElement>(
          '[data-slot="table-body"] input[type="checkbox"]'
        )
      )

    const updateHeaderCheckbox = () => {
      if (!headerCheckbox) return
      const boxes = getBodyCheckboxes()
      const checkedCount = boxes.filter((cb) => cb.checked).length
      headerCheckbox.checked = boxes.length > 0 && checkedCount === boxes.length
      headerCheckbox.indeterminate = checkedCount > 0 && checkedCount < boxes.length
    }

    // Body checkbox change → toggle row state
    table.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      if (target.type !== 'checkbox') return

      const row = target.closest<HTMLElement>('[data-slot="table-row"]')
      if (!row) return

      // Check if this is the header "select all" checkbox
      const isHeader = !!target.closest('[data-slot="table-header"]')
      if (isHeader) {
        const boxes = getBodyCheckboxes()
        boxes.forEach((cb) => {
          cb.checked = target.checked
          const r = cb.closest<HTMLElement>('[data-slot="table-row"]')
          if (r) r.dataset.state = target.checked ? 'selected' : ''
        })
        return
      }

      // Body row checkbox
      row.dataset.state = target.checked ? 'selected' : ''
      updateHeaderCheckbox()
    })

    // Initialize header state
    updateHeaderCheckbox()
  })
}
