# 如何无痛降低 if else 面条代码复杂度

## 类型

### if...if 型

这种类型的代码结构形如下：

```js
function demo(a, b, c) {
  if (f(a, b, c)) {
    if (g(a, b, c)) {
      // ...
    }
    // ...
    if (h(a, b, c)) {
      // ...
    }
  }

  if (j(a, b, c)) {
    // ...
  }

  if (k(a, b, c)) {
    // ...
  }
}
```

### else if...else if 型

这种类型的代码结构形如下：

```js
function demo(a, b, c) {
  if (f(a, b, c)) {
    if (g(a, b, c)) {
      // ...
    }
    // ...
    else if (h(a, b, c)) {
      // ...
    }
    // ...
  } else if (j(a, b, c)) {
    // ...
  } else if (k(a, b, c)) {
    // ...
  }
}
```

## 重构策略

### 基本情形

对看起来复杂度增长最快的 if...if 型面条代码，通过基本的函数即可将其拆分。在不改变控制流逻辑的前提下，将一个单体的大函数，自上而下拆逐步分为多个小函数，而后逐个调用之。

### 查找表

对于 else if...else if 类型的面条代码，一种最简单的重构策略是使用所谓的查找表。它通过键值对的形式来封装每个 else if 中的逻辑：

```js
const rules = {
  x: function(a, b, c) {
    /* ... */
  },
  y: function(a, b, c) {
    /* ... */
  },
  z: function(a, b, c) {
    /* ... */
  }
}

function demo(a, b, c) {
  const action = determineAction(a, b, c)
  return rules[action](a, b, c)
}
```

### 职责链模式

在上文中，查找表是用键值对实现的，对于每个分支都是 else if (x === 'foo') 这样简单判断的情形时，'foo' 就可以作为重构后集合的键了。但如果每个 else if 分支都包含了复杂的条件判断，且其对执行的先后顺序有所要求，那么我们可以用职责链模式来更好地重构这样的逻辑。

对 else if 而言，注意到每个分支其实是从上到下依次判断，最后仅走入其中一个的。这就意味着，我们可以通过存储【判定规则】的数组，来实现这种行为。如果规则匹配，那么就执行这条规则对应的分支。

在代码实现上，我们可以通过一个职责链数组来定义与 else if 完全等效的规则：

```js
const rules = [
  {
    match: function(a, b, c) {
      /* ... */
    },
    action: function(a, b, c) {
      /* ... */
    }
  },
  {
    match: function(a, b, c) {
      /* ... */
    },
    action: function(a, b, c) {
      /* ... */
    }
  },
  {
    match: function(a, b, c) {
      /* ... */
    },
    action: function(a, b, c) {
      /* ... */
    }
  }
  // ...
]
```

rules 中的每一项都具有 match 与 action 属性。这时我们可以将原有函数的 else if 改写对职责链数组的遍历：

```js
function demo(a, b, c) {
  for (let i = 0; i < rules.length; i++) {
    if (rules[i].match(a, b, c)) {
      return rules[i].action(a, b, c)
    }
  }
}
```

使用 lodash 中的 cond 方法： \_.cond([[真值检测函数 1，处理器 1]， [真值检测函数 2，处理器 2]])

## 来源

[如何无痛降低 if else 面条代码复杂度](https://juejin.im/post/59dc66256fb9a0452a3b4832)
