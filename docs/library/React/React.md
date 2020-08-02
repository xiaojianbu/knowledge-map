# React

声明式 (state) => UI

组件化

## JSX

在 js 中写类似 html 代码的方式就是 jsx,是 React.createElement(component, props, …children) 函数的语法糖。

每个 DOM 结构都可以通过 DOM 名称, DOM 属性，DOM 子元素来表示，DOM 一层套一层形成了 DOM 树。

ReactDOM 用于渲染组件并构造 DOM 树，然后插入到页面上的某个挂载点上。

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

# React

- 熟悉 React 之后
  - 探索 create-react-app
  - 创建自身的项目脚手架
- 前置技术
  - JSX 语法
  - ReactDOM.render
  - 使用 setState 来改变组件的状态 state
  - 组件生命周期相关的方法
  - 事件和表单
  - 几种创建组件的方式
  - 复合组件 composeable
  - 高阶组件的使用和定义 HOC
- 学习 Redux 前得先学好 React
  - 不是所有的状态都需要放在 Redux 的 Store 中，也不能完全取代 setState
  - [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367#.cf6osrz3q)

## 声明式的 React 组件

- React.createClass 使用这个 API 来定义组件
- React ES6 class components 使用 ES6 的 class 来定义组件
- Functional stateless components 通过函数直接定义无状态组件(Hooks)

无状态组件：适合用来声明没有组件生命周期方法并且没有内部状态的组件。这种写法很简单，就是一个纯函数，一个状态输入，输出就是 elements。

## 轻量级的函数式无状态组件

```jsx
function TodoList({ list }) {
  return (
    <div>
      {map(list, (item) => (
        <div>{item.name}</div>
      ))}
    </div>
  )
}

function TodoList({ list }) {
  return (
    <div>
      {map(list, (item) => (
        <TodoItem item={item} />
      ))}
    </div>
  )
}
function TodoItem({ item }) {
  return <div>{item.name}</div>
}
```

### 简洁的函数式无状态组件

```jsx
const Button = ({ onClick, children }) => {
  // do something

  return (
    <button onClick={onClick} type='button'>
      {children}
    </button>
  )
}
```

### 木偶组件和容器组件

1. 木偶组件只接受传递进来的 props 和 callback，然后返回对应需要展示的 view，这种组件比较单纯，大部分都是无状态组件，给我啥我就展示啥，给我什么 callback 我就执行 callback，相同的输入总能得到相同的输出，像个机器人或是像个木偶，很纯粹很简单很可控；
2. 而容器组件内更多的是关注逻辑，你需要在容器组件中准备好数据和一些 callback 函数，在这里处理一些事件或管理内部的状态，给木偶组件传递所需的数据，大致的意思就是，容器组件对木偶组件说：调度或是逻辑处理的事就交给我吧，你需要啥我给你啥，你安心干你的活就行，保证给我的产出即可。

当项目中使用了 Redux 的时候，Container Component 有个更好理解的名字，就是 Connected Component。这类组件和 Redux 的 store 进行了连接，并且获取到 store 的数据之后进行一些操作后传递给子组件。

### HOC

```jsx
// 高阶组件
function withLoadingSpinner(Component) {
  return function EnhancedComponent({ isLoading, ...props }) {
    if (!isLoading) {
      return <Component {...props} />
    }
    return <LoadingSpinner />
  }
}
const ListItemsWithLoadingIndicator = withLoadingSpinner(ListItems)

;<ListItemsWithLoadingIndicator isLoading={props.isLoading} list={props.list} />
```

## Redux 的实现源码

https://egghead.io/courses/getting-started-with-redux

https://egghead.io/lessons/react-redux-implementing-store-from-scratch

https://egghead.io/lessons/react-redux-implementing-combinereducers-from-scratch

https://egghead.io/courses/building-react-applications-with-idiomatic-redux

https://github.com/reduxjs/redux/tree/master/src

## 测试

https://medium.com/javascript-inside/some-thoughts-on-testing-react-redux-applications-8571fbc1b78f#.ga0hgosc7
