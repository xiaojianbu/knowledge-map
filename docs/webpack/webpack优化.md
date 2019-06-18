# webpack 优化

1. 分离第三方库(依赖),比如引入 dll 或 通过引用外部文件的方式引入第三方库
2. 引入多进程编译,比如 happypack(webpack4.0 默认并行)
3. 提取公共的依赖模块,比如 SplitChunksPlugin(webpack 4.0) CommonsChunkPlugin(webpack 3.0)
4. 资源混淆和压缩:比如 UglifyJS( 对于 Webpack4，打包项目使用 production 模式，这样会自动开启代码压缩 )
5. 分离样式这些,单独打包,减小 bundle chunk 的大小,比如 ExtractTextPlugin
6. GZIP 压缩,在打包的时候对资源对齐压缩,只要部署的服务器能解析即可..减少请求的大小
7. 还有按需加载这些,一般主流的框架都有对应的模块懒加载方式.
8. 至于 tree shaking 目前 webpack3/4 已经默认集成

## SplitChunksPlugin

```js
// webpack4最新配置，可以搜索关键字查查配置项
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0, // This is example is too small to create commons chunks
          name: 'common'
        }
      }
    }
  },

```

## vue 项目案例, 分离第三方代码和业务代码

dll 文件中做了如下几件事情：

1. 定义了各个子模块加载函数的映射表，即字面量对象 modules
2. 定义了内部加载器**webpack_require**及模块缓存 installedModules
3. 通过 requireModule 函数将内部加载器暴露给了全局变量 vue_01cf92ee1ec06f1bc497，供外部加载模块时调用

新建 webpack.dll.conf.js:

像 elemntui 这种第三方不去改变的库, 不希望每次都去 build, 独立出来

```js
const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    vue: ['vue', 'vue-router'],
    ui: ['element-ui']
  },
  output: {
    path: path.join(__dirname, '../src/dll/'),
    filename: '[name].dll.js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../src/dll/', '[name]-manifest.json'),
      name: '[name]'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}
```

配置 webpack.prod.conf.js:

```js
plugins: [
  new webpack.DllReferencePlugin({
    manifest: require('../src/dll/ui-manifest.json')
  }),
  new webpack.DllReferencePlugin({
    manifest: require('../src/dll/vue-manifest.json')
  })
]
```

## externals 配置优化

使用 externals 将第三方库以 cdn 的方式去引入

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

1. externals 中的 key 是 import 中使用的
2. externals 中的 value 是 window 下调用的

## webpack 优化之 preload 和 prefetch

```html
<!-- prefetch -->
<link rel="prefetch" ></link>
```

这段代码告诉浏览器，这段资源将会在未来某个导航或者功能要用到，但是本资源的下载顺序权重比较低。也就是说 prefetch 通常用于加速下一次导航，而不是本次的。
被标记为 prefetch 的资源，将会被浏览器在空闲时间加载。

```html
<!-- preload -->
<link rel="preload" ></link>
```

preload 通常用于本页面要用到的关键资源，包括关键 js、字体、css 文件。
preload 将会把资源得下载顺序权重提高，使得关键数据提前下载好，优化页面打开速度。
