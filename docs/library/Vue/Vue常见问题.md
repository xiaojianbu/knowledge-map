# Vue 常见问题

## Vue 组件 data 为什么必须是函数

1. 每个组件都是 Vue 的实例。
2. 组件共享 data 属性，当 data 的值是同一个引用类型的值时，改变其中一个会影响其他。

## vue 中的 MVVM 模式 即 Model-View-ViewModel

Vue 是以数据为驱动的，Vue 自身将 DOM 和数据进行绑定，一旦创建绑定，DOM 和数据将保持同步，每当数据发生变化，DOM 会跟着变化。
ViewModel 是 Vue 的核心，它是 Vue 的一个实例。Vue 实例时作用域某个 HTML 元素上的，这个 HTML 元素可以是 body，也可以是某个 id 所指代的元素。
DOM Listeners 和 Data Bindings 是实现双向绑定的关键。DOM Listeners 监听页面所有 View 层 DOM 元素的变化，当发生变化，Model 层的数据随之变化；
Data Bindings 监听 Model 层的数据，当数据发生变化，View 层的 DOM 元素随之变化。

2.v-show 指令，v-if 的区别 条件渲染指令，与 v-if 不同的是，无论 v-show 的值为 true 或 false，元素都会存在于 HTML 代码中；
而只有当 v-if 的值为 true，元素才会存在于 HTML 代码中。v-show 指令只是设置了元素 CSS 的 style 值(是通过 js 代码去修改元素的 element style。如果 value 为 false，设置 display: none；如果 value 为 true，清除 display 属性。所以 value 为 true 时，只是将 element style 中的 display 效果清除，并不能覆盖 css 中的 display 样式)

3.如何让 css 只在当前组件中起作用 在每一个 vue 组件中都可以定义各自的 css，js，如果希望组件内写的 css 只对当前组件起作用，
只需要在 style 中写入 scoped，即： `<style scoped></style>`

## vue scoped css

1. 给 HTML 的 dom 节点添加一个不重复的 data 属性(例如: data-v-5558831a)来唯一标识这个 dom 元素(由 PostCSS 转译实现)
2. 在每句 css 选择器的末尾(编译后生成的 css 语句)加一个当前组件的 data 属性选择器(例如：[data-v-5558831a])来私有化样式

使用 scoped 后，父组件的样式将不会渗透到子组件中。

不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式

深度作用选择器

如果你希望 scoped 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 >>> 操作符：

```css
<style scoped>
.a >>> .b { /* ... */ }
</style>
```

上述代码将会编译成：

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

## 指令 keep-alive 在 vue-router 写着 keep-alive

keep-alive 的含义： 如果把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。
为此可以添加一个 keep-alive 指令 <component :is='curremtView' keep-alive></component>

## 路由嵌套 路由嵌套会将其他组件渲染到该组件内，而不是进行整个页面跳转 router-view 本身就是将组件渲染到该位置，想要进行页面跳转

就要将页面渲染到根组件，在起始配置路由时

## vue 根目录下的 index.html 中的 id="app"与 src 目录下的 App.vue 中的 id="app"为什么不会冲突

浏览器首先载入 index.html，里面有个 <div id="app"> JS 被加载，开始执行 Vue 实例初始化，根据用户定义，这个实例会被挂载到 #app 这个元素上（也就是 el 属性定义的） 挂载后的元素会替换原先的挂载点，实例模板里怎么定义了根元素，挂载后就是怎么样的元素 你可以看到，其实那个 #app 只是为了能让 Vue 找到确切的挂载位置，它的值是什么其实不重要，也和挂载后的逻辑无关（除非你的业务逻辑里有 document.getElementById('app') 之类的）。

## Vue 浏览器回退记住位置

- 路由设置

要使用这一功能，首先需要开启  `vue-router`  的  `history`  模式<br />滚动行为具体设置如下:

```javascript
const router = new VueRouter({
    mode: 'history',
  scrollBehavior (to, from, savedPosition) {
      if (savedPosition) { //如果savedPosition存在，滚动条会自动跳到记录的值的地方
        return savedPosition
      } else {
        return { x: 0, y: 0 }//savedPosition也是一个记录x轴和y轴位置的对象
        }
      }，
    routes: [...]
  })
```

## 引入图片

通过 v-bind 指令动态绑定本地图片资源无法显示问题。 场景：通过变量保存图片的 src 路径，或者在 v-for 中循环显示图片。

```text
imgUrl : './test.png'

<img :src='imgUrl' />  // 此时webpack只会把它当做字符串处理从而找不到图片地址(即不会对该图片进行打包)，无法正确引用该本地图片
```

解决方法:

```ext
1、将静态资源图片放在src同级别的static文件夹中。  webpack将static文件夹中的内容拷贝到项目运行的根目录下。不会编译与压缩
2、imgUrl: "require('./test.png')" ，该方法会将图片转成base64存在内存中
3、import avatar from './logo.png'
     imgUrl : avatar
```

## filter 过滤器

在  `src`  下新建  `filters`  文件夹, 创建  `index.js`, 案例如下

```javascript
// 金钱格式化
const digitsRE = /(\d{3})(?=\d)/g

export function currency(value, currency, decimals) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
  var i = _int.length % 3
  var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
  var _float = decimals ? stringified.slice(-1 - decimals) : ''
  var sign = value < 0 ? '-' : ''
  return (
    sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
  )
}
```

- 使用

在  `main.js`  中注入

```javascript
import * as filters from './filters'

// 全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
```

在组件中使用:

```html
<span>{{timestamp | currency}}</span>
```

## 登录跳转

需要登录访问项目
找到 main.js 添加 router.beforeEach 案例如下:

```js
// 引入路由
import router from './router'

// 登录
router.beforeEach((to, from, next) => {
  // 看是否已经登录
  const isLogin = window.sessionStorage.getItem('isLogin')
  // 未登录则跳转登录
  if (!isLogin && to.name !== 'login') {
    next({ path: '/', query: { from: to.fullPath } })
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router, // 路由
  store,
  components: {
    App
  },
  template: '<App/>'
})
```

## 权限设置

根据后台接口返回, 给项目按钮设置权限

配置权限
在 main.js 中添加指令, 这里增加了个 指令 叫 has, 案例如下

```js
import Vue from 'vue'

/** 权限指令 **/
Vue.directive('has', {
bind: function (el, binding) {
if (!Vue.prototype.\$\_has(binding.value)) {
el.parentNode.removeChild(el)
}
}
})

// 权限检查方法
Vue.prototype.$_has = function (value) {
  let isExist = false
  // 根据登录后拿到该用户有哪些权限, 这里根据你具体需求
  let buttonpermsStr = window.sessionStorage.getItem('buttenpremissions')
  if (buttonpermsStr === undefined || buttonpermsStr === null) {
    return false
  }
  let buttonperms = JSON.parse(buttonpermsStr)
  for (let i = 0; i < buttonperms.length; i++) {
    if (buttonperms[i].perms.indexOf(value) > -1) {
      isExist = true
      break
    }
  }
  return isExist
}
```

## 父组件调用子组件的方法，父组件给子组件添加方法，父组件改子组件的样式，父组件怎么给子组件传一个带\$的参数，子组件向父组件声明自己存在

## vue 中在哪个阶段进行异步请求比较合适

created mounted

## vue 中可以通过 computed 来发起一个 ajax 请求吗

不能

Computed properties should be synchronous.Asynchronous actions inside them may not work as expected and can lead to an unexpected behaviour, that's why you should avoid them. If you need async computed properties you might want to consider using additional plugin [vue-async-computed]

计算属性应该是同步的。其中的异步操作可能无法按预期工作，并可能导致意外行为，这就是您应该避免它们的原因。如果您需要异步计算属性，可能需要考虑使用其他插件[vue-async-computed]

## vue 中 vuex 的 mapGetter 是怎么实现的

## vue 项目中使用到的优化手段

## vue 中写一个组件要注意哪些

## vue 组件中的自定义属性如何进行获取

vm.\$options: 用于当前 Vue 实例的初始化选项。需要在选项中包含自定义属性时会有用处

## 指令

```js
import Vue from 'vue'

/** 权限指令 **/
Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})

// 权限检查方法
Vue.prototype.$_has = function(value) {
  let isExist = false
  // 根据登录后拿到该用户有哪些权限, 这里根据你具体需求
  let buttonpermsStr = window.sessionStorage.getItem('buttenpremissions')
  if (buttonpermsStr === undefined || buttonpermsStr === null) {
    return false
  }
  let buttonperms = JSON.parse(buttonpermsStr)
  for (let i = 0; i < buttonperms.length; i++) {
    if (buttonperms[i].perms.indexOf(value) > -1) {
      isExist = true
      break
    }
  }
  return isExist
}
```
