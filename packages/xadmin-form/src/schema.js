import _ from 'lodash'
import { app } from 'xadmin'

const stripNullType = (type) => {
  if(Array.isArray(type) && type.length == 2) {
    if (type[0] === 'null')
      return type[1]
    if (type[1] === 'null')
      return type[0]
  }
  return type
}

const enumToTitleMap = (enm, title) => {
  let titleMap = []
  enm.forEach((name, index) => {
    titleMap.push({ name: 
      title != undefined ? (( _.isArray(title) ? title[index] : title[name] )  || name) : name, value: name })
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

const convert = (schema, options) => {
  const opts = options || {}
  if(opts.path === undefined) {
    opts.path = []
  }
  if(opts.lookup === undefined) {
    opts.lookup = {}
  }
  return app.get('schema_converter').reduce((prve, converter) => {
    return converter(prve, schema, opts)
  }, opts.global && opts.global.formDefaults ? _.cloneDeep(opts.global.formDefaults) : {})
}

const converters = [
  // all form field
  (f, schema, options) => {
    const { path, readonly, required, lookup } = options

    const fieldKey = path.length > 0 ? path[path.length - 1] : undefined
    f.key = path.join('.')

    f.name = f.key
    f.label = schema.title || _.startCase(fieldKey)

    if(fieldKey !== undefined) {
      if (readonly && readonly.indexOf(fieldKey) !== -1) { f.readonly  = true }
      if (required && required.indexOf(fieldKey) !== -1) { f.required  = true }
    }

    if (schema.description) { f.description = schema.description }
    if (schema.maxLength) { f.maxlength = schema.maxLength }
    if (schema.minLength) { f.minlength = schema.minLength }
    if (schema.minimum) { f.minimum = schema.minimum + (schema.exclusiveMinimum ? 1 : 0) }
    if (schema.maximum) { f.maximum = schema.maximum - (schema.exclusiveMaximum ? 1 : 0) }

    if (schema.validationMessage) { f.validationMessage = schema.validationMessage }
    if (schema.enumNames) { f.titleMap = canonicalTitleMap(schema.enumNames, schema['enum']) }

    f.schema = schema
    lookup[f.key] = f

    return f
  },
  // object
  (f, schema, options) => {
    if(stripNullType(schema.type) === 'object') {
      f.type = 'fieldset'

      const props = schema.properties
      const opts = { ...options }

      opts.required = schema.required || []
      opts.readonly = schema.readonly || []
      opts.ignore = schema.ignore || []

      let { keys, form } = (schema.form || [ '*' ]).reduce((ret, field) => {
        if(typeof field === 'string') {
          if(field != '*' || ret.keys.indexOf('*') == -1) {
            ret.keys.push(field)
          }
          if(field != '*') {
            ret.form[field] = { key: field }
          }
        } else if( field.key !== undefined) {
          ret.keys.push(field.key)
          ret.form[field.key] = field
        }
        return ret
      }, { keys: [], form: {} })

      const idx = keys.indexOf('*')

      if(idx !== -1) {
        keys = keys.slice(0, idx)
          .concat(Object.keys(props).filter(pk => keys.indexOf(pk) == -1))
          .concat(keys.slice(idx + 1))
      }

      const fields = keys.filter(key => opts.ignore.indexOf(key) === -1).map(key => {
        opts.path = [ ...options.path, key ]
        return props[key] !== undefined ? _.merge(convert(props[key], opts), form[key] || {}) : form[key]
      })

      f.render = schema.form_render
      f.fields = fields
    }
    return f
  },
  // array
  (f, schema, options) => {
    if(stripNullType(schema.type) === 'array') {
      f.type = 'array'

      if(typeof schema.items !== 'undefined') {
        f.items = convert(schema.items, { ...options, path: [] })
      }
      if(schema.itemsRender)
        f.itemsRender = schema.itemsRender
    }
    return f
  },
  // all normal type form field
  (f, schema, options) => {
    if(f.type !== undefined) {
      return f
    }
    const schema_type = stripNullType(schema.type)
    if(schema_type === 'string') {
      if(!schema['enum']) {
        f.type = 'text'
      } else {
        f.type = 'select'
        if (!f.titleMap) {
          f.titleMap = enumToTitleMap(schema['enum'], schema['enum_title'] || {})
        }
      }
      switch(schema.format) {
        case 'date':
          f.type = 'date'
          break
        case 'time':
          f.type = 'time'
          break
        case 'datetime':
          f.type = 'datetime'
          break
      }
    } else if(schema_type === 'number') {
      if(!schema['enum']) {
        f.type = 'number'
      } else {
        f.type = 'numselect'
        if (!f.titleMap) {
          f.titleMap = enumToTitleMap(schema['enum'], schema['enum_title'] || {})
        }
      }
    } else if(schema_type === 'integer') {
      if(!schema['enum']) {
        f.type = 'integer'
      } else {
        f.type = 'numselect'
        if (!f.titleMap) {
          f.titleMap = enumToTitleMap(schema['enum'], schema['enum_title'] || {})
        }
      }
    } else if(schema_type === 'boolean') {
      f.type = 'checkbox'
    }
    return f
  }
]

export {
  convert,
  converters
}
