import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { getButtonClasses } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DisplayCard } from '@/components/ui/display-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type FaqItem = {
  question: string
  answer: string
}

type Faq01Props = {
  eyebrow?: string
  title?: string
  description?: string
  items?: FaqItem[]
  supportText?: string
  supportCta?: {
    label: string
    href: string
  }
  supportAvatars?: string[]
  showHeader?: boolean
  class?: string
}

const defaultItems: FaqItem[] = [
  {
    question: 'How does the 14-day trial work?',
    answer:
      'You get unrestricted access to every feature from day one. No credit card is required to start, and you can upgrade or cancel at any point during the trial.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer:
      'Your data stays available for 30 days after cancellation. You can export everything as CSV or JSON at any time from account settings.',
  },
  {
    question: 'Do you offer discounts for nonprofits?',
    answer:
      'Yes. Verified nonprofit organizations receive 50% off all paid plans. Reach out to our sales team with proof of status to get started.',
  },
  {
    question: 'Can I invite my whole team?',
    answer:
      'Absolutely. Every plan includes unlimited team members. Admins can manage roles and permissions from the team dashboard.',
  },
  {
    question: 'Is there an API available?',
    answer:
      'Yes. Our REST API gives you full programmatic access to your account, data, and workflows. API docs and SDKs are available in the developer portal.',
  },
]

export const Faq01: FC<Faq01Props> = ({
  eyebrow = 'FAQ',
  title = 'Frequently asked questions',
  description = 'Everything you need to know about our platform',
  items = defaultItems,
  supportText = 'Still have questions?',
  supportCta = { label: 'Contact support', href: '#' },
  supportAvatars,
  showHeader = true,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      {showHeader && (
        <div class="text-center">
          <div class="flex flex-col gap-3">
            {eyebrow && (
              <p class="text-xs font-medium uppercase tracking-wide text-primary">
                {eyebrow}
              </p>
            )}
            <h2 class="text-3xl tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          </div>
          {description && (
            <p class="mx-auto mt-4 max-w-lg text-base text-foreground-muted">
              {description}
            </p>
          )}
        </div>
      )}

      <Accordion type="single" class={cn(showHeader && 'mt-12')}>
        {items.map((item, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger class="text-left text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p class="text-foreground-muted">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {(supportText || supportCta) && (
        <DisplayCard class="mt-12 items-center text-center">
          {supportAvatars && supportAvatars.length > 0 && (
            <div class="mb-4 flex justify-center -space-x-2">
              {supportAvatars.map((_, i) => (
                <Avatar key={i} class="size-10">
                  <AvatarFallback class="text-xs">?</AvatarFallback>
                </Avatar>
              ))}
            </div>
          )}
          {supportText && (
            <p class="text-lg font-medium text-foreground">{supportText}</p>
          )}
          {supportCta && (
            <a
              href={supportCta.href}
              class={cn(getButtonClasses('default', 'default'), 'mt-4')}
            >
              {supportCta.label}
            </a>
          )}
        </DisplayCard>
      )}
    </div>
  </section>
)

export default Faq01
