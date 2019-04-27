# JS 类数组转换为数组

## 什么是类数组对象

特征

特征一：具有指向对象元素的数字索引下标以及 length 属性,告诉我们对象的元素个数

特征二：不具有诸如 push 、forEach 以及 indexOf 等数组对象具有的方法

常见的类数组对象

```js
document.getElementsByClassName()

document.getElementsByTagName()

document.getElementsByName()

document.querySelectorAll()

document.stylesheets

parentNode.childNodes

arguments

var arrayObj = {
  0 : '0'
  1 : '1'
  length : 2
};
```

## 转换为数组对象

slice() 方法可以将一个类数组 (Array-like) 对象/集合转换成一个数组. 你只需要用数组原型上的 slice 方法 call 这个对象,即 Array.prototype.slice.call(Array-like)。也可以简单的使用[].slice.call(Array-like)来代替。
