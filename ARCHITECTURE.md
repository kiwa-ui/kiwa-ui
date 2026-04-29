# Kiwa UI - Architecture

A shadcn-style workflow for Hono-first stacks: SSR-first primitives, paid blocks, and starter kits.

## Core Decisions

### 1. Registry

**Single API on Cloudflare Workers** serving both free and paid content.

- **Endpoint**: `https://registry.kiwaui.com`
- **Free components**: No authentication required
- **Paid components**: Require `Authorization: Bearer <license_key>` header

```json
// User's components.json after purchasing
{
  "registries": {
    "kiwa-ui": {
      "url": "https://registry.kiwaui.com",
      "headers": {
        "Authorization": "Bearer $KIWA_UI_TOKEN"
      }
    }
  }
}
```

### 2. Styling

**Tailwind v4 + CSS Variables** (CSS-first configuration).

No `tailwind.config.js` needed. All theming via CSS:

```css
/* styles/globals.css */
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... maps CSS vars to Tailwind colors */
}

:root {
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... oklch color values */
}

.dark {
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... */
}
```

This enables:
- Runtime theme switching (dark mode, custom themes)
- Theme packs as pure CSS files
- Familiar DX for shadcn users
- Modern oklch color space for better color manipulation

### 3. Client Interactivity

**Separate package: `@kiwa-ui/enhance`**

Optional progressive enhancement for interactive behaviors:
- Dropdown open/close
- Dialog/modal toggle
- Toast notifications
- Copy-to-clipboard
- Theme toggle

```tsx
// Usage in Hono route
import { dialog } from '@kiwa-ui/enhance'

<button data-dialog-trigger="my-dialog">Open</button>
<div data-dialog="my-dialog">Dialog content</div>

<script type="module">
  import { dialog } from '@kiwa-ui/enhance'
  dialog()
</script>
```

Philosophy: **Zero JS by default, opt-in interactivity.**

### 4. Starter Kit Delivery

**Primary: CLI scaffolding**

```bash
npx @kiwa-ui/cli add starter ai-saas --dir ./my-new-app
```

**Fallback: Dashboard download** at `kiwaui.com/purchases` for users who prefer manual setup.

### 5. Component Strategy

**Phase 1**: Port simple shadcn components (MIT licensed) to Hono JSX
- Button, Input, Textarea, Card, Badge, Alert, Label, Separator, Skeleton, Spinner, Table, etc.
- Changes: Remove React hooks, `className` → `class`, remove forwardRef

**Phase 2**: Rebuild Radix-dependent components as SSR-first
- Dialog, Dropdown, Select, Tabs, etc.
- SSR baseline with `@kiwa-ui/enhance` for interactivity

### 6. Icon System

**Lucide-backed shared icon layer** for registry and docs.

- Source package: `lucide` (icon node data)
- Shared wrappers: `registry/ui/icon.tsx` and `docs/components/ui/icon.tsx`
- Consumption pattern: import icon components from `@/components/ui/icon`
- Registry packaging: components using icons declare `icon` in `registryDependencies`
- Constraint: inline SVG icon components are not allowed; keep SVG only for non-icon visualizations (charts, meters, decorative graphics)
- Rule for all future components/blocks: icon usage must be exclusively Lucide through the shared icon layer
- Hardcoded SVG icons are prohibited in new component and block implementations

---

## User Project Structure (after `npx @kiwa-ui/cli init`)

```
user-project/
├── components/
│   ├── ui/                  # Primitives copied here
│   │   ├── button.tsx
│   │   └── ...
│   └── blocks/              # Blocks copied here
│       └── ...
├── lib/
│   └── utils.ts             # cn() helper
├── styles/
│   ├── globals.css          # Tailwind + CSS variables
│   └── tokens.css           # Theme tokens (optional)
└── kiwa-ui.json             # Config file
```

---

## CLI Commands

```bash
# Initialize kiwa-ui in a project
npx @kiwa-ui/cli init

# Add primitives
npx @kiwa-ui/cli add button input card

# Add blocks (free or paid based on license)
npx @kiwa-ui/cli add block hero-centered pricing-table

# Add starter kit (paid, scaffolds new project)
npx @kiwa-ui/cli add starter ai-saas --dir ./my-app

# Check for updates to installed components
npx @kiwa-ui/cli diff
```

Styling model:
- `shadcn-first`: familiar shadcn utility naming with a small set of V1 extensions

---

## Component Anatomy (Hono JSX)

```tsx
// components/ui/button.tsx
import type { FC, JSX } from 'hono/jsx'
import { cn } from '@/lib/utils'

const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
    ghost: 'hover:bg-muted hover:text-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
    outline: 'border border-border bg-card hover:bg-muted hover:text-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-8 px-3',
    sm: 'h-7 px-2.5 text-xs',
    lg: 'h-9 px-4',
    icon: 'size-8',
  },
}

type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

export const Button: FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  class: className,
  children,
  ...props
}) => (
  <button
    class={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium',
      'border border-transparent transition-colors',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20',
      'disabled:pointer-events-none disabled:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      buttonVariants.variant[variant],
      buttonVariants.size[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
)
```

Key differences from React/shadcn:
- `import type { FC, JSX } from 'hono/jsx'` instead of React
- `class` instead of `className`
- No `forwardRef`, no hooks, no client state
- Tailwind v4 focus pattern: `focus-visible:ring-[3px] focus-visible:ring-ring/20`
- Variant logic inline (no cva dependency, though we could add it)

---

## Registry API Schema

Each component in the registry returns JSON:

```json
{
  "name": "button",
  "type": "ui",
  "description": "A button component with variants",
  "dependencies": [],
  "devDependencies": [],
  "registryDependencies": [],
  "files": [
    {
      "name": "button.tsx",
      "path": "components/ui/button.tsx",
      "content": "// component source code..."
    }
  ]
}
```

---

## Monetization

| Tier | Contents | Price |
|------|----------|-------|
| **Free** | CLI, ~25 primitives, ~20 blocks, docs | $0 |
| **Pro Blocks** | 100+ blocks (marketing, dashboard, AI UI) | $99 one-time |
| **Starters Bundle** | Pro Blocks + AI SaaS Starter + Dashboard Starter | $249 one-time |
| **Updates** | Continued updates after year 1 | $79/year (optional) |

Payment via Lemon Squeezy → webhook creates license key → stored in DB → validated by registry API.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Monorepo | pnpm workspaces |
| CLI | TypeScript, Commander.js |
| Registry API | Hono on Cloudflare Workers |
| Docs site | Hono + kiwa-ui (dogfooding) |
| Payments | Lemon Squeezy |
| License DB | Cloudflare D1 or KV |

