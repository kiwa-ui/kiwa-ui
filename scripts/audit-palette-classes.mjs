#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { paletteClassAllowlist } from './palette-class-allowlist.mjs'

const registryDir = path.join(process.cwd(), 'registry')
const shouldFailOnFindings = process.argv.includes('--fail-on-findings')
const allowlistFile = 'scripts/palette-class-allowlist.mjs'

const extensions = new Set(['.ts', '.tsx', '.css'])

const utilities = ['bg', 'text', 'border', 'ring', 'fill', 'stroke']
const palettes = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]
const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

const paletteClassRegex = new RegExp(
  `^(?:${utilities.join('|')})-(?:${palettes.join('|')})-(?:${shades.join('|')})(?:\\/\\d{1,3})?$`,
)

const classTokenRegex = /[A-Za-z0-9_:/-]+/g
const normalizePath = (value) => value.replaceAll('\\', '/')

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

const findPaletteClassesInLine = (line) => {
  const matches = line.match(classTokenRegex) ?? []
  const findings = []

  for (const token of matches) {
    const className = token.split(':').pop() ?? ''
    if (paletteClassRegex.test(className)) {
      findings.push({
        token,
        className,
      })
    }
  }

  return findings
}

const validateAllowlist = () => {
  const errors = []

  paletteClassAllowlist.forEach((entry, index) => {
    const prefix = `Allowlist entry ${index + 1}`
    if (!entry.filePath || typeof entry.filePath !== 'string') {
      errors.push(`${prefix} is missing required string field "filePath".`)
    }

    if (!entry.reason || typeof entry.reason !== 'string') {
      errors.push(`${prefix} is missing required string field "reason".`)
    }

    if (!entry.token && !entry.className) {
      errors.push(`${prefix} must include either "token" or "className" for narrow scoping.`)
    }
  })

  return errors
}

const getAllowlistMatch = (finding) =>
  paletteClassAllowlist.find((entry) => {
    if (normalizePath(entry.filePath) !== finding.filePath) {
      return false
    }

    if (entry.token && entry.token !== finding.token) {
      return false
    }

    if (entry.className && entry.className !== finding.className) {
      return false
    }

    return true
  })

const run = async () => {
  const allowlistErrors = validateAllowlist()
  if (allowlistErrors.length > 0) {
    console.error(`Invalid allowlist configuration in ${allowlistFile}:`)
    for (const error of allowlistErrors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  const files = await walk(registryDir)
  const findings = []
  const violations = []
  const allowlisted = []
  const classCounts = new Map()
  const fileSet = new Set()

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      const lineFindings = findPaletteClassesInLine(line)
      for (const finding of lineFindings) {
        const entry = {
          filePath: normalizePath(path.relative(process.cwd(), filePath)),
          line: index + 1,
          token: finding.token,
          className: finding.className,
          sourceLine: line.trim(),
        }

        findings.push(entry)
        fileSet.add(entry.filePath)
        classCounts.set(finding.className, (classCounts.get(finding.className) ?? 0) + 1)

        const allowlistMatch = getAllowlistMatch(entry)
        if (allowlistMatch) {
          allowlisted.push({ ...entry, reason: allowlistMatch.reason })
        } else {
          violations.push(entry)
        }
      }
    })
  }

  if (findings.length === 0) {
    console.log('No raw palette utility classes found in registry/*.')
    return
  }

  if (allowlisted.length > 0) {
    console.log(
      `\nAllowlisted raw palette classes (${allowlisted.length}):\n`,
    )
    for (const finding of allowlisted) {
      console.log(
        `- ${finding.filePath}:${finding.line} -> ${finding.token}\n  reason: ${finding.reason}\n  ${finding.sourceLine}`,
      )
    }
  }

  if (violations.length === 0) {
    console.log(
      `\nOnly allowlisted raw palette utility classes found in registry/* (${allowlisted.length} usages in ${fileSet.size} files).`,
    )
    return
  }

  console.log(
    `\nRaw palette utility classes found in registry/* (${violations.length} violations, ${allowlisted.length} allowlisted):\n`,
  )

  for (const finding of violations) {
    console.log(`- ${finding.filePath}:${finding.line} -> ${finding.token}\n  ${finding.sourceLine}`)
  }

  const summary = [...classCounts.entries()].sort((a, b) => b[1] - a[1])
  console.log('\nSummary by class:')
  for (const [className, count] of summary) {
    console.log(`- ${className}: ${count}`)
  }

  console.log('\nAudit mode is non-blocking by default.')
  console.log('Run with `--fail-on-findings` to make this check blocking.')
  console.log(`Manage exceptions in ${allowlistFile}.`)

  if (shouldFailOnFindings && violations.length > 0) {
    process.exit(1)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
