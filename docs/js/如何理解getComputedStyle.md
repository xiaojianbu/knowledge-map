# 如何理解 getComputedStyle

getComputedStyle 获取当前元素所有最终使用的 CSS 属性值，等价于 document.defaultView.getComputedStyle(ps: document.defaultView 在浏览器中，返回当前 document 对象所关联的 window 对象)

window.getComputedStyle(ele, null).getPropertyValue("height") 可能的值为 100px, 如果元素的背景色透明，那么 getComputedStyle 获取出来的就是透明的这个背景
