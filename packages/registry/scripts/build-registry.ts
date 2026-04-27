import * as fs from 'node:fs'
import * as path from 'node:path'

const ROOT_DIR = path.resolve(import.meta.dirname, '../../..')
const REGISTRY_UI_DIR = path.join(ROOT_DIR, 'registry/ui')
const REGISTRY_LIB_DIR = path.join(ROOT_DIR, 'registry/lib')
const REGISTRY_BLOCKS_FREE_DIR = path.join(ROOT_DIR, 'registry/blocks/free')
const REGISTRY_BLOCKS_PRO_DIR = path.join(ROOT_DIR, 'registry/blocks/pro')
const OUTPUT_FILE = path.join(ROOT_DIR, 'packages/registry/src/generated/components.ts')

// Lib files that are always available via `hono-ui init` (no registry entry needed)
const BUILT_IN_LIBS = new Set(['utils'])

type ComponentFile = {
  name: string
  path: string
  content: string
}

type ComponentData = {
  name: string
  type: 'ui' | 'block'
  title: string
  description: string
  dependencies: string[]
  devDependencies: string[]
  registryDependencies: string[]
  files: ComponentFile[]
  meta: {
    free: boolean
    category: string
  }
}

const extractRegistryDependencyFromImport = (importPath: string) => {
  if (importPath.startsWith('@/components/')) {
    const segments = importPath.split('/')
    const name = segments[segments.length - 1]
    if (!name || name === 'index') return null
    return name
  }

  if (importPath.startsWith('@/lib/')) {
    const segments = importPath.split('/')
    const name = segments[segments.length - 1]
    if (!name || name === 'index' || BUILT_IN_LIBS.has(name)) return null
    return name
  }

  return null
}

const inferRegistryDependencies = (content: string) => {
  const dependencies = new Set<string>()
  const importPattern = /from\s+['"]([^'"]+)['"]/g

  for (const match of content.matchAll(importPattern)) {
    const importPath = match[1]
    const dependency = extractRegistryDependencyFromImport(importPath)

    if (dependency) {
      dependencies.add(dependency)
    }
  }

  return Array.from(dependencies).sort()
}

const mergeRegistryDependencies = (declared: string[], inferred: string[], name: string) =>
  Array.from(new Set([...declared, ...inferred])).filter((dep) => dep !== name).sort()

async function buildRegistry() {
  console.log('Building registry...')

  // Import component metadata
  const { componentMeta } = await import(path.join(REGISTRY_UI_DIR, 'index.ts'))

  // Scan for .tsx files (excluding index.ts)
  const files = fs.readdirSync(REGISTRY_UI_DIR).filter(
    (f) => f.endsWith('.tsx') && f !== 'index.ts'
  )

  const components: Record<string, ComponentData> = {}

  console.log('\nUI Components:')
  for (const file of files) {
    const name = file.replace('.tsx', '')
    const filePath = path.join(REGISTRY_UI_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    const meta = componentMeta[name]
    if (!meta) {
      console.warn(`Warning: No metadata found for ${name}, skipping`)
      continue
    }

    const inferredRegistryDependencies = inferRegistryDependencies(content)

    components[name] = {
      name,
      type: 'ui',
      title: meta.title,
      description: meta.description,
      dependencies: meta.dependencies || [],
      devDependencies: meta.devDependencies || [],
      registryDependencies: mergeRegistryDependencies(
        meta.registryDependencies || [],
        inferredRegistryDependencies,
        name,
      ),
      files: [
        {
          name: file,
          path: `components/ui/${file}`,
          content,
        },
      ],
      meta: {
        free: true,
        category: 'ui',
      },
    }

    console.log(`  + ${name}`)
  }

  // Build lib files (excluding built-in ones like utils)
  console.log('\nLib files:')
  if (fs.existsSync(REGISTRY_LIB_DIR)) {
    const libFiles = fs.readdirSync(REGISTRY_LIB_DIR).filter(
      (f) => f.endsWith('.ts') && !BUILT_IN_LIBS.has(f.replace('.ts', ''))
    )

    for (const file of libFiles) {
      const name = file.replace('.ts', '')
      const filePath = path.join(REGISTRY_LIB_DIR, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const inferredRegistryDependencies = inferRegistryDependencies(content)

      components[name] = {
        name,
        type: 'ui',
        title: name,
        description: `Shared ${name} library`,
        dependencies: [],
        devDependencies: [],
        registryDependencies: inferredRegistryDependencies.filter(
          (dep) => dep !== name,
        ),
        files: [
          {
            name: file,
            path: `lib/${file}`,
            content,
          },
        ],
        meta: {
          free: true,
          category: 'lib',
        },
      }

      console.log(`  + ${name}`)
    }
  }

  // Build free blocks
  console.log('\nFree Blocks:')
  
  // Import free block metadata if it exists
  let freeBlockMeta: Record<string, any> = {}
  try {
    const blockIndex = await import(path.join(REGISTRY_BLOCKS_FREE_DIR, 'index.ts'))
    freeBlockMeta = blockIndex.blockMeta || {}
  } catch {
    console.log('  No free block metadata found')
  }

  // Scan free marketing blocks
  const marketingDir = path.join(REGISTRY_BLOCKS_FREE_DIR, 'marketing')
  if (fs.existsSync(marketingDir)) {
    const marketingFiles = fs.readdirSync(marketingDir).filter(
      (f) => f.endsWith('.tsx')
    )

    for (const file of marketingFiles) {
      const name = file.replace('.tsx', '')
      const filePath = path.join(marketingDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const meta = freeBlockMeta[name]
      if (!meta) {
        console.warn(`  Warning: No metadata found for block ${name}, using defaults`)
      }

      const inferredRegistryDependencies = inferRegistryDependencies(content)

      components[name] = {
        name,
        type: 'block',
        title: meta?.title || name,
        description: meta?.description || '',
        dependencies: meta?.dependencies || ['clsx', 'tailwind-merge'],
        devDependencies: meta?.devDependencies || [],
        registryDependencies: mergeRegistryDependencies(
          meta?.registryDependencies || [],
          inferredRegistryDependencies,
          name,
        ),
        files: [
          {
            name: file,
            path: `components/blocks/marketing/${file}`,
            content,
          },
        ],
        meta: {
          free: true,
          category: meta?.category || 'marketing',
        },
      }

      console.log(`  + ${name} (marketing)`)
    }
  }

  // Scan free utility blocks
  const utilityDir = path.join(REGISTRY_BLOCKS_FREE_DIR, 'utility')
  if (fs.existsSync(utilityDir)) {
    const utilityFiles = fs.readdirSync(utilityDir).filter(
      (f) => f.endsWith('.tsx')
    )

    for (const file of utilityFiles) {
      const name = file.replace('.tsx', '')
      const filePath = path.join(utilityDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const meta = freeBlockMeta[name]
      if (!meta) {
        console.warn(`  Warning: No metadata found for block ${name}, using defaults`)
      }

      const inferredRegistryDependencies = inferRegistryDependencies(content)

      components[name] = {
        name,
        type: 'block',
        title: meta?.title || name,
        description: meta?.description || '',
        dependencies: meta?.dependencies || ['clsx', 'tailwind-merge'],
        devDependencies: meta?.devDependencies || [],
        registryDependencies: mergeRegistryDependencies(
          meta?.registryDependencies || [],
          inferredRegistryDependencies,
          name,
        ),
        files: [
          {
            name: file,
            path: `components/blocks/utility/${file}`,
            content,
          },
        ],
        meta: {
          free: true,
          category: meta?.category || 'utility',
        },
      }

      console.log(`  + ${name} (utility)`)
    }
  }

  // Build pro blocks
  console.log('\nPro Blocks:')
  
  // Import pro block metadata if it exists
  let proBlockMeta: Record<string, any> = {}
  try {
    const blockIndex = await import(path.join(REGISTRY_BLOCKS_PRO_DIR, 'index.ts'))
    proBlockMeta = blockIndex.blockMeta || {}
  } catch {
    console.log('  No pro block metadata found')
  }

  // Scan pro marketing blocks
  const proMarketingDir = path.join(REGISTRY_BLOCKS_PRO_DIR, 'marketing')
  if (fs.existsSync(proMarketingDir)) {
    const proMarketingFiles = fs.readdirSync(proMarketingDir).filter(
      (f) => f.endsWith('.tsx')
    )

    for (const file of proMarketingFiles) {
      const name = file.replace('.tsx', '')
      const filePath = path.join(proMarketingDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const meta = proBlockMeta[name]
      if (!meta) {
        console.warn(`  Warning: No metadata found for pro block ${name}, using defaults`)
      }

      const inferredRegistryDependencies = inferRegistryDependencies(content)

      components[name] = {
        name,
        type: 'block',
        title: meta?.title || name,
        description: meta?.description || '',
        dependencies: meta?.dependencies || ['clsx', 'tailwind-merge'],
        devDependencies: meta?.devDependencies || [],
        registryDependencies: mergeRegistryDependencies(
          meta?.registryDependencies || [],
          inferredRegistryDependencies,
          name,
        ),
        files: [
          {
            name: file,
            path: `components/blocks/marketing/${file}`,
            content,
          },
        ],
        meta: {
          free: false,
          category: meta?.category || 'marketing',
        },
      }

      console.log(`  + ${name} (pro/marketing)`)
    }
  }

  // Scan pro dashboard blocks
  const proDashboardDir = path.join(REGISTRY_BLOCKS_PRO_DIR, 'dashboard')
  if (fs.existsSync(proDashboardDir)) {
    const proDashboardFiles = fs.readdirSync(proDashboardDir).filter(
      (f) => f.endsWith('.tsx')
    )

    for (const file of proDashboardFiles) {
      const name = file.replace('.tsx', '')
      const filePath = path.join(proDashboardDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const meta = proBlockMeta[name]
      if (!meta) {
        console.warn(`  Warning: No metadata found for pro block ${name}, using defaults`)
      }

      const inferredRegistryDependencies = inferRegistryDependencies(content)

      components[name] = {
        name,
        type: 'block',
        title: meta?.title || name,
        description: meta?.description || '',
        dependencies: meta?.dependencies || ['clsx', 'tailwind-merge'],
        devDependencies: meta?.devDependencies || [],
        registryDependencies: mergeRegistryDependencies(
          meta?.registryDependencies || [],
          inferredRegistryDependencies,
          name,
        ),
        files: [
          {
            name: file,
            path: `components/blocks/dashboard/${file}`,
            content,
          },
        ],
        meta: {
          free: false,
          category: meta?.category || 'dashboard',
        },
      }

      console.log(`  + ${name} (pro/dashboard)`)
    }
  }

  // Scan pro AI blocks
  const proAiDir = path.join(REGISTRY_BLOCKS_PRO_DIR, 'ai')
  if (fs.existsSync(proAiDir)) {
    const proAiFiles = fs.readdirSync(proAiDir, { withFileTypes: true }).flatMap((entry) => {
      if (entry.isFile() && entry.name.endsWith('.tsx')) {
        return [entry.name]
      }

      if (entry.isDirectory()) {
        const nestedDir = path.join(proAiDir, entry.name)
        return fs.readdirSync(nestedDir)
          .filter((nestedFile) => nestedFile.endsWith('.tsx'))
          .map((nestedFile) => `${entry.name}/${nestedFile}`)
      }

      return []
    })

    for (const file of proAiFiles) {
      const name = path.basename(file, '.tsx')
      const filePath = path.join(proAiDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const meta = proBlockMeta[name]
      if (!meta) {
        console.warn(`  Warning: No metadata found for pro block ${name}, using defaults`)
      }

      const inferredRegistryDependencies = inferRegistryDependencies(content)

      components[name] = {
        name,
        type: 'block',
        title: meta?.title || name,
        description: meta?.description || '',
        dependencies: meta?.dependencies || ['clsx', 'tailwind-merge'],
        devDependencies: meta?.devDependencies || [],
        registryDependencies: mergeRegistryDependencies(
          meta?.registryDependencies || [],
          inferredRegistryDependencies,
          name,
        ),
        files: [
          {
            name: path.basename(file),
            path: `components/blocks/ai/${file}`,
            content,
          },
        ],
        meta: {
          free: false,
          category: meta?.category || 'ai',
        },
      }

      console.log(`  + ${name} (pro/ai)`)
    }
  }

  // Scan pro page blocks
  const proPagesDir = path.join(REGISTRY_BLOCKS_PRO_DIR, 'pages')
  if (fs.existsSync(proPagesDir)) {
    const proPagesFiles = fs.readdirSync(proPagesDir).filter(
      (f) => f.endsWith('.tsx')
    )

    for (const file of proPagesFiles) {
      const name = file.replace('.tsx', '')
      const filePath = path.join(proPagesDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const meta = proBlockMeta[name]
      if (!meta) {
        console.warn(`  Warning: No metadata found for pro block ${name}, using defaults`)
      }

      const inferredRegistryDependencies = inferRegistryDependencies(content)

      components[name] = {
        name,
        type: 'block',
        title: meta?.title || name,
        description: meta?.description || '',
        dependencies: meta?.dependencies || ['clsx', 'tailwind-merge'],
        devDependencies: meta?.devDependencies || [],
        registryDependencies: mergeRegistryDependencies(
          meta?.registryDependencies || [],
          inferredRegistryDependencies,
          name,
        ),
        files: [
          {
            name: file,
            path: `components/blocks/pages/${file}`,
            content,
          },
        ],
        meta: {
          free: false,
          category: meta?.category || 'pages',
        },
      }

      console.log(`  + ${name} (pro/pages)`)
    }
  }

  // Generate output file
  const output = `// Auto-generated by build-registry.ts - DO NOT EDIT
// Generated at: ${new Date().toISOString()}

export type ComponentFile = {
  name: string
  path: string
  content: string
}

export type ComponentData = {
  name: string
  type: 'ui' | 'block'
  title: string
  description: string
  dependencies: string[]
  devDependencies: string[]
  registryDependencies: string[]
  files: ComponentFile[]
  meta: {
    free: boolean
    category: string
  }
}

export const components: Record<string, ComponentData> = ${JSON.stringify(components, null, 2)}

export const componentIndex = Object.values(components).map((c) => ({
  name: c.name,
  type: c.type,
  title: c.title,
  description: c.description,
  free: c.meta.free,
}))
`

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_FILE, output)
  console.log(`\nGenerated ${OUTPUT_FILE}`)
  console.log(`Total components: ${Object.keys(components).length}`)
}

buildRegistry().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
