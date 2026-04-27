import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
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

type Faq02Props = {
  eyebrow?: string
  title?: string
  description?: string
  items?: FaqItem[]
  showHeader?: boolean
  class?: string
}

const defaultItems: FaqItem[] = [
  {
    question: 'What integrations do you support?',
    answer:
      'We connect with Slack, Jira, GitHub, Salesforce, HubSpot, and dozens more. Custom integrations are available through our webhook and API layer.',
  },
  {
    question: 'How is billing calculated?',
    answer:
      'Billing is per workspace on a monthly or annual cycle. Annual plans save 20%. You can add or remove seats at any time and only pay the prorated difference.',
  },
  {
    question: 'Can I change my plan later?',
    answer:
      'Yes. Upgrade, downgrade, or cancel at any time from your account settings. Changes take effect on your next billing cycle.',
  },
  {
    question: 'Is there a setup fee?',
    answer:
      'No setup fees. You only pay the subscription price listed on our pricing page. Enterprise plans include dedicated onboarding at no extra cost.',
  },
  {
    question: 'Do you offer a service level agreement?',
    answer:
      'All paid plans include a 99.9% uptime SLA. Enterprise plans come with a 99.99% SLA, dedicated account manager, and priority incident response.',
  },
  {
    question: 'Where are your servers located?',
    answer:
      'We run on a global edge network with data centers in North America, Europe, and Asia-Pacific. You can choose your primary data region during onboarding.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee on all paid plans. If you are not satisfied, contact support for a full refund with no questions asked.',
  },
  {
    question: 'Can I use it for client projects?',
    answer:
      'Yes. All plans allow commercial use. Agency and freelancer teams can manage multiple client workspaces from a single account.',
  },
]

export const Faq02: FC<Faq02Props> = ({
  eyebrow = 'FAQ',
  title = 'Frequently asked questions',
  description = 'Find answers to common questions about our product and billing.',
  items = defaultItems,
  showHeader = true,
  class: className,
}) => {
  const mid = Math.ceil(items.length / 2)
  const leftItems = items.slice(0, mid)
  const rightItems = items.slice(mid)

  return (
    <section class={cn('py-16 md:py-24', className)}>
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div class="mx-auto max-w-2xl text-center">
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

        <div class={cn('grid gap-8 lg:grid-cols-2 lg:gap-12', showHeader && 'mt-12')}>
          <Accordion type="single">
            {leftItems.map((item, index) => (
              <AccordionItem key={index} value={`faq-left-${index}`}>
                <AccordionTrigger class="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p class="text-foreground-muted">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Accordion type="single">
            {rightItems.map((item, index) => (
              <AccordionItem key={index} value={`faq-right-${index}`}>
                <AccordionTrigger class="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p class="text-foreground-muted">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default Faq02
