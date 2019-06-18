# loader

模块和资源的转换器,把源模块转换成通用模块（JavaScript 和 JSON 文件）。在 webpack 的定义中，loader 导出一个函数，loader 会在转换源模块 resource 的时候调用该函数。

## 有哪些常见的 Loader？他们是解决什么问题的

- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
- url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
- source-map-loader：加载额外的 Source Map 文件，以方便断点调试
- image-loader：加载并且压缩图片文件
- babel-loader：把 ES6 转换成 ES5
- css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
- style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
- eslint-loader：通过 ESLint 检查 JavaScript 代码

## 使用

```js
const path = require('path')

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    // test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件
    // use 属性，表示进行转换时，应该使用哪个 loader
    rules: [{ test: /\.txt$/, use: 'raw-loader' }]
  }
}
```

loader 从右到左地取值(evaluate)/执行(execute)。在下面的示例中，从 sass-loader 开始执行，然后继续执行 css-loader，最后以 style-loader 为结束。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
}
```

## 原理

Loader 像一个"翻译官"把读到的源文件内容转义成新的文件内容，并且每个 Loader 通过链式操作，将源文件一步步翻译成想要的样子。

编写 Loader 时要遵循单一原则，每个 Loader 只做一种"转义"工作。 每个 Loader 的拿到的是源文件内容（source），可以通过返回值的方式将处理后的内容输出，也可以调用 this.callback()方法，将内容返回给 webpack。 还可以通过 this.async()生成一个 callback 函数，再用这个 callback 将处理后的内容输出出去。

## 写一个 Webpack Loader

```js
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source
}
```

```js
// text-loader
module.exports = function(content, map, meta) {
  result = pairToObj(content)
  return `module.exports = ${JSON.stringify(result, null, 2)}`
}

function pairToObj(content) {
  if (!str) {
    return ''
  }
  const obj = {}
  str
    .replace('\n\r', '\n')
    .split('\n')
    .map(line => line.trim())
    .forEach(line => {
      if (!line) {
        return
      }
      const parts = line.split(':')
      obj[parts[0]] = parts[1]
    })
  return obj
}
```

最后一个 loader 的返回值交给 webpack 的 require，是一个 node 模块的 JS 脚本，所以我们需要用 module.exports =导出。

## 参考

[loader](https://webpack.docschina.org/concepts/#loader)

[loaders](https://webpack.docschina.org/concepts/loaders/)

[writing-a-loader](https://webpack.docschina.org/contribute/writing-a-loader)

[如何写一个 Webpack Loader](https://github.com/xiangxingchen/blog/issues/17)
