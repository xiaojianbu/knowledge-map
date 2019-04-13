# DOM事件

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

事件流描述的是从页面中接受事件的顺序，可以分为：事件捕获阶段 处于目标阶段 事件冒泡阶段其中需要主要的是addeventListener这个函数 最后这个布尔值参数如果是true，表示在捕获阶段调用事件处理程序；如果是false，表示在冒泡阶段调用事件处理程序。

1、事件捕获阶段：实际目标div在捕获阶段不会接受事件，也就是在捕获阶段，事件从document到再到就停止了
2、处于目标阶段：事件在div发生并处理，但是事件处理会被看成是冒泡阶段的一部分。
3、冒泡阶段：事件又传播回文档

哪些事件不支持冒泡事件：
鼠标事件：mouserleave  mouseenter
焦点事件：blur focus
UI事件：scroll resize
