# es5 实现 es6 的 class

```js
function Super() {}
Super.prototype.getNumber = function() {
  return 1
}

function Sub() {}
let s = new Sub()
Sub.prototype = Object.create(Super.prototype, {
  constructor: {
    value: Sub,
    enumerable: false,
    writable: true,
    configurable: true
  }
})
```

## ES6 中的 class 和 ES5 的类有什么区别？

1. ES6 class 内部所有定义的方法都是不可枚举的;
2. ES6 class 必须使用 new 调用;
3. ES6 class 不存在变量提升;
4. ES6 class 默认即是严格模式;
5. ES6 class 子类必须在父类的构造函数中调用 super()，这样才有 this 对象;ES5 中类继承的关系是相反的，先有子类的 this，然后用父类的方法应用在 this 上

## 参考

[分析 Babel 编译代码，深入理解 ES6 的类与继承](https://github.com/fi3ework/blog/issues/13)
