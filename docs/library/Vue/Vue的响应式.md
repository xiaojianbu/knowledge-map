# Vue的响应式

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
methodsToPatch.forEach(function (method) {
  // 获得原生函数
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
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

let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      setBind(value);
      return Reflect.set(target, property, value);
    }
  };
  return new Proxy(obj, handler);
};

let obj = { a: 1 }
let value
let p = onWatch(obj, (v) => {
  value = v
}, (target, property) => {
  console.log(`Get '${property}' = ${target[property]}`);
})
p.a = 2 // bind `value` to `2`
p.a // -> Get 'a' = 2


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
  (function (key) {
    // 命中闭包. 新建一个函数, 保证 key 的独立作用域
    Object.defineProperty(vm, key, {
      get: function () {
        console.log('get')
        return data[key]
      },
      set: function (newVal) {
        console.log('set')
        data[key] = newVal
      }
    })
  })(key)
}
```

数据响应(数据劫持)
看完生命周期后，里面的watcher等内容其实是数据响应中的一部分。数据响应的实现由两部分构成: 观察者( watcher ) 和 依赖收集器( Dep )，其核心是 defineProperty这个方法，它可以 重写属性的 get 与 set 方法，从而完成监听数据的改变。

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
let data = {a: 1}
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
        },
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

