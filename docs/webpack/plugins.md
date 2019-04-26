如何实现一个插件

调用插件 apply 函数传入 compiler 对象
通过 compiler 对象监听事件

比如你想实现一个编译结束退出命令的插件
class BuildEndPlugin {
  apply (compiler) {
    const afterEmit = (compilation, cb) => {
      cb()
      setTimeout(function () {
        process.exit(0)
      }, 1000)
    }

    compiler.plugin('after-emit', afterEmit)
  }
}

module.exports = BuildEndPlugin

# webpack 插件机制

>webpack 插件是一个具有 apply 方法的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。


## 特点
>webpack 插件
先来瞅瞅 webpack 插件在项目中的运用
```
const MyPlugin = require('myplugin')
const webpack = require('webpack')

webpack({
  ...,
  plugins: [new MyPlugin()]
  ...,
})
```

-那么符合什么样的条件能作为 webpack 插件呢？一般来说，webpack 插件有以下特点：

- 1.独立的 JS 模块，暴露相应的函数

- 2.函数原型上的 apply 方法会注入 compiler 对象

- 3.compiler 对象上挂载了相应的 webpack 事件钩子

- 4.事件钩子的回调函数里能拿到编译后的 compilation 对象，如果是异步钩子还能拿到相应的 callback

下面结合代码来看看：
```
function MyPlugin(options) {}
// 2.函数原型上的 apply 方法会注入 compiler 对象
MyPlugin.prototype.apply = function(compiler) {
  // 3.compiler 对象上挂载了相应的 webpack 事件钩子 4.事件钩子的回调函数里能拿到编译后的 compilation 对象
  compiler.plugin('emit', (compilation, callback) => {
    ...
  })
}
// 1.独立的 JS 模块，暴露相应的函数
module.exports = MyPlugin
```


## compiler 对象
>compiler 即 webpack 的编辑器对象，在调用 webpack 时，会自动初始化 compiler 对象

compiler 对象中包含了所有 webpack 可配置的内容，开发插件时，我们可以从 compiler 对象中拿到所有和 webpack 主环境相关的内容。



## compilation 对象
>compilation 对象代表了一次单一的版本构建和生成资源。  
当运行 webpack 时，每当检测到一个文件变化，一次新的编译将被创建，从而生成一组新的编译资源。  
一个编译对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。











## 参考
- [webpack-plugin](https://webpack.docschina.org/concepts/plugins/#%E5%89%96%E6%9E%90)
- [全面的Webpack教程《深入浅出Webpack》电子书](https://github.com/gwuhaolin/dive-into-webpack/)
- [探寻 webpack 插件机制](https://www.cnblogs.com/MuYunyun/p/8875908.html)
- [看清楚真正的 Webpack 插件](https://zoumiaojiang.com/article/what-is-real-webpack-plugin/#compiler)
- [如何写一个webpack插件（一）](https://github.com/lcxfs1991/blog/issues/1)
- [《深入浅出Webpack》:5-4 编写 Plugin](http://webpack.wuhaolin.cn/5%E5%8E%9F%E7%90%86/5-4%E7%BC%96%E5%86%99Plugin.html)

