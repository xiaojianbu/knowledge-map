var cssParser = require('css')

function transform(cssText) {
  let newCssText = cssText
  const css = cssParser.parse(newCssText)
  console.log('css', css, '\n')
  let result = {}
  result = transformRules(this, css.stylesheet.rules, result)
  console.log('result', result, '\n')
}

function transformRules(self, rules, result) {
  const newResult = result
  rules.forEach(rule => {
    const obj = {}
    if (rule.type === 'media') {
      const name = mediaNameGenerator(rule.media)
      newResult[name] = newResult[name]
      const media = {
        __expression__: rule.media
      }
      transformRules(self, rule.rules, media)
    } else if (rule.type === 'rule') {
      console.log('rule.declarations', rule.declarations, '\n')
      rule.declarations.forEach(declaration => {
        if (declaration.type === 'declaration') {
          const cleanProperty = cleanPropertyName(declaration.property)
          obj[cleanProperty] = declaration.value
        }
      })
      rule.selectors.forEach(selector => {
        // 去掉选择器的 '.'
        const name = selector.trim().substring(1)
        newResult[name] = obj
      })
    }
  })
  return newResult
}

const mediaNameGenerator = name => {
  return `@media ${name}`
}

const cleanPropertyName = name => {
  let newName = name
  // 'align-items' ==> 'alignItems'
  newName = newName.replace(/(-.)/g, v => {
    return v[1].toUpperCase()
  })

  return newName
}

transform(`@media screen and (min-width: 480px) {
  body {
      background-color: lightgreen;
  }
}

#main {
  border: 1px solid black;
}

ul li {
padding: 5px;
}`)
