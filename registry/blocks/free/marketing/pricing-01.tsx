import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DisplayCard } from '@/components/ui/display-card'
import { getButtonClasses } from '@/components/ui/button'
import { CheckIcon } from '@/components/ui/icon'

type PricingTier = {
  name: string
  description?: string
  price: string
  priceDescription?: string
  features: string[]
  cta: {
    label: string
    href: string
  }
  highlighted?: boolean
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Starter',
    description: 'For personal projects.',
    price: '$0',
    features: ['Up to 5 projects', '1GB storage', 'Community support'],
    cta: { label: 'Get started', href: '#' },
  },
  {
    name: 'Pro',
    description: 'For growing teams.',
    price: '$29',
    features: ['Unlimited projects', '100GB storage', 'Priority support'],
    cta: { label: 'Get started', href: '#' },
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations.',
    price: 'Custom',
    features: ['Dedicated support', 'Custom contracts', 'SLA guarantee'],
    cta: { label: 'Contact sales', href: '#' },
  },
]

type Pricing01Props = {
  eyebrow?: string
  title?: string
  description?: string
  tiers?: PricingTier[]
  showHeader?: boolean
  class?: string
}

export const Pricing01: FC<Pricing01Props> = ({
  eyebrow = 'Pricing',
  title = 'Simple, transparent pricing',
  description = 'Choose the plan that works for you',
  tiers = defaultTiers,
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
      <div class={cn('grid gap-4 lg:grid-cols-3', showHeader && 'mt-16')}>
        {tiers.map((tier, index) => (
          <DisplayCard
            key={index}
            variant={tier.highlighted ? 'primary' : 'default'}
            class="flex flex-col justify-between gap-6"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <h3 class={cn(
                  'text-lg',
                  tier.highlighted && 'text-primary-foreground',
                )}>
                  {tier.name}
                </h3>
                {tier.highlighted && (
                  <Badge>Popular</Badge>
                )}
              </div>
              {tier.description && (
                <p class={cn(
                  'text-sm',
                  tier.highlighted ? 'text-primary-soft' : 'text-foreground-muted',
                )}>
                  {tier.description}
                </p>
              )}
              <div class="flex items-baseline gap-1">
                <span class={cn(
                  'text-4xl font-semibold tracking-tight',
                  tier.highlighted && 'text-primary-foreground',
                )}>
                  {tier.price}
                </span>
                {tier.priceDescription && (
                  <span class={cn(
                    'text-sm font-normal',
                    tier.highlighted ? 'text-primary-soft' : 'text-foreground-muted',
                  )}>
                    {tier.priceDescription}
                  </span>
                )}
              </div>
              <ul class="space-y-3">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} class="flex items-start gap-3">
                    <CheckIcon class={cn(
                      'size-4 shrink-0',
                      tier.highlighted ? 'text-primary-soft' : 'text-primary',
                    )} />
                    <span class={cn(
                      'text-sm',
                      tier.highlighted ? 'text-primary-soft' : 'text-foreground-muted',
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={tier.cta.href}
              class={cn(
                getButtonClasses('outline', 'default'),
                'w-full',
              )}
            >
              {tier.cta.label}
            </a>
          </DisplayCard>
        ))}
      </div>
    </div>
  </section>
)

export default Pricing01
