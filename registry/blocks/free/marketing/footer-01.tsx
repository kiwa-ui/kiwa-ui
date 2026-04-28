import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  XLogoIcon,
  YoutubeIcon,
} from '@/components/ui/social-icon'

type NavLink = {
  label: string
  href: string
}

type SocialLink = {
  name: string
  href: string
  icon: 'twitter' | 'github' | 'linkedin' | 'instagram' | 'facebook' | 'youtube'
}

type Footer01Props = {
  logo?: {
    src?: string
    alt?: string
    text?: string
  }
  links?: NavLink[]
  socialLinks?: SocialLink[]
  copyright?: string
  class?: string
}

const socialIcons: Record<SocialLink['icon'], FC> = {
  twitter: () => <XLogoIcon class="size-4" />,
  x: () => <XLogoIcon class="size-4" />,
  github: () => <GithubIcon class="size-4" />,
  linkedin: () => <LinkedInIcon class="size-4" />,
  instagram: () => <InstagramIcon class="size-4" />,
  facebook: () => <FacebookIcon class="size-4" />,
  youtube: () => <YoutubeIcon class="size-4" />,
}

const defaultLinks: NavLink[] = [
  { label: 'Features', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Docs', href: '#' },
  { label: 'Contact', href: '#' },
]

const defaultSocialLinks: SocialLink[] = [
  { name: 'Twitter', href: '#', icon: 'twitter' },
  { name: 'GitHub', href: '#', icon: 'github' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
]

export const Footer01: FC<Footer01Props> = ({
  logo = { text: 'Logo' },
  links = defaultLinks,
  socialLinks = defaultSocialLinks,
  copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  class: className,
}) => (
  <footer class={cn('border-t border-border-subtle bg-background', className)}>
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div class="flex items-center">
          {logo?.src ? (
            <img src={logo.src} alt={logo.alt || 'Logo'} class="h-8 w-auto" />
          ) : (
            <span class="text-xl font-bold text-foreground">
              {logo?.text || 'Logo'}
            </span>
          )}
        </div>
        <nav class="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              class="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div class="mt-12 border-t border-border-subtle pt-8 md:flex md:items-center md:justify-between">
        <p class="text-xs text-foreground-soft">{copyright}</p>
        {socialLinks && socialLinks.length > 0 && (
          <div class="mt-4 flex items-center gap-4 md:mt-0">
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
    </div>
  </footer>
)

export default Footer01
