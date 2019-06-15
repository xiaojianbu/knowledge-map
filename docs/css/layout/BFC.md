# BFC

BFC 的中文名是块级格式上下文

BFC 是 CSS 布局的一个概念，是一个独立的渲染区域，一个环境，里面的元素不会影响到外部的元素

## BFC 如何生成

1. 根元素；
2. float 的值不为 none；
3. position 的值为 absolute 或 fixed；
4. overflow 的值不为 visible（默认值，内容不会被修剪，会呈现在元素框之外）；
5. display 的值为 inline-block、table-cell、table-caption
6. 弹性盒 flex boxes(元素的 display: flex 或 inline-flex)

## BFC 布局规则

1. 内部的 Box 会在垂直方向，一个接一个地放置；
2. 属于同一个 BFC 的两个相邻的 Box 的 margin 会发生重叠；
3. BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素；
4. BFC 的区域不会与 float box 重叠；
5. 计算 BFC 的高度，浮动元素也参与计算。

## BFC 作用

1. 布局；
2. 可以阻止元素被浮动元素覆盖；
3. 可以包含浮动元素---清除内部浮动，原理：触发父元素的 BFC 属性，使下面的子元素都处于父元素的同一个 BFC 区域内；
4. 分属于不同的 BFC 时，可以阻止 margin 重叠。
