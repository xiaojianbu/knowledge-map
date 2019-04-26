# complier 实现

模板解析这种事，本质是将数据转化为一段 html ，最开始出现在后端，经过各种处理吐给前端。随着各种 mv* 的兴起，模板解析交由前端处理。
总的来说，Vue complier 是将 template 转化成一个 render 字符串。
可以简单理解成以下步骤：

parse 过程，将 template 利用正则转化成 AST 抽象语法树。
optimize 过程，标记静态节点，后 diff 过程跳过静态节点，提升性能。
generate 过程，生成 render 字符串。
