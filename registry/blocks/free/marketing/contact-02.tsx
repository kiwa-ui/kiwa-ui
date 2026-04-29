import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { getButtonClasses } from '@/components/ui/button'
import { DisplayCard } from '@/components/ui/display-card'
import { MailIcon, MapPinIcon, PhoneIcon } from '@/components/ui/icon'

type ContactItem = {
  icon: 'email' | 'phone' | 'location'
  title: string
  description: string
  value: string
  href?: string
}

export type Contact02Props = {
  eyebrow?: string
  title?: string
  description?: string
  items?: ContactItem[]
  footerTitle?: string
  footerDescription?: string
  footerCta?: {
    label: string
    href: string
  }
  showHeader?: boolean
  class?: string
}

const defaultItems: ContactItem[] = [
  {
    icon: 'email',
    title: 'Email',
    description: 'Our team is here to help.',
    value: 'hello@kiwaui.com',
    href: 'mailto:hello@kiwaui.com',
  },
  {
    icon: 'phone',
    title: 'Phone',
    description: 'Mon-Fri from 8am to 5pm.',
    value: '+1 (555) 000-0000',
    href: 'tel:+15550000000',
  },
  {
    icon: 'location',
    title: 'Office',
    description: 'Come say hello at our HQ.',
    value: '430 Madison Ave, NY 10022',
  },
]

const icons = {
  email: <MailIcon class="size-4" />,
  phone: <PhoneIcon class="size-4" />,
  location: <MapPinIcon class="size-4" />,
}

export const Contact02: FC<Contact02Props> = ({
  eyebrow = 'Contact',
  title = 'Get in touch',
  description = 'Reach out through any of the channels below and our team will respond promptly.',
  items = defaultItems,
  footerTitle = 'Need more help?',
  footerDescription = 'Browse our guides and resources to find answers fast.',
  footerCta = { label: 'View documentation', href: '#' },
  showHeader = true,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {showHeader && (
        <div class="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
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

      <div class={cn('mx-auto grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3', showHeader && 'mt-12')}>
        {items.map((item, i) => (
          <DisplayCard key={i} class="p-6">
            <div class="flex flex-col gap-3">
              <div class="flex size-9 items-center justify-center rounded-lg bg-muted shadow">
                {icons[item.icon]}
              </div>
              <div class="flex flex-col gap-2">
                <h3 class="tracking-tight">{item.title}</h3>
                <p class="text-sm text-foreground-muted">{item.description}</p>
              </div>
              {item.href ? (
                <a
                  href={item.href}
                  class="text-sm font-medium text-primary hover:underline"
                >
                  {item.value}
                </a>
              ) : (
                <p class="text-sm font-medium text-primary">{item.value}</p>
              )}
            </div>
          </DisplayCard>
        ))}
      </div>

      <div class="mx-auto mt-3 max-w-3xl rounded-2xl bg-muted p-8 shadow-sm sm:p-10">
        <div class="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
          <h3 class="text-lg tracking-tight">
            {footerTitle}
          </h3>
          <p class="text-sm text-foreground-muted">
            {footerDescription}
          </p>
          <div class="mt-2 w-full sm:w-auto">
            <a
              href={footerCta.href}
              class={cn(getButtonClasses('outline'), 'w-full sm:w-auto')}
            >
              {footerCta.label}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default Contact02
