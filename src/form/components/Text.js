import React from 'react'
import { Field } from 'redux-form'
import { FormControl, InputGroup } from 'react-bootstrap'

export default ({ input, label, meta: { touched, error }, field, group: FieldGroup }) => {
  return (
    <FieldGroup
      label={label}
      error={touched && error}
      input={input} field={field}
    >
      <FormControl {...input} {...field.attrs} />
    </FieldGroup>
  )
}
