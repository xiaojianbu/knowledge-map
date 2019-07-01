# 虚拟 DOM

## Vue 虚拟 DOM

是一个以 JS 对象为基础的树，用对象属性（例如标签名 tag、属性 attrs、子元素对象 children）来描述节点，描述了应该怎样去创建真实的 DOM 节点，通过 createElement 方法将 VNode 渲染成 dom 节点。

Vue 通过编译将 template 模板转换成渲染函数，执行渲染函数就可以得到一个虚拟节点树

在对 Model 进行操作的时候，会触发对应 Dep 中的 Watcher 对象。Watcher 对象会调用对应的 update 来修改视图。这个过程主要是将新旧虚拟节点进行差异化对比，然后根据对比结果进行 DOM 操作来更新视图。

### 虚拟 DOM 的作用

1. 提供与真实 DOM 节点所对应的虚拟节点
2. 更新的时候，将虚拟 DOM 与上一次渲染视图的旧虚拟 DOM 进行对比，找出真正需要更新的节点来进行 DOM 操作，从而避免操作其他无需改动的 DOM。

### 优势

使用 JS 对象模拟 DOM 结构，将 DOM 变化的对比操作放在 JS 层面上来做，提高重绘性能。

因为 DOM 操作的执行速度没有 JS 运行效率高，通过 patch 算法来计算出真正需要更新的节点，尽量减少 DOM 操作, 而不是 '推倒重来'，来达到提高性能的目的。

### 为什么 js 操作 DOM 更消耗资源呢

操作 DOM 可能会引起重排和重绘

由于 DOM 树的存在，对某一个 DOM 元素的操作可能会影响子节点，兄弟节点甚至是父节点，整棵 DOM 树。

优势在大量、频繁的数据更新下，能够对视图进行合理、高效的更新，这个更新的操作是通过 diff 算法来实现。

### diff 算法

核心是仅在同级的 VNode 间做 diff,递归地进行同级 VNode 的 diff,最终实现整个 DOM 树的更新。

步骤如下：

1. 用 JS 对象结构表示 DOM 树的结构，然后将这个树构建成一个真正的 DOM 树将其呈现到页面中
2. 当状态变更的时候，重新构造一个新的对象树，然后用新的树和旧的树进行比较，记录两棵树差异
3. 把所记录的差异应用到所构建的真正的 DOM 树上

通过上面的介绍，下面，我们就来实现一个简单的虚拟 DOM，并将其与真实的 DOM 关联。

```js
var elem = Element({
  tagName: 'ul',
  props: {'class': 'list'},
  children: [
    Element({tagName: 'li', children: ['item1']}),
    Element({tagName: 'li', children: ['item2']})
  ]
});

/\*

- @Params:
-     tagName(string)(requered)
-     props(object)(optional)
-     children(array)(optional)
- \*/
function Element({tagName, props, children}){
  if(!(this instanceof Element)){
    return new Element({tagName, props, children})
  }
  this.tagName = tagName;
  this.props = props || {};
  this.children = children || [];
}

Element.prototype.render = function(){
    var el = document.createElement(this.tagName),
    props = this.props,
    propName,
    propValue;
    for(propName in props){
        propValue = props[propName];
        // 添加属性
        el.setAttribute(propName, propValue);
    }
    this.children.forEach(function(child){
      var childEl = null;
      if(child instanceof Element){
        childEl = child.render();
      }else{
        childEl = document.createTextNode(child);
      }
      el.appendChild(childEl);
    });
    return el;
};

var elem = Element({
    tagName: 'ul',
    props: {'class': 'list'},
    children: [
        Element({tagName: 'li', children: ['item1']}),
        Element({tagName: 'li', children: ['item2']})
    ]
});
document.querySelector('body').appendChild(elem.render());
```

树的 diff，同层对比，输出 patchs(listDiff/diffChildren/diffProps)

没有新的节点，返回

新的节点 tagName 与 key 不变， 对比 props，继续递归遍历子树

对比属性(对比新旧属性列表):

旧属性是否存在与新属性列表中

都存在的是否有变化

是否出现旧列表中没有的新属性

tagName 和 key 值变化了，则直接替换成新节点

渲染差异

遍历 patchs， 把需要更改的节点取出来

局部更新 dom

```js
// diff 算法的实现
function diff(oldTree, newTree) {
  // 差异收集
  let pathchs = {}
  dfs(oldTree, newTree, 0, pathchs)
  return pathchs
}

function dfs(oldNode, newNode, index, pathchs) {
  let curPathchs = []
  if (newNode) {
    // 当新旧节点的 tagName 和 key 值完全一致时
    if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
      // 继续比对属性差异
      let props = diffProps(oldNode.props, newNode.props)
      curPathchs.push({ type: 'changeProps', props })
      // 递归进入下一层级的比较
      diffChildrens(oldNode.children, newNode.children, index, pathchs)
    } else {
      // 当 tagName 或者 key 修改了后，表示已经是全新节点，无需再比
      curPathchs.push({ type: 'replaceNode', node: newNode })
    }
  }

  // 构建出整颗差异树
  if (curPathchs.length) {
    if (pathchs[index]) {
      pathchs[index] = pathchs[index].concat(curPathchs)
    } else {
      pathchs[index] = curPathchs
    }
  }
}

// 属性对比实现
function diffProps(oldProps, newProps) {
  let propsPathchs = []
  // 遍历新旧属性列表
  // 查找删除项
  // 查找修改项
  // 查找新增项
  forin(olaProps, (k, v) => {
    if (!newProps.hasOwnProperty(k)) {
      propsPathchs.push({ type: 'remove', prop: k })
    } else {
      if (v !== newProps[k]) {
        propsPathchs.push({ type: 'change', prop: k, value: newProps[k] })
      }
    }
  })
  forin(newProps, (k, v) => {
    if (!oldProps.hasOwnProperty(k)) {
      propsPathchs.push({ type: 'add', prop: k, value: v })
    }
  })
  return propsPathchs
}

// 对比子级差异
function diffChildrens(oldChild, newChild, index, pathchs) {
  // 标记子级的删除/新增/移动
  let { change, list } = diffList(oldChild, newChild, index, pathchs)
  if (change.length) {
    if (pathchs[index]) {
      pathchs[index] = pathchs[index].concat(change)
    } else {
      pathchs[index] = change
    }
  }

  // 根据 key 获取原本匹配的节点，进一步递归从头开始对比
  oldChild.map((item, i) => {
    let keyIndex = list.indexOf(item.key)
    if (keyIndex) {
      let node = newChild[keyIndex]
      // 进一步递归对比
      dfs(item, node, index, pathchs)
    }
  })
}

// 列表对比，主要也是根据 key 值查找匹配项
// 对比出新旧列表的新增/删除/移动
function diffList(oldList, newList, index, pathchs) {
  let change = []
  let list = []
  const newKeys = getKey(newList)
  oldList.map(v => {
    if (newKeys.indexOf(v.key) > -1) {
      list.push(v.key)
    } else {
      list.push(null)
    }
  })

  // 标记删除
  for (let i = list.length - 1; i >= 0; i--) {
    if (!list[i]) {
      list.splice(i, 1)
      change.push({ type: 'remove', index: i })
    }
  }

  // 标记新增和移动
  newList.map((item, i) => {
    const key = item.key
    const index = list.indexOf(key)
    if (index === -1 || key == null) {
      // 新增
      change.push({ type: 'add', node: item, index: i })
      list.splice(i, 0, key)
    } else {
      // 移动
      if (index !== i) {
        change.push({
          type: 'move',
          form: index,
          to: i
        })
        move(list, index, i)
      }
    }
  })

  return { change, list }
}
```
