# hooks

React 本质是一个 UI Library,并不是框架，React 本身不解决应用中的数据流问题，父子组件之间状态共享一直没有成熟的解决方案(minix -> HOC -> hooks)

mount 阶段 单链表

update 阶段 循环链表

在 hooks 中每一次 render 都有自己的 state 和 props

useMemo 与 useCallback 的区别

- useCallback: 一般用于缓存函数
- useMemo: 一般用于缓存组件

常用的有哪些？都有什么作用？

如何使用 hook 在依赖改变的时候重新发送请求？

写过自定义 hook 吗？解决了哪些问题。

讲讲 React Hooks 的闭包陷阱，你是怎么解决的？

## class 组件和 function 组件对比

class 组件有生命周期有状态、函数组件就看返回值无状态(现在有 hook 了)

class 组件随着项目变大生命周期逻辑过于耦合、庞大，函数组件可以更细粒。class 组件需要走实例化流程，但可以使用装饰器。函数组件就不能使用装饰器了，函数组件 ref 需要 forwardRef，不用纠结 this。如果代码量都很多，函数组件可读性高一些

class 组件和函数组件 diff、渲染、挂载过程差异

其实是一样的，最终结果有点不一样，可以看打包后代码

hooks 将所有类似生命周期函数都可以用一个 useEffect 来进行模拟，不会使得自己的逻辑大量分布在 class 的各个角落，大幅度集成业务逻辑代码。

多个组件间逻辑复用: 在 Class 中使用 React 不能将带有 state 的逻辑给单独抽离成 function, 其只能通过嵌套组件的方式来解决多个组件间逻辑复用的问题, 基于嵌套组件的思想存在 HOC 与 render props 两种设计模式。

- 嵌套地狱, 当嵌套层级过多后, 数据源的追溯会变得十分困难, 导致定位 bug 不容易; (hoc、render props)
- 性能, 需要额外的组件实例存在额外的开销; (hoc、render props)
- 命名重复性, 在一个组件中同时使用多个 hoc, 不排除这些 hoc 里的方法存在命名冲突的问题; (hoc)

## hooks 解决了什么问题

## 与 HOC、render props 比较

## hooks 缺点

## 闭包陷阱

## useRef 不刷新问题

## hooks 代码维护怎么解决

这个需要团队的积累，我们这边暂时没什么很大问题，所以感受不到。最基本的，eslint 一定要开启，不然会莫名其妙的 dep 导致更新。

## 一个很牛逼很多功能的 class 组件，里面有业务生命周期（获取数据前后、弹出窗口前后...），怎么在函数组件里面直接复用它

先注入到函数组件的 props，再到 useEffect 关键节点里面执行业务生命周期

## useMemo

闭包、缓存、memorize
