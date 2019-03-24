import React from 'react'
import moment from 'moment'
import Icon from 'react-fontawesome'
import { FormControl, InputGroup } from 'react-bootstrap'
import DateTimeField from 'react-datetime'
require('react-datetime/css/react-datetime.css')

export default ({ input, label, meta, field, group: FieldGroup }) => {
  const { onChange, onBlur, onFocus, value, ...inputProps } = input
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <DateTimeField 
        closeOnSelect={true}
        onChange={onChange} 
        {...field.attrs} 
        value={moment(value)} 
        renderInput={(props, openCalendar, closeCalendar) => (
          <InputGroup style={{ maxWidth: 220 }}>
            <FormControl {...props} {...inputProps} autoComplete="off" onFocus={openCalendar} />
            <InputGroup.Append>
              <InputGroup.Text onClick={openCalendar}><Icon name="calendar"/></InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        )}
      />
    </FieldGroup>
  )
}
