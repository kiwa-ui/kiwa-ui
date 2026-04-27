import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
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

type Pricing02Props = {
  eyebrow?: string
  title: string
  description?: string
  tiers?: PricingTier[]
  showHeader?: boolean
  class?: string
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Starter',
    description: 'For individuals and small projects.',
    price: '$0',
    priceDescription: '/month',
    features: [
      'Up to 5 projects',
      '1GB storage',
      'Community support',
      'Basic analytics',
    ],
    cta: { label: 'Get started', href: '#' },
  },
  {
    name: 'Pro',
    description: 'For growing teams that need more power.',
    price: '$29',
    priceDescription: '/month',
    features: [
      'Unlimited projects',
      '100GB storage',
      'Priority support',
      'Advanced analytics',
    ],
    cta: { label: 'Upgrade to Pro', href: '#' },
    highlighted: true,
  },
]

export const Pricing02: FC<Pricing02Props> = ({
  eyebrow = 'Pricing',
  title = 'Simple, transparent pricing',
  description = 'Start free and upgrade as your team grows.',
  tiers = defaultTiers,
  showHeader = true,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
            <p class="text-base text-foreground-muted">
              {description}
            </p>
          )}
        </div>
      )}
      <div class={cn('grid gap-6 lg:grid-cols-2', showHeader && 'mt-16')}>
        {tiers.map((tier, index) => (
          <DisplayCard
            key={index}
            variant={tier.highlighted ? 'primary' : 'default'}
            class="flex flex-col gap-6"
          >
            <div>
              <h3 class={cn(
                'text-lg',
                tier.highlighted && 'text-primary-foreground',
              )}>
                {tier.name}
              </h3>
              {tier.description && (
                <p class={cn(
                  'mt-1 text-sm',
                  tier.highlighted ? 'text-primary-soft' : 'text-foreground-muted',
                )}>
                  {tier.description}
                </p>
              )}
            </div>
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
            <a
              href={tier.cta.href}
              class={cn(
                getButtonClasses('outline', 'default'),
                'w-full',
              )}
            >
              {tier.cta.label}
            </a>
            <div class="flex flex-col gap-3">
              <p class={cn(
                'text-sm font-medium',
                tier.highlighted ? 'text-primary-foreground' : 'text-foreground',
              )}>
                What's included
              </p>
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
          </DisplayCard>
        ))}
      </div>
    </div>
  </section>
)

export default Pricing02
