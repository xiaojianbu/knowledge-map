# vue input 输入限制

```javascript
Vue.directive('limit', {
  update: function(el) {
    el.onkeypress = function(e) {
      var code = e.charCode
      if (code != 0) {
        if (!String.fromCharCode(code).match(/[0-9\.]/)) {
          return false
        }
      }
    }
    el.addEventListener('textInput', function(e) {
      e.target.value = e.target.value.replace(/[^0-9\.]/g, '')
    })
    el.onkeyup = function(e) {
      e.target.value = e.target.value.replace(/[^0-9\.]/g, '')
    }
  }
})
```
