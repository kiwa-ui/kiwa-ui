#!/usr/bin/env node
import { Command } from 'commander'
import { init } from './commands/init'
import { add } from './commands/add'
import { diff } from './commands/diff'

const program = new Command()

program
  .name('hono-ui')
  .description('Add Hono UI components to your project')
  .version('1.0.1')

const initCommand = program
  .command('init')
  .description('Initialize hono-ui in your project')
  .option('-f, --force', 'Overwrite existing configuration')
  .action(init)

initCommand.addHelpText(
  'after',
  `
Examples:
  $ hono-ui init
  $ hono-ui init --force
`
)

program
  .command('add')
  .description('Add components to your project')
  .argument('<components...>', 'Components to add')
  .action(add)

program
  .command('diff')
  .description('Check for updates to installed components')
  .option('--apply', 'Apply available updates')
  .action(diff)

program.parse()
