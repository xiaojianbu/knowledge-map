# element 的 tab 切换时显示不正确

## 问题：element 的 tab 控件显示不正常

在项目中需要在 tab 控件上渲染多个 Handsontable 表格，在使用的过程中，Handsontable 表格需要在区域上点击一下才能显示出来。

## 原因：

原因是一开始 tab 区域处于隐藏状态，而 Handsontable 需要它的容器为 visible 的时候才会进行渲染：Handsontable 会根据容器的大小和位置进行一些计算，只有容器可见时才能可靠地确定这些属性。

## 解决：

利用 v-if 属性，当切换至对应的 tab 时，设置其 v-if 的值为 true 即可，同时设置默认显示的 tab。

当切换时，同一时刻只有一个 v-if 为 true，当将其设置为 true 时，Vue 会重新在页面渲染组件。

## 参考：

[render is not called until I click somewhere](https://github.com/handsontable/handsontable/issues/1418)

[handsontable does not show all columns untill click](https://github.com/handsontable/ngHandsontable/issues/184)

[element-ui 的 tab 渲染问题](https://github.com/ElemeFE/element/issues/6799)

[Vue 解决 echart 在 element 的 tab 切换时显示不正确](https://zhuanlan.zhihu.com/p/35138609)
