# diff 算法

diff 的实现主要通过两个方法，patchVnode 与 updateChildren 。
patchVnode 有两个参数，分别是老节点 oldVnode, 新节点 vnode 。主要分五种情况：

if (oldVnode === vnode)，他们的引用一致，可以认为没有变化。
if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)，文本节点的比较，需要修改，则会调用 Node.textContent = vnode.text。
if( oldCh && ch && oldCh !== ch ), 两个节点都有子节点，而且它们不一样，这样我们会调用 updateChildren 函数比较子节点，这是 diff 的核心，后边会讲到。
if (ch)，只有新的节点有子节点，调用 createEle(vnode)，vnode.el 已经引用了老的 dom 节点，createEle 函数会在老 dom 节点上添加子节点。
if (oldCh)，新节点没有子节点，老节点有子节点，直接删除老节点。
