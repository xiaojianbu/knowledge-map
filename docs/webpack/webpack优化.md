# webpack 优化

分离第三方库(依赖),比如引入 dll
引入多进程编译,比如 happypack
提取公共的依赖模块,比如 commonChunkPlugin
资源混淆和压缩:比如 UglifyJS
分离样式这些,减小 bundle chunk 的大小,比如 ExtractTextPlugin
GZIP 压缩,在打包的时候对资源对齐压缩,只要部署的服务器能解析即可..减少请求的大小
还有按需加载这些,一般主流的框架都有对应的模块懒加载方式.
至于 tree shaking 目前 webpack3/4 已经默认集成

提取第三方库或通过引用外部文件的方式引入第三方库
代码压缩插件UglifyJsPlugin
服务器启用gzip压缩
按需加载资源文件 require.ensure
优化devtool中的source-map
剥离css文件，单独打包
去除不必要插件，通常就是开发环境与生产环境用同一套配置文件导致 #####打包效率
开发环境采用增量构建，启用热更新
开发环境不做无意义的工作如提取css计算文件hash等
配置devtool
选择合适的loader
个别loader开启cache 如babel-loader
第三方库采用引入方式
提取公共代码
优化构建时的搜索路径 指明需要构建目录及不需要构建目录
模块化引入需要的部分

1、hash（contenthash, chunkhash）

2、多页面配置

3、发布上线流程

4、如何加快打包速度，减少打包体积

5、和其他工具的区别（grunt,glup,rollup,parcel,Browserify）

构建的速度和体积分别是如何优化的？

核心概念 - Loaders
处理文件

转化为模块

module: {
  // ...
  rules: [
    {
      test: /\.jsx?/, // 匹配文件路径的正则表达式，通常我们都是匹配文件类型后缀
      include: [
        path.resolve(__dirname, 'src') // 指定哪些路径下的文件需要经过 loader 处理
      ],
      use: 'babel-loader', // 指定使用的 loader
    },
  ],
}
核心概念 - Plugins
参与打包的整个过程

打包优化和压缩

配置编译时的变量

极其灵活



html-webpack-plugin 
构建时 html-webpack-plugin 会为我们创建一个 HTML 文件，其中会引用构建出来的 JS 文件。实际项目中，默认创建的 HTML 文件并没有什么用，我们需要自己来写 HTML 文件，可以通过 html-webpack-plugin 的配置，传递一个写好的 HTML 模板：

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'assets/index.html', // 配置文件模板
    }),
  ],
}


vue 项目案例, 分离第三方代码和业务代码
第一次打包 7s, 引入 elemntui 后 16s, 现在开始进行优化

新建 webpack.dll.conf.js:

像 elemntui 这种第三方不去改变的库, 不希望每次都去 build, 独立出来

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
配置 webpack.prod.conf.js:

plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('../src/dll/ui-manifest.json')
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../src/dll/vue-manifest.json')
    }),
  ]
webpack 如何解析代码模块路径
模块解析规则
解析相对路径
查找相对当前模块的路径下是否有对应文件或文件夹
是文件则直接加载
是文件夹则继续查找文件夹下的 package.json 文件
有 package.json 文件则按照文件中 main 字段的文件名来查找文件
无 package.json 或者无 main 字段则查找 index.js 文件
解析模块名
查找当前文件目录下，父级目录及以上目录下的 node_modules 文件夹，看是否有对应名称的模块
解析绝对路径（不建议使用）
直接查找对应路径的文件


resolve.alias
配置某个模块的别名

resolve.extensions
配置可以定义在进行模块路径解析时，webpack 会尝试帮你补全那些后缀名来进行查找
