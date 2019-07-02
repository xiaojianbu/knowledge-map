# JS new 操作符

1. 创建对象，设为 o;
2. 将 o 的\_\_proto\_\_指向构造函数的原型对象；
3. 将 o 作为 this 去调用构造函数，从而设置 o 的属性和方法并初始化。
4. 如果构造函数中没有返回其它对象，那么返回创建的这个的新对象，否则，返回构造函数中返回的对象。

```js
/* 选自 yck 文章 */
function create(Con, ...args) {
  let obj = {}
  Object.setPrototypeOf(obj, Con.prototype)
  let result = Con.apply(obj, args)
  return result instanceof Object ? result : obj
}
function _new(fun) {
  return function() {
    let obj = {
      __proto__: fun.prototype
    }
    fun.apply(obj, arguments)
    return obj
  }
}
var objectFactory = function() {
  var obj = new Object() //创建一个Object
  var Constructor = [].shift.call(arguments) //获取指定函数对象
  obj.__proto__ = Constructor.prototype //Object.prototype是个错误的指向，所以改变指向的原型
  var ret = Constructor.apply(obj, arguments) //借用外部传入的构造器给obj设置属性
  return typeof ret === 'object' ? ret : obj //兼容,因为某些浏览器没有暴露__proto__属性。
}
//测试
function Person(name) {
  this.name = name
}
Person.prototype.getName = function() {
  return this.name
}
var a = objectFactory(Person, 'seven')
console.log(a.name) //seven
console.log(a.getName()) //seven
console.log(Object.getPrototypeOf(a) === Person.prototype) //true

var myName1 = function() {
  this.name = 'seven'
  return {
    name: 'juejin'
  }
}
var myName2 = function() {
  this.name = 'seven'
  return 'juejin'
}
var myName3 = function() {
  return 'juejin'
}
var obj = new myName1()
console.log(obj.name) //juejin
var str = new myName2()
console.log(str.name) //seven
var und = new myName3()
console.log(und.name) //undefined

function New(func) {
  var res = {}
  if (func.prototype !== null) {
    res.__proto__ = func.prototype
  }
  var ret = func.apply(res, Array.prototype.slice.call(arguments, 1))
  if ((typeof ret === 'object' || typeof ret === 'function') && ret !== null) {
    return ret
  }
  return res
}
var obj = New(A, 1, 2)
// equals to
var obj = new A(1, 2)
```
