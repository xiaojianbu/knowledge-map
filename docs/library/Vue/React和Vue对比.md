# React 和 Vue 对比

## 数据流

Vue 的组件系统中，我们往往假设数据是可变的，所以也往往都是直接改变数据，正因为如此，我们可以得到最细粒度更新的效果。

React 提倡数据不可变，每一次我们应该创建一个新的 State 覆盖之前的，至于最终更新所需的资源靠 Diff 算法来优化。

## 事件流

### Vue

Vue 对于原生 DOM 元素的原生事件都有进行一层包装，简单说就是将所有 dispatchEvent 转化为 基于中介者模式的\$emit， 最终导致了事件传播形式的统一，开发者只需要关注框架的事件派发标准就可以。

并且，Vue 中对于各 DOM 元素绑定的事件会被转换为真实 DOM 的事件绑定，顺序为：

TemplateEvent => DomEvent + Decorate => ComponentEvent

各种修饰符，就是在 “包装转化的这一层” 对事件进行了不同程度的：冒泡处理、拦截处理等等

### React

在 React 中，为了兼顾 浏览器兼容性、事件统一机制的高性能，React 内置了一套 SyntheticEvent 用于统一事件管理的系统。

简单说，从头到尾，React 只为最顶级元素绑定了一大套事件，我们为某某元素绑定的事件都相当于在 React 的 SyntheticEvent 里 “注册”； 当事件发生时，我们注册的事件会相应地被触发。

我们为 “类原生 DOM” 组件/元素 绑定的事件并不会真正地转化为真正的 Dom 事件，而是被挂载在 SyntheticEvent 系统的不同周期内进行触发和处理； 这些挂载的事件中得到的 Event 对象是经过 SyntheticEvent 包装后的复合对象，由原生事件产生，由 SyntheticEvent 加工得到的。

如果一定要得到原生事件属性，可通过 nativeEvent 访问得到；SyntheticEvent 支持大部分 Dom 原生事件，但不是全部； 如果需要支持 SyntheticEvent 之外的事件需要在 React 的生命周期中挂载和卸载事件，也就是原生的 window.addEventListener。

## 组件通信

两者的通信机制基本类似。

"父 => 子"：数据不可变，单向数据流
"子 => 父"：事件派发（Vue），回调派发（React）

## 模板语法

### Vue

数据 IO 的类型采用不同前缀体现，当然本质上也都是内置的 Directive。 Directive 提供了大部分 View 层所需的展示逻辑功能。

### React

数据 IO 的类型统一采用花括号{}或属性值""体现。 默认并不存在 Directive，View 层所需的展示逻辑功能都需要自行业务编码。

## 两者的本质区别

Vue - 本质是 MVVM 框架, 由 MVC 发展而来

React - 本质是前端组件化框架, 由后端组件化发展而来

但这并不妨碍他们两者都能实现相同的功能

## 两者共同点

都支持组件化

都是数据驱动视图

Vue 和 React 区别

Vue 表单支持双向绑定开发更方便
改变数据方式不同，setState 有使用坑
props Vue 可变，React 不可变
判断是否需要更新 React 可以通过钩子函数判断，Vue 使用依赖追踪，修改了什么才渲染什么
React 16 以后 有些钩子函数会执行多次
React 需要使用 JSX，需要 Babel 编译。Vue 虽然可以使用模板，但是也可以通过直接编写 render 函数不需要编译就能运行。
生态 React 相对较好

## 参考

[Vue 和 React 的异同](https://surmon.me/article/116)
