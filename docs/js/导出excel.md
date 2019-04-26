# 导出 excel

```js
function download(options) {
  var data = options.data
  var type = options.type
  var name = options.name

  if (typeof data === 'string') {
    console.log(1)
    data = [data]
  }

  var blob = new Blob(data, {
    type: type
  })

  var anc = document.createElement('a')
  anc.href = window.URL.createObjectURL(blob)
  anc.setAttribute('download', name)
  anc.style.display = 'none'
  anc.click()
  anc.remove()
}
blob.download({
  data: [res],
  name: '导出日志' + new Date().getTime() + '.xlsx', // 本来是要xlsx的配arraybuffer 需求变更为csv
  //  name: '导出日志' + new Date().getTime() + '.csv',
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
})

if (typeof keyData === 'object') {
  let content = JSON.stringify(keyData, null, 2)
  blob.download({ data: content, name: 'tenant.json', type: 'text/json' })
}
```
