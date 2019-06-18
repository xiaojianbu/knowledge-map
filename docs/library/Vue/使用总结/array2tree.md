# array2tree

在写代码的过程中，后端传回的数据格式是一个对象数组，而前端需要的数据格式是一个 tree 型结构，这时需要对数据进行转换。
转换的思路： 1.先将数据中第一层的节点取出； 2.再递归的取出第一层节点的子节点。

```javascript
import _ from 'lodash'

function array2tree(array, parent = {id:0}, tree = []){
    let treeData = tree
    const children = _.filter(array, function(child){
        return child.parentId === parent.id
    })
    if(!_.isEmpty(children)){
        if (parent.id === 0) {
            treeData = children
        } else {
            parent['children'] = children
        }
        _.each(children, function(child) {
            array2tree(array, child)
        }
    }
    return treeData
}
```

```js
function transformArray2Tree(
  nodes,
  key = 'id',
  parentKey = 'pId',
  childKey = 'children'
) {
  let i
  let l
  if (!key || key === '' || !nodes) return []
  let sNodes = _.cloneDeep(nodes)

  if (Array.isArray(sNodes)) {
    let r = []
    let tmpMap = {}
    for (i = 0, l = sNodes.length; i < l; i++) {
      tmpMap[sNodes[i][key]] = sNodes[i]
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      // eslint-disable-next-line eqeqeq
      if (
        tmpMap[sNodes[i][parentKey]] &&
        sNodes[i][key] != sNodes[i][parentKey]
      ) {
        if (!tmpMap[sNodes[i][parentKey]][childKey]) {
          tmpMap[sNodes[i][parentKey]][childKey] = []
        }
        tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i])
      } else {
        r.push(sNodes[i])
      }
    }
    return r
  } else {
    return [sNodes]
  }
}
```

```js
function getTree(arr) {
  var arrs = []
  arr.forEach(item => {
    if (!item.parentMenu) {
      arrs.push(item)
    }
  })
  return arr.reduce((h, m) => {
    if (m.parentMenu) {
      foo(h, m)
    }
    function foo(arr, cur) {
      arr.forEach(item => {
        if (item.menuId === cur.parentMenu) {
          if (!item.children) {
            item.children = []
          }
          item.children.push(cur)
        } else if (item.children) {
          foo(item.children, cur)
        }
      })
    }

    return h
  }, arrs)
}
```

```js
let dataArr = [
  { id: 1, name: 'i1' },
  { id: 2, name: 'i2', parentId: 1 },
  { id: 4, name: 'i4', parentId: 3 },
  { id: 3, name: 'i3', parentId: 2 },
  { id: 8, name: 'i8', parentId: 7 }
]

function getTreeData(arr) {
  if (!arr || !(arr instanceof Array)) return '错误的数据类型'
  if (!arr.length) return '空数组'
  var len = arr.length
  var rootObj = { id: null, name: null, children: [] }
  var nodeObj = {}
  for (var i = 0; i < len; i++) {
    if (!arr[i].parentId) {
      rootObj = {
        id: arr[i].id,
        name: arr[i].name,
        children: []
      }
    } else {
      if (nodeObj.hasOwnProperty(arr[i].parentId)) {
        nodeObj[arr[i].parentId].children.push(arr[i])
      } else {
        nodeObj[arr[i].parentId] = {}
        nodeObj[arr[i].parentId].children = []
        nodeObj[arr[i].parentId].children.push(arr[i])
      }
    }
  }
  // 整理根节点过程
  function getChildren(node) {
    if (nodeObj[node.id] && nodeObj[node.id].children) {
      node.children = nodeObj[node.id].children
      delete nodeObj[node.id]
      var len = node.children.length
      if (len > 0) {
        for (var i = 0; i < len; i++) {
          getChildren(node.children[i])
        }
      }
    } else if (!nodeObj[node.id]) {
      console.log(node.id + '没有children')
    }
  }
  getChildren(rootObj)
  for (var p in nodeObj) {
    if (nodeObj.hasOwnProperty) {
      console.warn(p + ':没有该父节点')
    }
  }
  return rootObj
}
```

参考连接：[build-tree-array-from-flat-array-in-javascript](https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript)
[https://blog.csdn.net/qq_36956154/article/details/79893876](https://blog.csdn.net/qq_36956154/article/details/79893876)
