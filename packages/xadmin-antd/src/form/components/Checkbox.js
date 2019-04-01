import React from 'react'
import { Checkbox } from 'antd'

const CheckboxComponent = ({ input, label, field, meta, group: FieldGroup }) => {
  return (
    <FieldGroup label={null} meta={meta} input={input} field={field}>
      <Checkbox checked={!!input.value} {...input} {...field.attrs} >{label}</Checkbox>
    </FieldGroup>
  )
}
CheckboxComponent.withGroup = true
export default CheckboxComponent
