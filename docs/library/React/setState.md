# setState

isBatchUpdate true: 则压入执行队列，异步；false：拿出执行队列一起执行，同步

钩子函数和 React 合成事件中的 setState

1. 调用 setState 不会立即更新
2. 所有组件使用的是同一套更新机制，当所有组件 didmount 后，父组件 didmount，然后执行更新
3. 更新时会把每个组件的更新合并，每个组件只会触发一次更新的生命周期。

异步函数和原生事件中的 setState

1. 在父组件 didmount 后执行
2. 调用 setState 同步更新

setState 只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout 中都是同步的。

setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的 callback 拿到更新后的结果。

setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和 setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 setState ， setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

## setState 为何需要异步

可能会一次执行多次 setState

你无法规定、限制用户如何使用 setState

没必要每次 setState 都重新渲染, 考虑性能

即便是每次重新渲染, 用户也看不到中间的效果

## setState 的过程

每个组件实例, 都有 renderComponent 方法

执行 renderComponent 会重新执行实例的 render

render 函数返回 newVnode, 然后拿到 preVnode

React 中 setState 的执行机制，如何有效的管理状态

## 回调函数作为 setState（）的参数的目的是什么

setState() 的第二个参数为可选的回调函数，它将在 setState 完成合并并重新渲染组件后执行。通常，我们建议使用 componentDidUpdate() 来代替此方式。

## react 调用 setState 之后发生了什么

1. 将 setState 传入的 partialState 参数存储在当前组件实例的 state 暂存队列中。
2. 判断当前 React 是否处于批量更新状态，如果是，将当前组件加入待更新的组件队列中。
3. 如果未处于批量更新状态，将批量更新状态标识设置为 true，用事务再次调用前一步方法，保证当前组件加入到了待更新组件队列中。
4. 调用事务的 waper 方法，遍历待更新组件队列依次执行更新。
5. 执行生命周期 componentWillReceiveProps。
6. 将组件的 state 暂存队列中的 state 进行合并，获得最终要更新的 state 对象，并将队列置为空。
7. 执行生命周期 componentShouldUpdate，根据返回值判断是否要继续更新。
8. 执行生命周期 componentWillUpdate。
9. 执行真正的更新，render。
10. 执行生命周期 componentDidUpdate。

如果处于批量更新模式，也就是 isBatchingUpdates 为 true 时，不进行 state 的更新操作，而是将需要更新的 component 添加到 dirtyComponents 数组中；如果不处于批量更新模式，对所有队列中的更新执行 batchedUpdates 方法，往下看下去就知道是用事务的方式批量的进行 component 的更新，事务在下面。
