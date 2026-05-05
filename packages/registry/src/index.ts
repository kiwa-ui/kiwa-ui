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

app.get('/schema.json', (c) =>
  c.json({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Kiwa UI configuration',
    description: 'Schema for kiwa-ui.json — see https://kiwaui.com/docs',
    type: 'object',
    additionalProperties: false,
    required: ['tailwind', 'aliases', 'components'],
    properties: {
      $schema: { type: 'string', format: 'uri' },
      tsconfig: {
        type: 'string',
        description: 'Path to your tsconfig file, relative to the project root.',
      },
      tailwind: {
        type: 'object',
        additionalProperties: false,
        required: ['config', 'css'],
        properties: {
          config: { type: 'string', description: 'Path to your Tailwind config file.' },
          css: { type: 'string', description: 'Path to your global CSS entry file.' },
        },
      },
      aliases: {
        type: 'object',
        additionalProperties: false,
        required: ['components', 'utils'],
        properties: {
          components: {
            type: 'string',
            description: 'Import alias for the components directory (e.g. "@/components").',
          },
          utils: {
            type: 'string',
            description: 'Import alias for the utils file (e.g. "@/lib/utils").',
          },
        },
      },
      components: {
        type: 'array',
        description: 'Names of installed components, written by the CLI.',
        items: { type: 'string' },
      },
    },
  }),
)

app.route('/r', components)
app.route('/auth', auth)

export default app
