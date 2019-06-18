# plugins

插件可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

## 常用的插件

生成 HTML 文件 Html-webpack-plugin
删除 dist 目录 clean-webpack-plugin
压缩 css 文件 optimize-css-assets-webpack-plugin
压缩 js 文件 uglifyjs-webpack-plugin
复制目录插件 copyWebpackPlugin
添加版权声明 bannerPlugin
提取 css 文件 mini-css-extract-plugin
DllPlugin 为了极大减少构建时间，进行分离打包

## 使用

```js
const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过 npm 安装
const webpack = require('webpack') // 用于访问内置插件

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })]
}
```

## 原理

webpack 插件是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。

## 编写一个插件

一个插件由以下构成

- 一个具名 JavaScript 函数。
- 在它的原型上定义 apply 方法。
- 指定一个触及到 webpack 本身的 事件钩子。
- 操作 webpack 内部的实例特定数据。
- 在实现功能后调用 webpack 提供的 callback。

```js
// 一个 JavaScript class
class MyExampleWebpackPlugin {
  // 将 `apply` 定义为其原型方法，此方法以 compiler 作为参数
  apply(compiler) {
    // 指定要附加到的事件钩子函数
    compiler.hooks.emit.tapAsync(
      'MyExampleWebpackPlugin',
      (compilation, callback) => {
        console.log('This is an example plugin!')
        console.log(
          'Here’s the `compilation` object which represents a single build of assets:',
          compilation
        )

        // 使用 webpack 提供的 plugin API 操作构建结果
        compilation.addModule(/* ... */)

        callback()
      }
    )
  }
}
```

## 参考

[plugin](https://webpack.docschina.org/concepts/#%E6%8F%92%E4%BB%B6-plugin-)

- [webpack-plugin](https://webpack.docschina.org/concepts/plugins/#%E5%89%96%E6%9E%90)

- [编写一个插件](https://webpack.docschina.org/contribute/writing-a-plugin/)

- [手写一个 webpack 插件 ](https://github.com/xiangxingchen/blog/issues/18)
