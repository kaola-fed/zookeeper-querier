#!/usr/bin/env node

const yargs = require('yargs');
const Command = require('../lib/core/command');

const args = yargs // eslint-disable-line
    .command('add [name] [registry]', 'add registry', {
        builder(yargs) {
            return yargs
                .positional('name', {
                    describe: 'registry alias'
                })
                .positional('registry', {
                    describe: 'registry address'
                })
        },
        handler(argv) {
        }
    })
    .command('switch', 'switch registry', {
        builder(yargs) {
            return yargs;
        },
        handler(argv) {
        }
    })
    .command('getData [path]', 'get zknode data', {
        builder(yargs) {
            return yargs
                .positional('path', {
                    describe: 'it\' the path which zknode\'s data you want to query'
                })
                .describe('depth', 'depth')
                .alias('d', 'depth')
        },
        handler(argv) {
        }
    })
    .command('getChildren [path]', 'get zknode children', {
        builder(yargs) {
            return yargs
                .positional('path', {
                    describe: 'it\' the path which zknode\'s children you want to query'
                })
                .describe('depth', 'depth')
        },
        handler(argv) {
        }
    })
    .version(`1.0.0`)
    .help('help')
    .argv;

(new Command(args)).excute(args._[0])