import type { FC } from 'hono/jsx'
import { cn } from '@/lib/utils'
import { PlaceholderLogo, type PlaceholderLogoMark } from '@/components/ui/placeholder-logo'

type Logo = {
  name: string
  logo?: string
  mark?: PlaceholderLogoMark
}

type SocialProof02Props = {
  title?: string
  logos?: Logo[]
  fluid?: boolean
  class?: string
}

const defaultLogos: Logo[] = [
  { name: 'Nova', mark: 1 },
  { name: 'Orbit', mark: 2 },
  { name: 'Pulse', mark: 3 },
  { name: 'Vertex', mark: 4 },
  { name: 'Arc', mark: 5 },
  { name: 'Prism', mark: 6 },
]

export const SocialProof02: FC<SocialProof02Props> = ({
  title = 'Trusted by product-led teams everywhere',
  logos = defaultLogos,
  fluid = false,
  class: className,
}) => (
  <section class={cn('py-12 md:py-16', className)}>
    <div class={cn(fluid ? 'w-full' : 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8')}>
      <div class="flex flex-col items-start gap-10 md:flex-row md:items-center md:gap-16">
        <p class="shrink-0 text-sm font-medium text-foreground md:max-w-48">
          {title}
        </p>
        <div class="flex flex-1 flex-wrap items-center justify-between gap-x-12 gap-y-6">
        {logos.map((item) => (
          <div
            key={item.name}
            class="flex items-center text-foreground"
            title={item.name}
          >
            {item.logo ? (
              <img
                src={item.logo}
                alt={item.name}
                class="h-8 w-auto object-contain"
              />
            ) : (
              <PlaceholderLogo name={item.name} mark={item.mark ?? 1} />
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  </section>
)

export default SocialProof02
