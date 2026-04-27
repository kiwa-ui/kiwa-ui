/**
 * Initialize slider functionality for all [data-slider] elements.
 *
 * Usage:
 * ```html
 * <div data-slider data-slider-min="0" data-slider-max="100" data-slider-value="50" data-slider-step="1">
 *   <div data-slider-track>
 *     <div data-slider-range></div>
 *     <div data-slider-thumb tabindex="0"></div>
 *   </div>
 * </div>
 * ```
 *
 * Options:
 * - data-slider-min: Minimum value (default: 0)
 * - data-slider-max: Maximum value (default: 100)
 * - data-slider-value: Initial value (default: 0)
 * - data-slider-step: Step increment (default: 1)
 * - data-slider-orientation: "horizontal" | "vertical" (default: "horizontal")
 */

interface SliderInstance {
  getValue: () => number
  setValue: (value: number) => void
  onChange: (callback: (value: number) => void) => void
}

export function slider(): SliderInstance[] {
  const sliders = document.querySelectorAll<HTMLElement>('[data-slider]')
  const instances: SliderInstance[] = []

  sliders.forEach((slider) => {
    const track = slider.querySelector<HTMLElement>('[data-slider-track]')
    const range = slider.querySelector<HTMLElement>('[data-slider-range]')
    const thumb = slider.querySelector<HTMLElement>('[data-slider-thumb]')

    if (!track || !thumb) return

    const min = Number(slider.dataset.sliderMin) || 0
    const max = Number(slider.dataset.sliderMax) || 100
    const step = Number(slider.dataset.sliderStep) || 1
    const orientation = slider.dataset.sliderOrientation || 'horizontal'
    const isVertical = orientation === 'vertical'

    let value = Number(slider.dataset.sliderValue) || min
    let isDragging = false

    // Set up ARIA
    slider.setAttribute('role', 'slider')
    slider.setAttribute('aria-valuemin', String(min))
    slider.setAttribute('aria-valuemax', String(max))
    slider.setAttribute('aria-valuenow', String(value))
    slider.setAttribute('aria-orientation', orientation)
    thumb.setAttribute('role', 'slider')
    thumb.setAttribute('aria-valuemin', String(min))
    thumb.setAttribute('aria-valuemax', String(max))

    const clamp = (val: number): number => {
      return Math.min(max, Math.max(min, val))
    }

    const roundToStep = (val: number): number => {
      const steps = Math.round((val - min) / step)
      return min + steps * step
    }

    const getPercentage = (val: number): number => {
      return ((val - min) / (max - min)) * 100
    }

    const updateValue = (newValue: number) => {
      value = clamp(roundToStep(newValue))
      slider.dataset.sliderValue = String(value)
      slider.setAttribute('aria-valuenow', String(value))
      thumb.setAttribute('aria-valuenow', String(value))

      const percentage = getPercentage(value)

      if (isVertical) {
        thumb.style.bottom = `${percentage}%`
        thumb.style.top = 'auto'
        if (range) {
          range.style.height = `${percentage}%`
          range.style.bottom = '0'
        }
      } else {
        thumb.style.left = `${percentage}%`
        if (range) {
          range.style.width = `${percentage}%`
        }
      }

      // Dispatch custom event
      slider.dispatchEvent(
        new CustomEvent('slider-change', {
          detail: { value },
          bubbles: true,
        })
      )
    }

    const getValueFromPosition = (clientX: number, clientY: number): number => {
      const rect = track.getBoundingClientRect()

      let percentage: number
      if (isVertical) {
        percentage = 1 - (clientY - rect.top) / rect.height
      } else {
        percentage = (clientX - rect.left) / rect.width
      }

      percentage = Math.max(0, Math.min(1, percentage))
      return min + percentage * (max - min)
    }

    // Mouse/touch drag
    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      slider.dataset.state = 'dragging'

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      updateValue(getValueFromPosition(clientX, clientY))
    }

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      updateValue(getValueFromPosition(clientX, clientY))
    }

    const handleDragEnd = () => {
      if (!isDragging) return
      isDragging = false
      slider.dataset.state = ''
    }

    // Add listeners to both track and thumb
    track.addEventListener('mousedown', handleDragStart)
    track.addEventListener('touchstart', handleDragStart, { passive: false })
    thumb.addEventListener('mousedown', (e) => {
      e.preventDefault()
      handleDragStart(e)
    })
    thumb.addEventListener('touchstart', (e) => {
      handleDragStart(e)
    }, { passive: false })
    
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('touchmove', handleDragMove, { passive: false })
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchend', handleDragEnd)

    // Keyboard navigation
    thumb.addEventListener('keydown', (e) => {
      const bigStep = step * 10

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault()
          updateValue(value + step)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault()
          updateValue(value - step)
          break
        case 'PageUp':
          e.preventDefault()
          updateValue(value + bigStep)
          break
        case 'PageDown':
          e.preventDefault()
          updateValue(value - bigStep)
          break
        case 'Home':
          e.preventDefault()
          updateValue(min)
          break
        case 'End':
          e.preventDefault()
          updateValue(max)
          break
      }
    })

    // Initialize
    updateValue(value)

    // Create instance
    let changeCallback: ((value: number) => void) | null = null
    
    const instance: SliderInstance = {
      getValue: () => value,
      setValue: (newValue: number) => updateValue(newValue),
      onChange: (callback: (value: number) => void) => {
        changeCallback = callback
        slider.addEventListener('slider-change', ((e: CustomEvent) => {
          callback(e.detail.value)
        }) as EventListener)
      },
    }
    
    instances.push(instance)
  })

  return instances
}
