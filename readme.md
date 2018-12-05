# zookeeper-querier

## 注意事项
* ⚠️ node 版本要求 v8.9.x 以上

## 快速开始
### 1. 安装到全局

```bash
$ npm i -g zookeeper-querier
```

### 2. 增加 registry

```bash
$ zk add test "zookeeper://10.237.12.1:2181,10.237.12.2:2181,10.237.12.3:2181"
$ zk add online "zookeeper://10.237.13.1:2181,10.237.13.2:2181,10.237.13.3:2181"
$ zk add testDisconf "zookeeper://10.237.14.1:2181,10.237.14.2:2181,10.237.14.3:2181"
```

## 使用方法
### 1. 切换需要查询的 registry
```bash
$ zk switch
```

### 2. 查询 children

```bash
$ zk getChildren /dubbo
```

### 3. 查询 data
```bash
$ zk getData /dubbo
```
