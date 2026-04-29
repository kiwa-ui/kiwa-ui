# Kiwa UI - Roadmap

Future enhancements and features planned for the project.

---

## Dashboard

### Icon-only sidebar collapse variant
Add a fourth sidebar layout variant (`sidebar-layout-icon-rail`) that
collapses to a narrow icon rail on desktop instead of fully hiding.

- Flat nav items collapse to icon-only buttons with tooltips
- Skip collapsible groups in this variant — keep it flat nav only
- Flyout menus on hover are out of scope for the initial version
- Mobile/tablet behaviour stays the same (full show/hide)
- Orthogonal to the existing three visual variants (default, inset,
  floating) — this demonstrates a different interaction pattern

### Sidebar state persistence
Remember sidebar open/closed state across page navigations using
`localStorage` or a cookie, so the sidebar doesn't reset on reload.

### FilterPopover + FilterChip wiring documentation
Document the `popover-submenu-change` CustomEvent emitted by `FilterPopover`
when a checkbox is toggled or a custom date range is applied. This is
the hook point for users to connect the popover to `FilterChip`
creation/removal and to their own data filtering logic.

- Event: `popover-submenu-change` (bubbles from `[data-popover-submenu]`)
- `detail.category` — filter category id (e.g. `"status"`, `"role"`)
- `detail.value` — selected option value
- `detail.checked` — boolean
- `detail.customRange` — `{ start, end }` for date filters
- Show a usage example wiring popover selections to FilterChip render

---

## AI

### V2 components parked in `registry/_v2-preview/ai/`
`activity-tracker.tsx` and `ai-score-cards.tsx` live in
`registry/_v2-preview/ai/`, outside the registry build paths. They are
not scanned by the wrapper generator or the registry builder, so they
do not appear in the docs browser, the registry API, or `npx @kiwa-ui/cli add`.
The source is preserved for a future AI dashboard page that composes
them.

To re-surface in V2:
1. Move both files back to `registry/blocks/pro/ai/`
2. Re-add their meta entries to `registry/blocks/pro/index.ts`
3. Re-add their imports + showcase entries to
   `docs/app/application-blocks.tsx`
4. Run `pnpm docs:wrappers:generate` to create the wrappers
5. Build the consuming `ai-dashboard-*` page in
   `registry/blocks/pro/pages/` so they have a real home

### Chat layout rebuild (V1 polish)
The current `chat-layout`, `chat-layout-bordered`, `chat-layout-inset`,
and `chat-layout-floating` blocks contain a copy-pasted sidebar shell
that predates the new `sidebar-layout-*` blocks. Rebuild as 3 variants
that wrap the real sidebar layouts:

- Drop `chat-layout-bordered`; keep `chat-layout-default`,
  `chat-layout-inset`, `chat-layout-floating` (matches the dashboard
  page naming)
- Each variant wraps `<SidebarLayout{Default|Inset|Floating}>` as the
  shell instead of duplicating sidebar code
- Sidebar slot renders `<ChatHistory />`
- Header slot uses a new `chat-page-header.tsx` block extracted from
  the existing chat-layout headers (model selector + settings + share
  + new-chat actions)
- Main content keeps the existing `<ChatMessage>` list +
  `<ChatInput>` composer
- Decide on `streaming-text`: either inline its cursor effect into
  `chat-message`'s assistant streaming state, or skip until V2

---

## Components

### Command palette keyboard shortcut on more blocks
The `data-dialog-shortcut="cmd+k"` attribute is wired up on
`SearchModal` and `CommandMenu`. Consider adding it to the docs site
search and any future search-enabled layouts.

### Toast / notification primitive
Lightweight toast notification component with auto-dismiss, stacking,
and position options. No toast exists yet — the current
`notifications-list` and `topbar-notifications-messages` blocks are
popover-style notification panels, not ephemeral toast messages.

### Shared `BlockContainer` primitive
Every marketing block currently inlines the same outer container:
`mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8`. Extract this into a
single primitive (e.g. `components/ui/block-container.tsx`) that all
blocks consume:

- `fluid` prop — drops max-width/padding so the block can be nested
  inside another layout that already owns its container (see
  `SocialProof02`/`SocialProof05` used inside `hero-03`/`hero-05`/
  `hero-06`). Every social-proof block already ships a `fluid` prop —
  generalise the pattern to every block category.
- `size` prop — optional alternative max-widths (`sm`, `md`, `lg`,
  `xl`) for blocks that want a narrower or wider container than the
  default `max-w-screen-lg`.
- Keeps the section-level `py` out of the container so blocks retain
  their own vertical rhythm.

Benefits:
- One source of truth for container width/padding across ~90 blocks.
- Nested-block composition stops requiring per-component `fluid` props
  — every block gets it for free.
- Designers/developers tuning the global content width only need to
  change one file.

### Enhance module teardown lifecycle
Each enhance module (`dialog()`, `dropdown()`, `popover()`, etc.)
currently binds event listeners and never cleans them up. For consumers
doing SPA-style page swaps, stale listeners accumulate on every
re-init.

Add a teardown API where each module returns a cleanup function:
```ts
const cleanupPopover = popover()
const cleanupDropdown = dropdown()

// Before SPA page swap:
cleanupPopover()
cleanupDropdown()
```

The cleanup function unbinds all event listeners, removes portaled
elements, clears timers, and resets internal state. This is additive
to the existing `returnFromPortal` fix (which handles the portal
orphan case automatically on close) — the teardown API gives power
users deterministic control for mount/unmount lifecycles.

---

## CLI

### `npx @kiwa-ui/cli update` command
Check installed components against the registry and offer interactive
updates (currently `npx @kiwa-ui/cli diff` shows drift but doesn't apply fixes).

---

## Design tokens

### Additional theme presets
Ship 2-3 alternative colour theme presets (e.g. warm neutral, blue
accent) that users can swap in via `globals.css`.
