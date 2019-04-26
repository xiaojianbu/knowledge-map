# http 协议

## HTTP 报文的组成部分

请求报文:

请求行、请求头、空行、请求体

响应报文:

状态行、响应头、空行、响应体

示列：

Request Headers:

```text
GET / HTTP/1.1
Host: imooc.com
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: imooc_uuid=59889957-941f-0a5233730096;
```

```text
HTTP/1.1 200 OK
Server: nginx
Date: Mon, 10 Sep 2018 14:26:48 GMT
Content-Type: text/css
Content-Length: 9547
Connection: keep-alive
Last-Modified: Thu, 09 Aug 2018 10:43:57 GMT
Vary: Accept-Encoding
ETag: W/"5b6c1aed-be7b"
Expires: Sun, 07 Oct 2018 02:38:55 GMT
Cache-Control: max-age=2592000
Content-Encoding: gzip
X-Varnish: 195965904 82919848
Age: 301673
Via: 1.1 varnish (Varnish/6.0)
X-Cache: HIT from CS42
Accept-Ranges: bytes
```

## GET 和 POST

GET 在浏览器 回退 时是无害的, 而 POST 会再次提交请求

GET 产生的 URL 地址可以被收藏, 而 POST 不可以

GET 请求会被浏览器主动缓存, 而 POST 不会, 除非手动设置

GET 请求只能进行 URL 编码, 而 POST 支持多种编码方式

GET 请求参数会被完整保留在浏览器历史里, 而 POST 中的参数不会被保留

GET 请求在 URL 中传送的参数是有长度限制的, 而 POST 没有限制(不同的浏览器和WEB服务器，限制的最大长度不一样)

对参数的数据类型, GET 只接受 ASCII 字符, 而 POST 没有限制

GET 比 POST 更不安全, 因为参数直接暴露在 URL 上, 所以不能用来传递敏感信息

GET 参数通过 URL 传递, POST 放在 Request body 中

GET 将参数放在 URL 的 Query String 里，有长度限制，只支持 ASCII 数据

POST 将参数放在 HTTP body 中

GET 和 POST 请求的区别？

对于 GET 请求，浏览器会把 HTTP headers 和 data 一并发送出去，服务器响应 200。

而对于 POST 请求，浏览器会先发送 HTTP headers，服务器响应 100 continue ，浏览器再发送 data，服务器响应 200。

& get post

后退/刷新 无害 请求重新提交

书签 可做书签 不可做

缓存 可被缓存 不能被缓存

历史 保留在浏览器记录里 不保留

对数据长度限制 限制（2048 字符） 不限制

安全性 url 中暴露数据 相对安全

可见性 url 中可见 不可见

## HTTP 状态码

1xx: 指示信息 - 表示请求已接收, 继续处理

2xx: 成功 - 表示请求已被成功接收

3xx: 重定向 - 要完成请求必须进行更进一步的操作

4xx: 客户端错误 - 请求有语法错误或请求无法实现

5xx: 服务器错误 - 服务器未能实现合法的请求

200 OK: 客户端请求成功

206 Partial Content: 客户发送了一个带有 Range 头的 GET 请求, 服务器完成了它. (常见于文件过大, 比如音频))

301 Moved Permanentyl: 所请求的页面已转移至新的 url

302 Found: 所请求的页面已临时转移至新的 url

304 Not Modified: 客户端有缓冲的文档并发出了一个条件性的请求, 服务器告诉客户, 原来缓冲的文档还可以继续使用

400 Bad Request: 客户端请求有语法错误, 不能被服务器所理解

401 Unauthorized: 请求未经授权, 这个状态码必须和 WWW-Authenticate 报头域一起使用

403 Forbidden: 对被请求页面的访问被禁止

404 Not Found: 请求资源不存在

500 Internal Server Error: 服务器发生不可预期的错误, 原来缓冲的文档还可以继续使用

504 Server Unavailable: 请求未完成, 服务器临时过载或宕机, 一段时间后可能恢复正常

## 304 协商缓存

301 和 302 有什么区别？分别适用于什么场景？

## 1xx: 信息响应类，表示接收到请求并且继续处理

100——必须继续发出请求
101——要求服务器根据请求转换 HTTP 协议版本

## 2xx: 处理成功响应类，表示动作被成功接收、理解和接受

**200**——交易成功
201——提示知道新文件的 URL
202——接受和处理、但处理未完成
203——返回信息不确定或不完整
204——请求收到，但返回信息为空
205——服务器完成了请求，用户代理必须复位当前已经浏览过的文件
**206**——服务器已经完成了部分用户的 GET 请求

## 3xx: 重定向响应类，为了完成指定的动作，必须接受进一步处理

300——请求的资源可在多处得到
301——删除请求数据
302——在其他地址发现了请求数据
303——建议客户访问其他 URL 或访问方式
**304**——客户端已经执行了 GET，但文件未变化
305——请求的资源必须从服务器指定的地址得到
306——前一版本 HTTP 中使用的代码，现行版本中不再使用
307——申明请求的资源临时性删除

## 4xx: 客户端错误，客户请求包含语法错误或者是不能正确执行

**400**——错误请求，如语法错误
**401**——未授权
402——保留有效 ChargeTo 头响应
**403**——禁止访问
404——没有发现文件、查询或 URl
405——在 Request-Line 字段定义的方法不允许
406——根据发送的 Accept，请求资源不可访问
407——用户必须首先在代理服务器上得到授权
408——客户端没有在指定的时间内完成请求
409——对当前资源状态，请求不能完成
410——服务器不再有此资源且无进一步地址
411——服务器拒绝用户定义的 Content-Length
412——一个或多个请求头字段在当前请求中错误
413——请求的资源大于服务器允许的大小
414——请求的资源 URL 长于服务器允许的长度
415——请求资源不支持请求项目格式
416——请求中包含 Range 请求头字段，在当前请求资源范围内没有 range 指示值，请求也不包含 If-Range 请求头字段
417——服务器不满足请求 Expect 头字段指定的期望值，如果是代理服务器，可能是下一级服务器不能满足请求长。

## 5xx: 服务端错误，服务器不能正确执行一个正确的请求

**500**——内部服务器错误
501——未实现
502——网关错误


## http 是一个无状态协议？

无状态就是客户端请求数据，服务端对这个请求不去记录、不去关注。

http 协议对于事务处理没有记忆能力
对同一个url请求没有上下文关系
每次的请求都是独立的，它的执行情况和结果与前面的请求和之后的请求是无直接关系的，它不会受前面的请求应答情况直接影响，也不会直接影响后面的请求应答情况
服务器中没有保存客户端的状态，客户端必须每次带上自己的状态去请求服务器
人生若只如初见，请求过的资源下一次会继续进行请求

http协议无状态中的 状态 到底指的是什么？！
【状态】的含义就是：客户端和服务器在某次会话中产生的数据
那么对应的【无状态】就意味着：这些数据不会被保留
but

通过增加cookie和session机制，现在的网络请求其实是有状态的
在没有状态的http协议下，服务器也一定会保留你每次网络请求对数据的修改，但这跟保留每次访问的数据是不一样的，保留的只是会话产生的结果，而没有保留会话

HTTP 和 HTTPS 的区别?
