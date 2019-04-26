# JXS

事实上，JSX 并非一种全新的语言，而是一种语法糖，一种语法类似 XML 的 ECMAScript 语法扩充。

1. 提供更加语意化且易懂的标签
2. 更加简洁
3. 结合原生 JavaScript 语法

JSX 语法

html 形式

引入 JS 变量和表达式

if...else...

循环

style 和 className

事件

JSX 语法根本无法被浏览器所解析

## JSX 解析

JSX 其实是语法糖

开发环境会将 JSX 编译成 JS 代码

JSX 的写法大大降低了学习成本和编码工作量

同时, JSX 也会增加 debug 成本

JSX 是 React 引入的, 但不是 React 独有的

React 已经将它作为一个独立标准开放, 其他项目也可用

React.createElement 是可以自定义修改的

## JSX 和虚拟 DOM

### 为何需要虚拟 DOM

虚拟 DOM 是 React 初次推广开来的, 结合 JSX

JSX 就是模版, 最终要渲染成 html

初次渲染 + 修改 state 后的 re-render

正好符合 虚拟 DOM 的应用场景
