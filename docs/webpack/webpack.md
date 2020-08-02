# webpack

CLI 工具（如 create-react-app 或 Vue -cli）已经为我们抽象了大部分配置，并提供了合理的默认设置。

webpack 的最终目标是将所有这些不同的源和模块类型统一起来，从而将所有内容导入 JavaScript 代码，并最生成可以运行的代码。

Loaders 是第三方扩展程序，可帮助 webpack 处理各种文件扩展名。 例如，CSS，图像或 txt 文件。

Loaders 的目标是在模块中转换文件（JavaScript 以外的文件）。 文件成为模块后，webpack 可以将其用作项目中的依赖项。

webpack loaders 是从右到左执行的。

sass-loader：加载 SASS / SCSS 文件并将其编译为 CSS

css-loader： 解析 css 代码中的 url、@import 语法像 import 和 require 一样去处理 css 里面引入的模块

style-loader：帮我们直接将 css-loader 解析后的内容挂载到 html 页面当中

插件是第三方扩展，可以更改 webpack 的工作方式。 例如，有一些用于提取 HTML，CSS 或设置环境变量的插件。

**代码拆分(Code splitting)**是指针对以下方面的优化技术：

- 避免出现一个很大的 bundle
- 避免重复的依赖关系

在 webpack 中有三种激活 code splitting 的主要方法:

有多个入口点

使用 optimization.splitChunks 选项

动态导入

第一种基于多个入口点的技术适用于较小的项目，但是从长远来看它是不可扩展的。这里我们只关注第二和第三种方式。

Webpack 的运行过程可以简单概括为以下几个步骤：

配置解析 -> 内置插件&配置插件注册 -> 确认入口获取依赖资源 -> 使用 Loader 翻译资源 -> 识别资源加载语句并递归的遍历所有资源 -> 封装依赖资源输出结果

PlugIn (插件) 系统

