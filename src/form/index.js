import React from 'react'
import { Field, reduxForm, reducer as formReducer } from 'redux-form'
import Ajv from 'ajv'
import { app, StoreWrap } from '../index'
import default_fields from './fields'
import { convert as schemaConvert, converters } from './schema'
import { objectBuilder, fieldBuilder } from './builder'

const ajv = new Ajv({ allErrors: true })

const BaseForm = (props) => {
  const { fields, render, option, component } = props
  const build_fields = objectBuilder(fields, render, option)
  if(component) {
    const FormComponent = component
    return <FormComponent {...props} >{build_fields}</FormComponent>
  } else {
    return (
      <form className="form-horizontal">{build_fields}</form>
    )
  }
}

const Form = (props) => {
  const { formKey, validate } = props
  const WrapForm = reduxForm({ 
    form: formKey,
    validate
  })(BaseForm)
  return <WrapForm {...props}/>
}

const SchemaForm = (props) => {
  const { formKey, schema } = props
  const ajValidate = ajv.compile(schema)
  const fields = schemaConvert(schema).fields
  
  const WrapForm = reduxForm({ 
    form: formKey,
    validate: (values) => {
      const valid = ajValidate(values)
      let errors = valid ? {} : ajValidate.errors.reduce((prev, err) => {
        if(err.dataPath.length > 1) {
          prev[err.dataPath.substr(1)] = err.message
        }
        return prev
      }, {})
      return errors
    }
  })(BaseForm)
  return <WrapForm fields={fields} {...props}/>
}

export default {
  BaseForm,
  Form,
  SchemaForm,
  fieldBuilder,
  objectBuilder,
  schemaConvert,

  app: {
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
}
