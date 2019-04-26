# data-属性

通过自定义的 data- 属性来设置私有的数据

通过 el.dataset.xxx 来访问 data-xxx=""

CSS 访问使用函数 attr()

```css
article::before {
  content: attr(data- *);
}
```

属性选择器：

```css
article[data-*='test'] {
  width: 1px;
}
```

## 参考：

[data-属性](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Using_data_attributes)
