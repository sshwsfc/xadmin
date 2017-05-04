import React from 'react'
import { Field, reduxForm, reducer as formReducer } from 'redux-form'
import { app, StoreWrap } from '../index'
import { FieldGroup } from './components/base'

const defaultUIRender = (fields, option) => {
  return fields.map(field => fieldBuilder(field, option))
}

const objectBuilder = (fields, render, option) => {
  const fields_defined = app.load_dict('form_fields')
  const fields_wraped = fields
    .filter(field => field.type === undefined || fields_defined[field.type] !== undefined)
    .map(field => { return { ...fields_defined[field.type || 'text'], ...field, option } })

  return (render || defaultUIRender)(fields_wraped, option)
}

const fieldBuilder = (field, option, ...props) => {
  return (<Field key={field.key} name={field.name} label={field.label} 
    normalize={field.normalize} parse={field.parse} format={field.format}
    component={field.component} field={field} 
    group={field.group || (option && option.group ? option.group : FieldGroup)} 
    option={option}
    {...props} />)
}

export default {
  defaultUIRender,
  objectBuilder,
  fieldBuilder
}
