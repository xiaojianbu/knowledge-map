# webpack 常见问题

## css-loader 和 style-loader 的内容和区别

css-loader 用来处理 css 中 url 的路径

style-loader 可以把 css 文件变成 style 标签插入 head 中

## webpack 打包是如何处理 css 图片

图片则需要用到 file-loader 或 url-loader

在 JavaScript 中引入图片路径时，webpack 并不知道它是一张图片，所以需要先用 require 将图片资源加载进来，然后再作为图片路径添加到对象上。

url-loader 和 file-loader 功能基本一致，只不过 url-loader 能将小于某个大小（可以自定义配置）的图片进行 base64 格式的转化处理。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: ['file-loader']
      }
    ]
  }
}
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: ['url-loader'],
        options: {
          name: './images/[name].[ext]',
          limit: 1024,
          publicPath: '../images/',
          outputPath: 'images/'
        }
      }
    ]
  }
}
```

## import { Button } from 'antd' ，打包的时候只打包 button，分模块加载，是怎么做到的

通过 babel-plugin-import 配置处理。

```js
{
  "plugins": [
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": "css"
    }]
  ]
}
```

## 使用 import 时，webpack 对 node_modules 里的依赖会做什么

## webpack 如何解析代码模块路径

模块解析规则

1. 解析相对路径
2. 查找相对当前模块的路径下是否有对应文件或文件夹
3. 是文件则直接加载
4. 是文件夹则继续查找文件夹下的 package.json 文件
   有 package.json 文件则按照文件中 main 字段的文件名来查找文件
   无 package.json 或者无 main 字段则查找 index.js 文件
5. 解析模块名
   查找当前文件目录下，父级目录及以上目录下的 node_modules 文件夹，看是否有对应名称的模块
   解析绝对路径（不建议使用）
   直接查找对应路径的文件

resolve.alias
配置某个模块的别名

resolve.extensions
配置可以定义在进行模块路径解析时，webpack 会尝试帮你补全那些后缀名来进行查找

## tree-shaking 的工作原理

Tree shaking 是一种通过清除多余代码方式来优化项目打包体积的技术

只需要将 mode 设置为 production 即可开启 tree shaking

## Happypack

## 为何要使用构建工具？它解决了什么问题？

- 处理模块化：CSS 和 JS 的模块化语法，目前都无法被浏览器兼容。因此，开发环境可以使用既定的模块化语法，但是需要构建工具将模块化语法编译为浏览器可识别形式。
- 编译语法：编写 CSS 时使用 Less、Sass，编写 JS 时使用 ES6、TypeScript 等。这些标准目前也都无法被浏览器兼容，因此需要构建工具编译，例如使用 Babel 编译 ES6 语法。
- 代码压缩：将 CSS、JS 代码混淆压缩，为了让代码体积更小，加载更快。

## 参考

[面试必备！webpack 中那些最易混淆的 5 个知识点](https://juejin.im/post/5cede821f265da1bbd4b5630)
