# zookeeper-querier

## 注意事项
* ⚠️ node 版本要求 v8.9.x 以上

## 快速开始
### 1. 安装到全局

```bash
$ npm i -g zookeeper-querier
```

### 2. 设置 zk 注册中心

```bash
$ zk set regsitry ${zkHost}
```

## 使用方法

### 1. 查询 children

```bash
$ zk get children /disconf
```

### 2. 查询 data
```bash
$ zk get data /disconf
```