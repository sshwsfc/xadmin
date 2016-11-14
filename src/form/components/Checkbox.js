import React from 'react'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { FormControl, Checkbox } from 'react-bootstrap'

export default ({ input, label, meta: { touched, error }, field }) => {
  return (
    <FieldGroup
      id={input.name}
      label={''}
      error={error}
      help={field.description || field.help}
      control={{ ...field.attrs }}
      >
      <Checkbox checked={!!input.value} {...input} {...field.attrs} >{label}</Checkbox>
    </FieldGroup>
  )
}
