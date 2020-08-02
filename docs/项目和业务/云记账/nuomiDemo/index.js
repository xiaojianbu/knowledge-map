import { Provider } from 'react-redux'
import Nuomi from '../Nuomi'
import model from './model'
import Example from './example'

// 只需要传入各模块 model 即可
const NuomiStore = Nuomi.init({
  model
})

render(
  <Provider store={NuomiStore}>
    <ZooExample />
  </Provider>,
  document.getElementById('root')
)
