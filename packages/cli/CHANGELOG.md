# Changelog

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
