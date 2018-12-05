module.exports = {
    getChildren(client, path) {
        return new Promise(function (resolve, reject) {
            try {
                client.getChildren(path, function (e, data) {
                    if (e) {
                        switch (e.code) {
                            case -102:
                                resolve([]);
                                break;
                            default:
                                reject(e);
                        }
                    } else {
                        resolve(data);
                    }
                })
            } catch (e) {
                reject(e);
            }
        })
    },
    getData(client, path) {
        return new Promise(function (resolve, reject) {
            try {
                client.getData(path, function (e, data) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(Buffer.isBuffer(data) ? data.toString() : data);
                    }
                })
            } catch (e) {
                reject(e);
            }
        })
    },
    mkdirp(client, path, buffer) {
        return new Promise(function (resolve, reject) {
            try {
                client.mkdirp(path, buffer, function (e, data) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve();
                    }
                })
            } catch (e) {
                reject(e);
            }
        })
    }
}