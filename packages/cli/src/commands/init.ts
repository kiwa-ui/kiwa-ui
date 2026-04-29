import pc from 'picocolors'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { readConfig, writeConfig, getDefaultConfig } from '../utils/config'
import { ensureDir, detectPackageManager, getInstallCommand, execAsync } from '../utils/files'
import {
  analyzeTsconfig,
  addPathAliasToExisting,
  generateDefaultTsconfig,
} from '../utils/tsconfig'

interface InitOptions {
  force?: boolean
}

function resolveTemplatesRoot() {
  const moduleDir = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    resolve(moduleDir, 'templates'),
    resolve(moduleDir, '../../../..', 'templates'),
    resolve(moduleDir, '../../..', 'templates'),
    resolve(process.cwd(), 'templates'),
  ]

  const templatePaths = ['lib/utils.ts', 'styles/globals.css', 'styles/swirl-images.css']

  for (const candidate of candidates) {
    if (templatePaths.every((path) => existsSync(join(candidate, path)))) {
      return candidate
    }
  }

  return candidates[0]
}

const TEMPLATES_ROOT = resolveTemplatesRoot()

async function readTemplateFile(path: string) {
  return readFile(join(TEMPLATES_ROOT, path), 'utf-8')
}

export async function init(options: InitOptions) {
  const cwd = process.cwd()

  console.log(pc.cyan('Initializing kiwa-ui...'))

  // 1. Check for existing config
  const existingConfig = await readConfig(cwd)
  if (existingConfig && !options.force) {
    console.error(pc.red('kiwa-ui.json already exists. Use --force to overwrite.'))
    process.exit(1)
  }

  // 2. Detect package manager
  const pm = detectPackageManager()
  console.log(pc.dim(`Detected package manager: ${pm}`))

  // 3. Create directories
  console.log(pc.dim('Creating directories...'))
  await ensureDir(join(cwd, 'components/ui'))
  await ensureDir(join(cwd, 'components/blocks'))
  await ensureDir(join(cwd, 'lib'))
  await ensureDir(join(cwd, 'styles'))

  // 4. Load template files
  console.log(pc.dim('Loading template files...'))
  let utilsTemplate = ''
  let globalsTemplate = ''
  let swirlImagesTemplate = ''

  try {
    ;[utilsTemplate, globalsTemplate, swirlImagesTemplate] = await Promise.all([
      readTemplateFile('lib/utils.ts'),
      readTemplateFile('styles/globals.css'),
      readTemplateFile('styles/swirl-images.css'),
    ])
  } catch (error) {
    console.error(pc.red('Failed to read template files from /templates.'))
    if (error instanceof Error) {
      console.error(pc.red(error.message))
    }
    process.exit(1)
  }

  // 5. Write template files
  console.log(pc.dim('Writing template files...'))
  await writeFile(join(cwd, 'lib/utils.ts'), utilsTemplate)
  await writeFile(join(cwd, 'styles/globals.css'), globalsTemplate)
  await writeFile(join(cwd, 'styles/swirl-images.css'), swirlImagesTemplate)

  // 6. Write config
  await writeConfig(getDefaultConfig(), cwd)
  console.log(pc.dim('Created kiwa-ui.json'))

  // 7. Configure tsconfig.json
  const analysis = await analyzeTsconfig(cwd)

  if (!analysis.exists) {
    const tsconfig = generateDefaultTsconfig(analysis.sourceRoot)
    await writeFile(join(cwd, 'tsconfig.json'), tsconfig)
    console.log(pc.dim('Created tsconfig.json with path aliases'))
  } else if (analysis.hasPathAlias) {
    console.log(pc.dim('tsconfig.json already has @/ path alias'))
  } else {
    const updated = addPathAliasToExisting(analysis.raw!, analysis.sourceRoot)
    await writeFile(join(cwd, 'tsconfig.json'), updated)
    console.log(pc.dim('Added @/ path alias to tsconfig.json'))
  }

  if (analysis.exists && !analysis.hasHonoJsx) {
    console.log(
      pc.yellow('Warning: tsconfig.json is missing "jsxImportSource": "hono/jsx"'),
    )
  }

  // 8. Install dependencies
  console.log(pc.dim('Installing dependencies...'))
  const installCmd = getInstallCommand(pm, ['clsx', 'tailwind-merge', 'lucide@^0.575.0'])
  try {
    await execAsync(installCmd, cwd)
    console.log(pc.dim('Installed clsx, tailwind-merge, lucide@^0.575.0'))
  } catch (error) {
    console.warn(pc.yellow('Warning: Could not install dependencies automatically.'))
    console.warn(pc.yellow(`Run: ${installCmd}`))
  }

  console.log()
  console.log(pc.green('kiwa-ui initialized successfully!'))
  console.log()
  console.log('Next steps:')
  console.log(pc.dim('  1. Import styles/globals.css in your app'))
  console.log(pc.dim('  2. Add components with: kiwa-ui add button card'))
}
