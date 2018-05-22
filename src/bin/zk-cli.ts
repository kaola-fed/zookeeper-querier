import * as yargs from "yargs";
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFileSync, existsSync } from 'fs';
import { createClient } from 'node-zookeeper-client';
import { LocalStorage } from 'node-localstorage';
import zk from '../lib/zk';


const args = yargs // eslint-disable-line
    .command('get [type] [path]', 'get path info', {
        builder(yargs) {
            return yargs
                .positional('type', {
                    describe: 'type to bind on',
                    default: 5000
                })
                .positional('path', {
                    describe: 'type to bind on',
                    default: 5000
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
                    describe: 'type to bind on',
                    default: 5000
                })
                .positional('value', {
                    describe: 'type to bind on',
                    default: 5000
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
        localStorage.setItem(args.type, args.value);
        break;
    case 'get':
        const resgistry = localStorage.getItem('registry');
        zk(resgistry, <any>args);
}
