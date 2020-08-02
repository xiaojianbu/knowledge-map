export default {
  namespace: 'Nuomi',
  state: {
    list: []
  },
  effects: {
    setState(payload) {
      const state = this.getState()
      this.dispatch({ type: 'setState', payload })
    },
    addName(name) {
      const { list } = this.getState().Nuomi
      this.setState({ list: [...list, name] })
    },
    async deleteOne() {
      const { list } = this.getState().Nuomi
      const res = [...list]
      // 模拟异步请求操作
      setTimeout(() => {
        res.pop()
        this.setState({ list: res })
      }, 1000)
    }
  },
  reducer: {
    setState: (payload, state) => ({ ...state, ...payload })
  }
}
