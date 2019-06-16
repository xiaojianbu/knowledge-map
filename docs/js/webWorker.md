# web worker

HTML5 则提出了 Web Worker 标准，表示 js 允许多线程，但是子线程完全受主线程控制并且不能操作 dom，只有主线程可以操作 dom，所以 js 本质上依然是单线程语言。

web worker 就是在 js 单线程执行的基础上开启一个子线程，进行程序处理，而不影响主线程的执行，当子线程执行完之后再回到主线程上，在这个过程中不影响主线程的执行。子线程与主线程之间提供了数据交互的接口 postMessage 和 onmessage，来进行数据发送和接收。

```js
var worker = new Worker('./worker.js') //创建一个子线程
worker.postMessage('Hello')
worker.onmessage = function(e) {
  console.log(e.data) //Hi
  worker.terminate() //结束线程
}
//worker.js
onmessage = function(e) {
  console.log(e.data) //Hello
  postMessage('Hi') //向主进程发送消息
}
```

## 参考

[Using_web_workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)

[Web_Workers_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
