```js
import XlsxPopulate from 'xlsx-populate'

export const export2Excel = tableData => {
  // Load a new blank workbook
  XlsxPopulate.fromBlankAsync().then(function(workbook) {
    // Modify the workbook.
    let sheet = workbook.sheet('Sheet1').name(tableData.reportName)
    let data = tableData.data
    let range = sheet.range(1, 1, data.length, data[0].length)
    range.value(data)

    // 合并单元格
    let mergeCells = tableData.mergeCells
    // 判断mergeCells是否为数组
    if (Object.prototype.toString.call(mergeCells) !== '[object Array]') {
      mergeCells = []
    }

    mergeCells.forEach(o => {
      sheet
        .range(o.row + 1, o.col + 1, o.row + o.rowspan, o.col + o.colspan)
        .merged(true)
    })

    // Write to file.
    workbook.outputAsync().then(function(blob) {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // If IE, you must uses a different method.
        window.navigator.msSaveOrOpenBlob(blob, tableData.reportName + '.xlsx')
      } else {
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = tableData.reportName + '.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    })
  })
}
```
