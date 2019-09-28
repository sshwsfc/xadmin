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

const ajv = new Ajv({ allErrors: true, verbose: true, formats: { datetime: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/ } })

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
  const { _t } = app.context

  fields.forEach(field => {
    const name = field.name
    const value = _.get(values, name) || null
    const orgErr = _.get(errors, name) || []

    if(_.isFunction(field.validate)) {
      const err = field.validate(value, values)
      if(_.isArray(err)) {
        _.set(errors, name, [ ...orgErr, ...err ])
      } else if(err) {
        _.set(errors, name, [ ...orgErr, err ])
      }
    } else if(field.required == true) {
      if(value == null || value == undefined || value == '') {
        _.set(errors, name, [ ...orgErr, _t('{{label}} is required', { label: field.label || name }) ])
      }
    }

  })
  return errors
}

const Form = (props) => {
  const { formKey, validate, fields, wrapProps } = props

  const WrapForm = React.useMemo(() => {
    const formConfig = config('redux-form-config')
    return reduxForm({ 
      form: formKey,
      ...formConfig,
      ...wrapProps,
      validate: (values) => {
        let errors = validate ? validate(values) : {}
        return validateByFields(errors, values, fields)
      }
    })(BaseForm)
  }, [ formKey ])

  return WrapForm ? <WrapForm {...props}/> : null
}

const SchemaForm = (props) => {
  const { formKey, schema, wrapProps } = props

  const { WrapForm, fields } = React.useMemo(() => {
    if(!_.isPlainObject(schema)) {
      return { WrapForm: null, fields: [] }
    }
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
          const path = [
            err.dataPath.length > 1 ? err.dataPath.substr(1) : '',
            err.keyword == 'required' && err.params.missingProperty
          ].filter(Boolean).join('.')
          _.set(prev, path, err.message)

          return prev
        }, {})
        errors = validateByFields(errors, values, fields)
        return errors
      }
    })(BaseForm)
    return { WrapForm, fields }
  }, [ formKey, schema ])

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

const useForm = (props, select) => {
  const _reduxForm = React.useContext(ReduxFormContext)
  const { dispatch, store, state, ...values } = select ? 
    use('redux', state => select((_reduxForm ? _reduxForm.getFormState(state) : {}) || {})) : use('redux')

  return { ...props, form: _reduxForm, ...values,
    getFormState: React.useCallback(() => (_reduxForm ? _reduxForm.getFormState(store.getState()) : {}) || {}, [ _reduxForm, store ]),
    formState: _reduxForm.getFormState(state) }
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
