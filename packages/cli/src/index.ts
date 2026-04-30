#!/usr/bin/env node
import { Command } from 'commander'
import { init } from './commands/init'
import { add } from './commands/add'
import { diff } from './commands/diff'

const program = new Command()

program
  .name('kiwa-ui')
  .description('Add Kiwa UI components to your project')
  .version('2.1.0')

const initCommand = program
  .command('init')
  .description('Initialize kiwa-ui in your project')
  .option('-f, --force', 'Overwrite existing configuration')
  .action(init)

initCommand.addHelpText(
  'after',
  `
Examples:
  $ kiwa-ui init
  $ kiwa-ui init --force
`
)

const addCommand = program
  .command('add')
  .description('Add components to your project')
  .argument('[components...]', 'Components to add')
  .option('-a, --all', 'Add all free UI primitives')
  .action(add)

addCommand.addHelpText(
  'after',
  `
Examples:
  $ kiwa-ui add button card
  $ kiwa-ui add --all
`
)

program
  .command('diff')
  .description('Check for updates to installed components')
  .option('--apply', 'Apply available updates')
  .action(diff)

program.parse()
