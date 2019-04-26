# Babel 插件

Babel 插件分为两种：语法插件、转译插件

## 语法插件

作用：使得 Babel 能够解析更多的语法

## 转译插件

作用：把源码转换并输出。

## demo

预计算简单表达式的插件

Before:

```js
const result = 1 + 2 + 3 + 4 + 5
```

After:

```js
const result = 15
```

```js
// 插件代码
// Babel 插件模块需要暴露一个function，function 内返回 visitor
// visitor 是对各个类型的AST节点做处理的地方

let babel = require('babel-core')
let t = require('babel-types')

const visitor = {
  BinaryExpression(path) {
    const node = path.node
    let result
    // 判断表达式两边，是否都是数字
    if (t.isNumericLiteral(node.left) && t.isNumericLiteral(node.right)) {
      // 根据不同的操作符做运算
      switch (node.operator) {
        case '+':
          result = node.left.value + node.right.value
          break
        case '-':
          result = node.left.value - node.right.value
          break
        case '*':
          result = node.left.value * node.right.value
          break
        case '/':
          result = node.left.value / node.right.value
          break
        case '**':
          let i = node.right.value
          while (--i) {
            result = result || node.left.value
            result = result * node.left.value
          }
          break
        default:
      }
    }
    // 如果上面的运算有结果的话
    if (result !== undefined) {
      // 把表达式节点替换成 number 字面量
      path.replaceWith(t.numericLiteral(result))

      let parentPath = path.parentPath

      // 向上遍历父级节点
      parentPath && visitor.BinaryExpression.call(this, parentPath)
    }
  }
}

module.exports = function(babel) {
  return {
    visitor
  }
}
```

## 参考

[面试官: 你了解过 Babel 吗？写过 Babel 插件吗? 答: 没有。卒](https://juejin.im/post/5a9315e46fb9a0633a711f25)
