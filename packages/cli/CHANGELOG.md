# Changelog

## 1.1.2 — 2026-04-28

- Fix headings rendering as browser-default bold instead of the intended
  font-weight 550 in fresh init projects. The template `globals.css` sets
  `h1`–`h6` to weight 550 to match the docs site, but that's a
  variation-axis weight only supported by InterVariable. Without Inter
  loaded, browsers round 550 to bold (700). Templates now `@import` Inter
  from `https://rsms.me/inter/inter.css` so the font is available
  automatically. Customers who prefer self-hosting can swap the import
  for their own font CSS.
- Add missing `--animate-caret-blink` token and `@keyframes caret-blink`
  to `templates/styles/globals.css`. The `chat-message` (pro/ai) block
  uses `animate-caret-blink` for its blinking cursor; without the
  keyframes the cursor sat static.
- Add `--animate-pulse` token and `@keyframes pulse` for parity with the
  docs site (no current registry block uses it but the rule is widely
  expected).

## 1.1.1 — 2026-04-28

- Fix `init` not actually scaffolding `styles/swirl-images.css`. The 1.1.0
  release added the file to `templates/` but never wired it into the init
  command's file list, so customers ended up with `globals.css` importing a
  non-existent `./swirl-images.css`. Pro blocks that use
  `<PlaceholderGradient>` rendered without their swirl backgrounds.

## 1.1.0 — 2026-04-28

- `init` now pins `lucide` to `^0.575.0` instead of installing the latest
  version. Future lucide releases (which may remove icons due to trademark
  concerns) cannot break Hono UI components. Existing projects are
  unaffected; the pin only applies on first `init`.
- `init` now scaffolds `styles/swirl-images.css` and imports it from
  `styles/globals.css`. Pro blocks that use `<PlaceholderGradient>` now
  render their swirl backgrounds out of the box. Adds ~313KB to the
  scaffolded `styles/` directory; remove the import if you don't use any
  swirl-based blocks.
- Pairs with the registry split that moves brand icons (`FacebookIcon`,
  `GithubIcon`, `InstagramIcon`, `LinkedInIcon`, `XLogoIcon`,
  `YoutubeIcon`) into a new `@/components/ui/social-icon` primitive. The
  CLI auto-pulls `social-icon.tsx` when a customer adds any block that
  uses brand marks (e.g. `footer-02`, `team-03`, `dashboard-profile`).

## 1.0.1 — 2026-04-24

- Fix `init` failing with `ENOENT` on fresh installs. Templates are now
  copied into `dist/templates/` at build time and ship inside the npm
  tarball, so `lib/utils.ts` and `styles/globals.css` resolve cleanly
  regardless of install location.
- Fix `--version` reporting `0.0.1`. The CLI now advertises its real
  release version.

## 1.0.0 — 2026-04-23

First stable release.

- Default registry endpoint is now `https://registry.honoui.com`. Override
  with `HONO_UI_REGISTRY_URL` if you are proxying or mirroring the registry.
- `init`, `add`, `add block`, `add starter`, and `diff` commands are stable.
- License-gated paid blocks and starters authenticate via
  `Authorization: Bearer <HONO_UI_TOKEN>`.
