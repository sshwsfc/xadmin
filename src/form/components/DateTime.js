import React from 'react'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { FormControl } from 'react-bootstrap'
import DateTimeField from 'react-bootstrap-datetimepicker'
require('react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css')

export default ({ input, label, meta: { touched, error }, field }) => {
  const format = field.format || 'YYYY-MM-DD'
  return (
    <FieldGroup
      id={input.name}
      label={label}
      error={touched && error}
      help={field.description || field.help}
      control={{ ...field.attrs }}
      >
      <DateTimeField {...input} {...field.attrs} mode="date" dateTime={input.value || '2016-11-03'} inputFormat={format} format={format} />
    </FieldGroup>
  )
}
