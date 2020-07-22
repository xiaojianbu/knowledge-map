# axios 传递参数

在使用 axios 来进行 AJAX 交互的时候需要注意用 get 和 post 方法传递参数的不同。

get 使用 params(添加到 url 的请求字符串中)

post 使用 data（添加到 body 中）

在 post 传递数据的过程中，还需要把 Content-Type 为 application/x-www-form-urlencoded。

解决方法：使用 qs

qs.stringify(data)
