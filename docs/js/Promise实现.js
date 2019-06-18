// Promise是一个构造函数
// Promise包含一个参数，这个参数类型是一个_匿名函数_
// 匿名函数包括2个形参，分别是 reject 和 resolve
// 这两个形参类型是 函数 ，且 reject 和 resolve 都有一个参数， 参数类型不限定
// 实例 是个 Promise
// 实例的 原型 上挂载了 2个方法，分别是 then 和 catch，同时then可以有多个，所以需要一个回掉函数队列
// 实例上 有2个属性，分别是 PromiseStatus 和 PromiseValue
// Promise根据定义 PromiseStatus 需要有 3种状态，分别是 pending , fulfilled，rejected

function Promise(fn) {
  this.PromiseStatus = 'pending'
  this.PromiseValue = ''

  this.resolvedCb = []
  this.rejectedCb = []

  var self = this

  var resolve = function(result) {
    // 判断状态
    if (self.PromiseStatus === 'pending') {
      self.PromiseStatus = 'resolved'
      self.PromiseValue = result
      // resolvedCb 队列依次执行
      for (let i = 0; i < self.resolvedCb.length; i++) {
        self.resolvedCb[i](result)
      }
    }
  }

  var reject = function(err) {
    // 判断状态
    if (self.PromiseStatus === 'pending') {
      self.PromiseStatus = 'rejected'
      self.PromiseValue = err

      // rejectedCb 队列依次执行
      for (var i = 0; i < self.rejectedCb.length; i++) {
        self.rejectedCb[i](result)
      }
    }
  }

  // 错误处理 -> rejected
  try {
    fn(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

// promise1 返回的值 需要塞到第一个 then 中函数的value上
// 链式调用,多次调用
// then 返回的是一个新的Promise
// then可以接受2个函数作为参数，一个是成功函数，一个是失败函数
// return 的值 直接作为下个 then 中匿名函数的入参
Promise.prototype.then = function(handleSuccess, handleFail) {
  var self = this
  var PromiseStatus = this.PromiseStatus

  if (typeof handleSuccess === 'function') {
    handleSuccess = handleSuccess
  } else {
    handleSuccess = function(result) {}
  }

  if (typeof handleFail === 'function') {
    handleFail = handleFail
  } else {
    handleFail = function(err) {}
  }

  if (PromiseStatus === 'pending') {
    return new Promise(function(resolve, reject) {
      self.resolvedCb.push(function(result) {
        var res = handleSuccess(self.PromiseValue)
        if (res instanceof Promise) {
          res.then(resolve, reject)
        } else {
          resolve(er)
        }
      })
      self.rejectedCb.push(function(err) {
        var er = handleFail(self.PromiseValue)
        if (er instanceof Promise) {
          er.then(resolve, reject)
        } else {
          reject(er)
        }
      })
    })
  }
  if (PromiseStatus === 'resolved') {
    return new Promise(function(resolve, reject) {
      var result = handleSuccess(self.PromiseValue)
      resolve(result)
    })
  }
  if (PromiseStatus === 'rejected') {
    return new Promise(function(resolve, reject) {
      var result = handleFail(self.PromiseValue)
      reject(result)
    })
  }
}

Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let index = 0
    let result = []
    if (promises.length === 0) {
      resolve(result)
    } else {
      function processValue(i, data) {
        result[i] = data
        if (++index === promises.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < promises.length; i++) {
        //promises[i] 可能是普通值
        Promise.resolve(promises[i]).then(
          data => {
            processValue(i, data)
          },
          err => {
            reject(err)
            return
          }
        )
      }
    }
  })
}

Promise.race = function(promises) {
  //promises 必须是一个可遍历的数据结构，否则抛错
  return new Promise((resolve, reject) => {
    if (typeof promises[Symbol.iterator] !== 'function') {
      //真实不是这个错误
      Promise.reject('args is not iteratable!')
    }
    if (promises.length === 0) {
      return
    } else {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          data => {
            resolve(data)
            return
          },
          err => {
            reject(err)
            return
          }
        )
      }
    }
  })
}

//一直在等待态
Promise.race([]).then(
  data => {
    console.log('success ', data)
  },
  err => {
    console.log('err ', err)
  }
)
//抛错
Promise.race().then(
  data => {
    console.log('success ', data)
  },
  err => {
    console.log('err ', err)
  }
)
Promise.race([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(100)
    }, 1000)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(200)
    }, 200)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(100)
    }, 100)
  })
]).then(
  data => {
    console.log(data)
  },
  err => {
    console.log(err)
  }
)

// https://github.com/YvetteLau/Blog/issues/2

// https://github.com/frontend9/fe9-interview/issues/14

// ## promise 简单实现

// ```js
// function Promise(fn) {
//   var status = 'pending'
//   function successNotify() {
//     status = 'fulfilled' //状态变为fulfilled
//     toDoThen.apply(undefined, arguments) //执行回调
//   }
//   function failNotify() {
//     status = 'rejected' //状态变为rejected
//     toDoThen.apply(undefined, arguments) //执行回调
//   }
//   function toDoThen() {
//     setTimeout(() => {
//       // 保证回调是异步执行的
//       if (status === 'fulfilled') {
//         for (let i = 0; i < successArray.length; i++) {
//           successArray[i].apply(undefined, arguments) //执行then里面的回掉函数
//         }
//       } else if (status === 'rejected') {
//         for (let i = 0; i < failArray.length; i++) {
//           failArray[i].apply(undefined, arguments) //执行then里面的回掉函数
//         }
//       }
//     })
//   }
//   var successArray = []
//   var failArray = []
//   fn.call(undefined, successNotify, failNotify)
//   return {
//     then: function(successFn, failFn) {
//       successArray.push(successFn)
//       failArray.push(failFn)
//       return undefined // 此处应该返回一个Promise
//     }
//   }
// }
// ```

// ## Promise 实现

// ```js
// function resolvePromise(promise2, x, resolve, reject) {
//   // 循环引用报错
//   if (x === promise2) {
//     // reject报错
//     return reject(new TypeError('Chaining cycle detected for promise'))
//   }
//   // 防止多次调用
//   let called
//   // x不是null 且x是对象或者函数
//   if (x != null && (typeof x === 'object' || typeof x === 'function')) {
//     try {
//       // A+规定，声明then = x的then方法
//       let then = x.then
//       // 如果then是函数，就默认是promise了
//       if (typeof then === 'function') {
//         // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
//         then.call(
//           x,
//           y => {
//             // 成功和失败只能调用一个
//             if (called) return
//             called = true
//             // resolve的结果依旧是promise 那就继续解析
//             resolvePromise(promise2, y, resolve, reject)
//           },
//           err => {
//             // 成功和失败只能调用一个
//             if (called) return
//             called = true
//             reject(err) // 失败了就失败了
//           }
//         )
//       } else {
//         resolve(x) // 直接成功即可
//       }
//     } catch (e) {
//       // 也属于失败
//       if (called) return
//       called = true
//       // 取then出错了那就不要在继续执行了
//       reject(e)
//     }
//   } else {
//     resolve(x)
//   }
// }

// export default class Promise {
//   constructor(executor) {
//     this.state = 'pending'
//     this.value = undefined
//     this.reason = undefined
//     this.onResolvedCallbacks = []
//     this.onRejectedCallbacks = []
//     let resolve = value => {
//       if (this.state === 'pending') {
//         this.state = 'fulfilled'
//         this.value = value
//         this.onResolvedCallbacks.forEach(fn => fn())
//       }
//     }
//     let reject = reason => {
//       if (this.state === 'pending') {
//         this.state = 'rejected'
//         this.reason = reason
//         this.onRejectedCallbacks.forEach(fn => fn())
//       }
//     }
//     try {
//       executor(resolve, reject)
//     } catch (err) {
//       reject(err)
//     }
//   }
//   then(onFulfilled, onRejected) {
//     // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
//     onFulfilled =
//       typeof onFulfilled === 'function' ? onFulfilled : value => value
//     // onRejected如果不是函数，就忽略onRejected，直接扔出错误
//     onRejected =
//       typeof onRejected === 'function'
//         ? onRejected
//         : err => {
//             throw err
//           }
//     let promise2 = new Promise((resolve, reject) => {
//       if (this.state === 'fulfilled') {
//         // 异步
//         setTimeout(() => {
//           try {
//             let x = onFulfilled(this.value)
//             resolvePromise(promise2, x, resolve, reject)
//           } catch (e) {
//             reject(e)
//           }
//         }, 0)
//       }
//       if (this.state === 'rejected') {
//         // 异步
//         setTimeout(() => {
//           // 如果报错
//           try {
//             let x = onRejected(this.reason)
//             resolvePromise(promise2, x, resolve, reject)
//           } catch (e) {
//             reject(e)
//           }
//         }, 0)
//       }
//       if (this.state === 'pending') {
//         this.onResolvedCallbacks.push(() => {
//           // 异步
//           setTimeout(() => {
//             try {
//               let x = onFulfilled(this.value)
//               resolvePromise(promise2, x, resolve, reject)
//             } catch (e) {
//               reject(e)
//             }
//           }, 0)
//         })
//         this.onRejectedCallbacks.push(() => {
//           // 异步
//           setTimeout(() => {
//             try {
//               let x = onRejected(this.reason)
//               resolvePromise(promise2, x, resolve, reject)
//             } catch (e) {
//               reject(e)
//             }
//           }, 0)
//         })
//       }
//     })
//     // 返回promise，完成链式
//     return promise2
//   }
// }
// ```

// ```js
// // 三种状态
// const PENDING = 'pending'
// const RESOLVED = 'resolved'
// const REJECTED = 'rejected'
// // promise 接收一个函数参数，该函数会立即执行
// function MyPromise(fn) {
//   let _this = this
//   _this.currentState = PENDING
//   _this.value = undefined
//   // 用于保存 then 中的回调，只有当 promise
//   // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
//   _this.resolvedCallbacks = []
//   _this.rejectedCallbacks = []

//   _this.resolve = function(value) {
//     if (value instanceof MyPromise) {
//       // 如果 value 是个 Promise，递归执行
//       return value.then(_this.resolve, _this.reject)
//     }
//     setTimeout(() => {
//       // 异步执行，保证执行顺序
//       if (_this.currentState === PENDING) {
//         _this.currentState = RESOLVED
//         _this.value = value
//         _this.resolvedCallbacks.forEach(cb => cb())
//       }
//     })
//   }

//   _this.reject = function(reason) {
//     setTimeout(() => {
//       // 异步执行，保证执行顺序
//       if (_this.currentState === PENDING) {
//         _this.currentState = REJECTED
//         _this.value = reason
//         _this.rejectedCallbacks.forEach(cb => cb())
//       }
//     })
//   }
//   // 用于解决以下问题
//   // new Promise(() => throw Error('error))
//   try {
//     fn(_this.resolve, _this.reject)
//   } catch (e) {
//     _this.reject(e)
//   }
// }

// MyPromise.prototype.then = function(onResolved, onRejected) {
//   var self = this
//   // 规范 2.2.7，then 必须返回一个新的 promise
//   var promise2
//   // 规范 2.2.onResolved 和 onRejected 都为可选参数
//   // 如果类型不是函数需要忽略，同时也实现了透传
//   // Promise.resolve(4).then().then((value) => console.log(value))
//   onResolved = typeof onResolved === 'function' ? onResolved : v => v
//   onRejected = typeof onRejected === 'function' ? onRejected : r => throw r

//   if (self.currentState === RESOLVED) {
//     return (promise2 = new MyPromise(function(resolve, reject) {
//       // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
//       // 所以用了 setTimeout 包裹下
//       setTimeout(function() {
//         try {
//           var x = onResolved(self.value)
//           resolutionProcedure(promise2, x, resolve, reject)
//         } catch (reason) {
//           reject(reason)
//         }
//       })
//     }))
//   }

//   if (self.currentState === REJECTED) {
//     return (promise2 = new MyPromise(function(resolve, reject) {
//       setTimeout(function() {
//         // 异步执行onRejected
//         try {
//           var x = onRejected(self.value)
//           resolutionProcedure(promise2, x, resolve, reject)
//         } catch (reason) {
//           reject(reason)
//         }
//       })
//     }))
//   }

//   if (self.currentState === PENDING) {
//     return (promise2 = new MyPromise(function(resolve, reject) {
//       self.resolvedCallbacks.push(function() {
//         // 考虑到可能会有报错，所以使用 try/catch 包裹
//         try {
//           var x = onResolved(self.value)
//           resolutionProcedure(promise2, x, resolve, reject)
//         } catch (r) {
//           reject(r)
//         }
//       })

//       self.rejectedCallbacks.push(function() {
//         try {
//           var x = onRejected(self.value)
//           resolutionProcedure(promise2, x, resolve, reject)
//         } catch (r) {
//           reject(r)
//         }
//       })
//     }))
//   }
// }
// // 规范 2.3
// function resolutionProcedure(promise2, x, resolve, reject) {
//   // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
//   if (promise2 === x) {
//     return reject(new TypeError('Error'))
//   }
//   // 规范 2.3.2
//   // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
//   if (x instanceof MyPromise) {
//     if (x.currentState === PENDING) {
//       x.then(function(value) {
//         // 再次调用该函数是为了确认 x resolve 的
//         // 参数是什么类型，如果是基本类型就再次 resolve
//         // 把值传给下个 then
//         resolutionProcedure(promise2, value, resolve, reject)
//       }, reject)
//     } else {
//       x.then(resolve, reject)
//     }
//     return
//   }
//   // 规范 2.3.3.3.3
//   // reject 或者 resolve 其中一个执行过得话，忽略其他的
//   let called = false
//   // 规范 2.3.3，判断 x 是否为对象或者函数
//   if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
//     // 规范 2.3.3.2，如果不能取出 then，就 reject
//     try {
//       // 规范 2.3.3.1
//       let then = x.then
//       // 如果 then 是函数，调用 x.then
//       if (typeof then === 'function') {
//         // 规范 2.3.3.3
//         then.call(
//           x,
//           y => {
//             if (called) return
//             called = true
//             // 规范 2.3.3.3.1
//             resolutionProcedure(promise2, y, resolve, reject)
//           },
//           e => {
//             if (called) return
//             called = true
//             reject(e)
//           }
//         )
//       } else {
//         // 规范 2.3.3.4
//         resolve(x)
//       }
//     } catch (e) {
//       if (called) return
//       called = true
//       reject(e)
//     }
//   } else {
//     // 规范 2.3.4，x 为基本类型
//     resolve(x)
//   }
// }
// ```

// ```js
// function myPromise(constructor) {
//   let self = this
//   self.status = 'pending' //定义状态改变前的初始状态
//   self.value = undefined //定义状态为resolved的时候的状态
//   self.reason = undefined //定义状态为rejected的时候的状态
//   function resolve(value) {
//     //两个==="pending"，保证了状态的改变是不可逆的
//     if (self.status === 'pending') {
//       self.value = value
//       self.status = 'resolved'
//     }
//   }
//   function reject(reason) {
//     //两个==="pending"，保证了状态的改变是不可逆的
//     if (self.status === 'pending') {
//       self.reason = reason
//       self.status = 'rejected'
//     }
//   }
//   //捕获构造异常
//   try {
//     constructor(resolve, reject)
//   } catch (e) {
//     reject(e)
//   }
// }
// ```