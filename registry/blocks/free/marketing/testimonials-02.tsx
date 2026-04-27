import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { testimonials as placeholderTestimonials } from '@/lib/placeholder-data'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DisplayCard } from '@/components/ui/display-card'

type Testimonial = {
  quote: string
  author: {
    name: string
    title: string
    company: string
    avatar?: string
  }
}

type Testimonials02Props = {
  eyebrow?: string
  title?: string
  description?: string
  testimonials?: Testimonial[]
  showHeader?: boolean
  class?: string
}

const defaultTestimonials: Testimonial[] = placeholderTestimonials.slice(0, 6).map((t) => ({
  quote: t.quote,
  author: { ...t.author },
}))

export const Testimonials02: FC<Testimonials02Props> = ({
  eyebrow = 'Testimonials',
  title = 'What our customers say',
  description = 'Hear from the teams who build with us every day.',
  testimonials = defaultTestimonials,
  showHeader = true,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      {showHeader && (
        <div class="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <div class="flex flex-col gap-3">
            {eyebrow && (
              <p class="text-xs font-medium uppercase tracking-wide text-primary">
                {eyebrow}
              </p>
            )}
            <h2 class="text-3xl tracking-tight sm:text-4xl">
              {title}
            </h2>
          </div>
          {description && (
            <p class="max-w-lg text-base text-foreground-muted">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Grid */}
      <div class={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', showHeader && 'mt-16')}>
        {testimonials.map((testimonial, index) => (
          <DisplayCard key={index} class="flex flex-col gap-4">
            <p class="flex-1 text-sm text-foreground">
              "{testimonial.quote}"
            </p>
            <div class="flex items-center gap-3">
              <Avatar class="size-8">
                {testimonial.author.avatar ? (
                  <AvatarImage
                    src={testimonial.author.avatar}
                    alt={testimonial.author.name}
                  />
                ) : null}
                <AvatarFallback>
                  {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p class="text-sm font-semibold text-foreground">
                  {testimonial.author.name}
                </p>
                <p class="text-xs text-foreground-muted">
                  {testimonial.author.title}, {testimonial.author.company}
                </p>
              </div>
            </div>
          </DisplayCard>
        ))}
      </div>
    </div>
  </section>
)

export default Testimonials02
