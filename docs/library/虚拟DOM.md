# 虚拟 DOM

用 JS 模拟 DOM 结构

DOM 变化的对比, 放在 JS 层来做

提高重绘性能

DOM 操作是昂贵的, JS 运行效率高

尽量减少 DOM 操作, 而不是 '推倒重来'

虚拟 DOM 可以解决这个问题

将 DOM 对比操作放在 JS 层, 提高效率

为什么 js 操作 DOM 更消耗资源呢？

## diff 算法

找出本次 DOM 必须更新的节点来更新, 其他的不更新

通过 JavaScript 来构建虚拟的 DOM 树结构，并将其呈现到页面中；
当数据改变，引起 DOM 树结构发生改变，从而生成一颗新的虚拟 DOM 树，将其与之前的 DOM 对比，将变化部分应用到真实的 DOM 树中，即页面中。
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

virtual dom 原理实现

创建 dom 树

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
