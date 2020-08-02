// redux 中核心是一个单一的 state,state 通过闭包的形式存放在 redux store 中，保证其是只读的。如果想要更改 state，只能通过发送 action 进行，action本质上就是一个普通的对象，可以通过redux暴露的subscribe方法，订阅state变化。在 react 应用中使用 redux，则表现为 react 订阅 store 变化，并 re-render视图，redux 通过 reducer 来更新 state。reducer被要求是一个纯函数

// const store = {
//   state: {}, // 全局唯一的state,内部变量，通过getState()获取
//   listeners: [], // listeners, 用来做诸如视图更新的操作
//   dispatch: () => {}, // 分发 action
//   subscribe: () => {}, // 用来订阅 state 变化
//   getState: () => {} // 获取 state
// }

// createStore，返回 store 对象
const createStore = (reducer, initialState) => {
  // internal variables
  const store = {}
  store.state = initialState
  store.listeners = []

  // api-subscribe
  store.subscribe = (listener) => {
    store.listeners.push(listener)
  }
  // api-dispatch
  store.dispatch = (action) => {
    store.state = reducer(store.state, action)
    store.listeners.forEach((listener) => listener())
  }

  // api-getState
  store.getState = () => store.state

  return store
}

// reducer
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// let store = createStore(counter)

// store.subscribe(() => console.log(store.getState()))

// store.dispatch({ type: 'INCREMENT' })
// // 1
// store.dispatch({ type: 'INCREMENT' })
// // 2
// store.dispatch({ type: 'DECREMENT' })
// // 1

// 用reduce实现compose，很巧妙。
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// applyMiddleware 的源码
function applyMiddleware(...middlewares) {
  return (createStore) => (...args) => {
    const store = createStore(...args)
    let dispatch = () => null
    let chain = []

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    chain = middlewares.map((middleware) => middleware(middlewareAPI))
    // 将middlewares组成一个函数
    // 也就是说就从前到后依次执行middlewares
    dispatch = compose(...chain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}

function logger() {
  
}
function dispatchAndLog() {
  
}

// 使用
let store = createStore(
  counter,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(logger, dispatchAndLog)
)
