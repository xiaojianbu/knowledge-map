# React 性能优化

过早的优化是万恶之源

正确的方法是，先有质量地实现你的需求，写够testcase，然后做profile去找到性能的瓶颈，这个时候才优化他。

记住一点，React本来就执行很快，不要过早的担心或者优化你的性能 

## 查看性能

不能靠感觉

工具主要有两个: Chrome Performance, React Developer Tools

可以使用代码: why-did-you-update、 useWhyDidYouUpdate

第一个是 Chrome Performance Tab，它会告诉你每个组件会发生什么（例如，mount，update ）。有了它你应该能够确定哪个组件可能会出现性能问题，然后进行优化。

另一种选择是 DevTools Profiler ，它在 React 16.5+ 中可用，并与 shouldComponentUpdate 配合（或PureComponent，在本教程的第一部分中解释），我们可以提高一些关键组件的性能。

## re-render

在Function组件中，重新渲染意味着整个功能将再次运行。

组件重新渲染的原因：state 发生变换、props 发生变化、父组件重新渲染。


当一个组件的 props 或 state 变更，React 会将最新返回的元素与之前渲染的元素进行对比，以此决定是否有必要更新真实的 DOM。当它们不相同时，React 会更新该 DOM。

在大部分情况下，你可以继承 React.PureComponent 以代替手写 shouldComponentUpdate()。

当前组件的State中的属性改变时且当前组件的shouldcomponentupdate返回true，那么当前组件会rerender

组件的props中的任一属性的值有变化(即使这个任一属性的值是对象，变化的仅仅是该对象中的某属性的值，此刻也算props发生了变化)且当前组件的shouldcomponentupdate return true时且当期组件所有父级以上组件的shouldcomponentupdate return true，当前组件才会re-render

当前组件的shouldcomponentupdate即使返回false，当前组件里子组件若满足1中的条件，这个子组件依然会重新渲染

“重新渲染”和“更新过程”是有区别的，只要明白这两个规则就好了。1. 一个组件如果重新渲染，那么它的子组件也会开始更新过程；2. 任何一个组件的shouldComponentUpdate函数如果返回false，那更新过程就中止了；假如题主说的“某个组件”为X，它的子组件为Y，当X的状态改变时，其实连X也未必会重新渲染，要看X的shouldComponentUpdate如何实现，如果返回false，X就不会被重新渲染了，Y当然更不会。现在假设shouldComponentUpdate没有从中作梗，X开始了正常重新渲染，那么作为子组件的Y肯定会开始更新过程，不过，如果Y的shouldComponentUpdate返回false的话，那Y的更新过程也会被中止，不会重新渲染。所以，关键要看组件的shouldComponentUpdate如何实现。

因为每次传递进来的 onClick 和 style 都是与上次不相等的。

将这些不变的数据使用同一个引用

默认情况下其只会对复杂对象做浅层对比(与 pure 类似)，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。


状态管理
```js
const Child = React.memo(MyComponent);
const Parent = () => {
  onChildClick = {
    // do something
  };

  return (
    <div>
      <Child onClick={onChildClick} />
    </div>
  );
};
// 每一次re-render 的时候 传递给 Child 的 onClick 都是新生产的 function，所以导致浅比较失效。 这里我们可以用 useCallback 去进行优化。
const Child = React.memo(MyComponent);
const Parent = () => {
  const onChildClick = useCallback(() => {
   // do something
  }, []);

  return (
    <div>
      <Child onClick={onChildClick} />
    </div>
  );
};

```

首先，传递给 useMemo 的函数开销大不大？在上面这个示例中就是要考虑 getResolvedValue 的开销大不大？
JavaScript 数据类型的大多数方法都是优化过的，例如 Array.map、Object.getOwnPropertyNames() 等。如果你执行的操作开销不大（想想大 O 符号），那么你就不需要记住返回值。使用 useMemo 的成本可能会超过重新评估该函数的成本。
其次，给定相同的输入值时，对记忆（memoized）值的引用是否会发生变化？例如在上面的代码块中，如果 page 为 2，type 为“GET”，那么对 resolvedValue 的引用是否会变化？简单的回答是考虑 resolvedValue 变量的数据类型。如果 resolvedValue 是原始值（如字符串、数字、布尔值、空值、未定义或符号），则引用就不会变化。也就是说 ExpensiveComponent 不会被重新渲染。
要记住的函数开销很大吗，返回的值是原始值吗？每次都思考这两个问题的话，你就能随时判断使用 useMemo 是否合适。

可以借助react-devtools，勾选Highlight Updates,黄色和红色并不一定是不好的，之所以出现黄色或者红色，组件这个时候确实因为某些state或者props改变导致了频繁更新。

简单的修改了某个文件的一个属性，会看到整个list都重绘了一遍，设置右边和左边的侧栏以及header都re-render了，这就是不必要的re-render


该回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。

不好的写法： props state，问题 props 太多

Form.create() 创建一个新的组件。

渲染型发请求在 useAsync 中进行，比如刷新列表页，获取基础信息，或者进行搜索， 都可以抽象为依赖了某些变量，当这些变量变化时要重新取数 ：

useMemo主要用于memo类型组件的props上（如果不用这个memo类型组件就是负作用）, 以及创建开销过大的场景。

useCallback本质是useMemo的语法糖, 而function本身并不是创建开销过大的。
所以我认为useCallback设计出来是和React.memo配套使用的。

大部分组件都不需要特地去做性能优化，除非涉及高性能动画、长列表或者图表等场景。

减少重新 render 的次数。因为在 React 里最重(花时间最长)的一块就是 reconction(简单的可以理解为 diff)，如果不 render，就不会 reconction。
减少计算的量。主要是减少重复计算，对于函数式组件来说，每次 render 都会重新从头开始执行函数调用。

## 参考

[usehooks](https://usehooks.com/)
[不要再滥用useMemo了！你应该重新思考Hooks memoization](https://mp.weixin.qq.com/s/YEs5nH4aOAxOPYuW8oVlBA)
