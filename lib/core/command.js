const { LocalStorage } = require('node-localstorage');
const ZookeeperManager = require('./zookeeper-manager');
const inquirer = require('inquirer');
const { homedir } = require('os');
const { join } = require('path');
const assert = require('assert');


class Command {
  constructor(args) {
      const zkrc = join(homedir(), '.zkrc');
      this.args = args;
      this.localStorage = new LocalStorage(zkrc);
  }

  _getRegistryMap() {
      const registryString = this.localStorage.getItem('registry') || '{}';
      let registryMap;

      try {
          registryMap = JSON.parse(registryString);
      } catch(e) {
          registryMap = {};
      }

      return registryMap;
  }

  _getActiveRegistry() {
      const registryMap = this._getRegistryMap();
      const active = this.localStorage.getItem('active');
      assert(active && registryMap[active], 'Please excute `zk add [name] [address]` to add registry');
      const registry = registryMap[active];
      return registry;
  }

  add() {
      const { name, registry } = this.args;
      const registryMap = this._getRegistryMap();
      registryMap[name] = registry.replace('zookeeper://', '').replace('?backup=', ',');
      this.localStorage.setItem('registry', JSON.stringify(registryMap))
      this.localStorage.setItem('active', name);
  }

  async switch() {
      const registryMap = this._getRegistryMap();
      
      const { registry } = await inquirer.prompt([
          {
              type: 'list',
              name: 'registry',
              message: 'Which registry do you want to switch',
              choices: Object.entries(registryMap).map(([name, registry]) => (name))
          }
      ]);

      this.localStorage.setItem('active', registry);
  }

  async getData() {
      const registry = this._getActiveRegistry();
      let { path } = this.args;
      const zk = new ZookeeperManager({
          registry
      });

      path = path.replace(/[^^]\/$/, '');

      try {
          await zk.ready();
          await zk.getData(path);
      } catch(e) {
          console.error(e);
          zk.exit(1);
      }
  }

  async getChildren() {
      const registry = this._getActiveRegistry();
      let { path, depth } = this.args;
      const zk = new ZookeeperManager({
          registry
      });

      path = path.replace(/[^^]\/$/, '');

      try {
          await zk.ready();
          await zk.getChildren(path, {depth});
      } catch(e) {
          console.error(e);
          zk.exit(1);
      }
  }

  async mkdirp() {
    const registry = this._getActiveRegistry();
    let { path } = this.args;
    const zk = new ZookeeperManager({
        registry
    });

    path = path.replace(/[^^]\/$/, '');

    try {
        await zk.ready();
        await zk.mkdirp(path, Buffer.from(''));
    } catch(e) {
        console.error(e);
        zk.exit(1);
    }
  }

  excute(command) {
      const method = this[command];
      if (method) {
          method.call(this);
      }
  }
}

module.exports = Command;