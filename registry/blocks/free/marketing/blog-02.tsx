import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { blogPosts } from '@/lib/placeholder-data'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { PlaceholderGradient } from '@/components/ui/placeholder-gradient'
import { BlogPostCard } from '@/components/ui/blog-post-card'
import type { BlogPost } from '@/components/ui/blog-post-card'

type Blog02Props = {
  eyebrow?: string
  title?: string
  description?: string
  featuredPost?: BlogPost
  posts?: BlogPost[]
  showHeader?: boolean
  class?: string
}

const defaultFeaturedPost: BlogPost = { ...blogPosts[0] }
const defaultPosts: BlogPost[] = blogPosts.slice(1, 4).map((p) => ({ ...p }))

export const Blog02: FC<Blog02Props> = ({
  eyebrow = 'Blog',
  title = 'Recent blog posts',
  description = 'The latest thinking from our team on design, engineering, and product.',
  featuredPost = defaultFeaturedPost,
  posts = defaultPosts,
  showHeader = true,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
            <p class="max-w-lg text-base text-foreground-muted">
              {description}
            </p>
          )}
        </div>
      )}

      <a
        href={featuredPost.href}
        class={cn('group grid items-center gap-8 lg:grid-cols-2 lg:gap-12', showHeader && 'mt-12')}
      >
        {featuredPost.image ? (
          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            class="aspect-[16/10] w-full rounded-xl object-cover"
          />
        ) : (
          <PlaceholderGradient
            variant={1}
            class="aspect-[16/10] w-full rounded-xl"
          />
        )}
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <Badge variant="outline">{featuredPost.category}</Badge>
            {featuredPost.readTime && (
              <span class="text-sm text-foreground-soft">
                {featuredPost.readTime}
              </span>
            )}
          </div>
          <h3 class="text-2xl tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
            {featuredPost.title}
          </h3>
          <p class="text-base text-foreground-muted line-clamp-3">
            {featuredPost.excerpt}
          </p>
          <div class="mt-1 flex items-center gap-3">
            <Avatar class="size-8">
              {featuredPost.author.avatar ? (
                <AvatarImage
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                />
              ) : null}
              <AvatarFallback>
                {featuredPost.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div class="flex items-center gap-2 text-sm">
              <span class="font-medium text-foreground">
                {featuredPost.author.name}
              </span>
              <span class="text-foreground-soft">&middot;</span>
              <span class="text-foreground-soft">{featuredPost.date}</span>
            </div>
          </div>
        </div>
      </a>

      {posts.length > 0 && (
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogPostCard
              key={index}
              post={post}
              gradientVariant={((index % 4) + 2) as 1 | 2 | 3 | 4}
            />
          ))}
        </div>
      )}
    </div>
  </section>
)

export default Blog02
