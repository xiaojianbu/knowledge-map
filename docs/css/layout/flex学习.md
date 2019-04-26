---
title: flex学习
date: 2018-02-28 19:27:25
tags:
---

## Flex 布局学习

`flex 学习总结，内容大多来源于参考文章`

---

<!-- more -->

### 语法

---

Flex 是 Flexible Box 的缩写，意为弹性布局，任何一个容器或行内元素都可以指定为 Flex 布局。

```css
.box {
  display: flex;
  /*或者*/
  display: inline-flex;
}
```

`注意`，设为 Flex 布局以后，子元素的 float 、clear 和 vertical-align 属性将失效。

#### 基本概念

采用 Flex 布局的元素。称为 Flex 容器（flex container），其子元素自动成为容器成员，称为 Flex 项目（flex item）。

整个 flex 布局参考下图：

{% asset_img flexbox-model.jpg flexbox-model %}

flex container 存在两根轴：主轴 (main axis) 和 垂直的交叉轴 (cross axis)。主轴的开始位置叫做 main start，结束位置叫做 main end；交叉轴的开始位置叫做 cross start，结束位置叫做 cross end。

项目默认沿着主轴排列，单个项目占据的主轴空间叫做 main size，占据的交叉轴空间叫做 cross size。

#### 容器的属性

以下 6 个属性设置在容器上。

* flex-direction 决定主轴的方向（即项目的排列方向）

  ```css
  .box {
    flex-direction: row | row-reverse | column | column-reverse;
  }
  ```

  * row (默认值)：主轴为水平方向，起点在左端
  * row-reverse: 主轴为水平方向，起点在右端
  * column: 主轴为垂直方向，起点在上沿
  * column: 主轴为垂直方向，起点在下沿。

* flex-wrap 属性 控制 flex 容器是否以单行或多行布局其项目，以及新行的方向。

  ```css
  .box {
    flex-wrap: nowrap | wrap | wrap-reverse;
  }
  ```

  * nowrap(默认值)：不换行
  * wrap： 换行
  * wrap-reverse：换行，第一行在下方

* flex-flow 属性 flex-direction 和 flex-wrap 属性的简写形式，默认值为 row nowrap。

  ```css
  .box {
    flex-flow: <flex-direction> || <flex-wrap>;
  }
  ```

* justify-content 属性定义了项目在主轴上的对齐方式。这一行为会在所有可伸缩长度及所有自动边距均被解释后进行。当一行上的所有伸缩项目都不能伸缩或可伸缩但是已经达到其最大长度时，这一属性才会对多余的空间进行分配。当项目溢出某一行时，这一属性也会在项目的对齐上施加一些控制。

  ```css
  .box {
    justify-content: flex-start | flex-end | center | space-between |
      space-around;
  }
  ```

  具体的对齐方式与轴的方向有关，假设主轴从左到右。

  * flex-start(默认值)：左对齐
  * flex-end：右对齐
  * center： 居中
  * space-between： 两端对齐，项目之间的间隔相等。
  * space-around：每个项目两侧的间隔相等，项目之间的间隔比项目与边框的间隔大一倍。

* align-items 属性 定义项目在交叉轴上如何对齐。

  ```css
  .box {
    align-items: flex-start | flex-end | center | baseline | stretch;
  }
  ```

  具体的对齐方式与交叉轴的方向有关，假设交叉轴从上到下。

  * flex-start: 交叉轴的起点对齐
  * flex-end: 交叉轴的终点对齐
  * center：交叉轴的中点对齐
  * baseline: 项目的第一行文字的基线对齐。
  * stretch（默认值）：如果项目未设置高度或设为 auto，将占满整个容器的高度。

* align-content 属性定义了多根轴线（多行）的对齐方式。如果项目只有一根轴线，该属性不起作用。
  ```css
  .box {
    align-content: flex-start | flex-end | center | space-between | space-around
      | stretch;
  }
  ```
  * flex-start: 与交叉轴的起点对齐。
  * flex-end: 与交叉轴的终点对齐。
  * center: 与交叉轴的中点对齐。
  * space-between: 与交叉轴两端对齐，轴线之间的间隔平均分布。
  * space-around: 每根轴线两侧的间隔相等，轴线之间的间隔比轴线与边框的间隔大一倍。
  * stretch(默认值)：轴线占满整个交叉轴。

#### 项目的属性

以下 6 个属性设置在项目上

* order 定义项目的排列顺序，数值越小，排列越靠前，默认为 0。
  ```css
  .item {
    order: <integer>;
  }
  ```
* flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。

  ```css
  .item {
    flex-grow: <number>; /*默认为0*/
  }
  ```

  如果所有项目的 flex-grow 属性都为 1，则它们将等分剩余空间（如果有的话）。如果一个项目的 flex-grow 属性为 2，其它项目都为 1，则前者占据的剩余空间将比其它项目多一倍。

* flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。（`注意`负值对该属性无效）

  ```css
  .item {
    flex-shrink: <number>; /*默认为1*/
  }
  ```

  如果所有项目的 flex-shrink 属性都为 1，当空间不足时，都将等比例缩小。如果一个项目的 flex-shrink 属性为 0，其他项目都为 1，则空间不足时，前者不缩小。

* flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。
  ```css
  .item {
    flex-basis: <length> | auto; /*默认是 auto*/
  }
  ```
* flex 属性是 flex-grow ，flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。后两个属性可选。

  ```css
  .item {
    flex: none | [< "flex-grow" >< "flex-shrink" >? || < "flex-basis" >];
  }
  ```

  该属性有两个快捷值： auto（1 1 auto）和 none(0 0 auto)。

* align-self 属性 允许单个项目与其它项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。

```css
.item {
  align-self: auto | flex-strat | flex-end | center | baseline | stretch;
}
```

{% asset_link flex-learn.html flex-attr-demo %}  
{% asset_link flex-practice.html flex-practice-demo %}  
{% asset_link flexbox-12Column.html flex-12Column-demo %}
{% asset_link guide-flexbox-demo.html guide-flexbox-demo %}

### flex-item-size 如何计算（来自参考文章）

item-size(尺寸) 为主轴方向上 item 的 content 再加上自身的 margin、border 和 padding 的值。  
 根据规范中的计算方式，分为以下几种情况：

1.  flex-basis 的优先级比 width[height]: 非 auto; 高  
    如果子元素没有内容和默认固定宽高，且设置了 flex-basis。  
    flex-item 的 content 以 flex-basis 来决定，无论 width[height] 设置了多少。
2.  元素存在默认宽高  
    如果子元素有默认固定宽高（例如 input 标签）、并且设置了 flex-basis，那么它的 content 以固定宽高为下限，如果 flex-basis 超过了固定宽高，那么 flex-basis 的大小为 content 大小，如果 flex-basis 比固定宽高小， 那么以固定宽高为 content。
3.  元素存在 min-width[height] 或者 max-width[height]  
    如果 flex-item 有 min-width[height] 的限制，那么 flex-item content 按照 min-width[height] 值为下限，如果 flex-basis 的值大于 min-width[min-height] 那么 flex-item content 以 flex-basis 计算。如果 flex-basis 的值小于 min-width[height]那么 flex-item content 以 min-width[height]计算。  
    如果 min-width[height]的值已经超出了容器的尺寸，那么即使设置了 flex-shrink css 解析器也不会将这个 item 的 content 进行缩放，而是保留它的 min-width[height]。反之，如果设置了 max-width[height]的值，那么设置 flex-basis 无法超过这个值，对于 flex-grow 也仅仅会增长到 max-width[height]这个上限。
4.  width[height]：auto；优先级等于 flex-basis  
    css 解析器对比两者的值，两者谁大取谁作为 item 的基本尺寸，如果一个 item 没有内容，flex-item content 就会以 flex-basis 来决定。但是如果 item 有了内容，且内容撑开的尺寸比 flex-basis 大，那么 flex-item content 就会以 width[height]:auto 来决定。且无法被 shrink。反之，如果比 flex-basis 小，flex-item content 就会以 flex-basis 来决定。

    #### flex-basis、flex-grow 和 flex-shrink 相应的计算

    flex-grow 和 flex-shrink 是用于主轴方向上对（负）可用空间进行伸缩的  
    分两种情况，换行或者不换行：

    1.  如果 flex-wrap：nowrap  
        那么所有 items 都会在主轴方向上的一条线上排列，css 解析器会计算 items 在主轴方向上所占的空间相对于 flexbox 在主轴方向的所占的空间进行比较计算。  
        如果 items 所占的空间是小于 flexbox 的那么说明 flexbox 还没有填满，css 解析器就会计算还有多少空间没有填满，根据每一个 item 所设置的 flex-grow 设置的值，将这些空间分配给每一个 item。  
        如果 items 所占的空间是大于 flexbox 的，那么 css 解析器会计算超出的空间大小，根据每一个 item 所设置的 flex-shrink 值，将这些空间按比例缩小每一个 item。  
        flex-grow 计算流程是：

        * 可用空间 = flexbox-content - 每个 item-size 的总和
        * 将每一个 item 所设置的 grow 全部加起来，将可用空间除以 grow，得到单位分配空间
        * 根据每一个 item 设置的 grow 来算，如果一个 item 的 grow 为 2，那么这个 item 在主轴上的尺寸就需要延伸 2\*单位分配空间的大小。

        flex-shrink 计算流程：

        * 先将说有 item 按照 fle-shrink\*item-size 的方式加起来得到一个加权和
        * 然后计算出每一份 item 的 shrink 比例：  
           shrink 比例 = flex-shrink\*item-size / 之前的总和
        * 然后计算子元素超出父级的部分（负可用空间），每一个 item 减去这个 shrink 比例\*负可用空间。

    2.  如果 flex-wrap：wrap  
        那么 items 都会现在主轴方向上的多条线上排列，css 解析器先会计算每一条线在主轴方向上尺寸相对于 flexbox 容器的 width[height]进行比较计算，每一条线之间互相不干扰。  
        由于在一行内如果 item-size 累加超过了 flexbox 的尺寸就会另起一行进行排列，所以不会存在 shrink 的情况。
        * max-width[height]情况下 flex-grow 的计算流程  
          由于可能存在某一个或多个 item 设置了 max-width[height]，所以，css 解析器会先进行一次分配，分配后，统计那些有 max-width[height]的 items，分配后是否有超出的剩余空间然后对这些剩余空间再分配给那些没有设置 max-width[height]的 item。  
          {% asset_img flex-grow-count.png flex-grow 计算 %}
        * min-width[height] 情况下 flex-shrink 的计算流程  
          由于可能存在某一个或多个 item 设置了 min-width[height]，所以，css 解析器会先进行一次 shrink,shrink 后，统计那些有 min-width[height]的 items,shrink 后是否有剩余的未 shrink 空间，然后对这些剩余空间再分配那些没有设置 min-width[height]的 item。  
          {% asset_img flex-shrink-count.png flex-shrink 计算 %}

### 参考文章

[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)  
[Flex 布局示例](http://static.vgee.cn/static/index.html)  
[A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)  
[A Visual Guide to CSS3 Flexbox Properties](https://scotch.io/tutorials/a-visual-guide-to-css3-flexbox-properties)  
[Solved by Flexbox](https://philipwalton.github.io/solved-by-flexbox/)  
[深入理解 flex 布局以及计算](http://numerhero.github.io/%E6%8A%80%E6%9C%AF/2017/04/06/flexbox.html#post__title)
