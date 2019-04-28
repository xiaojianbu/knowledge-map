# Knockout

Knockout 使用 MVVM 模式，ko 一个页面只能用一个 viewmodel。

该框架有三大特性：

1. 观察者和依赖跟踪；
2. 声明绑定；
3. 模板。

4. 在 js 中定义一个模型 myViewModel，myViewModel 可以是对象也可以是实例，程序中的数据都是存储在 Model 中的；
5. 在视图中声明绑定。在视图中通过在 HTML 标签上添加 data-bind 属性配合 Knockoutjs 的绑定方法；
6. 最后通过 ko.applyBindings(myViewModel)将定义的 myViewModel 与视图中声明的绑定关联到一起。

在 JS 代码中声明一个 ViewData 的构造函数，然后把这个构造函数的实例传给 ko.applyBindings()这个方法，实现 view 和 appViewModel 的绑定。

在 html 标签上使用 data-bind="text:hello"来实现和 viewmodel 中数据的绑定。

viewmodel 中的属性仅仅只是无格式的 JavaScript 字符串，当属性发生变化的时候，并没有办法通知任何人发生了变化，因此还是静态 UI。
实现双向数据绑定

当 viewmodel 中的属性被 observable 化了之后，他们就被变成了一个函数，当需要使用它们的时候，需要采用函数调用的方式。

一个 ko 中的常用方法，ko.computed(func,thisObj)，这个方法有两个参数，第一个就是执行的函数，第二个就是传入的对象，改变作用域用的，类似于 js 中的 call。

如果只需要单独对一个对象的变化进行监听我们可以使用 ko.observable，如果需要对一个集合的变化进行监听那就需要使用 ko.observableArray
