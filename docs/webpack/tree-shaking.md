# tree-shaking

虽然生产模式下默认开启，但是由于经过 babel 编译全部模块被封装成 IIFEIIFE 存在副作用无法被 tree-shaking 掉需要配置 { module: false } 和 sideEffects: falserollup 和 webpack 的 shaking 程度不同，以一个 Class 为例子
Common.js 和 es6 module 区别
