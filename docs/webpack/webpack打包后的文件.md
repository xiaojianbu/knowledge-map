# webpack 打包后的文件

```js
;(function(modules) {
  // ...
})({
  './src/index.js': function() {
    // ...
  }
})
```

整个文件只含一个立即执行函数（IIFE），我们称它为 webpackBootstrap，它仅接收一个对象 —— 未加载的 模块集合（modules），这个 modules 对象的 key 是一个路径，value 是一个函数。

webpackBootstrap 函数内容：

```js
// webpackBootstrap
;(function(modules) {
  // 缓存 __webpack_require__ 函数加载过的模块
  var installedModules = {}

  /**
   * Webpack 加载函数，用来加载 webpack 定义的模块
   * @param {String} moduleId 模块 ID，一般为模块的源码路径，如 "./src/index.js"
   * @returns {Object} exports 导出对象
   */
  function __webpack_require__(moduleId) {
    // ...
  }

  // 在 __webpack_require__ 函数对象上挂载一些变量及函数 ...

  // 传入表达式的值为 "./src/index.js"
  return __webpack_require__((__webpack_require__.s = './src/index.js'))
})(/* modules */)
```

1. 定义一个模块加载函数 **webpack_require**。
2. 使用加载函数加载入口模块 "./src/index.js"。

## 参考

[Webpack 是怎样运行的?](https://segmentfault.com/a/1190000019117897)

[Webpack 将代码打包成什么样子？](https://segmentfault.com/a/1190000014129037)
