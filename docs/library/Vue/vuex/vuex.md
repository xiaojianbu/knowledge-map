# vuex

vuex 是 vue 生态系统中的状态管理

## 什么样的数据存入 Vuex

1. 数据被多个独立的组件所需要
2. 集中式的 API/数据获取逻辑
3. 客户端的持久化应用状态

## 实现原理

Vuex 实现了一个单向数据流，在全局拥有一个 State 存放数据，当组件要更改 State 中的数据时，必须通过 Mutation 进行，Mutation 同时提供了订阅者模式供外部插件调用获取 State 数据的更新。而当所有异步操作(常见于调用后端接口异步获取更新数据)或批量的同步操作需要走 Action，但 Action 也是无法直接修改 State 的，还是需要通过 Mutation 来修改 State 的数据。最后，根据 State 的变化，渲染到视图上。

## flux、redux、vuex 数据流向，(例如：点击按钮触发到状态更改，数据是如何流向的？)

例如 flux：

1、用户访问 View
2、View 发出用户的 Action
3、Dispatcher 收到 Action，要求 Store 进行相应的更新
4、Store 更新后，发出一个"change"事件
5、View 收到"change"事件后，更新页面

## vuex 和 redux 区别

redux 是 flux 的一种实现，redux 不单单可以用在 react 上面。

vuex 是 redux 的基础上进行改变，对仓库的管理更加明确。

数据流向不一样，vuex 的同异步有不同的流向，而 redux 的同异步是一样的。

redux 使用的是不可变的数据，而 vuex 的数据是可变的，redux 每次修改更新数据，其实就是用新的数据替换旧的数据，而 vuex 是直接修改原数据。

## vuex 数据流？为什么要遵循这个数据流？假如在页面中直接修改 state,而不是通过 mutation 的 commit 方式修改，会怎么样

不能直接改变 store 中的状态，一般在开发环境，会产生警告的报错。

使用 commit 提交到 mutation 修改 state 的优点：vuex 能够记录每一次 state 的变化记录，保存状态快照，实现时间漫游／回滚之类的操作。

## vuex 缺点是什么

Vuex 与 Vue 深度耦合，致使不能迁移到其他环境下使用

## vuex 中如何使得组件可以通过 this.\$store 来访问 vuex 中的属性和方法的，谈谈它的原理

Vuex 通过 store 选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用 Vue.use(Vuex)）

通过在根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 this.\$store 访问到。

内部通过调用插件的 install 方法，主要作用是将 store 实例注入到每一个 vue 组件中，具体实现方式如下

```js
exportfunctioninstall (_Vue) {
  // 避免重复安装if (Vue && Vue === _Vue) {
    // 开发环境报错console.warn("duplicate install");
  }
  Vue = _Vue;
  // 开始注册全局mixin
  applyMixin(Vue);
}
// applyMixin
export default function(Vue) {
  // 获得 Vue 版本号
  const version = Number(Vue.version.split('.')[0])
  // Vue 2.0 以上会混入 beforeCreate 函数
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // ...
  }
  // 作用很简单，就是能让我们在组件中
  // 使用到 this.$store
  function vuexInit() {
    const options = this.$options
    if (options.store) {
      this.$store =
        typeof options.store === 'function' ? options.store() : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
```

通过定义一个全局变量 Vue 保存当前的引入的 Vue 来避免重复安装，然后通过 apllyMixin 实现将 store 注入到各个实例中去

https://github.com/KieSun/Dream/issues/9
