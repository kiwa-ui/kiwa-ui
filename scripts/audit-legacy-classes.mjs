#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

console.warn('[deprecated] scripts/audit-legacy-classes.mjs now forwards to scripts/audit-semantic-classes.mjs')

const scriptPath = path.join(process.cwd(), 'scripts', 'audit-semantic-classes.mjs')
const result = spawnSync(process.execPath, [scriptPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
})

process.exit(result.status ?? 1)
