import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { components } from './routes/components'
import { auth } from './routes/auth'
import type { Bindings, Variables } from './types'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('/*', cors())

app.get('/', (c) => c.json({ status: 'ok', name: 'kiwa-ui-registry' }))

app.get('/robots.txt', (c) =>
  c.text('User-agent: *\nDisallow: /\n', 200, {
    'Content-Type': 'text/plain; charset=utf-8',
  }),
)

app.route('/r', components)
app.route('/auth', auth)

export default app
