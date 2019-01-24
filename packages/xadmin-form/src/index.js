import React from 'react'
import { reducer as formReducer, SubmissionError } from 'redux-form'
import Ajv from 'ajv'
import default_fields from './fields'
import { converters } from './schema'

import {
  BaseForm,
  Form,
  SchemaForm,
  FormWrap,
  fieldBuilder,
  objectBuilder,
  schemaConvert
} from './base'

const ajv = new Ajv({ allErrors: true })
const app = {
  start: (app) => () => {
    app.load_list('ajv_key').forEach(args => {
      ajv.addKeyword(args[0], args[1])
    })
    app.load_list('ajv_format').forEach(args => {
      ajv.addFormat(args[0], args[1])
    })
  },
  reducers: (app) => {
    const plugins = app.load_dict('form_reducer')
    return { form: formReducer.plugin(plugins) }
  },
  form_fields: default_fields,
  schema_converter: converters
}

export default app
export {
  BaseForm,
  Form,
  SchemaForm,
  FormWrap,
  fieldBuilder,
  objectBuilder,
  schemaConvert,
  SubmissionError
}
