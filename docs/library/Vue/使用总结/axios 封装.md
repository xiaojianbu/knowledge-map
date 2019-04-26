# axios 封装

```javascript
// request.js
import axios from 'axios'
import { Message } from 'element-ui'
import {
  showFullScreenLoading,
  tryHideFullScreenLoading
} from './requestHelper'
import store from '../store/index'

const service = axios.create({
  // timeout: 5000
})

service.interceptors.request.use(
  config => {
    if (config.showLoading) {
      showFullScreenLoading()
    }
    let tokenid = sessionStorage.getItem('tokenid')
    // let set_id = sessionStorage.getItem('set_id')
    let set_id = store.state.setId

    config.params = {
      tokenid,
      set_id,
      ajax: 'noCache',
      ...config.params
    }

    return config
  },
  error => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    if (response.config.showLoading) {
      tryHideFullScreenLoading()
    }
    return response
  },
  error => {
    tryHideFullScreenLoading()
    Message({
      showClose: true,
      message: error.message,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default service
```

```javascript
// requestHelper.js
import { Loading } from 'element-ui'

let needLoadingRequestCount = 0
let loading

const startLoading = () => {
  loading = Loading.service({
    lock: true,
    // text: '加载中...',
    spinner: 'loading-img',
    background: 'rgba(255, 255, 255, 0.7)'
  })
}

const endLoading = () => {
  loading.close()
}

const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export const showFullScreenLoading = () => {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }

  needLoadingRequestCount += 1
}

export const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) {
    return
  }
  needLoadingRequestCount -= 1
  if (needLoadingRequestCount === 0) {
    _.debounce(tryCloseLoading, 300)()
  }
}
```

其它参考：[https://juejin.im/post/5b6ce7ee51882536e517b13f](https://juejin.im/post/5b6ce7ee51882536e517b13f)
