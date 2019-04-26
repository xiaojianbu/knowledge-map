# Vue中引入第三方JS库

在项目中使用原有的handsontable.js
1.在index.html中<span data-type="color" style="color:rgb(79, 79, 79)"><span data-type="background" style="background-color:rgb(255, 255, 255)">用 </span></span>`script`<span data-type="color" style="color:rgb(79, 79, 79)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>标签引入：
```html
<script src="static/handsontable.full.js"></script>
```
2.在`webpack.base.conf.js`中配置一个externals:
```javascript
  externals: {
    // 后面是原本使用的全局变量名，前面的是引入的包名（就是import xx from 'echart'），然后我们实际写代码时候，用的是xx这个变量名。
    Handsontable: 'Handsontable'
  }
```
3.在任意组件中用import来引用handsontable
```javascript
import Handsontable from 'Handsontable '
```
参考来源：[Vue 中如何引入第三方 JS 库](https://blog.csdn.net/csdn_yudong/article/details/78795743)
