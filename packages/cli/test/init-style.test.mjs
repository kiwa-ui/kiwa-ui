import test from 'node:test'
import assert from 'node:assert/strict'
import { execFile as execFileCb } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile, access } from 'node:fs/promises'
import { delimiter, dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFile = promisify(execFileCb)

const currentFile = fileURLToPath(import.meta.url)
const currentDir = dirname(currentFile)
const packageDir = resolve(currentDir, '..')
const cliEntry = resolve(packageDir, 'dist/index.js')

async function createFakePnpmBin(rootDir) {
  const binDir = join(rootDir, 'bin')
  await mkdir(binDir, { recursive: true })

  if (process.platform === 'win32') {
    await writeFile(join(binDir, 'pnpm.cmd'), '@echo off\r\nexit /b 0\r\n')
    return binDir
  }

  await writeFile(join(binDir, 'pnpm'), '#!/bin/sh\nexit 0\n', { mode: 0o755 })
  return binDir
}

async function runInitFixture() {
  const rootDir = await mkdtemp(join(tmpdir(), 'kiwa-ui-init-'))
  const workspaceDir = join(rootDir, 'workspace')
  await mkdir(workspaceDir, { recursive: true })
  await writeFile(join(workspaceDir, 'package.json'), '{"name":"fixture","private":true}\n')

  const fakeBinDir = await createFakePnpmBin(rootDir)
  const env = {
    ...process.env,
    PATH: `${fakeBinDir}${delimiter}${process.env.PATH ?? ''}`,
    npm_config_user_agent: 'pnpm/9.0.0',
  }

  await execFile(process.execPath, [cliEntry, 'init'], {
    cwd: workspaceDir,
    env,
  })

  const [globalsCss, rawConfig, rawTsconfig] = await Promise.all([
    readFile(join(workspaceDir, 'styles/globals.css'), 'utf8'),
    readFile(join(workspaceDir, 'kiwa-ui.json'), 'utf8'),
    readFile(join(workspaceDir, 'tsconfig.json'), 'utf8'),
  ])

  let tokensExists = true
  try {
    await access(join(workspaceDir, 'styles/tokens.css'))
  } catch {
    tokensExists = false
  }

  return {
    rootDir,
    globalsCss,
    tokensExists,
    config: JSON.parse(rawConfig),
    tsconfig: JSON.parse(rawTsconfig),
  }
}

test('init emits classic v1 globals contract only', async () => {
  const fixture = await runInitFixture()

  try {
    assert.ok(
      fixture.globalsCss.includes('--color-background: var(--background);'),
      'globals.css should expose shadcn color mappings',
    )
    assert.ok(
      fixture.globalsCss.includes('--color-primary-soft: var(--primary-soft);'),
      'globals.css should expose primary-soft utility mapping',
    )
    assert.ok(
      fixture.globalsCss.includes('--color-border-subtle: var(--border-subtle);'),
      'globals.css should expose subtle border utility mapping',
    )
    assert.ok(
      fixture.globalsCss.includes('--color-success-soft: var(--success-soft);'),
      'globals.css should expose success-soft utility mapping',
    )
    assert.ok(
      fixture.globalsCss.includes('--color-background-raised: var(--background-raised);'),
      'globals.css should keep the v1 raised background mapping',
    )
    assert.ok(
      fixture.tokensExists === false,
      'init should no longer emit styles/tokens.css',
    )
    assert.equal(
      fixture.tsconfig.compilerOptions.baseUrl,
      '.',
      'tsconfig.json should have baseUrl set to "."',
    )
    assert.deepEqual(
      fixture.tsconfig.compilerOptions.paths['@/*'],
      ['./*'],
      'tsconfig.json should have @/* path alias',
    )
    assert.equal(
      fixture.tsconfig.compilerOptions.jsxImportSource,
      'hono/jsx',
      'tsconfig.json should have jsxImportSource set to hono/jsx',
    )
  } finally {
    await rm(fixture.rootDir, { recursive: true, force: true })
  }
})
