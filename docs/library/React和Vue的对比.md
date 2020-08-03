# React 和 Vue 的对比

没有绝对最好的前端框架，只有最合适的应用场景

相同点

- 使用 Virtual DOM
- 组件化

不同点

- JSX vs Templates
- react 整体是函数式的思想，把组件设计成纯组件，状态和逻辑通过参数传入，所以在 react 中，是单向数据流，推崇结合 immutable 来实现数据不可变。vue 的思想是响应式的，也就是基于是数据可变的，通过对每一个属性建立 Watcher 来监听，当属性变化的时候，响应式的更新对应的虚拟 dom。

react 和 vue 的 diff 过程有什么区别

- React 是这么干的：你给我一个数据，我根据这个数据生成一个全新的 Virtual DOM，然后跟我上一次生成的 Virtual DOM 去 diff，得到一个 Patch，然后把这个 Patch 打到浏览器的 DOM 上去。完事。并且这里的 Patch 显然不是完整的 Virtual DOM，而是新的 Virtual DOM 和上一次的 Virtual DOM 经过 diff 后的差异化的部分。
- Vue 在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。
- React 每当应用的状态被改变时，全部子组件都会重新渲染。这可以通过 shouldComponentUpdate 这个生命周期方法来进行控制。
- React diff 的是 Dom，而 Vue diff 的是数据。

React Hook 和 Vue Hook 对比

React Hook 的限制较多

1. 不要在循环，条件或嵌套函数中调用 Hook
2. 确保总是在你的 React 函数的最顶层调用他们。

Vue Hook

- 与 React Hook 不同，setup 函数仅被调用一次
- 对调用顺序没什么要求，每次渲染中不会反复调用 Hook 函数
- 不必考虑几乎总是需要 useCallback 的问题，以防止传递函数 prop 给子组件的引用变化，导致无必要的重新渲染
- React Hook 忘记传递正确的依赖项数组，useEffect 和 useMemo 可能会捕获过时的变量

## redux 和 vuex 的区别

redux 是 flux 的一种实现，redux 不单单可以用在 react 上面。

vuex 是 redux 的基础上进行改变，对仓库的管理更加明确。

Redux 的三大原则：
（1）单一数据源（一个 Redux 应用只有一个 store），也是单向的数据流；
（2）state 只读（唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。
（3）使用纯函数（reducer）来修改 state。

Vuex 的三大原则：
a. 应用层级的状态应该集中到单个 store 对象中。
b. 提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。
c. 异步逻辑都应该封装到 action 里面。

数据流向不一样，vuex 的同异步有不同的流向，而 redux 的同异步是一样的。

redux 使用的是不可变的数据，而 vuex 的数据是可变的，redux 每次修改更新数据，其实就是用新的数据替换旧的数据，而 vuex 是直接修改原数据。

Redux： view——>actions——>reducer——>state 变化——>view 变化（同步异步一样）

Vuex： view——>commit——>mutations——>state 变化——>view 变化（同步操作） view——>dispatch——>actions——>mutations——>state 变化——>view 变化（异步操作）
