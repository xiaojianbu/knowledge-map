function Context(_state) {
  this.state = _state
  this.request = function () {
    this.state.Handle(this)
  }
}

function ConcreteStateA() {
  this.Handle = function (context) {
    console.log('A')
    context.state = new ConcreteStateB()
  }
}

function ConcreteStateB() {
  this.Handle = function (context) {
    console.log('B')
    context.state = new ConcreteStateA()
  }
}

// 设置 Context 的初始状态为 ConcreteStateA
let context = new Context(new ConcreteStateA())
// 不断的进行请求，同时更改状态
context.request()
context.request()
