# plugin

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.js"></script>
<div id="app">
  <form @submit="validate">
    <input v-model="text" />
    <br />
    <input v-model="email" />

    <ul v-if="!$v.valid" style="color:red">
      <li v-for="error in $v.errors">
        {{ error }}
      </li>
    </ul>
    <input type="submit" :disabled="!$v.valid" />
  </form>
</div>
<script>
  const emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const validationPlugin = {
    install(Vue) {
      // 全局注入的方法
      Vue.mixin({
        computed: {
          $v() {
            const rules = this.$options.validations
            let valid = true
            let errors = []
            Object.keys(rules || {}).forEach(key => {
              const rule = rules[key]
              const value = this[key]
              const result = rule.validate(value)
              if (!result) {
                valid = false
                errors.push(rule.message(key, value))
              }
            })
            return {
              valid,
              errors
            }
          }
        }
      })
    }
  }
  Vue.use(validationPlugin)
  new Vue({
    el: '#app',
    data: {
      text: 'foo',
      email: ''
    },
    validations: {
      text: {
        validate: value => value.length >= 5,
        message: (key, value) =>
          `${key} should have a min length of 5, but got ${value.length}`
      },
      email: {
        validate: value => emailRE.test(value),
        message: key => `${key} must be a valid email`
      }
    },
    methods: {
      validate(e) {
        if (!this.$v.valid) {
          e.preventDefault()
          alert('not valid!')
        }
      }
    }
  })
</script>
```
