import pc from 'picocolors'
import { readConfig, writeConfig } from '../utils/config'
import { fetchComponent, type RegistryComponent } from '../utils/registry'
import { writeComponentFile, detectPackageManager, getInstallCommand, execAsync } from '../utils/files'

async function resolveComponents(
  names: string[],
  token: string | undefined,
  installed: Set<string>
): Promise<RegistryComponent[]> {
  const resolved: RegistryComponent[] = []
  const queue = [...names]
  const seen = new Set<string>()

  while (queue.length > 0) {
    const name = queue.shift()!
    if (seen.has(name) || installed.has(name)) continue
    seen.add(name)

    try {
      const component = await fetchComponent(name, token)
      resolved.push(component)
      queue.push(...component.registryDependencies)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch "${name}": ${error.message}`)
      }
      throw error
    }
  }

  return resolved
}

export async function add(components: string[]) {
  const cwd = process.cwd()

  // 1. Read config
  const config = await readConfig(cwd)
  if (!config) {
    console.error(pc.red('No kiwa-ui.json found. Run `kiwa-ui init` first.'))
    process.exit(1)
  }

  console.log(pc.cyan(`Adding components: ${components.join(', ')}`))

  // 2. Get token from env (KIWA_UI_TOKEN preferred; HONO_UI_TOKEN kept for backwards compat)
  const token = process.env.KIWA_UI_TOKEN || process.env.HONO_UI_TOKEN

  // 3. Track installed components and dependencies
  const installed = new Set(config.components)
  const allDeps = new Set<string>()

  // 4. Resolve all components including registry dependencies
  let toInstall: RegistryComponent[]
  try {
    toInstall = await resolveComponents(components, token, installed)
  } catch (error) {
    if (error instanceof Error) {
      console.error(pc.red(error.message))
    }
    process.exit(1)
  }

  if (toInstall.length === 0) {
    console.log(pc.yellow('All components are already installed.'))
    return
  }

  // 5. Write component files
  for (const component of toInstall) {
    for (const file of component.files) {
      await writeComponentFile(cwd, file.path, file.content)
      console.log(pc.dim(`  Created ${file.path}`))
    }

    component.dependencies.forEach((d) => allDeps.add(d))
    installed.add(component.name)
    console.log(pc.green(`  + ${component.name}`))
  }

  // 6. Update config
  config.components = Array.from(installed).sort()
  await writeConfig(config, cwd)

  // 7. Install npm dependencies (filter out already-installed base deps)
  const baseDeps = new Set(['clsx', 'tailwind-merge', 'lucide'])
  const newDeps = [...allDeps].filter((d) => !baseDeps.has(d))

  if (newDeps.length > 0) {
    console.log(pc.dim(`Installing dependencies: ${newDeps.join(', ')}`))
    const pm = detectPackageManager()
    const installCmd = getInstallCommand(pm, newDeps)
    try {
      await execAsync(installCmd, cwd)
    } catch (error) {
      console.warn(pc.yellow(`Warning: Could not install dependencies automatically.`))
      console.warn(pc.yellow(`Run: ${installCmd}`))
    }
  }

  console.log()
  console.log(pc.green('Components added successfully!'))
}
