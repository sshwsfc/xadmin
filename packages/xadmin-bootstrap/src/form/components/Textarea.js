import React from 'react'
import { Form } from 'react-bootstrap'

export default ({ input, label, meta, field }) => {
  return (
    <Form.Control as="textarea" {...input} {...field.attrs} isInvalid={meta.touched && meta.error} placeholder={label} />
  )
}
