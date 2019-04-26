// 单例模式

class MySingleton {
  static getInstance() {
    if (!this.instance) {
      this.instance = new MySingleton()
    }

    return this.instance
  }

  publicMethod() {
    console.log('The public can see me!')
  }
}

let cache = MySingleton.getInstance()
