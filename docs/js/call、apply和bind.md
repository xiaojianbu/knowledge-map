# call、apply 和 bind

这三个函数都是改变了当前函数的 this 指向。

- apply 接收的是数组，并会立即执行
- call 接收的是用逗号隔开的参数，并会立即执行
- bind 接收的是用逗号隔开的参数，但是不会立即执行，而是返回一个新的函数

## bind

bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效

```js
if (typeof Function.prototype.bind === 'undefined') {
  Function.prototype.bind = function(thisArgs) {
    let fn = this
    let slice = Array.prototype.slice
    let args = slice.call(arguments, 1)

    return function() {
      return fn.apply(thisArgs, args, concat(slice.call(arguments)))
    }
    // if (typeof this !== 'function') {
    //   throw new TypeError('Error')
    // }
    // var _this = this
    // var args = [...arguments].slice(1)
    // // 返回一个函数
    // return function F() {
    //   // 因为返回了一个函数，我们可以 new F()，所以需要判断
    //   if (this instanceof F) {
    //     return new _this(...args, ...arguments)
    //   }
    //   return _this.apply(context, args.concat(...arguments))
    // }
  }
}
function example() {
  console.log(this)
}
const boundExample = bind(example, { a: true })
boundExample.call({ b: true }) // logs { a: true }
// 返回一个接受任意数量参数，通过 ... rest 操作符收集参数的函数。 在这个函数中，返回一个由 Function.prototype.apply 调用，context 作为上下文，args 作为参数数组的函数 fn

const bind = (fn, context) => (...args) => fn.apply(context, args)
```

## call

- 将函数设为传入参数的属性
- 指定 this 到函数并传入给定参数执行函数
- 如果不传入参数或者参数为 null，默认指向为 window / global
- 删除参数上的函数

```js
if (typeof Function.prototype.call === 'undefined') {
  Function.prototype.call = function(context) {
    context = context || window
    context.fn = this
    // 将context后面的参数取出来
    let args = [...arguments].slice(1)
    let result = context.fn(...args)
    delete context.fn
    return result
  }
}
//测试代码
var foo = {
  name: 'Selina'
}
var name = 'Chirs'
function bar(job, age) {
  console.log(this.name)
  console.log(job, age)
}
bar.call(foo, 'programmer', 20)
// Selina programmer 20
bar.call(null, 'teacher', 25)
// 浏览器环境: Chirs teacher 25; node 环境: undefined teacher 25
```

## apply

```js
if (typeof Function.prototype.apply === 'undefined') {
  Function.prototype.apply = function(context) {
    context = context || window
    context.fn = this
    let result
    // 需要判断是否存储第二个参数
    // 如果存在，就将第二个参数展开
    if (arguments[1]) {
      result = context.fn(...arguments[1])
    } else {
      result = context.fn()
    }

    delete context.fn
    return result
  }
}
var foo = {
  name: 'Selina'
}
var name = 'Chirs'
function bar(job, age) {
  console.log(this.name)
  console.log(job, age)
}
bar.apply(foo, ['programmer', 20])
// Selina programmer 20
bar.apply(null, ['teacher', 25])
// 浏览器环境: Chirs programmer 20; node 环境: undefined teacher 25
```
