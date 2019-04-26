# setTimeout 和 setInterval

(1)用setTimeout()方法来模拟setInterval()与setInterval()之间的什么区别？
首先来看setInterval的缺陷，使用setInterval()创建的定时器确保了定时器代码规则地插入队列中。这个问题在于：如果定时器代码在代码再次添加到队列之前还没完成执行，结果就会导致定时器代码连续运行好几次。而之间没有间隔。不过幸运的是：javascript引擎足够聪明，能够避免这个问题。当且仅当没有该定时器的如何代码实例时，才会将定时器代码添加到队列中。这确保了定时器代码加入队列中最小的时间间隔为指定时间。
这种重复定时器的规则有两个问题：1.某些间隔会被跳过 2.多个定时器的代码执行时间可能会比预期小。

var period = 60 * 1000 * 60 * 2
var startTime = new Date().getTime();
var count = 0
var end = new Date().getTime() + period
var interval = 1000
var currentInterval = interval

function loop() {
  count++
  var offset = new Date().getTime() - (startTime + count * interval); // 代码执行所消耗的时间
  var diff = end - new Date().getTime()
  var h = Math.floor(diff / (60 * 1000 * 60))
  var hdiff = diff % (60 * 1000 * 60)
  var m = Math.floor(hdiff / (60 * 1000))
  var mdiff = hdiff % (60 * 1000)
  var s = mdiff / (1000)
  var sCeil = Math.ceil(s)
  var sFloor = Math.floor(s)
  currentInterval = interval - offset // 得到下一次循环所消耗的时间
  console.log('时：'+h, '分：'+m, '毫秒：'+s, '秒向上取整：'+sCeil, '代码执行时间：'+offset, '下次循环间隔'+currentInterval) // 打印 时 分 秒 代码执行时间 下次循环间隔

  setTimeout(loop, currentInterval)
}

setTimeout(loop, currentInterval)

# setTimeout 和 setInterval

## setTimeout

setTimeout()方法设置一个定时器，该定时器在定时器到期后执行一个函数或指定的一段代码。

语法：

var timeoutID = scope.setTimeout(function[, delay, param1, param2, ...])

返回值 timeoutID 是一个正整数，表示定时器的编号。这个值可以传递给 clearTimeout()来取消该定时。

## setInterval

setInterval() 方法重复调用一个函数或执行一个代码段，在每次调用之间具有固定的时间延迟。

语法：

let intervalID = window.setInterval(func, delay[, param1, param2, ...]);

intervalID 是此重复操作的唯一辨识符，可以作为参数传给 clearInterval()

## 注意

JavaScript 是运行在单线程的环境中的，这就意味着定时器仅仅是计划代码在未来的某个时间执行，而具体执行时机是不能保证的。

JavaScript 中没有任何代码是立即执行的，但一旦进程空闲则尽快执行。

如果想要精确的时间控制，是不能依赖于 JavaScript 的 setTimeout 函数的

定时器指定的时间间隔表示何时将定时器中的代码添加到队列中，而不是何时实际执行代码。
