// 封装后的 connect 扩展了很多功能，组件中获得的 dispatch 不再仅仅触发 action，而是直接 调用 effects 中的方法，更方便副作用处理，同时增加了 effects 依赖注入的接口（类似 Mobx 中的 inject)。
import React from 'react'
import { connect } from 'react-redux'
import Nuomi from './Nuomi'

// effectsArr 可作为 effects 依赖注入使用
export default (mapState, mapDispatch = {}, effectArr = []) => {
  return (Component) => {
    const { dispatch, getState } = Nuomi.store

    // 修改组件的 dispatch 默认现触发 effects 中对应方法，不存在时作为正常 action dispatch
    const myDispatch = ({ type, payload }) => {
      const [typeId, typeName] = type.split('/')
      const { effects } = Nuomi

      if (effects[typeId] && effects[typeId][typeName]) {
        return effects[typeId][typeName](payload)
      }

      dispatch({ type, payload })
    }

    const NewComponent = (props) => {
      const { effects } = Nuomi
      const effectsProps = {}
      // 组件中扩展加入 effects 对象
      effectArr.forEach((item) => {
        if (effects[item]) {
          effectsProps[`${item}Effects`] = effects[item]
          myDispatch[`${item}[Effects]`] = effects[item]
        }
      })

      return <Component {...props} dispatch={dispatch} {...effectsProps} />
    }

    return connect(mapState, mapDispatch)(NewComponent)
  }
}
