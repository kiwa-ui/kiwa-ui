import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { PlaceholderGradient } from '@/components/ui/placeholder-gradient'
import { ArrowRightIcon } from '@/components/ui/icon'

export type BlogPost = {
  title: string
  excerpt: string
  category: string
  date: string
  readTime?: string
  image?: string
  href: string
  author: {
    name: string
    avatar?: string
    role?: string
  }
}

type BlogPostCardProps = {
  post: BlogPost
  variant?: 'default' | 'horizontal' | 'simple' | 'overlay'
  gradientVariant?: 1 | 2 | 3 | 4
  class?: string
}

export const BlogPostCard: FC<BlogPostCardProps> = ({
  post,
  variant = 'default',
  gradientVariant = 1,
  class: className,
}) => {
  if (variant === 'simple') {
    return (
      <a
        href={post.href}
        class={cn(
          'group flex flex-col justify-between rounded-2xl bg-card p-6 shadow-md transition-shadow hover:shadow-lg',
          className
        )}
      >
        <div class="flex flex-col gap-3">
          <span class="text-sm text-foreground-soft">{post.date}</span>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg tracking-tight text-foreground line-clamp-1">
              {post.title}
            </h3>
            <p class="text-sm text-foreground-muted line-clamp-2">
              {post.excerpt}
            </p>
          </div>
        </div>
        <div class="mt-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Avatar size="sm">
              {post.author.avatar ? (
                <AvatarImage
                  src={post.author.avatar}
                  alt={post.author.name}
                />
              ) : null}
              <AvatarFallback>
                {post.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div class="flex flex-col">
              <span class="text-sm font-medium text-foreground">
                {post.author.name}
              </span>
              {post.author.role && (
                <span class="text-xs text-foreground-soft">
                  {post.author.role}
                </span>
              )}
            </div>
          </div>
          <ArrowRightIcon class="size-4 text-foreground-muted transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </a>
    )
  }

  if (variant === 'overlay') {
    return (
      <a
        href={post.href}
        class={cn(
          'group relative flex overflow-hidden rounded-2xl',
          className
        )}
      >
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            class="aspect-[4/5] w-full object-cover sm:aspect-auto sm:h-full"
          />
        ) : (
          <PlaceholderGradient
            variant={gradientVariant}
            class="aspect-[4/5] w-full sm:aspect-auto sm:h-full"
          />
        )}
        <div
          class="absolute inset-0"
          style="background: linear-gradient(to top, var(--primary-active) 0%, color-mix(in oklch, var(--primary-active) 60%, transparent) 25%, color-mix(in oklch, var(--primary) 20%, transparent) 50%, transparent 75%)"
        />
        <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
          <div class="flex flex-col gap-2">
            <span class="text-sm text-primary-foreground/70">{post.date}</span>
            <h3 class="text-xl tracking-tight text-primary-foreground sm:text-2xl">
              {post.title}
            </h3>
          </div>
          <ArrowRightIcon class="size-5 shrink-0 text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </a>
    )
  }

  if (variant === 'horizontal') {
    return (
      <a
        href={post.href}
        class={cn('group flex flex-col gap-4 sm:flex-row sm:gap-6', className)}
      >
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            class="aspect-[16/10] w-full rounded-xl object-cover sm:aspect-[3/2] sm:w-48 sm:shrink-0"
          />
        ) : (
          <PlaceholderGradient
            variant={gradientVariant}
            class="aspect-[16/10] w-full rounded-xl sm:aspect-[3/2] sm:w-48 sm:shrink-0"
          />
        )}
        <div class="flex flex-1 flex-col justify-center gap-3">
          <span class="text-xs text-foreground-soft">{post.date}</span>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg tracking-tight text-foreground line-clamp-2">
              {post.title}
            </h3>
            <p class="text-sm text-foreground-muted line-clamp-1">
              {post.excerpt}
            </p>
          </div>
          <span class="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:underline">
            Read more
            <ArrowRightIcon class="size-3.5" />
          </span>
        </div>
      </a>
    )
  }

  return (
    <a
      href={post.href}
      class={cn('group flex flex-col gap-4', className)}
    >
      {post.image ? (
        <img
          src={post.image}
          alt={post.title}
          class="aspect-[16/10] w-full rounded-xl object-cover"
        />
      ) : (
        <PlaceholderGradient
          variant={gradientVariant}
          class="aspect-[16/10] w-full rounded-xl"
        />
      )}
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <Badge variant="outline">{post.category}</Badge>
          {post.readTime && (
            <span class="text-sm text-foreground-soft">{post.readTime}</span>
          )}
        </div>
        <div class="flex flex-col gap-2">
          <h3 class="text-lg tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {post.title}
          </h3>
          <p class="text-sm text-foreground-muted line-clamp-2">
            {post.excerpt}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Avatar size="xs">
            {post.author.avatar ? (
              <AvatarImage
                src={post.author.avatar}
                alt={post.author.name}
              />
            ) : null}
            <AvatarFallback>
              {post.author.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div class="flex items-center gap-2 text-sm">
            <span class="font-medium text-foreground">
              {post.author.name}
            </span>
            <span class="text-foreground-soft">&middot;</span>
            <span class="text-foreground-soft">{post.date}</span>
          </div>
        </div>
      </div>
    </a>
  )
}
