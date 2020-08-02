# setState

isBatchUpdate true: 则压入执行队列，异步；false：拿出执行队列一起执行，同步

setState 的异步

Vue 修改属性也是异步

setState 的过程

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
