import React, { useState, useEffect } from 'react'
import connect from '../connect'

const Example = ({ dispatch, list, NuomiEffects }) => {
  const [value, setValue] = useState()

  useEffect(() => {
    dispatch({ type: 'Nuomi/getName' })
  }, [])

  const onAdd = () => {
    dispatch({
      type: 'zoo/addName',
      payload: value
    })
  }

  const onDelete = () => {
    NuomiEffects.deleteOne()
    // 或 dispatch.NuomiEffects.deleteOne();
  }

  return (
    <div>
      <input onChange={(e) => setValue(e.target.value)} />
      <button onClick={onAdd}>add name</button>
      <button onClick={onDelete}>delete name</button>
      <br />
      <ul>
        {list.map((item, i) => {
          return <li key={item + i}>{item}</li>
        })}
      </ul>
    </div>
  )
}

export default connect(
  (state) => {
    return {
      list: state.Nuomi.list
    }
  },
  {},
  ['todo', 'nuomi']
)(Example)
