import React, { useState, useEffect } from 'react'
import { StoreWrap, app, config, use } from 'xadmin'
import { Form as RForm, useForm as rUseForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { C } from 'xadmin-ui'
import { fieldBuilder, objectBuilder } from './builder'

import Ajv from 'ajv'
import _ from 'lodash'
import ajvLocalize from './locales'
import { convert as schemaConvert } from './schema'

const datetimeRegex = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/
const ajv = new Ajv({ allErrors: true, verbose: true, formats: { datetime: datetimeRegex, 'date-time': datetimeRegex } })

const BaseForm = (props) => {
  const { effect, fields, render, option, component, children, handleSubmit, ...formProps } = props
  const { form } = use('newform')

  const build_fields = objectBuilder(fields, render, { form, ...option, ...formProps })

  useEffect(() => effect && effect(form), [ form ])

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
  const { validate, effect, fields, render, option, component, wrapProps, onChange, onSubmit=()=>{}, ...formProps } = props
  const formConfig = config('form-config')

  const mutators = { 
    setFieldData: ([ name, data ], state) => {
      const field = state.fields[name]
      if (field) {
        field.data = { ...field.data, ...data }
      }
    }
  }

  const formEffect = (onChange != undefined && typeof onChange === 'function') ? (form => {
    form.useEffect(({ values, modified }) => {
      _.some(Object.values(modified)) && onChange(values)
    }, [ 'values', 'modified' ])
    effect && effect(form)
  }) : effect

  return (<RForm validate={(values) => {
    let errors = validate ? validate(values) : {}
    return errors
    // return validateByFields(errors, values, fields)
  }} 
  mutators={{
    ...arrayMutators,
    ...mutators
  }}
  onSubmit={onSubmit}
  subscription={{ submitting: true, pristine: true, invalid: true }}
  {...formConfig} {...formProps} {...wrapProps}>
    {props => <BaseForm {...props} effect={formEffect} fields={fields} render={render} option={option} component={component} />}
  </RForm>)
}

const SchemaForm = (props) => {
  const { schema } = props

  if(!_.isPlainObject(schema)) {
    return null
  }

  const ajValidate = ajv.compile(schema)
  const { fields } = schemaConvert(schema)
  
  const validate = (values) => {
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
    //errors = validateByFields(errors, values, fields)
    return errors
  }

  return <Form validate={validate} fields={fields} effect={schema.formEffect} {...props} />
}

const useForm = (props, select) => {
  const form = rUseForm()

  form.useField = (name, subscriber, effects=[ 'value' ]) => {
    form.registerField(name, subscriber, effects && effects.reduce((prev, ef) => {
      prev[ef] = true; return prev
    }, {}))
  }

  form.setFieldData = form.mutators.setFieldData

  form.useEffect = (subscriber, effects=[ 'values' ]) => {
    form.subscribe(subscriber, effects && effects.reduce((prev, ef) => {
      prev[ef] = true; return prev
    }, {}))
  }

  const formState = form.getState()

  const values = select ? select(formState) : {}

  return { ...props, ...values, form, getFormState: form.getState, formState }
}

export {
  BaseForm,
  Form,
  SchemaForm,
  useForm,
  fieldBuilder,
  objectBuilder,
  schemaConvert
}
