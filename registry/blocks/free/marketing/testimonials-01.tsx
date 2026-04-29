import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { StarIcon } from '@/components/ui/icon'


type Testimonials01Props = {
  quote?: string
  author?: {
    name: string
    title: string
    company?: string
    avatar?: string
  }
  rating?: number
  class?: string
}


export const Testimonials01: FC<Testimonials01Props> = ({
  quote = 'Kiwa UI has completely transformed how we build landing pages. The components are beautiful, accessible, and just work.',
  author = {
    name: 'Sophie Reeves',
    title: 'VP of Engineering',
    company: 'TechFlow',
    avatar: '/public/avatars/sophie-reeves.jpg',
  },
  rating = 5,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <blockquote>
        <p class="text-xl font-medium text-foreground sm:text-2xl lg:text-3xl">
          "{quote}"
        </p>
      </blockquote>
      <div class="mt-8 flex flex-col items-center">
        <Avatar class="size-14">
          {author.avatar ? (
            <AvatarImage src={author.avatar} alt={author.name} />
          ) : null}
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div class="mt-4">
          <p class="text-lg font-semibold text-foreground">{author.name}</p>
          <p class="text-base text-foreground-muted">
            {author.title}
            {author.company && `, ${author.company}`}
          </p>
        </div>
        {rating !== undefined && (
          <div class="mt-4 flex gap-0.5 text-primary [&>svg]:size-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= rating} />
            ))}
          </div>
        )}
      </div>
    </div>
  </section>
)

export default Testimonials01
