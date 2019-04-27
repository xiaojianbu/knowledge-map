# Promise

```js
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
```

以上, 创建 Promise 对象时, 传入的回调函数 function(resolve, reject){}默认拥有两个参数, 分别为:

- resolve, 用于改变该 Promise 本身的状态为实现, 执行后, 将触发 then 的 onFulfilled 回调, 并把 resolve 的参数传递给 onFulfilled 回调.
- reject, 用于改变该 Promise 本身的状态为拒绝, 执行后, 将触发 then | catch 的 onRejected 回调, 并把 reject 的参数传递给 onRejected 回调.

一个 Promise 就是一个代表了异步操作最终完成或者失败的对象。

一个 Promise 有以下几种状态:

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成， 只在 resolve 方法执行时才进入该状态。
- rejected: 意味着操作失败， 只在 reject 方法执行时或抛出错误的情况下才进入该状态.。

promise 只能成功或失败一次，而不能成功或失败两次，也不能从成功转为失败或从失败转为成功。

如果 promise 已成功或失败，且之后添加了成功/失败回调，则将会调用正确的回调，即使事件发生在先。

promise 本质上是一个绑定了回调的对象，而不是将回调传进函数内部

Promise.resolve() 和 Promise.reject() 是手动创建一个已经 resolve 或者 reject 的 promise 快捷方法。它们有时很有用。

Promise.all() 和 Promise.race()是并行运行异步操作的两个组合式工具。

Promise 的原型仅有两个自身方法, 分别为 Promise.prototype.then , Promise.prototype.catch

根据 Promise 规范, then 或 catch 即使未显式指定返回值, 它们也总是默认返回一个新的 fulfilled 状态的 promise 对象.

传递到 then 中的函数被置入了一个微任务队列，而不是立即执行，这意味着它是在 JavaScript 事件队列的所有运行时结束了，事件队列被清空之后才开始执行

## 顺序执行异步事件

```js
var sequence = Promise.resolve()

urls.forEach(url => {
  sequence = sequence
    .then(() => {
      return ajax(url)
    })
    .then(result => {
      doSomeThing(result)
    })
})

urls.reduce((sequence, url) => {
  return sequence
    .then(() => {
      return ajax(url)
    })
    .then(result => {
      doSomeThing(result)
    })
}, Promise.resolve())

async function order(urls) {
  const promises = urls.map(async url => {
    const response = await ajax(url)
    return response
  })

  for (const promise of promises) {
    console.log(await promise)
  }
}
```

## 问题

### catch 能捕获所有的错误吗？

不能

### 为什么有些时候会抛出"Uncaught (in promise) …"

Promise.reject 返回了一个拒绝状态的 Promise 对象. 对于这样的 Promise 对象, 如果其后续 then | catch 中都没有声明 onRejected 回调, 它将会抛出一个 "Uncaught (in promise) ..."的错误.

### Promise.resolve 和 Promise.reject 处理 Promise 对象时又有什么不一样的地方

- 对于 Promise.reject(promise), 它只是简单地包了一个拒绝状态的 promise 壳, 参数 promise 什么都没变.
- 对于 Promise.resolve(promise), 仅仅返回参数 promise 本身.

## Promise 实现

```js
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject报错
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  // 防止多次调用
  let called
  // x不是null 且x是对象或者函数
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规定，声明then = x的then方法
      let then = x.then
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') {
        // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
        then.call(
          x,
          y => {
            // 成功和失败只能调用一个
            if (called) return
            called = true
            // resolve的结果依旧是promise 那就继续解析
            resolvePromise(promise2, y, resolve, reject)
          },
          err => {
            // 成功和失败只能调用一个
            if (called) return
            called = true
            reject(err) // 失败了就失败了
          }
        )
      } else {
        resolve(x) // 直接成功即可
      }
    } catch (e) {
      // 也属于失败
      if (called) return
      called = true
      // 取then出错了那就不要在继续执行了
      reject(e)
    }
  } else {
    resolve(x)
  }
}

export default class Promise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
  then(onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : value => value
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : err => {
            throw err
          }
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        // 异步
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.state === 'rejected') {
        // 异步
        setTimeout(() => {
          // 如果报错
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    // 返回promise，完成链式
    return promise2
  }
}
```

```js
// 三种状态
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
  let _this = this
  _this.currentState = PENDING
  _this.value = undefined
  // 用于保存 then 中的回调，只有当 promise
  // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
  _this.resolvedCallbacks = []
  _this.rejectedCallbacks = []

  _this.resolve = function(value) {
    if (value instanceof MyPromise) {
      // 如果 value 是个 Promise，递归执行
      return value.then(_this.resolve, _this.reject)
    }
    setTimeout(() => {
      // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = RESOLVED
        _this.value = value
        _this.resolvedCallbacks.forEach(cb => cb())
      }
    })
  }

  _this.reject = function(reason) {
    setTimeout(() => {
      // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = REJECTED
        _this.value = reason
        _this.rejectedCallbacks.forEach(cb => cb())
      }
    })
  }
  // 用于解决以下问题
  // new Promise(() => throw Error('error))
  try {
    fn(_this.resolve, _this.reject)
  } catch (e) {
    _this.reject(e)
  }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
  var self = this
  // 规范 2.2.7，then 必须返回一个新的 promise
  var promise2
  // 规范 2.2.onResolved 和 onRejected 都为可选参数
  // 如果类型不是函数需要忽略，同时也实现了透传
  // Promise.resolve(4).then().then((value) => console.log(value))
  onResolved = typeof onResolved === 'function' ? onResolved : v => v
  onRejected = typeof onRejected === 'function' ? onRejected : r => throw r

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function(resolve, reject) {
      // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
      // 所以用了 setTimeout 包裹下
      setTimeout(function() {
        try {
          var x = onResolved(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    }))
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise(function(resolve, reject) {
      setTimeout(function() {
        // 异步执行onRejected
        try {
          var x = onRejected(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    }))
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise(function(resolve, reject) {
      self.resolvedCallbacks.push(function() {
        // 考虑到可能会有报错，所以使用 try/catch 包裹
        try {
          var x = onResolved(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })

      self.rejectedCallbacks.push(function() {
        try {
          var x = onRejected(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
    }))
  }
}
// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
  if (promise2 === x) {
    return reject(new TypeError('Error'))
  }
  // 规范 2.3.2
  // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(function(value) {
        // 再次调用该函数是为了确认 x resolve 的
        // 参数是什么类型，如果是基本类型就再次 resolve
        // 把值传给下个 then
        resolutionProcedure(promise2, value, resolve, reject)
      }, reject)
    } else {
      x.then(resolve, reject)
    }
    return
  }
  // 规范 2.3.3.3.3
  // reject 或者 resolve 其中一个执行过得话，忽略其他的
  let called = false
  // 规范 2.3.3，判断 x 是否为对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 规范 2.3.3.2，如果不能取出 then，就 reject
    try {
      // 规范 2.3.3.1
      let then = x.then
      // 如果 then 是函数，调用 x.then
      if (typeof then === 'function') {
        // 规范 2.3.3.3
        then.call(
          x,
          y => {
            if (called) return
            called = true
            // 规范 2.3.3.3.1
            resolutionProcedure(promise2, y, resolve, reject)
          },
          e => {
            if (called) return
            called = true
            reject(e)
          }
        )
      } else {
        // 规范 2.3.3.4
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // 规范 2.3.4，x 为基本类型
    resolve(x)
  }
}
```

```js
function myPromise(constructor) {
  let self = this
  self.status = 'pending' //定义状态改变前的初始状态
  self.value = undefined //定义状态为resolved的时候的状态
  self.reason = undefined //定义状态为rejected的时候的状态
  function resolve(value) {
    //两个==="pending"，保证了状态的改变是不可逆的
    if (self.status === 'pending') {
      self.value = value
      self.status = 'resolved'
    }
  }
  function reject(reason) {
    //两个==="pending"，保证了状态的改变是不可逆的
    if (self.status === 'pending') {
      self.reason = reason
      self.status = 'rejected'
    }
  }
  //捕获构造异常
  try {
    constructor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
```

## 实现 Promise.finally

```js
Promise.prototype.finally = function(callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason =>
      P.resolve(callback()).then(() => {
        throw reason
      })
  )
}
```

## 参考来源

[Promise 使用手册](https://juejin.im/post/58f41a13a0bb9f006aa1aab4)
