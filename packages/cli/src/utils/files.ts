import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execPromise = promisify(exec)

export async function execAsync(
  command: string,
  cwd: string = process.cwd()
): Promise<{ stdout: string; stderr: string }> {
  return execPromise(command, { cwd })
}

export async function ensureDir(dir: string): Promise<void> {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

export async function writeComponentFile(
  cwd: string,
  filePath: string,
  content: string
): Promise<void> {
  const fullPath = join(cwd, filePath)
  await ensureDir(dirname(fullPath))
  await writeFile(fullPath, content)
}

export function detectPackageManager(): 'pnpm' | 'npm' | 'yarn' | 'bun' {
  const userAgent = process.env.npm_config_user_agent || ''

  if (userAgent.startsWith('pnpm')) return 'pnpm'
  if (userAgent.startsWith('yarn')) return 'yarn'
  if (userAgent.startsWith('bun')) return 'bun'

  // Check for lockfiles
  if (existsSync('pnpm-lock.yaml')) return 'pnpm'
  if (existsSync('yarn.lock')) return 'yarn'
  if (existsSync('bun.lockb')) return 'bun'

  return 'npm'
}

export function getInstallCommand(
  pm: 'pnpm' | 'npm' | 'yarn' | 'bun',
  packages: string[]
): string {
  const pkgList = packages.join(' ')

  switch (pm) {
    case 'pnpm':
      return `pnpm add ${pkgList}`
    case 'yarn':
      return `yarn add ${pkgList}`
    case 'bun':
      return `bun add ${pkgList}`
    default:
      return `npm install ${pkgList}`
  }
}
