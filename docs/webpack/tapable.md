# Tapable

webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable, webpack 中最核心的负责编译的 Compiler 和负责创建 bundles 的 Compilation 都是 Tapable 的实例。

暴露出很多的钩子，可以使用它们为插件创建钩子函数

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require('tapable')
```

```js
// 使用
class Order {
  constructor() {
    this.hooks = {
      //hooks
      goods: new SyncHook(['goodsId', 'number']),
      consumer: new AsyncParallelHook(['userId', 'orderId'])
    }
  }

  queryGoods(goodsId, number) {
    this.hooks.goods.call(goodsId, number)
  }

  consumerInfoPromise(userId, orderId) {
    this.hooks.consumer.promise(userId, orderId).then(() => {
      //TODO
    })
  }

  consumerInfoAsync(userId, orderId) {
    this.hooks.consumer.callAsync(userId, orderId, (err, data) => {
      //TODO
    })
  }
}
```

- 插件注册数量
- 插件注册的类型（sync, async, promise）
- 调用的方式（sync, async, promise）
- 实例钩子的时候参数数量
- 是否使用了 interception

## 参考

[webpack 详解](https://juejin.im/post/5aa3d2056fb9a028c36868aa)

[脑壳疼的 Webpack-tapable](https://juejin.im/post/5cb43b3e5188251b2b20b7ed)
