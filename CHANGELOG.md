# Changelog

User-facing changes to Kiwa UI primitives, blocks, CLI, and `@kiwa-ui/enhance`.
The landing page, pricing, and docs site live in git history and are not
tracked here.

Since the registry is continuously deployed, entries are grouped by date
rather than version.

## 2026-05-11

### Added

- New `combobox` primitive: searchable single-select with typeahead
  filtering, clearable selection, keyboard navigation, and form-input
  syncing. Trigger styling matches `select-custom`.
- New `multi-select` primitive: searchable multi-value picker with
  badge chips, inline X-remove, configurable `maxDisplay` with `+N`
  overflow, and one hidden input per selected value.
- Enhance 2.1.0: new `combobox` export drives both primitives (single
  via the default mode, multi via `data-combobox-multiple="true"`).
  Reuses the existing portal, position, keyboard, and ARIA utilities.

### Changed

- Combobox + multi-select items show a right-pinned `text-primary`
  checkmark on the selected option instead of a left checkbox.
- Multi-select trigger left padding tightened to `pl-1.5` to match the
  vertical padding so chips sit closer to the trigger edge.

## 2026-05-05

### Changed

- Marketing blocks: 2-button rows in `cta-01`, `cta-02`, `cta-03`,
  `cta-04`, `cta-06`, and `faq-03` now stack as a full-width column on
  mobile and switch to a horizontal row at `sm` and above, matching the
  hero blocks.

## 2026-04-30

### Added

- CLI 2.1.0: `kiwa-ui add` now accepts `-a, --all` to install every free
  UI primitive in a single command. Registry dependencies still resolve
  the same way as a named add. Blocks and starters are intentionally not
  included — add those by name.

## 2026-04-29 — Renamed: Hono UI is now Kiwa UI

Hono UI has been renamed to **Kiwa UI** to remove confusion with the
[Hono](https://hono.dev) framework itself. Kiwa UI remains an independent
project, built for Hono but not affiliated with hono.dev. *Kiwa* (際) is
Japanese for "edge" — a nod both to Hono's heritage and to Kiwa UI's
edge-runtime focus (Bun, Deno, Cloudflare Workers).

### ⚠ Breaking

- ⚠ npm packages renamed:
  - `@hono-ui/cli` → `@kiwa-ui/cli` (now `2.0.0`)
  - `@hono-ui/enhance` → `@kiwa-ui/enhance` (now `2.0.0`)
- ⚠ Domain: `honoui.com` → `kiwaui.com`. The old domain 301-redirects to
  the new one, so existing customer scripts keep working.
- ⚠ Registry: `https://registry.honoui.com` → `https://registry.kiwaui.com`.
  Both URLs continue to serve the same registry during the transition.
- ⚠ Env vars: `HONO_UI_TOKEN` → `KIWA_UI_TOKEN`,
  `HONO_UI_REGISTRY_URL` → `KIWA_UI_REGISTRY_URL`. The old names are still
  read as fallbacks, so existing CI configs keep working — but rename them
  when you can.
- ⚠ Config file: `hono-ui.json` → `kiwa-ui.json`. The CLI reads either
  during the transition; new `init` writes `kiwa-ui.json`.
- ⚠ GitHub: `github.com/hono-ui/hono-ui` → `github.com/kiwa-ui/kiwa-ui`.
  GitHub auto-redirects clones, issue links, and stargazers.

### Migration for existing customers

```bash
# Replace the deprecated package
npm uninstall @hono-ui/cli @hono-ui/enhance
npm install @kiwa-ui/cli @kiwa-ui/enhance

# Rename the env var (or leave HONO_UI_TOKEN — still works)
export KIWA_UI_TOKEN=$HONO_UI_TOKEN

# Rename the config file (optional — old name still works)
mv hono-ui.json kiwa-ui.json
```

License keys are unchanged. Your existing key continues to authenticate
against the new registry.

## 2026-04-28 (later)

### Fixed

- CLI 1.1.2 — fresh init projects now load Inter automatically via
  `@import url("https://rsms.me/inter/inter.css")` in `globals.css`. The
  template's heading rule sets `font-weight: 550` (a variation-axis
  weight Inter supports), but without Inter loaded browsers round 550 to
  bold. Headings now render at the intended weight out of the box.
  Also added the `--animate-caret-blink` token and `@keyframes
  caret-blink` rule so the AI chat-message cursor blinks as intended,
  plus `--animate-pulse` for parity with the docs CSS.
- CLI 1.1.1 — `init` now actually copies `styles/swirl-images.css` into the
  scaffolded project. The 1.1.0 release shipped the template file but
  forgot to wire it into the init command, leaving `globals.css` with a
  dangling `@import` and pro blocks rendering without their swirl
  backgrounds.
- Registry: welcome email now includes the `npx @kiwa-ui/cli@latest init`
  step before the `add` step, and the `add` example uses the correct
  syntax (`add hero-03`, not the non-existent `add block hero-03`).

### Changed

- Pro blocks `pricing-06` and `cta-03` now auto-apply
  `target="_blank" rel="noopener noreferrer"` to any CTA link with an
  `http(s)` URL (matches the existing `footer-02` behaviour). Internal
  links are unaffected. Backward compatible.

### Other CTA tweaks

- `cta-02` switched to equal-width 2-column grid with `gap-16` (64px),
  added an eyebrow prop defaulting to `"Get started"`, and lengthened the
  default description to span two lines.
- `cta-04` left column inner padding bumped from `lg:py-20` to `lg:py-24`
  (80px → 96px).
- `cta-05` description now uses `text-sm`; left column max-width widened
  from `lg:max-w-xs` to `lg:max-w-sm` for breathing room around the title.

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
- **`@kiwa-ui/cli` 1.0.1** — `init`, `add`, `add block`, `add starter`,
  and `diff` commands. Defaults to `https://registry.kiwaui.com`;
  override via `KIWA_UI_REGISTRY_URL`.
- **`@kiwa-ui/enhance` 1.0.0** — progressive enhancement modules for
  every interactive primitive: accordion, alert-dialog, carousel,
  chart-tooltip, clipboard, collapsible, command, context-menu,
  date-picker, dialog, dropdown, editor, hover-card, popover,
  popover-submenu, select, selectable-table, sheet, sidebar,
  sidebar-mobile, slider, tabs, theme, toast, toggle, tooltip.
- **Registry API** at `registry.kiwaui.com` — component and block
  fetching, license validation, Lemon Squeezy webhook integration,
  Resend-based welcome emails, full-refund license revocation.
- **Pro licensing** — $99 one-time via Lemon Squeezy for lifetime
  access to all pro blocks across unlimited personal and commercial
  projects.
