import React from 'react'
import app, { use } from 'xadmin'
import { Field } from 'react-final-form'
import { C } from 'xadmin-ui'

const FieldWrapComponent = ({ fieldComponent: FieldComponent, group: FieldGroup, ...props }) => {
  const { data } = props.meta
  const { effect } = props.field
  const { form } = use('form')

  React.useEffect(() => effect && effect(form, props), [ form ])

  if(data.display === false) {
    return null
  }

  return FieldComponent.useGroup === false ? (
    <FieldComponent {...props} group={FieldGroup} />
  ) : (
    <FieldGroup {...props} >
      <FieldComponent {...props} group={FieldGroup} />
    </FieldGroup>
  )
}

const defaultUIRender = (fields, option) => {
  return fields.map(field => fieldBuilder(field, option))
}

const objectBuilder = (fields, render, option) => {
  const fields_defined = option.fieldsDefined ? { ...app.get('form_fields'), ...option.fieldsDefined } : app.get('form_fields')
  const fields_wraped = fields
    .filter(field => field.type === undefined || fields_defined[field.type] !== undefined)
    .map(field => { return { ...fields_defined[field.type || 'text'], ...field, option } })

  return (render || defaultUIRender)(fields_wraped, option)
}

const fieldBuilder = (field, option, ...props) => {
  if(field.render) {
    return field.render(field, option, fieldBuilder, objectBuilder, ...props)
  } else {
    const { name, component: FieldComponent, group, ...fieldProps } = field
    const FieldGroup = group || (option && option.group ? option.group : C('Form.FieldGroup'))
    return (<Field name={name} {...fieldProps}
      component={FieldWrapComponent} field={field} option={option} group={FieldGroup} fieldComponent={FieldComponent}
      {...props} />)
  }
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
