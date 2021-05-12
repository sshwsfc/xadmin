import React, { useState, useEffect } from 'react'
import { StoreWrap, app, config, use } from 'xadmin'
import { Form as RForm, useForm as rUseForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { C } from 'xadmin-ui'
import { fieldBuilder, objectBuilder, prefixFieldKey } from './builder'

import Ajv from 'ajv'
import _ from 'lodash'
import ajvLocalize from './locales'
import { convert as schemaConvert } from './schema'

const datetimeRegex = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/
const ajv = new Ajv({ allErrors: true, verbose: true, nullable: true, formats: { datetime: datetimeRegex } })

const BaseForm = (props) => {
  const { effect, fields, render, option, component, children, handleSubmit, errors, ...formProps } = props
  const { form } = use('form')
  const invalid = !(_.isNil(errors) || _.isEmpty(errors))

  const build_fields = objectBuilder(fields, render, { form, ...option, invalid, ...formProps })

  useEffect(() => effect && effect(form), [ form ])

  if(component) {
    const FormComponent = component
    return <FormComponent {...props} invalid={invalid} >{build_fields}</FormComponent>
  } else if(children) {
    return children({ ...props, invalid, children: build_fields })
  } else {
    const FormComponent = C('Form.Layout')
    return <FormComponent {...props} invalid={invalid} >{build_fields}</FormComponent>
  }
}

const isPromise = obj =>
  !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function'

const Form = (props) => {
  const { formKey, validate, effect, fields, render, option, component, children, wrapProps, 
    onChange, onSubmitSuccess, onSubmit, data, ...formProps } = props
  const formConfig = config('form-config')

  const mutators = { 
    setFieldData: ([ name, data ], state) => {
      const field = state.fields[name]
      if (field) {
        field.data = { ...field.data, ...data }
      }
    }
  }

  const formEffect = form => {
    if(onChange != undefined && typeof onChange === 'function') {
      form.useEffect(({ values }) => {
        const { dirty, modified } = form.getState()
        if(dirty || _.some(Object.values(modified))) {
          onChange(values)
        }
      }, [ 'values' ])
    }

    if(onSubmitSuccess != undefined && typeof onSubmitSuccess === 'function') {
      form.useEffect(({ submitSucceeded }) => {
        submitSucceeded && onSubmitSuccess(form.submitReturnValue || form.getState().values, form)
      }, [ 'submitSucceeded' ])
    }

    form.data = data
    effect && effect(form)
  }

  const onSubmitHandler = React.useCallback((values, form, callback) => {
    const result = onSubmit(values, form, callback)

    if (result && isPromise(result)) {
      return new Promise(( resolve, reject) => { 
        result.then(retValue => {
          form.submitReturnValue = retValue
          resolve()
        }).catch(err => {
          resolve(err)
        })
      })
    } else if(onSubmit.length < 3) {
      callback(result)
    }
  }, [ onSubmit ])

  return (<RForm key={formKey} validate={validate} 
  mutators={{
    ...arrayMutators,
    ...mutators
  }}
  onSubmit={onSubmitHandler}
  subscription={{ submitting: true, pristine: true, errors: true, submitErrors: true }}
  {...formConfig} {...formProps} {...wrapProps}>
    {props => <BaseForm {...props} effect={formEffect} fields={fields} render={render} option={option} component={component} children={children} />}
  </RForm>)
}

const omitNull = value => {
  if(_.isPlainObject(value)) {
    Object.keys(value).forEach(k => {
      let ret = omitNull(value[k])
      if(ret == null) {
        delete value[k]
      } else {
        value[k] = ret
      }
    })
  } else if(_.isArray(value)) {
    value.forEach(omitNull)
  }
  return value
}

const SchemaForm = (props) => {
  const { schema } = props

  if(!_.isPlainObject(schema)) {
    return null
  }

  const ajValidate = ajv.compile(schema)
  const { fields } = schemaConvert(schema)
  
  const validate = (values) => {
    const valid = ajValidate(omitNull(values))

    if(!valid) {
      const { i18n } = app.context
      if(i18n && ajvLocalize[i18n.language]) {
        ajvLocalize[i18n.language](ajValidate.errors)
      } else {
        ajvLocalize['en'](ajValidate.errors)
      }
    }
    let errors = valid ? {} : ajValidate.errors.reduce((prev, err) => {
      let p = err.dataPath
      if(err.keyword == 'required' && err.params.missingProperty) {
        if(err.params.missingProperty.indexOf('-') >= 0) {
          p += `['${err.params.missingProperty}']`
        } else {
          p += '.' + err.params.missingProperty
        }
      }
      if(p.startsWith('.')) p = p.substr(1)
      _.set(prev, p, err.message)
      return prev
    }, {})
    return errors
  }

  return <Form validate={validate} fields={fields} effect={schema.formEffect} {...props} />
}

const useForm = (props, select) => {
  const form = rUseForm()
  const formState = form.getState()
  const [ values, setValues ] = React.useState(select ? select(formState) : {})

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

  React.useEffect(() => {
    if(select) {
      form.subscribe(state => {
        setValues(select(state))
      }, { values: true })
    }
  }, [])

  return { ...props, ...values, form, getFormState: form.getState, formState }
}

export {
  BaseForm,
  Form,
  SchemaForm,
  useForm,
  fieldBuilder,
  objectBuilder,
  prefixFieldKey,
  schemaConvert
}
