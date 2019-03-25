import React from 'react'
import { FormControl, Checkbox } from 'react-bootstrap'

export default ({ input, label, field }) => {
  return <Checkbox checked={!!input.value} {...input} {...field.attrs} >{label}</Checkbox>
}
