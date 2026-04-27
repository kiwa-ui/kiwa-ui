import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type DatePickerMode = 'single' | 'range'

type DatePickerProps = Omit<JSX.IntrinsicElements['div'], 'children'> & {
  name?: string
  nameEnd?: string
  value?: string
  valueEnd?: string
  mode?: DatePickerMode
  month?: number
  year?: number
  minDate?: string
  maxDate?: string
  placeholder?: string
  placeholderEnd?: string
}

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

export const DatePicker: FC<DatePickerProps> = ({
  name = 'date',
  nameEnd = 'date-end',
  value,
  valueEnd,
  mode = 'single',
  month: initialMonth,
  year: initialYear,
  minDate,
  maxDate,
  placeholder = 'Pick a date',
  placeholderEnd = 'End date',
  class: className,
  ...props
}) => {
  const now = new Date()
  const year = initialYear ?? (value ? new Date(value).getFullYear() : now.getFullYear())
  const month = initialMonth ?? (value ? new Date(value).getMonth() : now.getMonth())

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

  return (
    <div
      data-date-picker
      data-date-picker-mode={mode}
      data-date-picker-month={month}
      data-date-picker-year={year}
      {...(minDate ? { 'data-date-picker-min': minDate } : {})}
      {...(maxDate ? { 'data-date-picker-max': maxDate } : {})}
      class={cn('w-64 rounded-xl bg-card p-3 shadow-md', className)}
      {...props}
    >
      {/* Hidden inputs */}
      <input type="hidden" name={name} data-date-picker-input value={value || ''} />
      {mode === 'range' && (
        <input type="hidden" name={nameEnd} data-date-picker-input-end value={valueEnd || ''} />
      )}

      {/* Header with month navigation */}
      <div class="flex items-center justify-between px-1">
        <button
          type="button"
          data-date-picker-prev
          class={cn(
            'inline-flex size-7 items-center justify-center rounded-md text-foreground-muted',
            'hover:bg-secondary hover:text-foreground transition-colors outline-none',
            'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
          )}
          aria-label="Previous month"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span data-date-picker-title class="text-sm font-medium">
          {formatMonth(year, month)}
        </span>
        <button
          type="button"
          data-date-picker-next
          class={cn(
            'inline-flex size-7 items-center justify-center rounded-md text-foreground-muted',
            'hover:bg-secondary hover:text-foreground transition-colors outline-none',
            'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
          )}
          aria-label="Next month"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div class="mt-2 grid grid-cols-7 text-center">
        {DAYS.map((d) => (
          <div key={d} class="py-1 text-xs font-medium text-foreground-muted">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div data-date-picker-grid class="grid grid-cols-7 text-center">
        {weeks.map((w, wi) =>
          w.map((day, di) => {
            if (day === null) {
              return <div key={`e-${wi}-${di}`} class="p-0.5"><div class="size-8" /></div>
            }
            const dateStr = toDateStr(year, month, day)
            const selected = value === dateStr
            const selectedEnd = valueEnd === dateStr
            const today = isToday(year, month, day)
            const inRange = mode === 'range' && value && valueEnd && dateStr > value && dateStr < valueEnd

            return (
              <div key={dateStr} class="p-0.5">
                <button
                  type="button"
                  data-date-picker-day={dateStr}
                  data-selected={(selected || selectedEnd) ? 'true' : undefined}
                  data-today={today ? 'true' : undefined}
                  data-in-range={inRange ? 'true' : undefined}
                  data-range-start={mode === 'range' && selected ? 'true' : undefined}
                  data-range-end={mode === 'range' && selectedEnd ? 'true' : undefined}
                  class={cn(
                    'inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors',
                    'hover:bg-secondary hover:text-foreground',
                    'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px] outline-none',
                    'data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary/90',
                    'data-[today=true]:font-semibold',
                    'data-[in-range=true]:bg-muted data-[in-range=true]:text-foreground',
                    'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-30',
                  )}
                >
                  {day}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
