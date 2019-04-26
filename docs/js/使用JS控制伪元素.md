# 使用 JS 控制伪元素

伪元素可以被浏览器渲染，但本身并不是 DOM 元素。它不存在于文档中，所以 JS 无法直接操作它。

## 伪元素的种类

伪元素有六个，分别是::after、::before、::first-line、::first-letter、::selection、::backdrop。

## 获取伪元素的属性值

获取伪元素的属性值可以使用**window.getComputedStyle()**方法，获取伪元素的 CSS 样式声明对象。然后利用 getPropertyValue 方法或直接使用键值访问都可以获取对应的属性值。

### 语法：window.getComputedStyle(element[, pseudoElement])

参数如下：

- element（Object）：伪元素的所在的 DOM 元素；
- pseudoElement（String）：伪元素类型。可选值有：”:after”、”:before”、”:first-line”、”:first-letter”、”:selection”、”:backdrop”；

列子：

```css
#myId:before {
  content: 'hello world!';
  display: block;
  width: 100px;
  height: 100px;
  background: red;
}
```

```html
<div id="myId"></div>
```

```js
var myIdElement = document.getElementById('myId')
var beforeStyle = window.getComputedStyle(myIdElement, ':before')
console.log(beforeStyle) // [CSSStyleDeclaration Object]
console.log(beforeStyle.width) // 100px
console.log(beforeStyle.getPropertyValue('width')) // 100px
console.log(beforeStyle.content) // "hello world!"
```

备注：

1.  getPropertyValue()和直接使用键值访问，都可以访问 CSSStyleDeclaration Object。它们两者的区别有：

    - 对于 float 属性，如果使用键值访问，则不能直接使用 getComputedStyle(element, null).float，而应该是 cssFloat 与 styleFloat；
    - 直接使用键值访问，则属性的键需要使用驼峰写法，如：style.backgroundColor；
    - 使用 getPropertyValue()方法不必可以驼峰书写形式（不支持驼峰写法），例如：style.getPropertyValue(“border-top-color”)；
    - getPropertyValue()方法在 IE9+和其他现代浏览器中都支持；在 IE6~8 中，可以使用 getAttribute()方法来代替；

2.  伪元素默认是”display: inline”。如果没有定义 display 属性，即使在 CSS 中显式设置了 width 的属性值为固定的大小如”100px”，但是最后获取的 width 值仍是”auto”。这是因为行内元素不能自定义设置宽高。解决办法是给伪元素修改 display 属性为”block”、”inline-block”或其他。

例子：

功能需求

1.  拖动滑块改变伪元素内的文字大小
2.  且伪元素内随时显示当前字号
3.  通过一个按钮可以改变伪元素内文字颜色

```html
<div class="test" data-font='16'></div>
<input type="range" id='change-font' />
<div class="change-color">改变文字颜色</div>
```

```css
.test {
  display: block;
}
.test::before {
  content: '我是' attr(class) '的::before伪元素,当前字号为' attr(data-font) 'px';
  width: 100%;
  word-break: break-all;
  display: block;
  border: 2px solid #abc;
  font-size: 16px;
  margin-bottom: 10px;
  white-space: pre;
}
.test-red::before {
  /*改变伪元素内文字颜色的class*/
  color: red;
}
.change-color {
  display: block;
  width: 150px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #eee;
  cursor: pointer;
  -webkit-user-select: none;
}
```

```js
var btnFontSize = document.querySelector('input')
var btnColor = document.querySelector('.change-color')
var currentPseudo = document.querySelector('.test')
var stylesheets = document.styleSheets
var sheet
if (stylesheets) {
  sheet = stylesheets[stylesheets.length - 1]
  // console.log(sheet);
  // console.log('sheet.cssRulesLength='+sheet.cssRules.length);
} else {
  var style = document.createElement('style')
  document.head.appendChild(style)
}
btnColor.addEventListener('click', function() {
  //粗略实现的改变颜色，未做切换。
  currentPseudo.classList.add('test-red')
})
var currentFontSize = window
  .getComputedStyle(currentPseudo, '::before')
  .getPropertyValue('font-size') //获取当前伪元素字体大小。
var cssRulesLength = sheet.cssRules.length //不‘-1’是因为这样才是在最后一位，否则加入的样式会变成倒数第二
console.log('cssrule=' + cssRulesLength + 'currentFont=' + currentFontSize)
sheet.insertRule(
  '.test::before{font-size:' + currentFontSize + '}',
  cssRulesLength
) //在最后一个style标签的最后位置添加当前字体大小样式。这么做是为了后面删除添加上去的cssRule，否则最后css表会变得巨大无比
btnFontSize.addEventListener('input', function() {
  //拖动滑块改变文字大小
  var changeFontSize = btnFontSize.value
  currentPseudo.setAttribute('data-font', changeFontSize)
  var index = sheet.cssRules.length - 1
  console.log('index=' + index)
  sheet.deleteRule(index) //删除最后一行样式（这里是前面添加的字体大小样式，不直接删除是为了防止误删除影响其他属性
  sheet.insertRule('.test::before{font-size:' + changeFontSize + 'px}', index)
  // sheet.insertRule('.test::before{font-size:16px}',index);
})
```

## 伪元素使用建议

1.  伪元素的 content 属性很强大，可以写入各种字符串和部分多媒体文件。但是伪元素的内容只存在于 CSS 渲染树中，并不存在于真实的 DOM 中。所以为了 SEO 优化，最好不要在伪元素中包含与文档相关的内容。

2.  修改伪元素的样式，建议使用通过更换 class 来修改样式的方法。因为其他两种通过插入行内 CSSStyleSheet 的方式是在 JavaScript 中插入字符代码，不利于样式与控制分离；而且字符串拼接易出错。

3.  修改伪元素的 content 属性的值，建议使用利用 DOM 的 data-\*属性来更改。

## 参考来源

[使用 JS 控制伪元素的几种方法](http://www.dengzhr.com/frontend/css/797)

[利用 javascript 获取并修改伪元素的值](http://chitanda.me/2015/07/15/get-and-modify-pseudo-elements-value-by-javascript/)
