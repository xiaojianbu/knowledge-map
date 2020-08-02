# GPU 加速

https://aotu.io/notes/2017/04/11/GPU/index.html

什么是 GPU 加速，如何使用 GPU 加速，GPU 加速的缺点

优点：使用 transform、opacity、filters 等属性时，会直接在 GPU 中完成处理，这些属性的变化不会引起回流重绘
缺点：GPU 渲染字体会导致字体模糊，过多的 GPU 处理会导致内存问题
