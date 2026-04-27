#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const cliArgs = process.argv.slice(2)
const shouldFailOnFindings = cliArgs.includes('--fail-on-findings')
const requestedTargets = cliArgs.filter((arg) => arg !== '--fail-on-findings')
const defaultTargets = ['registry', 'docs/components', 'docs/app', 'packages/enhance/src']
const normalizePath = (value) => value.replaceAll('\\', '/')
const targetDirs = (requestedTargets.length > 0 ? requestedTargets : defaultTargets).map((dir) =>
  normalizePath(dir),
)
const extensions = new Set(['.ts', '.tsx', '.css'])

const classTokenRegex = /[A-Za-z0-9_:/\-[\].=&]+/g

const hardcodedNeutralRegex = /^(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:white|black)(?:\/\d{1,3})?$/

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

const findHardcodedNeutralsInLine = (line) => {
  const matches = line.match(classTokenRegex) ?? []
  const findings = []

  for (const token of matches) {
    const className = token.split(':').pop() ?? ''
    if (hardcodedNeutralRegex.test(className)) {
      findings.push({
        token,
        className,
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
      } catch (error) {
        throw new Error(`Black/white class audit target does not exist: ${targetDir}`)
      }

      return walk(absoluteDir)
    }),
  )
  const files = filesByTarget.flat()
  const findings = []
  const classCounts = new Map()

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      const lineFindings = findHardcodedNeutralsInLine(line)
      for (const finding of lineFindings) {
        findings.push({
          filePath: normalizePath(path.relative(process.cwd(), filePath)),
          line: index + 1,
          token: finding.token,
          className: finding.className,
          sourceLine: line.trim(),
        })
        classCounts.set(finding.className, (classCounts.get(finding.className) ?? 0) + 1)
      }
    })
  }

  if (findings.length === 0) {
    console.log(`No hardcoded black/white utility classes found in: ${targetDirs.join(', ')}`)
    return
  }

  console.log(
    `Hardcoded black/white utility classes found in ${targetDirs.join(', ')} (${findings.length}):\n`,
  )
  for (const finding of findings) {
    console.log(`- ${finding.filePath}:${finding.line} -> ${finding.token}\n  ${finding.sourceLine}`)
  }

  const summary = [...classCounts.entries()].sort((a, b) => b[1] - a[1])
  console.log('\nSummary by class:')
  for (const [className, count] of summary) {
    console.log(`- ${className}: ${count}`)
  }

  console.log(
    '\nUse shadcn-first utilities instead (bg-background, bg-card, text-primary-foreground, text-destructive-foreground, etc).',
  )

  if (shouldFailOnFindings) {
    process.exit(1)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
