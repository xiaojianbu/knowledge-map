# Fiber 工作原理

react 核心思想：

内存中维护一颗虚拟 DOM 树，数据变化时（setState），自动更新虚拟 DOM，得到一颗新树，然后 diff 新老虚拟 DOM 树，找到有变化的部分，得到一个 change(patch)，将这个 patch 加入队列，最终批量更新这些 path 到 DOM 中。 简单说就是： diff + patch 。

## 为什么要实现 fiber

一旦任务开始进行，就无法中断 ，那么 js 将一直占用主线程， 一直要等到整棵 Virtual DOM 树计算完成之后，才能把执行权交给渲染引擎，那么这就会导致一些用户交互、动画等任务无法立即得到处理，就会有卡顿，非常的影响用户体验 。

## fiber 怎样的，如何实现异步渲染

把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行。

为了实现这种特性，使用了 requestIdleCallback API requestIdleCallback 可以在这个空闲期（Idle Period）调用空闲期回调（Idle Callback），执行一些任务。

React 自己实现了

render

commit

数据结构
