# 高阶组件

高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件。

react-redux 的 connect 函数，把 redux 的 state 和 action 创建函数，通过 props 注入给了 Component，在目标组件 Component 里面可以直接用 this.props 去调用 redux state 和 action 创建函数了

```js
// connect是一个返回函数的函数（就是个高阶函数）
const enhance = connect(mapStateToProps, mapDispatchToProps)
// 返回的函数就是一个高阶组件，该高阶组件返回一个与Redux store
// 关联起来的新组件
const ConnectedComment = enhance(Component)
```
