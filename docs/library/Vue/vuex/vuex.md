# vuex

## flux、redux、vuex 数据流向，(例如：点击按钮触发到状态更改，数据是如何流向的？)

例如 flux：

1、用户访问 View
2、View 发出用户的 Action
3、Dispatcher 收到 Action，要求 Store 进行相应的更新
4、Store 更新后，发出一个"change"事件
5、View 收到"change"事件后，更新页面

## vuex 和 redux 区别

## vuex 数据流？为什么要遵循这个数据流？假如在页面中直接修改 state,而不是通过 mutation 的 commit 方式修改，会怎么样？

https://github.com/KieSun/Dream/issues/9
