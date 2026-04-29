import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { PlaceholderGradient } from '@/components/ui/placeholder-gradient'

type Content01Props = {
  eyebrow?: string
  title?: string
  description?: string
  paragraphs?: string[]
  image?: string
  imagePosition?: 'left' | 'right'
  showHeader?: boolean
  class?: string
}

const defaultParagraphs = [
  'We started Kiwa UI because we believe building beautiful, fast websites should be accessible to every team. The tools we had felt either too rigid or too complicated for the way modern teams ship.',
  'Today we work with thousands of designers and engineers across startups and enterprises, helping them launch polished products in hours instead of weeks. Everything we build is shaped by their feedback.',
]

export const Content01: FC<Content01Props> = ({
  eyebrow = 'About',
  title = 'Built for teams that ship',
  description = 'A small team obsessed with making the web a better place to build.',
  paragraphs = defaultParagraphs,
  image,
  imagePosition = 'right',
  showHeader = true,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div
        class={cn(
          'grid items-center gap-8 lg:grid-cols-2 lg:gap-16',
          imagePosition === 'left' && 'lg:[&>*:first-child]:order-2',
        )}
      >
        <div class="flex flex-col gap-6">
          {showHeader && (
            <div class="flex flex-col gap-4">
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
                <p class="text-base text-foreground-muted">{description}</p>
              )}
            </div>
          )}
          {paragraphs.length > 0 && (
            <div class="flex flex-col gap-4">
              {paragraphs.map((paragraph) => (
                <p class="text-base text-foreground-muted">{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          {image ? (
            <img
              src={image}
              alt=""
              class="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
            />
          ) : (
            <PlaceholderGradient
              variant={1}
              class="aspect-[4/3] w-full shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  </section>
)

export default Content01
