# diff 算法

vue 和 react 的虚拟 DOM 的 Diff 算法大致相同，其核心是基于两个简单的假设：

两个相同的组件产生类似的 DOM 结构，不同的组件产生不同的 DOM 结构。

同一层级的一组节点，他们可以通过唯一的 id 进行区分。基于以上这两点假设，使得虚拟 DOM 的 Diff 算法的复杂度从 O(n^3)降到了 O(n)。

diff 的实现主要通过两个方法，patchVnode 与 updateChildren 。

patchVnode 有两个参数，分别是老节点 oldVnode, 新节点 vnode 。主要分五种情况：

1. if (oldVnode === vnode)，他们的引用一致，可以认为没有变化。
2. if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)，文本节点的比较，需要修改，则会调用 Node.textContent = vnode.text。
3. if( oldCh && ch && oldCh !== ch ), 两个节点都有子节点，而且它们不一样，这样我们会调用 updateChildren 函数比较子节点，这是 diff 的核心，后边会讲到。
4. if (ch)，只有新的节点有子节点，调用 createEle(vnode)，vnode.el 已经引用了老的 dom 节点，createEle 函数会在老 dom 节点上添加子节点。
5. if (oldCh)，新节点没有子节点，老节点有子节点，直接删除老节点。

## react 和 vue 的 diff 过程有什么区别

React 是这么干的：你给我一个数据，我根据这个数据生成一个全新的 Virtual DOM，然后跟我上一次生成的 Virtual DOM 去 diff，得到一个 Patch，然后把这个 Patch 打到浏览器的 DOM 上去。完事。并且这里的 Patch 显然不是完整的 Virtual DOM，而是新的 Virtual DOM 和上一次的 Virtual DOM 经过 diff 后的差异化的部分。

Vue 在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。

React 每当应用的状态被改变时，全部子组件都会重新渲染。

这可以通过 shouldComponentUpdate 这个生命周期方法来进行控制。

React diff 的是 Dom，而 Vue diff 的是数据。
