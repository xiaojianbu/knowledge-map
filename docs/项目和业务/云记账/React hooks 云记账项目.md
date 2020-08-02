# React hooks 云记账项目

## 使用情况

项目大概总共有 650+ React 组件；100+ 组件使用 setState, 150+ 组件使用了 hooks, 其余为渲染组件没有状态。

封装常用的自定义 hooks 5 个：useRequest、useEventListener、useModal、useScrollBar、useScrollBarShow。

## hooks

### 相同点

类组件的功能几乎都有 hook 的对应：

setState ==》 useState

class 组件的生命周期 ==》 useEffect

pureComponent 的性能优化 ==》 通过合理使用 React.memo,useEffect,useCallback,useMemo 来进行优化

```js
useEffect(() => {
  const newData = getDataWithChange(dateChange)
  setData(newData)
}, [dateChange])

// 上面也可以换为
const newData = useMemo(() => {
  getDataWithChange(dateChange)
}, [dateChange])
```

### 不同

setState ==》 useState 的不同: useState 更新 state 变量总是替换它而不是合并它。使用上面

```js
// 类组件的 state
state = {
  index: 0,
  length: 0,
  data: [],
  listIndex: 0,
  lineIndex: 0
}

// hooks 原子化
const [index, setIndex] = useState(0)
const [length, setLength] = useState(0)
const [data, setData] = useState([])
```

使用类组件常用的生命周期事件，可以用 useEffect 代替。

useEffect 一共有 3 部分，即本体、返回的清理函数、依赖数组，分别对应生命周期的主要部分、componentDidUpdate 和 componentWillUnmount 里的清理逻辑、componentDidUpdate 里的 if 分支用到的属性。

示例：

```js
import React, { useState, useEffect, useRef } from 'react'
import Icon from 'Icon'

// class
class PaySuccess extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {
    if (prevProps.data == props.data) return
  }
  componentWillUnmount() {}
  render() {
    return <div>test</div>
  }
}

// hooks
const PaySuccess = ({ money, onCancel }) => {
  // setState转到useState
  const [time, setTime] = useState(3)
  // 和render无关的属性可以用useRef来保存
  const timeRef = useRef(time)

  timeRef.current = time

  // 类组件的生命周期核心部分用useEffect代替
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = timeRef.current
      if (currentTime > 0) {
        setTime(currentTime - 1)
      } else {
        clearInterval(timer)
        onCancel()
      }
    }, 1000)

    // 返回清理逻辑
    return () => {
      clearInterval(timer)
    }

    // componentDidUpdate 中的if对应判断
    // 注意：useEffect() 的依赖数组，只要是 useEffect() 中用到的，都要在依赖数组中申明。
  }, [onCancel])

  return (
    <span>
      <Icon type='zhengque' className='e-mr5' />
      支付成功！感谢您的打赏金{money}元，<s className='f-cred'>{time}s</s>后自动跳转到打赏页面
    </span>
  )
}

export default PaySuccess
```

### 优点

使用 hooks 向 props 或状态取值更加方便，函数组件的取值都从父级作用域直接取，而类组件需要先访问实例引用 this，再访问其属性 state 和 props。

useEffects 减少重复逻辑

自定义 hooks 用以抽出逻辑
