import { readFile } from 'node:fs/promises'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { createRequire } from 'node:module'
import { parse, modify, applyEdits } from 'jsonc-parser'

export interface TsconfigAnalysis {
  exists: boolean
  hasBaseUrl: boolean
  hasPathAlias: boolean
  hasHonoJsx: boolean
  sourceRoot: string
  raw: string | null
}

export function detectSourceRoot(cwd: string): string {
  const srcDir = join(cwd, 'src')
  if (!existsSync(srcDir)) return '.'

  const entryFiles = ['index.ts', 'index.tsx', 'app.ts', 'app.tsx', 'main.ts', 'main.tsx']
  for (const entry of entryFiles) {
    if (existsSync(join(srcDir, entry))) return './src'
  }

  return '.'
}

function resolveExtends(cwd: string, extendsPath: string): object | null {
  let resolved: string
  if (extendsPath.startsWith('.')) {
    resolved = join(cwd, extendsPath)
  } else {
    try {
      const require = createRequire(join(cwd, '_'))
      resolved = require.resolve(extendsPath)
    } catch {
      return null
    }
  }

  if (!resolved.endsWith('.json')) resolved += '.json'
  if (!existsSync(resolved)) return null

  try {
    const content = readFileSync(resolved, 'utf-8')
    const parsed = parse(content)
    if (parsed?.extends) {
      const parent = resolveExtends(dirname(resolved), parsed.extends)
      return { ...parent, ...parsed }
    }
    return parsed
  } catch {
    return null
  }
}

export async function analyzeTsconfig(cwd: string): Promise<TsconfigAnalysis> {
  const tsconfigPath = join(cwd, 'tsconfig.json')
  const sourceRoot = detectSourceRoot(cwd)

  if (!existsSync(tsconfigPath)) {
    return {
      exists: false,
      hasBaseUrl: false,
      hasPathAlias: false,
      hasHonoJsx: false,
      sourceRoot,
      raw: null,
    }
  }

  const raw = await readFile(tsconfigPath, 'utf-8')
  const parsed = parse(raw)
  const compilerOptions = parsed?.compilerOptions ?? {}

  let hasBaseUrl = !!compilerOptions.baseUrl
  let hasPathAlias = !!(compilerOptions.paths?.['@/*'])
  const hasHonoJsx = compilerOptions.jsxImportSource === 'hono/jsx'

  if (parsed?.extends && (!hasBaseUrl || !hasPathAlias)) {
    const inherited = resolveExtends(cwd, parsed.extends)
    const inheritedOpts = (inherited as Record<string, unknown>)?.compilerOptions as
      Record<string, unknown> | undefined
    if (inheritedOpts) {
      if (!hasBaseUrl && inheritedOpts.baseUrl) hasBaseUrl = true
      if (!hasPathAlias && (inheritedOpts.paths as Record<string, unknown>)?.['@/*']) {
        hasPathAlias = true
      }
    }
  }

  return { exists: true, hasBaseUrl, hasPathAlias, hasHonoJsx, sourceRoot, raw }
}

export function addPathAliasToExisting(raw: string, sourceRoot: string): string {
  const parsed = parse(raw)
  const compilerOptions = parsed?.compilerOptions ?? {}
  let result = raw

  if (!compilerOptions.baseUrl) {
    const edits = modify(result, ['compilerOptions', 'baseUrl'], '.', {
      formattingOptions: { tabSize: 2, insertSpaces: true },
    })
    result = applyEdits(result, edits)
  }

  const pathValue = sourceRoot === './src' ? ['./src/*'] : ['./*']

  if (!compilerOptions.paths?.['@/*']) {
    const edits = modify(result, ['compilerOptions', 'paths', '@/*'], pathValue, {
      formattingOptions: { tabSize: 2, insertSpaces: true },
    })
    result = applyEdits(result, edits)
  }

  return result
}

export function generateDefaultTsconfig(sourceRoot: string): string {
  const pathValue = sourceRoot === './src' ? ['./src/*'] : ['./*']
  const config = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      jsx: 'react-jsx',
      jsxImportSource: 'hono/jsx',
      baseUrl: '.',
      paths: {
        '@/*': pathValue,
      },
    },
    include: sourceRoot === './src' ? ['src'] : ['.'],
    exclude: ['node_modules', 'dist'],
  }

  return JSON.stringify(config, null, 2) + '\n'
}
