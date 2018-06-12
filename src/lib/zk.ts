import { createClient } from 'node-zookeeper-client';
import { asTree } from 'treeify';
import * as path from 'path';

function getChildren(client, pathname): Promise<Array<any>> {
    return new Promise(function(resolve, reject) {
        client.getChildren(pathname, function(e, data) {
            if (e) {
                reject(e);
            } else {
                resolve(data);
            }
        })
    })
}

function getData(client, path) {
    return new Promise(function(resolve, reject) {
        client.getData(path, function(e, data) {
            if (e) {
                reject(e);
            } else {
                resolve(Buffer.isBuffer(data) ? data.toString(): data);
            }
        })
    })
}

function exists(client, path) {
    return new Promise(function(resolve, reject) {
        client.exists(path, function(e, exists) {
            if (e) {
                reject(e);
            } else {
                resolve(exists);
            }
        })
    })
}

async function getChildrenRecursion (
    client,
    pathname,
    parent = {}, {
        depth = 3,
        currentDepth = 1
    } = {},
    callback
) {

    if (currentDepth > depth) {
        return callback(null, parent);
    }

    currentDepth++;

    let children;

    try {
        children = await getChildren(client, pathname);
    } catch(e) {
        return callback(e);
    }

    if (children.length === 0) {
        callback(null, parent);
    } else {
        const promises = children.map(item => {
            Object.assign(parent, {
                [item]: {}
            })

            return getChildrenRecursionPromise(
                client,
                path.join(pathname, item),
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
            return callback(e);
        }

        callback(null, parent);
    }
}

async function getChildrenRecursionPromise (
    client,
    pathname,
    parent = {}, 
    options
) {
    return new Promise(function(resolve, reject) {
        getChildrenRecursion(client, pathname, parent, options, (e, parent) => {
            if (e) {
                reject(e);
            } else {
                resolve(parent);
            }
        })
    })
}


export default function(registry, {
    type, path: pathname, depth = 3
}) {
    const client = createClient(registry);
    let connected = false;

    let timeout = setTimeout(function() {
        if (connected) {
            console.error(`zk 节点 ${registry} 连接超时`);
            process.exit(1);
        }
    }, 5000);

    client.once('connected', async function () {
        connected = true;

        try {
            switch (type) {
                case 'data':
                    const data = await getData(client, pathname);
                    console.log(data);
                    
                    break;
                case 'children':
                    const parent = await getChildrenRecursionPromise(client, pathname, {}, { depth });
                    console.log(asTree(parent));
                    break;
            }
        } catch(e) {
            console.log(`registry: ${registry}`);
            console.log(`pathname: ${pathname}`);
            console.log(`message: ${e.message}`);
        }

        client.close();
        clearTimeout(timeout);
    });

    client.connect();

    
}