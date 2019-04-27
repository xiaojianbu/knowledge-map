# AJAX

```js
let xhr = new XMLHttpRequest() // 声明一个请求对象
xhr.onreadystatechange = function() {
  // readyState 代表已向服务器发送请求
  if (xhr.readyState === 4) {
    // status 200 代表服务器返回成功
    if (xhr.status === 200) {
      console.log(xhr.responseText) // 这是返回的文本
    } else {
      console.log('Error: ' + xhr.status) // 连接失败的时候抛出错误
    }
  }
}
xhr.open('GET', 'xxxx')
// 如何设置请求头? xhr.setRequestHeader(header, value);
xhr.setRequestHeader('Content-Type', 'application/json')
```

## XMLHttpRequest

XMLHttpRequest 是一个 API, 它为客户端提供了在客户端和服务器之间传输数据的功能。

### XMLHttpRequest 语法

```js
let xhr = new XMLHttpRequest()
```

### XMLHttpRequest 使用

```js
let xhr = new XMLHttpRequest()
xhr.open(method, url,)
xhr.onreadystatechange = function(){...}
xhr.setRequestHeader(...,...)
xhr.send(optionalEncodedData)
```

- onreadystatechange: Function - 当 readyState 属性改变时会调用它。
- readyState: unsigned short - 用于表示请求的五种状态：

| 值  | 状态                            | 描述                                            |
| --- | ------------------------------- | ----------------------------------------------- |
| 0   | UNSENT (未打开)                 | 表示已创建 XHR 对象，open() 方法还未被调用      |
| 1   | OPENED (未发送                  | open() 方法已被成功调用，send() 方法还未被调用  |
| 2   | HEADERS_RECEIVED (已获取响应头) | send() 方法已经被调用，响应头和响应状态已经返回 |
| 3   | LOADING (正在下载响应体)        | 响应体下载中，responseText 中已经获取了部分数据 |
| 4   | DONE (请求完成)                 | 整个请求过程已经完毕                            |

- response: varies - 响应体的类型由 responseType 来指定，可以是 ArrayBuffer、Blob、Document、JSON，或者是字符串。如果请求未完成或失败，则该值为 null。
- responseText: DOMString - 此请求的响应为文本，或者当请求未成功或还是未发送时未 null (只读)
- responseType: XMLHttpRequestResponseType - 设置该值能够改变响应类型。
- status: unsigned short - 请求的响应状态码，如 200 (表示一个成功的请求)。 (只读)
- statusText: DOMString - 请求的响应状态信息，包含一个状态码和消息文本，如 "200 OK"。 (只读)
- timeout: unsigned long - 表示一个请求在被自动终止前所消耗的毫秒数。默认值为 0，意味着没有超时时间。超时并不能应用在同步请求中，否则会抛出一个 InvalidAccessError 异常。当发生超时时，timeout 事件将会被触发。
- upload: XMLHttpRequestUpload - 可以在 upload 上添加一个事件监听来跟踪上传过程

#### 方法

- abort() - 如果请求已经被发送，则立刻中止请求。
- getAllResponseHeaders() - 返回所有响应头信息(响应头名和值)，如果响应头还没有接收，则返回 null。注意：使用该方法获取的 response headers 与在开发者工具 Network 面板中看到的响应头不一致
- getResponseHeader() - 返回指定响应头的值，如果响应头还没有被接收，或该响应头不存在，则返回 null。
- open() - 初始化一个请求
- overrideMimeType() - 重写由服务器返回的 MIME 类型。例如，可以用于强制把响应流当做 text/xml 来解析，即使服务器没有指明数据是这个类型。注意：这个方法必须在 send() 之前被调用。
- send() - 发送请求。如果该请求是异步模式(默认)，该方法会立刻返回。相反，如果请求是同步模式，则直到请求的响应完全接受以后，该方法才会返回。注意：所有相关的事件绑定必须在调用 send() 方法之前进行。
- setRequestHeader() - 设置 HTTP 请求头信息。注意：在这之前，你必须确认已经调用了 open() 方法打开了一个 url
- sendAsBinary() - 发送二进制的 send() 方法的变种。

#### 事件

- loadstart - 当程序开始加载时，loadstart 事件将被触发。
- progress - 进度事件会被触发用来指示一个操作正在进行中。
- abort - 当一个资源的加载已中止时，将触发 abort 事件。
- error - 当一个资源加载失败时会触发 error 事件。
- load - 当一个资源及其依赖资源已完成加载时，将触发 load 事件。
- timeout - 当进度由于预定时间到期而终止时，会触发 timeout 事件。
- loadend - 当一个资源加载进度停止时 (例如，在已经分派“错误”，“中止”或“加载”之后)，触发 loadend 事件。
- readystatechange - readystatechange 事件会在 document.readyState 属性发生变化时触发。

```js
let xhr = new XMLHttpRequest()
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    doSomething(xhr.responseText)
  }
}
let url = './test'
// get
xhr.open('GET', url)
xhr.send()

// post
xhr.open('POST', url)
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
xhr.send('firstName=1$lastName=2')
```

## 什么情况下 XMLHttpRequest status 会为 0？

XMLHttpRequest 返回 status 时，会执行以下步骤：

- 如果状态是 UNSENT 或 OPENED，则返回 0
- 如果错误标志被设置，则返回 0
- 否则返回 HTTP 状态码

## 为什么 GET 或 HEAD 请求，不能通过 send() 方法发送请求体

通过 XMLHttpRequest 规范, 当请求方法是 GET 或 HEAD 时，send() 方法的 body 参数值将会被忽略。

常用的 GET 请求,参数传递可以使用以下两种方式：

- URL 传参 - 常用方式，有大小限制大约为 2KB
- 请求头传参 - 一般用于传递 token 等认证信息

## 什么是简单请求和预请求 (preflight request)

简单请求: 一些不会触发 CORS 预请求 的请求被称为 "简单请求"

预请求： "预请求" 要求必须先发送一个 OPTIONS 方法请求给目的站点，来查明这个跨站请求对于目的站点是不是安全的可接受的。

## 怎样防止重复发送 AJAX 请求？

disable 按钮

[怎样防止重复发送 Ajax 请求？](https://www.zhihu.com/question/19805411)

## 来源

[你不知道的 XMLHttpRequest - 掘金](https://juejin.im/post/58e4a174ac502e006c1e18f4)
