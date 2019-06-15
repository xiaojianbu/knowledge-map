# GET 和 POST

GET 在浏览器 回退 时是无害的, 而 POST 会再次提交请求

GET 产生的 URL 地址可以被收藏, 而 POST 不可以

GET 请求会被浏览器主动缓存, 而 POST 不会, 除非手动设置

GET 请求只能进行 URL 编码, 而 POST 支持多种编码方式

GET 请求参数会被完整保留在浏览器历史里, 而 POST 中的参数不会被保留

GET 请求在 URL 中传送的参数是有长度限制的, 而 POST 没有限制(不同的浏览器和 WEB 服务器，限制的最大长度不一样)

对参数的数据类型, GET 只接受 ASCII 字符, 而 POST 没有限制

GET 比 POST 更不安全, 因为参数直接暴露在 URL 上, 所以不能用来传递敏感信息

从传输的角度来说，他们都是不安全的，因为 HTTP 在网络上是明文传输的，只要在网络节点上捉包，就能完整地获取数据报文。

要想安全传输，就只有加密，也就是 HTTPS。

GET 参数通过 URL 传递, POST 放在 Request body 中

GET 将参数放在 URL 的 Query String 里，有长度限制，只支持 ASCII 数据

POST 将参数放在 HTTP body 中

最本质的，就是语义不同

最大的区别，get 只拿数据，post 可以改变服务器状态：

MDN:

[GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)

The HTTP GET method requests a representation of the specified resource. Requests using GET should only retrieve data.

[POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)

The HTTP POST method sends data to the server. The type of the body of the request is indicated by the Content-Type header.

The difference between PUT and POST is that PUT is idempotent: calling it once or several times successively has the same effect (that is no side effect), where successive identical POST may have additional effects, like passing an order several times.

A POST request is typically sent via an HTML form and results in a change on the server.

对于 HTTP 请求来说，语法是指请求响应的格式，比如请求第一行必须是 方法名 URI 协议/版本 这样的格式

语义则定义了这一类型的请求具有什么样的性质。比如 GET 的语义就是「获取资源」，POST 的语义是「处理资源」

GET 的语义是请求获取指定的资源。GET 方法是安全、幂等、可缓存的（除非有 Cache-Control Header 的约束）,GET 方法的报文主体没有任何语义。

POST 的语义是根据请求负荷（报文主体）对指定的资源做出处理，具体的处理方式视资源类型而不同。POST 不安全，不幂等，（大部分实现）不可缓存。

## 参考

[HTTP 协议中 GET 和 POST 方法的区别](https://sunshinevvv.coding.me/blog/2017/02/09/HttpGETv.s.POST/)

[听说『99% 的人都理解错了 HTTP 中 GET 与 POST 的区别』？？](https://zhuanlan.zhihu.com/p/25028045)
