# element-ui tree 横向滚动条

tree 中 label 过长或者 children 层级过多，横向滚动不显示

通过修改 CSS 来解决问题

```css
.tree {
  height: 320px;
  overflow-y: auto;
  overflow-x: scroll;
}

.el-tree > .el-tree-node {
  min-width: 100%;
  display: inline-block !important;
}
```

参考链接：[issue1 ](https://github.com/ElemeFE/element/issues/4456)[issue2](https://github.com/ElemeFE/element/issues/4944) [issue3](https://github.com/ElemeFE/element/issues/2745)
