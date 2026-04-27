import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { blogPosts } from '@/lib/placeholder-data'
import { BlogPostCard } from '@/components/ui/blog-post-card'
import type { BlogPost } from '@/components/ui/blog-post-card'

type Blog01Props = {
  eyebrow?: string
  title?: string
  description?: string
  posts?: BlogPost[]
  showHeader?: boolean
  class?: string
}

const defaultPosts: BlogPost[] = blogPosts.slice(0, 6).map((p) => ({ ...p }))

export const Blog01: FC<Blog01Props> = ({
  eyebrow = 'Blog',
  title = 'Latest articles',
  description = 'Insights, guides, and updates from our team to help you build better products.',
  posts = defaultPosts,
  showHeader = true,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
      <div class={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', showHeader && 'mt-12')}>
        {posts.map((post, index) => (
          <BlogPostCard
            key={index}
            post={post}
            variant="simple"
          />
        ))}
      </div>
    </div>
  </section>
)

export default Blog01
