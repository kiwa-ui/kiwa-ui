const REGISTRY_URL = process.env.HONO_UI_REGISTRY_URL || 'https://registry.honoui.com'

export interface RegistryComponent {
  name: string
  type: 'ui' | 'block' | 'starter'
  title: string
  description: string
  dependencies: string[]
  devDependencies: string[]
  registryDependencies: string[]
  files: {
    name: string
    path: string
    content: string
  }[]
  meta: {
    free: boolean
    category: string
  }
}

export async function fetchComponent(
  name: string,
  token?: string
): Promise<RegistryComponent> {
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${REGISTRY_URL}/r/${name}.json`, { headers })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(`Component "${name}" requires a valid license key`)
    }
    throw new Error(`Failed to fetch component "${name}": ${response.statusText}`)
  }

  return response.json()
}

export async function fetchIndex(token?: string): Promise<RegistryComponent[]> {
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${REGISTRY_URL}/r/index.json`, { headers })

  if (!response.ok) {
    throw new Error(`Failed to fetch registry index: ${response.statusText}`)
  }

  return response.json()
}
