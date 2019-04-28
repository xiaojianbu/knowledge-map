# computed 实现

从两个问题出发：

建立与其他属性（如：data、 Store）的联系；

属性改变后，通知计算属性重新计算。

实现时，主要如下

1. 初始化 data， 使用 Object.defineProperty 把这些属性全部转为 getter/setter。
2. 初始化 computed, 遍历 computed 里的每个属性，每个 computed 属性都是一个 watch 实例。每个属性提供的函数作为属性的 getter，使用 Object.defineProperty 转化。
3. Object.defineProperty getter 依赖收集。用于依赖发生变化时，触发属性重新计算。
4. 若出现当前 computed 计算属性嵌套其他 computed 计算属性时，先进行其他的依赖收集。
