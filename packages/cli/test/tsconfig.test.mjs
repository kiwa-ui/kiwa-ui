import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const {
  detectSourceRoot,
  analyzeTsconfig,
  addPathAliasToExisting,
  generateDefaultTsconfig,
} = await import('../dist/utils/tsconfig.js')

async function withTmpDir(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'hono-ui-tsconfig-'))
  try {
    await fn(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

// --- detectSourceRoot ---

test('detectSourceRoot returns "." when no src/ exists', async () => {
  await withTmpDir(async (dir) => {
    assert.equal(detectSourceRoot(dir), '.')
  })
})

test('detectSourceRoot returns "./src" when src/ has entry files', async () => {
  await withTmpDir(async (dir) => {
    await mkdir(join(dir, 'src'), { recursive: true })
    await writeFile(join(dir, 'src/index.ts'), '')
    assert.equal(detectSourceRoot(dir), './src')
  })
})

test('detectSourceRoot returns "." when src/ exists but has no entry files', async () => {
  await withTmpDir(async (dir) => {
    await mkdir(join(dir, 'src'), { recursive: true })
    await writeFile(join(dir, 'src/random.ts'), '')
    assert.equal(detectSourceRoot(dir), '.')
  })
})

// --- analyzeTsconfig ---

test('analyzeTsconfig returns exists=false when no tsconfig', async () => {
  await withTmpDir(async (dir) => {
    const result = await analyzeTsconfig(dir)
    assert.equal(result.exists, false)
    assert.equal(result.hasBaseUrl, false)
    assert.equal(result.hasPathAlias, false)
    assert.equal(result.raw, null)
  })
})

test('analyzeTsconfig detects baseUrl and paths', async () => {
  await withTmpDir(async (dir) => {
    await writeFile(
      join(dir, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          baseUrl: '.',
          paths: { '@/*': ['./*'] },
          jsxImportSource: 'hono/jsx',
        },
      }),
    )
    const result = await analyzeTsconfig(dir)
    assert.equal(result.exists, true)
    assert.equal(result.hasBaseUrl, true)
    assert.equal(result.hasPathAlias, true)
    assert.equal(result.hasHonoJsx, true)
  })
})

test('analyzeTsconfig detects missing jsxImportSource', async () => {
  await withTmpDir(async (dir) => {
    await writeFile(
      join(dir, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: { strict: true } }),
    )
    const result = await analyzeTsconfig(dir)
    assert.equal(result.exists, true)
    assert.equal(result.hasHonoJsx, false)
  })
})

test('analyzeTsconfig handles extends chain with paths in base', async () => {
  await withTmpDir(async (dir) => {
    await writeFile(
      join(dir, 'base.json'),
      JSON.stringify({
        compilerOptions: {
          baseUrl: '.',
          paths: { '@/*': ['./*'] },
        },
      }),
    )
    await writeFile(
      join(dir, 'tsconfig.json'),
      JSON.stringify({
        extends: './base.json',
        compilerOptions: { strict: true },
      }),
    )
    const result = await analyzeTsconfig(dir)
    assert.equal(result.hasBaseUrl, true)
    assert.equal(result.hasPathAlias, true)
  })
})

test('analyzeTsconfig handles extends chain without paths in base', async () => {
  await withTmpDir(async (dir) => {
    await writeFile(
      join(dir, 'base.json'),
      JSON.stringify({ compilerOptions: { strict: true } }),
    )
    await writeFile(
      join(dir, 'tsconfig.json'),
      JSON.stringify({
        extends: './base.json',
        compilerOptions: { target: 'ES2022' },
      }),
    )
    const result = await analyzeTsconfig(dir)
    assert.equal(result.hasBaseUrl, false)
    assert.equal(result.hasPathAlias, false)
  })
})

// --- addPathAliasToExisting ---

test('adds baseUrl and paths to existing tsconfig without them', () => {
  const input = JSON.stringify(
    { compilerOptions: { strict: true } },
    null,
    2,
  )
  const result = addPathAliasToExisting(input, '.')
  const parsed = JSON.parse(result)
  assert.equal(parsed.compilerOptions.baseUrl, '.')
  assert.deepEqual(parsed.compilerOptions.paths['@/*'], ['./*'])
  assert.equal(parsed.compilerOptions.strict, true)
})

test('adds only paths when baseUrl already set', () => {
  const input = JSON.stringify(
    { compilerOptions: { baseUrl: '.', strict: true } },
    null,
    2,
  )
  const result = addPathAliasToExisting(input, '.')
  const parsed = JSON.parse(result)
  assert.equal(parsed.compilerOptions.baseUrl, '.')
  assert.deepEqual(parsed.compilerOptions.paths['@/*'], ['./*'])
})

test('preserves comments in existing tsconfig', () => {
  const input = `{
  // This is a comment
  "compilerOptions": {
    "strict": true
  }
}`
  const result = addPathAliasToExisting(input, '.')
  assert.ok(result.includes('// This is a comment'), 'comment should be preserved')
  const cleaned = result.replace(/\/\/.*$/gm, '').replace(/,\s*}/g, '}')
  const parsed = JSON.parse(cleaned)
  assert.equal(parsed.compilerOptions.baseUrl, '.')
  assert.deepEqual(parsed.compilerOptions.paths['@/*'], ['./*'])
})

test('skips when @/ alias already exists', () => {
  const input = JSON.stringify(
    {
      compilerOptions: {
        baseUrl: '.',
        paths: { '@/*': ['./custom/*'] },
      },
    },
    null,
    2,
  )
  const result = addPathAliasToExisting(input, '.')
  const parsed = JSON.parse(result)
  assert.deepEqual(
    parsed.compilerOptions.paths['@/*'],
    ['./custom/*'],
    'should not overwrite existing @/* path',
  )
})

test('uses ./src/* path when sourceRoot is ./src', () => {
  const input = JSON.stringify(
    { compilerOptions: { strict: true } },
    null,
    2,
  )
  const result = addPathAliasToExisting(input, './src')
  const parsed = JSON.parse(result)
  assert.deepEqual(parsed.compilerOptions.paths['@/*'], ['./src/*'])
})

// --- generateDefaultTsconfig ---

test('generates default tsconfig with root source layout', () => {
  const result = generateDefaultTsconfig('.')
  const parsed = JSON.parse(result)
  assert.equal(parsed.compilerOptions.baseUrl, '.')
  assert.deepEqual(parsed.compilerOptions.paths['@/*'], ['./*'])
  assert.equal(parsed.compilerOptions.jsxImportSource, 'hono/jsx')
  assert.equal(parsed.compilerOptions.jsx, 'react-jsx')
  assert.deepEqual(parsed.include, ['.'])
})

test('generates default tsconfig with src/ source layout', () => {
  const result = generateDefaultTsconfig('./src')
  const parsed = JSON.parse(result)
  assert.deepEqual(parsed.compilerOptions.paths['@/*'], ['./src/*'])
  assert.deepEqual(parsed.include, ['src'])
})
