# 常见的 JS 面试题

## 来源

[前端笔试面试题题库](https://github.com/jirengu/frontend-interview)

[知识面经汇总](https://github.com/CodingMeUp/some_notes)

## JavaScript 是一种弱类型语言，它分别有什么优点和缺点？

所谓弱类型指的是定义变量时，不需要什么类型，在程序运行过程中会自动判断类型。

## 本地、预发和线上三套环境，如何进行无痕切换？ 如果开发时接口有变动，线上数据暂未产出，本地 mock 接口如何快速响应？

- 线上测试，本地反向代理到预发或者线上环境；
- 本地测试，则使用 apache 开启服务提供 mock 接口

https://www.cnblogs.com/hustskyking/p/donnot-repeat-yourself.html

## 页面回退 Session 和 Token 失效如何处理？

https://segmentfault.com/a/1190000017304793

## ["1", "2", "3"].map(parseInt)

[从一道坑人的面试题说函数式编程](https://www.h5jun.com/post/parseInt-to-functional.html)

parseInt() 函数能解析一个字符串，并返回一个整数，需要两个参数 (val, radix)，其中 radix 表示要解析的数字的基数。【该值介于 2 ~ 36 之间，并且字符串中的数字不能大于 radix 才能正确返回数字结果值】;
但此处 map 传了 3 个 (element, index, array),我们重写 parseInt 函数测试一下是否符合上面的规则。

```js
function parseInt(str, radix) {
  return str + '-' + radix
}
var a = ['1', '2', '3']
a.map(parseInt) // ["1-0", "2-1", "3-2"] 不能大于 radix
```

因为二进制里面，没有数字 3,导致出现超范围的 radix 赋值和不合法的进制解析，才会返回 NaN
所以["1", "2", "3"].map(parseInt) 答案也就是：[1, NaN, NaN]

## 下面这段代码输出结果是？

```js
var length = 10
function fn() {
  console.log(this.length)
}
var obj = {
  length: 5,
  method: function(fn) {
    fn()
    arguments[0]()
  }
}
obj.method(fn) // 10 1
obj.method(fn, 123) // 10 2
```

对于 this 的理解，常说的一句话是-- 谁调用它 this 就代表谁

对于 method 里面 fn 的理解， fn 是传参传出来的，这里 fn 的执行属于函数调用模式，this 就代表是全局对象 window

对 arguments\[0\]() 的理解:

arguments 这个伪数组对象存的传入的参数， arguments 也就是可以理解为 [fn,123,345..,...,] ,传入的参数组成数组,arguments\[0\]\(\) 属于方法调用模式，this 代表调用者，所以 this 代表 arguments ，执行 arguments[0]()也就是 arguments.fn(), this.length 代表 arguments 参数的个数

## 以下代码输出什么? 为什么

```js
var a = { n: 1 }
var b = a
a = { n: 2 }
a.x = a
console.log(a.x)
console.log(b.x)

var a = { n: 1 }
var b = a
a.x = a = { n: 2 }
console.log(a.x)
console.log(b.x)
```

对象是引用类型，改变赋值只是改变指针的引用。运算符=相当于改变指针的指向。

运算符的优先级。. > =。 即：在 a.x = a = {n:2};中，先给对象 a 添加 x 属性，再进行 a={n:2}与 a.x={n:2}两个赋值操作。

```js
// 变量a 指针指向对象 {n:1}
var a = { n: 1 }

// 变量b 指针指向对象 {n:1}
var b = a

// 变量b指针不变，仍指向{n:1}; 变量a指针改为指向对象 {n:2}
a = { n: 2 }

// 注意运算符的优先级。先给对象 a 增加 x 属性，再给 x 属性赋值。此时 x 属性的值指向 a 对象自身。即：a = {n:2,x:a}
a.x = a

console.log(a.x) // {n:2,x:a}

// 由于b指针没变，还是指向{n:1} ，故b.x: undefined
console.log(b.x)
```

```js
var a = { n: 1 }

// b与a的指针均指向 {n:1}
var b = a

// 注意运算符优先级`.` > `=`
// 先给 a 添加 x 属性。故添加 x 属性后，a 指向的对象{n:1}变为{n:1, x:undefined/待赋值}, 由于 b 是和a指向的同一个对象，所以此时b={n:1, x:undefined/待赋值}
// 然后再进行赋值操作。a.x = {n:2} ，故x属性的值为{n:2}，此时a=b={n:1,x:{n:2}
// 继续赋值操作。 a = {n:2}, a的指针由指向{n:1,x:{n:2} 变为指向对象 {n:2}
// a.x = a = {n:2} 理解
// js执行连等赋值语句之前，会取出变量的引用，也就是a.x 和a中a的引用都取出来并保存内存中，执行语句 a.x = a = {n:2} 时先对 a 进行a={n:2}赋值，此时a的引用地址改变指向对象{n:2}，从右到左，然后才是是a.x = a 赋值，而a.x 的a 被取出来的引用和b一样（前面说取出来放内存了），所以a.x = a ，相当于改变 b 引用的对象的x的属性，所以b.x 存的是 a的引用，b最终值为{n:1,x:{n:2}}。
a.x = a = { n: 2 }

// 此时a={n:2}, 故a.x 为 undefined
console.log(a.x)

// b指针始终没变，b={n:1,x:{n:2}}, 故b.x为{n:2}
console.log(b.x)
```

```js
var a = {
  n: 1
}
var b = a
a.x = a = {
  n: 2
}
console.log(a.x)
// --> undefined
console.log(b.x)
// {n: 2}
```

首先 a 指向了一个对象(A)，b 指向了 a 所指向的对象

之后由于 **.**是优先级最高的运算符，a 指向的对象新增了属性 x

之后，先执行 a={n:2},这时 a 指向的对象(B)发生了改变

接着执行 a.x = a,由于一开始先计算了 a.x, 对象(A)的属性 x 指向了对象(B)

## 写一个函数，列出一个整数所有的分解类型，比如对于数字 4，可以做拆分得到下列字符串

```text
1111
112
121
13
211
22
31
4
```

```js
function f() {
  var arr = Array.from(arguments)
  let before = arr.slice(0, arr.length - 1)
  let n = arr[arr.length - 1]
  for (let i = 1; i < n; i++) {
    f(...before, i, n - i)
  }
  console.log(arr)
}
```

## 写一个函数 isEmptyObject，判断一个对象是不是空对象

```js
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

// es5
function isEmptyObject(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false
  }

  return JSON.stringify(obj) === JSON.stringify({})
}
```

## 如下代码输出什么？ 解释原因

```js
var object1 = {
  valueOf: function() {
    return 1
  },
  toString: function() {
    return 'object1'
  }
}

var object2 = {
  valueOf: function() {
    return 2
  },
  toString: function() {
    return 'object2'
  }
}

alert((object2 > object1 + --object1) + true) //输出什么？ 解释原因
```

(object2 > object1 +-- object1) + true)

object1 和 object2 都是对象，所以运算的时候会调用 valueOf 方法，所以得到：
(2 > 1 + --1) + true)

--1 为前递减所以为 0，2 > 1 为 true 得到：
(true + 0) + true)

布尔值在运算时会自动转为数字 true -> 1 false -> 0
得到：
(1+ 0) + 1)

所以结果是 2

## 以下代码输出什么?

```js
function swap(x, y) {
  var temp = x
  x = y
  y = temp
}

var a = 1
var b = 2
swap(a, b)
console.log(a) //输出什么
console.log(b) //输出什么

var obj1 = { name: '1' }
var obj2 = { age: 2 }
swap(obj1, obj2)
console.log(obj1) //输出什么
console.log(obj2) //输出什么
```

ECMAScript 中的所有参数传递的都是值，不可能通过引用传递参数。

## 将对象的变量名由连字符式转为驼峰式，支持对象的深度遍历转换

```js
/**
 * 将对象的变量名由连字符式转为驼峰式，支持对象的深度遍历转换
 * @param obj JSON对象
 * @return JSON 驼峰式的JSON对象
 */
function obj2CamelCased(obj) {
  if (!(obj instanceof Object)) {
    return obj
  }

  var newObj = {}
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      //推荐在 for in 时，总是使用 hasOwnProperty 进行判断，没人可以保证运行的代码环境是否被污染过。
      var camelProp = prop.replace(/_([a-z])/g, function(g) {
        return g[1].toUpperCase()
      })
      if (obj[prop] instanceof Array) {
        //值为数组的处理
        newObj[camelProp] = []
        var oldArray = obj[prop]
        for (var k = 0, kLen = oldArray.length; k < kLen; k++) {
          newObj[camelProp].push(arguments.callee(oldArray[k]))
        }
      } else if (obj[prop] instanceof Object) {
        //值为对象的处理
        newObj[camelProp] = arguments.callee(obj[prop])
      } else {
        //值为字符串，或数字等的处理
        newObj[camelProp] = obj[prop]
      }
    }
  }
  return newObj
}
```

## JS 中的数组过滤 多条件多数据筛选

```js
//根据名字和年龄多元素筛选
export function multiFilter(array, filters) {
  const filterKeys = Object.keys(filters)
  // filters all elements passing the criteria
  return array.filter(item => {
    // dynamically validate all filter criteria
    return filterKeys.every(key => {
      //ignore when the filter is empty Anne
      if (!filters[key].length) return true
      return !!~filters[key].indexOf(item[key])
    })
  })
}
/*
 * 这段代码并非我原创，感兴趣的可以去原作者那里点个赞
 * 作者是：@author https://gist.github.com/jherax
 * 这段代码里我只加了一行，解决部分筛选条件清空时候整体筛选失效的问题
 */

var filters = {
  name: ['Leila', 'Jay'],
  age: []
}
/* 结果：
 * [{name: "Leila", age: 16, gender: "female"},
 *  {name: "Jay", age: 19, gender: "male"}]
 */
```

## 实现一个 get 函数，使得下面的调用可以输出正确的结果

```js
const obj = {
  selector: { to: { toutiao: 'FE Coder' } },
  target: [1, 2, { name: 'byted' }]
}

get(obj, 'selector.to.toutiao', 'target[0]', 'target[2].name')
// [ 'FE Coder', 1, 'byted']
```

```js
function get(data, ...args) {
  const reg = /\[[0-9]+\]/gi
  return args.map(item => {
    const paths = item.split('.')
    let res = data
    paths.map(path => {
      try {
        if (reg.test(path)) {
          const match = path.match(reg)[0]
          const cmd = path.replace(match, '')
          const arrIndex = match.replace(/[\[\]]/gi, '')
          res = res[cmd][arrIndex]
        } else {
          res = res[path]
        }
      } catch (err) {
        console.error(err)
        res = undefined
      }
    })
    return res
  })
}
```

```js
function get(data, ...args) {
  const res = JSON.stringify(data)
  return args.map(item =>
    new Function(`try {return ${res}.${item} } catch(e) {}`)()
  )
}

const obj = {
  selector: { to: { toutiao: 'FE Coder' } },
  target: [1, 2, { name: 'byted' }]
}

console.log(
  get(obj, 'selector.to.toutiao', 'target[0]', 'target[2].name', 'asd')
)
function get(data, ...args) {
  return args.map(item =>
    new Function('data', `try {return data.${item} } catch(e) {}`)(data)
  )
}
```

## JS 实现持续的动画效果

```js
// 定时器
var e = document.getElementById('e')
var flag = true
var left = 0
setInterval(() => {
  left == 0 ? (flag = true) : left == 100 ? (flag = false) : ''
  flag ? (e.style.left = ` ${left++}px`) : (e.style.left = ` ${left--}px`)
}, 1000 / 60)
// requestAnimationFrame
var e = document.getElementById('e')
var flag = true
var left = 0
function render() {
  left == 0 ? (flag = true) : left == 100 ? (flag = false) : ''
  flag ? (e.style.left = ` ${left++}px`) : (e.style.left = ` ${left--}px`)
}

;(function animloop() {
  render()
  requestAnimFrame(animloop)
})()
// 浏览器可以优化并行的动画动作，更合理的重新排列动作序列，并把能够合并的动作放在一个渲染周期内完成，从而呈现出更流畅的动画效果
// 解决毫秒的不精确性
// 避免过度渲染（渲染频率太高、tab 不可见暂停等等）
// 注：requestAnimFrame 和 定时器一样也头一个类似的清除方法 cancelAnimationFrame。

// 兼容性处理
window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()

let e = document.getElementById('e')
let flag = true
let left = 0

function render() {
  left === 0 ? (flag = true) : left == 100 ? (flag = false) : ''
  flag ? (e.style.left = ` ${left++}px`) : (e.style.left = ` ${left--}px`)
}

;(function animloop() {
  render()
  window.requestAnimFrame(animloop)
})()
```

## JS 题目之数组数据拆分重组转成嵌套对象

```js
// 求数组转换成jso
//['codeZh', 'codeCn', 'taobao.cn', 'taobao.com']
// 输出
/*
{ 
  'code':{Zh:'codeZh',Cn:'codeCn'},
  'taobao':{'.cn':'taobao.cn},'.com':'taobao.com'
}
*/

const resultObj = {}
let arr = ['codeZh', 'codeCn', 'taobao.cn', 'taobao.com']

let arrSplit = arr.map(item =>
  item.indexOf('.') !== -1
    ? item.replace(/(\.)/g, ',$1').split(',')
    : item.replace(/([A-Z])+/g, ',$1').split(',')
)

let arrGroup = arrSplit.map(item => ({
  [item[0]]: { [item[1]]: item.join('') }
}))

for (let i = 0; i < arrGroup.length; i++) {
  for (const [key, value] of Object.entries(arrGroup[i])) {
    resultObj[key] = {
      ...resultObj[key],
      ...value
    }
  }
}

console.log(arrSplit)
console.log(arrGroup)
console.log(resultObj)

const list = ['codeZh', 'codeCn', 'taobao.cn', 'taobao.com']
const result = list.reduce((map, item) => {
  const [head, tail] = item.split(/(?=[A-Z]|\.)/)
  map[head] = map[head] || {}
  map[head][tail] = item
  return map
}, {})
console.log(result)
```

## 转换驼峰命名

```js
/**
 * @param {String} variable
 * @returns {String} newVariable
 */
// 利用String.prototype.replace()
const toCamelCaseVar = variable =>
  variable.replace(/_+[a-zA-Z]/g, (m, i) => {
    if (i) {
      return m.match(/[a-zA-Z]/)[0].toUpperCase()
    }
    return m
  })
```

## 后端数据处理

```js
// {
//   rows: [
//     ["Lisa", 16, "Female", "2000-12-01"],
//     ["Bob", 22, "Male", "1996-01-21"]
//   ],
//   metaData: [
//     { name: "name", note: '' },
//     { name: "age", note: '' },
//     { name: "gender", note: '' },
//     { name: "birthday", note: '' }
//   ]
// }
// rows 是数据，metaData 是对数据的说明。现写一个函数 parseData，将上面的对象转化为期望的数组：

// [
//   { name: "Lisa", age: 16, gender: "Female", birthday: "2000-12-01" },
//   { name: "Bob", age: 22, gender: "Male", birthday: "1996-01-21" },
// ]

/**
 *
 * @param {Object} data
 * @returns {Array}
 */
const parseData = data =>
  data.rows.map(item => {
    const obj = {}
    for (let i = 0, len = item.length; i < len; i++) {
      obj[data.metaData[i].name] = item[i]
    }
    return obj
  })
```

## 将 JS 数组格式转换为树格式

将数组['A-->B-->C-->D-->E', 'A-->B-->C-->D-->F', 'A-->F-->C-->D-->E']转换为树结构

```js
function Node(id) {
  this.id = id
  this.children = [] // array
}

Node.prototype.getChild = function(id) {
  var node
  this.children.some(function(n) {
    if (n.id === id) {
      node = n
      return true
    }
  })
  return node
}

var path = ['A-->B-->C-->D-->E', 'A-->B-->C-->D-->F', 'A-->F-->C-->D-->E'],
  tree = new Node('root')

path.forEach(function(a) {
  var parts = a.split('-->')
  parts.reduce(function(r, b) {
    var node = r.getChild(b)
    if (!node) {
      node = new Node(b)
      r.children.push(node)
    }
    return node
  }, tree)
})

console.log(tree)

function Node(id) {
  this.id = id
  this.children = {} // object
}

var path = ['A-->B-->C-->D-->E', 'A-->B-->C-->D-->F', 'A-->F-->C-->D-->E'],
  tree = new Node('root')

path.forEach(function(a) {
  var parts = a.split('-->')
  parts.reduce(function(r, b) {
    if (!r.children[b]) {
      r.children[b] = new Node(b)
    }
    return r.children[b]
  }, tree)
})

console.log(tree)
```

## 旋转城市字母

```
['Tokyo', 'London', 'Rome', 'Donlon', 'Kyoto', 'Paris']
// YOUR ALGORITHM
[
    [ 'Tokyo', 'Kyoto' ],
    [ 'London', 'Donlon' ],
    [ 'Rome' ],
    [ 'Paris' ]
]
```

旋转每个城市的字母，可能会或可能不匹配另一个城市,将它们放在一个数组中。

要点：字母一个接一个地旋转。Tokyo matches only with: okyoT, kyoTo, yoTok, oToky.

```js
const getWordRotations = word =>
  [...word].reduce(
    acc => [acc[0].substring(1) + acc[0].substring(0, 1), ...acc],
    [word]
  )

const groupCitiesByRotatedNames = cities =>
  cities.reduce((acc, city) => {
    const cityGroup = acc.find(item =>
      getWordRotations(city.toLowerCase()).includes(item[0].toLowerCase())
    )

    cityGroup
      ? acc.splice(acc.indexOf(cityGroup), 1, [...cityGroup, city])
      : acc.push([city])

    return acc
  }, [])

const test = groupCitiesByRotatedNames([
  'Tokyo',
  'London',
  'Rome',
  'Donlon',
  'Kyoto',
  'Paris'
])

console.log('test', test)
```

## 查找不同顺序排列的字符串

需求描述：从一组数组中找出一组按不同顺序排列的字符串的数组元素。假如有这样一个数组：

```js
;['abcd', 'hello', 'bdca', 'olleh', 'cadb', 'nba', 'abn', 'abc']
```

需要找出的结果是：

```js
;['abcd', 'bdca', 'cadb']
```

关键点是判断一组字符串是否是否只是字符的顺序不同

方法 1 采用了遍历字符串中的每一个字符，然后将单个的字符转换成 Unicode 编码，对编码进行取和的计算，abcd 和 bdca 的编码和会是一致的。最后用编码和作为对象的 key 来保存编码和一致的字符串。

方法 1 需要注意的是，字符串“ad”和“bc”的 Unicode 编码和是一样的，此时需要多加一个判断，检测任意一个字符串中的第一个字符是否有出现在另一个字符串中出现过即可。

```js
let stringClassify = function(arr) {
  let arrLength = arr.length
  let obj = {}
  let name
  let firstItem

  for (let i = 0; i < arrLength; i++) {
    let item = arr[i]
    let strLength = item.length
    let num = 0
    // 将单个的字符转换成 Unicode 编码
    // 对编码进行取和计算
    for (let j = 0; j < strLength; j++) {
      num += item.charCodeAt(j)
    }
    if (!firstItem) {
      firstItem = item
      obj[num].push(item)
    } else if (~firstItem.indexOf(item.charAt(0))) {
      // 通过检测待添加的字符串的第一个字符是否
      // 在另一个字符串中出现以避免将下面的情况
      // [ 'ad', 'da', 'bc' ]
      obj[num].push(item)
    }
    for (name in obj) {
      console.log(obj[name])
    }
  }
}
```

方法 2 是将字符串转换成数组后再对数组进行 sort 排序，abcd 和 bdca 使用 sort 排序后会变成 abcd，将拍好序的字符串作为对象的 key 来保存排序一致的字符串。

```js
let stringClassify = function() {
  let arrLength = arr.length
  let obj = {}
  for (let i = 0; i < arrLength; i++) {
    let item = arr[i]
    let strArr = arr[i].split('')
    let newStr = strArr.sort().join('')

    if (!obj[newStr]) {
      obj[newStr] = []
    }
    obj[newStr].push(item)
  }
  for (name in obj) {
    console.log(obj[name])
  }
}
```

其实两种方法的原理都是通过将字符转换成 Unicode 编码，只是方法 1 是显式的转换，而方法 2 中用到的 sort 排序，会隐式的转换

## 比较数组或对象的内容是否相同

因为在 JS 中引用类型的==或===操作符只是判断两个引用类型是否是同一个对象引用。JavaScript 没有内置的操作符判断对象的内容是否相同。

```js
// Warn if overriding existing method
if (Array.prototype.equals) {
  console.warn(
    "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
  )
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
  // if the other array is a falsy value, return
  if (!array) return false

  // compare lengths - can save a lot of time
  if (this.length !== array.length) return false

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false
    } else if (this[i] !== array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false
    }
  }
  return true
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', { enumerable: false })
```

```js
Object.prototype.equals = function(object2) {
  //For the first loop, we only check for types
  for (propName in this) {
    //Check for inherited methods and properties - like .equals itself
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    //Return false if the return value is different
    if (this.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
      return false
    }
    //Check instance type
    else if (typeof this[propName] !== typeof object2[propName]) {
      //Different types => not equal
      return false
    }
  }
  //Now a deeper check using other objects property names
  for (propName in object2) {
    //We must check instances anyway, there may be a property that only exists in object2
    //I wonder, if remembering the checked values from the first loop would be faster or not
    if (this.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
      return false
    } else if (typeof this[propName] !== typeof object2[propName]) {
      return false
    }
    //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
    if (!this.hasOwnProperty(propName)) continue

    //Now the detail check and recursion

    //This returns the script back to the array comparing
    /**REQUIRES Array.equals**/
    if (this[propName] instanceof Array && object2[propName] instanceof Array) {
      // recurse into the nested arrays
      if (!this[propName].equals(object2[propName])) return false
    } else if (
      this[propName] instanceof Object &&
      object2[propName] instanceof Object
    ) {
      // recurse into another objects
      //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
      if (!this[propName].equals(object2[propName])) return false
    }
    //Normal value comparison for strings and numbers
    else if (this[propName] !== object2[propName]) {
      return false
    }
  }
  //If everything passed, let's say YES
  return true
}
```

## 用 JavaScript 在一个数组中插入另一个数组

给一个数组, 将另一个数组插入其指定位置, 用 ES5 和 ES6 语法分别如何实现.

### ES6

使用 ES6 中的 Spread 操作符...

```js
// 原数组
let a = [3, 4]
// 要插入的数组
let b = [1, 2]
// 要插入的位置
let index = 1
// 插入

a.splice(index, 0, ...b)
```

### ES5

ES5 利用 apply：可以实现将参数用数组的方式绑定到执行的方法上面。

将所有需要的参数放进一个数组里面,然后用 apply

```js
// 原数组
let a = [3, 4]
// 要插入的数组
let b = [1, 2]
// 要插入的位置
let index = 1
a.splice.apply(a, [index, 0].concat(b))
```

## 字符串（大数字）计算相加并转换成字符串

```js
const s1 = '712569312664357328695151392'
const s2 = '8100824045303269669937'

// 将字符串倒序并输出数值数组
function strToArrRvs(str) {
  return str
    .split('')
    .map(x => +x)
    .reverse()
}

function addStr(a, b) {
  const [h, l] = (a.length > b.length ? [a, b] : [b, a]).map(strToArrRvs)
  // 用相对位数更多的字符串调用reduce
  return h.reduce(
    ([digit, tail], cur, idx, arr) => {
      const sum = cur + digit + (l[idx] || 0)
      // 如果遍历完成 直接输出结果, 否则输出数组用于下一次迭代
      return idx === arr.length - 1
        ? sum + tail
        : [+(sum >= 10), (sum % 10) + tail]
    },
    [0, '']
  )
}

addStr('712569312664357328695151392', '8100824045303269669937')
// "712577413488402631964821329"
```

```js
String.prototype.reverse = function() {
  return this.split('')
    .reverse()
    .join('')
}
function sumStrings(a, b) {
  a = a.reverse()
  b = b.reverse()
  var carry = 0
  var index = 0
  var sumDigits = []
  while (index < a.length || index < b.length || carry != 0) {
    var aDigit = index < a.length ? parseInt(a[index]) : 0
    var bDigit = index < b.length ? parseInt(b[index]) : 0
    var digitSum = aDigit + bDigit + carry
    sumDigits.push((digitSum % 10).toString())
    carry = Math.floor(digitSum / 10)
    index++
  }
  sumDigits.reverse()
  while (sumDigits[0] == '0') sumDigits.shift()
  return sumDigits.join('')
}
```

```js
function add(a, b) {
  let lenA = a.length,
    lenB = b.length,
    len = lenA > lenB ? lenA : lenB

  // 先补齐位数一致
  if (lenA > lenB) {
    for (let i = 0; i < lenA - lenB; i++) {
      b = '0' + b
    }
  } else {
    for (let i = 0; i < lenB - lenA; i++) {
      a = '0' + a
    }
  }

  let arrA = a.split('').reverse(),
    arrB = b.split('').reverse(),
    arr = [],
    carryAdd = 0

  for (let i = 0; i < len; i++) {
    let temp = Number(arrA[i]) + Number(arrB[i]) + carryAdd
    arr[i] = temp > 9 ? temp - 10 : temp
    carryAdd = temp >= 10 ? 1 : 0
  }

  if (carryAdd === 1) {
    arr[len] = 1
  }

  return arr.reverse().join('')
}
```

## 判断变量类型

使用`typeof`和`instanceof`的弊端：

typeof 能够正确的判断基本数据类型，但是除了 null, typeof null 输出的是对象。但是对象来说，typeof 不能正确的判断其类型， typeof 一个函数可以输出 'function',而除此之外，输出的全是 object,这种情况下，我们无法准确的知道对象的类型。

typeof Symbol() 用 typeof 获取 symbol 类型的值得到的是 symbol

instanceof 可以准确的判断复杂数据类型，但是不能正确判断基本数据类型。

```javascript
let obj = {}
let arr = []

console.log(typeof obj === 'object') // true
console.log(typeof arr === 'object') // true
console.log(typeof null === 'object') // true
```

使用  `Object.prototype.toString.call([]) === "[object Array]"` 来进行判断。

## NaN

JS 中的一种特殊数值，其类型是 Number,通过 Number.isNaN() 来判断。

## 浮点数计算

JS 中的 number 类型为浮点型，采用 IEEE-754 格式，有舍入误差。

### 保证浮点数计算的正确性

先升幂再降幂:

```javascript
function add(num1, num2) {
  let r1
  let r2
  let m

  r1 = ('' + num1).split('.')[1].length
  r2 = ('' + num2).split('.')[1].length
  m = Math.pow(10, Math.max(r1, r2))
  return (num1 * m + num2 * m) / m
}
```

## 设置一个对象属性

设置对象属性时，JavaScript 将隐式地字符串化参数值。在这种情况下，由于 b 和 c 都是对象，它们都将被转换为“[object Object]”。结果，a[b] 和 a [c] 都等同于[“[object Object]”] 并且可以互换使用。因此，设置或引用[c]与设置或引用[b]完全相同。

```javascript
var a = {}
var b = { key: 'b' }
var c = { key: 'c' }

a[b] = 123
a[c] = 456

console.log(a[b]) // 456
```

## 遍历 DOM 元素

```javascript
function Traverse(p_element, p_callback) {
  p_callback(p_element)
  let list = p_element.children
  for (let i = 0; i < list.length; i++) {
    Traverse(list[i], p_callback)
  }
}
```

## 综合 JS 题目

```javascript
function Foo() {
  getName = function() {
    alert(1)
  }
  return this
}
Foo.getName = function() {
  alert(2)
}
Foo.prototype.getName = function() {
  alert(3)
}
var getName = function() {
  alert(4)
}
function getName() {
  alert(5)
}

Foo.getName() //2
getName() //4
Foo().getName() //1
getName() //1
new Foo.getName() //2
new Foo().getName() //3
new new Foo().getName() //3
```

```js
// 代码编译后如下
function Foo() {
  getName = function() {
    console.log(1)
  }
  return this
}
function getName() {
  console.log(5)
} //函数优先(函数首先被提升)
var getName //重复声明，被忽略
Foo.getName = function() {
  console.log(2)
}
Foo.prototype.getName = function() {
  console.log(3)
}
getName = function() {
  console.log(4)
}
```

1. 访问 Foo 函数上存储的静态属性；
2. 直接调用 getName 函数，变量声明提升，函数表达式；
3. 第三问的  Foo().getName();  先执行了 Foo 函数，然后调用 Foo 函数的返回值对象的 getName 属性函数。

   Foo 函数的第一句   getName = function () { alert (1); };  是一句函数赋值语句，注意它没有 var 声明，所以先向当前 Foo 函数作用域内寻找 getName 变量，没有。再向当前函数作用域上层，即外层作用域内寻找是否含有 getName 变量；this 指向 window 对象；window 中的 getName 已经被修改为 alert(1)，所以最终会输出 1。

4. 直接调用 getName 函数，相当于  window.getName() ，输出 1。
5. 考察 JS 的运算符优先级[运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)，表达式相当于 ` new`` (Foo.getName)() `实际上将 getName 函数作为了构造函数来执行，遂弹出 2。
6. 表达式相当于  ` (``new`` Foo()).getName() ` ,构造函数的返回值：
7. 没有返回值返回实例化对象。
8. 若有返回值则检查其返回值是否为**引用类型**。如果是非引用类型，如基本类型（string,number,boolean,null,undefined）则与无返回值相同，实际返回其实例化对象。
9. 若返回值是引用类型，则实际返回值为这个引用类型。

   调用实例化对象的 getName 函数，因为在 Foo 构造函数中没有为实例化对象添加任何属性，遂到当前对象的原型对象（prototype）中寻找 getName ，输出 3。

10. 表达式相当于  ` new`` ((``new`` Foo()).getName)() `  先初始化 Foo 的实例化对象，然后将其原型上的 getName 函数作为构造函数再次 new，输出 3。

## 海量数据加载

1. 分时函数
2. requestAnimationFrame

## 10 个 Ajax 同时发起请求，全部返回展示结果，并且至多允许三次失败，说出设计思路

```javascript
// Promise 写法
let errorCount = 0
let p = new Promise((resolve, reject) => {
  if (success) {
    resolve(res.data)
  } else {
    errorCount++
    if (errorCount > 3) {
      // 失败次数大于3次就应该报错了
      reject(error)
    } else {
      resolve(error)
    }
  }
})
Promise.all([p]).then(v => {
  console.log(v)
})
```

## 基于 localStorage 设计一个 1M 的缓存系统，需要实现缓存淘汰机制

设计思路如下：

- 存储的每个对象需要添加两个属性：分别是过期时间和存储时间。
- 利用一个属性保存系统中目前所占空间大小，每次存储都增加该属性。当该属性值大于 1M 时，需要按照时间排序系统中的数据，删除一定量的数据保证能够存储下目前需要存储的数据。
- 每次取数据时，需要判断该缓存数据是否过期，如果过期就删除。

```javascript
class Store {
  constructor() {
    let store = localStorage.getItem('cache')
    if (!store) {
      store = {
        maxSize: 1024 * 1024,
        size: 0
      }
      this.store = store
    } else {
      this.store = JSON.parse(store)
    }
  }
  set(key, value, expire) {
    this.store[key] = {
      date: Date.now(),
      expire,
      value
    }
    let size = this.sizeOf(JSON.stringify(this.store[key]))
    if (this.store.maxSize < size + this.store.size) {
      console.log('超过缓存大小')
      var keys = Object.keys(this.store)
      // 时间排序
      keys = keys.sort((a, b) => {
        let item1 = this.store[a]
        let item2 = this.store[b]
        return item2.date - item1.date
      })
      while (size + this.store.size > this.store.maxSize) {
        let index = keys[keys.length - 1]
        this.store.size -= this.sizeOf(JSON.stringify(this.store[index]))
        delete this.store[index]
      }
    }
    this.store.size += size

    localStorage.setItem('cache', JSON.stringify(this.store))
  }
  get(key) {
    let d = this.store[key]
    if (!d) {
      console.log('找不到该属性')
      return
    }
    if (d.expire > Date.now) {
      console.log('过期删除')
      delete this.store[key]
      localStorage.setItem('cache', JSON.stringify(this.store))
    } else {
      return d.value
    }
  }
  sizeOf(str, chartSet) {
    let total = 0
    let charCode
    let i
    let len
    let chartSet = chartSet ? chartSet.toLowerCase() : ''
    if (charset === 'utf-16' || charset === 'utf16') {
      for (i = 0, len = str.length; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode <= 0xffff) {
          total += 2
        } else {
          total += 4
        }
      }
    } else {
      for (i = 0, len = str.length; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode <= 0x007f) {
          total += 1
        } else if (charCode <= 0x07ff) {
          total += 2
        } else if (charCode <= 0xffff) {
          total += 3
        } else {
          total += 4
        }
      }
    }
    return total
  }
}
```

## 实现一个函数能做到 function add(1)(2)(3) //6，达到 function add(1)(2)(3)...(n)

这里要引生出来俩个 js 内置的方法，`valueOf`和`toString`方法，在特定的情况下，这俩个方法都会自动调用，而且在用户定义了新的 valueof 和 tostring 的时候，会优先执行新的方法。

在做字符串拼接等需要调用 tostring()方法的是有优先调用 toString(),如果调用后还是不能返回原始类型的话会继续调用 valueOf 方法。而在做类似 number 的运算的时候会优先调用 valueOf().

而对于函数而言，add 和 add()的返回是不一样的。add()会返回 return 的值。而 add 则会调用 valueOf 答应出来函数本身的代码.函数的转换类似于 number。

```js
function add () {var args = [].slice.call(arguments);//这里也用到了闭包的概念对 args 的存储
```

```javascript
var fn = function () {
    var arg_fn = [].slice.call(arguments); //这里的递归是为了合并参数
    return add.apply(null, args.concat(arg_fn));
}

fn.valueOf = function() {
    return args.reduce((a, b) => a + b);//真正的输出是valueof
}
return fn;
}
```

## 解析 url 后的参数

```javascript
function parseParam(url) {
  let obj = {}
  let arr = url.split('?')
  if (arr.length == 1) {
    //判断没有问号
    return '无参数'
  }
  let total = arr[1].split('&')
  for (let i = 0; i < total.length; i++) {
    let single = total[i].split('=')
    if (single[0] == '') {
      //判断有？但是没有参数
      return '无参数'
    }
    if (!single[1]) {
      obj[single[0]] = true
    } else {
      if (obj[single[0]]) {
        let concat
        if (!Array.isArray(obj[single[0]])) {
          //判断是否数组
          concat = [obj[single[0]]]
        } else {
          concat = obj[single[0]]
        }
        concat.push(single[1])
        concat = new Set(concat)
        concat = Array.from(concat) //数组去重
        obj[single[0]] = concat
      } else {
        obj[single[0]] = decodeURI(single[1]) //进行转码
      }
    }
  }
  return obj
}

var url =
  'http://www.baidu.com/?user=huixin&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled'

var params = parseParam(url)

console.log(params)
```

## 实现一个简单的模版引擎：

列：我叫 a,年龄 b，性别 c； let data = { name: '小明', age: 18, } 没有定义的返回 undefined

```javascript
let template = '我是{name}，年龄{age}，性别{sex}'
let data = {
  name: '小明',
  age: 18
}
const reg = /({([a-zA-Z]+)})/g
var r = '',
  regrounp = {}
while ((r = reg.exec(template))) {
  Object.defineProperty(regrounp, r[2], {
    enumerable: true,
    value: r[2]
  })
}

var render = (template, regrounp) => {
  var result = ''
  for (key in regrounp) {
    if (data[key] == undefined) {
      result = (result || template).replace(
        new RegExp(`{${regrounp[key]}}`, 'g'),
        undefined
      )
    } else {
      result = (result || template).replace(
        new RegExp(`{${regrounp[key]}}`, 'g'),
        data[key]
      )
    }
  }
  return result
}
let newtemple = render(template, regrounp)
console.log(newtemple) // 结果： 我是小明，年龄18，性别undefined
```

## 如何快速让字符串变成已千为精度的数字

```javascript
function exchange(num) {
  num += '' //转成字符串
  if (num.length <= 3) {
    return num
  }

  num = num.replace(/\d{1,3}(?=(\d{3})+$)/g, v => {
    console.log(v)
    return v + ','
  })
  return num
}

console.log(exchange(1234567))
```

## 实现 destructuringArray 方法，达到如下效果

[destructuringArray](https://juejin.im/post/5a969571f265da4e8c453be4?utm_source=gold_browser_extension)

// destructuringArray( [1,[2,4],3], "[a,[b],c]" );
// result
// { a:1, b:2, c:3 }

```text
[1,[2,4],3], "[a,[b],c]" ==> {a:1,b:2,c:3}
[1,[2,3,[4]]], "[react,[vue,rxjs,[angular]]]" ==> {react:1,vue:2,rxjs:3,angular:4}
[1,[2,4],3], "[a,[[b],c]" ==> Error: too many left square brackets
[1,[2,4],3], "[a,[b]],c]" ==> Error: too many right square brackets ==>pos:9
[1,[2,4],3], "[33a,[b],c]" ==> Error: key is invalid varible => 33a
[1,[2,4],3], "[re[a]ct,[b],c]" ==> Error: invalid string==>pos:3
[1,[2,4],3], "rx,[react,[b],c]" ==> Error: template with invalid start or end
[1,[2,4],3], "[react,[b],c],rx" ==> Error: template with invalid start or end
```

### 需要通过 threshold 参数控制调用函数频率

```js
const yourFunction = function(func, threshold) {
  // 请实现
}
const triggerSearch = yourFunction(val => {
  const { onSearch } = this.props
  onSearch(val)
}, 300)
triggerSearch(searchText)
```

```js
// 第一题

const targetArray = [1, [2, 3], 4]

const formater = '[a, [b], c]'

const formaterArray = ['a', ['b'], 'c']

const destructuringArray = (values, keys) => {
  try {
    const obj = {}

    if (typeof keys === 'string') {
      keys = JSON.parse(keys.replace(/\w+/g, '"$&"'))
    }

    const iterate = (values, keys) =>
      keys.forEach((key, i) => {
        if (Array.isArray(key)) iterate(values[i], key)
        else obj[key] = values[i]
      })

    iterate(values, keys)

    return obj
  } catch (e) {
    console.error(e.message)
  }
}

console.dir(destructuringArray(targetArray, formater))

console.dir(destructuringArray(targetArray, formaterArray))

// 第二题

const yourFunction = function(func, threshold) {
  let timeOut

  return function() {
    if (!timeOut) {
      timeOut = setTimeout(() => {
        timeOut = null

        func.apply(this, arguments)
      }, threshold)
    }
  }
}

const triggerSearch = yourFunction(val => {
  const { onSearch } = this.props

  onSearch(val)
}, 300)

triggerSearch(searchText)
```

## 如果要写实现一个抢红包页面，如何防止有人恶意一直玩抢红包或者发包模拟抢红包请求（网易）

个人思路：

1、判断一段时间内同一个 IP 的请求数量

2、设置验证码

3、看页面访问顺序，一般有一个入口页面再是抢红包页面。恶意发包可能是直接的页面请求

4、达到一定次数或者红包额度，直接丢包

## 计算鼠标停留时间

```html
<div class="mod-spm" data-spmid="123">
  <div class="child_a"></div>
  <div class="child_b"></div>
  <div class="child_c"></div>
  <div class="child_d"></div>
</div>
<div class="mod-spm" data-spmid="456">
  <div class="child_a"></div>
  <div class="child_b"></div>
  <div class="child_c"></div>
  <div class="child_d"></div>
</div>
<div class="mod-spm" data-spmid="789">
  <div class="child_a"></div>
  <div class="child_b"></div>
  <div class="child_c"></div>
  <div class="child_d"></div>
</div>
```

```css
.mod-spm[data-spmid='123'] {
  width: 100px;
  height: 100px;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 20px;
  background-color: #fff;
  border: 2px #000 solid;
}
.mod-spm[data-spmid='456'] {
  width: 100px;
  height: 100px;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 20px;
  background-color: #fff;
  border: 2px #000 solid;
}
.mod-spm[data-spmid='789'] {
  width: 100px;
  height: 100px;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 20px;
  background-color: #fff;
  border: 2px #000 solid;
}
```

```js
function ShowStayTime(obj) {
  this.obj = obj
  this.totalTime = 0
  this.enterTime = null
  this.divTime = document.createElement('div')
}
ShowStayTime.prototype = {
  constructor: ShowStayTime,
  init: function() {
    this.showStayTime()
    this.obj.appendChild(this.divTime)
    this.beginTime()
    this.leaveTime()
  },
  showStayTime: function() {
    var message = ''
    message = '停留时间' + this.totalTime + 'ms'
    this.divTime.innerText = message
  },
  beginTime: function() {
    this.obj.addEventListener('mouseenter', function() {
      this.enterTime = new Date()
    })
  },
  leaveTime: function() {
    var temp = this
    this.obj.addEventListener('mouseleave', function() {
      temp.totalTime += new Date().getTime() - this.enterTime.getTime()
      temp.showStayTime()
    })
  }
}
var divs = document.getElementsByClassName('mod-spm')
var show1 = new ShowStayTime(divs[0])
var show2 = new ShowStayTime(divs[1])
var show3 = new ShowStayTime(divs[2])
show1.init()
show2.init()
show3.init()
```

## 用二分查找实现  `indexOf`  方法，不允许用递归

## Object.defineProperty()和 {} 出来的对象有什么区别

## 数组有一个 length 字段，每个 api 操作 length 字段都会改变，你觉得如果让你来实现这个字段，你认为怎么处理是最优的方案

从这里我可能会引申到计算属性的实现、ES6 中，Map/Set 等数据结构的理解，如果聊得比较投机，甚至会涉及到更多基础数据结构的相互探讨，因为大多数前端对数据结构不太重视，所以如果能够聊到这里，基本上就超级加分了

## map、forEach、reduce ... 你有经常使用吗？

Q: 这些方法为什么会传入函数作为参数，你有想过如何实现吗？

如果这里回答上来了会瞬间加分，因为我就可以进一步跟他聊高阶函数以及函数式编程

## es5 实现 const

## ajax 和 axios 的不同

## 什么是尾递归

## webStorage 如果存储满了会怎么样（报错）

## 如何获取一个 div 下所有的文本节点

## 为什么不同浏览器渲染出来的东西会有差别，本质是什么

## requestAnimationFrame 和 setTimeout 写动画的区别

在 requestAnimationFrame 之前，我们主要使用 setTimeout/setInterval 来编写 JS 动画。

编写动画的关键是循环间隔的设置，一方面，循环间隔足够短，动画效果才能显得平滑流畅；另一方面，循环间隔还要足够长，才能确保浏览器有能力渲染产生的变化。

大部分的电脑显示器的刷新频率是 60HZ，也就是每秒钟重绘 60 次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会提升。因此，最平滑动画的最佳循环间隔是 1000ms / 60 ，约为 16.7ms。

setTimeout/setInterval 有一个显著的缺陷在于时间是不精确的，setTimeout/setInterval 只能保证延时或间隔不小于设定的时间。因为它们实际上只是把任务添加到了任务队列中，但是如果前面的任务还没有执行完成，它们必须要等待。

requestAnimationFrame 才有的是系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；也不会因为间隔时间太长，使用动画卡顿不流畅，让各种网页动画效果能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。

综上所述，requestAnimationFrame 和 setTimeout/setInterval 在编写动画时相比，优点如下:

1. requestAnimationFrame 不需要设置时间，采用系统时间间隔，能达到最佳的动画效果。
2. requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成。
3. 当 requestAnimationFrame() 运行在后台标签页时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命（大多数浏览器中）。

## 如何实现小于 12px 的字体效果

## 数组去重怎么做，如果是数组是这样的[1,[2],[3]]，该如何去重

## 写一个函数 实现 test(a)(b),如果 b>0 返回 a+b，如果 b<0,返回 a-b（柯里化考察）

```js
function test() {
  var a = [...arguments][0]
  return function() {
    var b = [...arguments][0]
    if (b > 0) {
      return a + b
    } else {
      return a - b
    }
  }
}
```

## 实现链式调用

```js
coder
  .sleep()
  .print1()
  .print2()
class Coder {
  sleep() {
    console.log('sleep')
    return this //链式调用的关键
  }
  print1() {
    console.log(1)
    return this //链式调用的关键
  }
  print2() {
    console.log(2)
    return this //链式调用的关键
  }
}
```

如果 sleep 函数要等待 3 秒钟再打印然后在执行之后的操作呢？

```js
class Coder {
  sleep() {
    var date = new Date()
    while (new Date() - date < 3000) {
      //通过这里进行阻塞 sleep
    }
    console.log('sleep')
    return this //链式调用的关键
  }
  print1() {
    console.log(1)
    return this //链式调用的关键
  }
  print2() {
    console.log(2)
    return this //链式调用的关键
  }
}
var b = new Coder()
b.sleep()
  .print1()
  .print2()
```

## 实现一个 div 滑动的动画，由快至慢 5s 结束（不准用 css3)。

## 页面内有一个 input 输入框，实现在数组 arr 查询命中词并要求 autocomplete 效果。

## 实现一个带并发数限制的 fetch 请求函数

可以批量请求数据，所有的 URL 地址在 urls 参数中，同时可以通过 max 参数控制请求的并发度，当所有请求结束之后，需要执行 callback 回调函数。

```js
const sendRequest = (urls, max, callback) => {
  let finished = 0
  const total = urls.length
  const handler = () => {
    if (urls.length) {
      const url = urls.shift()
      fetch(url)
        .then(() => {
          finished += 1
          handler()
        })
        .catch(e => {
          throw Error(e)
        })
    }
    if (finished >= total) {
      callback()
    }
  }
  for (let i = 0; i < max; i++) {
    handler()
  }
}
const urls = Array.from({ length: 10 }, (v, k) => k)

const fetch = function(idx) {
  return new Promise(resolve => {
    console.log(`start request ${idx}`)
    const timeout = parseInt(Math.random() * 1e4)
    setTimeout(() => {
      console.log(`end request ${idx}`)
      resolve(idx)
    }, timeout)
  })
}

const max = 4

const callback = () => {
  console.log('run callback')
}

sendRequest(urls, max, callback)
```

## 手写 parseInt 的实现

```js
{
  function _parseInt(string, radix) {
    if (typeof string !== 'string' && typeof string !== 'number') return NaN
    if (
      radix &&
      (typeof radix !== 'number' ||
        /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/.test(radix) ||
        radix > 36 ||
        radix < 2)
    )
      return NaN
    string = String(string)
    var rexp =
        radix == 10 ? /(-?)([0]?)([0-9]+)/ : /(-?)([0]?[Xx]?)([0-9a-fA-F]+)/,
      a = string.match(rexp),
      sign = a[1],
      rawRadix = a[2],
      rawNum = a[3],
      result = 0,
      strArr = rawNum.split(''),
      len = strArr.length,
      numArr = []
    if (a && !radix) {
      if (rawRadix.toUpperCase() === '0X') {
        radix = 16
      } else if (rawRadix === '0') {
        radix = 8
      } else {
        radix = 10
      }
    }
    for (var i = 0; i < len; i++) {
      var num
      var charCode = strArr[i].toUpperCase().charCodeAt(0)
      if (radix <= 36 && radix >= 11) {
        if (charCode >= 65 && charCode <= 90) {
          num = charCode - 55
        } else {
          num = charCode - 48
        }
      } else {
        num = charCode - 48
      }
      if (num < radix) {
        numArr.push(num)
      } else {
        return NaN
      }
    }
    if (numArr.length > 0) {
      numArr.forEach(function(item, j) {
        result += item * Math.pow(radix, numArr.length - j - 1)
      })
    }
    if (sign === '-') {
      result = -result
    }
    return result
  }
  // 以下例子均返回15:
  console.log(_parseInt('F', 16))
  console.log(_parseInt('17', 8))
  console.log(_parseInt('15', 10))
  console.log(_parseInt(15.99, 10))
  console.log(_parseInt('FXX123', 16))
  console.log(_parseInt('1111', 2))
  console.log(_parseInt('15*3', 10))
  console.log(_parseInt('12', 13))

  // 以下例子均返回 NaN:
  console.log(_parseInt('Hello', 8))
  // Not a number at all
  console.log(_parseInt('546', 2))
  // Digits are not valid for binary representations

  // 以下例子均返回 -15：
  console.log(_parseInt('-F', 16))
  console.log(_parseInt('-0F', 16))
  console.log(_parseInt('-0XF', 16))
  console.log(_parseInt(-15.1, 10))
  console.log(_parseInt(' -17', 8))
  console.log(_parseInt(' -15', 10))
  console.log(_parseInt('-1111', 2))
  console.log(_parseInt('-15e1', 10))
  console.log(_parseInt('-12', 13))
  // 下例中也全部返回 17，因为输入的 string 参数以 "0x" 开头时作为十六进制数字解释，而第二个参数假如经过 Number 函数转换后为 0 或 NaN，则将会忽略。
  console.log(_parseInt('0x11', 16))
  console.log(_parseInt('0x11', 0))
  console.log(_parseInt('0x11'))

  // 下面的例子返回 224
  console.log(_parseInt('0e0', 16))
}
```

## 常见的内存泄露

全局变量，未清除的定时器，闭包，以及 dom 的引用等。

## 实现一个函数，将给定数组[1,2,2,3,3,3,4]输出成[[2, 2], [3,3,3]](如果相邻的数字是重复的，放在一个数组里)？

```js
function fooRe(arr) {
  return arr.reduce((h, m, i, a) => {
    if (h.length === 0) {
      var itemArr = []
      itemArr.push(m)
      h.push(itemArr)
    } else if (h[h.length - 1].indexOf(m) > -1) {
      h[h.length - 1].push(m)
    } else {
      if (h[h.length - 1].length === 1) {
        h.splice(h.length - 1, 1)
      }
      if (i === a.length - 1) {
        return h
      }
      var itemArr = []
      itemArr.push(m)
      h.push(itemArr)
    }
    return h
  }, [])
}
```

## 实现一个 person.execute().sleep(3000)过 3000ms 之后执行 execute 方法？如果没有 execute 方法直接执行 sleep 也要实现和刚才一样的效果，怎么实现？

```js
// machine('ygy').execute()
// start ygy
// machine('ygy').do('eat').execute();
// start ygy
// ygy eat
// machine('ygy').wait(5).do('eat').execute();
// start ygy
// wait 5s（这里等待了5s）
// ygy eat
// machine('ygy').waitFirst(5).do('eat').execute();
// wait 5s
// start ygy
// ygy eat
// 和这个题类似。
// 答案
function machine(name) {
  return new Person(name)
}

class Person {
  constructor(name) {
    this.name = name
    this.list = ['']
  }
  async execute() {
    const str = `start ${this.name}`
    if (!this.list[0]) {
      console.log(str)
    } else {
      this.list.splice(1, 0, () => {
        return new Promise(resolve => {
          setTimeout(() => {
            console.log(str)
            resolve()
          }, 0)
        })
      })
    }
    if (this.list.length !== 0) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i]) {
          await this.list[i]()
        }
      }
    }
  }
  do(type) {
    this.list.push(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`${this.name} ${type}`)
          resolve()
        }, 0)
      })
    })
    return this
  }
  wait(num) {
    this.list.push(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`wait ${num}s`)
          resolve()
        }, num * 1000)
      })
    })
    return this
  }
  waitFirst(num) {
    this.list.pop()
    this.list.unshift(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`wait ${num}s`)
          resolve()
        }, num * 1000)
      })
    })
    return this
  }
}
function machine(name) {
  return new Action(name)
}

const defer = (time, callback) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(callback())
    }, time * 1000)
  })
}
class QueueItem {
  constructor(defer, callback) {
    this.defer = defer
    this.callback = callback
  }
}
class Action {
  queue = []
  constructor(name) {
    this.name = name
    this.queue.push(new QueueItem(0, () => console.log(`start ${this.name}`)))
  }
  do(eat) {
    this.queue.push(new QueueItem(0, () => console.log(`${this.name} ${eat}`)))
    return this
  }
  wait(time) {
    this.queue.push(new QueueItem(time, () => console.log(`wait ${time}s`)))
    return this
  }
  waitFirst(time) {
    this.queue.unshift(new QueueItem(time, () => console.log(`wait ${time}s`)))
    return this
  }
  async execute() {
    while (this.queue.length > 0) {
      const curItem = this.queue.shift()
      if (!curItem.defer) {
        curItem.callback()
        continue
      }
      await defer(curItem.defer, curItem.callback)
    }
  }
}
```
