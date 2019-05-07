# 数组 API

## 文章来源

[【深度长文】JavaScript 数组所有 API 全解密 作者：路易斯](https://juejin.im/post/5902d56e1b69e60058c634d6)

## Array 构造器

通常使用对象字面量来创建数组，但也可以使用 Array 构造器用于创建一个新的数组，例如创建一个长度为 8 的空数组。

```js
// 使用Array构造器
var a = Array(8) // [undefined * 8]
// 使用对象字面量
var b = []
b.length = 8 // [undefined * 8]
```

上面使用了**Array(8)** 而不是 **new Array(8)** ;这得益于 Array 构造器内部对 this 指针的判断，ES 规范定义如下：

> When **Array** is called as a function rather than as a constructor, it creates and initialises a new Array object. Thus the function call **Array(…)** is equivalent to the object creation expression **new Array(…)** with the same arguments.

从规范来看，浏览器内部大致做了如下类似的实现：

```js
function Array() {
  // 如果this不是Array的实例，那就重新new一个实例
  if (!(this instanceof arguments.callee)) {
    return new argument.callee()
  }
}
```

Array 构造器根据参数长度的不同，有如下两种处理：

- new Array(arg1, arg2, ...), 参数长度为 0 或者长度大于等于 2 时，传入的参数将按照顺序依次成为新数组的第 0 至 N 项（参数为 0 时，返回空数组）。
- new Array(len), 当 len 不是数值时，处理同上，返回一个只包含 len 元素一向的数组；当 len 为数值时，根据如下规范，len 最大不能超过 32 位无符号整型，即需要小于 2 的 32 次方，否则将抛出 RangeError。

> If the argument len is a Number and ToUint32(len) is equal to len, then the length property of the newly constructed object is set to ToUint32(len). If the argument len is a Number and ToUint32(len) is not equal to len, a RangeError exception is thrown.

## ES6 新增的构造函数方法

### Array.of

Array.of 用于将参数依次转化为数组中的一项，然后返回这个新数组，而不管这个参数是数字还是其它。它基本与 Array 构造器功能一致，唯一的区别就在于单个数字的处理上。例如：

```js
Array.of(8.0) // [8]
Array(8.0) // [undefined * 8]
```

参数为多个或单个参数不是数字时，Array.of 与 Array 构造器等同。

```js
Array.of(8.0, 5) // [8, 5]
Array(8.0, 5) // [8, 5]

Array.of('8') // ['8']
Array('8') // ['8']
```

Array.of 的 polyfill 如下：

```js
if (!Array.of) {
  Array.of = function() {
    return Array.prototype.slice.call(arguments)
  }
}
```

### Array.from

语法：Array.from(arrayLike[, processingFn[,thisArg]])

Array.from 的设计初衷是快速便捷的基于其他对象创建新数组，准确来说就是从一个类似数组的可迭代对象创建一个新的数组实例，只要一个对象有迭代器，Array.from 就能把它变成一个数组。

从语法上看，Array.from 有三个形参，第一个为类似数组的对象，必选；第二个为加工函数，新生成的数组会经过该函数的加工再返回；第三个为 this 作用域，表示加工函数执行时的 this 值。后两个参数可选。用法如下：

```js
var obj = { 0: 'a', 1: 'b', 2: 'c', length: 3 }
Array.from(
  obj,
  function(value, index) {
    console.log(value, index, this, arguments.length)
    return value.repeat(3) //必须指定返回值，否则返回undefined
  },
  obj
)
// 执行结果
// a 0 {0: "a", 1: "b", 2: "c", length: 3} 2
// b 1 {0: "a", 1: "b", 2: "c", length: 3} 2
// c 2 {0: "a", 1: "b", 2: "c", length: 3} 2
// ["aaa", "bbb", "ccc"]

// 使用箭头函数可将上述代码简化为
Array.from(obj, value => value.repeat(3))
```

拥有迭代器的对象还包括：String, Set, Map, arguments 等。如下所示：

```js
// String
Array.from('abc') // ['a', 'b', 'c']
// Set
Array.from(new Set(['abc', 'def'])) // ['abc', 'def']
// Map
Array.from(new Map([[1, 'abc'], [2, 'def']])) // [[1, 'abc'], [2, 'def']]
// 天生的类数组对象arguments
function fn() {
  return Array.from(arguments)
}
fn(1, 2, 3) // [1, 2,3]
```

Array.from 的一个重要的扩展场景，生成一个从 0 到指定数字的新数组。

```js
Array.from({ length: 10 }, (v, i) => i) // [0,1,2,3,4,5,6,7,8,9]
```

## Array.isArray

用来判断一个变量是否为数组类型。

```js
Array.isArray([]) // true
Array.isArray({ 0: 'a', length: 1 }) // false
```

在有这个方法之前，有至少如下 5 种方式去判断一个值是否为数组：

```js
var a = []
// 1.基于instanceof
a instanceof Array
// 2.基于constructor
a.constructor === Array
// 3. 基于Object.prototype.isPrototypeOf
Array.prototype.isPrototypeOf(a)
// 4.基于getPrototypeOf
Object.getPrototypeOf(a) === Array.prototype
// 5.基于Object.prototype.toString
Object.prototype.toString.apply(a) === '[object Array]'
```

上述 5 种方法中，除了 Object.prototype.toString 外，其它方法都不能正确的判断变量的类型。如下所示：

```js
var a = {
  __proto__: Array.prototype
}
// 分别在控制台试运行以下代码
// 1.基于instanceof
a instanceof Array // true
// 2.基于constructor
a.constructor === Array // true
// 3.基于Object.prototype.isPrototypeOf
Array.prototype.isPrototypeOf(a) // true
// 4.基于getPrototypeOf
Object.getPrototypeOf(a) === Array.prototype // true
```

手动指定对象的\_\_proto\_\_属性为 Array.prototype,便导致了该对象继承了 Array 对象。

而且在 iframe 中声明的数组，它的构造函数是 iframe 中的 Array 对象。如果这个数组赋值给父页面的变量 y，那么在父页面使用 y instanceof Array，其结果为 false。

## 方法

### 改变自身值的方法

#### pop

pop()方法删除一个数组中的最后一个元素，并且返回这个元素。

```js
var arr = ['cat', 'dog', 'mouse']
var item = arr.pop()
console.log(arr) // ['cat', 'dog']
console.log(item) // mouse
```

pop 方法可应用在类数组对象上，即**鸭式辨型**

```js
var obj = { 0: 'cat', 1: 'dog', 2: 'mouse', length: 3 }
var item = Array.prototype.pop.call(obj)
console.log(obj) // {0: "cat", 1: "dog", length: 2}
console.log(item) // mouse
```

但如果类数组对象不具有 length 属性，那么该对象将被创建 length 属性，length 值为 0。

```js
var obj = { 0: 'cat', 1: 'dog', 2: 'mouse' }
var item = Array.prototype.pop.call(obj)
console.log(obj) // {0: "cat", 1: "dog", 2: "mouse", length: 0}
console.log(item) // undefined
```

#### push

push()方法添加一个或者多个元素到数组末尾，并且返回数组的长度。

```js
var arr = [1, 2, 3]
var len = arr.push(4, 5, 6)
console.log(arr)
console.log(len)
```

push 也可以应用到类数组对象上，如果 length 不能被转成一个数值或者不存在 length 属性时，则插入的元素索引为 0，且 length 属性不存在时，将会创建它。

```js
var obj = { 0: '0', 1: '1' }
var len = Array.prototype.push.call(obj, '2')
console.log(obj) // {0: "2", 1: "1", length: 1}
console.log(len) // 1
```

实际上，push 是根据 length 属性来决定从哪里开始插入给定的值。

```js
var obj = { 0: '0', 1: '1', length: 1 }
var len = Array.prototype.push.call(obj, '2')
console.log(obj) // {0: "0", 1: "2", length: 2}
console.log(len) // 2
```

利用 push 根据 length 属性插入元素这个特点，可以实现数组的合并。

```js
var arr = [1, 2]
var arr2 = [3, 4]
var len = Array.prototype.push.apply(arr, arr2)
console.log(arr) // [1, 2, 3, 4]
console.log(len) // 4
```

#### reverse

reverse()方法颠倒数组中元素的位置，第一个成为最后一个，最后一个成为第一个，该方法返回对数组的引用。

```js
var arr = [1, 2, 3, 4]
var arr1 = arr.reverse()
console.log(arr) // [4, 3, 2, 1]
console.log(arr === arr1) // true
```

同上，reverse 也是鸭式辨型的受益者，颠倒元素的范围受到 length 属性制约。

```js
var obj = { 0: '0', 1: '1', 2: '2', length: 2 }
var obj2 = Array.prototype.reverse.call(obj)
console.log(obj2) // {0: "1", 1: "0", 2: "2", length: 2}
console.log(obj === obj2) // true
```

如果 length 属性小于 2 或者 length 属性不为数值，那么原类数组对象将没有变化。即使 length 属性不存在，该对象也不会去创建 length 属性。特别是，当 length 属性较大时，类数组对象的索引会尽可能的向 length 看齐。

```js
var obj = { 0: '0', 1: '1', 2: '2', length: 100 }
var obj2 = Array.prototype.reverse.call(obj)
console.log(obj2) // {97: "2", 98: "1", 99: "0", length: 100}
console.log(obj === obj2) // true
```

#### shift

shift()方法删除数组的第一个元素，并返回这个元素

```js
var arr = [1, 2, 3, 4]
var item = arr.shift()
console.log(arr) // [2, 3, 4]
console.log(item) // 1
```

同样受益于鸭式辨型，对于类数组对象，shift 仍然可以处理。

```js
var obj = { 0: '0', 1: '1', 2: '2', length: 3 }
var item = Array.prototype.shift.call(obj)
console.log(obj) // {0: "1", 1: "2", length: 2}
console.log(item) // 0
```

如果类数组对象 length 属性不存在，将添加 length 属性，并初始化为 0。

```js
var obj = { 0: '0', 1: '1', 2: '2' }
var item = Array.prototype.shift.call(obj)
console.log(obj) // {0: "0", 1: "1", 2: "2", length: 0}
console.log(item) // undefined
```

#### sort

sort()方法对数组元素进行排序，并返回这个数组。

语法：array.sort([compareFn])

compareFn 是可选的，如果省略，数组元素将按照各自转换为字符串的 Unicode 位点顺序排序，例如将 'Boy' 排到 'apple' 前。当对数字排序的时候，25 将会排到 8 之前，因为转换为字符串后，'25'将比'8'考前。

```js
var arr = ['apple', 'Boy', 'cat', 'dog']
var arr2 = arr.sort()
console.log(arr) // ["Boy", "apple", "cat", "dog"]
console.log(arr === arr2) // true

arr = [10, 1, 3, 20]
var arr3 = arr.sort()
console.log(arr3) // [1, 10, 20, 3]
```

如果指明了 compareFn,数组将按照调用该函数的返回值来排序。若 a 和 b 是两个将要比较的元素：

- 若 compareFn(a, b) < 0, 那么 a 将排到 b 的前面；
- 若 compareFn(a, b) = 0, 那么 a 和 b 相对位置不变；
- 若 compareFn(a, b) > 0, 那么 a,b 将会调换位置；

如果数组元素为数字，则排序函数 compareFn 格式如下：

```js
function compareFn(a, b) {
  return a - b
}
```

如果数组元素为非 ASCII 字符的字符串（中文字符等非英文字符）,则需要使用 String.localeCompare

```js
var arr = ['互', '联', '网', '改', '变', '世', '界']
var arr2 = arr.sort()

var arr1 = ['互', '联', '网', '改', '变', '世', '界']
var arr3 = arr1.sort(function(a, b) {
  return a.localeCompare(b)
})
console.log(arr2) // ["世", "互", "变", "改", "界", "网", "联"]
console.log(arr3) // ["世", "互", "变", "改", "界", "网", "联"]
```

同上，sort 一样受益于鸭式辨型。

```js
var obj = {
  0: '互',
  1: '联',
  2: '网',
  3: '改',
  4: '变',
  5: '世',
  6: '界',
  length: 7
}
Array.prototype.sort.call(obj, function(a, b) {
  return a.localeCompare(b)
})
console.log(obj) // {0: "世", 1: "互", 2: "变", 3: "改", 4: "界", 5: "网", 6: "联", length: 7}
```

若类数组对象不具有 length 属性，它不会进行排序，也不会为其添加 length 属性。

```js
var obj = {
  0: '互',
  1: '联',
  2: '网',
  3: '改',
  4: '变',
  5: '世',
  6: '界'
}
Array.prototype.sort.call(obj, function(a, b) {
  return a.localeCompare(b)
})
console.log(obj) // {0: "互", 1: "联", 2: "网", 3: "改", 4: "变", 5: "世", 6: "界"}
```

##### 使用映射改善排序

compareFn 如果需要对数组元素多次转换以实现排序，那么使用 map 辅助排序将是个不错的选择。基本思想是将数组中的每个元素实际比较的值取出排序后再将数组恢复。

```js
// 需要被排序的数组
var arr = ['dog', 'Cat', 'Boy', 'apple']
// 对需要排序的数字和位置的临时存储
var mapped = arr.map((el, i) => {
  return { index: i, value: el.toLowerCase() }
})
// 按照多个值排序数组
mapped.sort(function(a, b) {
  return +(a.value > b.value) || +(a.value === b.value) - 1
})
// 根据索引得到排序的结果
var result = mapped.map(function(el) {
  return arr[el.index]
})
console.log(result) // ["apple", "Boy", "Cat", "dog"]
```

##### 奇怪的 Chrome

ES 规范中没有规定具体的 sort 算法，各个浏览器有着不同的 sort 算法。在 Chrome 浏览器下：

```js
var arr = [
  { n: 'a', v: 1 },
  { n: 'b', v: 1 },
  { n: 'c', v: 1 },
  { n: 'd', v: 1 },
  { n: 'e', v: 1 },
  { n: 'f', v: 1 },
  { n: 'g', v: 1 },
  { n: 'h', v: 1 },
  { n: 'i', v: 1 },
  { n: 'j', v: 1 },
  { n: 'k', v: 1 }
]

arr.sort(function(a, b) {
  return a.v - b.v
})

for (var i = 0, len = arr.length; i < len; i++) {
  console.log(arr[i].n)
}
// f a c d e b g h i j k
```

v 值相等，arr 数组排序前后应该不变,然而 Chrome 的 V8 引擎为了高效排序（采用了不稳定排序）。即数组长度超过 10 条时，会调用另一种排序方法（快速排序）；而 10 条及以下采用的是插入排序，此时结果稳定。

```js
var arr = [
  { n: 'a', v: 1 },
  { n: 'b', v: 1 },
  { n: 'c', v: 1 },
  { n: 'd', v: 1 },
  { n: 'e', v: 1 },
  { n: 'f', v: 1 },
  { n: 'g', v: 1 },
  { n: 'h', v: 1 },
  { n: 'i', v: 1 },
  { n: 'j', v: 1 }
]
arr.sort(function(a, b) {
  return a.v - b.v
})

for (var i = 0, len = arr.length; i < len; i++) {
  console.log(arr[i].n)
}
// a b c d e f g h i j
```

可以使用下面的方法，改变排序方法的返回值来规避上述问题

```js
arr.sort(function(a, b) {
  return a.v - b.v || arr.indexOf(a) - arr.indexOf(b)
})
```

使用数组的 sort 方法需要注意：各浏览器的针对 sort 方法内部算法实现不尽相同，排序函数尽量只返回-1，0，1 三种不同的值，不要尝试返回 true 或 false 等其它数值，以免导致不可靠的排序结果。

#### splice

splice 方法用新元素替换旧元素的方式来修改数组。

语法：arr.splice(start, deleteCount[,item1[,item2[,...]]])

start 指定从哪一位开始修改内容。如果超过数组长度，则从数组末尾开始添加内容；如果是负值，则其指定的索引位置等同于 length+start（length 为数组的长度），表示从数组末尾开始的第-stat 位。

deleteCount 指定要删除的元素个数，若等于 0，则不删除。这种情况下，至少应该添加一位新元素；若大于 start 之后的元素总和，则 start 及之后的元素都将被删除。

itemN 指定新增的元素，如果缺省，则该方法只删除数组元素。

返回值 由原数组中被删除元素组成的数组，如果没有删除，则返回一个空数组。

```js
var arr = ['apple', 'boy']
var splices = arr.splice(1, 1)
console.log(arr) // ["apple"]
console.log(splices) // ["boy"] ,可见是从数组下标为1的元素开始删除,并且删除一个元素,由于itemN缺省,故此时该方法只删除元素

arr = ['apple', 'boy']
splices = arr.splice(2, 1, 'cat')
console.log(arr) // ["apple", "boy", "cat"]
console.log(splices) // [], 可见由于start超过数组长度,此时从数组末尾开始添加元素,并且原数组不会发生删除行为

arr = ['apple', 'boy']
splices = arr.splice(-2, 1, 'cat')
console.log(arr) // ["cat", "boy"]
console.log(splices) // ["apple"], 可见当start为负值时,是从数组末尾开始的第-start位开始删除,删除一个元素,并且从此处插入了一个元素

arr = ['apple', 'boy']
splices = arr.splice(-3, 1, 'cat')
console.log(arr) // ["cat", "boy"]
console.log(splices) // ["apple"], 可见即使-start超出数组长度,数组默认从首位开始删除

arr = ['apple', 'boy']
splices = arr.splice(0, 3, 'cat')
console.log(arr) // ["cat"]
console.log(splices) // ["apple", "boy"], 可见当 deleteCount 大于数组 start 之后的元素总和时,start及之后的元素都将被删除
```

同上，splice 也受益于鸭式辨型

```js
var obj = { 0: '0', 1: '1', length: 2 }
var splices = Array.prototype.splice.call(obj, 1, 1)
console.log(obj) // {0: "0", length: 1}
console.log(splices) // ["1"]
```

如果类数组对象没有 length 属性，splice 将为该类数组对象添加 length 属性，并初始化为 0.

#### unshift

iunshift()方法用于在数组开始处插入一些元素，并返回数组新的长度。

语法：arr.unshift(element1,...,elementN)

```js
var arr = ['red', 'green']
var len = arr.unshift('blue')
console.log(arr) // ["yellow", "red", "blue"]
console.log(len) // 3
```

如果给 unshift 方法传入一个数组

```js
var arr = ['red', 'green']
var len = arr.unshift(['blue'])
console.log(arr) // [["blue"], "red", "green"]
console.log(len) // 3
```

同上，unshift 也受益于鸭式辨型

```js
var obj = { 0: '0', 1: '1', length: 2 }
var len = Array.prototype.unshift.call(obj, '2')
console.log(arr) // {0: "2", 1: "0", 2: "1", length: 3}
console.log(len) // 3
```

注意：如果类数组没有 length 属性，则返回结果为{0:'2',1:'1',length:1},unshift 会认为数组长度为 0，此时将从对象下标为 0 的位置开始插入，相应位置属性将被替换，此时初始化类数组对象的 length 属性为插入元素个数。

```js
var obj = { 0: '0', 1: '1' }
var len = Array.prototype.unshift.call(obj, '2')
console.log(obj) // {0: "2", 1: "1", length: 1}
console.log(len) // 1
```

### 不改变自身值的方法

#### concat

concat() 方法将传入的数组或者元素与原数组合并，组成一个新的数组并返回。

语法：arr.concat(value1,value2,...,valueN)

```js
var arr = [1, 2, 3]
var arr2 = arr.concat(4, [5, 6], [7, 8, 9])
console.log(arr2) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(arr) // [1, 2, 3]
```

若 concat 方法中不传入参数，那么将基于原数组浅复制生成一个一模一样的新数组。

```js
var arr = [{ a: 1 }]
var arr2 = arr.concat()
console.log(arr2) // [{a: 1}]
console.log(arr2 === arr) // false
console.log(arr2[0] === arr[0]) // true
```

同上，concat 一样受益于鸭式辨型，但其效果可能达不到我们的期望

```js
var obj = { 0: 'a', 1: 'b', 2: 'c', length: 3 }
var obj2 = Array.prototype.concat.call(
  obj,
  'd',
  { 3: 'e', 4: 'f', length: 2 },
  ['g', 'h', 'i']
)

console.log(obj2) // [{0:"a", 1:"b", 2:"c", length:3}, 'd', {3:'e', 4:'f', length:2}, 'g', 'h', 'i']
```

#### join

join() 方法将数组中的所有元素连接成一个字符串。

语法：arr.join([separator = ',']) separator 可选，缺省默认为逗号。

```js
var arr = [1, 2, 3]
console.log(arr.join()) // 1,2,3
console.log(arr.join('+')) // 1+2+3
console.log(arr.join('')) //123
```

同上，join 一样受益于鸭式辨型

```js
var obj = { 0: '0', 1: '1', 2: '2', length: 3 }
console.log(Array.prototype.join.call(obj, '+')) // 0+1+2
```

#### slice

slice() 方法将数组中一部分元素浅复制存入新的数组对象，并且返回这个数组对象。

语法：arr.slice([start[,end]])

参数 start 指定复制开始位置的索引，end 如果有值则表示复制结束位置的索引（不包括此位置）。

如果 start 的值为负数，假如数组长度为 length，则表示从 length+start 的位置开始复制，此时参数 end 如果有值，只能是比 start 大的负数，否则将返回空数组。

slice 方法参数为空时，同 concat 方法一样，都是浅复制生成一个新数组。

```js
var arr = [1, 2, 3, 4]
console.log(arr.slice()) // [1, 2, 3, 4]
console.log(arr.slice(2, 3)) // [3]
```

同上，slice 一样受益于鸭式辨型。

```js
var obj = { 0: '0', 1: '1', 2: '2', length: 3 }
var obj2 = Array.prototype.slice.call(obj, 0, 1)
console.log(obj2) // ["0"]
```

#### toString

toString() 方法返回数组的字符串形式，该字符串由数组中的每个元素的 toString() 返回值经调用 join() 方法连接（由逗号隔开）组成。

语法：arr.toString()

```js
var arr = [1, 2, 3]
var str = arr.toString()
console.log(str) // 1,2,3
```

当数组直接和字符串作连接操作时，将会自动调用其 toString() 方法。

```js
var str = [1, 2, 3] + ',3'
console.log(str) // 1,2,3,3
```

#### toLocaleString

toLocaleString() 类似 toString()的变型，该字符串由数组中的每个元素的 toLocaleString() 返回值经调用 join() 方法连接（由逗号隔开）组成。

语法： arr.toLocaleString()

数组中的元素将调用各自的 toLocaleString 方法

```js
var arr = [{ name: '1' }, 123, 'abc', new Date()]
var str = arr.toLocaleString()
console.log(str) // [object Object],123,abc,2018/8/8 下午6:41:38
```

#### indexOf

indexOf() 方法用于查找元素在数组中第一次出现时的索引，如果没有，则返回-1。

语法： arr.indexOf(element, fromIndex = 0)

element 为需要查找的元素。

fromIndex 为开始查找的位置，缺省默认为 0。如果超出数组长度，则返回-1。如果为负值，假设数组长度为 length，则从数组的第 length + fromIndex 项开始往数组末尾查找，如果 length + fromIndex<0 则整个数组都会被查找。

indexOf 使用严格相等（即使用 === 去匹配数组中的元素）。

```js
var array = ['abc', 'def', 'ghi', '123']
console.log(array.indexOf('def')) // 1
console.log(array.indexOf('def', -1)) // -1 此时表示从最后一个元素往后查找,因此查找失败返回-1
console.log(array.indexOf('def', -4)) // 1 由于4大于数组长度,此时将查找整个数组,因此返回1
console.log(array.indexOf(123)) // -1, 由于是严格匹配,因此并不会匹配到字符串'123'
```

同上，indexOf 可以处理类数组对象

```js
var o = { 0: 'abc', 1: 'def', 2: 'ghi', length: 3 }
console.log(Array.prototype.indexOf.call(o, 'ghi', -4)) // 2
```

#### lastIndexOf

lastIndexOf() 方法用于查找元素在数组中最后一次出现时的索引，如果没有，则返回-1。并且它是 indexOf 的逆向查找，即从数组最后一个往前查找。

语法：arr.lastIndexOf(element, fromIndex=length-1)

element 为需要查找的元素。

fromIndex 为开始查找的位置，缺省默认为数组长度 length-1。如果超出数组长度，由于是逆向查找，则查找整个数组。如果为负值，则从数组的第 length + fromIndex 项开始往数组开头查找，如果 length + fromIndex<0 则数组不会被查找。

同 indexOf 一样，lastIndexOf 也是严格匹配数组元素。

#### includes

includes() 方法基于 ECMAScript 2016（ES7）规范，它用来判断当前数组是否包含某个指定的值，如果是，则返回 true，否则返回 false。

语法：arr.includes(element,fromIndex=0)

element 为需要查找的元素。

fromIndex 表示从该索引位置开始查找 element，缺省为 0，它是正向查找，即从索引处往数组末尾查找。

```js
var array = [1, 2, NaN]
console.log(array.includes(1)) // true
console.log(array.includes(NaN)) // true
console.log(array.includes(2, -4)) // true
```

该方法同样受益于鸭式辨型。

```js
var obj = { 0: '0', 1: '1', length: 2 }
var bool = Array.prototype.includes.call(obj, '0')
console.log(bool) // true
```

### 遍历方法

#### forEach

forEach() 方法指定数组的每项元素都执行一次传入的函数，返回值为 undefined。

语法：arr.forEach(fn, thisArg)

fn 表示在数组每一项上执行的函数，接受三个参数：

- value 当前正在被处理的元素的值
- index 当前元素的数组索引
- array 数组本身

thisArg 可选，用来当做 fn 函数内的 this 对象。

forEach 将为数组中每一项执行一次 fn 函数，那些已删除，新增或者从未赋值的项将被跳过（但不包括值为 undefined 的项）。

```js
var arr = [1, 3, 5]
var obj = { name: 'cc' }
var sReturn = arr.forEach(function(value, index, array) {
  arr[index] = value * value
  console.log(this.name) // cc被打印了三次
}, obj)

console.log(arr) // [1, 9, 25]
console.log(sReturn) // undefined
```

得益于鸭式辨型，虽然 forEach 不能直接遍历对象，但它可以通过 call 方式遍历类数组对象。

```js
var obj = { 0: 1, 1: 3, 2: 5, length: 3 }
Array.prototype.forEach.call(
  obj,
  function(value, index, obj) {
    console.log(value, index, obj)
    obj[index] = value * value
  },
  obj
)
// 1 0 Object {0: 1, 1: 3, 2: 5, length: 3}
// 3 1 Object {0: 1, 1: 3, 2: 5, length: 3}
// 5 2 Object {0: 1, 1: 9, 2: 5, length: 3}
console.log(obj) // Object {0: 1, 1: 9, 2: 25, length: 3}
```

forEach 无法直接退出循环，只能使用 return 来达到 for 循环中 continue 的效果。

#### every

every() 方法使用传入的函数测试所有元素，只要其中有一个函数返回值为 false，那么该方法的结果为 false；如果全部返回 true，那么该方法的结果才为 true。

语法同上述 forEach

#### some

some() 方法刚好同 every() 方法相反，some 测试数组元素时，只要有一个函数返回值为 true，则该方法返回 true，若全部返回 false，则该方法返回 false。

#### filter

filter() 方法使用传入的函数测试所有元素，并返回所有通过测试的元素组成的新数组。它就好比一个过滤器，筛掉不符合条件的元素。

语法：arr.filter(fn,thisArg)

```js
var arr = [18, 9, 10, 35, 80]
var arr2 = arr.filter(function(value, index, arr) {
  return value > 20
})
console.log(arr2) // [35, 80]
```

#### map

map() 方法遍历数组，使用传入函数处理每个元素，并返回函数的返回值组成的新数组。

语法：arr.map(fn,thisArg)

参数介绍同 forEach 方法的参数介绍。

Array.prototype.map()

callback 函数的执行规则

参数：自动传入三个参数

- currentValue
- index
- array

callback 处理的数组范围

- 只处理有值的索引。
- 在处理过程中新增的元素不会被 callback 处理
- 在处理过程中被删除的元素不会被 callback 处理
- 在处理过程中被改变的元素，会以 callback 执行到该元素时的值被处理。

#### reduce

reduce() 方法接收一个方法作为累加器，数组中的每个值(从左至右) 开始合并，最终为一个值。

语法：arr.reduce(fn, initialValue)

fn 表示在数组每一项上执行的函数，接受四个参数：

- previousValue 上一次调用回调返回的值，或者是提供的初始值
- value 数组中当前被处理元素的值
- index 当前元素在数组中的索引
- array 数组自身

initialValue 指定第一次调用 fn 的第一个参数。

当 fn 第一次执行时：

- 如果 initialValue 在调用 reduce 时被提供，那么第一个 previousValue 将等于 initialValue，此时 item 等于数组中的第一个值；
- 如果 initialValue 未被提供，那么 previousVaule 等于数组中的第一个值，item 等于数组中的第二个值。此时如果数组为空，那么将抛出 TypeError。
- 如果数组仅有一个元素，并且没有提供 initialValue，或提供了 initialValue 但数组为空，那么 fn 不会被执行，数组的唯一值将被返回。

```js
var arr = [1, 2, 3, 4]
var s = arr.reduce(function(previousValue, value, index, arr) {
  return previousValue * value
}, 1)
console.log(s) // 24
```

#### reduceRight

reduceRight() 方法接收一个方法作为累加器，数组中的每个值（从右至左）开始合并，最终为一个值。除了与 reduce 执行方向相反外，其他完全与其一致。

#### entries

entries() 方法基于 ECMAScript 2015（ES6）规范，返回一个数组迭代器对象，该对象包含数组中每个索引的键值对。

语法：arr.entries

```js
var arr = [1, 2, 3]
var iterator = arr.entries()
console.log(iterator.next().value) // [0, 1]
console.log(iterator.next().value) // [1, 2]
console.log(iterator.next().value) // [2, 3]
console.log(iterator.next().value) // undefined
```

#### find&findIndex

find() 方法基于 ECMAScript 2015（ES6）规范，返回数组中第一个满足条件的元素（如果有的话）， 如果没有，则返回 undefined。

findIndex() 方法也基于 ECMAScript 2015（ES6）规范，它返回数组中第一个满足条件的元素的索引（如果有的话）否则返回-1。

语法：arr.find(fn,thisArg), arr.findIndex(fn,thisArg)

```js
var arr = [1, 3, 5, 7, 8, 9, 10]
function f(value, index, arr) {
  return value % 2 === 0 // 返回偶数
}
function f2(value, index, arr) {
  return value > 20 // 返回大于20的数
}
console.log(array.find(f)) // 8
console.log(array.find(f2)) // undefined
console.log(array.findIndex(f)) // 4
console.log(array.findIndex(f2)) // -1
```

#### keys

keys() 方法基于 ECMAScript 2015（ES6）规范，返回一个数组索引的迭代器

语法：arr.keys()

```js
var arr = ['abc', 'xyz']
var iterator = arr.keys()

console.log(iterator.next()) // Object {value: 0, done: false}
console.log(iterator.next()) // Object {value: 1, done: false}
console.log(iterator.next()) // Object {value: undefined, done: false}
```

索引迭代器会包含那些没有对应元素的索引，如下：

```js
var arr = ['abc', , 'xyz']
var sparseKeys = Object.keys(arr)
var denseKeys = [...array.keys()]
console.log(sparseKeys) // ["0", "2"]
console.log(denseKeys) // [0, 1, 2]
```

#### values

values() 方法基于 ECMAScript 2015（ES6）规范，返回一个数组迭代器对象，该对象包含数组中每个索引的值。其用法基本与上述 entries 方法一致。

语法：arr.values()

```js
var arr = [1, 2]
var iterator = arr.values()
console.log(iterator.next().value) // 1
console.log(iterator.next().value) // 2
```

## reduce 实现 filter,map

### reduce 实现 map

```js
if (Array.prototype._map === undefined) {
  Array.prototype._map = function(cb) {
    if (typeof cb === 'function') {
      return this.reduce((prev, item, index, arr) => {
        prev.push(cb(item, index, arr))
        return prev
      }, [])
    } else {
      console.log(new Error('callback is not function'))
    }
  }
}
let val = [1, 5, 6]._map(item => item + 1)
console.log(val) // [2, 6, 7]
```

### reduce 实现 filter

```js
Array.prototype._filter = function(callback) {
  if (typeof callback === 'function') {
    return this.reduce((prev, item, index, arr) => {
      callback(item, index, arr) ? prev.push(item) : null
      return prev
    }, [])
  } else {
    console.log(new Error('callback is not function'))
  }
}
let val = [1, 5, 6]._filter(item => item > 2)
console.log(val) // [5, 6]
```

## 总结

- 所有插入元素的方法, 比如 push、unshift，一律返回数组新的长度；
- 所有删除元素的方法，比如 pop、shift、splice 一律返回删除的元素，或者返回删除的多个元素组成的数组；
- 部分遍历方法，比如 forEach、every、some、filter、map、find、findIndex，它们都包含 function(value,index,array){} 和 thisArg 这样两个形参。

Array.prototype 的所有方法均具有鸭式辨型这种神奇的特性。它们不止可以用来处理数组对象，还可以处理类数组对象。
