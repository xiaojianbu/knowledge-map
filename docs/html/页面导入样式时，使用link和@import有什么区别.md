# 页面导入样式时，使用 link 和@import 有什么区别

1. link 是 HTML 标签，@import 是 CSS 提供的
2. 引入样式的阶段不一样，link 是页面加载的时候同时加载，@import 需要等到页面加载完成后再加载
3. link 是 DOM 元素，支持通过 JavaScript 控制 DOM 和修改样式
