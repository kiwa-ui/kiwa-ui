import { Hono } from 'hono'
import { components as componentData, componentIndex } from '../generated/components'
import { checkLicenseHeader } from '../middleware/auth'
import type { Bindings, Variables } from '../types'

const components = new Hono<{ Bindings: Bindings; Variables: Variables }>()

components.get('/index.json', (c) => c.json(componentIndex))

components.get('/:name{.+\\.json$}', async (c) => {
  const nameParam = c.req.param('name')
  const name = nameParam.replace(/\.json$/, '')

  if (!name) {
    return c.json({ error: 'Component name required' }, 400)
  }

  const component = componentData[name]
  if (!component) {
    return c.json({ error: `Component '${name}' not found` }, 404)
  }

  if (!component.meta.free) {
    const result = await checkLicenseHeader(c)
    if (!result.ok) {
      return c.json({ error: result.error }, result.status)
    }
    c.set('license', result.license)
  }

  return c.json(component)
})

export { components }
