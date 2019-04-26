# JS 参数按值传递

JS 中所有函数的参数都是按值传递的。把函数外部的值复制给函数内部的参数，就和把值从一个值复制到另一个变量一样。

JS 中数据类型分为基本类型与引用类型；
基本类型值存储于栈内存中，传递的就是当前值，修改不会影响原有变量的值；
引用类型值其实也存于栈内存中，只是它的值是指向堆内存当中实际值的一个地址；所以引用传递传的值是栈内存当中的引用地址，当改变时，改变了堆内存当中的实际值；

```js
var value = 1
function foo(v) {
  v = 2
  console.log(v) // 2
}
foo(value)
console.log(value) // 1
```

## 参考文章

[JavaScript 深入之参数按值传递](https://github.com/mqyqingfeng/Blog/issues/10)
