import React from 'react'
import Ajv from 'ajv'
import { converters } from './schema'
import { FieldArray } from 'react-final-form-arrays'

import {
  BaseForm,
  Form,
  SchemaForm,
  FormWrap,
  useForm,
  fieldBuilder,
  objectBuilder,
  schemaConvert
} from './base'

//const ajv = new Ajv({ allErrors: true })
const app = {
  name: 'xadmin-newform',
  items: {
    newform_fields: { type: 'map' }
  },
  // items: {
  //   form_fields: { type: 'map' },
  //   schema_converter: { type: 'array' },
  //   form_reducer: { type: 'map' },
  //   array_render: { type: 'map' },
  //   ajv_key: { type: 'array' },
  //   ajv_format: { type: 'array' }
  // },
  // start: (app) => () => {
  //   app.get('ajv_key').forEach(args => {
  //     ajv.addKeyword(args[0], args[1])
  //   })
  //   app.get('ajv_format').forEach(args => {
  //     ajv.addFormat(args[0], args[1])
  //   })
  // },
  hooks: {
    newform: useForm
  },
  // schema_converter: converters
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
  FieldArray
}
