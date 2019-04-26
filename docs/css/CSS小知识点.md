# CSS 小知识点

## 去除 button 按钮的边框

```css
button {
  outline: none;
}
```

## rgba()和 opacity 的透明效果有什么不同？

rgba()和 opacity 都能实现透明效果，但最大的不同是 opacity 作用于元素，以及元素内的所有内容的透明度，

而 rgba()只作用于元素的颜色或其背景色。


24. 瀑布流布局

    利用 flex 来实现瀑布流布局：

    缺点需要每一个盒子的宽度和高度已知,或者等高的瀑布流

    参考：

    [flexbox 实现不等宽不等高的瀑布流布局](http://www.cnblogs.com/roundDB/p/6212394.html)

25. CSS 实现 tab

    常用 label 和 input 来实现, + 选择器是关键。每一个 tab 按钮对应一个单选框，如果单选框的状态是 checked，那么就让对应的 div 显示。

    参考：

    [CSS Tabs using Flexbox](https://codepen.io/vulpesigni/pen/yyZYNy)

26. CSS 实现时间轴

    时间线的实现

    ```css
    #timeline:before {
      width: 3px;
      left: 50%;
      content: "";
      background-color: #00f;
      top: 0;
      position: absolute;
    }
    ```

    参考：

    [Flexbox Timeline Layout](https://codepen.io/paulhbarker/pen/apvGdv)
2、前端一像素问题（画一条0.5px的线）
方法一：transform:scaleY（0.5）使用伪元素设置1px的边框，然后对边框进行缩放(scaleY) 实现思路：

1、设定目标元素的参考位置
2、给目标元素添加一个伪元素before或者after，并设置绝对定位
3、给伪元素添加1px的边框
4、用box-sizing: border-box 属性把边框都包进宽和高里面
5、宽和高设置为 200%
6、整个盒子模型缩小为0.5
7、调整盒子模型的位置，以左上角为基准 transform-origin: 0
3、transition和animation的区别
Animation和transition大部分属性是相同的，他们都是随时间改变元素的属性值，他们的主要区别是transition需要触发一个事件才能改变属性， 而animation不需要触发任何事件的情况下才会随时间改变属性值，并且transition为2帧，从from .... to，而animation可以一帧一帧的。

css选择器分类
基本的：
  1.id选择器（id="name"）
  2.类选择器（class="head"）
  3.标签选择器（body, div, ul, li）
  4.全局选择器（*）
复杂的：
  1.组合选择器（.head .head_logo）
  2.后代选择器 （#head .nav ul li 从父集到子孙集）
  3.群组选择器 (div, span, img {color:Red} 具有相同样式的标签分组显示)
  4.继承选择器
  5.伪类选择器（链接样式，a元素的伪类）
  6.子选择器（div>p, 带大于号>）
  7.CSS相邻相邻兄弟选择器（h1+p, 带加号+）
优先级：

不同级别：总结排序：!important > 行内样式 > ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性

1.属性后面加!import 会覆盖页面内任何位置定义的元素样式
2.作为style属性写在元素内的样式
3.id选择器
4.类选择器
5.标签选择器
6.通配符选择器（*）
7.浏览器自定义或继承
同一级别：后写的会覆盖先写的

css选择器的解析原则：选择器定位DOM元素是从右往左的方向，这样可以尽早的过滤掉一些不必要的样式规则和元素

9、使元素消失的方法
visibility:hidden、display:none、z-index=-1、opacity：0

1.opacity：0,该元素隐藏起来了，但不会改变页面布局，并且，如果该元素已经绑定了一些事件，如click事件也能触发
2.visibility:hidden,该元素隐藏起来了，但不会改变页面布局，但是不会触发该元素已经绑定的事件
3.display:node, 把元素隐藏起来，并且会改变页面布局，可以理解成在页面中把该元素删掉
10、为什么css放在顶部而js写在后面
1.浏览器预先加载css后，可以不必等待HTML加载完毕就可以渲染页面了
2.其实HTML渲染并不会等到完全加载完在渲染页面，而是一边解析DOM一边渲染。
3.js写在尾部，主要是因为js主要扮演事件处理的功能，一方面很多操作是在页面渲染后才执行的。另一方面可以节省加载时间，使页面能够更加的加载，提高用户的良好体验
手写一些半圆，园、三角形、梯形
