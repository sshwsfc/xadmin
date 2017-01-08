import React from 'react'
import { Field } from 'redux-form'
import { Icon } from '../../components'
import { FormControl, InputGroup } from 'react-bootstrap'
import DateTimeField from 'react-datetime'
require('react-datetime/css/react-datetime.css')

export default ({ input, label, meta: { touched, error }, field, group: FieldGroup }) => {
  const { onChange, onBlur, onFocus, ...inputProps } = input
  return (
    <FieldGroup
      label={label}
      error={touched && error}
      input={input} field={field}
      >
      <InputGroup style={{ maxWidth: 250 }}>
        <DateTimeField inputProps={inputProps} onChange={date=>{
          if(date && date.format)
            onChange(date.format(field.attrs.valueFormat || 'L'))
        }} onBlur={date=>{
          if(date && date.format)
            onBlur(date.format(field.attrs.valueFormat || 'L'))
        }} onFocus={onFocus} {...field.attrs} value={input.value} />
        <InputGroup.Addon><Icon name="calendar"/></InputGroup.Addon>
      </InputGroup>
    </FieldGroup>
  )
}
