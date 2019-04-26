前者是计算属性，依赖其他属性计算值。并且 computer 的值有缓存，只有当计算值变化才变化触发渲染。后者监听到值得变化就会执行回调
computer 就是简单计算一下，适用于渲染页面。watch 适合做一些复杂业务逻辑
前者有依赖两个 watcher，computer watcher 和渲染 watcher。判断计算出的值变化后渲染 watcher 派发更新触发渲染

作者：yck
链接：https://juejin.im/post/5ba34e54e51d450e5162789b
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
