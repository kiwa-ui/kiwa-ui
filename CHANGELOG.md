# Changelog

User-facing changes to Hono UI primitives, blocks, CLI, and `@hono-ui/enhance`.
The landing page, pricing, and docs site live in git history and are not
tracked here.

Since the registry is continuously deployed, entries are grouped by date
rather than version.

## 2026-04-28

### Added

- New `social-icon` UI primitive with filled brand marks for GitHub,
  Facebook, Instagram, LinkedIn, YouTube, and X. Independent of `lucide`
  so future upstream changes can never break brand icons.
- `placeholder-gradient` accepts a `position` prop for non-centered swirl
  backgrounds (used by `hero-06`).
- Init template now scaffolds `styles/swirl-images.css` with the swirl
  gradient CSS variables, so pro blocks that use `<PlaceholderGradient>`
  render correctly out of the box.

### Changed

- ⚠ Breaking: brand icons (`FacebookIcon`, `GithubIcon`, `InstagramIcon`,
  `LinkedInIcon`, `YoutubeIcon`) moved from `@/components/ui/icon` to a
  new `@/components/ui/social-icon`. Update any direct imports.
- ⚠ Breaking: `TwitterIcon` renamed to `XLogoIcon` and moved to
  `@/components/ui/social-icon`. The X platform brand mark replaces the
  Twitter bird icon.
- `hero-03`, `hero-04`, `hero-06`, and `features-04` refactored to use
  `<PlaceholderGradient>` instead of inline `var(--swirl-N)` styles.
  Makes the `placeholder-gradient` dependency explicit so the CLI auto-pulls
  it on `cli add <block>`.
- CLI 1.1.0 — `init` now pins `lucide@^0.575.0` and scaffolds
  `styles/swirl-images.css`. See `packages/cli/CHANGELOG.md` for details.

## 2026-04-27

### Added

- Registry: `POST /auth/resend-key` endpoint that re-fires the welcome
  email for an active license. Looks up the license by email, applies a
  60-second per-email cooldown via KV, and always returns a generic 200
  to prevent license-key enumeration. Pairs with the new `/recover`
  form on the docs site so customers whose welcome email failed (or
  was lost) can self-recover without manual support.

### Changed

- `footer-02` block now auto-applies `target="_blank"` and
  `rel="noopener noreferrer"` to any link with an `http(s)` URL (in both the
  main columns and the bottom strip). Internal links and `mailto:` links are
  unaffected. Backward compatible.

## 2026-04-24 — Initial launch

### Added

- **51 UI primitives** — button, card, input, badge, alert, avatar,
  avatar-stack, dialog, sheet, dropdown-menu, popover, tooltip, hover-card,
  context-menu, tabs, accordion, collapsible, breadcrumb, pagination,
  toggle, toggle-group, slider, radio-group, switch, select, select-custom,
  date-picker, editor, progress, spinner, kbd, label, separator, empty,
  table, alert-dialog, chart primitives, content-card, display-card,
  placeholder-gradient, placeholder-logo, blog-post-card, sidebar-item,
  sidebar-collapsible, sidebar-menu-button, segmented-progress, icon,
  form-field, carousel, command, and toast.
- **30 free marketing blocks** across heroes, features, bento,
  testimonials, pricing, CTAs, FAQs, footers, metrics, blog, contact,
  team, navigation, and content sections.
- **130 pro blocks** across four domains:
  - **Marketing** — heroes, features, bento, pricing, CTAs, FAQs,
    navigation, footers, testimonials, social-proof, blog, metrics,
    content, team, contact.
  - **Dashboard** — page headers, stat cards, charts, data tables,
    filters, activity feeds, command/search, forms and settings,
    modals and slideouts, onboarding steps.
  - **AI** — chat layouts, chat messages, chat input, onboarding.
  - **Pages** — login, signup, forgot-password, dashboard settings,
    dashboard tasks, dashboard users, analytics page templates.
- **`@hono-ui/cli` 1.0.1** — `init`, `add`, `add block`, `add starter`,
  and `diff` commands. Defaults to `https://registry.honoui.com`;
  override via `HONO_UI_REGISTRY_URL`.
- **`@hono-ui/enhance` 1.0.0** — progressive enhancement modules for
  every interactive primitive: accordion, alert-dialog, carousel,
  chart-tooltip, clipboard, collapsible, command, context-menu,
  date-picker, dialog, dropdown, editor, hover-card, popover,
  popover-submenu, select, selectable-table, sheet, sidebar,
  sidebar-mobile, slider, tabs, theme, toast, toggle, tooltip.
- **Registry API** at `registry.honoui.com` — component and block
  fetching, license validation, Lemon Squeezy webhook integration,
  Resend-based welcome emails, full-refund license revocation.
- **Pro licensing** — $99 one-time via Lemon Squeezy for lifetime
  access to all pro blocks across unlimited personal and commercial
  projects.
