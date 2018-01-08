import React from 'react'
import { Field } from 'redux-form'
import { Radio } from 'react-bootstrap'

export default ({ input, label, meta, field, group: FieldGroup }) => {
  const inline = field.attrs !== undefined && !!field.attrs.inline
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      {field.titleMap.map(option => { return (<Radio key={option.value} checked={option.value==input.value} inline={inline} {...input} value={option.value}> {option.name}</Radio>) })}
    </FieldGroup>
  )
}
