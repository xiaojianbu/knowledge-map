# Proxy & Reflect

## Proxy

在访问对象之前建立一道“拦截”，任何访问该对象的操作之前都会通过这道“拦截”，即执行 Proxy 里面定义的方法。

基本用法：

```js
let pro = new Proxy(target, handler)
```

new Proxy()表示生成一个 Proxy 实例

target 参数表示所要拦截的目标对象

handler 参数也是一个对象，用来定制拦截行为。

### get

get(target, propKey, receiver)

用于拦截某个属性的读取操作，可以接受三个参数：

- target：目标对象
- propKey：属性名
- receiver（可选）：proxy 实例本身（严格地说，是操作行为所针对的对象）

### set

set(target, propKey, value, receiver)

用于拦截某个属性的赋值操作，可以接受四个参数：

- target：目标对象
- propKey：属性名
- value：属性值
- receiver（可选）：Proxy 实例本身

## 参考

[深入实践 ES6 Proxy & Reflect](https://zhuanlan.zhihu.com/p/60126477)
