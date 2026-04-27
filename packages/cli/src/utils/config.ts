import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

export interface HonoUIConfig {
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

const CONFIG_FILE = 'hono-ui.json'

export async function readConfig(cwd: string = process.cwd()): Promise<HonoUIConfig | null> {
  const configPath = join(cwd, CONFIG_FILE)

  if (!existsSync(configPath)) {
    return null
  }

  const content = await readFile(configPath, 'utf-8')
  return JSON.parse(content)
}

export async function writeConfig(
  config: HonoUIConfig,
  cwd: string = process.cwd()
): Promise<void> {
  const configPath = join(cwd, CONFIG_FILE)
  await writeFile(configPath, JSON.stringify(config, null, 2))
}

export function getDefaultConfig(): HonoUIConfig {
  return {
    $schema: 'https://registry.honoui.com/schema.json',
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
