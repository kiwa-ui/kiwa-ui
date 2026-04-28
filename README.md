# Hono UI

> SSR-first components and blocks for Hono. Edge-ready, zero client JS by default.

[![@hono-ui/cli](https://img.shields.io/npm/v/@hono-ui/cli?label=cli)](https://www.npmjs.com/package/@hono-ui/cli)
[![@hono-ui/enhance](https://img.shields.io/npm/v/@hono-ui/enhance?label=enhance)](https://www.npmjs.com/package/@hono-ui/enhance)
[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Hono UI is a component library and CLI built specifically for [Hono](https://hono.dev/)'s JSX renderer. Every component renders on the server with zero client JavaScript by default. Optional progressive enhancement via `@hono-ui/enhance`. Runs on **Bun, Deno, Cloudflare Workers, and Node.js** — the same code, every runtime.

> **Independent project.** Hono UI is not affiliated with, sponsored by, or endorsed by the Hono team or hono.dev. Hono is a trademark of its respective owner.

→ **[honoui.com](https://honoui.com)** · [docs](https://honoui.com/docs) · [pricing](https://honoui.com/pricing) · [@AdamTossell](https://x.com/AdamTossell)

---

## Quickstart

Inside an existing Hono project:

```bash
npx @hono-ui/cli init
npx @hono-ui/cli add button card dialog
```

That copies the components straight into your repo. You own the source — edit them however you want.

For Pro blocks (after purchase):

```bash
export HONO_UI_TOKEN=<your-license-key>
npx @hono-ui/cli add hero-04 bento-03 chart-area
```

A component looks like this:

```tsx
import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: 'default' | 'secondary' | 'ghost'
}

export const Button: FC<ButtonProps> = ({
  variant = 'default',
  class: className,
  children,
  ...props
}) => (
  <button class={cn('inline-flex items-center …', className)} {...props}>
    {children}
  </button>
)
```

No `forwardRef`, no `useState`, no `'use client'`. Just SSR JSX that runs anywhere Hono runs.

---

## What's included

### Free — MIT-licensed

- **50 UI primitives** — button, card, dialog, dropdown, accordion, popover, tooltip, tabs, table, slider, editor, and more
- **30 marketing blocks** — heroes, features, pricing, FAQ, CTAs, footers
- **`@hono-ui/cli`** — install components straight from the registry
- **`@hono-ui/enhance`** — optional progressive-enhancement helpers for every interactive primitive

### Pro — $99 one-time

- **130+ Pro blocks** across four domains:
  - **Marketing** — heroes, features, bento, testimonials, social proof, pricing, CTAs, FAQs, footers, metrics, blog, contact, team, navigation, content
  - **Dashboard** — charts, data tables, sidebar layouts, page headers, activity feeds, command/search
  - **AI UI** — chat layouts, chat input
  - **Page templates** — auth flows (login, signup, forgot-password), dashboard pages, settings
- **Lifetime access** including all future major versions (v2, v3, …) — no recurring fee
- One license per developer, unlimited personal and commercial projects
- 14-day no-questions-asked refund

→ **[See pricing](https://honoui.com/pricing)**

---

## Why Hono UI

- **SSR-first** — every component renders on the server, no hydration cost
- **Zero client JS by default** — plain HTML and CSS until you opt in
- **Edge-ready** — same code on Bun, Deno, Cloudflare Workers, and Node
- **Own the source** — components are copied into your project, no black-box dependency
- **Strict TypeScript** — every prop typed, every block exported as a typed `FC`

Hono UI is **not** a React library. It uses Hono's JSX renderer (`hono/jsx`). No hooks, no `forwardRef`, no `'use client'` directives.

---

## Compatibility

Requires Hono 4+ and Tailwind CSS v4.

| Runtime | Status |
|---|---|
| Bun | ✅ |
| Deno | ✅ |
| Cloudflare Workers | ✅ |
| Node.js | ✅ |

---

## Documentation

- [Get started](https://honoui.com/docs?guide=installation)
- [Components](https://honoui.com/docs?group=components)
- [Free blocks](https://honoui.com/docs?group=marketing)
- [Pro blocks](https://honoui.com/docs) — preview without a license
- [Pricing & FAQ](https://honoui.com/pricing)

---

## Bug reports & contributing

This GitHub repo is a read-only mirror of our private working repo. The full development happens upstream; the open-source surface is synced here on each release.

- **Found a bug?** File it at [github.com/hono-ui/hono-ui/issues](https://github.com/hono-ui/hono-ui/issues) — that's the right place for bug reports, feature requests, and questions.
- **Pull requests** are not currently accepted. If you've got a fix or improvement, open an issue describing what you'd change and we'll address it from upstream.

---

## License

- Free parts (CLI, enhance, primitives, free blocks): [MIT](LICENSE)
- Pro blocks: [commercial license](LICENSE-PRO.md) — [purchase here](https://honoui.com/pricing)

---

Made by [Adam Tossell](https://x.com/AdamTossell). © 2026 Tossell Web Solutions Limited.
