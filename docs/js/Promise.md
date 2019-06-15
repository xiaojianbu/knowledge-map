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

Promise 的 executor 是一个同步函数，即非异步，立即执行的一个函数，因此他应该是和当前的任务一起执行的。而 Promise 的链式调用 then，每次都会在内部生成一个新的 Promise，然后执行 then，在执行的过程中不断向微任务(microtask)推入新的函数，因此直至微任务(microtask)的队列清空后才会执行下一波的 macrotask。

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

```js
new Promise(function(resolve, reject) {
  Promise.reject('返回一个拒绝状态的Promise')
}).catch(function(reason) {
  console.log('catch:', reason)
})
```

Promise.reject 返回了一个拒绝状态的 Promise 对象. 对于这样的 Promise 对象, 如果其后续 then | catch 中都没有声明 onRejected 回调, 它将会抛出一个 “Uncaught (in promise) …”的错误.如上所示, 原语句是 “Promise.reject(‘返回一个拒绝状态的 Promise’);” 其后续并没有跟随任何 then | catch 语句, 因此它将抛出错误, 且该错外部的 Promise 无法捕获.

不仅如此, Promise 之间泾渭分明, 内部 Promise 抛出的任何错误, 外部 Promise 对象都无法感知并捕获. 同时, 由于 promise 是异步的, try catch 语句也无法捕获其错误.

### 为什么有些时候会抛出"Uncaught (in promise) …"

Promise.reject 返回了一个拒绝状态的 Promise 对象. 对于这样的 Promise 对象, 如果其后续 then | catch 中都没有声明 onRejected 回调, 它将会抛出一个 "Uncaught (in promise) ..."的错误.

## Promise.resolve 方法的参数

1）参数是一个 Promise 实例

如果参数是 Promise 实例，那么 Promise.resolve 将不做任何修改、原封不动地返回这个实例。

2）参数是一个 thenable 对象，Promise.resolve 方法会将这个对象转为 Promise 对象，然后就立即执行 thenable 对象的 then 方法。

3）参数不是具有 then 方法的对象，或根本就不是对象。

如果参数是一个原始值，或者是一个不具有 then 方法的对象，则 Promise.resolve 方法返回一个新的 Promise 对象，状态为 resolved。

4）不带有任何参数

Promise.resolve 方法允许调用时不带参数，直接返回一个 resolved 状态的 Promise 对象。

### Promise.resolve 和 Promise.reject 处理 Promise 对象时又有什么不一样的地方

- 对于 Promise.reject(promise), 它只是简单地包了一个拒绝状态的 promise 壳, 参数 promise 什么都没变.
- 对于 Promise.resolve(promise), 仅仅返回参数 promise 本身.

### 取消一个 promise

Promise 的设计就是一个状态机，pending 到 resolve / reject 的状态变换是单向且唯一的，没有所谓的 cancel 状态。cancel 的加入会带来更多的状态问题，并不适合 Promise 这一模式来处理（这类场景下，RxJS 这类 FRP 的方案应该更为适合）。

cancel 会带来什么状态问题呢？拿电商的退款来举例子。你买了一个东西（开始一个 pending 的 promise），然后东西还没收到（还没 resolve），你后悔了，点击了退款（把状态改为 cancel），但这时退款流程也不能立刻生效，需要审核（cancel 后不能立刻 reject），那这时候你发工资了，又不想退款了，又点了【取消退款】，这时候又是一个异步的状态更改（把 cancel 再 cancel 掉），而【取消退款】也是异步的，你还能取消【取消退款】的操作（把 cancel 在 cancel 掉前再 cancel 掉？）别忘了，这时候每一步状态变化还都可以对应到 resolve 和 reject 呢。好的同学们，接下来请画出流程的状态变化图，并编码实现这个支持 cancel 的 promise?

已经发生的操作是不能 cancel 的，要 cancel 也只是 cancel 这个操作本该有的后续操作

取消 Promise 的一些方法：Bluebird

```js
const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

const cancelablePromise = makeCancelable(
  new Promise(r => component.setState({...}}))
);

cancelablePromise
  .promise
  .then(() => console.log('resolved'))
  .catch((reason) => console.log('isCanceled', reason.isCanceled));

cancelablePromise.cancel(); // Cancel the promise
```

```js
Promise.resolve()
  .then(() => {
    console.log('ok1')
    return new Promise(() => {}) // 返回“pending”状态的Promise对象
  })
  .then(() => {
    // 后续的函数不会被调用
    console.log('ok2')
  })
  .catch(err => {
    console.log('err->', err)
  })
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

https://juejin.im/post/5cf7857ff265da1bac4005b2
