# vue-router

Vue

## mode

- 类型: string
- 默认值: "hash" (浏览器环境) | "abstract" (Node.js 环境)
- 可选值: "hash" | "history" | "abstract"

配置路由模式:

- hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。
- history: 依赖 HTML5 History API 和服务器配置。查看 HTML5 History 模式。
- abstract: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.

hash 模式下，仅 hash 符号之前的内容会被包含在请求中，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。

history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，/book/id。如果后端缺少对 /book/id 的路由处理，将返回 404 错误。要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面

## vue-router 如何做历史返回提示

https://www.cnblogs.com/longm/p/vue-router.html

## vue-router 如何做用户登录权限等

https://juejin.im/post/591aa14f570c35006961acac

https://segmentfault.com/a/1190000015451081

## Vue-Router 的理解

router-link

router-view

导航方式：编程式导航 声明式导航

命名路由 & 命名视图

name 属性 -> {name:, params:}

router-view 的 name 属性与 components 对应

动态路由及路由组件间传参

name + params 方式

path + query 方式

router & route 的理解

导航守卫

全局守卫

组件内守卫

路由独享守卫

## Vue 浏览器回退记住位置

需要开启 vue-router 的 history 模式

```js
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

## 不使用 vue-router

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.js"></script>
<div id="app"></div>
<script>
  const Foo = { template: '<div>foo</div>' }
  const Bar = { template: '<div>bar</div>' }
  const NotFound = { template: '<div>not found</div>' }

  // 在对象里面统一配置路由
  const routeTable = {
    foo: Foo,
    bar: Bar
  }
  window.addEventListener('hashchange', () => {
    app.url = window.location.hash.slice(1)
  })
  let app = new Vue({
    el: '#app',
    data() {
      return {
        url: window.location.hash.slice(1)
      }
    },
    render(h) {
      return h('div', [
        h('a', { attrs: { href: '#foo' } }, 'foo'),
        '|',
        h('a', { attrs: { href: '#bar' } }, 'bar'),
        h(routeTable[this.url] || NotFound)
      ])
    }
  })
</script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.js"></script>
// 这里是下载到本地同目录引入的
<script src="./path-to-regexp.js"></script>
<div id="app"></div>
<script>
  const Foo = {
    props: ['id'],
    template: `<div>foo with id: {{id}} </div>`
  }
  const Bar = {
    template: `<div>bar</div>`
  }
  const NotFound = {
    template: `<div>not found</div>`
  }
  const routeTable = {
    '/foo/:id': Foo,
    '/bar': Bar
  }
  // 处理路由
  const compiledRoutes = []
  Object.keys(routeTable).forEach(path => {
    const dynamicSegments = []
    const regex = pathToRegexp(path, dynamicSegments)
    const component = routeTable[path]
    compiledRoutes.push({
      component,
      regex,
      dynamicSegments
    })
  })
  window.addEventListener('hashchange', () => {
    app.url = window.location.hash.slice(1)
  })
  const app = new Vue({
    el: '#app',
    data() {
      return {
        url: window.location.hash.slice(1)
      }
    },
    // 渲染那个路由，路由属性
    render(h) {
      const url = '/' + this.url
      let componentToRender
      let props = {}
      compiledRoutes.some(route => {
        const match = route.regex.exec(url)
        if (match) {
          componentToRender = route.component
          // 上一步已经可以匹配到url对应的组件了
          // 这里多做一步，获取动态id作为props的属性传入组件
          route.dynamicSegments.forEach((segment, index) => {
            props[segment.name] = match[index + 1]
          })
        }
      })
      return h('div', [
        h('a', { attrs: { href: '#foo/123' } }, 'foo123'),
        '|',
        h('a', { attrs: { href: '#foo/234' } }, 'foo234'),
        '|',
        h('a', { attrs: { href: '#bar' } }, 'bar'),
        h(componentToRender || NotFound, { props })
      ])
    }
  })
</script>
```

https://github.com/KieSun/Dream/issues/8
