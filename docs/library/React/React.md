# React

声明式 (state) => UI

组件化

## 简单组件

```jsx
const HelloMessage = ({ name }) => {
  return <div>Hello {this.props.name}</div>
}
```

## 有状态组件

```jsx
const Timer = () => {
  const [seconds, setSeconds] = useState(0)

  const tick = () => {
    setSeconds(count + 1)
  }

  useEffect(() => {
    this.interval = setInterval(() => this.tick(), 1000)

    return () => {
      clearInterval(this.interval)
    }
  })

  return <div>Seconds:{seconds}</div>
}
```

## TODO

```jsx
const TodoList = ({ items }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  )
}

const TodoApp = () => {
  const [items, setItems] = useState([])
  const [text, setText] = useState('')

  const handleChange = (e) => {
    setText(e.target.value)
  }
  const handleSubmit = (e) => {
    console.log(1)
    e.preventDefault()
    if (!text.length) {
      return
    }
    const newItem = {
      text,
      id: Date.now()
    }
    console.log(items.concat(newItem))
    setItems(items.concat(newItem))
    setText('')
  }

  return (
    <div>
      <h3>TODO</h3>
      <TodoList items={items} />
      <form onSubmit={handleSubmit}>
        <label htmlFor='new-todo'>What needs to be done?</label>
        <input id='new-todo' onChange={handleChange} value={text} />
        <button>Add #{items.length + 1}</button>
      </form>
    </div>
  )
}
```

有状态的组件没有渲染，有渲染的组件没有状态。

hooks 抽出了逻辑

”有状态，没渲染；有渲染，没状态“这种理念能快速迁移到 hooks，其实就是把抽出来的那部分状态和逻辑用 hooks 来实现。

“有状态的组件没有渲染”：
包含实际业务状态的组件不应该进行视图的渲染，而是应该将实际业务状态传递给子孙组件，让子孙组件来进行视图渲染；
“有渲染的组件没有状态”：
能够进行视图渲染的组件，不要包含实际的业务状态，而是通过接受父辈的参数来进行渲染；
这样的话，有渲染的组件没有实际的业务状态，就与实际的业务解耦了，能够更好的服务于其他的有状态的组件，实现组件的复用。
