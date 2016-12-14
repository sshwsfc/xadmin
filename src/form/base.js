import React from 'react'
import { Field, reduxForm, reducer as formReducer } from 'redux-form'
import Ajv from 'ajv'
import { StoreWrap } from '../index'
import { convert as schemaConvert } from './schema'
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
        } else if(err.dataPath == '' && err.keyword == 'required') {
          prev[err.params.missingProperty] = err.message
        }
        return prev
      }, {})
      return errors
    }
  })(BaseForm)
  return <WrapForm fields={fields} {...props}/>
}

const FormWrap = StoreWrap({
  contextTypes: {
    _reduxForm: React.PropTypes.object.isRequired
  },
  getState: (context) => {
    const { store, _reduxForm } = context
    return { form: _reduxForm, formState: _reduxForm.getFormState(store.getState()) }
  }
})

export default {
  BaseForm,
  Form,
  SchemaForm,
  FormWrap,
  fieldBuilder,
  objectBuilder,
  schemaConvert
}
