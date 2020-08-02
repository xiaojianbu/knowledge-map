# Bug

## 凭证号输入框输入英文字符，可以正常输入

【日期】：20190716

【问题】：【凭证汇总】点击查询条件，凭证号输入框输入英文字符，可以正常输入

步骤：

1. 点击查询条件
2. 凭证号输入框输入英文字符

预期：无法输入，只能输入数字

实际：可以正常数输入

【原因】：ant design 的 InputNumber 组件可以输入英文字符，只是在失去焦点后，对英文字符进行处理。

【如何发现】：

【如何修复】：通过组件的 formatter 和 parser 来处理

```JavaScript React
<InputNumber
  style={{ width: '100%' }}
  max={100}
  min={0}
  precision={0}
  formatter={(value) => value}
  parser={(value) => value.replace(/\D/g, '')}
  />,
)}
```

【总结】：对于输入需要做一定的解析处理。

## 打印模板分页展示

【日期】：20190724

【问题】：打印模板分页展示，第一页模板启用中，第二页只有一条数据，点击删除，提示：请至少保留一个可用打印模板

步骤：

1. 打印模板分页展示，第一页模板启用中，第二页只有一条数据
2. 点击删除

预期：删除成功，展示第一页数据

实际：不可删除，提示：请至少保留一个可用打印模板

【原因】：由于表格做了分页处理，删除时只对当前页的数据进行了判断。

【如何发现】：

【如何修复】：

前端在删除前不做判断，由后端处理，根据后端返回结果再做操作

【总结】：

## 双击”生成凭证“按钮

【日期】：20190827

【问题】：暂估入库清单页面，双击”生成凭证“，凭证弹框会被遮罩层遮挡

【原因】：

双击时多次请求接口

【如何发现】：

【如何修复】：

按钮添加 loading 状态

【总结】：

## 浏览器兼容性问题

【日期】：20190905

【问题】：浏览器兼容性问题（火狐、ie）：text-overflow: ellipsis; 省略号不显示

```less
.ant-table-cell {
  display: block;
  height: 36px;
  line-height: 36px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  & > span {
    display: inline-block;
    line-height: 24px;
    white-space: nowrap;
    & > :last-child {
      margin-right: 0;
    }
  }
}
```

【原因】：text-overflow: 这个属性只对那些在块级元素溢出的内容有效，但是必须要与块级元素内联(inline)方向一致

【如何发现】：

【如何修复】：去掉 display: inline-block;

【总结】：

## 字段 undefined

【日期】：20191024

【问题】：字段 undefined

【原因】：后端返回的数据为 null 的会被过滤掉

【如何发现】：

【如何修复】：获取后端数据时进行防御性编程。

```js
const { data = '' } = requestData
```

【总结】：当你写一个方法需要对传入的参数进行处理或者计算的时候，你必须要严格验证传入参数的正确性，如果不符合，就应当给出提示！防御性编程的最基本规则：保护程序免遭非法输入数据的破坏。

## Modal.confirm 方法中的 onOk 事件多次触发

【日期】：20191114

【问题】：Modal.confirm 方法中的 onOk 事件多次触发

【原因】：连续点击按钮会触发多次 onOk 事件,onOk 事件需要做异步操作,会连续调用多次 ajax,

【如何发现】：

【如何修复】：Modal.confirm 的 onOk 支持 Promise

```js
onOK: () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}
```

【总结】：
