import _ from 'lodash'
import { schemaConvert } from '../form'

const stripNullType = (type) => {
  if(Array.isArray(type) && type.length == 2) {
    if (type[0] === 'null')
      return type[1]
    if (type[1] === 'null')
      return type[0]
  }
  return type
}

const enumToTitleMap = (enm) => {
  let titleMap = []
  enm.forEach(name => {
    titleMap.push({ name: name, value: name })
  })
  return titleMap
}

const canonicalTitleMap = (titleMap, originalEnum) => {
  if(!_.isArray(titleMap)) {
    let canonical = []
    if (originalEnum) {
      originalEnum.forEach(value => {
        canonical.push({ name: titleMap[value], value: value })
      })
    } else {
      for(let k in titleMap) {
        if (titleMap.hasOwnProperty(k)) {
          canonical.push({ name: k, value: titleMap[k] })
        }
      }
    }
    return canonical
  }
  return titleMap
}

export default [
  // all form field
  (f, schema, options) => {
    f.name = schema.name || options.key
    f.label = schema.title || f.name

    if (schema.description) { f.description = schema.description }
    if (schema.maxLength) { f.maxlength = schema.maxLength }
    if (schema.minLength) { f.minlength = schema.minLength }
    if (schema.minimum) { f.minimum = schema.minimum + (schema.exclusiveMinimum ? 1 : 0) }
    if (schema.maximum) { f.maximum = schema.maximum - (schema.exclusiveMaximum ? 1 : 0) }

    if (schema.validationMessage) { f.validationMessage = schema.validationMessage }
    if (schema.enumNames) { f.titleMap = canonicalTitleMap(schema.enumNames, schema['enum']) }

    f.schema = schema

    return f
  },
  (f, schema, options) => {
    if(f.type !== undefined) {
      return f
    }
    const schema_type = stripNullType(schema.type)
    if(stripNullType(schema_type) === 'object') {
      f.type = 'relate_select'
    } else if(stripNullType(schema_type) === 'array') {
      f.type = 'mutli_select'
    } else if(schema_type === 'string') {
      if(!schema['enum']) {
        f.type = 'filter_text'
      } else {
        f.type = 'filter_enum'
        if (!f.titleMap) {
          f.titleMap = enumToTitleMap(schema['enum'])
        }
      }
      switch(schema.format) {
        case 'date':
          f.type = 'filter_date'
          break
        case 'time':
          f.type = 'filter_date'
          break
        case 'datetime':
          f.type = 'filter_date'
          break
      }
    } else if(schema_type === 'number') {
      f.type = 'filter_number'
    } else if(schema_type === 'boolean') {
      f.type = 'filter_bool'
    }
    return f
  }
]
