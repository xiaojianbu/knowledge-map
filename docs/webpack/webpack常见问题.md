# webpack 常见问题

## css-loader 和 style-loader 的内容和区别

## webpack 打包是如何处理 css 图片

## webpack 如何解析代码模块路径

模块解析规则

1. 解析相对路径
2. 查找相对当前模块的路径下是否有对应文件或文件夹
3. 是文件则直接加载
4. 是文件夹则继续查找文件夹下的 package.json 文件
   有 package.json 文件则按照文件中 main 字段的文件名来查找文件
   无 package.json 或者无 main 字段则查找 index.js 文件
5. 解析模块名
   查找当前文件目录下，父级目录及以上目录下的 node_modules 文件夹，看是否有对应名称的模块
   解析绝对路径（不建议使用）
   直接查找对应路径的文件

resolve.alias
配置某个模块的别名

resolve.extensions
配置可以定义在进行模块路径解析时，webpack 会尝试帮你补全那些后缀名来进行查找
