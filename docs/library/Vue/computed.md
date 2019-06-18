# computed

从两个问题出发：

建立与其他属性（如：data、 Store）的联系；

属性改变后，通知计算属性重新计算。

实现时，主要如下

1. 初始化 data， 使用 Object.defineProperty 把这些属性全部转为 getter/setter。
2. 初始化 computed, 遍历 computed 里的每个属性，每个 computed 属性都是一个 watch 实例。每个属性提供的函数作为属性的 getter，使用 Object.defineProperty 转化。
3. Object.defineProperty getter 依赖收集。用于依赖发生变化时，触发属性重新计算。
4. 若出现当前 computed 计算属性嵌套其他 computed 计算属性时，先进行其他的依赖收集。

## watch 和 computed

都是以 Vue 的依赖追踪机制为基础，当某个依赖数据发生变化时，所有依赖这个数据的相关数据或函数都会自动发生变化或调用。

1. computed 是计算一个新的属性，并将该属性挂载到 vm（Vue 实例）上，而 watch 是监听已经存在且已挂载到 vm 上的数据，所以用 watch 同样可以监听 computed 计算属性的变化（其它还有 data、props）
2. computed 本质是一个惰性求值的观察者，具有缓存性，只有当依赖变化后，第一次访问 computed 属性，才会计算新的值，而 watch 则是当数据发生变化便会调用执行函数
3. 从使用场景上说，computed 适用一个数据被多个数据影响，而 watch 适用一个数据影响多个数据。

computer 就是简单计算一下，适用于渲染页面。watch 适合做一些复杂业务逻辑（执行异步或开销较大的操作时）。

计算属性不能执行异步任务，计算属性必须同步执行。

前者有依赖两个 watcher，computer watcher 和渲染 watcher。判断计算出的值变化后渲染 watcher 派发更新触发渲染

## 计算属性 vs 方法

两者最主要的区别：computed 是可以缓存的，methods 不能缓存

## 参考

[浅谈 Vue 中 computed 实现原理](https://juejin.im/post/5b98c4da6fb9a05d353c5fd7)
