# Redux

## 三大原则

单一数据源

State 是只读的

使用纯函数来执行修改

## 图解

Redux 单向性的数据流

Store — 数据存储中心，同时连接着 Actions 和 Views（React Components）

1. Store 需要负责接收 Views 传来的 Action
2. 然后，根据 Action.type 和 Action.payload 对 Store 里的数据进行修改
3. 最后，Store 还需要通知 Views，数据有改变，Views 便去获取最新的 Store 数据，通过 setState 进行重新渲染组件（re-render）

每一个 Store 实例都拥有 dispatch 方法，Views 只需要通过调用该方法，并传入 action 对象作为形参，Store 自然就就可以收到 Action。

数据修改逻辑写在 Reducer（一个纯函数）里，Store 实例在创建的时候，就会被传递这样一个 reducer 作为形参，这样 Store 就可以通过 Reducer 的返回值更新内部数据了

每一个 Store 实例都提供一个 subscribe 方法，Views 只需要调用该方法注册一个回调（内含 setState 操作），之后在每次 dispatch(action)时，该回调都会被触发，从而实现重新渲染；对于最新的 Store 数据，可以通过 Store 实例提供的另一个方法 getState 来获取

### Reducer

Reducer 是一个纯函数，用来修改 Store 数据的。接收一个旧的 prevState，返回一个新的 nextState。

Reducer 修改数据的好处：

1. 数据拆解
2. 数据不可变（immutability）

单一 Store 存储数据，就有可能面临着另一个问题：数据结构嵌套太深，数据访问变得繁琐。

通过定义多个 reducer 对数据进行拆解访问或者修改，最终再通过 combineReducers 函数将零散的数据拼装回去

### Middleware 中间件机制

中间件讲究的是对数据的流式处理，在 Redux 中，Middlerwares 要处理的对象则是：Action。

每个中间件可以针对 Action 的特征，可以采取不同的操作，既可以选择传递给下一个中间件，如：next(action)，也可以选择跳过某些中间件，如：dispatch(action)，或者更直接了当的结束传递，如：return。

标准的 action 应该是一个 plain object，但是对于中间件而言，action 还可以是函数，也可以是 promise 对象，或者一个带有特殊含义字段的对象，但不管怎样，因为中间件会对特定类型 action 做一定的转换，所以最后传给 reducer 的 action 一定是标准的 plain object。

## react-redux

react-redux 主要暴露出两个 api：

1. Provider 组件
2. connect 方法

### Provider

Provider 存在的意义在于：想通过 context 的方式将唯一的数据源 store 传递给任意想访问的子孙组件。

### connect

Redux 中的 connect 方法，跟 Reflux.connect 方法有点类似，最主要的目的就是：让 Component 与 Store 进行关联，即 Store 的数据变化可以及时通知 Views 重新渲染。

connect 怎么实现

高阶组件、context 注入 store、subscribe 订阅 store 数据变化

### Redux-Saga

以 Redux 中间件 的形式而存在，主要是为了更优雅地 管理 Redux 应用程序中的 副作用（Side Effects）。
