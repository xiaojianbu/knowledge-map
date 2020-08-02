# React 和 Vue 的对比

没有绝对最好的前端框架，只有最合适的应用场景

react 和 vue 的 diff 过程有什么区别

- React 是这么干的：你给我一个数据，我根据这个数据生成一个全新的 Virtual DOM，然后跟我上一次生成的 Virtual DOM 去 diff，得到一个 Patch，然后把这个 Patch 打到浏览器的 DOM 上去。完事。并且这里的 Patch 显然不是完整的 Virtual DOM，而是新的 Virtual DOM 和上一次的 Virtual DOM 经过 diff 后的差异化的部分。
- Vue 在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。
- React 每当应用的状态被改变时，全部子组件都会重新渲染。这可以通过 shouldComponentUpdate 这个生命周期方法来进行控制。
- React diff 的是 Dom，而 Vue diff 的是数据。

## redux 和 vuex 的区别

redux 是 flux 的一种实现，redux 不单单可以用在 react 上面。

vuex 是 redux 的基础上进行改变，对仓库的管理更加明确。

数据流向不一样，vuex 的同异步有不同的流向，而 redux 的同异步是一样的。

redux 使用的是不可变的数据，而 vuex 的数据是可变的，redux 每次修改更新数据，其实就是用新的数据替换旧的数据，而 vuex 是直接修改原数据。

https://cn.vuejs.org/v2/guide/comparison.html
