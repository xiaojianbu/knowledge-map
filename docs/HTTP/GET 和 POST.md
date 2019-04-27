# GET 和 POST

GET 在浏览器 回退 时是无害的, 而 POST 会再次提交请求

GET 产生的 URL 地址可以被收藏, 而 POST 不可以

GET 请求会被浏览器主动缓存, 而 POST 不会, 除非手动设置

GET 请求只能进行 URL 编码, 而 POST 支持多种编码方式

GET 请求参数会被完整保留在浏览器历史里, 而 POST 中的参数不会被保留

GET 请求在 URL 中传送的参数是有长度限制的, 而 POST 没有限制(不同的浏览器和 WEB 服务器，限制的最大长度不一样)

对参数的数据类型, GET 只接受 ASCII 字符, 而 POST 没有限制

GET 比 POST 更不安全, 因为参数直接暴露在 URL 上, 所以不能用来传递敏感信息

GET 参数通过 URL 传递, POST 放在 Request body 中

GET 将参数放在 URL 的 Query String 里，有长度限制，只支持 ASCII 数据

POST 将参数放在 HTTP body 中

GET 和 POST 请求的区别？

对于 GET 请求，浏览器会把 HTTP headers 和 data 一并发送出去，服务器响应 200。

而对于 POST 请求，浏览器会先发送 HTTP headers，服务器响应 100 continue ，浏览器再发送 data，服务器响应 200。
