import cssParser from 'css';

const mediaNameGenerator = (name) => {
  return `@media ${name}`;
};

const cleanPropertyName = (name) => {
  let newName = name;
  // 'align-items' ==> 'alignItems'
  newName = newName.replace(/(-.)/g, (v) => {
    return v[1].toUpperCase();
  });

  return newName;
};

function transformRules(self, rules, result) {
  const newResult = result;
  rules.forEach((rule) => {
    const obj = {};
    if (rule.type === 'media') {
      const name = mediaNameGenerator(rule.media);
      newResult[name] = newResult[name];
      const media = {
        __expression__: rule.media,
      };
      transformRules(self, rule.rules, media);
    } else if (rule.type === 'rule') {
      rule.declarations.forEach((declaration) => {
        if (declaration.type === 'declaration') {
          const cleanProperty = cleanPropertyName(declaration.property);
          obj[cleanProperty] = declaration.value;
        }
      });
      rule.selectors.forEach((selector) => {
        // 去掉选择器的 '.'
        const name = selector.trim().substring(1);
        newResult[name] = obj;
      });
    }
  });
  return newResult;
}

export function transform(cssText) {
  let newCssText = cssText;
  if (!newCssText) {
    throw new Error('missing css text to transform');
  }
  // 如果输入的“ css”未使用css类包装（原始样式），需要使用一种样式将其包装起来，以使css解析器不会阻塞。
  let bootstrapWithCssClass = false;
  if (newCssText.indexOf('{') === -1) {
    bootstrapWithCssClass = true;
    newCssText = `.bootstrapWithCssClass { ${newCssText} }`;
  }
  const css = cssParser.parse(newCssText);
  let result = {};
  result = transformRules(this, css.stylesheet.rules, result);

  if (bootstrapWithCssClass) {
    result = result.bootstrapWithCssClass;
  }
  return result;
}
