import React from 'react'
import { Form } from 'react-bootstrap'

export default ({ input, label, meta, field, group: FieldGroup }) => {
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <Form.Control as="textarea" {...input} {...field.attrs} isInvalid={meta.touched && meta.error} />
    </FieldGroup>
  )
}
