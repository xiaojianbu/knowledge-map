# Vue.js 中使用第三方库

## 全局变量

在项目中添加第三方库的最简单方式是将其作为一个全局变量，挂载到 window 对象上

## 在每个文件引入

```javascript
import _ from 'lodash'
```

## 优雅的方式

将第三方的库代理到 Vue 的原型对象上。

```js
import lodash from 'lodash'

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash })
```

所有组件都会从 Vue 的原型对象上继承它们的方法，因此在所有的组件/实例中都可以通过`this.$lodash`的方式访问 lodash 。

参考：[如何在 Vue.js 中使用第三方库](https://github.com/dwqs/blog/issues/51)
