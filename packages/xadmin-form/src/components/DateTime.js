import React from 'react'
import { Field } from 'redux-form'
import moment from 'moment'
import { Icon } from '../../components'
import { FormControl, InputGroup } from 'react-bootstrap'
import DateTimeField from 'react-datetime'
require('react-datetime/css/react-datetime.css')

export default ({ input, label, meta, field, group: FieldGroup }) => {
  const { onChange, onBlur, onFocus, value, ...inputProps } = input
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <InputGroup style={{ maxWidth: 280 }}>
        <DateTimeField inputProps={inputProps} onChange={onChange} onBlur={onBlur} onFocus={onFocus} {...field.attrs} value={moment(value)} />
        <InputGroup.Addon><Icon name="calendar"/></InputGroup.Addon>
      </InputGroup>
    </FieldGroup>
  )
}
