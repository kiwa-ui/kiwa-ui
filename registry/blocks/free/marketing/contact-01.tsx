import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type Contact01Props = {
  eyebrow?: string
  title?: string
  description?: string
  showHeader?: boolean
  class?: string
}

export const Contact01: FC<Contact01Props> = ({
  eyebrow = 'Contact',
  title = 'Get in touch',
  description = "We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.",
  showHeader = true,
  class: className,
}) => (
  <section class={cn('py-16 md:py-24', className)}>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {showHeader && (
        <div class="mx-auto flex max-w-lg flex-col gap-4">
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
            <p class="max-w-md text-base text-foreground-muted">
              {description}
            </p>
          )}
        </div>
      )}

      <form class={cn('mx-auto flex max-w-lg flex-col gap-6', showHeader && 'mt-12')}>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-2">
            <Label for="first-name">First name</Label>
            <Input id="first-name" name="first-name" placeholder="First name" />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="last-name">Last name</Label>
            <Input id="last-name" name="last-name" placeholder="Last name" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@company.com" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Type your message here..."
            rows={4}
          />
        </div>

        <Button type="submit" class="w-full sm:w-auto">
          Send message
        </Button>
      </form>

      <div class="mx-auto mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-8">
        <div class="flex flex-col gap-2">
          <Label>Email</Label>
          <span class="text-sm text-foreground-muted">hello@kiwaui.com</span>
        </div>
        <div class="flex flex-col gap-2">
          <Label>Phone</Label>
          <span class="text-sm text-foreground-muted">+1 (555) 000-0000</span>
        </div>
        <div class="flex flex-col gap-2">
          <Label>Office</Label>
          <span class="text-sm text-foreground-muted">430 Madison Ave, NY 10022</span>
        </div>
        <div class="flex flex-col gap-2">
          <Label>Hours</Label>
          <span class="text-sm text-foreground-muted">Mon–Fri, 9am–5pm</span>
        </div>
      </div>
    </div>
  </section>
)

export default Contact01
