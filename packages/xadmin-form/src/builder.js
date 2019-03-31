import React from 'react'
import { Field, reduxForm, reducer as formReducer } from 'redux-form'
import { app, StoreWrap } from 'xadmin'
import { C } from 'xadmin-ui'

const FieldWrapComponent = ({ fieldComponent: FieldComponent, group: FieldGroup, ...props }) => {
  return (
    <FieldGroup {...props} >
      <FieldComponent {...props} group={FieldGroup} />
    </FieldGroup>
  )
}

const defaultUIRender = (fields, option) => {
  return fields.map(field => fieldBuilder(field, option))
}

const objectBuilder = (fields, render, option) => {
  const fields_defined = app.get('form_fields')
  const fields_wraped = fields
    .filter(field => field.type === undefined || fields_defined[field.type] !== undefined)
    .map(field => { return { ...fields_defined[field.type || 'text'], ...field, option } })

  return (render || defaultUIRender)(fields_wraped, option)
}

const fieldBuilder = (field, option, ...props) => {
  const FieldComponent = field.component
  const FieldGroup = field.group || (option && option.group ? option.group : C('Form.FieldGroup'))
  
  return (<Field key={field.key} name={field.name} label={field.label} 
    normalize={field.normalize} parse={field.parse} format={field.format}
    component={FieldWrapComponent} field={field} option={option} group={FieldGroup} fieldComponent={FieldComponent}
    {...props} />)
}

const prefixFieldKey = (field, prefix) => {
  const f = { ...field, key: prefix + field.key, name: prefix + field.name }
  if(field.fields && field.fields.length > 0) {
    f.fields = field.fields.map(cf => prefixFieldKey(cf, prefix))
  }
  return f
}

export {
  defaultUIRender,
  objectBuilder,
  fieldBuilder,
  prefixFieldKey
}
