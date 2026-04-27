#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const cliArgs = process.argv.slice(2)
const shouldFailOnFindings = cliArgs.includes('--fail-on-findings')
const requestedTargets = cliArgs.filter((arg) => arg !== '--fail-on-findings')
const defaultTargets = ['registry', 'docs/app', 'packages/enhance/src', 'docs/styles', 'templates/styles']
const normalizePath = (value) => value.replaceAll('\\', '/')
const targetDirs = (requestedTargets.length > 0 ? requestedTargets : defaultTargets).map((dir) =>
  normalizePath(dir),
)

const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.css'])
const classTokenRegex = /[A-Za-z0-9_:/\-[\].=&]+/g

const semanticClassRegex = new RegExp(
  '^(?:bg|text|border|ring|fill|stroke|from|to|via)-' +
    '(?:canvas|surface(?:-subtle|-sunken|-overlay|-white)?|' +
    'fg(?:-muted|-subtle|-inverse)?|' +
    'border-default|field-border|primary-fg|secondary-fg|' +
    'danger(?:-contrast|-soft|-hover|-fg)?|scrim|focus)' +
    '(?:\\/\\d{1,3})?$',
)

const semanticVarRegexes = [
  /--color-(?:canvas|surface(?:-subtle|-sunken|-overlay|-white)?|scrim|fg(?:-muted|-subtle|-inverse)?|border-default|focus|primary-fg|secondary-fg|danger(?:-soft|-hover|-contrast|-fg)?|field(?:-border|-placeholder)?)/g,
  /--text-on-action/g,
  /--(?:action|state)-[a-z0-9-]+/g,
  /var\(--(?:action|state)-[a-z0-9-]+\)/g,
  /var\(--text-on-action\)/g,
]

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return walk(absolutePath)
      }
      if (entry.isFile() && extensions.has(path.extname(entry.name))) {
        return [absolutePath]
      }
      return []
    }),
  )

  return files.flat()
}

const findSemanticClassesInLine = (line) => {
  const matches = line.match(classTokenRegex) ?? []
  const findings = []

  for (const token of matches) {
    const className = token.split(':').pop() ?? ''
    if (semanticClassRegex.test(className)) {
      findings.push({
        kind: 'class',
        token,
        normalized: className,
      })
    }
  }

  return findings
}

const findSemanticVarsInLine = (line) => {
  const findings = []

  for (const regex of semanticVarRegexes) {
    for (const match of line.matchAll(regex)) {
      findings.push({
        kind: 'variable',
        token: match[0],
        normalized: match[0],
      })
    }
  }

  return findings
}

const run = async () => {
  const filesByTarget = await Promise.all(
    targetDirs.map(async (targetDir) => {
      const absoluteDir = path.join(process.cwd(), targetDir)
      try {
        const dirStat = await stat(absoluteDir)
        if (!dirStat.isDirectory()) {
          throw new Error(`Not a directory: ${targetDir}`)
        }
      } catch {
        throw new Error(`Semantic class audit target does not exist: ${targetDir}`)
      }

      return walk(absoluteDir)
    }),
  )

  const files = filesByTarget.flat()
  const findings = []
  const tokenCounts = new Map()

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      const lineFindings = [...findSemanticClassesInLine(line), ...findSemanticVarsInLine(line)]
      for (const finding of lineFindings) {
        findings.push({
          filePath: normalizePath(path.relative(process.cwd(), filePath)),
          line: index + 1,
          token: finding.token,
          kind: finding.kind,
          sourceLine: line.trim(),
        })
        tokenCounts.set(finding.normalized, (tokenCounts.get(finding.normalized) ?? 0) + 1)
      }
    })
  }

  if (findings.length === 0) {
    console.log(`No semantic legacy classes/variables found in: ${targetDirs.join(', ')}`)
    return
  }

  console.log(
    `Semantic legacy classes/variables found in ${targetDirs.join(', ')} (${findings.length}):\n`,
  )

  for (const finding of findings) {
    console.log(
      `- ${finding.filePath}:${finding.line} [${finding.kind}] -> ${finding.token}\n  ${finding.sourceLine}`,
    )
  }

  const summary = [...tokenCounts.entries()].sort((a, b) => b[1] - a[1])
  console.log('\nSummary by token:')
  for (const [token, count] of summary) {
    console.log(`- ${token}: ${count}`)
  }

  console.log(
    '\nUse shadcn-first classes and variables (for example bg-background, bg-card, text-foreground, border-border, focus-visible:border-ring, focus-visible:ring-ring/20).',
  )

  if (shouldFailOnFindings) {
    process.exit(1)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
