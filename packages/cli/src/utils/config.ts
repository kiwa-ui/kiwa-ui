import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

export interface KiwaUIConfig {
  $schema?: string
  tsconfig?: string
  tailwind: {
    config: string
    css: string
  }
  aliases: {
    components: string
    utils: string
  }
  components: string[]
}

const CONFIG_FILE = 'kiwa-ui.json'
const LEGACY_CONFIG_FILE = 'hono-ui.json'

export async function readConfig(cwd: string = process.cwd()): Promise<KiwaUIConfig | null> {
  const configPath = join(cwd, CONFIG_FILE)
  if (existsSync(configPath)) {
    return JSON.parse(await readFile(configPath, 'utf-8'))
  }
  const legacyPath = join(cwd, LEGACY_CONFIG_FILE)
  if (existsSync(legacyPath)) {
    return JSON.parse(await readFile(legacyPath, 'utf-8'))
  }
  return null
}

export async function writeConfig(
  config: KiwaUIConfig,
  cwd: string = process.cwd()
): Promise<void> {
  const configPath = join(cwd, CONFIG_FILE)
  await writeFile(configPath, JSON.stringify(config, null, 2))
}

export function getDefaultConfig(): KiwaUIConfig {
  return {
    $schema: 'https://registry.kiwaui.com/schema.json',
    tsconfig: 'tsconfig.json',
    tailwind: {
      config: 'tailwind.config.js',
      css: 'styles/globals.css',
    },
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
    },
    components: [],
  }
}
