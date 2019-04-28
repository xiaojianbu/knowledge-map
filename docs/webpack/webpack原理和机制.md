# webpack 原理和机制

https://juejin.im/post/5aa3d2056fb9a028c36868aa

https://juejin.im/entry/5c3a220d6fb9a049ae081fc5?utm_source=gold_browser_extension

https://juejin.im/post/59cb6307f265da064e1f65b9#heading-5

```js
// webpack 配置模板
const path = require('path');
module.exports = {
  entry: "./app/entry", // string | object | array
  // Webpack打包的入口
  output: {  // 定义webpack如何输出的选项
    path: path.resolve(__dirname, "dist"), // string
    // 所有输出文件的目标路径
    filename: "[chunkhash].js", // string
    // 「入口(entry chunk)」文件命名模版
    publicPath: "/assets/", // string
    // 构建文件的输出目录
    /* 其它高级配置 */
  },
  module: {  // 模块相关配置
    rules: [ // 配置模块loaders，解析规则
      {
        test: /\.jsx?$/,  // RegExp | string
        include: [ // 和test一样，必须匹配选项
          path.resolve(__dirname, "app")
        ],
        exclude: [ // 必不匹配选项（优先级高于test和include）
          path.resolve(__dirname, "app/demo-files")
        ],
        loader: "babel-loader", // 模块上下文解析
        options: { // loader的可选项
          presets: ["es2015"]
        },
      },
  },
  resolve: { //  解析模块的可选项
    modules: [ // 模块的查找目录
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    extensions: [".js", ".json", ".jsx", ".css"], // 用到的文件的扩展
    alias: { // 模块别名列表
      "module": "new-module"
	  },
  },
  devtool: "source-map", // enum
  // 为浏览器开发者工具添加元数据增强调试
  plugins: [ // 附加插件列表
    // ...
  ],
}

```

1. Entry：指定 webpack 开始构建的入口模块，从该模块开始构建并计算出直接或间接依赖的模块或者库
2. Output：告诉 webpack 如何命名输出的文件以及输出的目录
3. Loaders：由于 webpack 只能处理 javascript，所以我们需要对一些非 js 文件处理成 webpack 能够处理的模块，比如 sass 文件
4. Plugins：Loaders 将各类型的文件处理成 webpack 能够处理的模块，plugins 有着很强的能力。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。但也是最复杂的一个。比如对 js 文件进行压缩优化的 UglifyJsPlugin 插件
5. Chunk：coding split 的产物，我们可以对一些代码打包成一个单独的 chunk，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间。在 webpack3 及以前我们都利用 CommonsChunkPlugin 将一些公共代码分割成一个 chunk，实现单独加载。在 webpack4 中 CommonsChunkPlugin 被废弃，使用 SplitChunksPlugin

webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundles 的 Compilation 都是 Tapable 的实例。在 Tapable1.0 之前，也就是 webpack3 及其以前使用的 Tapable，提供了包括

1. plugin(name:string, handler:function)注册插件到 Tapable 对象中
2. apply(…pluginInstances: (AnyPlugin|function)[])调用插件的定义，将事件监听器注册到 Tapable 实例注册表中
3. applyPlugins\*(name:string, …)多种策略细致地控制事件的触发，包括 applyPluginsAsync、applyPluginsParallel 等方法实现对事件触发的控制，实现

（1）多个事件连续顺序执行
（2）并行执行
（3）异步执行
（4）一个接一个地执行插件，前面的输出是后一个插件的输入的瀑布流执行顺序
（5）在允许时停止执行插件，即某个插件返回了一个 undefined 的值，即退出执行
我们可以看到，Tapable 就像 nodejs 中 EventEmitter,提供对事件的注册 on 和触发 emit,理解它很重要，看个栗子：比如我们来写一个插件

```js
function CustomPlugin() {}
CustomPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', pluginFunction)
}
```

在 webpack 的生命周期中会适时的执行
this.apply*("emit",options)
复制代码当然上面提到的 Tapable 都是 1.0 版本之前的，如果想深入学习，可以查看 Tapable 和 事件流
那 1.0 的 Tapable 又是什么样的呢？1.0 版本发生了巨大的改变，不再是此前的通过 plugin 注册事件，通过 applyPlugins*触发事件调用，那 1.0 的 Tapable 是什么呢？

暴露出很多的钩子，可以使用它们为插件创建钩子函数

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require('tapable')

class Order {
  constructor() {
    this.hooks = {
      //hooks
      goods: new SyncHook(['goodsId', 'number']),
      consumer: new AsyncParallelHook(['userId', 'orderId'])
    }
  }

  queryGoods(goodsId, number) {
    this.hooks.goods.call(goodsId, number)
  }

  consumerInfoPromise(userId, orderId) {
    this.hooks.consumer.promise(userId, orderId).then(() => {
      //TODO
    })
  }

  consumerInfoAsync(userId, orderId) {
    this.hooks.consumer.callAsync(userId, orderId, (err, data) => {
      //TODO
    })
  }
}

const hook = new SyncHook(['arg1', 'arg2', 'arg3'])

// 调用tap方法注册一个consument
order.hooks.goods.tap('QueryPlugin', (goodsId, number) => {
  return fetchGoods(goodsId, number)
})
// 再添加一个
order.hooks.goods.tap('LoggerPlugin', (goodsId, number) => {
  logger(goodsId, number)
})

// 调用
order.queryGoods('10000000', 1)
```

1. 解析 webpack 配置参数，合并从 shell 传入和 webpack.config.js 文件里配置的参数，生产最后的配置结果。

2. 注册所有配置的插件，好让插件监听 webpack 构建生命周期的事件节点，以做出对应的反应。

3. 从配置的 entry 入口文件开始解析文件构建 AST 语法树，找出每个文件所依赖的文件，递归下去。

4. 在解析文件递归的过程中根据文件类型和 loader 配置找出合适的 loader 用来对文件进行转换。

5. 递归完后得到每个文件的最终结果，根据 entry 配置生成代码块 chunk。

6. 输出所有 chunk 到文件系统。

Loaders 将各类型的文件处理成 webpack 能够处理的模块，plugins 有着很强的能力。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。但也是最复杂的一个。比如对 js 文件进行压缩优化的 UglifyJsPlugin 插件

Chunk：coding split 的产物，我们可以对一些代码打包成一个单独的 chunk，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间。

webpack4 中使用 SplitChunksPlugin

loader plugin 的区别，一开始被问到还有点惊讶，不同作用的功能被问到一起。
tree-shaking 的工作原理
code splitting 用的是什么插件
如何提高 webpack 构件速度的

利用 DllPlugin 预编译资源模块
使用 Happypack 加速代码构建

## webpack 打包原理

> webpack 中每个模块有一个唯一的 id，是从 0 开始递增的。  
> 整个打包后的 bundle.js 是一个匿名函数自执行。  
> 参数则为一个数组。数组的每一项都为个 function。  
> function 的内容则为每个模块的内容，并按照 require 的顺序排列。

> 识别入口文件,识别模块依赖，来打包代码。webpack 做的就是分析代码,转换代码，编译代码，输出代码

## Webpack 的两个最核心的原理分别是：

- 一切皆模块

  > 正如 js 文件可以是一个“模块（module）”一样，其他的（如 css、image 或 html）文件也可视作模 块。  
  > 因此，你可以 require('myJSfile.js')亦可以 require('myCSSfile.css')。  
  > 这意味着我们可以将事物（业务）分割成更小的易于管理的片段，从而达到重复利用等的目的。

- 按需加载
  > 传统的模块打包工具（module bundlers）最终将所有的模块编译生成一个庞大的 bundle.js 文件。  
  > 但是在真实的 app 里边，“bundle.js”文件可能有 10M 到 15M 之大可能会导致应用一直处于加载中状态。  
  > 因此 Webpack 使用许多特性来分割代码然后生成多个“bundle”文件，而且异步加载部分代码以实现按需加载。

## 如何实现一个简单的 webpack

- 读取文件分析模块依赖
- 对模块进行解析执行(深度遍历)
- 针对不同的模块使用相应的 loader
- 编译模块，生成抽象语法树 AST。
- 循环遍历 AST 树，拼接输出 js。

## loader 原理

> 在解析对于文件，会自动去调用响应的 loader,  
> loader 本质上是一个函数，输入参数是一个字符串，输出参数也是一个字符串。  
> 当然，输出的参数会被当成是 JS 代码，从而被 esprima 解析成 AST，触发进一步的依赖解析。  
> webpack 会按照从右到左的顺序执行 loader。

> 一种正确的思路是：  
> 使用 JS 代码解析工具（如[esprima](https://github.com/jquery/esprima)或者[acorn](https://github.com/ternjs/acorn)），  
> 将 JS 代码转换成抽象语法树（AST），  
> 再对 AST 进行遍历。  
> 这部分的核心代码是 [parse.js](https://github.com/youngwind/fake-webpack/blob/1bfcd0edf1/lib/parse.js)。

## webpack 优化

- 1.externals 配置优化 :使用 externals 将第三方库以 cdn 的方式去引入
  设置 externals 配置项分离不需要打包的库文件，然后在模版文件中使用 script 引入即可，配置代码片段如下：

```js
externals: {
  'jquery': 'jquery'
},

entry: {
    entry: './src/main.js',
    vendor: ['vue', 'vue-router', 'vuex', 'element-ui']
},
// 这里的output为base中的output，不是生产的output
output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    libraryTarget: "umd",
    publicPath: process.env.NODE_ENV === 'production' ?
        config.build.assetsPublicPath : config.dev.assetsPublicPath
},
externals: {
    echarts: 'echarts',
    _: 'lodash'
},
```

- 2. CDN: 背景图片会有问题
  - url-loader 中单独配置 cdn，做到 js 访问线上路径，静态资源使用 cdn，两者互不影响
- url-loader 不能检测到 js 中的 background，所以我们凡是在 js 中引用的地址，必须在外面先 import 这张图片，url-loader 才会解析并打包

  - [webpack 之前端性能优化](https://www.cnblogs.com/ssh-007/p/7944491.html)

- 3.打包后的 js 过大，将 js 打包多个文件
  - 由于 webpack 打包后的 js 过大，以至于在加载资源时间过长。所以将文件打包成多个 js 文件，在需要的时候按需加载。
    优化方案：

```js
entry:{
 main:'xxx.js'
}
plugins:{
 new commonsChunkPlugin({
 name:'commons',
 minChunks:function(module){
  // 下边return参考的vue-cli配置
  // any required modules inside node_modules are extracted to vendor
  return (
   module.resource &&
   /\.js$/.test(module.resource) &&
   module.resource.indexOf(
   path.join(__dirname, '../node_modules')
   ) === 0
  )
 }
}) ,
// 以下才是关键
new commonsChunkPlugin({
 name:'charts',
 chunks:['commons']
 minChunks:function(module){
  return (
   module.resource &&
   /\.js$/.test(module.resource) &&
   module.resource.indexOf(
   path.join(__dirname, '../node_modules')
   ) === 0 && ['jquery.js', 'highcharts.js','echarts'].indexOf( module.resource.substr(module.resource.lastIndexOf('/')+1).toLowerCase() ) != -1
  )
 }
})
}
```

- 4.使用 webpack.optimize.UglifyJsPlugin 插件压缩混淆 js 代码，使用方法如下：

```js
plugins: [//webpack.config.jsnew webpack.optimize.UglifyJsPlugin({    warnings: false,
    compress: {
        join_vars: true,
        warnings: false,
    },
    toplevel: false,
    ie8: false,
]
```

- 5.webpack 优化之 preload 和 prefetch

```js
prefetch


这段代码告诉浏览器，这段资源将会在未来某个导航或者功能要用到，但是本资源的下载顺序权重比较低。也就是说prefetch通常用于加速下一次导航，而不是本次的。
被标记为prefetch的资源，将会被浏览器在空闲时间加载。


preload


preload通常用于本页面要用到的关键资源，包括关键js、字体、css文件。
preload将会把资源得下载顺序权重提高，使得关键数据提前下载好，优化页面打开速度。

```

- 参考： [webpack 优化之 preload 和 prefetch](https://www.jianshu.com/p/d2152789759d)

## 优化

```
1. 缩小文件搜索范围,配置比如resolve.modules,resolve.modules,resolve.mainFields,resolve.alias ,resolve.extensions ,module.noParse 配置
2. 使用DllPlugin 要给 Web 项目构建接入动态链接库
3.HappyPack 就能让 Webpack 做到这点，它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程
4.当 Webpack 有多个 JavaScript 文件需要输出和压缩时，原本会使用 UglifyJS 去一个个挨着压缩再输出， 但是 ParallelUglifyPlugin 则会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成
5.可以监听文件的变化，当文件发生变化后可以自动刷新浏览器，从而提高开发效率。
6.(Hot Module Replacement)的技术可在不刷新整个网页的情况下做到超灵敏的实时预览。 原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块。
7.Tree Shaking 可以用来剔除 JavaScript 中用不上的死代码。它依赖静态的 ES6 模块化语法，例如通过 import 和 export 导入导出
8.可以使用CommonsChunkPlugin 把多个页面公共的代码抽离成单独的文件进行加载
9.Webpack 内置了强大的分割代码的功能去实现按需加载，可以用import实现路由按需加载。
10.Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快， 它又译作 "作用域提升"
11.可以使用可视化分析工具 Webpack Analyse等去分析输出结果，从页进行优化.
12. 对于 Webpack4，打包项目使用 production 模式，这样会自动开启代码压缩
13.优化图片，对于小图可以使用 base64 的方式写入文件中
14. 给打包出来的文件名添加哈希，实现浏览器缓存文件


参考链接：https://www.jianshu.com/p/9bc2f63da883
```

- 参考: [webpack 优化入门详解](https://juejin.im/post/5a869044f265da4e9c632f94)
  - [vue + webpack 前端性能优化](https://juejin.im/post/5bc5c106e51d450e7a253e1b)

## 参考

- [webpack 打包原理](https://www.jianshu.com/p/e24ed38d89fd)
- [如何实现一个简单的 webpack](https://github.com/youngwind/blog/issues/99)
- [webpack 源码解析](https://lihuanghe.github.io/2016/05/30/webpack-source-analyse.html)
- [Webpack——令人困惑的地方](https://github.com/chemdemo/chemdemo.github.io/issues/13)

import { Button } from 'antd' ，打包的时候只打包 button，分模块加载，是怎么做到的

- 使用 import 时，webpack 对 node_modules 里的依赖会做什么
