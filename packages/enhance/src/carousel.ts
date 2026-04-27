/**
 * Initialize carousel functionality for all [data-carousel] elements.
 * Supports infinite scrolling by cloning slides (default) or bounded scrolling.
 *
 * Usage:
 * ```html
 * <!-- Infinite carousel (default) -->
 * <section data-carousel>
 *   <button data-carousel-prev>Previous</button>
 *   <button data-carousel-next>Next</button>
 *   <div data-carousel-viewport>
 *     <div data-carousel-track>
 *       <div data-carousel-slide>Slide 1</div>
 *       <div data-carousel-slide>Slide 2</div>
 *     </div>
 *   </div>
 *   <div data-carousel-dots>
 *     <button data-carousel-dot="0"></button>
 *     <button data-carousel-dot="1"></button>
 *   </div>
 * </section>
 *
 * <!-- Bounded carousel (stops at ends) -->
 * <section data-carousel data-carousel-loop="false">
 *   ...
 * </section>
 *
 * <!-- Auto-scrolling carousel with dimmed inactive slides -->
 * <section data-carousel data-carousel-autoplay="4000" data-carousel-dim>
 *   ...
 * </section>
 * ```
 */

export function carousel() {
  const carousels = document.querySelectorAll<HTMLElement>('[data-carousel]')

  carousels.forEach((container) => {
    const track = container.querySelector<HTMLElement>('[data-carousel-track]')
    const originalSlides = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-slide]')
    )
    const prevBtn = container.querySelector<HTMLElement>('[data-carousel-prev]')
    const nextBtn = container.querySelector<HTMLElement>('[data-carousel-next]')
    const dots = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-dot]')
    )

    if (!track || originalSlides.length === 0) return

    const slideCount = originalSlides.length
    const isInfinite = container.dataset.carouselLoop !== 'false'
    const isDim = container.dataset.carouselDim !== undefined
    const autoplayInterval = parseInt(container.dataset.carouselAutoplay || '0', 10)
    let currentIndex = 0

    if (isInfinite) {
      // Clone slides for infinite scroll effect
      // Add clones at the end (for scrolling forward)
      originalSlides.forEach((slide) => {
        const clone = slide.cloneNode(true) as HTMLElement
        clone.setAttribute('data-carousel-clone', 'true')
        track.appendChild(clone)
      })

      // Add clones at the beginning (for scrolling backward)
      for (let i = slideCount - 1; i >= 0; i--) {
        const clone = originalSlides[i].cloneNode(true) as HTMLElement
        clone.setAttribute('data-carousel-clone', 'true')
        track.insertBefore(clone, track.firstChild)
      }
    }

    const getSlideWidth = () => {
      const slide = originalSlides[0]
      if (!slide) return 0
      const trackStyle = window.getComputedStyle(track)
      const gap = parseFloat(trackStyle.gap) || 0
      return slide.offsetWidth + gap
    }

    const updateDots = () => {
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.remove('bg-foreground-soft/30')
          dot.classList.add('bg-foreground')
        } else {
          dot.classList.remove('bg-foreground')
          dot.classList.add('bg-foreground-soft/30')
        }
      })
    }

    const updateDim = () => {
      if (!isDim) return
      const allSlides = Array.from(track.children) as HTMLElement[]
      // Highlight the visually centered card (1 ahead of the left-aligned current)
      const centerPos = (isInfinite ? currentIndex + slideCount : currentIndex) + 1
      allSlides.forEach((slide, i) => {
        slide.style.opacity = i === centerPos ? '1' : '0.3'
        slide.style.transition = 'opacity 300ms ease-out'
      })
    }

    // Set initial position (accounts for prepended clones in infinite mode)
    const setInitialPosition = () => {
      if (isInfinite) {
        goToSlide(0, false)
      } else {
        track.style.transform = 'translateX(0)'
        track.style.transition = 'transform 300ms ease-out'
      }
    }

    const goToSlide = (index: number, animate = true) => {
      currentIndex = index
      const slideWidth = getSlideWidth()

      let offset: number
      if (isInfinite) {
        // Offset by slideCount because we prepended clones
        offset = (currentIndex + slideCount) * slideWidth
        // When dimming, center the middle visible card in the viewport
        if (isDim) {
          const viewport = container.querySelector<HTMLElement>('[data-carousel-viewport]')
          const viewportWidth = viewport?.offsetWidth ?? container.offsetWidth
          const cardWidth = originalSlides[0]?.offsetWidth ?? 0
          offset += slideWidth - (viewportWidth - cardWidth) / 2
        }
      } else {
        offset = currentIndex * slideWidth
      }

      if (!animate) {
        track.style.transition = 'none'
      }
      track.style.transform = `translateX(-${offset}px)`

      if (!animate) {
        // Force reflow
        track.offsetHeight
        track.style.transition = 'transform 300ms ease-out'
      }

      updateDots()
      updateDim()
    }

    const handleTransitionEnd = () => {
      if (!isInfinite) return

      // If we've scrolled to a clone, jump to the real slide
      if (currentIndex < 0) {
        goToSlide(slideCount - 1, false)
      } else if (currentIndex >= slideCount) {
        goToSlide(0, false)
      }
    }

    const goToPrev = () => {
      if (isInfinite) {
        currentIndex--
        goToSlide(currentIndex)
      } else {
        // Bounded: stop at start
        if (currentIndex > 0) {
          currentIndex--
          goToSlide(currentIndex)
        }
      }
    }

    const goToNext = () => {
      if (isInfinite) {
        currentIndex++
        goToSlide(currentIndex)
      } else {
        // Bounded: stop at end
        if (currentIndex < slideCount - 1) {
          currentIndex++
          goToSlide(currentIndex)
        }
      }
    }

    // Listen for transition end to handle infinite loop
    track.addEventListener('transitionend', handleTransitionEnd)

    // Button click handlers
    prevBtn?.addEventListener('click', goToPrev)
    nextBtn?.addEventListener('click', goToNext)

    // Dot click handlers
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.carouselDot || '0', 10)
        currentIndex = index
        goToSlide(currentIndex)
      })
    })

    // Keyboard navigation
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    })

    // Auto-play with optional progress bar
    if (autoplayInterval > 0) {
      const progressBar = container.querySelector<HTMLElement>('[data-carousel-progress]')
      const duration = `${autoplayInterval}ms`

      const resetProgress = () => {
        if (!progressBar) return
        progressBar.style.transition = 'none'
        progressBar.style.width = '0%'
        progressBar.offsetHeight // force reflow
        progressBar.style.transition = `width ${duration} linear`
        progressBar.style.width = '100%'
      }

      const advance = () => {
        goToNext()
        resetProgress()
      }

      let timer = setInterval(advance, autoplayInterval)
      resetProgress()

      container.addEventListener('mouseenter', () => {
        clearInterval(timer)
        if (progressBar) {
          const w = progressBar.offsetWidth
          progressBar.style.transition = 'none'
          progressBar.style.width = `${w}px`
        }
      })
      container.addEventListener('mouseleave', () => {
        timer = setInterval(advance, autoplayInterval)
        resetProgress()
      })
    }

    // Initialize
    setInitialPosition()
    updateDots()
    updateDim()
  })
}
