# Changelog

## 1.0.1 — 2026-04-25

### Fixed

- `select` now portals the open menu to `<body>` and uses `position: fixed`,
  so the dropdown escapes ancestor overflow containers (scroll areas,
  dialogs, table cells). Closes on scroll outside the menu and repositions
  on viewport resize. The content is returned to its original DOM position
  on close so positioning resets cleanly for the next open. Mirrors the
  `popover` portal pattern.

  Pairs with the updated `select-custom` registry component which adds
  `data-select-side` / `data-select-align` attributes and removes the
  static CSS positioning classes that the new enhance overrides at
  runtime.

## 1.0.0 — 2026-04-23

First stable release.

- Progressive-enhancement helpers for every interactive primitive: dialog,
  dropdown, toast, clipboard, theme, tabs, accordion, collapsible, toggle,
  popover, tooltip, sheet, slider, command, alert-dialog, context-menu,
  hover-card, editor, carousel, sidebar, sidebar-mobile, popover-submenu,
  date-picker, selectable-table, select, chart-tooltip.
- All helpers are zero-dependency except the `editor` subpath, which
  declares `@tiptap/*` as optional peer dependencies.
- Import per-primitive from the subpath (e.g. `@kiwa-ui/enhance/dialog`)
  to keep the client bundle small.
