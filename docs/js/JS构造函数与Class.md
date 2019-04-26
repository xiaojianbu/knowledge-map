# JS构造函数与Class

```js
// js构造函数
function MathHandle(x, y) {
  this.x = x;
  this.y = y;
}

MathHandle.prototype.add = function () {
  return this.x + this.y;
}

var m = new MathHandle(1, 2);
console.log(m.add())
```

```js
// class
class MathHandle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add() {
    return this.x + this.y;
  }
}

const m = new MathHandle(1, 2)
console.log(m.add())
```

## 本质

```js
typeof MathHandle // function
MathHandle === MathHandle.prototype.constructor // true
m.__proto__ === MathHandle.prototype // true
```

## class和普通构造函数的区别

1. 类的内部所有定义的方法，都是不可枚举的（但是在 es5 中 prototype 的方法是可以进行枚举的）
2. 每一个类中都有一个 constructor 方法该方法返回实例对象
3. 类的构造函数，不使用 new 是没法调用的，会报错。这是它跟普通构造函数的一个主要区别，后者不用 new 也可以执行

## 参考文章

[ES6 class创建对象和传统方法生成对象的区别](http://www.fly63.com/article/detial/417)
