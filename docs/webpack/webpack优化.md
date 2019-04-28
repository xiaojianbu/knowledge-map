# webpack 优化

1. 分离第三方库(依赖),比如引入 dll 或 通过引用外部文件的方式引入第三方库
2. 引入多进程编译,比如 happypack
3. 提取公共的依赖模块,比如 commonChunkPlugin
4. 资源混淆和压缩:比如 UglifyJS
5. 分离样式这些,单独打包,减小 bundle chunk 的大小,比如 ExtractTextPlugin
6. GZIP 压缩,在打包的时候对资源对齐压缩,只要部署的服务器能解析即可..减少请求的大小
7. 还有按需加载这些,一般主流的框架都有对应的模块懒加载方式.
8. 至于 tree shaking 目前 webpack3/4 已经默认集成

## vue 项目案例, 分离第三方代码和业务代码

第一次打包 7s, 引入 elemntui 后 16s, 现在开始进行优化

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
