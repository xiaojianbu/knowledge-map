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

参考连接：[build-tree-array-from-flat-array-in-javascript](https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript)
[https://blog.csdn.net/qq_36956154/article/details/79893876](https://blog.csdn.net/qq_36956154/article/details/79893876)
