import React from 'react'
import { FormControl } from 'react-bootstrap'

export default ({ input, label, meta, field, group: FieldGroup }) => {
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <FormControl {...input} {...field.attrs} isInvalid={meta.touched && meta.error} placeholder={label} />
    </FieldGroup>
  )
}
