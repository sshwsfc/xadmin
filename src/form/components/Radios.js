import React from 'react'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { Radio } from 'react-bootstrap'

export default ({ input, label, meta: { touched, error }, field }) => {
  const inline = field.attrs !== undefined && !!field.attrs.inline
  return (
    <FieldGroup
      id={input.name}
      label={label}
      error={error}
      help={field.description || field.help}
      control={{ ...field.attrs }}
      >
      {field.titleMap.map(option => { return (<Radio key={option.value} checked={option.value==input.value} inline={inline} {...input} value={option.value}> {option.name}</Radio>) })}
    </FieldGroup>
  )
}
