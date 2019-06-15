# CSS 小知识点

## left 属性

定义了定位元素的左外边距边界与其包含块左边界之间的偏移

值为 100% 代表元素包含块的宽度的百分比

## 去除 button 按钮的边框

```css
button {
  outline: none;
}
```

## rgba()和 opacity 的透明效果有什么不同？

rgba()和 opacity 都能实现透明效果，但最大的不同是 opacity 作用于元素，以及元素内的所有内容的透明度，

而 rgba()只作用于元素的颜色或其背景色。

## 瀑布流布局

利用 flex 来实现瀑布流布局

缺点需要每一个盒子的宽度和高度已知,或者等高的瀑布流

参考：[flexbox 实现不等宽不等高的瀑布流布局](http://www.cnblogs.com/roundDB/p/6212394.html)

## CSS 实现 tab

常用 label 和 input 来实现, + 选择器是关键。每一个 tab 按钮对应一个单选框，如果单选框的状态是 checked，那么就让对应的 div 显示。

参考：[CSS Tabs using Flexbox](https://codepen.io/vulpesigni/pen/yyZYNy)

## CSS 实现时间轴

时间线的实现

```css
#timeline:before {
  width: 3px;
  left: 50%;
  content: '';
  background-color: #00f;
  top: 0;
  position: absolute;
}
```

参考：[Flexbox Timeline Layout](https://codepen.io/paulhbarker/pen/apvGdv)

## 前端一像素问题（画一条 0.5px 的线）

方法一：transform:scaleY（0.5）使用伪元素设置 1px 的边框，然后对边框进行缩放(scaleY) 实现思路：

1. 设定目标元素的参考位置
2. 给目标元素添加一个伪元素 before 或者 after，并设置绝对定位
3. 给伪元素添加 1px 的边框
4. 用 box-sizing: border-box 属性把边框都包进宽和高里面
5. 宽和高设置为 200%
6. 整个盒子模型缩小为 0.5
7. 调整盒子模型的位置，以左上角为基准 transform-origin: 0

## transition 和 animation 的区别

Animation 和 transition 大部分属性是相同的，他们都是随时间改变元素的属性值，他们的主要区别是 transition 需要触发一个事件才能改变属性， 而 animation 不需要触发任何事件的情况下才会随时间改变属性值，并且 transition 为 2 帧，从 from .... to，而 animation 可以一帧一帧的。

## 使元素消失的方法

visibility:hidden、display:none、z-index=-1、opacity：0

1. opacity：0,该元素隐藏起来了，但不会改变页面布局，并且，如果该元素已经绑定了一些事件，如 click 事件也能触发
2. visibility:hidden,该元素隐藏起来了，但不会改变页面布局，但是不会触发该元素已经绑定的事件
3. display:node, 把元素隐藏起来，并且会改变页面布局，可以理解成在页面中把该元素删掉

## 为什么 css 放在顶部而 js 写在后面

1. 浏览器预先加载 css 后，可以不必等待 HTML 加载完毕就可以渲染页面了
2. 其实 HTML 渲染并不会等到完全加载完在渲染页面，而是一边解析 DOM 一边渲染。
3. js 写在尾部，主要是因为 js 主要扮演事件处理的功能，一方面很多操作是在页面渲染后才执行的。另一方面可以节省加载时间，使页面能够更加的加载，提高用户的良好体验

## css 的解析顺序

css 选择器匹配元素是逆向解析

因为所有样式规则可能数量很大，而且绝大多数不会匹配到当前的 DOM 元素（因为数量很大所以一般会建立规则索引树），所以有一个快速的方法来判断「这个 selector 不匹配当前元素」就是极其重要的。

如果正向解析，例如「div div p em」，我们首先就要检查当前元素到 html 的整条路径，找到最上层的 div，再往下找，如果遇到不匹配就必须回到最上层那个 div，往下再去匹配选择器中的第一个 div，回溯若干次才能确定匹配与否，效率很低。

逆向匹配则不同，如果当前的 DOM 元素是 div，而不是 selector 最后的 em，那只要一步就能排除。只有在匹配时，才会不断向上找父节点进行验证。
