import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Field, reducer as formReducer, reduxForm } from 'redux-form'
import { ReduxFormContext } from 'redux-form/es/ReduxFormContext'
import { StoreWrap, app, config, use } from 'xadmin'
import { C } from 'xadmin-ui'
import { fieldBuilder, objectBuilder } from './builder'

import Ajv from 'ajv'
import _ from 'lodash'
import ajvLocalize from './locales'
import { convert as schemaConvert } from './schema'

const ajv = new Ajv({ allErrors: true, verbose: true })

const BaseForm = (props) => {
  const { fields, render, option, component, children, handleSubmit, ...formProps } = props
  const build_fields = objectBuilder(fields, render, { ...option, ...formProps })
  if(component) {
    const FormComponent = component
    return <FormComponent {...props} >{build_fields}</FormComponent>
  } else if(children) {
    return children({ ...props, children: build_fields })
  } else {
    const FormComponent = C('Form.Layout')
    return <FormComponent {...props} >{build_fields}</FormComponent>
  }
}

const validateByFields = (errors, values, fields) => {
  fields.forEach(field => {
    if(_.isFunction(field.validate)) {
      const name = field.name
      const err = field.validate(_.get(values, field.name) || null, values)
      if(_.isArray(err)) {
        errors[name] = [ ...(errors[name] || []), ...err ]
      } else if(err) {
        errors[name] = [ ...(errors[name] || []), err ]
      }
    }
  })
  return errors
}

const Form = (props) => {
  const { formKey, validate, fields, wrapProps } = props
  const [ WrapForm, setFrom ] = useState(null)

  useEffect(() => {
    const formConfig = config('redux-form-config')
    const WrapForm = reduxForm({ 
      form: formKey,
      ...formConfig,
      ...wrapProps,
      validate: (values) => {
        let errors = validate ? validate(values) : {}
        return validateByFields(errors, values, fields)
      }
    })(BaseForm)
    setFrom(WrapForm)
  }, [ formKey ])

  return WrapForm ? <WrapForm {...props}/> : null
}

const SchemaForm = (props) => {
  const { formKey, schema, wrapProps } = props
  const [ state, setFrom ] = useState({ WrapForm: null, fields: null })

  useEffect(() => {
    const ajValidate = ajv.compile(schema)
    const fields = schemaConvert(schema).fields
    const formConfig = config('redux-form-config')
    const WrapForm = reduxForm({ 
      form: formKey,
      ...formConfig,
      ...wrapProps,
      validate: (values) => {
        const valid = ajValidate(_.omitBy(values, v=> v == null || v === undefined || v === ''))
        if(!valid) {
          const { i18n } = app.context
          if(i18n && ajvLocalize[i18n.language]) {
            ajvLocalize[i18n.language](ajValidate.errors)
          } else {
            ajvLocalize['en'](ajValidate.errors)
          }
        }
        let errors = valid ? {} : ajValidate.errors.reduce((prev, err) => {
          if(err.dataPath.length > 1) {
            prev[err.dataPath.substr(1)] = err.message
          } else if(err.dataPath == '' && err.keyword == 'required') {
            prev[err.params.missingProperty] = err.message
          }
          return prev
        }, {})
        errors = validateByFields(errors, values, fields)
        return errors
      }
    })(BaseForm)
    setFrom({ WrapForm, fields })
  }, [ formKey, schema ])

  const { WrapForm, fields } = state
  return WrapForm && fields ? <WrapForm fields={fields} {...props}/> : null
}

const FormWrap = StoreWrap(Connect => (props) => {
  const { state } = props.wrapContext
  return (
    <ReduxFormContext.Consumer>
      { _reduxForm => <Connect {...props} wrapContext={{ ...props.wrapContext, form: _reduxForm, formState: _reduxForm.getFormState(state) }} /> }
    </ReduxFormContext.Consumer>
  )
})

const useForm = props => {
  const { state } = use('redux')
  const _reduxForm = React.useContext(ReduxFormContext)
  return { ...props, form: _reduxForm, formState: _reduxForm.getFormState(state) }
}

export {
  BaseForm,
  Form,
  SchemaForm,
  useForm,
  FormWrap,
  fieldBuilder,
  objectBuilder,
  schemaConvert
}
