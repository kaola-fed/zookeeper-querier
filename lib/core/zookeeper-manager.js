const { createClient } = require('node-zookeeper-client');
const { asTree } = require('treeify');
const { posix } = require('path');
const Base = require('sdk-base');
const zookeeperTools = require('../utils/zookeeper-tools');

const logger = console;

class ZookeeperManager extends Base {
    constructor(options) {
        super(Object.assign({}, options, {
            initMethod: '_init'
        }))
    }

    get registry() {
        return this.options.registry;
    }

    async _init() {
        await this.connect();
    }

    async connect() {
        let client;
    
        try {
            client = createClient(this.registry);
            client.connect();
        } catch(e) {
            logger.error('Creating zk client occured error:\n', e);
            return this.exit(1);
        }

        try {
            await Promise.race([
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(`zk 节点 ${this.registry} 连接超时`);
                    }, 1000);
                }),
                new Promise((resolve) => {
                    client.once('connected', resolve);
                })
            ]); 
        } catch(e) {
            logger.error('Connecting zk client occured error:\n', e);
            return this.exit(1);
        }

        this.client = client;
    }

    async _getChildren (
        client,
        path,
        parent = {}, {
            depth = 3,
            currentDepth = 1
        } = {}
    ) {
    
        if (currentDepth > depth) {
            return Promise.resolve(parent);
        }
    
        currentDepth++;
    
        let children;
    
        try {
            children = await zookeeperTools.getChildren(client, path);
        } catch(e) {
            return Promise.reject(e);
        }
    
        if (children.length === 0) {
            return Promise.resolve(parent);
        } else {
            const promises = children.map(item => {
                Object.assign(parent, {
                    [item]: {}
                })

                return this._getChildren(
                    client,
                    posix.join(path, item),
                    parent[item], {
                        depth,
                        currentDepth
                    }
                ).then(result => {
                    if (Object.keys(result).length === 0) {
                        parent[item] = null;
                    }
                    return parent;
                });
            })
    
            try {
                await Promise.all(promises);
            } catch(e) {
                return Promise.reject(e);
            }
    
            return Promise.resolve(parent);
        }
    }

    async getChildren(path, options) {
        const nodes = await this._getChildren(this.client, path, {}, options);
        logger.info(`${path}'s children:\n` + asTree(nodes));
        this.exit();
    }

    async getData(path) {
        const data = await zookeeperTools.getData(this.client, path);
        logger.info(`${path}'s path:`, data);
        this.exit();
    }

    async getChildrenData(path, options) {
        const nodes = await this._getChildren(this.client, path, {}, options);
        let res = await Promise.all(Object.keys(nodes).map(async (node) => {
            let data = {}
            const nodeData = JSON.parse(await zookeeperTools.getData(this.client, posix.join(path, node)))
            data.id = nodeData.id
            data.name = nodeData.name
            data.env = nodeData.metadata && nodeData.metadata.env || ''
            data.stable_env = nodeData.metadata && nodeData.metadata.stable_env || ''
            return data
        }))

        res = res && res.length && res.sort((a, b) => {
            if(a.env < b.env) return -1
            return 1
        })

        // 需要node 10.0.0 以上
        console.table(res)
        this.exit()
    }

    async mkdirp(path, buffer) {
        await zookeeperTools.mkdirp(this.client, path, buffer);
        logger.info(`${path} is created`);
        this.exit();
    }

    exit(code = 0) {
        if (this.client) {
            this.client.close();
        }
        process.exit(code);
    }

}

module.exports = ZookeeperManager;
