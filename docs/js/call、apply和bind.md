# call、apply 和 bind

call 和 apply 都是为了解决改变 this 的指向，只是传参的方式不同（除了第一个参数之外，call 可以接收一个参数列表，apply 只接受一个参数数组）。

## bind

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

```js
if (typeof Function.prototype.call === 'undefined') {
  Function.prototype.call = function(context) {
    let context = context || window
    context.fn = this
    // 将context后面的参数取出来
    let args = [...arguments].slice(1)
    let result = context.fn(...args)
    delete context.fn
    return result
  }
}
```

## apply

```js
if (typeof Function.prototype.apply === 'undefined') {
  Function.prototype.apply = function(context) {
    let context = context || window
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
```
