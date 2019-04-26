# this

**this** 对象是在运行时基于函数的执行环境绑定的：在全局函数中，**this** 等于 windows,而当函数被作为某个对象的方法调用时，**this** 等于那个对象。

如果箭头函数被非箭头函数包含，则 **this** 绑定的是最近一层非箭头函数的 **this**，且不能通过 **call()**、 **apply()** 或 **bind()** 方法来改变 **this** 的值。

```js
let value = 1
let result = (() => this.value).bind({ value: 2 })()
console.log(result) // 1
```

## 普通函数中的 this

### 普通函数调用

在默认情况下，没有找到直接调用者，则 **this** 指的是 window 对象；

在严格模式下，没有直接调用者的函数中的 **this** 为 undefined

```js
var name = 'test'
function showName() {
  console.log('name: ', this.name, this)
}
showName() // name: test Window
```

### 作为对象的方法调用

当作为对象的方法被调用时， **this** 这时就指向调用它的对象

```js
let obj = {
  name: 'test',
  showName() {
    console.log('name: ', this.name, this)
  }
}

obj.showName() // name:  test {name: "test", showName: ƒ}
```

### 构造函数的调用

当执行：

```js
let o = new Foo()
```

JavaScript 实际执行的是:

```js
let o = new Object()
o.__proto__ = Foo.prototype
Foo.call(o)
```

1.  创建对象，设为 o;
2.  将 o 的\_\_proto\_\_指向构造函数的原型对象；
3.  将 o 作为 this 去调用构造函数，从而设置 o 的属性和方法并初始化。

### apply/call/bind 调用

**this** 指的是绑定的对象；

如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象。

## 箭头函数中的 this

箭头函数没有自己的 **this**,所以需要通过查找作用域链来确定 **this** 的值。

## 图片解释

![this解释](https://raw.githubusercontent.com/xiaojianbu/markdownPicture/master/this/this.jpg)

## 原型链中的 this

如果该方法存在于一个对象的原型链上，那么 this 指向的是调用这个方法的对象，就像该方法在对象上一样。

## getter 与 setter 中的 this

用作 getter 或 setter 的函数都会把 this 绑定到设置或获取属性的对象。

## 作为一个 DOM 事件处理函数

当函数被用作事件处理函数时，它的 this 指向触发事件的元素

## 作为一个内联事件处理函数

当代码被内联 on-event 处理函数调用时，它的 this 指向监听器所在的 DOM 元素
