/**
 * Initialize date-picker functionality for all [data-date-picker] elements.
 *
 * Adds month navigation, day selection (single or range mode), keyboard
 * navigation, and today highlighting. The selected value is written to
 * hidden input(s) inside the picker and a `date-change` CustomEvent is
 * dispatched on every selection.
 */

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function formatMonth(year: number, month: number) {
  return new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

function isToday(year: number, month: number, day: number) {
  const now = new Date()
  return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day
}

function renderGrid(
  el: HTMLElement,
  year: number,
  month: number,
  value: string,
  valueEnd: string,
  mode: string,
  minDate: string,
  maxDate: string,
) {
  const grid = el.querySelector<HTMLElement>('[data-date-picker-grid]')
  const title = el.querySelector<HTMLElement>('[data-date-picker-title]')
  if (!grid || !title) return

  title.textContent = formatMonth(year, month)
  el.dataset.datePickerMonth = String(month)
  el.dataset.datePickerYear = String(year)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)

  const weeks: (number | null)[][] = []
  let week: (number | null)[] = Array(firstDay).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  let html = ''
  for (const w of weeks) {
    for (const day of w) {
      if (day === null) {
        html += '<div class="p-0.5"><div class="size-8"></div></div>'
        continue
      }
      const dateStr = toDateStr(year, month, day)
      const selected = value === dateStr || valueEnd === dateStr
      const today = isToday(year, month, day)
      const inRange = mode === 'range' && value && valueEnd && dateStr > value && dateStr < valueEnd
      const rangeStart = mode === 'range' && value === dateStr
      const rangeEnd = mode === 'range' && valueEnd === dateStr
      const disabled = (minDate && dateStr < minDate) || (maxDate && dateStr > maxDate)

      html += `<div class="p-0.5"><button type="button" data-date-picker-day="${dateStr}"${selected ? ' data-selected="true"' : ''}${today ? ' data-today="true"' : ''}${inRange ? ' data-in-range="true"' : ''}${rangeStart ? ' data-range-start="true"' : ''}${rangeEnd ? ' data-range-end="true"' : ''}${disabled ? ' data-disabled="true"' : ''} class="inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-4 outline-none data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary/90 data-[today=true]:font-semibold data-[in-range=true]:bg-muted data-[in-range=true]:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-30">${day}</button></div>`
    }
  }

  grid.innerHTML = html
}

export function datePicker() {
  const pickers = document.querySelectorAll<HTMLElement>('[data-date-picker]')

  pickers.forEach((el) => {
    const mode = el.dataset.datePickerMode || 'single'
    let currentMonth = Number(el.dataset.datePickerMonth)
    let currentYear = Number(el.dataset.datePickerYear)
    const minDate = el.dataset.datePickerMin || ''
    const maxDate = el.dataset.datePickerMax || ''

    const input = el.querySelector<HTMLInputElement>('[data-date-picker-input]')
    const inputEnd = el.querySelector<HTMLInputElement>('[data-date-picker-input-end]')
    const prevBtn = el.querySelector<HTMLElement>('[data-date-picker-prev]')
    const nextBtn = el.querySelector<HTMLElement>('[data-date-picker-next]')

    if (!input) return

    let value = input.value || ''
    let valueEnd = inputEnd?.value || ''
    let rangeStep: 'start' | 'end' = 'start'

    const dispatch = () => {
      el.dispatchEvent(
        new CustomEvent('date-change', {
          detail: { value, valueEnd, mode },
          bubbles: true,
        })
      )
    }

    const refresh = () => {
      renderGrid(el, currentYear, currentMonth, value, valueEnd, mode, minDate, maxDate)
    }

    const selectDate = (dateStr: string) => {
      if (mode === 'single') {
        value = dateStr
        input.value = value
        dispatch()
        refresh()
        return
      }

      // Range mode
      if (rangeStep === 'start') {
        value = dateStr
        valueEnd = ''
        input.value = value
        if (inputEnd) inputEnd.value = ''
        rangeStep = 'end'
      } else {
        if (dateStr < value) {
          // Clicked before start → reset
          value = dateStr
          valueEnd = ''
          input.value = value
          if (inputEnd) inputEnd.value = ''
          rangeStep = 'end'
        } else {
          valueEnd = dateStr
          if (inputEnd) inputEnd.value = valueEnd
          rangeStep = 'start'
        }
      }
      dispatch()
      refresh()
    }

    const goMonth = (delta: number) => {
      currentMonth += delta
      if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
      } else if (currentMonth > 11) {
        currentMonth = 0
        currentYear++
      }
      refresh()
    }

    // Event delegation for day clicks
    el.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-date-picker-day]')
      if (btn && !btn.dataset.disabled) {
        e.stopPropagation()
        selectDate(btn.dataset.datePickerDay!)
      }
    })

    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      goMonth(-1)
    })

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      goMonth(1)
    })

    // Keyboard navigation
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        focusAdjacentDay(el, -1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        focusAdjacentDay(el, 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        focusAdjacentDay(el, -7)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        focusAdjacentDay(el, 7)
      }
    })
  })
}

function focusAdjacentDay(picker: HTMLElement, offset: number) {
  const focused = picker.querySelector<HTMLElement>('[data-date-picker-day]:focus')
  if (!focused) return

  const days = Array.from(picker.querySelectorAll<HTMLElement>('[data-date-picker-day]'))
  const idx = days.indexOf(focused)
  const next = days[idx + offset]
  if (next) next.focus()
}
