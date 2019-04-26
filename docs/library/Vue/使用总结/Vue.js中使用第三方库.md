# Vue.js中使用第三方库

### <a name="u3ctcs"></a>全局变量

在项目中添加第三方库的最简单方式是将其作为一个全局变量，挂载到window对象上

### <a name="twwbgx"></a>在每个文件引入
*MyComponent.vue*
```javascript
import _ from 'lodash'
```
### <a name="xsyidg"></a>优雅的方式
将第三方的库代理到Vue的原型对象上。
```javascript
import lodash from 'lodash'

Object.defineProperty(Vue.prototype, '$lodash', {value: lodash})
```
所有组件都会从Vue的原型对象上继承它们的方法，因此在所有的组件/实例中都可以通过`this.$lodash`的方式访问 lodash 。

参考：[如何在 Vue.js 中使用第三方库](https://github.com/dwqs/blog/issues/51)
