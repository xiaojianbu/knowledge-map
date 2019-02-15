# CSS 元素居中

## 元素居中

---

`内容归纳于网络`

元素居中又分为水平居中、垂直居中和水平垂直居中

* [水平居中](#水平居中)
* [垂直居中](#垂直居中)
* [水平垂直居中](#水平垂直居中)

<!-- More -->

### 水平居中

---

1. 若是行内元素或类行内元素（inline/inline-block/inline-table/flex）,给其父元素设置 text-align:center,即可实现行内元素水平居中
2. 若是块级元素，该元素设置 margin: 0 auto; 即可（块级元素需定宽）
3. 若子元素包含 float:left 属性，为了让子元素水平居中，则可让父元素宽度设置为 fit-content ，并且配合 margin ，作如下设置:

    ```css
    .parent {
      width: fit-content;
      width: -moz-fit-content;
      width: -webkit-fit-content;
      margin: 0 auto;
    }
    ```

    fit-content 是 CSS3 中给 width 属性新加的一个属性值，它配合 margin 可以实现水平居中，目前只支持 Chrome 和 Firefox 浏览器。（兼容性差）

4. 使用 flex 布局（**较优**），元素设置如下：

    ```css
    .parent {
      display: flex;
      justify-content: center;
    }
    ```

5. 使用 CSS3 中新增的 transform 属性，子元素设置如下：

    ```css
    .child {
     position: absolute;
     left: 50%;
     transform: translate(-50%, 0);
   }
    ```

6. 使用绝对定位方式，以及负值的 margin-left ，子元素设置如下：

   ```css
   .child {
     position: absolute;
     width: 固定宽度;
     left: 50%;
     margin-left: -0.5宽度;
   }
   ```

7. 使用绝对定位方式，以及 left:0;right:0;margin:0 auto; 子元素设置如下：（**较好的方法**）

   ```css
   .child {
     position: absolute;
     width: 固定宽度;
     left: 0;
     right: 0;
     margin: 0 auto;
   }
   ```

8. 如果让多个块级元素在同一行中水平居中，使用 inline-block 或者 flex （**较优**）

### 垂直居中

---

1. 若元素是单行文本，则可设置 line-height 等于父元素高度。demo:

   html:

   ```html
   <div class="parent">
     <div class="child">test</div>
   </div>
   ```

   css:

   ```css
   .parent {
     width: 200px;
     height: 200px;
     text-align: center;
     background: grey;
   }
   .child {
     line-height: 200px;
   }
   ```

2. 若元素是行内块级元素, 基本思想是使用 display: inline-block, vertical-align: middle 和一个伪元素让内容块处于容器中央。

    ```css
   .parent::after,
   .child {
     display: inline-block;
     vertical-align: middle;
   }
   .parent::after {
     content: "";
     height: 100%;
   }
   ```  

3. 使用 flex ，（**较优**）父元素设置如下：

    ```css
   .parent {
     display: flex;
     align-items: center;
   }
   ```

4. 块级元素  
  4.1 已知元素的高度  
      先让元素绝对定位到父容器的中心，然后设置负向 margin ，负值的大小为自身高度的一半， `注意:`如果父元素设置了 padding ，则计算负向 margin 时，负值的大小为：其自身高度的一半再加上父元素的内边距

        ```css
        .child {
          position: absolute;
          top: 50%;
          height: 固定高度;
          margin-top: -0.5高度;
        }
        ```

   4.2 未知元素的高度，使用 transform ，设置父元素相对定位，子元素设置如下：

      ```css
      .child {
        position: absolute;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
      }
      ```

5. 设置父元素相对定位 (position:relative), 子元素如下 css 样式:(**较好的方法**)

   ```css
   .child {
     position: absolute;
     height: 固定;
     top: 0;
     bottom: 0;
     margin: auto 0;
   }
   ```

6. 多行不定高  
   6.1 对于多行的内联元素，通过添加等值的 padding-top 和 padding-bottom 实现垂直居中。  
   6.2 使用 flex 实现垂直居中，对父级元素 display: flex 的元素来说，它的每一个子元素都是垂直居中的。（**较优**）

7. 多行定高 使用 flex 实现垂直居中，（**较优**） demo:

   ```html
   <div class="flex-center">
    <p>I'm vertically centered multiple lines of text in a flexbox container.</p>
   </div>
   ```

   ```css
   .flex-center {
     display: flex;
     justify-content: center;
     flex-direction: column; /* 固定高度必须设置flex-direction */
     width: 200px;
     height: 200px;
   }
   ```

8. 垂直居中一张图片,利用 vertical-align: 定义行内元素的基线相对该元素所在行的基线的垂直对齐。

   html:

   ```html
   <div id="parent">  
       <img src="test.png">
   </div>  
   ```

   css:

   ```css
   #parent {
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

### 水平且垂直居中

---

1. 元素的宽高固定  
   设定父容器为相对定位，子元素为绝对定位，将子元素定位到父容器的中心点，然后使用负向 margin ， margin 的值为其自身宽高的一半：`注意：`如果父元素设置了 padding ，则计算负向 margin 时，负值的大小为：其自身高度的一半再加上父元素的内边距。 demo:

   ```html
   <main>
     <div>
       I'm a block-level element with fixed height and width, centered vertically within my parent.
     </div>
   </main>
   ```

   ```css
   main {
     position: relative;
   }
   main div {
     position: absolute;
     top: 50%;
     left: 50%;
     width: 200px;
     height: 100px;
     margin: -50px 0 0 -100px;
     /* U can also do this */
     margin-top: -50px;
     margin-left: -100px;
   }
   ```

2. 元素的宽高不固定  
   设定父容器为相对定位，子元素为绝对定位，将子元素定位到父容器的中心点，不同的是，接下来需要使用 transform: translate(-50%, -50%)实现居中。 demo:

   ```html
   <main>
     <div>
       I'm a block-level element with unknown height and width, centered vertically within my parent.
     </div>
   </main>
   ```

   ```css
   main {
     position: relative;
   }
   main div {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
   }
   ```

   缺陷是：当计算结果含有小数时，会让整个元素看起来是模糊的，一种解决方法是设置父级元素的 transform-style: preserve-3d; demo:

   ```css
   main {
     -webkit-transform-style: preserve-3d;
     -moz-transform-style: preserve-3d;
     transform-style: preserve-3d;
   }
   main div {
     position: relative;
     top: 50%;
     transform: translateY(-50%);
   }
   ```

### 参考文章

[CSS 居中指南](https://www.w3ctech.com/topic/1515)  
[16 种方法实现水平居中垂直居中](http://louiszhai.github.io/2016/03/12/css-center/)  
[盘点 8 种 CSS 实现垂直居中水平居中的绝对定位居中技术](http://blog.csdn.net/freshlover/article/details/11579669)  
[六种实现元素水平居中](https://www.w3cplus.com/css/elements-horizontally-center-with-css.html)  
[CSS 布局之-水平垂直居中](https://div.io/topic/1155)  
[CSS 水平居中和垂直居中多种解决方案](http://www.huar.love/blog/2016/12/15/cssshui-ping-ju-zhong-he-chui-zhi-ju-zhong-duo-chong-jie-jue-fang-an/index.html)
