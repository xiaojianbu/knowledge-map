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

参考连接：[build-tree-array-from-flat-array-in-javascript](https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript)
[https://blog.csdn.net/qq_36956154/article/details/79893876](https://blog.csdn.net/qq_36956154/article/details/79893876)
