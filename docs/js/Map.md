# Map

Map 类似于对象，但普通对象的 key 必须是字符串或者数字，而 Map 的 key 可以是任何数据类型, 并且所有传入的 key 值都会被转化成 string 类型，而 Map 的 key 可以是各种数据类型格式。

Map 实例的属性和方法如下：

- size：获取成员的数量
- set：设置成员 key 和 value
- get：获取成员属性值
- has：判断成员是否存在
- delete：删除成员
- clear：清空所有

Map 实例的遍历方法有：

- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回所有成员的遍历器。
- forEach()：遍历 Map 的所有成员。

## WeakMap 和 Map 之间的区别

WeakMap 只能以复杂数据类型作为 key，并且 key 值是弱引用，对于垃圾回收更加友好。
