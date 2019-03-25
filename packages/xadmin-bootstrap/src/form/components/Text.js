import React from 'react'
import { FormControl } from 'react-bootstrap'

export default ({ input, label, meta, field }) => {
  return (
    <FormControl {...input} {...field.attrs} isInvalid={meta.touched && meta.error} placeholder={label} />
  )
}
