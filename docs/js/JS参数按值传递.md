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

```JavaScript
function setName(obj){
    obj.name = 'a';
    obj = {name:'b'}
}
var president = {name:'c'};
setName(president);
```

代码执行后 president.name='a';进入 setName 函数后，obj 和 president 指向对内存中同一对象，对 obj 的修改会反应到 president 上，之后 obj 指向一个新的对象。具体的内存变化情如下图所示：

![参数按值传递](https://raw.githubusercontent.com/xiaojianbu/markdownPicture/master/%E5%87%BD%E6%95%B0%E5%80%BC%E4%BC%A0%E9%80%92/%E5%87%BD%E6%95%B0%E5%80%BC%E4%BC%A0%E9%80%92.jpg)

## 参考文章

[深入了解的话可以参考（call by sharing）](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing)

[JavaScript 深入之参数按值传递](https://github.com/mqyqingfeng/Blog/issues/10)
