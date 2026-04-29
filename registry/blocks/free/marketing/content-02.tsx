import type { FC, Child } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { blogPosts } from '@/lib/placeholder-data'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PlaceholderGradient } from '@/components/ui/placeholder-gradient'

type Author = {
  name: string
  role?: string
  avatar?: string
}

type Content02Props = {
  meta?: string
  title?: string
  categories?: string[]
  image?: string
  author?: Author
  children?: Child
  showHeader?: boolean
  class?: string
}

const defaultAuthor: Author = {
  name: blogPosts[0].author.name,
  role: blogPosts[0].author.role,
  avatar: blogPosts[0].author.avatar,
}

export const Content02: FC<Content02Props> = ({
  meta = 'Jan 20, 2025 · 6 min read',
  title = 'Designing components that scale with your team',
  categories = ['Design', 'Engineering'],
  image,
  author = defaultAuthor,
  children,
  showHeader = true,
  class: className,
}) => (
  <article class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      {showHeader && (
        <header class="flex flex-col items-start gap-4">
          <p class="text-xs text-foreground-soft">{meta}</p>
          <h1 class="text-3xl tracking-tight sm:text-4xl">
            {title}
          </h1>
          {categories.length > 0 && (
            <div class="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge variant="outline">{category}</Badge>
              ))}
            </div>
          )}
        </header>
      )}

      <div class={cn(showHeader && 'mt-12')}>
        {image ? (
          <img
            src={image}
            alt=""
            class="aspect-video w-full rounded-2xl object-cover shadow-md"
          />
        ) : (
          <PlaceholderGradient
            variant={2}
            class="aspect-video w-full"
          />
        )}
      </div>

      <div class="mt-12 flex flex-col gap-6">
        {children || (
          <>
            <p class="text-base text-foreground-muted">
              When your design system grows beyond a handful of components,
              consistency becomes the hardest part of the job. Patterns drift,
              tokens get overridden, and every new feature ends up reinventing
              the wheel.
            </p>
            <p class="text-base text-foreground-muted">
              The teams that scale well treat their components like a product:
              versioned, documented, and shaped by the engineers who use them
              every day. The result is a library that feels inevitable rather
              than imposed.
            </p>
            <h3 class="text-xl tracking-tight text-foreground">
              Start with the primitives
            </h3>
            <p class="text-base text-foreground-muted">
              Buttons, inputs, cards, dialogs — get these right and the rest
              falls into place. Spend the time defining their variants and
              states upfront so consumers never have to override them later.
            </p>
            <blockquote class="border-l-2 border-border pl-4 text-base italic text-foreground">
              "The best component library is the one your team actually
              uses — not the one with the most features."
            </blockquote>
            <p class="text-base text-foreground-muted">
              Every block in Kiwa UI is built on top of the same primitives.
              That's how a 90-block marketing library stays coherent without
              feeling repetitive.
            </p>
          </>
        )}
      </div>

      <Separator class="mt-12" />

      <div class="mt-8 flex items-center gap-3">
        <Avatar>
          {author.avatar ? (
            <AvatarImage src={author.avatar} alt={author.name} />
          ) : null}
          <AvatarFallback>
            {author.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div class="flex flex-col">
          <p class="text-sm font-medium text-foreground">{author.name}</p>
          {author.role && (
            <p class="text-xs text-foreground-soft">{author.role}</p>
          )}
        </div>
      </div>
    </div>
  </article>
)

export default Content02
