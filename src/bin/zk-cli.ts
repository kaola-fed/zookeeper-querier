#!/usr/bin/env node

import * as yargs from "yargs";
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFileSync, existsSync } from 'fs';
import { createClient } from 'node-zookeeper-client';
import { LocalStorage } from 'node-localstorage';
import zk from '../lib/zk';
import assert from 'assert';

const args = yargs // eslint-disable-line
    .command('get [type] [path]', 'get path info', {
        builder(yargs) {
            return yargs
                .positional('type', {
                    describe: 'type to bind on'
                })
                .positional('path', {
                    describe: 'type to bind on'
                })
                .describe('depth', 'depth')
        },
        handler(argv) {
            if (argv.verbose) console.info(`start server on :${argv.port}`)
        }
    })
    .command('set [type] [value]', 'get path info', {
        builder(yargs) {
            return yargs
                .positional('type', {
                    describe: 'type to bind on'
                })
                .positional('value', {
                    describe: 'type to bind on'
                })
        },
        handler(argv) {
            if (argv.verbose) console.info(`start server on :${argv.port}`)
        }
    })
    .version(`1.0.0`)
    .help('help')
    .argv;


let registry;
const tempPath = join(tmpdir());
const localStorage = new LocalStorage(tempPath);

switch (args._[0]) {
    case 'set':
        assert(args.value, '请 `zk set ${type} ${value}` 设置合法的 value')
        localStorage.setItem(args.type, args.value);
        break;
    case 'get':
        const resgistry = localStorage.getItem('registry');
        assert(resgistry, '请 `zk set registry ${zkHost}` 设置 zkHost')
        zk(resgistry, <any>args);
}
