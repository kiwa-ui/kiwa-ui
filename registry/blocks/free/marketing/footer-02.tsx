import type { Child, FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@/components/ui/icon'

type LinkGroup = {
  title: string
  links: Array<{
    label: string
    href: string
  }>
}

type SocialLink = {
  name: string
  href: string
  icon: 'twitter' | 'github' | 'linkedin' | 'instagram' | 'facebook' | 'youtube'
}

type Footer02Props = {
  logo?: {
    src?: string
    alt?: string
    text?: string
  }
  tagline?: Child
  columns?: LinkGroup[]
  socialLinks?: SocialLink[]
  copyright?: Child
  bottomLinks?: Array<{
    label: string
    href: string
  }>
  class?: string
}

const isExternal = (href: string) => /^https?:/i.test(href)

const socialIcons: Record<SocialLink['icon'], FC> = {
  twitter: () => <TwitterIcon class="size-4" />,
  github: () => <GithubIcon class="size-4" />,
  linkedin: () => <LinkedInIcon class="size-4" />,
  instagram: () => <InstagramIcon class="size-4" />,
  facebook: () => <FacebookIcon class="size-4" />,
  youtube: () => <YoutubeIcon class="size-4" />,
}

const defaultColumns: LinkGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Documentation', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'License', href: '#' },
    ],
  },
]

const defaultSocialLinks: SocialLink[] = [
  { name: 'Twitter', href: '#', icon: 'twitter' },
  { name: 'GitHub', href: '#', icon: 'github' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
]

export const Footer02: FC<Footer02Props> = ({
  logo = { text: 'Logo' },
  tagline = 'Build faster, ship sooner. Modern tools for modern teams.',
  columns = defaultColumns,
  socialLinks = defaultSocialLinks,
  copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  bottomLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
  class: className,
}) => (
  <footer class={cn('border-t border-border-subtle bg-background', className)}>
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="lg:grid lg:grid-cols-3 lg:gap-8">
        <div>
          {logo?.src ? (
            <img src={logo.src} alt={logo.alt || 'Logo'} class="h-8 w-auto" />
          ) : (
            <span class="text-xl font-bold text-foreground">
              {logo?.text || 'Logo'}
            </span>
          )}
          {tagline && (
            <p class="mt-3 max-w-xs text-sm text-foreground-soft">{tagline}</p>
          )}
          {socialLinks && socialLinks.length > 0 && (
            <div class="mt-6 flex gap-4">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.icon]
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    class="text-foreground-soft transition-colors hover:text-foreground"
                    aria-label={social.name}
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          )}
        </div>
        <div class="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2 lg:mt-0">
          {columns.map((column, index) => (
            <div key={index}>
              <h3 class="text-sm tracking-tight text-foreground">
                {column.title}
              </h3>
              <ul class="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={isExternal(link.href) ? '_blank' : undefined}
                      rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}
                      class="text-sm text-foreground-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div class="mt-16 border-t border-border-subtle pt-8 md:flex md:items-center md:justify-between">
        <p class="text-xs text-foreground-soft">{copyright}</p>
        {bottomLinks && bottomLinks.length > 0 && (
          <div class="mt-4 flex flex-wrap gap-6 md:mt-0">
            {bottomLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={isExternal(link.href) ? '_blank' : undefined}
                rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}
                class="text-xs text-foreground-soft transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  </footer>
)

export default Footer02
