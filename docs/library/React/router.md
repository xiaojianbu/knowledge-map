# router

react-router 是基于 history 模块提供的 api 进行开发的，结合的形式本文记为 包装方式。所以在开始对其分析之前，先举一个简单的例子来说明如何进行对象的包装。

```js
// 原对象
var historyModule = {
  listener: [],
  listen: function(listener) {
    this.listener.push(listener)
    console.log('historyModule listen..')
  },
  updateLocation: function() {
    this.listener.forEach(function(listener) {
      listener('new localtion')
    })
  }
}
// Router 将使用 historyModule 对象，并对其包装
var Router = {
  source: {},
  init: function(source) {
    this.source = source
  },
  // 对 historyModule的listen进行了一层包装
  listen: function(listener) {
    return this.source.listen(function(location) {
      console.log('Router listen tirgger.')
      listener(location)
    })
  }
}
// 将 historyModule 注入进 Router 中
Router.init(historyModule)
// Router 注册监听
Router.listen(function(location) {
  console.log(location + '-> Router setState.')
})
// historyModule 触发回调
historyModule.updateLocation()
```

可看到 historyModule 中含有机制：historyModule.updateLocation() -> listener( )，Router 通过对其进行包装开发，针对 historyModule 的机制对 Router 也起到了作用，即 historyModule.updateLocation() 将触发 Router.listen 中的回调函数 。

这种包装形式能够充分利用原对象（historyModule ）的内部机制，减少开发成本，也更好的分离包装函数（Router）的逻辑，减少对原对象的影响。

react-router 使用方式
react-router 以 react component 的组件方式提供 API， 包含 Router，Route，Redirect，Link 等等，这样能够充分利用 react component 提供的生命周期特性，同时也让定义路由跟写 react component 达到统一，如下

```js
render(
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <Route path='about' component={About} />
      <Route path='users' component={Users}>
        <Route path='/user/:userId' component={User} />
      </Route>
      <Route path='*' component={NoMatch} />
    </Route>
  </Router>,
  document.body
)
```

就这样，声明了一份含有 path to component 的各个映射的路由表。

react-router 还提供的 Link 组件（如下），作为提供更新 url 的途径，触发 Link 后最终将通过如上面定义的路由表进行匹配，并拿到对应的 component 及 state 进行 render 渲染页面。

## 参考

[前端路由实现与 react-router 源码分析](https://github.com/joeyguo/blog/issues/2)
