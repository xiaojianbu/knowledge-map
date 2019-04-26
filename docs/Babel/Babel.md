# Babel

## Babel 出现的背景

将 JS 中的最新语法转换为 ES5，让低版本运行环境（浏览器和 node）能够运行。

## Babel 组成部分和关键点

Babel 的转换过程分为三个 parsing（解析）、transforming（转换）、generating（生成）。

Babel 本身不具有任何转换功能，转换的功能都分解到一个个 plugin 里面。

以 ES6 代码转换为 ES5 代码为例：

ES6 代码 ==> babylon 进行解析 ==> 得到 AST ==> plugin 用 babel-traverse 对 AST 树进行遍历转换 ==> 得到新的 AST 树 ==> 用 babel-generator 通过 AST 树生成 ES5 代码。

### 使用

1. 将插件的名字添加到配置文件中（根目录下面.babelrc 或者 package.json 的 babel 中）;
2. 安装相应插件。

### babel-polyfill

包含 core-js 和 regenerator runtime

polyfill 会污染原来的全局变量（因为新的原生对象、API 这些都直接由 polyfill 引入到全局变量）

## Babel 底层原理和关键实现

## 参考

[Babel](https://babeljs.io/)

[一口(很长的)气了解 babel](https://juejin.im/post/5c19c5e0e51d4502a232c1c6)
