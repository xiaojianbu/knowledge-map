# mock 数据

使用 Mock.js 来模拟后端数据，在 Vue 中使用 demo 代码如下 1.安装

```bash
yarn add mockjs
```

2.在 main.js 中

```javascript
import '.mock'
```

3.在/src/mock/index.js 中

```javascript
import Mock from 'mockjs'

const data = require('test.json') // 后端传递的json数据
Mock.mock(/\/test/, 'get', function() {
  return data
})
```
