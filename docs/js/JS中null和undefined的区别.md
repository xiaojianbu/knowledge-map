# JS 中 null 和 undefined 的区别

在 JS 中，**undefined**意味着一个变量已经声明了，但尚未分配一个值。例如：

```js
let testVar
console.log(testVar) // undefined
console.log(typeof testVar) // undefined
```

null 是一个赋值。它可以分配给一个变量作为无值的表示。例如：

```js
let testVar = null
console.log(testVar) // null
console.log(typeof testVar) // object
```

从上面的例子可以看出，undefined 和 null 是两种不同的类型。

null 表示"没有对象"，即该处不应该有值。典型用法是：

（1） 作为函数的参数，表示该函数的参数不是对象。

（2） 作为对象原型链的终点。

```js
Object.getPrototypeOf(Object.prototype) // null
```

undefined 表示"缺少值"，就是此处应该有一个值，但是还没有定义。典型用法是：

（1）变量被声明了，但没有赋值时，就等于 undefined。

（2) 调用函数时，应该提供的参数没有提供，该参数等于 undefined。

（3）对象没有赋值的属性，该属性的值为 undefined。

（4）函数没有返回值时，默认返回 undefined。

1. 当调用函数语句列表中的参数数量少于参数列表的函数时，超出的参数将设置为 undefined
2. 当一个函数没有返回值时，它返回 undefined。通常不需要使用这样的返回结果.
3. 当你通过在一个块中声明一个 var 语句来声明一个变量，但尚未给它赋值时，它是未定义的。
4. 当它的操作数是一个不存在的简单变量时，typeof 运算符返回 'undefined'，而不是像通常发生的那样抛出错误。
5. 当你访问一个对象的不存在的属性时，不会立即得到像其他语言一样的错误。相反，会得到一个**undefined**。

## 参考来源

[What is the difference between null and undefined in JavaScript?](https://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript/5076962#5076962)

[Can I set variables to undefined or pass undefined as an argument?](https://stackoverflow.com/questions/2235622/can-i-set-variables-to-undefined-or-pass-undefined-as-an-argument/2236186#2236186)

[undefined 与 null 的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)
