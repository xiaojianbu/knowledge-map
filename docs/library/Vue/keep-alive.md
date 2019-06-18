# keep-alive

keep-alive 是 Vue 内置的一个组件，可以缓存组件内部状态，避免重新渲染；它自身不会渲染一个 DOM 元素。

- include: 字符串或正则表达式，只有名称匹配的组件会被缓存；
- exclude: 字符串或正则表达式，任何名称匹配的组件都不会被缓存(优先级大于 include)；
- max: 数字，最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

## 生命周期钩子

- activated
- deactivated

## 用法

### 动态组件中的应用

```html
<keep-alive :include="whiteList" :exclude="blackList" :max="amount">
  <component :is="currentComponent"></component>
</keep-alive>
```

### 在 vue-router 中应用

```html
<keep-alive :include="whiteList" :exclude="blackList" :max="amount">
  <router-view></router-view>
</keep-alive>
```

## 参考

[彻底揭秘 keep-alive 原理](https://juejin.im/post/5cce49036fb9a031eb58a8f9)
