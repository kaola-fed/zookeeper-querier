# zookeeper-querier

## 快速开始
### 1. 安装到全局

```bash
$ npm i -g zookeeper-querier
```

### 2. 设置 zk 注册中心

```bash
$ zk set regsitry ${zkHost}
```

### 3. 查询 children

```bash
$ zk get children /disconf
```

### 4. 查询 data
```bash
$ zk get data /disconf
```