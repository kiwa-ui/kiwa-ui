import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { getButtonClasses } from '@/components/ui/button'
import { MenuIcon, XIcon } from '@/components/ui/icon'

type NavLink = {
  label: string
  href: string
}

type Nav02Props = {
  logo?: string
  logoHref?: string
  links?: NavLink[]
  loginText?: string
  loginHref?: string
  ctaText?: string
  ctaHref?: string
  class?: string
}

const defaultLinks: NavLink[] = [
  { label: 'Products', href: '#' },
  { label: 'Features', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'About', href: '#' },
]

export const Nav02: FC<Nav02Props> = ({
  logo = 'Kiwa UI',
  logoHref = '/',
  links = defaultLinks,
  loginText,
  loginHref = '#',
  ctaText = 'Get started',
  ctaHref = '#',
  class: className,
}) => (
  <nav data-collapsible class={cn('border-b border-b-border-subtle bg-background data-[state=open]:bg-card', className)}>
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-8">
        <a href={logoHref} class="text-lg font-semibold tracking-tight text-foreground">
          {logo}
        </a>
        <div class="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              href={link.href}
              class="inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden items-center gap-3 lg:flex">
          {loginText && (
            <a href={loginHref} class={getButtonClasses('ghost', 'sm')}>
              {loginText}
            </a>
          )}
          <a href={ctaHref} class={getButtonClasses('default', 'sm')}>
            {ctaText}
          </a>
        </div>

        <button
          data-collapsible-trigger
          class={cn(getButtonClasses('ghost', 'iconSm'), 'group lg:hidden')}
          aria-label="Toggle navigation"
        >
          <MenuIcon class="size-4 group-aria-expanded:hidden" />
          <XIcon class="hidden size-4 group-aria-expanded:block" />
        </button>
      </div>
    </div>

    {/* Mobile expanded menu */}
    <div data-collapsible-content hidden class="lg:hidden">
      <div class="border-t border-t-border-subtle">
        <div class="mx-auto max-w-6xl px-4 pb-4 pt-3 sm:px-6 lg:px-8">
          <div class="-mx-3 flex flex-col gap-1">
            {links.map((link) => (
              <a
                href={link.href}
                class="flex h-10 items-center rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div class="mt-4 flex flex-col gap-2">
            {loginText && (
              <a href={loginHref} class={cn(getButtonClasses('ghost', 'sm'), 'w-full')}>
                {loginText}
              </a>
            )}
            <a href={ctaHref} class={cn(getButtonClasses('default', 'sm'), 'w-full')}>
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
)

export default Nav02
