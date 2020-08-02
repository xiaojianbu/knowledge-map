/**
 * 这是一个精简版的redux
 */

export default function createStore(reducer) {
  let currentState = undefined
  let listeners = []
  function getState() {
    return currentState
  }
  function subscribe(callback) {
    listeners.push(callback)
  }
  function dispatch(action) {
    if (action.type === 'undefined') {
      throw Error('必须要有type')
    }
    currentState = reducer(currentState, action)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
    return action
  }

  dispatch({
    type: Symbol('symbol')
  })

  return {
    dispatch,
    subscribe,
    getState
  }
}
