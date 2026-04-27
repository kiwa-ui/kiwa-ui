/**
 * Narrowly scoped exceptions for raw palette classes in `registry/*`.
 *
 * Rules:
 * - Keep this list as small as possible.
 * - Every entry must include a clear `reason`.
 * - Scope entries to a specific `filePath` + `token` (preferred) or `className`.
 */
export const paletteClassAllowlist = [
  // Example:
  // {
  //   filePath: 'registry/blocks/pro/marketing/hero-mockup.tsx',
  //   token: 'bg-red-500/80',
  //   reason: 'Decorative browser traffic-light dots retained intentionally.',
  // },
]
