# CSS 元素居中

## 元素居中

---

`内容归纳于网络`

元素居中又分为水平居中、垂直居中和水平垂直居中

- [水平居中](#水平居中)
- [垂直居中](#垂直居中)
- [水平垂直居中](#水平垂直居中)

<!-- More -->

### 水平居中

---

1. 若是行内元素或类行内元素（inline/inline-block/inline-table/flex），给其父元素设置 `text-align: center`, 即可实现行内元素水平居中；
2. 若是块级元素，该元素设置 `margin: 0 auto`,即可实现（块级元素需定宽）；
3. 若子元素包含`float：left`属性，为了让子元素水平居中，则可让父元素宽度设置为`fit-content`,并且配置 margin: 0 auto：

   ```css
   .parent {
     width: fit-content;
     width: -moz-fit-content;
     width: -webkit-fit-content;
     margin: 0 auto;
   }
   ```

   fit-content 是 CSS3 中给 width 属性新加的一个属性值，配置 margin 可以实现水平居中，但兼容性差（只支持 Chrome 和火狐）

4. 使用 CSS3 新增的 transform 属性，子元素设置如下：

   ```css
   .child {
     position: absolute;
     left: 50%;
     transform: translate(-50%, 0);
   }
   ```

5. 使用绝对定位以及负值的 margin-left,子元素设置如下：

   ```css
   .child {
     position: absolute;
     width: 固定宽度;
     left: 50%;
     margin-left: -0.5宽度;
   }
   ```

6. 使用绝对定位以及 left:0;right:0;margin:0 auto;子元素设置如下：

   ```css
   .child {
     position: absolute;
     width: 固定宽度；
     left: 0;
     right: 0;
     margin: 0 auto;
   }
   ```

7. 使用 flex 布局，元素设置如下：

   ```css
   .parent {
     display: flex;
     justify-content: center;
   }
   ```

8. 如果让多个块级元素在同一行中水平居中，使用 inline-block 或者 flex

### 垂直居中

---

1. 若元素是单行文本，可设置 line-height 等于父元素高度，设置如下：

   ```css
   .parent {
     width: 200px;
     height: 200px;
     text-align: center;
   }
   .child {
     line-height: 200px;
   }
   ```

2. 若元素是行内块级元素，基本思想是使用 display：inline-block，vertical-align: middle 和一个伪元素让内容块处于容器中央：

   ```css
   .parent:: after,
   .child {
     display: inline-block;
     vertical-align: middle;
   }
   .parent:: after {
     content: '';
     height: 100%;
   }
   ```

3. 块级元素（已知高度）

   让元素绝对定位到父容器的中心，然后设置负向 margin，负值的大小为自身高度的一半，`注意：`如果父元素设置了 padding，则计算负向 margin 时，需要加上父元素的内边距：

   ```css
   .child {
     position: absolute;
     top: 50%;
     height: 固定高度;
     margin-top: -0.5高度;
   }
   ```

   还可以设置 top:0;bottom:0;margin: auto 0;

   ```css
   .child {
     position absolute;
     height: 固定高度;
     top: 0;
     bottom: 0;
     margin: auto 0;
   }
   ```

4. 块级元素（未知高度），使用 transform，子元素设置如下：

   ```css
   .child {
     position: absolute;
     top: 50%;
     transform: translateY(-50%);
   }
   ```

   比上一个好：重绘重排 translate3d 的元素进行 GPU 加速。

5. 多行不定高

   对于多行的内联元素，通过添加等值的 padding-top 和 padding-bottom 实现

   使用 flex 实现，对于父级元素 display: flex 的元素来说，它的每一个子元素都是垂直居中的

6. 多行定高,同样利用 flex 实现

   ```css
   .flex-center {
     display: flex;
     justify-content: center;
     flex-direction: column; /* 固定高度必须设置flex-direction */
     width: 200px;
     height: 200px;
   }
   ```

7. 垂直居中一张图片，利用 vertical-align: 定义行内元素的基线相对该元素所在行的基线垂直对齐。

   ```html
   <div class="parent">
     <img src="test.png" />
   </div>
   ```

   ```css
   .parent {
     width: 200px;
     height: 200px;
     text-align: center;
     background: grey;
     line-height: 200px;
   }
   img {
     vertical-align: middle;
   }
   ```

8. 使用 flex

   ```css
   .parent {
     display: flex;
     align-items: center;
   }
   ```

### 水平垂直居中

---

1. 元素的宽高固定

   ```css
   .child {
     position: absolute;
     top: 50%;
     left: 50%;
     width: 200px;
     height: 100px;
     margin: -50px 0 0 -100px;
   }
   ```

2. 元素的宽高不固定

   ```css
   .child {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
   }
   ```

3. 使用 flex

   ```css
   .parent {
     display: flex;
     justify-content: center;
     align-items: center;
   }
   ```

## 参考文章

[CSS 居中指南](https://www.w3ctech.com/topic/1515)

[16 种方法实现水平居中垂直居中](http://louiszhai.github.io/2016/03/12/css-center/)

[盘点 8 种 CSS 实现垂直居中水平居中的绝对定位居中技术](http://blog.csdn.net/freshlover/article/details/11579669)

[六种实现元素水平居中](https://www.w3cplus.com/css/elements-horizontally-center-with-css.html)

[CSS 布局之-水平垂直居中](https://div.io/topic/1155)

[CSS 水平居中和垂直居中多种解决方案](http://www.huar.love/blog/2016/12/15/cssshui-ping-ju-zhong-he-chui-zhi-ju-zhong-duo-chong-jie-jue-fang-an/index.html)

[【基础】这 15 种 CSS 居中的方式，你都用过哪几种？](https://www.zcfy.cc/article/centering-in-css-a-complete-guide-css-tricks)
