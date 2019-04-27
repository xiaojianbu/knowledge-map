# Token 验证

JSON Web Token(JWT)是一个非常轻巧的规范，允许我们使用 JWT 在用户和服务器之间传递安全可靠的信息。

## JWT 的组成

一个 JWT 实际上就是一个字符串，由三部分组成，**头部**、**载荷**与**签名**

### 载荷（Payload）

将添加好友的操作描述成一个 JSON 对象

```json
{
  "iss": "John Wu JWT",
  "iat": 1441593502,
  "exp": 1441594722,
  "aud": "www.example.com",
  "sub": "jrocket@example.com",
  "from_user": "B",
  "target_user": "A"
}
```

JWT 的标准所定义的。

- iss: 该 JWT 的签发者
- sub: 该 JWT 所面向的用户
- aud: 接收该 JWT 的一方
- exp(expires): 什么时候过期，这里是一个 Unix 时间戳
- iat(issued at): 在什么时候签发的

将上面的 JSON 对象进行 base64 编码可以得到一个字符串，这个字符串称为 JWT 的 Payload（载荷）。

### 头部（Header）

JWT 还需要一个头部，头部用于描述关于该 JWT 的最基本的信息，例如其类型以及签名所用的算法等。这也可以被表示成一个 JSON 对象。

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

说明了这是一个 JWT，并且所用的签名算法是 HS256 算法

对其进行 Base64 编码，之后的字符串就成为 JWT 的 Header。

### 签名

将上面的两个编码后的字符串都用句号.连接在一起（头部在前）。最后将上面拼接完的字符串用 HS256 算法进行加密。加密后的内容又叫做签名。最后将这一部分签名也拼接在被签名的字符串后面，我们就得到了完整的 JWT。

## Token 的工作原理

1. 登录时候,客户端通过用户名与密码请求登录
2. 服务端收到请求区验证用户名与密码
3. 验证通过,服务端会签发一个 Token,再把这个 Token 发给客户端.
4. 客户端收到 Token,存储到本地,如 Cookie,SessionStorage,LocalStorage.我们是存在 SessionStorage
5. 客户端每次像服务器请求 API 接口时候,都要带上 Token.
6. 服务端收到请求,验证 Token,如果通过就返回数据,否则提示报错信息.

## 来源资料

[JSON Web Token - 在 Web 应用间安全地传递信息](https://blog.leapoahead.com/2015/09/06/understanding-jwt/)

[八幅漫画理解使用 JSON Web Token 设计单点登录系统](https://blog.leapoahead.com/2015/09/07/user-authentication-with-jwt/)

[单页应用 - Token 验证](https://juejin.im/post/58da720b570c350058ecd40f?utm_source=gold_browser_extension#comment)
