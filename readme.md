# zookeeper-querier

## Required
* ⚠️ Node >= 8

## Quick start
### 1. Install

```bash
$ npm i -g zookeeper-querier
```

### 2. Add registry

```bash
$ zk add test "zookeeper://10.237.12.1:2181,10.237.12.2:2181,10.237.12.3:2181"
$ zk add online "zookeeper://10.237.13.1:2181,10.237.13.2:2181,10.237.13.3:2181"
$ zk add testDisconf "zookeeper://10.237.14.1:2181,10.237.14.2:2181,10.237.14.3:2181"
```

## Usage
### 1. Switch registry
```bash
$ zk switch
```

### 2. Query children

```bash
$ zk getChildren /dubbo
```

### 3. Query data
```bash
$ zk getData /dubbo
```

## LICENSE
MIT