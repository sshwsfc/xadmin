
export default (errors) => {
  if (!(errors && errors.length)) return
  for (let i = 0 ; i < errors.length; i++) {
    let e = errors[i]
    let out
    let schema = e.schema
    switch (e.keyword) {
      case '$ref': {
        out = '无法找到引用' + (e.params.ref)
        break
      }
      case 'additionalItems': {
        out = ''
        let n = e.params.limit
        out += '不允许超过' + (n) + '个元素'
        break
      }
      case 'additionalProperties': {
        out = '不允许有额外的属性'
        break
      }
      case 'anyOf': {
        out = '数据应为 anyOf 所指定的其中一个'
        break
      }
      case 'const': {
        out = schema.constantName ? ('与 ' + schema.constantName + ' 不相等') : '应当等于常量'
        break
      }
      case 'custom': {
        out = '应当通过 "' + (e.keyword) + ' 关键词校验"'
        break
      }
      case 'dependencies': {
        out = ''
        let n = e.params.depsCount
        out += '应当拥有属性' + (e.params.property) + '的依赖属性' + (e.params.deps)
        break
      }
      case 'enum': {
        out = '应当是预设定的枚举值之一'
        break
      }
      case 'format': {
        out = '应当匹配格式' + (e.params.format)
        break
      }
      case 'formatExclusiveMaximum': {
        out = 'formatExclusiveMaximum 应当是布尔值'
        break
      }
      case 'formatExclusiveMinimum': {
        out = 'formatExclusiveMinimum 应当是布尔值'
        break
      }
      case 'formatMaximum': {
        out = ''
        let cond = e.params.comparison + ' ' + e.params.limit
        out += '应当是 ' + (cond)
        break
      }
      case 'formatMinimum': {
        out = ''
        let cond = e.params.comparison + ' ' + e.params.limit
        out += '应当是 ' + (cond)
        break
      }
      case 'maxItems': {
        out = ''
        let n = e.params.limit
        out += '不应多于 ' + (n) + ' 个项'
        break
      }
      case 'maxLength': {
        out = ''
        let n = e.params.limit
        out += '不应多于 ' + (n) + ' 个字符'
        break
      }
      case 'maxProperties': {
        out = ''
        let n = e.params.limit
        out += '不应有多于 ' + (n) + ' 个属性'
        break
      }
      case 'maximum': {
        out = ''
        let cond = e.params.comparison + ' ' + e.params.limit
        out += '应当为 ' + (cond)
        break
      }
      case 'minItems': {
        out = ''
        let n = e.params.limit
        out += '不应少于 ' + (n) + ' 个项'
        break
      }
      case 'minLength': {
        out = ''
        let n = e.params.limit
        out += '不应少于 ' + (n) + ' 个字符'
        break
      }
      case 'minProperties': {
        out = ''
        let n = e.params.limit
        out += '不应有少于 ' + (n) + ' 个属性'
        break
      }
      case 'minimum': {
        out = ''
        let cond = e.params.comparison + ' ' + e.params.limit
        out += '应当为 ' + (cond)
        break
      }
      case 'multipleOf': {
        out = '应当是 ' + (e.params.multipleOf) + ' 的整数倍'
        break
      }
      case 'not': {
        out = '不应当匹配 "not" schema'
        break
      }
      case 'oneOf': {
        out = '只能匹配一个 oneOf 中的 schema'
        break
      }
      case 'pattern': {
        out = '应当匹配模式 "' + (e.params.pattern) + '"'
        break
      }
      case 'patternGroups': {
        out = ''
        let n = e.params.limit
        out += '应当有 ' + (n) + ' 个 ' + (e.params.reason) + ' 属性满足模式 ' + (e.params.pattern)
        break
      }
      case 'patternRequired': {
        out = '应当有属性匹配模式 ' + (e.params.missingPattern)
        break
      }
      case 'required': {
        const pname = e.params.missingProperty
        out = ((e.schema[pname] && e.schema[pname].title) || pname) + '不能为空'
        break
      }
      case 'switch': {
        out = '由于 ' + (e.params.caseIndex) + ' 失败，未通过 "switch" 校验, '
        break
      }
      case 'type': {
        out = '应当是 ' + (e.params.type) + ' 类型'
        break
      }
      case 'uniqueItems': {
        out = '不应当含有重复项 (第 ' + (e.params.j) + ' 项与第 ' + (e.params.i) + ' 项是重复的)'
        break
      }
      default:
        continue
    }
    e.message = out
  }
}
