# Vue 的响应式

Vue 响应系统，其核心有三点：observe、watcher、dep:

1. observe: 遍历 data 中的属性，使用 Object.defineProperty 的 get/set 方法对其进行数据劫持；
2. dep: 每个属性拥有自己的消息订阅器 dep.用于存放所有订阅了该属性的观察者对象；
3. watcher: 观察者，通过 dep 实现对响应属性的监听，监听到结果后，主动触发自己的回调进行响应。

Vue.js 的响应式系统：如何做到在 data 发生改变时，视图会自动更新？

模型（Model）通过 Observer、Dep、Watcher、Directive 等一系列对象的关联，和视图（DOM）建立起关系。归纳起来，Vue.js 在这里主要做了三件事：

- 通过 Observer 对 data 做监听，并且提供了订阅某个数据项变化的能力。
- 把 template 编译成一段 document fragment，然后解析其中的 Directive，得到每一个 Directive 所依赖的数据项和 update 方法。
- 通过 Watcher 把上述两部分结合起来，即把 Directive 中的数据依赖通过 Watcher 订阅在对应数据的 Observer 的 Dep 上。当数据变化时，就会触发 Observer 的 Dep 上的 notify 方法通知对应的 Watcher 的 update，进而触发 Directive 的 update 方法来更新 DOM 视图，最后达到模型和视图关联起来。

vue3.0 以前是用 Object.defineProperty

有两个不足之处：

不能检测到增加或删除的属性。

数组方面的变动，如根据索引改变元素，以及直接改变数组长度时的变化，不能被检测到。

虽然 Vue 中确实能检测到数组数据的变化，但是其实是使用了 hack 的办法，并且也是有缺陷的。

```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
// hack 以下几个函数
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
methodsToPatch.forEach(function(method) {
  // 获得原生函数
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(...args) {
    // 调用原生函数
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // 触发更新
    ob.dep.notify()
    return result
  })
})
```

原因差不多，无非就是没有被 getter/setter 。

第一个比较容易理解，为什么数组长度不能被 getter/setter ？

在知乎上找了一个答案：如果你知道数组的长度，理论上是可以预先给所有的索引设置 getter/setter 的。但是一来很多场景下你不知道数组的长度，二来，如果是很大的数组，预先加 getter/setter 性能负担较大。

vue3.0 是使用 proxy

Vue3 proxy 解决了哪些问题？

Object.definedProperty 的作用是劫持一个对象的属性，劫持属性的 getter 和 setter 方法，在对象的属性发生变化时进行特定的操作。而 Proxy 劫持的是整个对象。

Proxy 会返回一个代理对象，我们只需要操作新对象即可，而 Object.defineProperty 只能遍历对象属性直接修改。

Object.definedProperty 不支持数组，更准确的说是不支持数组的各种 API，因为如果仅仅考虑 arry[i] = value 这种情况，是可以劫持的，但是这种劫持意义不大。而 Proxy 可以支持数组的各种 API。

尽管 Object.defineProperty 有诸多缺陷，但是其兼容性要好于 Proxy.

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let value
let p = onWatch(
  obj,
  v => {
    value = v
  },
  (target, property) => {
    console.log(`Get '${property}' = ${target[property]}`)
  }
)
p.a = 2 // bind `value` to `2`
p.a // -> Get 'a' = 2
```

## Object.defineProperty

```js
let obj = {}
let name = 'test'

Object.defineProperty(obj, 'name', {
  get: function() {
    console.log('get')
    return name
  },
  set: function(newValue) {
    console.log('set')
    name = newValue
  }
})
console.log(obj.name)
obj.name = 'test1'
```

### 模拟 Vue 的响应式

```js
var vm = {}
var data = {
  age: 18,
  name: 'test'
}

var key, value
for (key in data) {
  ;(function(key) {
    // 命中闭包. 新建一个函数, 保证 key 的独立作用域
    Object.defineProperty(vm, key, {
      get: function() {
        console.log('get')
        return data[key]
      },
      set: function(newVal) {
        console.log('set')
        data[key] = newVal
      }
    })
  })(key)
}
```

数据响应(数据劫持)

看完生命周期后，里面的 watcher 等内容其实是数据响应中的一部分。数据响应的实现由两部分构成: 观察者( watcher ) 和 依赖收集器( Dep )，其核心是 defineProperty 这个方法，它可以 重写属性的 get 与 set 方法，从而完成监听数据的改变。

Observe (观察者)观察 props 与 state

遍历 props 与 state，对每个属性创建独立的监听器( watcher )

使用 defineProperty 重写每个属性的 get/set(defineReactive）

get: 收集依赖

Dep.depend()

watcher.addDep()

set: 派发更新

Dep.notify()

watcher.update()

queenWatcher()

nextTick

flushScheduleQueue

watcher.run()

updateComponent()

大家可以先看下面的数据相应的代码实现后，理解后就比较容易看懂上面的简单脉络了。

```js
let data = { a: 1 }
// 数据响应性
observe(data)

// 初始化观察者
new Watcher(data, 'name', updateComponent)
data.a = 2

// 简单表示用于数据更新后的操作
function updateComponent() {
  vm._update() // patchs
}

// 监视对象
function observe(obj) {
  // 遍历对象，使用 get/set 重新定义对象的每个属性值
  Object.keys(obj).map(key => {
    defineReactive(obj, key, obj[key])
  })
}

function defineReactive(obj, k, v) {
  // 递归子属性
  if (type(v) == 'object') observe(v)

  // 新建依赖收集器
  let dep = new Dep()
  // 定义get/set
  Object.defineProperty(obj, k, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // 当有获取该属性时，证明依赖于该对象，因此被添加进收集器中
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return v
    },
    // 重新设置值时，触发收集器的通知机制
    set: function reactiveSetter(nV) {
      v = nV
      dep.nofify()
    }
  })
}

// 依赖收集器
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  notify() {
    this.subs.map(sub => {
      sub.update()
    })
  }
}

Dep.target = null

// 观察者
class Watcher {
  constructor(obj, key, cb) {
    Dep.target = this
    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key]
    Dep.target = null
  }
  addDep(Dep) {
    Dep.addSub(this)
  }
  update() {
    this.value = this.obj[this.key]
    this.cb(this.value)
  }
  before() {
    callHook('beforeUpdate')
  }
}
```

[面试官: 实现双向绑定 Proxy 比 defineproperty 优劣如何?](https://juejin.im/post/5acd0c8a6fb9a028da7cdfaf)

https://juejin.im/post/5cf66d586fb9a07ed2245b28
