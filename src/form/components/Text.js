import React from 'react'
import { Field } from 'redux-form'
import { FieldGroup } from './base'

export default ({ input, label, meta: { touched, error }, field }) => {
  return (
    <FieldGroup
      id={input.name}
      label={label}
      error={touched && error}
      help={field.description || field.help}
      control={{ ...input, ...field.attrs }}
    />
  )
}
