# DOM 事件

## 事件级别

DOM0: element.onclick=function(){}

DOM1 没有跟事件相关的

DOM2: element.addEventListener('click', function(){}, false)

addEventListener 的方式, false/true 是指冒泡还是捕获.

DOM3: element.addEventListener('keyup', function(){}, false)

绑定方式同 DOM2, 只不过增加了很多事件类型(keyup 等)而已.

## 事件模型

捕获, 从上往下

冒泡, 从下往上

## 事件流

第一阶段: 捕获, 事件通过捕获到达目标元素 （从 window 开始 -> document -> html 标签 -> body -> ...目标元素）

第二阶段: 目标阶段

第三阶段: 冒泡, 从目标元素上传到 window 对象 （从目标元素开始 -> ... -> body -> html -> document -> window）

## Event 对象的常见应用

event.preventDefault()：阻止默认事件, 比如 a 链接跳转

event.stopPropagation()：阻止冒泡, 比如父子级元素单独绑定事件

event.stopImmediatePropagation()：比如按钮绑定了两个点击事件 a b, 想让点击 a 后不要再执行 b, 在 a 响应函数加上这个方法即可阻止 b 的执行.

event.currentTarget：比如 10 个元素采用事件委托后, 获取当前谁被点击, 早期 IE 不支持, 早期 IE 用的是 Event.srcElement

event.target：一个触发事件的对象的引用.

事件流描述的是从页面中接受事件的顺序，可以分为：事件捕获阶段 处于目标阶段 事件冒泡阶段其中需要主要的是 addEventListener 这个函数 最后这个布尔值参数如果是 true，表示在捕获阶段调用事件处理程序；如果是 false，表示在冒泡阶段调用事件处理程序。

1、事件捕获阶段：实际目标 div 在捕获阶段不会接受事件，也就是在捕获阶段，事件从 document 到再到就停止了
2、处于目标阶段：事件在 div 发生并处理，但是事件处理会被看成是冒泡阶段的一部分。
3、冒泡阶段：事件又传播回文档

哪些事件不支持冒泡事件：
鼠标事件：mouserleave mouseenter

焦点事件：blur focus

UI 事件：scroll resize

## 事件代理

当页面中存在大量元素， 而且每一个都要一次或多次绑定事件处理器（比如 onclick） 时， 由于每绑定一个事件处理器都是有代价的， 所以这种情况会随着 DOM 元素的增多而严重影响页面性能。一个简单而优雅的处理 DOM 事件的技术是事件代理（event delegation） 机制。 它是基于这样一个事实：事件逐层冒泡并能被父级元素捕获。 使用事件代理， 只需给外层元素绑定一个处理器， 就可以处理在其子元素上出发的所有事件。

## 插入元素

```js
;(() => {
  const ndContainer = document.getElementById('js-list')
  if (!ndContainer) {
    return
  }

  const total = 30000
  const batchSize = 4 // 每批插入的节点次数，越大越卡
  const batchCount = total / batchSize // 需要批量处理多少次
  let batchDone = 0 // 已经完成的批处理个数

  function appendItems() {
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < batchSize; i++) {
      const ndItem = document.createElement('li')
      ndItem.innerText = batchDone * batchSize + i + 1
      fragment.appendChild(ndItem)
    }

    // 每次批处理只修改 1 次 DOM
    ndContainer.appendChild(fragment)

    batchDone += 1
    doBatchAppend()
  }

  function doBatchAppend() {
    if (batchDone < batchCount) {
      window.requestAnimationFrame(appendItems)
    }
  }

  // kickoff
  doBatchAppend()

  ndContainer.addEventListener('click', function(e) {
    const target = e.target
    if (target.tagName === 'LI') {
      alert(target.innerHTML)
    }
  })
})()
```
