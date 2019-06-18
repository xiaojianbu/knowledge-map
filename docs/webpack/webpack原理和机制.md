# webpack 原理和机制

## webpack 常见配置

```js
const path = require('path')
module.exports = {
  // webpack 打包入口, 从该模块开始构建并计算出直接或间接依赖的模块或者库
  entry: './app/entry', // string | object | array
  // 定义 webpack 如何输出
  output: {
    path: path.resolve(__dirname, 'dist'), // string 所有输出文件的目标路径
    filename: '[chunkhash].js', // string [入口（entry chunk）]文件命名模板
    publicPath: '/assets/' // string 构建文件的输出目录
    /* 其它高级配置 */
  },
  // 模块相关配置
  module: {
    // 配置模块loaders，解析规则，将各类型的文件处理成 webpack 能够处理的模块
    rules: [
      {
        test: /\.jsx?$/, // RexExp | string
        include: [
          // 和test一样，必须匹配选项
          path.resolve(__dirname, 'app')
        ],
        exclude: [
          // 必不匹配选项（优先级高于 test 和 include）
          path.resolve(__dirname, 'app/demo-files')
        ],
        loader: 'babel-loader', // 模块上下文解析
        // loader的可选项
        options: {
          presets: ['es2015']
        }
      }
    ]
  },
  // 解析模块的可选项
  resolve: {
    // 模块的查找目录
    modules: ['node_modules', path.resolve(__dirname, 'app')],
    //用到的文件的扩展
    extensions: ['.js', '.json', '.jsx', '.css'],
    // 模块别名列表
    alias: {
      module: 'new-module'
    }
  },
  // 为浏览器开发者工具添加元数据增强调试
  devtool: 'source-map',
  plugins: [] // 附加插件列表,从打包优化和压缩，一直到重新定义环境中的变量。
}
```

Chunk：coding split 的产物，我们可以对一些代码打包成一个单独的 chunk，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间，使用 SplitChunksPlugin。

## webpack 原理

webpack 中每个模块有一个唯一的 id，是从 0 开始递增的，整个打包后的 bundle.js 是一个匿名函数自执行，参数则为一个数组。数组的每一项都为个 function，function 的内容则为每个模块的内容，并按照 require 的顺序排列， 识别入口文件,识别模块依赖，来打包代码。webpack 做的就是分析代码,转换代码，编译代码，输出代码

## 如何按需加载代码

vue 中按需加载

如 Element 出品的 babel-plugin-component 和 AntDesign 出品的 babel-plugin-import

在.babelrc 配置中或 babel-loader 的参数中进行设置，即可实现组件按需加载了

```js
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

单页应用的按需加载

使用 es6 的 import 按需语法,通过 import(\*)语句来控制加载时机，webpack 内置了对于 import(\*)的解析，会将 import(\*)中引入的模块作为一个新的入口在生成一个 chunk。 当代码执行到 import(\*)语句时，会去加载 Chunk 对应生成的文件。

## webpack 机制

1. 解析 webpack 配置参数，合并从 shell 传入和 webpack.config.js 文件里配置的参数，生产最后的配置结果。

2. 注册所有配置的插件，好让插件监听 webpack 构建生命周期的事件节点，以做出对应的反应。

3. 从配置的 entry 入口文件开始解析文件构建 AST 语法树，找出每个文件所依赖的文件，递归下去。

4. 在解析文件递归的过程中根据文件类型和 loader 配置找出合适的 loader 用来对文件进行转换。

5. 递归完后得到每个文件的最终结果，根据 entry 配置生成代码块 chunk。

6. 输出所有 chunk 到文件系统。

## 参考

[webpack 详解](https://juejin.im/post/5aa3d2056fb9a028c36868aa)
