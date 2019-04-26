{ // 简单工厂模式
  let XMLHttpFactory = function () {}
  // 根据当前环境的具体情况返回一个XHR对象
  XMLHttpFactory.createXMLHttp = function () {
    let XMLHttp = null
    if (window.XMLHttpRequest) {
      XMLHttp = new XMLHttpRequest()
    } else if (window.ActiveXObject) {
      XMLHttp = new ActiveXObject('Microsoft.XMLHTTP')
    }

    return XMLHttp
  }
}

// 复杂工厂模式：流程 ==》先设计一个抽象类，这个类不能被实例化，只能用来派生子类，最后通过对子类的扩展实现工厂方法。

{
  let XMLHttpFactory = function () {}

  XMLHttpFactory.prototype = {
    // 如果真的调用这个方法会抛出一个错误，它不能被实例化，只能用来派生子类
    createFactory: function () {
      throw new Error('This is an abstract class')
    }
  }
  // 定义子类
  let XHRHandler = function () {}
  extend(XHRHandler, XMLHttpFactory)
  // 把超类原型引用传递给子类,实现继承
  XHRHandler.prototype = new XMLHttpFactory()
  // 重置子类原型的构造器为子类自身
  XHRHandler.prototype.constructor = XHRHandler

  // 重新定义createFactory 方法
  XHRHandler.prototype.createFactory = function () {
    let XMLHttp = null
    if (window.XMLHttpRequest) {
      XMLHttp = new XMLHttpRequest()
    } else if (window.ActiveXObject) {
      XMLHttp = new ActiveXObject('Microsoft.XMLHTTP')
    }

    return XMLHttp
  }
}
