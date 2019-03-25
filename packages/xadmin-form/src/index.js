import React from 'react'
import { reducer as formReducer, SubmissionError, reduxForm, FieldArray } from 'redux-form'
import Ajv from 'ajv'
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
  name: 'xadmin-form',
  items: {
    form_fields: { type: 'map' },
    schema_converter: { type: 'array' },
    form_reducer: { type: 'map' },
    array_render: { type: 'map' },
    ajv_key: { type: 'array' },
    ajv_format: { type: 'array' }
  },
  start: (app) => () => {
    app.get('ajv_key').forEach(args => {
      ajv.addKeyword(args[0], args[1])
    })
    app.get('ajv_format').forEach(args => {
      ajv.addFormat(args[0], args[1])
    })
  },
  reducers: (app) => {
    const plugins = app.get('form_reducer')
    return { form: formReducer.plugin(plugins) }
  },
  schema_converter: converters
}

export default app
export {
  BaseForm,
  Form,
  SchemaForm,
  FormWrap,
  reduxForm,
  fieldBuilder,
  objectBuilder,
  schemaConvert,
  SubmissionError,
  FieldArray
}
